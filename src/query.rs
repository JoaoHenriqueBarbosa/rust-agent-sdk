use std::pin::Pin;

use futures::stream::{Stream, StreamExt};

use crate::agentic::{agentic_query, agentic_query_collect, AgenticEvent, AgenticLoopOptions};
use crate::api::client::AnthropicClient;
use crate::errors::Result;
use crate::tools::framework::{ToolContext, ToolExecutor, ToolRegistry};
use crate::tools::permission::PermissionRules;
use crate::types::PermissionMode;

/// Options for one-shot queries.
#[derive(Debug, Clone)]
pub struct QueryOptions {
    /// Anthropic API key.
    pub api_key: String,
    /// Base URL for the API.
    pub base_url: Option<String>,
    /// Model to use.
    pub model: Option<String>,
    /// Max tokens per response.
    pub max_tokens: Option<u32>,
    /// Max agentic turns.
    pub max_turns: Option<u32>,
    /// System prompt.
    pub system_prompt: Option<String>,
    /// Whether to register default tools.
    pub use_default_tools: bool,
}

impl Default for QueryOptions {
    fn default() -> Self {
        Self {
            api_key: std::env::var("ANTHROPIC_API_KEY").unwrap_or_default(),
            base_url: std::env::var("ANTHROPIC_BASE_URL").ok(),
            model: None,
            max_tokens: None,
            max_turns: None,
            system_prompt: None,
            use_default_tools: true,
        }
    }
}

fn build_client(opts: &QueryOptions) -> AnthropicClient {
    let mut client = AnthropicClient::new(&opts.api_key);
    if let Some(ref url) = opts.base_url {
        client = client.with_base_url(url.clone());
    }
    if let Some(ref model) = opts.model {
        client = client.with_model(model.clone());
    }
    if let Some(max) = opts.max_tokens {
        client = client.with_max_tokens(max);
    }
    client
}

fn build_executor(opts: &QueryOptions) -> ToolExecutor {
    let mut registry = ToolRegistry::new();
    if opts.use_default_tools {
        registry.register_defaults();
    }

    let context = ToolContext {
        working_directory: std::env::current_dir().unwrap_or_else(|_| std::path::PathBuf::from(".")),
        permission_mode: PermissionMode::BypassPermissions,
        permission_callback: None,
    };

    ToolExecutor::new(registry, context)
        .with_permission_rules(PermissionRules::allow_all())
}

fn build_loop_options(opts: &QueryOptions) -> AgenticLoopOptions {
    let system_prompt = opts
        .system_prompt
        .as_ref()
        .map(|s| vec![crate::api::types::SystemBlock::text_cached(s.clone())])
        .unwrap_or_default();

    AgenticLoopOptions {
        model: opts.model.clone().unwrap_or_else(|| "claude-sonnet-4-20250514".to_string()),
        max_tokens: opts.max_tokens.unwrap_or(16384),
        system_prompt,
        max_turns: opts.max_turns,
        ..Default::default()
    }
}

/// Execute a one-shot query and return a stream of AgenticEvents.
pub fn query(
    prompt: &str,
    options: QueryOptions,
) -> Pin<Box<dyn Stream<Item = Result<AgenticEvent>> + Send>> {
    let client = build_client(&options);
    let executor = build_executor(&options);
    let loop_options = build_loop_options(&options);

    agentic_query(client, prompt, executor, loop_options)
}

/// Execute a one-shot query and collect all events.
pub async fn query_collect(
    prompt: &str,
    options: QueryOptions,
) -> Result<Vec<AgenticEvent>> {
    let client = build_client(&options);
    let executor = build_executor(&options);
    let loop_options = build_loop_options(&options);

    agentic_query_collect(client, prompt, executor, loop_options).await
}

/// Execute a one-shot query and return just the text response.
pub async fn query_text(
    prompt: &str,
    options: QueryOptions,
) -> Result<String> {
    let events = query_collect(prompt, options).await?;

    let mut text = String::new();
    for event in events {
        if let AgenticEvent::AssistantMessage(msg) = event {
            let msg_text = msg.text();
            if !msg_text.is_empty() {
                if !text.is_empty() {
                    text.push('\n');
                }
                text.push_str(&msg_text);
            }
        }
    }
    Ok(text)
}

/// Convenience: stream only text deltas from a query.
pub fn query_text_stream(
    prompt: &str,
    options: QueryOptions,
) -> Pin<Box<dyn Stream<Item = Result<String>> + Send>> {
    let inner = query(prompt, options);
    Box::pin(async_stream::stream! {
        tokio::pin!(inner);
        while let Some(event) = inner.next().await {
            match event {
                Ok(AgenticEvent::Stream(crate::api::streaming::StreamUpdate::TextDelta { text, .. })) => {
                    yield Ok(text);
                }
                Err(e) => {
                    yield Err(e);
                    break;
                }
                _ => {}
            }
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_query_options_default() {
        let opts = QueryOptions::default();
        assert!(opts.model.is_none());
        assert!(opts.use_default_tools);
    }

    #[test]
    fn test_build_loop_options() {
        let opts = QueryOptions {
            model: Some("claude-haiku-3-20240307".to_string()),
            max_tokens: Some(2048),
            max_turns: Some(5),
            system_prompt: Some("Be helpful.".to_string()),
            ..Default::default()
        };
        let loop_opts = build_loop_options(&opts);
        assert_eq!(loop_opts.model, "claude-haiku-3-20240307");
        assert_eq!(loop_opts.max_tokens, 2048);
        assert_eq!(loop_opts.max_turns, Some(5));
        assert_eq!(loop_opts.system_prompt.len(), 1);
    }
}
