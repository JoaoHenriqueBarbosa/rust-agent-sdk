//! Cliente MCP: conecta pelo transporte que a configuração pede, negocia a
//! versão, lista as ferramentas e as chama.
//!
//! Port de `connectToServer`, `fetchToolsForClient` e `callMCPTool` do CLI,
//! com os mesmos prazos e a mesma reação a sessão expirada:
//! - a conexão inteira (abrir o canal, `initialize`, `initialized`, listar)
//!   tem o prazo de `MCP_TIMEOUT` (30 s por padrão);
//! - cada chamada de ferramenta tem o prazo de `MCP_TOOL_TIMEOUT`, cujo
//!   padrão no CLI é tão alto que na prática não existe;
//! - sessão expirada (404 com `-32001`, ou conexão fechada num transporte
//!   HTTP) reconecta por baixo e repete a chamada UMA vez.
//!
//! A versão pedida é a mais nova que o CLI conhece, e a resposta do servidor
//! precisa estar na lista que ele aceita; fora dela a conexão é recusada, e
//! não rebaixada em silêncio.

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use reqwest::Url;
use serde::Deserialize;
use serde_json::{json, Value};
use tokio::sync::RwLock;

use crate::errors::Result;
use crate::mcp::error::McpError;
use crate::mcp::http::StreamableHttpTransport;
use crate::mcp::sse::SseTransport;
use crate::mcp::tool::McpTool;
use crate::mcp::transport::{McpTransport, StdioTransport};
use crate::tools::framework::Tool;
use crate::types::McpServerConfig;

/// `LATEST_PROTOCOL_VERSION` do SDK que o CLI embute.
pub const LATEST_PROTOCOL_VERSION: &str = "2025-11-25";

/// `SUPPORTED_PROTOCOL_VERSIONS`: o que o cliente aceita de volta.
pub const SUPPORTED_PROTOCOL_VERSIONS: &[&str] = &[
    LATEST_PROTOCOL_VERSION,
    "2025-06-18",
    "2025-03-26",
    "2024-11-05",
    "2024-10-07",
];

/// `getConnectionTimeoutMs`: `MCP_TIMEOUT` em ms, ou 30 s.
const DEFAULT_CONNECT_TIMEOUT_MS: u64 = 30_000;

/// `getMcpToolTimeoutMs`: `MCP_TOOL_TIMEOUT` em ms, ou `DEFAULT_MCP_TOOL_TIMEOUT_MS`.
const DEFAULT_TOOL_TIMEOUT_MS: u64 = 100_000_000;

/// `MCP_REQUEST_TIMEOUT_MS`: o prazo dos cabeçalhos de cada POST.
const REQUEST_TIMEOUT_MS: u64 = 60_000;

/// `MAX_SESSION_RETRIES` de `fetchToolsForClient`.
const MAX_SESSION_RETRIES: u32 = 1;

/// Teto de páginas de `tools/list`, contra um servidor que devolve cursor
/// para sempre.
const MAX_LIST_PAGES: usize = 100;

/// Os prazos do cliente, lidos do ambiente como o CLI lê.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct McpTimeouts {
    /// A conexão inteira, do canal ao `tools/list`.
    pub connect: Duration,
    /// Uma chamada de ferramenta.
    pub tool: Duration,
    /// Os cabeçalhos de resposta de um POST.
    pub request: Duration,
}

impl McpTimeouts {
    pub fn from_env() -> Self {
        Self {
            connect: millis_from_env("MCP_TIMEOUT", DEFAULT_CONNECT_TIMEOUT_MS),
            tool: millis_from_env("MCP_TOOL_TIMEOUT", DEFAULT_TOOL_TIMEOUT_MS),
            request: Duration::from_millis(REQUEST_TIMEOUT_MS),
        }
    }
}

impl Default for McpTimeouts {
    fn default() -> Self {
        Self::from_env()
    }
}

fn millis_from_env(name: &str, default: u64) -> Duration {
    std::env::var(name)
        .ok()
        .and_then(|value| value.trim().parse::<u64>().ok())
        .filter(|millis| *millis > 0)
        .map_or(Duration::from_millis(default), Duration::from_millis)
}

// ---------------------------------------------------------------------------
// Tool definition from tools/list
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Deserialize)]
pub struct McpToolDefinition {
    pub name: String,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(rename = "inputSchema", default)]
    pub input_schema: Value,
    /// `annotations` da spec: é daqui que o CLI tira `readOnlyHint`, e é o
    /// hint que decide se a tool roda em paralelo e se passa em plan mode.
    #[serde(default)]
    pub annotations: Option<Value>,
}

impl McpToolDefinition {
    fn hint(&self, name: &str) -> bool {
        self.annotations
            .as_ref()
            .and_then(|annotations| annotations.get(name))
            .and_then(Value::as_bool)
            .unwrap_or(false)
    }

    /// `readOnlyHint`: a única anotação que muda o comportamento do cliente.
    pub fn is_read_only(&self) -> bool {
        self.hint("readOnlyHint")
    }
}

// ---------------------------------------------------------------------------
// MCP Client
// ---------------------------------------------------------------------------

/// O que o `initialize` devolveu e o cliente guarda.
#[derive(Debug, Clone)]
struct Session {
    protocol_version: String,
    capabilities: Value,
}

/// Client for a single MCP server connection: transport, handshake, tool
/// discovery and calls, with reconnection on an expired session.
pub struct McpClient {
    pub server_name: String,
    config: McpServerConfig,
    timeouts: McpTimeouts,
    transport: RwLock<Arc<dyn McpTransport>>,
    pub tools: Vec<McpToolDefinition>,
    session: Session,
}

impl McpClient {
    /// Conecta com os prazos do ambiente.
    pub async fn connect(server_name: impl Into<String>, config: &McpServerConfig) -> Result<Self> {
        Ok(Self::connect_with(server_name, config, McpTimeouts::from_env()).await?)
    }

    /// Conecta com prazos explícitos, e devolve o erro do MCP inteiro.
    pub async fn connect_with(
        server_name: impl Into<String>,
        config: &McpServerConfig,
        timeouts: McpTimeouts,
    ) -> std::result::Result<Self, McpError> {
        let server_name = server_name.into();
        let connecting = async {
            let transport = open(config, timeouts).await?;
            let session = handshake(transport.as_ref()).await?;
            let tools = list_tools(transport.as_ref(), &session.capabilities).await?;
            Ok::<_, McpError>((transport, session, tools))
        };
        let (transport, session, tools) = tokio::time::timeout(timeouts.connect, connecting)
            .await
            .map_err(|_| McpError::Timeout {
                what: format!("MCP server \"{server_name}\" connection"),
                after: timeouts.connect,
            })??;
        Ok(Self {
            server_name,
            config: config.clone(),
            timeouts,
            transport: RwLock::new(transport),
            tools,
            session,
        })
    }

    /// `clearServerCache` + `connectToServer`: um canal novo por baixo, com o
    /// handshake refeito; as ferramentas já listadas continuam valendo.
    pub async fn reconnect(&self) -> std::result::Result<(), McpError> {
        let config = self.config.clone();
        let timeouts = self.timeouts;
        let reconnecting = async {
            let transport = open(&config, timeouts).await?;
            handshake(transport.as_ref()).await?;
            Ok::<_, McpError>(transport)
        };
        let fresh = tokio::time::timeout(timeouts.connect, reconnecting)
            .await
            .map_err(|_| McpError::Timeout {
                what: format!("MCP server \"{}\" reconnection", self.server_name),
                after: timeouts.connect,
            })??;
        let stale = std::mem::replace(&mut *self.transport.write().await, fresh);
        stale.close().await;
        Ok(())
    }

    /// Call a tool on this MCP server.
    ///
    /// Port of: callMCPTool, com a repetição única em sessão expirada de
    /// `fetchToolsForClient`.
    pub async fn call_tool(&self, tool_name: &str, arguments: Value) -> Result<Value> {
        let mut attempt = 0;
        loop {
            match self.call_once(tool_name, &arguments).await {
                Ok(result) => return Ok(result),
                Err(error) if error.is_session_expired() && attempt < MAX_SESSION_RETRIES => {
                    attempt += 1;
                    self.reconnect().await?;
                }
                Err(error) => return Err(error.into()),
            }
        }
    }

    async fn call_once(
        &self,
        tool_name: &str,
        arguments: &Value,
    ) -> std::result::Result<Value, McpError> {
        let transport = Arc::clone(&*self.transport.read().await);
        let call = transport.request(
            "tools/call",
            Some(json!({"name": tool_name, "arguments": arguments})),
        );
        let result = tokio::time::timeout(self.timeouts.tool, call)
            .await
            .map_err(|_| McpError::Timeout {
                what: format!("MCP server \"{}\" tool \"{tool_name}\"", self.server_name),
                after: self.timeouts.tool,
            })??;

        // Port: check for isError in result
        if result
            .get("isError")
            .and_then(Value::as_bool)
            .unwrap_or(false)
        {
            let error_text = result
                .get("content")
                .and_then(Value::as_array)
                .and_then(|items| items.first())
                .and_then(|item| item.get("text"))
                .and_then(Value::as_str)
                .unwrap_or("Unknown MCP tool error");
            return Err(McpError::ToolFailed(format!(
                "MCP tool '{tool_name}' error: {error_text}"
            )));
        }

        Ok(result)
    }

    /// Drain and return any `__table_event__` lines captured from stderr.
    pub async fn take_stderr_events(&self) -> Vec<String> {
        self.transport.read().await.take_stderr_events().await
    }

    /// As capacidades que o servidor anunciou no `initialize`.
    pub fn capabilities(&self) -> &Value {
        &self.session.capabilities
    }

    /// A versão negociada.
    pub fn protocol_version(&self) -> &str {
        &self.session.protocol_version
    }

    pub fn config(&self) -> &McpServerConfig {
        &self.config
    }

    /// Fecha o canal e o que ele segura.
    pub async fn close(&self) {
        self.transport.read().await.close().await;
    }

    /// Convert discovered MCP tools into `Arc<dyn Tool>` instances that can be
    /// registered in the SDK's ToolRegistry.
    ///
    /// Tool names are prefixed as `mcp__{server}__{tool}` to match the TS
    /// naming convention (getMcpPrefix from services/mcp/mcpStringUtils.js).
    pub fn into_sdk_tools(self: Arc<Self>) -> Vec<Arc<dyn Tool>> {
        self.tools
            .iter()
            .map(|definition| {
                Arc::new(McpTool::new(
                    &self.server_name,
                    definition,
                    Arc::clone(&self),
                )) as Arc<dyn Tool>
            })
            .collect()
    }
}

/// O canal que a configuração pede.
async fn open(
    config: &McpServerConfig,
    timeouts: McpTimeouts,
) -> std::result::Result<Arc<dyn McpTransport>, McpError> {
    match config {
        McpServerConfig::Stdio { command, args, env } => {
            let args = args.clone().unwrap_or_default();
            Ok(Arc::new(
                StdioTransport::spawn(command, &args, env.as_ref()).await?,
            ))
        }
        McpServerConfig::Http { url, headers } => Ok(Arc::new(StreamableHttpTransport::new(
            parsed(url)?,
            header_map(headers.as_ref())?,
            timeouts.request,
        )?)),
        McpServerConfig::Sse { url, headers } => Ok(Arc::new(
            SseTransport::connect(parsed(url)?, header_map(headers.as_ref())?, timeouts.request)
                .await?,
        )),
        McpServerConfig::Sdk { name } => Err(McpError::Transport(format!(
            "SDK server \"{name}\" is served in-process, not by a client"
        ))),
        McpServerConfig::ClaudeAIProxy { .. } => Err(McpError::Transport(
            "claude.ai proxy servers need the claude.ai OAuth session, which this crate does not hold"
                .to_string(),
        )),
    }
}

/// `Client.connect` do SDK que o CLI embute: `initialize`, conferência da
/// versão, `initialized`.
async fn handshake(transport: &dyn McpTransport) -> std::result::Result<Session, McpError> {
    let result = transport
        .request(
            "initialize",
            Some(json!({
                "protocolVersion": LATEST_PROTOCOL_VERSION,
                "capabilities": {},
                "clientInfo": {
                    "name": env!("CARGO_PKG_NAME"),
                    "version": env!("CARGO_PKG_VERSION")
                }
            })),
        )
        .await?;
    let protocol_version = result
        .get("protocolVersion")
        .and_then(Value::as_str)
        .ok_or_else(|| {
            McpError::Transport(format!("Server sent invalid initialize result: {result}"))
        })?
        .to_string();
    if !SUPPORTED_PROTOCOL_VERSIONS.contains(&protocol_version.as_str()) {
        return Err(McpError::Transport(format!(
            "Server's protocol version is not supported: {protocol_version}"
        )));
    }
    transport.set_protocol_version(&protocol_version);
    transport.notify("notifications/initialized", None).await?;
    Ok(Session {
        protocol_version,
        capabilities: result
            .get("capabilities")
            .cloned()
            .unwrap_or_else(|| json!({})),
    })
}

/// `fetchToolsForClient`: nada sem a capacidade `tools`; com ela, todas as
/// páginas.
async fn list_tools(
    transport: &dyn McpTransport,
    capabilities: &Value,
) -> std::result::Result<Vec<McpToolDefinition>, McpError> {
    if capabilities.get("tools").is_none() {
        return Ok(Vec::new());
    }
    let mut tools = Vec::new();
    let mut cursor: Option<String> = None;
    for _ in 0..MAX_LIST_PAGES {
        let params = cursor.as_ref().map(|cursor| json!({"cursor": cursor}));
        let page = transport.request("tools/list", params).await?;
        if let Some(listed) = page.get("tools").and_then(Value::as_array) {
            tools.extend(
                listed.iter().filter_map(|tool| {
                    serde_json::from_value::<McpToolDefinition>(tool.clone()).ok()
                }),
            );
        }
        cursor = page
            .get("nextCursor")
            .and_then(Value::as_str)
            .map(str::to_string);
        if cursor.is_none() {
            break;
        }
    }
    Ok(tools)
}

fn parsed(url: &str) -> std::result::Result<Url, McpError> {
    Url::parse(url)
        .map_err(|error| McpError::Transport(format!("invalid MCP url '{url}': {error}")))
}

fn header_map(
    headers: Option<&HashMap<String, String>>,
) -> std::result::Result<HeaderMap, McpError> {
    let mut map = HeaderMap::new();
    for (name, value) in headers.into_iter().flatten() {
        let name = HeaderName::from_bytes(name.as_bytes()).map_err(|error| {
            McpError::Transport(format!("invalid header name '{name}': {error}"))
        })?;
        let value = HeaderValue::from_str(value).map_err(|error| {
            McpError::Transport(format!("invalid value for header {name}: {error}"))
        })?;
        map.insert(name, value);
    }
    Ok(map)
}

// ---------------------------------------------------------------------------
// Multi-server connection helper
// ---------------------------------------------------------------------------

/// O resultado de conectar um conjunto de servidores: os clientes vivos, as
/// ferramentas deles já embrulhadas, e um status por servidor no formato que
/// o `mcp_status` do CLI devolve.
#[derive(Default)]
pub struct Connected {
    pub clients: Vec<Arc<McpClient>>,
    pub tools: Vec<Arc<dyn Tool>>,
    pub status: Vec<Value>,
}

/// Connect to every server in `configs` and return all tools as
/// `Arc<dyn Tool>`. Port of: getMcpToolsCommandsAndResources + setup flow.
///
/// Servidores `sdk` são pulados: eles são servidos in-process pelo registry
/// da sessão, não por um cliente. Falha de um servidor não derruba os
/// outros; ela vira uma entrada `failed` no status, com o motivo.
pub async fn connect_mcp_servers(configs: &HashMap<String, McpServerConfig>) -> Connected {
    let mut names: Vec<&String> = configs
        .keys()
        .filter(|name| !matches!(configs.get(*name), Some(McpServerConfig::Sdk { .. })))
        .collect();
    names.sort();
    let attempts = names.iter().map(|name| async move {
        let config = &configs[*name];
        (
            name.to_string(),
            McpClient::connect(name.to_string(), config).await,
        )
    });
    let mut connected = Connected::default();
    for (name, outcome) in futures::future::join_all(attempts).await {
        match outcome {
            Ok(client) => {
                let client = Arc::new(client);
                let listed: Vec<Value> = client
                    .tools
                    .iter()
                    .map(|tool| {
                        json!({
                            "name": tool.name,
                            "description": tool.description.clone().unwrap_or_default(),
                            "inputSchema": tool.input_schema,
                        })
                    })
                    .collect();
                connected.status.push(json!({
                    "name": name,
                    "status": "connected",
                    "scope": "user",
                    "protocolVersion": client.protocol_version(),
                    "tools": listed,
                }));
                connected.tools.extend(Arc::clone(&client).into_sdk_tools());
                connected.clients.push(client);
            }
            Err(error) => {
                connected.status.push(json!({
                    "name": name,
                    "status": "failed",
                    "scope": "user",
                    "error": error.to_string(),
                }));
            }
        }
    }
    connected
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_read_only_hint_is_read_from_the_annotations() {
        let plain = McpToolDefinition {
            name: "x".to_string(),
            description: None,
            input_schema: json!({"type": "object"}),
            annotations: None,
        };
        assert!(!plain.is_read_only());
        let read_only = McpToolDefinition {
            annotations: Some(json!({"readOnlyHint": true})),
            ..plain.clone()
        };
        assert!(read_only.is_read_only());
    }

    #[test]
    fn the_supported_versions_include_the_latest_and_the_legacy_sse_one() {
        assert!(SUPPORTED_PROTOCOL_VERSIONS.contains(&LATEST_PROTOCOL_VERSION));
        assert!(SUPPORTED_PROTOCOL_VERSIONS.contains(&"2024-11-05"));
        assert!(!SUPPORTED_PROTOCOL_VERSIONS.contains(&"1999-01-01"));
    }

    #[test]
    fn a_header_map_refuses_what_the_wire_would_refuse() {
        let mut headers = HashMap::new();
        headers.insert("Authorization".to_string(), "Bearer x".to_string());
        assert_eq!(header_map(Some(&headers)).map(|map| map.len()), Ok(1));
        let mut broken = HashMap::new();
        broken.insert("Bad Name".to_string(), "x".to_string());
        assert!(header_map(Some(&broken)).is_err());
        let mut control = HashMap::new();
        control.insert("X-Ok".to_string(), "a\r\nb".to_string());
        assert!(header_map(Some(&control)).is_err());
        assert_eq!(header_map(None).map(|map| map.len()), Ok(0));
    }

    #[tokio::test]
    async fn an_sdk_server_is_never_opened_as_a_client() {
        let config = McpServerConfig::Sdk {
            name: "in-process".to_string(),
        };
        let refused = open(&config, McpTimeouts::from_env()).await;
        assert!(
            matches!(refused, Err(McpError::Transport(reason)) if reason.contains("in-process"))
        );
    }
}
