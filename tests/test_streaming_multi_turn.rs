//! Contrato que faltava: uma sessão streaming aguenta vários turnos.
//!
//! O transporte roteirizado aqui NUNCA devolve EOF — quando não há nada
//! roteirizado ele fica pendurado, exatamente como o CLI real faz enquanto o
//! stdin continua aberto. Logo, qualquer código que dependa de "ler até o EOF"
//! trava, e o `tokio::time::timeout` de cada teste transforma trava em falha.

use std::collections::VecDeque;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use rust_agent_sdk::internal::session_store::InMemorySessionStore;
use rust_agent_sdk::{
    ClaudeAgentOptions, ClaudeSDKClient, ContentBlock, Message, SessionKey, SessionStore,
    SessionStoreEntry, Transport,
};
use serde_json::json;

/// Teto de tempo por operação: sessão pendurada é falha, não espera.
const STEP_TIMEOUT: Duration = Duration::from_secs(5);

// ---------------------------------------------------------------------------
// Transporte roteirizado
// ---------------------------------------------------------------------------

#[derive(Default)]
struct Script {
    outgoing: VecDeque<serde_json::Value>,
    end_input_calls: usize,
    user_prompts: Vec<String>,
    /// Frames extras a emitir junto do próximo turno (ex.: transcript_mirror).
    extra_per_turn: Vec<serde_json::Value>,
}

struct ScriptedTransport {
    connected: bool,
    script: Arc<Mutex<Script>>,
}

impl ScriptedTransport {
    fn new(script: Arc<Mutex<Script>>) -> Self {
        Self {
            connected: false,
            script,
        }
    }

    fn turn_frames(
        prompt: &str,
        turn: usize,
        extra: &[serde_json::Value],
    ) -> Vec<serde_json::Value> {
        let mut frames = vec![json!({
            "type": "assistant",
            "message": {
                "role": "assistant",
                "content": [{"type": "text", "text": format!("turno {turn}: {prompt}")}],
                "model": "claude-sonnet-4-5"
            }
        })];
        frames.extend(extra.iter().cloned());
        frames.push(json!({
            "type": "result",
            "subtype": "success",
            "duration_ms": 1,
            "duration_api_ms": 1,
            "is_error": false,
            "num_turns": turn,
            "session_id": "sessao-viva",
            "total_cost_usd": 0.0
        }));
        frames
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
        let value: serde_json::Value = serde_json::from_str(data.trim())
            .map_err(|e| rust_agent_sdk::ClaudeSDKError::sdk(format!("json inválido: {e}")))?;
        let mut script = self.script.lock().unwrap();
        match value.get("type").and_then(|t| t.as_str()) {
            Some("control_request") => {
                let request_id = value
                    .get("request_id")
                    .and_then(|r| r.as_str())
                    .unwrap_or("req_1")
                    .to_string();
                script.outgoing.push_back(json!({
                    "type": "control_response",
                    "response": {
                        "subtype": "success",
                        "request_id": request_id,
                        "response": {}
                    }
                }));
            }
            Some("user") => {
                let prompt = value
                    .get("message")
                    .and_then(|m| m.get("content"))
                    .and_then(|c| c.as_str())
                    .unwrap_or("")
                    .to_string();
                script.user_prompts.push(prompt.clone());
                let turn = script.user_prompts.len();
                let extra = script.extra_per_turn.clone();
                for frame in Self::turn_frames(&prompt, turn, &extra) {
                    script.outgoing.push_back(frame);
                }
            }
            _ => {}
        }
        Ok(())
    }

    async fn end_input(&mut self) -> rust_agent_sdk::errors::Result<()> {
        self.script.lock().unwrap().end_input_calls += 1;
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.connected
    }

    async fn read_message(&mut self) -> rust_agent_sdk::errors::Result<Option<serde_json::Value>> {
        loop {
            if let Some(msg) = self.script.lock().unwrap().outgoing.pop_front() {
                return Ok(Some(msg));
            }
            // Sem EOF: espera como o CLI real com stdin aberto.
            tokio::time::sleep(Duration::from_millis(2)).await;
        }
    }
}

fn text_of(messages: &[Message]) -> Vec<String> {
    messages
        .iter()
        .filter_map(|m| match m {
            Message::Assistant(a) => a.content.iter().find_map(|b| match b {
                ContentBlock::Text(t) => Some(t.text.clone()),
                _ => None,
            }),
            _ => None,
        })
        .collect()
}

// ---------------------------------------------------------------------------
// 1. Dois turnos na mesma sessão
// ---------------------------------------------------------------------------

#[tokio::test]
async fn streaming_session_survives_two_turns() {
    let script = Arc::new(Mutex::new(Script::default()));
    let transport = Box::new(ScriptedTransport::new(Arc::clone(&script)));
    let mut client = ClaudeSDKClient::new(ClaudeAgentOptions::default()).with_transport(transport);

    tokio::time::timeout(STEP_TIMEOUT, client.connect())
        .await
        .expect("connect não pode pendurar")
        .expect("connect precisa completar o handshake");

    // Turno 1.
    let first = tokio::time::timeout(STEP_TIMEOUT, client.send_message("primeira pergunta"))
        .await
        .expect("o turno 1 não pode pendurar esperando um EOF que não vem")
        .expect("o turno 1 precisa completar");

    // Contrato: o turno termina no `result`, e é a ÚLTIMA mensagem devolvida.
    assert!(
        matches!(first.last(), Some(Message::Result(_))),
        "receive_response tem de parar no result do turno"
    );
    assert_eq!(
        text_of(&first),
        vec!["turno 1: primeira pergunta".to_string()],
        "a resposta do turno 1 é a roteirizada para o turno 1"
    );

    // Contrato central: a sessão continua viva — o segundo query() é aceito.
    assert!(
        client.is_connected(),
        "a sessão segue conectada após o turno"
    );

    // Turno 2, na MESMA sessão.
    let second = tokio::time::timeout(STEP_TIMEOUT, client.send_message("segunda pergunta"))
        .await
        .expect("o turno 2 não pode pendurar")
        .expect("o turno 2 precisa completar");

    assert_eq!(
        text_of(&second),
        vec!["turno 2: segunda pergunta".to_string()],
        "o turno 2 devolve resposta distinta da do turno 1"
    );
    assert!(matches!(second.last(), Some(Message::Result(_))));

    // Contrato: os dois prompts foram para o MESMO transporte, em ordem.
    {
        let s = script.lock().unwrap();
        assert_eq!(
            s.user_prompts,
            vec![
                "primeira pergunta".to_string(),
                "segunda pergunta".to_string()
            ],
            "os dois turnos usaram a mesma sessão/transporte"
        );
        // Contrato: nada de fechar o stdin no meio — é isso que matava o multi-turno.
        assert_eq!(
            s.end_input_calls, 0,
            "a sessão streaming não pode chamar end_input antes do disconnect"
        );
    }

    client.disconnect().await.expect("disconnect limpo");
}

// ---------------------------------------------------------------------------
// 2. next_message() como primitivo público
// ---------------------------------------------------------------------------

#[tokio::test]
async fn next_message_yields_turn_incrementally() {
    let script = Arc::new(Mutex::new(Script::default()));
    let transport = Box::new(ScriptedTransport::new(Arc::clone(&script)));
    let mut client = ClaudeSDKClient::new(ClaudeAgentOptions::default()).with_transport(transport);

    tokio::time::timeout(STEP_TIMEOUT, client.connect())
        .await
        .expect("connect não pode pendurar")
        .unwrap();

    client.query("oi").await.expect("envio do prompt");

    // Primeira mensagem: o assistant do turno 1.
    let first = tokio::time::timeout(STEP_TIMEOUT, client.next_message())
        .await
        .expect("next_message não pode pendurar")
        .expect("leitura sem erro")
        .expect("há mensagem disponível");
    assert_eq!(text_of(std::slice::from_ref(&first)), vec!["turno 1: oi"]);

    // Segunda: o result.
    let second = tokio::time::timeout(STEP_TIMEOUT, client.next_message())
        .await
        .expect("next_message não pode pendurar")
        .expect("leitura sem erro")
        .expect("há mensagem disponível");
    assert!(
        matches!(second, Message::Result(_)),
        "a segunda mensagem do turno é o result"
    );

    client.disconnect().await.unwrap();
}

// ---------------------------------------------------------------------------
// 3. Espelhamento de transcript numa sessão streaming
// ---------------------------------------------------------------------------

#[tokio::test]
async fn streaming_session_mirrors_transcript_to_session_store() {
    // O store é observado pelo teste e também entregue ao cliente; o
    // `Arc<InMemorySessionStore>` implementa `SessionStore` por delegação.
    struct SharedStore(Arc<InMemorySessionStore>);

    #[async_trait::async_trait]
    impl SessionStore for SharedStore {
        async fn append(
            &self,
            key: &SessionKey,
            entries: &[SessionStoreEntry],
        ) -> Result<(), rust_agent_sdk::ClaudeSDKError> {
            self.0.append(key, entries).await
        }
        async fn load(
            &self,
            key: &SessionKey,
        ) -> Result<Option<Vec<SessionStoreEntry>>, rust_agent_sdk::ClaudeSDKError> {
            self.0.load(key).await
        }
    }

    let store = Arc::new(InMemorySessionStore::new());

    let projects_dir =
        std::env::temp_dir().join(format!("ahamkara-mirror-{}/projects", uuid::Uuid::new_v4()));
    let file_path = projects_dir
        .join("-projeto")
        .join("11111111-1111-4111-8111-111111111111.jsonl");

    let script = Arc::new(Mutex::new(Script {
        extra_per_turn: vec![json!({
            "type": "transcript_mirror",
            "filePath": file_path.to_string_lossy(),
            "entries": [{"type": "user", "uuid": "u1"}]
        })],
        ..Default::default()
    }));

    let mut options = ClaudeAgentOptions {
        session_store: Some(Box::new(SharedStore(Arc::clone(&store)))),
        ..Default::default()
    };
    // O batcher resolve o projects_dir a partir de CLAUDE_CONFIG_DIR das options.
    options.env.insert(
        "CLAUDE_CONFIG_DIR".to_string(),
        projects_dir.parent().unwrap().to_string_lossy().to_string(),
    );

    let transport = Box::new(ScriptedTransport::new(Arc::clone(&script)));
    let mut client = ClaudeSDKClient::new(options).with_transport(transport);

    tokio::time::timeout(STEP_TIMEOUT, client.connect())
        .await
        .expect("connect não pode pendurar")
        .unwrap();

    let messages = tokio::time::timeout(STEP_TIMEOUT, client.send_message("grava isso"))
        .await
        .expect("o turno não pode pendurar")
        .expect("o turno precisa completar");
    assert!(matches!(messages.last(), Some(Message::Result(_))));

    // Contrato: o frame transcript_mirror do turno foi drenado para o store
    // (o flush acontece ao chegar o `result`).
    let key = SessionKey::new("-projeto", "11111111-1111-4111-8111-111111111111");
    let entries = store.get_entries(&key);
    assert_eq!(
        entries.len(),
        1,
        "a sessão streaming precisa persistir o transcript espelhado"
    );

    client.disconnect().await.unwrap();
}
