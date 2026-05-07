use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use futures::stream::{Stream, StreamExt};

use crate::agentic::{AgenticEvent, AgenticLoop, AgenticLoopOptions};
use crate::api::client::AnthropicClient;
use crate::api::streaming::StreamUpdate;
use crate::api::types::{ApiMessage, ContentBlock, SystemBlock};
use crate::errors::Result;
use crate::tools::framework::{Tool, ToolContext, ToolExecutor, ToolPermissionRequest, ToolRegistry};
use crate::tools::permission::PermissionRules;
use crate::types::PermissionMode;

// ---------------------------------------------------------------------------
// SDK client options
// ---------------------------------------------------------------------------

/// Callback type for permission prompts.
/// Receives a ToolPermissionRequest, returns true to allow, false to deny.
pub type PermissionCallbackFn = Arc<
    dyn Fn(ToolPermissionRequest) -> Pin<Box<dyn Future<Output = bool> + Send>>
        + Send
        + Sync,
>;

/// Options for configuring the SDK client.
pub struct ClaudeSDKClientOptions {
    /// Anthropic API key. Falls back to ANTHROPIC_API_KEY env var.
    pub api_key: Option<String>,
    /// Base URL for the API. Falls back to ANTHROPIC_BASE_URL env var.
    pub base_url: Option<String>,
    /// Model to use (default: claude-sonnet-4-20250514).
    pub model: Option<String>,
    /// Max tokens per response (default: 16384).
    pub max_tokens: Option<u32>,
    /// Max agentic loop turns (None = unlimited).
    pub max_turns: Option<u32>,
    /// System prompt text.
    pub system_prompt: Option<String>,
    /// Working directory for tool execution.
    pub cwd: Option<std::path::PathBuf>,
    /// Permission mode for tool execution.
    pub permission_mode: Option<PermissionMode>,
    /// Custom tools to register alongside the built-in ones.
    /// Each tool is wrapped in Arc so it can be shared across loop iterations.
    pub custom_tools: Vec<Arc<dyn Tool>>,
    /// Whether to register the default built-in tools (default: true).
    pub use_default_tools: bool,
    /// Permission rules for tools.
    pub permission_rules: Option<PermissionRules>,
    /// Temperature for API calls.
    pub temperature: Option<f64>,
    /// Callback for tool permission prompts.
    /// Called when permission_mode is not BypassPermissions and no explicit allow/deny rule matches.
    pub permission_callback: Option<PermissionCallbackFn>,
}

impl Default for ClaudeSDKClientOptions {
    fn default() -> Self {
        Self {
            api_key: None,
            base_url: None,
            model: None,
            max_tokens: None,
            max_turns: None,
            system_prompt: None,
            cwd: None,
            permission_mode: None,
            custom_tools: Vec::new(),
            use_default_tools: true,
            permission_rules: None,
            temperature: None,
            permission_callback: None,
        }
    }
}

impl std::fmt::Debug for ClaudeSDKClientOptions {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ClaudeSDKClientOptions")
            .field("model", &self.model)
            .field("max_tokens", &self.max_tokens)
            .field("max_turns", &self.max_turns)
            .field("permission_mode", &self.permission_mode)
            .field("cwd", &self.cwd)
            .finish_non_exhaustive()
    }
}

// ---------------------------------------------------------------------------
// SDK client
// ---------------------------------------------------------------------------

/// High-level client for interacting with Claude via the Anthropic API.
///
/// Uses the native HTTP transport — no CLI subprocess needed.
///
/// # Example
/// ```no_run
/// use rust_agent_sdk::client::{ClaudeSDKClient, ClaudeSDKClientOptions};
///
/// #[tokio::main]
/// async fn main() {
///     let client = ClaudeSDKClient::new(ClaudeSDKClientOptions::default());
///     let messages = client.send_message("Hello!").await.unwrap();
/// }
/// ```
pub struct ClaudeSDKClient {
    anthropic_client: AnthropicClient,
    options: AgenticLoopOptions,
    tool_executor_factory: ToolExecutorFactory,
    messages: Vec<ApiMessage>,
}

/// Factory to create fresh ToolExecutors (since they're consumed by AgenticLoop).
struct ToolExecutorFactory {
    cwd: std::path::PathBuf,
    permission_mode: PermissionMode,
    permission_rules: PermissionRules,
    permission_callback: Option<PermissionCallbackFn>,
    custom_tools: Vec<Arc<dyn Tool>>,
    use_defaults: bool,
}

impl ToolExecutorFactory {
    fn create(&self) -> ToolExecutor {
        let mut registry = ToolRegistry::new();

        if self.use_defaults {
            registry.register_defaults();
        }

        for tool in &self.custom_tools {
            registry.register_shared(tool.clone());
        }

        let context = ToolContext {
            working_directory: self.cwd.clone(),
            permission_mode: self.permission_mode.clone(),
            permission_callback: self.permission_callback.clone(),
        };

        ToolExecutor::new(registry, context)
            .with_permission_rules(self.permission_rules.clone())
    }
}

impl ClaudeSDKClient {
    /// Create a new SDK client.
    pub fn new(options: ClaudeSDKClientOptions) -> Self {
        let api_key = options
            .api_key
            .or_else(|| std::env::var("ANTHROPIC_API_KEY").ok())
            .unwrap_or_default();

        let mut anthropic_client = AnthropicClient::new(api_key);

        if let Some(base_url) = options.base_url.or_else(|| std::env::var("ANTHROPIC_BASE_URL").ok()) {
            anthropic_client = anthropic_client.with_base_url(base_url);
        }

        let model = options
            .model
            .unwrap_or_else(|| "claude-sonnet-4-20250514".to_string());
        let max_tokens = options.max_tokens.unwrap_or(16384);

        anthropic_client = anthropic_client
            .with_model(model.clone())
            .with_max_tokens(max_tokens);

        let system_prompt = options
            .system_prompt
            .map(|s| vec![SystemBlock::text_cached(s)])
            .unwrap_or_default();

        let permission_mode = options
            .permission_mode
            .unwrap_or(PermissionMode::BypassPermissions);

        let permission_rules = options
            .permission_rules
            .unwrap_or_else(PermissionRules::allow_all);

        let cwd = options
            .cwd
            .unwrap_or_else(|| std::env::current_dir().unwrap_or_else(|_| std::path::PathBuf::from(".")));

        let loop_options = AgenticLoopOptions {
            model,
            max_tokens,
            system_prompt,
            max_turns: options.max_turns,
            initial_messages: Vec::new(),
            temperature: options.temperature,
            tool_choice: None,
            thinking: None,
            stop_sequences: None,
            cache_last_n_messages: 2,
            context_window_tokens: 200_000,
            include_stream_events: true,
            abort: None,
            fallback_model: None,
        };

        Self {
            anthropic_client,
            options: loop_options,
            tool_executor_factory: ToolExecutorFactory {
                cwd,
                permission_mode,
                permission_rules,
                permission_callback: options.permission_callback,
                custom_tools: options.custom_tools,
                use_defaults: options.use_default_tools,
            },
            messages: Vec::new(),
        }
    }

    /// Send a message and collect all response events.
    /// Returns the final text response.
    pub async fn send_message(&self, prompt: &str) -> Result<String> {
        let events = self.send_message_events(prompt).await?;

        let mut text = String::new();
        for event in events {
            if let AgenticEvent::Assistant { ref message, .. } = event {
                let message_text = message.text();
                if !message_text.is_empty() {
                    if !text.is_empty() {
                        text.push('\n');
                    }
                    text.push_str(&message_text);
                }
            }
        }

        Ok(text)
    }

    /// Send a message and collect all agentic events.
    pub async fn send_message_events(&self, prompt: &str) -> Result<Vec<AgenticEvent>> {
        let stream = self.send_message_stream(prompt);
        tokio::pin!(stream);

        let mut events = Vec::new();
        while let Some(result) = stream.next().await {
            events.push(result?);
        }
        Ok(events)
    }

    /// Send a message and return a stream of agentic events.
    pub fn send_message_stream(
        &self,
        prompt: &str,
    ) -> Pin<Box<dyn Stream<Item = Result<AgenticEvent>> + Send>> {
        let mut opts = self.options.clone();
        opts.initial_messages = self.messages.clone();
        opts.initial_messages
            .push(ApiMessage::user(vec![ContentBlock::text(prompt)]));

        let executor = self.tool_executor_factory.create();
        let agentic_loop = AgenticLoop::new(self.anthropic_client.clone(), executor, opts);
        agentic_loop.stream()
    }

    /// Send a message and stream only text deltas (for simple output).
    pub fn send_message_text_stream(
        &self,
        prompt: &str,
    ) -> Pin<Box<dyn Stream<Item = Result<String>> + Send>> {
        let inner = self.send_message_stream(prompt);
        Box::pin(async_stream::stream! {
            tokio::pin!(inner);
            while let Some(event) = inner.next().await {
                match event {
                    Ok(AgenticEvent::StreamEvent { event: StreamUpdate::TextDelta { text, .. }, .. }) => {
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

    /// Get a reference to the underlying AnthropicClient.
    pub fn anthropic_client(&self) -> &AnthropicClient {
        &self.anthropic_client
    }

    /// Get accumulated messages from previous turns.
    pub fn messages(&self) -> &[ApiMessage] {
        &self.messages
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_client_default_options() {
        let opts = ClaudeSDKClientOptions::default();
        assert!(opts.api_key.is_none());
        assert!(opts.model.is_none());
        assert!(opts.max_turns.is_none());
    }

    #[test]
    fn test_client_creation() {
        let client = ClaudeSDKClient::new(ClaudeSDKClientOptions {
            api_key: Some("test-key".to_string()),
            model: Some("claude-haiku-3-20240307".to_string()),
            max_tokens: Some(4096),
            ..Default::default()
        });

        assert_eq!(client.options.model, "claude-haiku-3-20240307");
        assert_eq!(client.options.max_tokens, 4096);
    }
}
