//! Contrato que faltava: o caminho STREAMING (`ClaudeSDKClient`) serve MCP
//! in-process a partir do registry da SESSÃO.
//!
//! Os testes de `sdk_mcp` existentes exercitam o servidor, o registry e o
//! caminho de uma tacada (`query()`, em `internal/client.rs`). Nenhum deles
//! passava por `ClaudeSDKClient`, e era justamente ali que faltava o
//! `set_sdk_mcp_servers` — o streaming resolvia `mcp_message` só pelo registry
//! global do processo. Como o global é indexado por nome e é do processo
//! inteiro, uma sessão acabava alcançando servidor que ela não declarou.
//!
//! O transporte roteirizado daqui nunca dá EOF (igual ao CLI real com o stdin
//! aberto) e injeta o `control_request{subtype:"mcp_message"}` que o CLI mandaria
//! ao chamar uma tool. A resposta do cliente é capturada do lado do `write`.

use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use rust_agent_sdk::sdk_mcp::{SdkMcpRegistry, SdkMcpServer, ToolInputSchema, ToolOutput};
use rust_agent_sdk::{
    ClaudeAgentOptions, ClaudeSDKClient, McpServerConfig, McpServersConfig, Transport,
};
use serde_json::json;

/// Sessão pendurada é falha, não espera.
const STEP_TIMEOUT: Duration = Duration::from_secs(5);

// ---------------------------------------------------------------------------
// Transporte roteirizado
// ---------------------------------------------------------------------------

#[derive(Default)]
struct Script {
    /// Frames que o "CLI" ainda vai entregar ao cliente.
    outgoing: VecDeque<serde_json::Value>,
    /// Tudo que o cliente escreveu — é onde a resposta do MCP aparece.
    written: Vec<serde_json::Value>,
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
            let value: serde_json::Value = serde_json::from_str(line.trim()).map_err(|e| {
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

    async fn read_message(&mut self) -> rust_agent_sdk::errors::Result<Option<serde_json::Value>> {
        loop {
            if let Some(msg) = self.script.lock().unwrap().outgoing.pop_front() {
                return Ok(Some(msg));
            }
            // Sem EOF: espera, como o CLI real com o stdin aberto.
            tokio::time::sleep(Duration::from_millis(2)).await;
        }
    }
}

/// `control_request` de `mcp_message`, na forma que o CLI 2.1.220 emite.
fn mcp_call(request_id: &str, server_name: &str, tool: &str) -> serde_json::Value {
    json!({
        "type": "control_request",
        "request_id": request_id,
        "request": {
            "subtype": "mcp_message",
            "server_name": server_name,
            "message": {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "tools/call",
                "params": { "name": tool, "arguments": {} }
            }
        }
    })
}

/// Opções declarando um único servidor MCP do tipo `sdk`.
fn options_declaring(server_name: &str) -> ClaudeAgentOptions {
    let mut servers = HashMap::new();
    servers.insert(
        server_name.to_string(),
        McpServerConfig::Sdk {
            name: server_name.to_string(),
        },
    );
    ClaudeAgentOptions {
        mcp_servers: McpServersConfig::Dict(servers),
        ..Default::default()
    }
}

/// Servidor cuja única tool devolve uma etiqueta fixa — é como o teste sabe
/// QUAL servidor atendeu.
fn server_saying(name: &str, label: &'static str) -> SdkMcpServer {
    SdkMcpServer::builder(name)
        .tool(
            "whoami",
            "devolve a etiqueta do servidor",
            ToolInputSchema::object(),
            move |_args: serde_json::Value| async move { Ok(ToolOutput::text(label)) },
        )
        .build()
}

/// O objeto `response` do control_response que o cliente escreveu de volta.
fn mcp_reply_for(script: &Arc<Mutex<Script>>, request_id: &str) -> Option<serde_json::Value> {
    let script = script.lock().unwrap();
    script.written.iter().find_map(|v| {
        let response = v.get("response")?;
        if response.get("request_id")?.as_str()? != request_id {
            return None;
        }
        Some(response.clone())
    })
}

/// Extrai o texto do `mcp_response` que o cliente escreveu de volta.
fn mcp_reply_text(script: &Arc<Mutex<Script>>, request_id: &str) -> Option<String> {
    let script = script.lock().unwrap();
    script.written.iter().find_map(|v| {
        let response = v.get("response")?;
        if response.get("request_id")?.as_str()? != request_id {
            return None;
        }
        let text = response
            .get("response")?
            .get("mcp_response")?
            .get("result")?
            .get("content")?
            .get(0)?
            .get("text")?
            .as_str()?;
        Some(text.to_string())
    })
}

// ---------------------------------------------------------------------------
// 1. O streaming serve a tool do servidor que a sessão declarou
// ---------------------------------------------------------------------------

#[tokio::test]
async fn streaming_client_serves_the_sdk_mcp_server_it_declared() {
    let name = "srv_declarado";
    SdkMcpRegistry::global().insert(server_saying(name, "sou-o-declarado"));

    let script = Arc::new(Mutex::new(Script::default()));
    let transport = Box::new(ScriptedTransport {
        connected: false,
        script: Arc::clone(&script),
    });
    let mut client = ClaudeSDKClient::new(options_declaring(name)).with_transport(transport);

    tokio::time::timeout(STEP_TIMEOUT, client.connect())
        .await
        .expect("connect não pode pendurar")
        .expect("connect precisa completar o handshake");

    // O "CLI" pede a tool.
    script
        .lock()
        .unwrap()
        .outgoing
        .push_back(mcp_call("mcp_1", name, "whoami"));

    // Bombeia o laço de mensagens até a resposta aparecer no lado do write.
    // `next_message` é quem despacha control_request; sem chamá-lo nada anda.
    let pumped = tokio::time::timeout(STEP_TIMEOUT, async {
        loop {
            if let Some(text) = mcp_reply_text(&script, "mcp_1") {
                return text;
            }
            let _ = tokio::time::timeout(Duration::from_millis(50), client.next_message()).await;
        }
    })
    .await;

    // CONTRATO: o caminho streaming respondeu ao mcp_message com o resultado da
    // tool do servidor declarado. Antes do `set_sdk_mcp_servers` em
    // `connect_inner`, isso só funcionava por acidente do registry global.
    assert_eq!(
        pumped.expect("o streaming precisa responder ao mcp_message"),
        "sou-o-declarado",
        "a tool servida tem de ser a do servidor declarado nas opções"
    );

    SdkMcpRegistry::global().remove(name);
}

// ---------------------------------------------------------------------------
// 2. Servidor NÃO declarado não é servido, mesmo existindo no processo
// ---------------------------------------------------------------------------

#[tokio::test]
async fn streaming_client_refuses_a_server_it_did_not_declare() {
    // Os dois existem no processo, como se fossem de duas sessões concorrentes
    // de um worker de fila.
    SdkMcpRegistry::global().insert(server_saying("srv_meu", "sou-o-meu"));
    SdkMcpRegistry::global().insert(server_saying("srv_alheio", "sou-o-alheio"));

    let script = Arc::new(Mutex::new(Script::default()));
    let transport = Box::new(ScriptedTransport {
        connected: false,
        script: Arc::clone(&script),
    });
    let mut client = ClaudeSDKClient::new(options_declaring("srv_meu")).with_transport(transport);

    tokio::time::timeout(STEP_TIMEOUT, client.connect())
        .await
        .expect("connect não pode pendurar")
        .expect("connect precisa completar o handshake");

    // O "CLI" pede a tool de um servidor que ESTA sessão não declarou.
    script
        .lock()
        .unwrap()
        .outgoing
        .push_back(mcp_call("mcp_alheio", "srv_alheio", "whoami"));

    let outcome = tokio::time::timeout(STEP_TIMEOUT, async {
        loop {
            if let Some(reply) = mcp_reply_for(&script, "mcp_alheio") {
                return reply;
            }
            let _ = tokio::time::timeout(Duration::from_millis(50), client.next_message()).await;
        }
    })
    .await
    .expect("o streaming precisa responder — errar calado seria pior");

    // CONTRATO: a sessão responde ERRO, não a tool do servidor alheio. Sem esta
    // asserção o fallback para o registry global voltaria a servir "sou-o-alheio"
    // e ninguém perceberia: a resposta é bem formada, só vem do servidor errado.
    assert_eq!(
        outcome.get("subtype").and_then(|s| s.as_str()),
        Some("error"),
        "servidor não declarado tem de virar erro, não resposta de tool"
    );
    let message = outcome
        .get("error")
        .and_then(|e| e.as_str())
        .unwrap_or_default();
    assert!(
        message.contains("srv_alheio"),
        "o erro tem de nomear o servidor recusado, e veio: {message}"
    );

    SdkMcpRegistry::global().remove("srv_meu");
    SdkMcpRegistry::global().remove("srv_alheio");
}

// ---------------------------------------------------------------------------
// 2. O registry da sessão contém SÓ o que a sessão declarou
// ---------------------------------------------------------------------------

#[test]
fn the_session_registry_holds_only_the_declared_servers() {
    SdkMcpRegistry::global().insert(server_saying("srv_a", "a"));
    SdkMcpRegistry::global().insert(server_saying("srv_b", "b"));

    let session = SdkMcpRegistry::for_options(&options_declaring("srv_a"));

    // CONTRATO: declarar `srv_a` traz `srv_a` para o registry da sessão.
    assert_eq!(
        session.names(),
        vec!["srv_a".to_string()],
        "o registry da sessão é exatamente a declaração das opções"
    );
    // CONTRATO: `srv_b` existe no processo e NÃO entra na sessão. É esta
    // separação que impede um worker de fila de servir, numa sessão, a tool
    // registrada por outra.
    assert!(
        session.get("srv_b").is_none(),
        "servidor não declarado não pode estar no registry da sessão"
    );

    SdkMcpRegistry::global().remove("srv_a");
    SdkMcpRegistry::global().remove("srv_b");
}
