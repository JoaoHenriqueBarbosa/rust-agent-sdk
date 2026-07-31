//! Contrato dos hooks no caminho STREAMING: a closure declarada nas
//! `ClaudeAgentOptions` é a que atende o `control_request` de subtype
//! `hook_callback`.
//!
//! Isto é a trava de um defeito que passou despercebido porque tinha a forma
//! certa e o conteúdo vazio: a fronteira entre `ClaudeSDKClient` e `Query`
//! convertia cada hook para `Value::Null` e só a ESTRUTURA chegava. O
//! `initialize` declarava `hookCallbackIds` corretamente, o CLI passava a
//! chamar esses ids, e toda chamada era respondida com
//! "No hook callback found for ID". Hook declarado, hook nunca executado — sem
//! erro no connect, sem log, sem sintoma.
//!
//! O transporte roteirizado daqui nunca dá EOF (igual ao CLI real com o stdin
//! aberto) e injeta o `hook_callback` que o CLI mandaria depois de uma tool. A
//! resposta do cliente é capturada do lado do `write`.

use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use rust_agent_sdk::types::{
    ClaudeAgentOptions, HookCallbackFn, HookEvent, HookInput, HookJSONOutput, HookMatcher,
    HookSpecificOutput,
};
use rust_agent_sdk::{ClaudeSDKClient, Transport};
use serde_json::{json, Value};

/// Sessão pendurada é falha, não espera.
const STEP_TIMEOUT: Duration = Duration::from_secs(5);

#[derive(Default)]
struct Script {
    outgoing: VecDeque<Value>,
    written: Vec<Value>,
}

struct ScriptedTransport {
    connected: bool,
    script: Arc<Mutex<Script>>,
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
        for line in data.lines().filter(|l| !l.trim().is_empty()) {
            let value: Value = serde_json::from_str(line.trim()).map_err(|e| {
                rust_agent_sdk::ClaudeSDKError::sdk(format!("json inválido do cliente: {e}"))
            })?;
            // O handshake do `initialize` é um control_request do CLIENTE e
            // precisa de resposta, senão o connect pendura.
            if value.get("type").and_then(|t| t.as_str()) == Some("control_request") {
                let request_id = value
                    .get("request_id")
                    .and_then(|r| r.as_str())
                    .unwrap_or("req_1")
                    .to_string();
                let mut script = self.script.lock().unwrap();
                script.outgoing.push_back(json!({
                    "type": "control_response",
                    "response": {
                        "subtype": "success",
                        "request_id": request_id,
                        "response": {}
                    }
                }));
                script.written.push(value);
                continue;
            }
            self.script.lock().unwrap().written.push(value);
        }
        Ok(())
    }

    async fn end_input(&mut self) -> rust_agent_sdk::errors::Result<()> {
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.connected
    }

    async fn read_message(&mut self) -> rust_agent_sdk::errors::Result<Option<Value>> {
        loop {
            if let Some(msg) = self.script.lock().unwrap().outgoing.pop_front() {
                return Ok(Some(msg));
            }
            tokio::time::sleep(Duration::from_millis(2)).await;
        }
    }
}

/// `control_request` de `hook_callback`, na forma que o CLI 2.1.220 emite.
fn hook_call(request_id: &str, callback_id: &str) -> Value {
    json!({
        "type": "control_request",
        "request_id": request_id,
        "request": {
            "subtype": "hook_callback",
            "callback_id": callback_id,
            "tool_use_id": "toolu_1",
            "input": {
                "hook_event_name": "PostToolUse",
                "session_id": "s1",
                "transcript_path": "/dev/null",
                "cwd": "/tmp",
                "tool_name": "mcp__srv__alguma_tool",
                "tool_input": {},
                "tool_response": {},
                "tool_use_id": "toolu_1"
            }
        }
    })
}

/// Hook que devolve `additionalContext` e registra que foi chamado.
fn recording_hook(calls: Arc<Mutex<Vec<String>>>) -> HookCallbackFn {
    Arc::new(move |input: HookInput, _tool_use_id, _ctx| {
        let calls = Arc::clone(&calls);
        Box::pin(async move {
            if let HookInput::PostToolUse { tool_name, .. } = &input {
                calls.lock().unwrap().push(tool_name.clone());
            }
            HookJSONOutput::Sync {
                continue_: None,
                suppress_output: None,
                stop_reason: None,
                decision: None,
                system_message: None,
                reason: None,
                hook_specific_output: Some(HookSpecificOutput::PostToolUse {
                    additional_context: Some("contexto-do-hook".to_string()),
                    updated_mcp_tool_output: None,
                }),
            }
        })
    })
}

/// Id declarado ao CLI no `initialize` para o primeiro hook de `PostToolUse`.
fn declared_callback_id(script: &Arc<Mutex<Script>>) -> String {
    let script = script.lock().unwrap();
    script
        .written
        .iter()
        .find_map(|frame| {
            let matcher = frame
                .get("request")?
                .get("hooks")?
                .get("PostToolUse")?
                .as_array()?
                .first()?;
            let id = matcher
                .get("hookCallbackIds")?
                .as_array()?
                .first()?
                .as_str()?;
            Some(id.to_string())
        })
        .expect("o initialize precisa declarar o hook PostToolUse com um callback id")
}

fn reply_for(script: &Arc<Mutex<Script>>, request_id: &str) -> Option<Value> {
    let script = script.lock().unwrap();
    script.written.iter().find_map(|frame| {
        let response = frame.get("response")?;
        if response.get("request_id")?.as_str()? != request_id {
            return None;
        }
        Some(response.clone())
    })
}

/// O CLI chama o id que a sessão declarou — e alguém atende.
#[tokio::test]
async fn a_declared_hook_answers_the_callback_the_cli_was_given() {
    let calls: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
    let mut hooks = HashMap::new();
    hooks.insert(
        HookEvent::PostToolUse,
        vec![HookMatcher {
            matcher: None,
            hooks: vec![recording_hook(Arc::clone(&calls))],
            timeout: None,
        }],
    );
    let options = ClaudeAgentOptions {
        hooks: Some(hooks),
        ..Default::default()
    };

    let script = Arc::new(Mutex::new(Script::default()));
    let mut client = ClaudeSDKClient::new(options).with_transport(Box::new(ScriptedTransport {
        connected: false,
        script: Arc::clone(&script),
    }));
    tokio::time::timeout(STEP_TIMEOUT, client.connect())
        .await
        .expect("connect não pode pendurar")
        .expect("connect precisa completar o handshake");

    let callback_id = declared_callback_id(&script);
    script
        .lock()
        .unwrap()
        .outgoing
        .push_back(hook_call("hook-1", &callback_id));

    let response = tokio::time::timeout(STEP_TIMEOUT, async {
        loop {
            if let Some(reply) = reply_for(&script, "hook-1") {
                return reply;
            }
            let _ = tokio::time::timeout(Duration::from_millis(20), client.next_message()).await;
        }
    })
    .await
    .expect("a sessão precisa responder ao hook_callback");

    // CONTRATO: a resposta é sucesso. Enquanto os callbacks não eram
    // registrados, isto voltava `subtype: "error"` com
    // "No hook callback found for ID".
    assert_eq!(
        response.get("subtype").and_then(|s| s.as_str()),
        Some("success"),
        "o hook declarado tem de ser encontrado pelo id que o initialize entregou: {response}"
    );

    // CONTRATO: o `additionalContext` da closure chega ao CLI.
    assert_eq!(
        response
            .get("response")
            .and_then(|r| r.get("hookSpecificOutput"))
            .and_then(|h| h.get("additionalContext"))
            .and_then(|c| c.as_str()),
        Some("contexto-do-hook"),
        "o que a closure devolve é o que vai para o CLI: {response}"
    );

    // CONTRATO: a closure rodou de verdade, com o input parseado.
    assert_eq!(
        calls.lock().unwrap().clone(),
        vec!["mcp__srv__alguma_tool".to_string()],
        "o hook precisa ter sido executado uma vez, com o tool_name do input"
    );
}
