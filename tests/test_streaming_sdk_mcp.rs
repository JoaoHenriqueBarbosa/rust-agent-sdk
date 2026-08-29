//! Contrato do caminho STREAMING (`ClaudeSDKClient`): o MCP in-process é
//! servido a partir do registry da SESSÃO, que são os handles carregados pelas
//! próprias `ClaudeAgentOptions`.
//!
//! Estes testes são o travamento do conserto do registry global. Enquanto
//! existia um `SdkMcpRegistry::global()` indexado por nome, duas sessões
//! concorrentes com servidores homônimos pegavam a MESMA entrada (a última
//! registrada vencia) e nada jamais removia a entrada — um processo de vida
//! longa vazava um `SdkMcpServer` inteiro por sessão aberta. Agora as opções
//! carregam o `Arc<SdkMcpServer>`, e é isso que os três primeiros testes
//! provam: isolamento entre homônimas, liberação ao fim da sessão, e recusa de
//! servidor não declarado.
//!
//! O transporte roteirizado daqui nunca dá EOF (igual ao CLI real com o stdin
//! aberto) e injeta o `control_request{subtype:"mcp_message"}` que o CLI mandaria
//! ao chamar uma tool. A resposta do cliente é capturada do lado do `write`.

use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use rust_agent_sdk::sdk_mcp::{SdkMcpServer, ToolInputSchema, ToolOutput};
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

/// Opções declarando um único servidor `sdk` pelo NOME, sem entregar handle.
/// Serve para provar que o nome sozinho não produz servidor.
fn options_naming_only(server_name: &str) -> ClaudeAgentOptions {
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
// 1. Duas sessões concorrentes com servidores HOMÔNIMOS não se misturam
// ---------------------------------------------------------------------------

/// Este é o teste do bug. Com o registry global indexado por nome, as duas
/// sessões abaixo resolveriam `srv` para o MESMO servidor — o último registrado
/// — e uma delas receberia a tool da outra, com resposta bem formada e valor
/// errado. É exatamente o cenário do worker da F3: uma sessão por documento, no
/// mesmo processo, com o mesmo nome de servidor.
#[tokio::test]
async fn two_concurrent_sessions_with_homonymous_servers_stay_isolated() {
    // MESMO nome, comportamentos diferentes.
    let name = "srv";

    let mut options_a = ClaudeAgentOptions::default();
    options_a.add_sdk_mcp_server(server_saying(name, "sou-da-sessao-a"));
    let mut options_b = ClaudeAgentOptions::default();
    options_b.add_sdk_mcp_server(server_saying(name, "sou-da-sessao-b"));

    let script_a = Arc::new(Mutex::new(Script::default()));
    let script_b = Arc::new(Mutex::new(Script::default()));
    let mut client_a =
        ClaudeSDKClient::new(options_a).with_transport(Box::new(ScriptedTransport {
            connected: false,
            script: Arc::clone(&script_a),
        }));
    let mut client_b =
        ClaudeSDKClient::new(options_b).with_transport(Box::new(ScriptedTransport {
            connected: false,
            script: Arc::clone(&script_b),
        }));

    // As duas sessões ficam abertas ao mesmo tempo — é a concorrência que o bug
    // exigia para se manifestar.
    tokio::time::timeout(STEP_TIMEOUT, client_a.connect())
        .await
        .expect("connect A não pode pendurar")
        .expect("connect A precisa completar o handshake");
    tokio::time::timeout(STEP_TIMEOUT, client_b.connect())
        .await
        .expect("connect B não pode pendurar")
        .expect("connect B precisa completar o handshake");

    script_a
        .lock()
        .unwrap()
        .outgoing
        .push_back(mcp_call("mcp_a", name, "whoami"));
    script_b
        .lock()
        .unwrap()
        .outgoing
        .push_back(mcp_call("mcp_b", name, "whoami"));

    let (text_a, text_b) = tokio::time::timeout(STEP_TIMEOUT, async {
        loop {
            if let (Some(a), Some(b)) = (
                mcp_reply_text(&script_a, "mcp_a"),
                mcp_reply_text(&script_b, "mcp_b"),
            ) {
                return (a, b);
            }
            let _ = tokio::time::timeout(Duration::from_millis(20), client_a.next_message()).await;
            let _ = tokio::time::timeout(Duration::from_millis(20), client_b.next_message()).await;
        }
    })
    .await
    .expect("as duas sessões precisam responder ao seu mcp_message");

    // CONTRATO: cada sessão recebe a SUA tool. Com o registry global por nome,
    // as duas responderiam a mesma etiqueta (a do último `register()`).
    assert_eq!(
        text_a, "sou-da-sessao-a",
        "a sessão A tem de ser servida pelo servidor que ELA declarou"
    );
    assert_eq!(
        text_b, "sou-da-sessao-b",
        "a sessão B tem de ser servida pelo servidor que ELA declarou"
    );
}

// ---------------------------------------------------------------------------
// 2. Sessão encerrada não deixa o servidor vivo no processo
// ---------------------------------------------------------------------------

/// Vazamento provado por observação, não por leitura: um `Weak` para o servidor
/// declarado. Enquanto o global existia, o `Arc` ficava no `static` para sempre
/// e este `upgrade()` continuaria devolvendo `Some` depois da sessão morrer —
/// carregando junto tudo que as closures das tools capturam (no ahamkara, um
/// `Arc<PgPool>` por sessão).
#[tokio::test]
async fn a_finished_session_leaves_no_residual_server_in_the_process() {
    let server = Arc::new(server_saying("srv_efemero", "vivo"));
    let observer = Arc::downgrade(&server);

    let script = Arc::new(Mutex::new(Script::default()));
    {
        let mut options = ClaudeAgentOptions::default();
        options.add_sdk_mcp_server(Arc::clone(&server));
        // O teste solta a sua própria referência: daqui em diante os únicos
        // donos são as opções e o `Query` da sessão.
        drop(server);

        let mut client =
            ClaudeSDKClient::new(options).with_transport(Box::new(ScriptedTransport {
                connected: false,
                script: Arc::clone(&script),
            }));
        tokio::time::timeout(STEP_TIMEOUT, client.connect())
            .await
            .expect("connect não pode pendurar")
            .expect("connect precisa completar o handshake");

        script
            .lock()
            .unwrap()
            .outgoing
            .push_back(mcp_call("mcp_vivo", "srv_efemero", "whoami"));

        let text = tokio::time::timeout(STEP_TIMEOUT, async {
            loop {
                if let Some(text) = mcp_reply_text(&script, "mcp_vivo") {
                    return text;
                }
                let _ =
                    tokio::time::timeout(Duration::from_millis(20), client.next_message()).await;
            }
        })
        .await
        .expect("a sessão precisa responder enquanto está viva");

        // Pré-condição: enquanto a sessão vive, o servidor serve. Sem isto o
        // teste do vazamento passaria trivialmente com um servidor natimorto.
        assert_eq!(
            text, "vivo",
            "o servidor tem de estar servindo antes de medirmos a sua morte"
        );
        assert!(
            observer.upgrade().is_some(),
            "com a sessão aberta, o servidor obviamente ainda existe"
        );

        let _ = client.disconnect().await;
    }

    // CONTRATO: fechada a sessão e soltas as opções, NADA no processo segura o
    // servidor. `upgrade()` devolve `None` porque a contagem forte chegou a
    // zero — é a observação direta de que não há vazamento.
    assert!(
        observer.upgrade().is_none(),
        "sessão encerrada não pode deixar o SdkMcpServer vivo no processo"
    );
}

// ---------------------------------------------------------------------------
// 3. Servidor não declarado continua sendo erro
// ---------------------------------------------------------------------------

#[tokio::test]
async fn streaming_client_refuses_a_server_it_did_not_declare() {
    // Um servidor homônimo do alheio existe no processo, vivo, em outras opções
    // — como se fosse a sessão vizinha do worker.
    let mut alheias = ClaudeAgentOptions::default();
    alheias.add_sdk_mcp_server(server_saying("srv_alheio", "sou-o-alheio"));

    let mut minhas = ClaudeAgentOptions::default();
    minhas.add_sdk_mcp_server(server_saying("srv_meu", "sou-o-meu"));

    let script = Arc::new(Mutex::new(Script::default()));
    let mut client = ClaudeSDKClient::new(minhas).with_transport(Box::new(ScriptedTransport {
        connected: false,
        script: Arc::clone(&script),
    }));

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

    // CONTRATO: a sessão responde ERRO, não a tool do servidor alheio. É a
    // regressão que a remoção do fallback global comprou e não pode voltar: a
    // resposta do fallback era bem formada, só vinha do servidor errado.
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

    // O alheio segue vivo e servível nas SUAS opções: a recusa foi de
    // roteamento, não de o servidor ter sumido.
    assert_eq!(
        alheias.sdk_mcp_servers.names(),
        vec!["srv_alheio".to_string()],
        "o servidor da outra sessão continua sendo dela"
    );
}

// ---------------------------------------------------------------------------
// 4. Declarar só o NOME não produz servidor
// ---------------------------------------------------------------------------

#[tokio::test]
async fn naming_a_server_without_handing_the_handle_serves_nothing() {
    // Existe um servidor com este nome no processo — em OUTRAS opções.
    let mut alheias = ClaudeAgentOptions::default();
    alheias.add_sdk_mcp_server(server_saying("srv_so_nome", "nao-deveria-ser-servido"));

    let script = Arc::new(Mutex::new(Script::default()));
    let mut client = ClaudeSDKClient::new(options_naming_only("srv_so_nome")).with_transport(
        Box::new(ScriptedTransport {
            connected: false,
            script: Arc::clone(&script),
        }),
    );

    tokio::time::timeout(STEP_TIMEOUT, client.connect())
        .await
        .expect("connect não pode pendurar")
        .expect("connect precisa completar o handshake");

    script
        .lock()
        .unwrap()
        .outgoing
        .push_back(mcp_call("mcp_so_nome", "srv_so_nome", "whoami"));

    let outcome = tokio::time::timeout(STEP_TIMEOUT, async {
        loop {
            if let Some(reply) = mcp_reply_for(&script, "mcp_so_nome") {
                return reply;
            }
            let _ = tokio::time::timeout(Duration::from_millis(50), client.next_message()).await;
        }
    })
    .await
    .expect("o streaming precisa responder");

    // CONTRATO: o nome no `--mcp-config` é declaração para o CLI, não
    // identidade. Sem handle nas opções não há a quem entregar o `mcp_message`,
    // e a resposta é erro — nunca o servidor homônimo de outra sessão.
    assert_eq!(
        outcome.get("subtype").and_then(|s| s.as_str()),
        Some("error"),
        "nome sem handle não pode ser resolvido para o servidor de ninguém"
    );

    drop(alheias);
}
