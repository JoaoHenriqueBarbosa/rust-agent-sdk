// Port of MCP stdio transport — JSON-RPC over stdin/stdout of a child process.
// Based on the MCP protocol spec and claude-code-js/services/mcp/client/.

use std::collections::HashMap;
use std::process::Stdio;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::{Child, Command};
use tokio::sync::{oneshot, Mutex};

use crate::mcp::error::McpError;

/// Prazo de uma request pelo stdio, o mesmo que o transporte sempre teve.
const STDIO_REQUEST_TIMEOUT: std::time::Duration = std::time::Duration::from_secs(120);

// ---------------------------------------------------------------------------
// O contrato que os três transportes cumprem
// ---------------------------------------------------------------------------

/// Um canal JSON-RPC com um servidor MCP: stdio, HTTP streamável ou SSE.
///
/// O cliente (`McpClient`) só conhece isto. É o que permite reconectar por
/// baixo de uma sessão expirada sem que quem chama a tool perceba, e é o que
/// deixa o transporte nativo ligar `mcp_servers` externos pelo mesmo caminho
/// dos servidores in-process.
#[async_trait::async_trait]
pub trait McpTransport: Send + Sync {
    /// Manda uma request e espera a resposta com o mesmo id.
    async fn request(&self, method: &str, params: Option<Value>) -> Result<Value, McpError>;

    /// Manda uma notificação, que por contrato não tem resposta.
    async fn notify(&self, method: &str, params: Option<Value>) -> Result<(), McpError>;

    /// Versão negociada no `initialize`: os transportes HTTP a mandam no
    /// cabeçalho `mcp-protocol-version` de toda request seguinte.
    fn set_protocol_version(&self, _version: &str) {}

    /// Linhas `__table_event__` capturadas do stderr (só o stdio tem stderr).
    async fn take_stderr_events(&self) -> Vec<String> {
        Vec::new()
    }

    /// Fecha o canal e libera o que ele segura (processo, stream, sessão).
    async fn close(&self) {}
}

// ---------------------------------------------------------------------------
// JSON-RPC types
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize)]
struct JsonRpcRequest {
    jsonrpc: &'static str,
    id: u64,
    method: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    params: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct JsonRpcResponse {
    #[allow(dead_code)]
    pub jsonrpc: String,
    pub id: Option<Value>,
    pub result: Option<Value>,
    pub error: Option<JsonRpcError>,
}

#[derive(Debug, Deserialize)]
pub struct JsonRpcError {
    pub code: i64,
    pub message: String,
}

// ---------------------------------------------------------------------------
// Stdio transport
// ---------------------------------------------------------------------------

pub struct StdioTransport {
    stdin: Arc<Mutex<tokio::process::ChildStdin>>,
    pending: Arc<Mutex<HashMap<u64, oneshot::Sender<JsonRpcResponse>>>>,
    next_id: AtomicU64,
    child: Arc<Mutex<Child>>,
    stderr_events: Arc<Mutex<Vec<String>>>,
}

impl StdioTransport {
    /// Spawn a process and set up JSON-RPC communication over stdin/stdout.
    pub async fn spawn(
        command: &str,
        args: &[String],
        env: Option<&HashMap<String, String>>,
    ) -> Result<Self, McpError> {
        let mut cmd = Command::new(command);
        cmd.args(args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        if let Some(env_map) = env {
            for (k, v) in env_map {
                cmd.env(k, v);
            }
        }

        let mut child = cmd.spawn().map_err(|e| {
            McpError::Transport(format!(
                "Failed to spawn MCP server process '{command}': {e}"
            ))
        })?;

        let stdin = child.stdin.take().ok_or_else(|| {
            McpError::Transport("Failed to get stdin of MCP server process".to_string())
        })?;

        let stdout = child.stdout.take().ok_or_else(|| {
            McpError::Transport("Failed to get stdout of MCP server process".to_string())
        })?;

        let stderr = child.stderr.take().ok_or_else(|| {
            McpError::Transport("Failed to get stderr of MCP server process".to_string())
        })?;

        let stderr_events: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));

        // Spawn stderr reader task that captures __table_event__ lines
        let stderr_events_clone = stderr_events.clone();
        tokio::spawn(async move {
            let mut reader = BufReader::new(stderr);
            let mut line = String::new();
            loop {
                line.clear();
                match reader.read_line(&mut line).await {
                    Ok(0) => break, // EOF
                    Ok(_) => {}
                    Err(_) => break,
                }
                let trimmed = line.trim();
                if trimmed.contains("__table_event__") {
                    let mut events = stderr_events_clone.lock().await;
                    events.push(trimmed.to_string());
                }
            }
        });

        let pending: Arc<Mutex<HashMap<u64, oneshot::Sender<JsonRpcResponse>>>> =
            Arc::new(Mutex::new(HashMap::new()));

        // Spawn reader task that routes responses to pending waiters
        let pending_clone = pending.clone();
        tokio::spawn(async move {
            let mut reader = BufReader::new(stdout);
            let mut line = String::new();

            loop {
                line.clear();
                match reader.read_line(&mut line).await {
                    Ok(0) => break, // EOF
                    Ok(_) => {}
                    Err(_) => break,
                }

                let trimmed = line.trim();
                if trimmed.is_empty() {
                    continue;
                }

                let resp: JsonRpcResponse = match serde_json::from_str(trimmed) {
                    Ok(r) => r,
                    Err(_) => continue, // Skip non-JSON lines (notifications, etc.)
                };

                // Route to pending waiter
                if let Some(id_val) = &resp.id {
                    if let Some(id) = id_val.as_u64() {
                        let mut pending = pending_clone.lock().await;
                        if let Some(tx) = pending.remove(&id) {
                            let _ = tx.send(resp);
                        }
                    }
                }
            }
        });

        Ok(Self {
            stdin: Arc::new(Mutex::new(stdin)),
            pending,
            next_id: AtomicU64::new(1),
            child: Arc::new(Mutex::new(child)),
            stderr_events,
        })
    }

    /// Drain and return any `__table_event__` lines captured from stderr.
    pub async fn take_stderr_events(&self) -> Vec<String> {
        let mut events = self.stderr_events.lock().await;
        std::mem::take(&mut *events)
    }

    async fn write_line(&self, payload: &impl Serialize) -> Result<(), McpError> {
        let json = serde_json::to_string(payload)
            .map_err(|e| McpError::Transport(format!("Failed to serialize JSON-RPC: {e}")))?;
        let mut stdin = self.stdin.lock().await;
        stdin
            .write_all(json.as_bytes())
            .await
            .map_err(|e| McpError::Transport(format!("Failed to write to MCP stdin: {e}")))?;
        stdin
            .write_all(b"\n")
            .await
            .map_err(|e| McpError::Transport(format!("Failed to write newline: {e}")))?;
        stdin
            .flush()
            .await
            .map_err(|e| McpError::Transport(format!("Failed to flush MCP stdin: {e}")))?;
        Ok(())
    }

    /// Send a JSON-RPC request and wait for the response.
    pub async fn request(&self, method: &str, params: Option<Value>) -> Result<Value, McpError> {
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);

        let req = JsonRpcRequest {
            jsonrpc: "2.0",
            id,
            method: method.to_string(),
            params,
        };

        let (tx, rx) = oneshot::channel();

        {
            let mut pending = self.pending.lock().await;
            pending.insert(id, tx);
        }

        if let Err(error) = self.write_line(&req).await {
            self.pending.lock().await.remove(&id);
            return Err(error);
        }

        // Wait for response with timeout
        let resp = match tokio::time::timeout(STDIO_REQUEST_TIMEOUT, rx).await {
            Ok(Ok(resp)) => resp,
            Ok(Err(_)) => {
                return Err(McpError::Closed(format!(
                    "MCP server closed before responding to '{method}'"
                )))
            }
            Err(_) => {
                self.pending.lock().await.remove(&id);
                return Err(McpError::Timeout {
                    what: format!("MCP request '{method}'"),
                    after: STDIO_REQUEST_TIMEOUT,
                });
            }
        };

        if let Some(err) = resp.error {
            return Err(McpError::Rpc {
                code: err.code,
                message: err.message,
            });
        }

        Ok(resp.result.unwrap_or(Value::Null))
    }

    /// Send a JSON-RPC notification (no response expected).
    pub async fn notify(&self, method: &str, params: Option<Value>) -> Result<(), McpError> {
        #[derive(Serialize)]
        struct JsonRpcNotification {
            jsonrpc: &'static str,
            method: String,
            #[serde(skip_serializing_if = "Option::is_none")]
            params: Option<Value>,
        }

        self.write_line(&JsonRpcNotification {
            jsonrpc: "2.0",
            method: method.to_string(),
            params,
        })
        .await
    }
}

#[async_trait::async_trait]
impl McpTransport for StdioTransport {
    async fn request(&self, method: &str, params: Option<Value>) -> Result<Value, McpError> {
        StdioTransport::request(self, method, params).await
    }

    async fn notify(&self, method: &str, params: Option<Value>) -> Result<(), McpError> {
        StdioTransport::notify(self, method, params).await
    }

    async fn take_stderr_events(&self) -> Vec<String> {
        StdioTransport::take_stderr_events(self).await
    }

    async fn close(&self) {
        let mut child = self.child.lock().await;
        let _ = child.start_kill();
    }
}
