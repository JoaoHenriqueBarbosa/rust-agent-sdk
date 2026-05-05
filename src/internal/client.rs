use std::env;
use std::pin::Pin;

use async_stream::stream;
use futures::Stream;

use crate::errors::{ClaudeSDKError, Result};
use crate::internal::message_parser::parse_message;
use crate::internal::query::Query;
use crate::internal::session_resume::{
    apply_materialized_options, materialize_resume_session,
};
use crate::internal::session_store_validation::validate_session_store_options;
use crate::internal::transport::Transport;
use crate::types::{ClaudeAgentOptions, Message};

/// Internal client that manages the query lifecycle.
pub struct InternalClient;

impl InternalClient {
    pub fn new() -> Self {
        Self
    }

    /// Process a query prompt and return a stream of parsed Messages.
    ///
    /// Faithful port of the Python `process_query` async generator.
    /// Uses `async-stream` to yield messages one by one as they arrive.
    pub fn process_query(
        &self,
        prompt: String,
        options: ClaudeAgentOptions,
        transport: Option<Box<dyn Transport>>,
    ) -> Pin<Box<dyn Stream<Item = Result<Message>> + Send>> {
        Box::pin(stream! {
            // Fail fast on invalid session_store option combinations.
            if let Err(e) = validate_session_store_options(&options) {
                yield Err(e);
                return;
            }

            // resume/continue + session_store: load session from store into a
            // temp CLAUDE_CONFIG_DIR. Skipped when a custom transport is supplied.
            let materialized = if transport.is_none() {
                match materialize_resume_session(&options).await {
                    Ok(m) => m,
                    Err(e) => {
                        yield Err(e);
                        return;
                    }
                }
            } else {
                None
            };

            // Validate and configure permission settings.
            // process_query always receives a String prompt (one-shot path),
            // which doesn't support bidirectional control requests needed by
            // can_use_tool. The streaming path goes through ClaudeSDKClient.
            let mut options = options;
            if options.can_use_tool.is_some() {
                yield Err(ClaudeSDKError::sdk(
                    "can_use_tool callback requires streaming mode. \
                     Please provide prompt as an AsyncIterable instead of a string.",
                ));
                if let Some(ref m) = materialized { let _ = m.cleanup().await; }
                return;
            }

            if let Some(m) = materialized.as_ref() {
                options = apply_materialized_options(options, m);
            }

            // Extract fields from options before it's moved into the transport
            use crate::types::{SystemPromptConfig, SystemPrompt};
            let exclude_dynamic_sections = match &options.system_prompt {
                Some(SystemPromptConfig::Structured(SystemPrompt::Preset { exclude_dynamic_sections, .. })) => {
                    *exclude_dynamic_sections
                }
                _ => None,
            };
            let agents_json = options.agents.as_ref().map(|agents| {
                let map: serde_json::Map<String, serde_json::Value> = agents
                    .iter()
                    .map(|(name, def)| {
                        (name.clone(), serde_json::to_value(def).unwrap_or_default())
                    })
                    .collect();
                serde_json::Value::Object(map)
            });
            let skills = options.skills.clone();

            // Use provided transport or create subprocess transport
            let mut chosen_transport: Box<dyn Transport> = match transport {
                Some(t) => t,
                None => Box::new(
                    crate::internal::transport::SubprocessCLITransport::new(&prompt, options),
                ),
            };

            // Connect transport
            if let Err(e) = chosen_transport.connect().await {
                if let Some(ref m) = materialized { let _ = m.cleanup().await; }
                yield Err(e);
                return;
            }

            // Calculate initialize timeout from env var
            let initialize_timeout_ms: f64 = env::var("CLAUDE_CODE_STREAM_CLOSE_TIMEOUT")
                .ok()
                .and_then(|v| v.parse::<f64>().ok())
                .unwrap_or(60000.0);
            let initialize_timeout = (initialize_timeout_ms / 1000.0).max(60.0);

            // Create Query to handle control protocol
            let mut query = Query::new(chosen_transport, true, initialize_timeout);

            // Configure agents, exclude_dynamic_sections, skills on the query
            if let Some(agents) = agents_json {
                query.set_agents(agents);
            }
            if let Some(eds) = exclude_dynamic_sections {
                query.set_exclude_dynamic_sections(eds);
            }
            if let Some(ref sk) = skills {
                query.set_skills(sk.clone());
            }

            // Start, initialize, write user message, spawn end_input handler
            let setup_err = async {
                query.start().await?;
                query.initialize().await?;
                query.write_user_message(&prompt).await?;
                query.spawn_wait_for_result_and_end_input();
                Ok::<(), ClaudeSDKError>(())
            }.await.err();

            if let Some(e) = setup_err {
                let _ = query.close().await;
                if let Some(ref m) = materialized { let _ = m.cleanup().await; }
                yield Err(e);
                return;
            }

            // Stream messages one by one (matching Python's async generator pattern)
            loop {
                match query.next_message().await {
                    Ok(None) => break,
                    Ok(Some(data)) => {
                        if let Ok(Some(msg)) = parse_message(&data) {
                            yield Ok(msg);
                        }
                    }
                    Err(e) => {
                        yield Err(e);
                        break;
                    }
                }
            }

            // Always close query
            let _ = query.close().await;

            // Cleanup temp dir on every exit path
            if let Some(ref m) = materialized {
                let _ = m.cleanup().await;
            }
        })
    }

    /// Collect all messages from process_query into a Vec.
    ///
    /// Convenience for callers that don't need streaming.
    pub async fn process_query_collect(
        &self,
        prompt: &str,
        options: ClaudeAgentOptions,
        transport: Option<Box<dyn Transport>>,
    ) -> Result<Vec<Message>> {
        use futures::StreamExt;

        let mut stream = self.process_query(prompt.to_string(), options, transport);
        let mut messages = Vec::new();
        while let Some(result) = stream.next().await {
            messages.push(result?);
        }
        Ok(messages)
    }
}
