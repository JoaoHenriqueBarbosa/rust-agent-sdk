use std::pin::Pin;

use futures::Stream;

use crate::errors::Result;
use crate::internal::client::InternalClient;
use crate::internal::transport::Transport;
use crate::types::{ClaudeAgentOptions, Message};

/// Execute a one-shot query against Claude Code.
///
/// Returns a stream of Messages. For sustained bidirectional
/// conversations, use `ClaudeSDKClient` instead.
pub fn query(
    prompt: &str,
    options: Option<ClaudeAgentOptions>,
    transport: Option<Box<dyn Transport>>,
) -> Pin<Box<dyn Stream<Item = Result<Message>> + Send>> {
    let options = options.unwrap_or_default();
    let client = InternalClient::new();
    client.process_query(prompt.to_string(), options, transport)
}

/// Execute a one-shot query and collect all messages into a Vec.
pub async fn query_collect(
    prompt: &str,
    options: Option<ClaudeAgentOptions>,
    transport: Option<Box<dyn Transport>>,
) -> Result<Vec<Message>> {
    let options = options.unwrap_or_default();
    let client = InternalClient::new();
    client.process_query_collect(prompt, options, transport).await
}
