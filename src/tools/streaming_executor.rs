// Port of ~/claude-code/src/services/tools/StreamingToolExecutor.ts
// Executes tools as they stream in with concurrency control.
// - Concurrent-safe tools can execute in parallel with other concurrent-safe tools
// - Non-concurrent tools must execute alone (exclusive access)
// - Results are buffered and emitted in the order tools were received

use std::sync::Arc;
use tokio::sync::{Mutex, Notify};

use crate::api::streaming::ToolUseBlock;
use crate::api::types::{ApiMessage, ContentBlock};
use crate::tools::framework::{Tool, ToolContext, ToolResult, ToolResultContent};

#[derive(Debug, Clone, PartialEq)]
enum ToolStatus {
    Queued,
    Executing,
    Completed,
    Yielded,
}

struct TrackedTool {
    id: String,
    name: String,
    input: serde_json::Value,
    status: ToolStatus,
    is_concurrency_safe: bool,
    result: Option<ToolResult>,
}

pub struct ToolResultUpdate {
    pub tool_use_id: String,
    pub tool_name: String,
    pub result: ToolResult,
}

pub struct StreamingToolExecutor {
    tools: Arc<Mutex<Vec<TrackedTool>>>,
    registry: Arc<Vec<Arc<dyn Tool>>>,
    context: Arc<ToolContext>,
    has_errored: Arc<Mutex<bool>>,
    errored_tool_description: Arc<Mutex<String>>,
    discarded: Arc<Mutex<bool>>,
    notify: Arc<Notify>,
}

impl StreamingToolExecutor {
    pub fn new(registry: Vec<Arc<dyn Tool>>, context: ToolContext) -> Self {
        Self {
            tools: Arc::new(Mutex::new(Vec::new())),
            registry: Arc::new(registry),
            context: Arc::new(context),
            has_errored: Arc::new(Mutex::new(false)),
            errored_tool_description: Arc::new(Mutex::new(String::new())),
            discarded: Arc::new(Mutex::new(false)),
            notify: Arc::new(Notify::new()),
        }
    }

    /// Discards all pending and in-progress tools. Called when streaming fallback
    /// occurs and results from the failed attempt should be abandoned.
    pub async fn discard(&self) {
        *self.discarded.lock().await = true;
        self.notify.notify_waiters();
    }

    fn find_tool(&self, name: &str) -> Option<Arc<dyn Tool>> {
        self.registry.iter().find(|t| t.name() == name).cloned()
    }

    fn get_tool_description(name: &str, input: &serde_json::Value) -> String {
        let summary = input.get("command")
            .or_else(|| input.get("file_path"))
            .or_else(|| input.get("pattern"))
            .and_then(|v| v.as_str())
            .unwrap_or("");
        if !summary.is_empty() {
            let truncated = if summary.len() > 40 {
                format!("{}…", &summary[..40])
            } else {
                summary.to_string()
            };
            format!("{name}({truncated})")
        } else {
            name.to_string()
        }
    }

    /// Add a tool to the execution queue. Will start executing immediately if conditions allow.
    pub async fn add_tool(&self, block: ToolUseBlock) {
        let tool_def = self.find_tool(&block.name);

        if tool_def.is_none() {
            let mut tools = self.tools.lock().await;
            tools.push(TrackedTool {
                id: block.id.clone(),
                name: block.name.clone(),
                input: block.input.clone(),
                status: ToolStatus::Completed,
                is_concurrency_safe: true,
                result: Some(ToolResult::error(format!(
                    "Error: No such tool available: {}", block.name
                ))),
            });
            self.notify.notify_waiters();
            return;
        }

        let is_safe = tool_def.as_ref().map(|t| t.is_concurrency_safe()).unwrap_or(false);

        {
            let mut tools = self.tools.lock().await;
            tools.push(TrackedTool {
                id: block.id.clone(),
                name: block.name.clone(),
                input: block.input.clone(),
                status: ToolStatus::Queued,
                is_concurrency_safe: is_safe,
                result: None,
            });
        }

        self.process_queue().await;
    }

    /// Check if a tool can execute based on current concurrency state
    async fn can_execute_tool(&self, is_concurrency_safe: bool) -> bool {
        let tools = self.tools.lock().await;
        let executing: Vec<_> = tools.iter().filter(|t| t.status == ToolStatus::Executing).collect();
        executing.is_empty()
            || (is_concurrency_safe && executing.iter().all(|t| t.is_concurrency_safe))
    }

    /// Process the queue, starting tools when concurrency conditions allow
    async fn process_queue(&self) {
        let indices: Vec<(usize, bool, String, serde_json::Value, String)> = {
            let tools = self.tools.lock().await;
            tools.iter().enumerate()
                .filter(|(_, t)| t.status == ToolStatus::Queued)
                .map(|(i, t)| (i, t.is_concurrency_safe, t.name.clone(), t.input.clone(), t.id.clone()))
                .collect()
        };

        for (idx, is_safe, name, input, id) in indices {
            if *self.discarded.lock().await {
                return;
            }

            if !self.can_execute_tool(is_safe).await {
                if !is_safe {
                    break;
                }
                continue;
            }

            // Mark as executing
            {
                let mut tools = self.tools.lock().await;
                if idx < tools.len() && tools[idx].status == ToolStatus::Queued {
                    tools[idx].status = ToolStatus::Executing;
                }
            }

            // Spawn execution
            let tools_arc = self.tools.clone();
            let registry = self.registry.clone();
            let context = self.context.clone();
            let has_errored = self.has_errored.clone();
            let errored_desc = self.errored_tool_description.clone();
            let discarded = self.discarded.clone();
            let notify = self.notify.clone();
            let name_clone = name.clone();
            let input_clone = input.clone();
            let id_clone = id.clone();

            tokio::spawn(async move {
                // Check if discarded or errored before running
                if *discarded.lock().await || *has_errored.lock().await {
                    let mut tools = tools_arc.lock().await;
                    if let Some(t) = tools.iter_mut().find(|t| t.id == id_clone) {
                        let reason = if *discarded.lock().await {
                            "Streaming fallback - tool execution discarded"
                        } else {
                            "Cancelled: parallel tool call errored"
                        };
                        t.result = Some(ToolResult::error(reason));
                        t.status = ToolStatus::Completed;
                    }
                    notify.notify_waiters();
                    return;
                }

                let tool = registry.iter().find(|t| t.name() == name_clone);
                let result = match tool {
                    Some(t) => t.execute(input_clone, &context).await,
                    None => ToolResult::error(format!("No such tool: {name_clone}")),
                };

                // Check if this is a Bash error — cancel siblings
                if result.is_error && name_clone == "Bash" {
                    *has_errored.lock().await = true;
                    *errored_desc.lock().await = Self::get_tool_description(&name_clone, &input);
                }

                let mut tools = tools_arc.lock().await;
                if let Some(t) = tools.iter_mut().find(|t| t.id == id_clone) {
                    t.result = Some(result);
                    t.status = ToolStatus::Completed;
                }
                drop(tools);

                notify.notify_waiters();
            });
        }
    }

    /// Get any completed results that haven't been yielded yet (non-blocking).
    /// Maintains order where necessary.
    pub async fn get_completed_results(&self) -> Vec<ToolResultUpdate> {
        if *self.discarded.lock().await {
            return Vec::new();
        }

        let mut results = Vec::new();
        let mut tools = self.tools.lock().await;

        for tool in tools.iter_mut() {
            if tool.status == ToolStatus::Yielded {
                continue;
            }

            if tool.status == ToolStatus::Completed {
                if let Some(result) = tool.result.take() {
                    let update = ToolResultUpdate {
                        tool_use_id: tool.id.clone(),
                        tool_name: tool.name.clone(),
                        result,
                    };
                    tool.status = ToolStatus::Yielded;
                    results.push(update);
                }
            } else if tool.status == ToolStatus::Executing && !tool.is_concurrency_safe {
                // Non-concurrent tool still executing — stop yielding in-order
                break;
            }
        }

        results
    }

    /// Wait for remaining tools and yield their results as they complete.
    pub async fn get_remaining_results(&self) -> Vec<ToolResultUpdate> {
        if *self.discarded.lock().await {
            return Vec::new();
        }

        let mut all_results = Vec::new();

        loop {
            if !self.has_unfinished_tools().await {
                break;
            }

            self.process_queue().await;

            let completed = self.get_completed_results().await;
            all_results.extend(completed);

            if self.has_executing_tools().await {
                // Wait for any tool to complete
                self.notify.notified().await;
            }
        }

        let final_batch = self.get_completed_results().await;
        all_results.extend(final_batch);

        all_results
    }

    async fn has_unfinished_tools(&self) -> bool {
        let tools = self.tools.lock().await;
        tools.iter().any(|t| t.status != ToolStatus::Yielded)
    }

    async fn has_executing_tools(&self) -> bool {
        let tools = self.tools.lock().await;
        tools.iter().any(|t| t.status == ToolStatus::Executing)
    }

    /// Build a user message containing all tool results.
    pub fn build_tool_results_message(results: &[ToolResultUpdate]) -> ApiMessage {
        let content: Vec<ContentBlock> = results
            .iter()
            .map(|r| {
                let api_content = r.result.to_api_content();
                ContentBlock::ToolResult {
                    tool_use_id: r.tool_use_id.clone(),
                    content: Some(api_content),
                    is_error: if r.result.is_error { Some(true) } else { None },
                    cache_control: None,
                }
            })
            .collect();

        ApiMessage::user(content)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use async_trait::async_trait;

    struct MockTool {
        name: &'static str,
        concurrent: bool,
        delay_ms: u64,
    }

    #[async_trait]
    impl Tool for MockTool {
        fn name(&self) -> &str { self.name }
        fn description(&self) -> &str { "mock" }
        fn input_schema(&self) -> serde_json::Value { serde_json::json!({"type": "object"}) }
        fn is_concurrency_safe(&self) -> bool { self.concurrent }
        async fn execute(&self, _input: serde_json::Value, _ctx: &ToolContext) -> ToolResult {
            if self.delay_ms > 0 {
                tokio::time::sleep(std::time::Duration::from_millis(self.delay_ms)).await;
            }
            ToolResult::text(format!("executed {}", self.name))
        }
    }

    #[tokio::test]
    async fn test_streaming_executor_basic() {
        let tools: Vec<Arc<dyn Tool>> = vec![
            Arc::new(MockTool { name: "Read", concurrent: true, delay_ms: 0 }),
        ];
        let ctx = ToolContext::default();
        let executor = StreamingToolExecutor::new(tools, ctx);

        executor.add_tool(ToolUseBlock {
            id: "t1".into(),
            name: "Read".into(),
            input: serde_json::json!({}),
        }).await;

        let results = executor.get_remaining_results().await;
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].tool_use_id, "t1");
        assert!(!results[0].result.is_error);
    }

    #[tokio::test]
    async fn test_streaming_executor_concurrent() {
        let tools: Vec<Arc<dyn Tool>> = vec![
            Arc::new(MockTool { name: "Read", concurrent: true, delay_ms: 50 }),
            Arc::new(MockTool { name: "Glob", concurrent: true, delay_ms: 50 }),
        ];
        let ctx = ToolContext::default();
        let executor = StreamingToolExecutor::new(tools, ctx);

        executor.add_tool(ToolUseBlock { id: "t1".into(), name: "Read".into(), input: serde_json::json!({}) }).await;
        executor.add_tool(ToolUseBlock { id: "t2".into(), name: "Glob".into(), input: serde_json::json!({}) }).await;

        let start = std::time::Instant::now();
        let results = executor.get_remaining_results().await;
        let elapsed = start.elapsed();

        assert_eq!(results.len(), 2);
        // Both should run in parallel — total time should be ~50ms not ~100ms
        assert!(elapsed.as_millis() < 90, "took {}ms, expected parallel execution", elapsed.as_millis());
    }

    #[tokio::test]
    async fn test_streaming_executor_unknown_tool() {
        let tools: Vec<Arc<dyn Tool>> = vec![];
        let ctx = ToolContext::default();
        let executor = StreamingToolExecutor::new(tools, ctx);

        executor.add_tool(ToolUseBlock { id: "t1".into(), name: "Nonexistent".into(), input: serde_json::json!({}) }).await;

        let results = executor.get_remaining_results().await;
        assert_eq!(results.len(), 1);
        assert!(results[0].result.is_error);
    }

    #[tokio::test]
    async fn test_streaming_executor_discard() {
        let tools: Vec<Arc<dyn Tool>> = vec![
            Arc::new(MockTool { name: "Read", concurrent: true, delay_ms: 200 }),
        ];
        let ctx = ToolContext::default();
        let executor = StreamingToolExecutor::new(tools, ctx);

        executor.add_tool(ToolUseBlock { id: "t1".into(), name: "Read".into(), input: serde_json::json!({}) }).await;
        executor.discard().await;

        let results = executor.get_remaining_results().await;
        assert!(results.is_empty());
    }
}
