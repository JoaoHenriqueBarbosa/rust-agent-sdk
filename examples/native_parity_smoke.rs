//! Smoke de PARIDADE do transporte nativo contra um endpoint real:
//! turno 1 usa uma tool builtin (Bash) sob can_use_tool; turno 2 confere a
//! memória da sessão. Uso: ANTHROPIC_BASE_URL/ANTHROPIC_API_KEY (e opcional
//! ANTHROPIC_MODEL) no ambiente.

use std::sync::Arc;

use rust_agent_sdk::{
    ClaudeAgentOptions, ClaudeSDKClient, ContentBlock, Message, NativeApiTransport,
    PermissionResult, PermissionResultAllow,
};

#[tokio::main]
async fn main() {
    let allow: rust_agent_sdk::CanUseToolFn = Arc::new(|name, _input, _ctx| {
        println!("[can_use_tool] {name} -> allow");
        Box::pin(async { PermissionResult::Allow(PermissionResultAllow::default()) })
    });
    let options = || ClaudeAgentOptions {
        max_turns: Some(6),
        tools: Some(rust_agent_sdk::types::ToolsConfig::List(vec![
            "Bash".to_string(),
            "Read".to_string(),
        ])),
        ..Default::default()
    };
    let transport = NativeApiTransport::new(options());
    let mut client_options = options();
    client_options.can_use_tool = Some(allow);
    let mut client = ClaudeSDKClient::new(client_options).with_transport(Box::new(transport));
    client.connect().await.expect("connect");

    let secret_path = std::env::temp_dir().join(format!(
        "paridade-smoke-{}.txt",
        uuid::Uuid::new_v4().simple()
    ));
    let secret = format!("segredo-{}", uuid::Uuid::new_v4().simple());
    std::fs::write(&secret_path, &secret).expect("write secret");

    client
        .query(format!(
            "Use a tool Read para ler o arquivo {} e me diga exatamente o conteúdo dele.",
            secret_path.display()
        ).as_str())
        .await
        .expect("query 1");
    print_messages(&client.receive_response().await.expect("response 1"));

    client
        .query("Repita o conteúdo que você leu no turno anterior, sem reler o arquivo.")
        .await
        .expect("query 2");
    print_messages(&client.receive_response().await.expect("response 2"));

    println!("secret esperado: {secret}");
    let _ = std::fs::remove_file(&secret_path);

    client.disconnect().await.expect("disconnect");
}

fn print_messages(messages: &[Message]) {
    for message in messages {
        match message {
            Message::Assistant(a) => {
                for block in &a.content {
                    if let ContentBlock::Text(t) = block {
                        println!("assistant: {}", t.text);
                    }
                    if let ContentBlock::ToolUse(tu) = block {
                        println!("tool_use: {} {}", tu.name, tu.input);
                    }
                }
            }
            Message::Result(r) => println!(
                "result: subtype={} is_error={} num_turns={} cost={:?} session={}",
                r.subtype, r.is_error, r.num_turns, r.total_cost_usd, r.session_id
            ),
            _ => {}
        }
    }
}
