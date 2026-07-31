//! In-process MCP servers — the Rust equivalent of the Python SDK's
//! `create_sdk_mcp_server`.
//!
//! Por que este módulo existe: o CLI aceita servidores MCP declarados como
//! `{"type": "sdk"}` no `--mcp-config`. Para esses, ele não abre subprocesso nem
//! HTTP: ele conversa JSON-RPC com quem o lançou, por `control_request` de
//! subtype `mcp_message`, e espera a resposta no envelope
//! `{"mcp_response": {...}}` (envelope confirmado no bundle do CLI 2.1.220, na
//! função `sendMcpMessage` — não foi adivinhado). Até aqui a crate declarava o
//! tipo `McpServerConfig::Sdk` e o subtype, mas não tinha quem servisse: o
//! `Query::handle_control_request` respondia "Unsupported control request
//! subtype". Este módulo é o servidor, e `Query` passou a rotear para ele.
//!
//! O consumidor declara tools como funções Rust tipadas:
//!
//! ```no_run
//! use rust_agent_sdk::sdk_mcp::{PropertySchema, SdkMcpServer, ToolInputSchema, ToolOutput};
//! use serde::Deserialize;
//!
//! #[derive(Deserialize)]
//! struct Add { a: f64, b: f64 }
//!
//! let config = SdkMcpServer::builder("calc")
//!     .tool(
//!         "add",
//!         "Soma dois números",
//!         ToolInputSchema::object()
//!             .required("a", PropertySchema::number())
//!             .required("b", PropertySchema::number()),
//!         |args: Add| async move { Ok(ToolOutput::text((args.a + args.b).to_string())) },
//!     )
//!     .register();
//! // `config` vai para `ClaudeAgentOptions::mcp_servers`.
//! ```
//!
//! ## Onde mora o registry
//!
//! O roteamento é por **nome**: o CLI manda `server_name` em cada
//! `mcp_message`, e o mesmo nome está no `--mcp-config`. Por isso o registry é
//! indexado por nome. Existem dois níveis:
//!
//! - [`SdkMcpRegistry::global()`] — onde [`SdkMcpServerBuilder::register`]
//!   deposita o servidor. É o que atende o caminho do [`crate::ClaudeSDKClient`].
//! - um registry de instância, que pode ser plugado num `Query` com
//!   `set_sdk_mcp_servers`. É o que o caminho de uma tacada (`query()`) usa,
//!   montado a partir das `ClaudeAgentOptions` da chamada.
//!
//! O registry de instância vence; o global é a rede de segurança. Consequência
//! prática do global: dois servidores **diferentes** com o **mesmo nome** no
//! mesmo processo colidem (o último registrado vence). Como o nome também é o
//! que o CLI usa para rotear e o que prefixa as tools
//! (`mcp__<servidor>__<tool>`), nomes distintos já eram obrigatórios.

use std::collections::HashMap;
use std::fmt;
use std::future::Future;
use std::marker::PhantomData;
use std::pin::Pin;
use std::sync::{Arc, Mutex, OnceLock};

use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::{json, Value};

use crate::types::McpServerConfig;

/// Versão do protocolo MCP usada quando o cliente não anuncia uma no
/// `initialize`.
pub const MCP_PROTOCOL_VERSION: &str = "2025-06-18";

/// Versão default de um servidor que não declara a sua.
const DEFAULT_SERVER_VERSION: &str = "0.1.0";

// Códigos de erro do JSON-RPC 2.0 que este servidor emite.
const JSONRPC_METHOD_NOT_FOUND: i64 = -32601;
const JSONRPC_INVALID_PARAMS: i64 = -32602;

// ---------------------------------------------------------------------------
// Schema de entrada das tools
// ---------------------------------------------------------------------------

/// Tipo de uma propriedade no schema de entrada de uma tool.
#[derive(Debug, Clone, PartialEq)]
pub enum PropertyKind {
    /// `"type": "string"`.
    String,
    /// `"type": "number"`.
    Number,
    /// `"type": "integer"`.
    Integer,
    /// `"type": "boolean"`.
    Boolean,
    /// `"type": "object"`, sem propriedades declaradas.
    Object,
    /// `"type": "array"`, com o schema dos itens.
    Array(Box<PropertySchema>),
}

/// Schema de uma propriedade. Existe para que o consumidor descreva a entrada
/// da tool sem montar `serde_json::Value` na mão.
#[derive(Debug, Clone, PartialEq)]
pub struct PropertySchema {
    kind: PropertyKind,
    description: Option<String>,
    enum_values: Vec<String>,
}

impl PropertySchema {
    fn of(kind: PropertyKind) -> Self {
        Self {
            kind,
            description: None,
            enum_values: Vec::new(),
        }
    }

    /// Propriedade textual.
    pub fn string() -> Self {
        Self::of(PropertyKind::String)
    }

    /// Propriedade numérica (ponto flutuante).
    pub fn number() -> Self {
        Self::of(PropertyKind::Number)
    }

    /// Propriedade inteira.
    pub fn integer() -> Self {
        Self::of(PropertyKind::Integer)
    }

    /// Propriedade booleana.
    pub fn boolean() -> Self {
        Self::of(PropertyKind::Boolean)
    }

    /// Objeto livre.
    pub fn object() -> Self {
        Self::of(PropertyKind::Object)
    }

    /// Lista de itens do schema dado.
    pub fn array(items: PropertySchema) -> Self {
        Self::of(PropertyKind::Array(Box::new(items)))
    }

    /// Descrição lida pelo modelo — é o que faz a tool ser usada certo.
    pub fn description(mut self, description: impl Into<String>) -> Self {
        self.description = Some(description.into());
        self
    }

    /// Restringe os valores aceitos (`enum` do JSON Schema).
    pub fn enum_values<I, S>(mut self, values: I) -> Self
    where
        I: IntoIterator<Item = S>,
        S: Into<String>,
    {
        self.enum_values = values.into_iter().map(Into::into).collect();
        self
    }

    /// Serializa para JSON Schema.
    pub fn to_value(&self) -> Value {
        let mut map = serde_json::Map::new();
        let type_name = match &self.kind {
            PropertyKind::String => "string",
            PropertyKind::Number => "number",
            PropertyKind::Integer => "integer",
            PropertyKind::Boolean => "boolean",
            PropertyKind::Object => "object",
            PropertyKind::Array(_) => "array",
        };
        map.insert("type".to_string(), Value::String(type_name.to_string()));
        if let PropertyKind::Array(items) = &self.kind {
            map.insert("items".to_string(), items.to_value());
        }
        if let Some(description) = &self.description {
            map.insert(
                "description".to_string(),
                Value::String(description.clone()),
            );
        }
        if !self.enum_values.is_empty() {
            map.insert(
                "enum".to_string(),
                Value::Array(
                    self.enum_values
                        .iter()
                        .map(|v| Value::String(v.clone()))
                        .collect(),
                ),
            );
        }
        Value::Object(map)
    }
}

/// Schema de entrada de uma tool: um objeto JSON Schema com propriedades
/// obrigatórias e opcionais, na ordem em que foram declaradas.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct ToolInputSchema {
    // Vec e não HashMap porque a ordem das propriedades é o que o modelo lê;
    // ordem instável faria o prompt mudar entre execuções.
    properties: Vec<(String, PropertySchema)>,
    required: Vec<String>,
    // Escotilha para quem já tem o schema pronto em JSON.
    raw: Option<Value>,
}

impl ToolInputSchema {
    /// Schema de objeto vazio.
    pub fn object() -> Self {
        Self::default()
    }

    /// Adiciona uma propriedade obrigatória.
    pub fn required(mut self, name: impl Into<String>, schema: PropertySchema) -> Self {
        let name = name.into();
        self.required.push(name.clone());
        self.properties.push((name, schema));
        self
    }

    /// Adiciona uma propriedade opcional.
    pub fn optional(mut self, name: impl Into<String>, schema: PropertySchema) -> Self {
        self.properties.push((name.into(), schema));
        self
    }

    /// Usa um JSON Schema já pronto. Escotilha para schemas que os
    /// construtores acima não cobrem (`oneOf`, `$ref`, etc.).
    pub fn raw(schema: Value) -> Self {
        Self {
            raw: Some(schema),
            ..Self::default()
        }
    }

    /// Serializa para JSON Schema.
    pub fn to_value(&self) -> Value {
        if let Some(raw) = &self.raw {
            return raw.clone();
        }
        let mut properties = serde_json::Map::new();
        for (name, schema) in &self.properties {
            properties.insert(name.clone(), schema.to_value());
        }
        let mut map = serde_json::Map::new();
        map.insert("type".to_string(), Value::String("object".to_string()));
        map.insert("properties".to_string(), Value::Object(properties));
        if !self.required.is_empty() {
            map.insert(
                "required".to_string(),
                Value::Array(
                    self.required
                        .iter()
                        .map(|v| Value::String(v.clone()))
                        .collect(),
                ),
            );
        }
        Value::Object(map)
    }
}

// ---------------------------------------------------------------------------
// Saída e erro de uma tool
// ---------------------------------------------------------------------------

/// Um bloco de conteúdo devolvido por uma tool.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ToolContent {
    /// Texto puro — o bloco que o modelo lê.
    Text(String),
}

impl ToolContent {
    fn to_value(&self) -> Value {
        match self {
            ToolContent::Text(text) => json!({ "type": "text", "text": text }),
        }
    }
}

/// Resultado de sucesso de uma tool.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct ToolOutput {
    content: Vec<ToolContent>,
}

impl ToolOutput {
    /// Resultado de um único bloco de texto.
    pub fn text(text: impl Into<String>) -> Self {
        Self {
            content: vec![ToolContent::Text(text.into())],
        }
    }

    /// Resultado com o JSON de `value` serializado como texto — o transporte do
    /// MCP é texto, então dado estruturado vai serializado.
    pub fn json<T: Serialize>(value: &T) -> Result<Self, ToolError> {
        let encoded = serde_json::to_string(value)
            .map_err(|e| ToolError::new(format!("failed to serialize tool output: {e}")))?;
        Ok(Self::text(encoded))
    }

    /// Acrescenta outro bloco de texto.
    pub fn push_text(mut self, text: impl Into<String>) -> Self {
        self.content.push(ToolContent::Text(text.into()));
        self
    }

    /// Blocos devolvidos.
    pub fn content(&self) -> &[ToolContent] {
        &self.content
    }

    fn to_value(&self, is_error: bool) -> Value {
        let content: Vec<Value> = self.content.iter().map(ToolContent::to_value).collect();
        let mut map = serde_json::Map::new();
        map.insert("content".to_string(), Value::Array(content));
        if is_error {
            map.insert("isError".to_string(), Value::Bool(true));
        }
        Value::Object(map)
    }
}

/// Falha de uma tool. Vira `isError: true` no resultado JSON-RPC — erro de
/// domínio da tool, visível para o modelo, não erro de protocolo.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ToolError {
    message: String,
}

impl ToolError {
    /// Cria o erro com a mensagem que o modelo vai ler.
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }

    /// Converte qualquer erro que saiba se imprimir.
    pub fn from_error(error: impl fmt::Display) -> Self {
        Self::new(error.to_string())
    }

    /// A mensagem.
    pub fn message(&self) -> &str {
        &self.message
    }
}

impl fmt::Display for ToolError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for ToolError {}

impl From<String> for ToolError {
    fn from(message: String) -> Self {
        Self::new(message)
    }
}

impl From<&str> for ToolError {
    fn from(message: &str) -> Self {
        Self::new(message)
    }
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

/// Futuro devolvido por uma tool.
pub type ToolFuture<'a> = Pin<Box<dyn Future<Output = Result<ToolOutput, ToolError>> + Send + 'a>>;

/// Uma tool exposta por um servidor in-process.
///
/// A implementação usual vem de [`SdkMcpServerBuilder::tool`], que desserializa
/// os argumentos num tipo do consumidor. Implementar o trait à mão só é preciso
/// para tools que decidem o schema em runtime.
pub trait SdkTool: Send + Sync {
    /// Nome da tool, sem o prefixo `mcp__<servidor>__`.
    fn name(&self) -> &str;

    /// Descrição lida pelo modelo.
    fn description(&self) -> &str;

    /// Schema dos argumentos.
    fn input_schema(&self) -> &ToolInputSchema;

    /// Executa a tool com os argumentos crus vindos do CLI.
    fn call<'a>(&'a self, arguments: Value) -> ToolFuture<'a>;
}

/// Tool tipada: desserializa os argumentos em `A` antes de chamar o handler.
struct TypedTool<A, F> {
    name: String,
    description: String,
    input_schema: ToolInputSchema,
    handler: F,
    // `fn(A)` e não `A` para que a tool seja Send+Sync mesmo quando `A` não é.
    _args: PhantomData<fn(A)>,
}

impl<A, F, Fut> SdkTool for TypedTool<A, F>
where
    A: DeserializeOwned + Send + 'static,
    F: Fn(A) -> Fut + Send + Sync + 'static,
    Fut: Future<Output = Result<ToolOutput, ToolError>> + Send + 'static,
{
    fn name(&self) -> &str {
        &self.name
    }

    fn description(&self) -> &str {
        &self.description
    }

    fn input_schema(&self) -> &ToolInputSchema {
        &self.input_schema
    }

    fn call<'a>(&'a self, arguments: Value) -> ToolFuture<'a> {
        match serde_json::from_value::<A>(arguments) {
            Ok(args) => Box::pin((self.handler)(args)),
            Err(e) => {
                // Argumento inválido é erro de domínio, não de protocolo: o
                // modelo lê a mensagem e tenta de novo com o formato certo.
                let name = self.name.clone();
                Box::pin(async move {
                    Err(ToolError::new(format!(
                        "invalid arguments for tool {name}: {e}"
                    )))
                })
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Servidor
// ---------------------------------------------------------------------------

/// Servidor MCP in-process: um nome, uma versão e as tools em Rust.
pub struct SdkMcpServer {
    name: String,
    version: String,
    tools: Vec<Arc<dyn SdkTool>>,
}

impl fmt::Debug for SdkMcpServer {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("SdkMcpServer")
            .field("name", &self.name)
            .field("version", &self.version)
            .field("tools", &self.tool_names())
            .finish()
    }
}

impl SdkMcpServer {
    /// Começa a construção de um servidor. O nome é a chave de roteamento: o
    /// mesmo que vai no `--mcp-config` e que prefixa as tools.
    pub fn builder(name: impl Into<String>) -> SdkMcpServerBuilder {
        SdkMcpServerBuilder {
            name: name.into(),
            version: DEFAULT_SERVER_VERSION.to_string(),
            tools: Vec::new(),
        }
    }

    /// Nome do servidor.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Versão anunciada no `initialize`.
    pub fn version(&self) -> &str {
        &self.version
    }

    /// Nomes das tools, como declarados.
    pub fn tool_names(&self) -> Vec<String> {
        self.tools.iter().map(|t| t.name().to_string()).collect()
    }

    /// Nomes das tools como o CLI as expõe ao modelo
    /// (`mcp__<servidor>__<tool>`) — é essa a forma que entra em
    /// `ClaudeAgentOptions::allowed_tools`.
    pub fn qualified_tool_names(&self) -> Vec<String> {
        self.tools
            .iter()
            .map(|t| format!("mcp__{}__{}", self.name, t.name()))
            .collect()
    }

    /// A config que declara este servidor para o CLI.
    pub fn config(&self) -> McpServerConfig {
        McpServerConfig::Sdk {
            name: self.name.clone(),
        }
    }

    /// Registra este servidor no registry global do processo e devolve a config
    /// para colocar em `ClaudeAgentOptions::mcp_servers`.
    pub fn register(self) -> McpServerConfig {
        let config = self.config();
        SdkMcpRegistry::global().insert(self);
        config
    }

    /// Serve uma mensagem JSON-RPC do MCP.
    ///
    /// Devolve `None` para notificações (mensagem sem `id`), que por contrato do
    /// JSON-RPC não têm resposta.
    pub async fn handle_message(&self, message: &Value) -> Option<Value> {
        let id = match message.get("id") {
            None | Some(Value::Null) => return None,
            Some(id) => id.clone(),
        };
        let method = message.get("method").and_then(Value::as_str).unwrap_or("");
        let params = message.get("params");

        let outcome = match method {
            "initialize" => {
                let protocol = params
                    .and_then(|p| p.get("protocolVersion"))
                    .and_then(Value::as_str)
                    .unwrap_or(MCP_PROTOCOL_VERSION);
                Ok(json!({
                    "protocolVersion": protocol,
                    "capabilities": { "tools": { "listChanged": false } },
                    "serverInfo": { "name": self.name, "version": self.version },
                }))
            }
            "ping" => Ok(json!({})),
            "tools/list" => {
                let tools: Vec<Value> = self
                    .tools
                    .iter()
                    .map(|t| {
                        json!({
                            "name": t.name(),
                            "description": t.description(),
                            "inputSchema": t.input_schema().to_value(),
                        })
                    })
                    .collect();
                Ok(json!({ "tools": tools }))
            }
            "tools/call" => self.call_tool(params).await,
            other => Err(json!({
                "code": JSONRPC_METHOD_NOT_FOUND,
                "message": format!("method not found: {other}"),
            })),
        };

        Some(match outcome {
            Ok(result) => json!({ "jsonrpc": "2.0", "id": id, "result": result }),
            Err(error) => json!({ "jsonrpc": "2.0", "id": id, "error": error }),
        })
    }

    async fn call_tool(&self, params: Option<&Value>) -> Result<Value, Value> {
        let name = params
            .and_then(|p| p.get("name"))
            .and_then(Value::as_str)
            .unwrap_or("");
        let arguments = params
            .and_then(|p| p.get("arguments"))
            .cloned()
            .unwrap_or_else(|| json!({}));

        // Tool inexistente é erro de protocolo: o CLI pediu algo que este
        // servidor nunca anunciou em `tools/list`.
        let Some(tool) = self.tools.iter().find(|t| t.name() == name) else {
            return Err(json!({
                "code": JSONRPC_INVALID_PARAMS,
                "message": format!("unknown tool: {name}"),
            }));
        };

        // Falha do handler é resultado com `isError`, não erro de protocolo: é
        // assim que o modelo lê a mensagem e reage.
        Ok(match tool.call(arguments).await {
            Ok(output) => output.to_value(false),
            Err(error) => ToolOutput::text(error.message()).to_value(true),
        })
    }
}

/// Construtor de [`SdkMcpServer`].
pub struct SdkMcpServerBuilder {
    name: String,
    version: String,
    tools: Vec<Arc<dyn SdkTool>>,
}

impl SdkMcpServerBuilder {
    /// Versão anunciada no `initialize`.
    pub fn version(mut self, version: impl Into<String>) -> Self {
        self.version = version.into();
        self
    }

    /// Declara uma tool cujo handler recebe os argumentos já desserializados em
    /// `A`. Argumento que não bate com `A` vira erro de tool (o modelo lê e
    /// corrige), nunca pânico.
    pub fn tool<A, F, Fut>(
        mut self,
        name: impl Into<String>,
        description: impl Into<String>,
        input_schema: ToolInputSchema,
        handler: F,
    ) -> Self
    where
        A: DeserializeOwned + Send + 'static,
        F: Fn(A) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = Result<ToolOutput, ToolError>> + Send + 'static,
    {
        self.tools.push(Arc::new(TypedTool {
            name: name.into(),
            description: description.into(),
            input_schema,
            handler,
            _args: PhantomData,
        }));
        self
    }

    /// Declara uma tool que implementa [`SdkTool`] à mão.
    pub fn custom_tool(mut self, tool: impl SdkTool + 'static) -> Self {
        self.tools.push(Arc::new(tool));
        self
    }

    /// Fecha a construção sem registrar.
    pub fn build(self) -> SdkMcpServer {
        SdkMcpServer {
            name: self.name,
            version: self.version,
            tools: self.tools,
        }
    }

    /// Fecha a construção, registra o servidor no registry global e devolve a
    /// config para colocar em `ClaudeAgentOptions::mcp_servers`.
    pub fn register(self) -> McpServerConfig {
        self.build().register()
    }
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/// Mapa de servidores in-process indexado pelo nome que o CLI usa para rotear.
///
/// É barato de clonar: o conteúdo é compartilhado.
#[derive(Clone, Default)]
pub struct SdkMcpRegistry {
    servers: Arc<Mutex<HashMap<String, Arc<SdkMcpServer>>>>,
}

impl fmt::Debug for SdkMcpRegistry {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("SdkMcpRegistry")
            .field("servers", &self.names())
            .finish()
    }
}

impl SdkMcpRegistry {
    /// Registry vazio.
    pub fn new() -> Self {
        Self::default()
    }

    /// O registry do processo — onde [`SdkMcpServerBuilder::register`] deposita.
    pub fn global() -> &'static SdkMcpRegistry {
        static GLOBAL: OnceLock<SdkMcpRegistry> = OnceLock::new();
        GLOBAL.get_or_init(SdkMcpRegistry::new)
    }

    /// Registra (ou substitui) o servidor de mesmo nome e devolve o handle.
    pub fn insert(&self, server: SdkMcpServer) -> Arc<SdkMcpServer> {
        let server = Arc::new(server);
        if let Ok(mut servers) = self.servers.lock() {
            servers.insert(server.name.clone(), Arc::clone(&server));
        }
        server
    }

    /// Busca um servidor pelo nome.
    pub fn get(&self, name: &str) -> Option<Arc<SdkMcpServer>> {
        self.servers.lock().ok()?.get(name).cloned()
    }

    /// Remove um servidor pelo nome.
    pub fn remove(&self, name: &str) -> Option<Arc<SdkMcpServer>> {
        self.servers.lock().ok()?.remove(name)
    }

    /// Nomes registrados, em ordem estável.
    pub fn names(&self) -> Vec<String> {
        let Ok(servers) = self.servers.lock() else {
            return Vec::new();
        };
        let mut names: Vec<String> = servers.keys().cloned().collect();
        names.sort();
        names
    }

    /// Se não há nenhum servidor registrado.
    pub fn is_empty(&self) -> bool {
        self.servers.lock().map(|s| s.is_empty()).unwrap_or(true)
    }
}

impl SdkMcpRegistry {
    /// Monta um registry de instância com os servidores globais nomeados pelas
    /// entradas `{"type": "sdk"}` das opções.
    ///
    /// Serve o caminho de uma tacada (`query()`), que conhece as opções na hora
    /// de construir o `Query` e assim não depende do registry global em runtime.
    pub fn for_options(options: &crate::types::ClaudeAgentOptions) -> SdkMcpRegistry {
        let registry = SdkMcpRegistry::new();
        let crate::types::McpServersConfig::Dict(servers) = &options.mcp_servers else {
            return registry;
        };
        for (key, config) in servers {
            let McpServerConfig::Sdk { name } = config else {
                continue;
            };
            // O CLI roteia pelo nome declarado; a chave do dicionário é apenas
            // como o consumidor organizou o mapa. Aceitamos as duas formas.
            for candidate in [name.as_str(), key.as_str()] {
                if let Some(server) = SdkMcpRegistry::global().get(candidate) {
                    registry.insert_arc(candidate.to_string(), server);
                }
            }
        }
        registry
    }

    fn insert_arc(&self, name: String, server: Arc<SdkMcpServer>) {
        if let Ok(mut servers) = self.servers.lock() {
            servers.insert(name, server);
        }
    }
}
