//! Paridade do transcript do transporte nativo com o do CLI: o caminho do
//! JSONL, as entradas campo a campo e em ordem, a entrega das mensagens de
//! assistente por bloco, o espelhamento (`transcript_mirror`) e o resume de
//! transcripts gravados pelo CLI (o real, de `tests/fixtures/transcripts`, e
//! um montado a partir do `loadTranscriptFile`/`buildConversationChain` do
//! JS). Tudo contra um mock local da API, sem rede.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::sync::Mutex;

use prana::internal::sessions::{bun_hash_base36, cli_config_home_dir, cli_sanitize_path};
use prana::sdk_mcp::{PropertySchema, SdkMcpServer, ToolInputSchema, ToolOutput};
use prana::session::SessionStorage;
use prana::{
    ClaudeAgentOptions, ClaudeSDKClient, InMemorySessionStore, Message, NativeApiTransport,
    PermissionMode, SessionStore, ToolsConfig,
};

const FEATURES_SESSION: &str = "11111111-2222-4333-8444-555555555555";
const REAL_CLI_SESSION: &str = "abfac9ce-6f45-4b92-9bbd-24927d70787c";

// ---------------------------------------------------------------------------
// Mock da API: roteiro de respostas SSE, com o header `request-id`.
// ---------------------------------------------------------------------------

struct MockApi {
    addr: String,
    requests: Arc<Mutex<Vec<Value>>>,
}

impl MockApi {
    async fn start(script: Vec<String>) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").await.expect("bind");
        let addr = format!("http://{}", listener.local_addr().expect("addr"));
        let requests: Arc<Mutex<Vec<Value>>> = Arc::new(Mutex::new(Vec::new()));
        let captured = Arc::clone(&requests);
        tokio::spawn(async move {
            let mut served = 0usize;
            loop {
                let Ok((mut socket, _)) = listener.accept().await else {
                    return;
                };
                if let Some(body) = read_http_request(&mut socket).await {
                    captured.lock().await.push(body);
                }
                let index = served.min(script.len().saturating_sub(1));
                served += 1;
                // Uma latência mínima, como a da API de verdade: o resume
                // escolhe a folha pelo `timestamp` em milissegundos (empate
                // fica com a primeira, como no JS), e um mock instantâneo
                // poria a resposta no mesmo milissegundo do resultado da tool.
                tokio::time::sleep(std::time::Duration::from_millis(5)).await;
                let response = format!(
                    "HTTP/1.1 200 OK\r\ncontent-type: text/event-stream\r\nrequest-id: req_mock_{index}\r\nconnection: close\r\n\r\n{}",
                    script[index]
                );
                let _ = socket.write_all(response.as_bytes()).await;
                let _ = socket.shutdown().await;
            }
        });
        Self { addr, requests }
    }

    async fn requests(&self) -> Vec<Value> {
        self.requests.lock().await.clone()
    }
}

async fn read_http_request(socket: &mut tokio::net::TcpStream) -> Option<Value> {
    let mut buf = Vec::new();
    let mut chunk = [0u8; 4096];
    loop {
        let n = socket.read(&mut chunk).await.ok()?;
        if n == 0 {
            break;
        }
        buf.extend_from_slice(&chunk[..n]);
        if let Some(header_end) = buf.windows(4).position(|w| w == b"\r\n\r\n") {
            let headers = String::from_utf8_lossy(&buf[..header_end]).to_lowercase();
            let content_length: usize = headers
                .lines()
                .find(|l| l.starts_with("content-length:"))
                .and_then(|l| l.split(':').nth(1))
                .and_then(|v| v.trim().parse().ok())
                .unwrap_or(0);
            let body_start = header_end + 4;
            if buf.len() >= body_start + content_length {
                return serde_json::from_slice(&buf[body_start..body_start + content_length]).ok();
            }
        }
    }
    None
}

fn sse_events(events: &[Value]) -> String {
    events
        .iter()
        .map(|e| {
            format!(
                "event: {}\ndata: {e}\n\n",
                e["type"].as_str().expect("type")
            )
        })
        .collect()
}

fn sse_text(id: &str, text: &str) -> String {
    sse_events(&[
        json!({"type":"message_start","message":{"id":id,"type":"message","role":"assistant","model":"mock-model","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":1}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":text}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":5}}),
        json!({"type":"message_stop"}),
    ])
}

/// Uma resposta com texto e duas chamadas paralelas da tool `remember`.
fn sse_text_and_two_tools() -> String {
    sse_events(&[
        json!({"type":"message_start","message":{"id":"msg_1","type":"message","role":"assistant","model":"mock-model","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":20,"output_tokens":0}}}),
        json!({"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}),
        json!({"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"vou gravar"}}),
        json!({"type":"content_block_stop","index":0}),
        json!({"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_a","name":"mcp__bench__remember","input":{}}}),
        json!({"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"fact\":\"x\"}"}}),
        json!({"type":"content_block_stop","index":1}),
        json!({"type":"content_block_start","index":2,"content_block":{"type":"tool_use","id":"toolu_b","name":"mcp__bench__remember","input":{}}}),
        json!({"type":"content_block_delta","index":2,"delta":{"type":"input_json_delta","partial_json":"{\"fact\":\"y\"}"}}),
        json!({"type":"content_block_stop","index":2}),
        json!({"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":30}}),
        json!({"type":"message_stop"}),
    ])
}

// ---------------------------------------------------------------------------
// Montagem
// ---------------------------------------------------------------------------

#[derive(Default)]
struct Spec {
    resume: Option<String>,
    fork: bool,
    store: Option<Arc<InMemorySessionStore>>,
    tools: bool,
}

struct Fixture {
    client: ClaudeSDKClient,
    config_dir: tempfile::TempDir,
    cwd: tempfile::TempDir,
}

impl Fixture {
    fn project_dir(&self) -> PathBuf {
        let canonical = std::fs::canonicalize(self.cwd.path()).expect("canonical cwd");
        self.config_dir
            .path()
            .join("projects")
            .join(cli_sanitize_path(&canonical.display().to_string()))
    }

    fn transcript(&self, session_id: &str) -> Vec<Value> {
        read_jsonl(&self.project_dir().join(format!("{session_id}.jsonl")))
    }

    /// Põe um transcript do CLI onde o CLI o gravaria para este `cwd`.
    fn install_transcript(&self, fixture: &str, session_id: &str) {
        let dir = self.project_dir();
        std::fs::create_dir_all(&dir).expect("project dir");
        std::fs::copy(
            fixture_path(fixture),
            dir.join(format!("{session_id}.jsonl")),
        )
        .expect("copy fixture");
    }
}

fn fixture_path(name: &str) -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures/transcripts")
        .join(name)
}

fn read_jsonl(path: &Path) -> Vec<Value> {
    std::fs::read_to_string(path)
        .unwrap_or_else(|e| panic!("transcript {}: {e}", path.display()))
        .lines()
        .filter(|l| !l.trim().is_empty())
        .map(|l| serde_json::from_str(l).expect("linha JSON"))
        .collect()
}

fn remember_server() -> Arc<SdkMcpServer> {
    SdkMcpServer::builder("bench")
        .tool(
            "remember",
            "Grava um fato.",
            ToolInputSchema::object().required("fact", PropertySchema::string()),
            |_input: Value| async move { Ok(ToolOutput::text("gravado")) },
        )
        .build_shared()
}

fn options(spec: &Spec, api: &MockApi, config_dir: &Path, cwd: &Path) -> ClaudeAgentOptions {
    let env = HashMap::from([
        ("ANTHROPIC_API_KEY".to_string(), "mock-key".to_string()),
        ("ANTHROPIC_BASE_URL".to_string(), api.addr.clone()),
        ("ANTHROPIC_MODEL".to_string(), "mock-model".to_string()),
        (
            "CLAUDE_CONFIG_DIR".to_string(),
            config_dir.display().to_string(),
        ),
    ]);
    let mut options = ClaudeAgentOptions {
        env,
        cwd: Some(cwd.to_path_buf()),
        max_turns: Some(10),
        resume: spec.resume.clone(),
        fork_session: spec.fork,
        tools: Some(ToolsConfig::List(Vec::new())),
        permission_mode: Some(PermissionMode::BypassPermissions),
        strict_mcp_config: true,
        ..Default::default()
    };
    if spec.tools {
        options.add_sdk_mcp_server(remember_server());
    }
    options
}

fn fixture(spec: Spec, api: &MockApi) -> Fixture {
    let config_dir = tempfile::tempdir().expect("config dir");
    let cwd = tempfile::tempdir().expect("cwd");
    let mut transport_options = options(&spec, api, config_dir.path(), cwd.path());
    let mut client_options = options(&spec, api, config_dir.path(), cwd.path());
    if let Some(store) = &spec.store {
        transport_options.session_store = Some(Box::new(Arc::clone(store)));
        client_options.session_store = Some(Box::new(Arc::clone(store)));
    }
    let transport = NativeApiTransport::new(transport_options);
    let client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    Fixture {
        client,
        config_dir,
        cwd,
    }
}

async fn run(fx: &mut Fixture, prompt: &str) -> Vec<Message> {
    fx.client.connect().await.expect("connect");
    fx.client.query(prompt).await.expect("query");
    let messages = fx.client.receive_response().await.expect("response");
    fx.client.disconnect().await.expect("disconnect");
    messages
}

fn session_id_of(messages: &[Message]) -> String {
    messages
        .iter()
        .find_map(|m| match m {
            Message::Result(r) => Some(r.session_id.clone()),
            _ => None,
        })
        .expect("result")
}

fn of_type<'a>(entries: &'a [Value], kind: &str) -> Vec<&'a Value> {
    entries.iter().filter(|e| e["type"] == kind).collect()
}

fn keys(entry: &Value) -> Vec<&str> {
    entry
        .as_object()
        .expect("objeto")
        .keys()
        .map(String::as_str)
        .collect()
}

/// Os textos de uma mensagem do request.
fn texts(message: &Value) -> Vec<&str> {
    message["content"]
        .as_array()
        .expect("content")
        .iter()
        .filter_map(|b| b["text"].as_str())
        .collect()
}

fn block_types(message: &Value) -> Vec<&str> {
    message["content"]
        .as_array()
        .expect("content")
        .iter()
        .filter_map(|b| b["type"].as_str())
        .collect()
}

// ---------------------------------------------------------------------------
// Gravação
// ---------------------------------------------------------------------------

#[tokio::test]
async fn each_content_block_is_one_assistant_message_and_one_chained_transcript_entry() {
    let api = MockApi::start(vec![sse_text_and_two_tools(), sse_text("msg_2", "feito")]).await;
    let mut fx = fixture(
        Spec {
            tools: true,
            ..Default::default()
        },
        &api,
    );
    let messages = run(&mut fx, "grave dois fatos").await;
    let session_id = session_id_of(&messages);

    // Contrato do `queryModel`: um AssistantMessage por bloco, todos com o id
    // da resposta, sem `stop_reason` (o `message_delta` ainda não chegou).
    let assistants: Vec<&prana::AssistantMessage> = messages
        .iter()
        .filter_map(|m| match m {
            Message::Assistant(a) => Some(a),
            _ => None,
        })
        .collect();
    assert_eq!(assistants.len(), 4, "{assistants:?}");
    for a in &assistants[..3] {
        assert_eq!(a.content.len(), 1);
        assert_eq!(a.message_id.as_deref(), Some("msg_1"));
        assert_eq!(a.stop_reason, None);
    }

    let entries = fx.transcript(&session_id);
    let users = of_type(&entries, "user");
    let blocks = of_type(&entries, "assistant");
    assert_eq!(users.len(), 3, "prompt e dois resultados: {entries:#?}");
    assert_eq!(blocks.len(), 4);

    // O prompt: conteúdo como veio (string), `promptId`, cabeçalho e rodapé
    // do `insertMessageChain`, nessa ordem.
    let prompt = users[0];
    assert_eq!(
        keys(prompt),
        vec![
            "parentUuid",
            "isSidechain",
            "promptId",
            "type",
            "message",
            "uuid",
            "timestamp",
            "userType",
            "entrypoint",
            "cwd",
            "sessionId",
            "version",
            "gitBranch"
        ]
    );
    assert_eq!(prompt["parentUuid"], Value::Null);
    assert_eq!(
        prompt["message"],
        json!({"role": "user", "content": "grave dois fatos"})
    );
    assert_eq!(prompt["entrypoint"], "sdk-rs");
    assert_eq!(prompt["userType"], "external");
    assert_eq!(prompt["version"], prana::session::CLI_VERSION);
    assert_eq!(prompt["gitBranch"], "HEAD");
    assert_eq!(prompt["sessionId"], session_id.as_str());
    assert_eq!(
        prompt["cwd"],
        std::fs::canonicalize(fx.cwd.path())
            .unwrap()
            .display()
            .to_string()
    );

    // Os blocos: encadeados, com o `requestId` da resposta HTTP e o mesmo
    // uuid do frame que o cliente recebeu.
    assert_eq!(
        keys(blocks[0]),
        vec![
            "parentUuid",
            "isSidechain",
            "message",
            "requestId",
            "type",
            "uuid",
            "timestamp",
            "userType",
            "entrypoint",
            "cwd",
            "sessionId",
            "version",
            "gitBranch"
        ]
    );
    assert_eq!(blocks[0]["parentUuid"], prompt["uuid"]);
    assert_eq!(blocks[1]["parentUuid"], blocks[0]["uuid"]);
    assert_eq!(blocks[2]["parentUuid"], blocks[1]["uuid"]);
    for (entry, frame) in blocks.iter().zip(&assistants) {
        assert_eq!(entry["uuid"].as_str(), frame.uuid.as_deref());
    }
    for entry in &blocks[..3] {
        assert_eq!(entry["message"]["id"], "msg_1");
        assert_eq!(entry["requestId"], "req_mock_0");
        assert_eq!(entry["message"]["content"].as_array().unwrap().len(), 1);
    }
    assert_eq!(
        keys(&blocks[0]["message"]),
        vec![
            "id",
            "type",
            "role",
            "model",
            "content",
            "stop_reason",
            "stop_sequence",
            "usage"
        ]
    );
    // Só o último bloco recebe o que o `message_delta` trouxe.
    assert_eq!(blocks[0]["message"]["stop_reason"], Value::Null);
    assert_eq!(
        blocks[0]["message"]["usage"],
        json!({"input_tokens": 20, "output_tokens": 0})
    );
    assert_eq!(blocks[2]["message"]["stop_reason"], "tool_use");
    assert_eq!(blocks[2]["message"]["usage"]["output_tokens"], 30);
    assert_eq!(blocks[2]["message"]["usage"]["input_tokens"], 20);

    // Cada resultado aponta para o bloco que pediu a tool.
    for (tool_id, source) in [("toolu_a", blocks[1]), ("toolu_b", blocks[2])] {
        let result = users
            .iter()
            .find(|u| u["message"]["content"][0]["tool_use_id"] == tool_id)
            .expect("resultado da tool");
        assert_eq!(result["parentUuid"], source["uuid"]);
        assert_eq!(result["sourceToolAssistantUUID"], source["uuid"]);
        assert_eq!(result["promptId"], prompt["promptId"]);
    }
    // A resposta seguinte continua do último resultado gravado.
    assert_eq!(blocks[3]["parentUuid"], users[2]["uuid"]);
    assert_eq!(blocks[3]["message"]["stop_reason"], "end_turn");

    // O request seguinte vê a resposta inteira numa mensagem só.
    let second = &api.requests().await[1];
    let history = second["messages"].as_array().unwrap();
    let assistant = history
        .iter()
        .find(|m| m["role"] == "assistant")
        .expect("assistente no histórico");
    assert_eq!(block_types(assistant), vec!["text", "tool_use", "tool_use"]);
}

#[tokio::test]
async fn the_mirror_carries_exactly_the_entries_written_to_disk() {
    let api = MockApi::start(vec![sse_text_and_two_tools(), sse_text("msg_2", "feito")]).await;
    let store = Arc::new(InMemorySessionStore::new());
    let mut fx = fixture(
        Spec {
            tools: true,
            store: Some(Arc::clone(&store)),
            ..Default::default()
        },
        &api,
    );
    let messages = run(&mut fx, "espelhe").await;
    let session_id = session_id_of(&messages);
    let on_disk = fx.transcript(&session_id);

    let project_key = fx
        .project_dir()
        .file_name()
        .unwrap()
        .to_string_lossy()
        .to_string();
    let mirrored = store
        .load(&prana::SessionKey::new(project_key, session_id))
        .await
        .expect("load")
        .expect("entradas espelhadas");
    assert_eq!(mirrored, on_disk);
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

#[tokio::test]
async fn a_cli_transcript_resumes_through_the_cli_chain_and_new_entries_continue_it() {
    let api = MockApi::start(vec![sse_text("msg_new", "ok")]).await;
    let mut fx = fixture(
        Spec {
            resume: Some(FEATURES_SESSION.to_string()),
            ..Default::default()
        },
        &api,
    );
    fx.install_transcript("cli_chain_features.jsonl", FEATURES_SESSION);
    let original = fx.transcript(FEATURES_SESSION);

    let messages = run(&mut fx, "e agora?").await;
    assert_eq!(session_id_of(&messages), FEATURES_SESSION);

    // O que o CLI mandaria: nada antes do compact boundary, o anexo do hook
    // subindo para o começo e fundido ao resumo e ao prompt, os três blocos
    // de `msg_A` numa mensagem, o resultado órfão da tool paralela
    // recuperado, o `progress` fora da cadeia, a sidechain e o
    // `turn_duration` fora do request.
    let request = &api.requests().await[0];
    let history = request["messages"].as_array().unwrap();
    assert_eq!(history.len(), 5, "{history:#?}");
    let first_texts = texts(&history[0]);
    assert_eq!(
        &first_texts[first_texts.len() - 3..],
        &[
            "<system-reminder>\nUserPromptSubmit hook additional context: contexto do hook\n</system-reminder>\n",
            "Resumo da conversa anterior.\n",
            "liste os arquivos",
        ]
    );
    assert!(!request.to_string().contains("antes do compact"));
    assert_eq!(
        block_types(&history[1]),
        vec!["thinking", "tool_use", "tool_use"]
    );
    assert_eq!(history[2]["content"][0]["tool_use_id"], "toolu_glob");
    assert_eq!(history[2]["content"][1]["tool_use_id"], "toolu_grep");
    assert_eq!(texts(&history[3]), vec!["pronto"]);
    assert_eq!(texts(&history[4]).last(), Some(&"e agora?"));
    assert!(!request.to_string().contains("tarefa do subagente"));

    // O arquivo do CLI fica intacto e o turno novo continua a cadeia a partir
    // da última entrada dela (o `turn_duration`).
    let after = fx.transcript(FEATURES_SESSION);
    assert_eq!(&after[..original.len()], original.as_slice());
    let new_entries = &after[original.len()..];
    assert_eq!(new_entries[0]["type"], "user");
    assert_eq!(
        new_entries[0]["parentUuid"],
        "00000000-0000-4000-8000-00000000000e"
    );
    assert_eq!(new_entries[1]["type"], "assistant");
    assert_eq!(new_entries[1]["parentUuid"], new_entries[0]["uuid"]);
}

#[tokio::test]
async fn the_real_cli_transcript_resumes_an_interrupted_turn_like_the_cli() {
    let api = MockApi::start(vec![sse_text("msg_new", "1")]).await;
    let mut fx = fixture(
        Spec {
            resume: Some(REAL_CLI_SESSION.to_string()),
            ..Default::default()
        },
        &api,
    );
    fx.install_transcript("cli_2_1_247_sdk_tool_chain.jsonl", REAL_CLI_SESSION);
    let original = fx.transcript(REAL_CLI_SESSION);

    run(&mut fx, "qual foi o número?").await;

    // O transcript real acaba num resultado de tool sem resposta: o resume
    // acrescenta a mensagem meta de continuação e a resposta sintética.
    let request = &api.requests().await[0];
    let history = request["messages"].as_array().unwrap();
    assert_eq!(history.len(), 7, "{history:#?}");
    assert_eq!(block_types(&history[1]), vec!["thinking", "tool_use"]);
    assert_eq!(
        history[1]["content"][1]["name"],
        "mcp__ahamkara_smoke__write_note"
    );
    assert_eq!(history[2]["content"][0]["type"], "tool_result");
    assert_eq!(
        history[3]["content"][0]["name"],
        "mcp__ahamkara_smoke__count_notes"
    );
    assert_eq!(block_types(&history[4]), vec!["tool_result", "text"]);
    assert_eq!(
        history[4]["content"][1]["text"],
        "Continue from where you left off."
    );
    assert_eq!(texts(&history[5]), vec!["No response requested."]);
    assert_eq!(texts(&history[6]).last(), Some(&"qual foi o número?"));

    // As duas mensagens sintéticas do resume vão para o arquivo antes do
    // prompt, encadeadas a partir do último resultado.
    let after = fx.transcript(REAL_CLI_SESSION);
    let new_entries = &after[original.len()..];
    assert_eq!(new_entries[0]["isMeta"], true);
    assert_eq!(
        new_entries[0]["parentUuid"],
        "7c6cb924-e8e6-4171-ac6d-7db8bdb29b82"
    );
    assert_eq!(new_entries[1]["message"]["model"], "<synthetic>");
    assert_eq!(new_entries[1]["isApiErrorMessage"], false);
    assert_eq!(new_entries[1]["parentUuid"], new_entries[0]["uuid"]);
    assert_eq!(new_entries[2]["message"]["content"], "qual foi o número?");
    assert_eq!(new_entries[2]["parentUuid"], new_entries[1]["uuid"]);
}

#[tokio::test]
async fn a_native_transcript_is_read_back_by_the_cli_rules() {
    // Grava com o nativo e relê pelas regras do CLI: a cadeia chega inteira.
    let api = MockApi::start(vec![sse_text_and_two_tools(), sse_text("msg_2", "feito")]).await;
    let mut fx = fixture(
        Spec {
            tools: true,
            ..Default::default()
        },
        &api,
    );
    let messages = run(&mut fx, "grave").await;
    let session_id = session_id_of(&messages);
    let path = fx.project_dir().join(format!("{session_id}.jsonl"));
    let content = std::fs::read_to_string(&path).unwrap();
    let loaded =
        prana::internal::transcript_load::load_conversation_from_str(&content).expect("conversa");
    let api_messages = prana::internal::transcript_load::messages_for_api(&loaded.messages);
    let roles: Vec<_> = api_messages
        .iter()
        .map(|m| format!("{:?}", m.role))
        .collect();
    assert_eq!(roles, vec!["User", "Assistant", "User", "Assistant"]);
    assert_eq!(api_messages[1].content.len(), 3);
    assert_eq!(api_messages[2].content.len(), 2, "{:#?}", loaded.messages);
    // Nada sintético: a conversa terminou numa resposta.
    assert_eq!(loaded.messages.len(), 7);
}

#[tokio::test]
async fn fork_writes_the_resumed_conversation_into_the_new_session() {
    let api = MockApi::start(vec![sse_text("msg_new", "ok")]).await;
    let mut fx = fixture(
        Spec {
            resume: Some(FEATURES_SESSION.to_string()),
            fork: true,
            ..Default::default()
        },
        &api,
    );
    fx.install_transcript("cli_chain_features.jsonl", FEATURES_SESSION);
    let original = fx.transcript(FEATURES_SESSION);
    let messages = run(&mut fx, "bifurque").await;
    let forked = session_id_of(&messages);
    assert_ne!(forked, FEATURES_SESSION);
    assert_eq!(fx.transcript(FEATURES_SESSION), original);

    // O arquivo novo tem a cadeia inteira (11 mensagens), com o id novo e o
    // `parentUuid` refeito em sequência (o resultado de tool aponta para o
    // bloco de origem), e depois o prompt e a resposta.
    let entries = fx.transcript(&forked);
    assert_eq!(entries.len(), 13, "{entries:#?}");
    assert!(entries.iter().all(|e| e["sessionId"] == forked.as_str()));
    assert_eq!(entries[0]["subtype"], "compact_boundary");
    assert_eq!(entries[0]["parentUuid"], Value::Null);
    let glob_result = entries
        .iter()
        .find(|e| e["uuid"] == "00000000-0000-4000-8000-00000000000a")
        .unwrap();
    assert_eq!(
        glob_result["parentUuid"],
        "00000000-0000-4000-8000-000000000008"
    );
    assert_eq!(entries[11]["message"]["content"], "bifurque");
    assert_eq!(entries[11]["parentUuid"], entries[10]["uuid"]);
}

#[tokio::test]
async fn resuming_a_missing_session_fails_like_the_cli() {
    let api = MockApi::start(vec![sse_text("msg", "nunca")]).await;
    let mut fx = fixture(
        Spec {
            resume: Some("99999999-9999-4999-8999-999999999999".to_string()),
            ..Default::default()
        },
        &api,
    );
    let outcome = async {
        fx.client.connect().await?;
        fx.client.query("oi").await?;
        fx.client.receive_response().await
    }
    .await;
    let err = outcome.expect_err("o resume de sessão inexistente precisa falhar");
    assert!(
        err.to_string()
            .contains("No conversation found with session ID"),
        "{err}"
    );
    assert!(api.requests().await.is_empty());
}

// ---------------------------------------------------------------------------
// Caminho
// ---------------------------------------------------------------------------

#[test]
fn bun_hash_matches_the_bundled_cli() {
    // Valores tirados do `Bun.hash(s).toString(36)` do Bun 1.4.
    assert_eq!(bun_hash_base36("abc"), "1g45uqqks6lu");
    assert_eq!(bun_hash_base36(""), "27k1wwwhf13t");
    assert_eq!(
        bun_hash_base36(&format!("/home/{}", "x".repeat(300))),
        "324scoo9z0zw1"
    );
    assert_eq!(
        bun_hash_base36(&format!("/ção/{}", "é".repeat(120))),
        "oos0i5xqklfs"
    );
    for (n, expected) in [
        (1, "2kz47bjyr1wfu"),
        (3, "3ddzjudamrwuo"),
        (4, "35q9122d9d3hd"),
        (16, "1kw0fu70tgxmt"),
        (17, "2tbbgrymglf2"),
        (47, "38mfbr0tsl0us"),
        (48, "c2ld4nsryntz"),
        (49, "1bkat1rnqob1f"),
        (96, "2aps7eh2n895q"),
        (97, "oysl569e1qbu"),
        (250, "s4y9wgmbj54t"),
    ] {
        assert_eq!(
            bun_hash_base36(&format!("/p{}", "a".repeat(n))),
            expected,
            "n={n}"
        );
    }
}

#[test]
fn sanitize_counts_utf16_units_like_the_cli() {
    assert_eq!(cli_sanitize_path("/a b/ç"), "-a-b--");
    assert_eq!(cli_sanitize_path("/x😀"), "-x--");
    let long = format!("/{}", "d".repeat(250));
    let sanitized = cli_sanitize_path(&long);
    assert_eq!(
        sanitized,
        format!("-{}-{}", "d".repeat(199), bun_hash_base36(&long))
    );
}

#[test]
fn the_config_home_follows_the_env_the_cli_would_see() {
    let env = HashMap::from([("CLAUDE_CONFIG_DIR".to_string(), "/cfg/x".to_string())]);
    assert_eq!(cli_config_home_dir(Some(&env)), PathBuf::from("/cfg/x"));
    // Sem CLAUDE_CONFIG_DIR em lugar nenhum, o HOME das opções manda.
    if std::env::var("CLAUDE_CONFIG_DIR").is_err() {
        let env = HashMap::from([("HOME".to_string(), "/home/efs".to_string())]);
        assert_eq!(
            cli_config_home_dir(Some(&env)),
            PathBuf::from("/home/efs/.claude")
        );
    }
}

#[tokio::test]
async fn a_long_cwd_uses_the_bun_hash_or_the_directory_that_already_exists() {
    let config = tempfile::tempdir().unwrap();
    let base = tempfile::tempdir().unwrap();
    let mut deep = base.path().to_path_buf();
    for _ in 0..12 {
        deep.push("diretorio-bem-comprido");
    }
    std::fs::create_dir_all(&deep).unwrap();
    let canonical = std::fs::canonicalize(&deep).unwrap().display().to_string();
    let env = HashMap::from([(
        "CLAUDE_CONFIG_DIR".to_string(),
        config.path().display().to_string(),
    )]);

    let storage = SessionStorage::for_cwd_with_env(&canonical, Some(&env))
        .await
        .unwrap();
    let name = storage
        .project_dir()
        .file_name()
        .unwrap()
        .to_string_lossy()
        .to_string();
    assert!(
        name.ends_with(&format!("-{}", bun_hash_base36(&canonical))),
        "{name}"
    );

    // Um diretório com o mesmo prefixo e outro sufixo (o CLI em Node, ou o
    // SDK Python materializando um resume) é reaproveitado.
    std::fs::remove_dir(storage.project_dir()).unwrap();
    let other = config
        .path()
        .join("projects")
        .join(format!("{}-node", &name[..200]));
    std::fs::create_dir_all(&other).unwrap();
    let storage = SessionStorage::for_cwd_with_env(&canonical, Some(&env))
        .await
        .unwrap();
    assert_eq!(storage.project_dir(), other.as_path());
}
