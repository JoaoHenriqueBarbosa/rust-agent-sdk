//! Servidores MCP in-process (`McpServerConfig::Sdk`) servidos pelo próprio
//! `Query`.
//!
//! O transporte aqui é roteirizado: ele entrega as mesmas `control_request` de
//! subtype `mcp_message` que o CLI real manda, e guarda o que o `Query`
//! escreveu de volta. Cada teste checa o envelope exato — é ele o contrato com
//! o CLI, não a nossa vontade.

use std::collections::VecDeque;
use std::sync::{Arc, Mutex};

use rust_agent_sdk::internal::query::Query;
use rust_agent_sdk::internal::transport::Transport;
use rust_agent_sdk::sdk_mcp::{
    PropertySchema, SdkMcpRegistry, SdkMcpServer, ToolError, ToolInputSchema, ToolOutput,
};
use rust_agent_sdk::types::McpServerConfig;
use serde::Deserialize;
use serde_json::{json, Value};

// ---------------------------------------------------------------------------
// Transporte roteirizado
// ---------------------------------------------------------------------------

struct ScriptedTransport {
    inbound: VecDeque<Value>,
    written: Arc<Mutex<Vec<Value>>>,
    connected: bool,
}

impl ScriptedTransport {
    fn new(inbound: Vec<Value>) -> (Self, Arc<Mutex<Vec<Value>>>) {
        let written = Arc::new(Mutex::new(Vec::new()));
        (
            Self {
                inbound: inbound.into(),
                written: Arc::clone(&written),
                connected: true,
            },
            written,
        )
    }
}

#[async_trait::async_trait]
impl Transport for ScriptedTransport {
    async fn connect(&mut self) -> rust_agent_sdk::errors::Result<()> {
        self.connected = true;
        Ok(())
    }

    async fn close(&mut self) -> rust_agent_sdk::errors::Result<()> {
        self.connected = false;
        Ok(())
    }

    async fn write(&mut self, data: &str) -> rust_agent_sdk::errors::Result<()> {
        let parsed: Value = serde_json::from_str(data.trim()).expect("o SDK escreve JSON válido");
        self.written.lock().unwrap().push(parsed);
        Ok(())
    }

    async fn end_input(&mut self) -> rust_agent_sdk::errors::Result<()> {
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.connected
    }

    async fn read_message(&mut self) -> rust_agent_sdk::errors::Result<Option<Value>> {
        Ok(self.inbound.pop_front())
    }
}

// ---------------------------------------------------------------------------
// Servidor de teste
// ---------------------------------------------------------------------------

#[derive(Deserialize)]
struct AddArgs {
    a: f64,
    b: f64,
}

#[derive(Deserialize)]
struct FailArgs {
    reason: String,
}

/// Servidor com uma tool que soma e uma que sempre falha.
fn test_server(name: &str) -> SdkMcpServer {
    SdkMcpServer::builder(name)
        .version("9.9.9")
        .tool(
            "add",
            "Soma dois números",
            ToolInputSchema::object()
                .required(
                    "a",
                    PropertySchema::number().description("primeira parcela"),
                )
                .required("b", PropertySchema::number()),
            |args: AddArgs| async move { Ok(ToolOutput::text((args.a + args.b).to_string())) },
        )
        .tool(
            "boom",
            "Falha de propósito",
            ToolInputSchema::object().required("reason", PropertySchema::string()),
            |args: FailArgs| async move {
                Err::<ToolOutput, ToolError>(ToolError::new(format!("falhou: {}", args.reason)))
            },
        )
        .build()
}

/// `control_request` de `mcp_message` como o CLI manda.
fn mcp_request(request_id: &str, server_name: &str, message: Value) -> Value {
    json!({
        "type": "control_request",
        "request_id": request_id,
        "request": {
            "subtype": "mcp_message",
            "server_name": server_name,
            "message": message,
        },
    })
}

/// Roda o `Query` sobre um roteiro e devolve o que ele escreveu no transporte.
async fn drive(server: SdkMcpServer, inbound: Vec<Value>) -> Vec<Value> {
    let mut registry = SdkMcpRegistry::new();
    registry.insert(server);

    let (transport, written) = ScriptedTransport::new(inbound);
    let mut query = Query::new(Box::new(transport), true, 60.0);
    query.set_sdk_mcp_servers(registry);
    query.start().await.expect("start");

    // O roteiro termina em EOF; `next_message` só volta `None` depois de ter
    // tratado tudo que era controle.
    while query
        .next_message()
        .await
        .expect("leitura do roteiro")
        .is_some()
    {}

    let out = written.lock().unwrap().clone();
    out
}

/// Extrai o `mcp_response` de um `control_response` de sucesso.
fn mcp_response(written: &Value) -> &Value {
    written
        .get("response")
        .and_then(|r| r.get("response"))
        .and_then(|r| r.get("mcp_response"))
        .expect("control_response de sucesso carrega mcp_response")
}

// ---------------------------------------------------------------------------
// 1. initialize
// ---------------------------------------------------------------------------

#[tokio::test]
async fn initialize_answers_with_server_info() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_1",
            "calc",
            json!({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": { "protocolVersion": "2025-06-18" },
            }),
        )],
    )
    .await;

    // Contrato: uma resposta, e ela é o control_response do request_id certo.
    assert_eq!(
        written.len(),
        1,
        "uma mcp_message, uma resposta: {written:?}"
    );
    assert_eq!(
        written[0]["type"], "control_response",
        "a resposta a um control_request é um control_response"
    );
    assert_eq!(
        written[0]["response"]["subtype"], "success",
        "initialize atendido é sucesso: {written:?}"
    );
    assert_eq!(
        written[0]["response"]["request_id"], "req_1",
        "a resposta tem de correlacionar com o request_id do pedido"
    );

    // Contrato: o envelope é `{"mcp_response": <jsonrpc>}` — é o que o CLI lê.
    let response = mcp_response(&written[0]);
    assert_eq!(response["jsonrpc"], "2.0", "o corpo é JSON-RPC 2.0");
    assert_eq!(response["id"], 1, "o id do JSON-RPC volta igual");
    assert_eq!(
        response["result"]["serverInfo"],
        json!({ "name": "calc", "version": "9.9.9" }),
        "o servidor se identifica com o nome e a versão declarados"
    );
    assert_eq!(
        response["result"]["protocolVersion"], "2025-06-18",
        "a versão de protocolo pedida pelo cliente é ecoada"
    );
    assert_eq!(
        response["result"]["capabilities"],
        json!({ "tools": { "listChanged": false } }),
        "o servidor anuncia tools, e sem listChanged"
    );
}

// ---------------------------------------------------------------------------
// 2. tools/list
// ---------------------------------------------------------------------------

#[tokio::test]
async fn tools_list_exposes_declared_tools_with_schema() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_2",
            "calc",
            json!({ "jsonrpc": "2.0", "id": 7, "method": "tools/list" }),
        )],
    )
    .await;

    let tools = mcp_response(&written[0])["result"]["tools"]
        .as_array()
        .expect("tools/list devolve uma lista")
        .clone();

    // Contrato: a lista é exatamente o que foi declarado, na ordem declarada,
    // com o JSON Schema montado pelo `ToolInputSchema`.
    assert_eq!(
        tools,
        vec![
            json!({
                "name": "add",
                "description": "Soma dois números",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "a": { "type": "number", "description": "primeira parcela" },
                        "b": { "type": "number" },
                    },
                    "required": ["a", "b"],
                },
            }),
            json!({
                "name": "boom",
                "description": "Falha de propósito",
                "inputSchema": {
                    "type": "object",
                    "properties": { "reason": { "type": "string" } },
                    "required": ["reason"],
                },
            }),
        ],
        "tools/list é o espelho fiel das tools declaradas"
    );
}

// ---------------------------------------------------------------------------
// 3. tools/call com argumentos
// ---------------------------------------------------------------------------

#[tokio::test]
async fn tools_call_runs_the_handler_with_typed_arguments() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_3",
            "calc",
            json!({
                "jsonrpc": "2.0",
                "id": 12,
                "method": "tools/call",
                "params": { "name": "add", "arguments": { "a": 2.5, "b": 4 } },
            }),
        )],
    )
    .await;

    let result = &mcp_response(&written[0])["result"];

    // Contrato: o handler recebeu os argumentos desserializados e o resultado
    // volta como bloco de texto, sem marca de erro.
    assert_eq!(
        result,
        &json!({ "content": [{ "type": "text", "text": "6.5" }] }),
        "resultado de sucesso é conteúdo de texto sem isError"
    );
}

#[tokio::test]
async fn tools_call_with_invalid_arguments_is_a_tool_error_not_a_panic() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_4",
            "calc",
            json!({
                "jsonrpc": "2.0",
                "id": 13,
                "method": "tools/call",
                "params": { "name": "add", "arguments": { "a": "não é número" } },
            }),
        )],
    )
    .await;

    let result = &mcp_response(&written[0])["result"];

    // Contrato: argumento fora do tipo declarado não derruba o processo — vira
    // resultado de erro que o modelo lê e pode corrigir.
    assert_eq!(
        result["isError"], true,
        "argumento inválido é erro de tool: {result:?}"
    );
    let text = result["content"][0]["text"]
        .as_str()
        .expect("o erro vem como texto");
    assert!(
        text.starts_with("invalid arguments for tool add:"),
        "a mensagem tem de dizer qual tool e por quê: {text}"
    );
}

// ---------------------------------------------------------------------------
// 4. tool inexistente
// ---------------------------------------------------------------------------

#[tokio::test]
async fn calling_an_unknown_tool_is_a_jsonrpc_error() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_5",
            "calc",
            json!({
                "jsonrpc": "2.0",
                "id": 20,
                "method": "tools/call",
                "params": { "name": "nope", "arguments": {} },
            }),
        )],
    )
    .await;

    let response = mcp_response(&written[0]);

    // Contrato: pedir tool que o servidor nunca anunciou é erro de protocolo
    // (-32602, params inválidos), não resultado de tool.
    assert_eq!(
        response["error"],
        json!({ "code": -32602, "message": "unknown tool: nope" }),
        "tool inexistente vira erro JSON-RPC: {response:?}"
    );
    assert!(
        response.get("result").is_none(),
        "erro e resultado são mutuamente exclusivos no JSON-RPC: {response:?}"
    );
    // E ainda assim o control_request foi respondido com sucesso: o erro é do
    // JSON-RPC de dentro, não do canal de controle.
    assert_eq!(
        written[0]["response"]["subtype"], "success",
        "o canal de controle não é o que falhou"
    );
}

// ---------------------------------------------------------------------------
// 5. erro devolvido pelo handler
// ---------------------------------------------------------------------------

#[tokio::test]
async fn handler_error_becomes_an_error_result_not_a_panic() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_6",
            "calc",
            json!({
                "jsonrpc": "2.0",
                "id": 21,
                "method": "tools/call",
                "params": { "name": "boom", "arguments": { "reason": "disco cheio" } },
            }),
        )],
    )
    .await;

    let response = mcp_response(&written[0]);

    // Contrato: `Err` do handler é resultado com `isError`, com a mensagem
    // preservada — o modelo precisa lê-la para decidir o que fazer.
    assert_eq!(
        response["result"],
        json!({
            "content": [{ "type": "text", "text": "falhou: disco cheio" }],
            "isError": true,
        }),
        "falha da tool é resultado marcado, não erro de protocolo: {response:?}"
    );
}

// ---------------------------------------------------------------------------
// 6. servidor desconhecido
// ---------------------------------------------------------------------------

#[tokio::test]
async fn message_for_an_unregistered_server_answers_with_control_error() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_7",
            "fantasma",
            json!({ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }),
        )],
    )
    .await;

    // Contrato: sem servidor com esse nome, o control_request é respondido com
    // erro — e é respondido, porque silêncio pendura o CLI.
    assert_eq!(
        written[0]["response"]["subtype"], "error",
        "servidor inexistente é erro do canal de controle: {written:?}"
    );
    assert_eq!(
        written[0]["response"]["error"], "No SDK MCP server found: fantasma",
        "a mensagem tem de nomear o servidor que faltou"
    );
    assert_eq!(
        written[0]["response"]["request_id"], "req_7",
        "até o erro correlaciona com o pedido"
    );
}

// ---------------------------------------------------------------------------
// 7. notificação (JSON-RPC sem id)
// ---------------------------------------------------------------------------

#[tokio::test]
async fn notification_still_gets_a_control_response() {
    let written = drive(
        test_server("calc"),
        vec![mcp_request(
            "req_8",
            "calc",
            json!({ "jsonrpc": "2.0", "method": "notifications/initialized" }),
        )],
    )
    .await;

    // Contrato: notificação não tem resposta JSON-RPC, mas o control_request
    // tem — sem isso o CLI espera para sempre.
    assert_eq!(
        written[0]["response"]["subtype"], "success",
        "notificação é atendida: {written:?}"
    );
    assert_eq!(
        mcp_response(&written[0])["result"],
        json!({}),
        "o corpo devolvido para notificação é vazio"
    );
}

// ---------------------------------------------------------------------------
// 8. várias mensagens numa sessão, intercaladas com mensagens de sessão
// ---------------------------------------------------------------------------

#[tokio::test]
async fn mcp_traffic_does_not_disturb_session_messages() {
    let mut registry = SdkMcpRegistry::new();
    registry.insert(test_server("calc"));

    let (transport, written) = ScriptedTransport::new(vec![
        mcp_request(
            "req_9",
            "calc",
            json!({ "jsonrpc": "2.0", "id": 1, "method": "initialize" }),
        ),
        json!({ "type": "system", "subtype": "init", "session_id": "s1" }),
        mcp_request(
            "req_10",
            "calc",
            json!({
                "jsonrpc": "2.0",
                "id": 2,
                "method": "tools/call",
                "params": { "name": "add", "arguments": { "a": 1, "b": 1 } },
            }),
        ),
        json!({ "type": "result", "subtype": "success", "session_id": "s1" }),
    ]);

    let mut query = Query::new(Box::new(transport), true, 60.0);
    query.set_sdk_mcp_servers(registry);
    query.start().await.expect("start");

    let mut session_messages = Vec::new();
    while let Some(message) = query.next_message().await.expect("leitura do roteiro") {
        session_messages.push(message);
    }

    // Contrato: o consumidor vê só as mensagens de sessão; o tráfego de MCP é
    // atendido por baixo e não aparece no fluxo.
    let types: Vec<&str> = session_messages
        .iter()
        .map(|m| m["type"].as_str().unwrap_or(""))
        .collect();
    assert_eq!(
        types,
        vec!["system", "result"],
        "control_request não pode vazar para o consumidor: {session_messages:?}"
    );

    // Contrato: as duas mcp_message foram respondidas, na ordem.
    let written = written.lock().unwrap().clone();
    let ids: Vec<&str> = written
        .iter()
        .filter_map(|w| w["response"]["request_id"].as_str())
        .collect();
    assert_eq!(
        ids,
        vec!["req_9", "req_10"],
        "cada mcp_message recebe sua resposta: {written:?}"
    );
    assert_eq!(
        mcp_response(&written[1])["result"]["content"][0]["text"],
        "2",
        "a segunda chamada rodou o handler de verdade"
    );
}

// ---------------------------------------------------------------------------
// 9. declarar o servidor nas opções: config para o CLI + handle para o runtime
// ---------------------------------------------------------------------------

#[tokio::test]
async fn declaring_a_server_yields_the_config_and_keeps_the_handle_in_the_options() {
    let server = SdkMcpServer::builder("declared_case")
        .tool(
            "add",
            "Soma",
            ToolInputSchema::object()
                .required("a", PropertySchema::number())
                .required("b", PropertySchema::number()),
            |args: AddArgs| async move { Ok(ToolOutput::text((args.a + args.b).to_string())) },
        )
        .build();

    let mut options = rust_agent_sdk::types::ClaudeAgentOptions::default();
    let config = options.add_sdk_mcp_server(server);

    // Contrato: o que sai de `add_sdk_mcp_server` é a declaração `sdk` que o
    // transporte serializa em `--mcp-config`.
    assert_eq!(
        config,
        McpServerConfig::Sdk {
            name: "declared_case".to_string()
        },
        "add_sdk_mcp_server devolve a declaração `sdk` com o nome do servidor"
    );

    // Contrato: a mesma chamada põe a declaração em `mcp_servers`, keyed pelo
    // nome — que é o `server_name` que o CLI vai mandar de volta.
    let rust_agent_sdk::types::McpServersConfig::Dict(ref declared) = options.mcp_servers else {
        panic!("mcp_servers precisa continuar sendo um dicionário");
    };
    assert_eq!(
        declared.get("declared_case"),
        Some(&config),
        "a declaração entra no dicionário sob o nome do servidor"
    );

    // Contrato: o HANDLE ficou nas opções. É ele, e não o nome, que atende.
    let handle = options
        .sdk_mcp_servers
        .get("declared_case")
        .expect("as opções guardam o servidor, não só o nome");
    assert_eq!(
        handle.qualified_tool_names(),
        vec!["mcp__declared_case__add".to_string()],
        "o CLI expõe a tool como mcp__<servidor>__<tool>"
    );

    // Contrato: um `Query` SEM registry não serve a tool, mesmo com um servidor
    // de mesmo nome vivo no processo (o `options` acima). Não há depósito global
    // para cair; servidor não declarado é erro.
    let (transport, written) = ScriptedTransport::new(vec![mcp_request(
        "req_11",
        "declared_case",
        json!({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": { "name": "add", "arguments": { "a": 20, "b": 22 } },
        }),
    )]);
    let mut query = Query::new(Box::new(transport), true, 60.0);
    query.start().await.expect("start");
    while query.next_message().await.expect("leitura").is_some() {}

    let written = written.lock().unwrap().clone();
    let response = written[0]
        .get("response")
        .expect("o control_request tem de ser respondido de algum jeito");
    assert_eq!(
        response.get("subtype").and_then(|s| s.as_str()),
        Some("error"),
        "sem registry da sessão a resposta é erro, não a tool: {written:?}"
    );

    // Contrato: o mesmo `Query`, agora com o registry das opções, serve.
    let (transport, written) = ScriptedTransport::new(vec![mcp_request(
        "req_12",
        "declared_case",
        json!({
            "jsonrpc": "2.0",
            "id": 4,
            "method": "tools/call",
            "params": { "name": "add", "arguments": { "a": 20, "b": 22 } },
        }),
    )]);
    let mut query = Query::new(Box::new(transport), true, 60.0);
    query.set_sdk_mcp_servers(options.sdk_mcp_servers.clone());
    query.start().await.expect("start");
    while query.next_message().await.expect("leitura").is_some() {}

    let written = written.lock().unwrap().clone();
    assert_eq!(
        mcp_response(&written[0])["result"]["content"][0]["text"],
        "42",
        "declarado nas opções, o servidor atende: {written:?}"
    );
}

// ---------------------------------------------------------------------------
// 10. o registry da sessão é exatamente o que as opções declararam
// ---------------------------------------------------------------------------

#[tokio::test]
async fn the_options_registry_holds_only_what_was_declared_by_handle() {
    let declared = SdkMcpServer::builder("options_case_declared")
        .tool(
            "add",
            "Soma",
            ToolInputSchema::object()
                .required("a", PropertySchema::number())
                .required("b", PropertySchema::number()),
            |args: AddArgs| async move { Ok(ToolOutput::text((args.a + args.b).to_string())) },
        )
        .build();

    let mut options =
        rust_agent_sdk::types::ClaudeAgentOptions::default().with_sdk_mcp_server(declared);

    // Entradas escritas na mão no dicionário: um `sdk` sem handle e um stdio.
    // Nenhuma das duas pode virar servidor servível — declarar o NOME nunca
    // bastou, e agora o tipo diz isso.
    let rust_agent_sdk::types::McpServersConfig::Dict(ref mut servers) = options.mcp_servers else {
        panic!("mcp_servers precisa continuar sendo um dicionário");
    };
    servers.insert(
        "options_case_missing".to_string(),
        McpServerConfig::Sdk {
            name: "options_case_missing".to_string(),
        },
    );
    servers.insert(
        "externo".to_string(),
        McpServerConfig::Stdio {
            command: "/bin/false".to_string(),
            args: None,
            env: None,
        },
    );

    // Contrato: o registry da sessão tem só o servidor cujo handle foi entregue.
    assert_eq!(
        options.sdk_mcp_servers.names(),
        vec!["options_case_declared".to_string()],
        "o registry da sessão é o conjunto dos handles, não das strings do --mcp-config"
    );
    assert!(
        options
            .sdk_mcp_servers
            .get("options_case_missing")
            .is_none(),
        "declarar o nome sem entregar o handle não produz servidor"
    );

    // Contrato: o que entrou é o servidor de verdade, com suas tools.
    let server = options
        .sdk_mcp_servers
        .get("options_case_declared")
        .expect("o servidor declarado tem de estar no registry");
    assert_eq!(
        server.tool_names(),
        vec!["add".to_string()],
        "o registry carrega o servidor com as tools, não só o nome"
    );
}

// ---------------------------------------------------------------------------
// 10b. clonar as opções não faz duas sessões compartilharem um mapa mutável
// ---------------------------------------------------------------------------

#[test]
fn cloning_a_registry_yields_an_independent_map() {
    let mut a = SdkMcpRegistry::new();
    a.insert(test_server("shared"));

    let mut b = a.clone();
    b.insert(test_server("only_in_b"));
    b.remove("shared");

    // Contrato: mexer no clone não mexe no original. Enquanto o registry era
    // `Arc<Mutex<HashMap>>` por dentro, este assert falharia — e era essa
    // partilha invisível que deixava uma sessão alterar o mapa de outra.
    assert_eq!(
        a.names(),
        vec!["shared".to_string()],
        "o registry original não pode enxergar as mudanças do clone"
    );
    assert_eq!(
        b.names(),
        vec!["only_in_b".to_string()],
        "o clone é um mapa próprio"
    );
}

// ---------------------------------------------------------------------------
// 11. schema — a serialização é o contrato lido pelo modelo
// ---------------------------------------------------------------------------

#[test]
fn schema_builder_produces_json_schema() {
    let schema = ToolInputSchema::object()
        .required(
            "mode",
            PropertySchema::string()
                .description("modo de operação")
                .enum_values(["fast", "safe"]),
        )
        .optional("tags", PropertySchema::array(PropertySchema::string()))
        .optional("count", PropertySchema::integer());

    // Contrato: propriedades na ordem declarada, `required` só com as
    // obrigatórias, `enum` e `items` preservados.
    assert_eq!(
        schema.to_value(),
        json!({
            "type": "object",
            "properties": {
                "mode": {
                    "type": "string",
                    "description": "modo de operação",
                    "enum": ["fast", "safe"],
                },
                "tags": { "type": "array", "items": { "type": "string" } },
                "count": { "type": "integer" },
            },
            "required": ["mode"],
        }),
        "o JSON Schema montado tem de ser exatamente este"
    );
}

#[test]
fn raw_schema_is_passed_through_untouched() {
    let raw = json!({ "type": "object", "oneOf": [{ "required": ["a"] }] });

    // Contrato: a escotilha não reescreve nada.
    assert_eq!(
        ToolInputSchema::raw(raw.clone()).to_value(),
        raw,
        "schema cru vai inteiro para o CLI"
    );
}

#[tokio::test]
async fn tool_output_helpers_build_the_expected_content() {
    #[derive(serde::Serialize)]
    struct Payload {
        ok: bool,
    }

    // Contrato: `json` serializa como texto (o transporte do MCP é texto) e
    // `push_text` acrescenta blocos na ordem.
    let output = ToolOutput::json(&Payload { ok: true }).expect("serialização");
    assert_eq!(
        output.content(),
        &[rust_agent_sdk::sdk_mcp::ToolContent::Text(
            "{\"ok\":true}".to_string()
        )],
        "ToolOutput::json vira um bloco de texto com o JSON"
    );

    let two = ToolOutput::text("um").push_text("dois");
    assert_eq!(
        two.content(),
        &[
            rust_agent_sdk::sdk_mcp::ToolContent::Text("um".to_string()),
            rust_agent_sdk::sdk_mcp::ToolContent::Text("dois".to_string()),
        ],
        "push_text preserva a ordem dos blocos"
    );
}
