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
use tokio::sync::{Mutex, oneshot};

use crate::errors::{ClaudeSDKError, Result};

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
    _child: Arc<Mutex<Child>>,
}

impl StdioTransport {
    /// Spawn a process and set up JSON-RPC communication over stdin/stdout.
    pub async fn spawn(
        command: &str,
        args: &[String],
        env: Option<&HashMap<String, String>>,
    ) -> Result<Self> {
        let mut cmd = Command::new(command);
        cmd.args(args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::null());

        if let Some(env_map) = env {
            for (k, v) in env_map {
                cmd.env(k, v);
            }
        }

        let mut child = cmd.spawn().map_err(|e| {
            ClaudeSDKError::sdk(format!(
                "Failed to spawn MCP server process '{command}': {e}"
            ))
        })?;

        let stdin = child.stdin.take().ok_or_else(|| {
            ClaudeSDKError::sdk("Failed to get stdin of MCP server process")
        })?;

        let stdout = child.stdout.take().ok_or_else(|| {
            ClaudeSDKError::sdk("Failed to get stdout of MCP server process")
        })?;

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
            _child: Arc::new(Mutex::new(child)),
        })
    }

    /// Send a JSON-RPC request and wait for the response.
    pub async fn request(&self, method: &str, params: Option<Value>) -> Result<Value> {
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

        // Write request to stdin
        let json = serde_json::to_string(&req).map_err(|e| {
            ClaudeSDKError::sdk(format!("Failed to serialize JSON-RPC request: {e}"))
        })?;

        {
            let mut stdin = self.stdin.lock().await;
            stdin
                .write_all(json.as_bytes())
                .await
                .map_err(|e| ClaudeSDKError::sdk(format!("Failed to write to MCP stdin: {e}")))?;
            stdin
                .write_all(b"\n")
                .await
                .map_err(|e| ClaudeSDKError::sdk(format!("Failed to write newline: {e}")))?;
            stdin
                .flush()
                .await
                .map_err(|e| ClaudeSDKError::sdk(format!("Failed to flush MCP stdin: {e}")))?;
        }

        // Wait for response with timeout
        let resp = tokio::time::timeout(std::time::Duration::from_secs(120), rx)
            .await
            .map_err(|_| ClaudeSDKError::sdk(format!("MCP request '{method}' timed out")))?
            .map_err(|_| {
                ClaudeSDKError::sdk(format!("MCP server closed before responding to '{method}'"))
            })?;

        if let Some(err) = resp.error {
            return Err(ClaudeSDKError::sdk(format!(
                "MCP error ({}): {}",
                err.code, err.message
            )));
        }

        Ok(resp.result.unwrap_or(Value::Null))
    }

    /// Send a JSON-RPC notification (no response expected).
    pub async fn notify(&self, method: &str, params: Option<Value>) -> Result<()> {
        #[derive(Serialize)]
        struct JsonRpcNotification {
            jsonrpc: &'static str,
            method: String,
            #[serde(skip_serializing_if = "Option::is_none")]
            params: Option<Value>,
        }

        let notif = JsonRpcNotification {
            jsonrpc: "2.0",
            method: method.to_string(),
            params,
        };

        let json = serde_json::to_string(&notif).map_err(|e| {
            ClaudeSDKError::sdk(format!("Failed to serialize notification: {e}"))
        })?;

        let mut stdin = self.stdin.lock().await;
        stdin
            .write_all(json.as_bytes())
            .await
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to write notification: {e}")))?;
        stdin
            .write_all(b"\n")
            .await
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to write newline: {e}")))?;
        stdin
            .flush()
            .await
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to flush: {e}")))?;

        Ok(())
    }
}
