//! Smoke do transporte nativo contra um endpoint real: um turno de texto.
//! Uso: ANTHROPIC_BASE_URL/ANTHROPIC_API_KEY/ANTHROPIC_MODEL no ambiente.

use rust_agent_sdk::{ClaudeAgentOptions, ClaudeSDKClient, ContentBlock, Message, NativeApiTransport};

#[tokio::main]
async fn main() {
    let options = || ClaudeAgentOptions {
        max_turns: Some(2),
        tools: Some(rust_agent_sdk::types::ToolsConfig::List(Vec::new())),
        ..Default::default()
    };
    let transport = NativeApiTransport::new(options());
    let mut client = ClaudeSDKClient::new(options()).with_transport(Box::new(transport));
    client.connect().await.expect("connect");
    client.query("Responda apenas: ok").await.expect("query");
    let messages = client.receive_response().await.expect("response");
    client.disconnect().await.expect("disconnect");
    for message in &messages {
        match message {
            Message::Assistant(a) => {
                for block in &a.content {
                    if let ContentBlock::Text(t) = block {
                        println!("assistant: {}", t.text);
                    }
                }
            }
            Message::Result(r) => println!(
                "result: subtype={} is_error={} num_turns={} session={}",
                r.subtype, r.is_error, r.num_turns, r.session_id
            ),
            _ => {}
        }
    }
}
