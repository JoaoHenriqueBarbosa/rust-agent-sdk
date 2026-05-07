use std::future::Future;
use std::path::PathBuf;
use std::pin::Pin;
use std::sync::Arc;

use async_trait::async_trait;
use futures::stream::Stream;

use crate::api::types::{CacheControl, ContentBlock, ToolDefinition, ToolResultContent as ApiToolResultContent};
use crate::tools::permission::{PermissionDecision, PermissionRules};
use crate::types::PermissionMode;

// ---------------------------------------------------------------------------
// Tool trait
// ---------------------------------------------------------------------------

/// Permission request sent to the callback when a tool needs user approval.
#[derive(Debug, Clone)]
pub struct ToolPermissionRequest {
    pub tool_name: String,
    pub description: String,
    pub input: serde_json::Value,
}

/// Context passed to tool execution.
pub struct ToolContext {
    pub working_directory: PathBuf,
    pub permission_mode: PermissionMode,
    /// Callback for asking user permission. Returns true if allowed.
    pub permission_callback: Option<
        Arc<
            dyn Fn(ToolPermissionRequest) -> Pin<Box<dyn Future<Output = bool> + Send>>
                + Send
                + Sync,
        >,
    >,
}

impl std::fmt::Debug for ToolContext {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ToolContext")
            .field("working_directory", &self.working_directory)
            .field("permission_mode", &self.permission_mode)
            .field("has_permission_callback", &self.permission_callback.is_some())
            .finish()
    }
}

impl Default for ToolContext {
    fn default() -> Self {
        Self {
            working_directory: std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")),
            permission_mode: PermissionMode::Default,
            permission_callback: None,
        }
    }
}

/// Result of executing a tool.
#[derive(Debug, Clone)]
pub struct ToolResult {
    pub content: Vec<ToolResultContent>,
    pub is_error: bool,
}

impl ToolResult {
    pub fn text(text: impl Into<String>) -> Self {
        Self {
            content: vec![ToolResultContent::Text(text.into())],
            is_error: false,
        }
    }

    pub fn error(text: impl Into<String>) -> Self {
        Self {
            content: vec![ToolResultContent::Text(text.into())],
            is_error: true,
        }
    }

    pub fn image(data: String, media_type: String) -> Self {
        Self {
            content: vec![ToolResultContent::Image { data, media_type }],
            is_error: false,
        }
    }

    pub fn mixed(content: Vec<ToolResultContent>) -> Self {
        Self {
            content,
            is_error: false,
        }
    }

    /// Convert to API content blocks for the tool_result message.
    pub fn to_api_content(&self) -> Vec<ApiToolResultContent> {
        self.content
            .iter()
            .map(|c| match c {
                ToolResultContent::Text(text) => ApiToolResultContent::Text { text: text.clone() },
                ToolResultContent::Image { data, media_type } => {
                    ApiToolResultContent::Image {
                        source: crate::api::types::ImageSource {
                            r#type: "base64".to_string(),
                            media_type: media_type.clone(),
                            data: data.clone(),
                        },
                    }
                }
            })
            .collect()
    }
}

/// Content types that a tool can return.
#[derive(Debug, Clone)]
pub enum ToolResultContent {
    Text(String),
    Image { data: String, media_type: String },
}

/// The core trait that all tools must implement.
#[async_trait]
pub trait Tool: Send + Sync {
    /// Unique name of the tool (used in API calls).
    fn name(&self) -> &str;

    /// Description of the tool for the model.
    fn description(&self) -> &str;

    /// JSON Schema for the tool's input parameters.
    fn input_schema(&self) -> serde_json::Value;

    /// Whether this tool can safely run concurrently with other safe tools.
    fn is_concurrency_safe(&self) -> bool {
        false
    }

    /// Execute the tool with the given input.
    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult;
}

// ---------------------------------------------------------------------------
// Tool registry
// ---------------------------------------------------------------------------

/// Registry that holds all available tools.
pub struct ToolRegistry {
    tools: Vec<Box<dyn Tool>>,
    shared_tools: Vec<Arc<dyn Tool>>,
}

impl ToolRegistry {
    pub fn new() -> Self {
        Self { tools: Vec::new(), shared_tools: Vec::new() }
    }

    /// Register a tool (owned).
    pub fn register(&mut self, tool: Box<dyn Tool>) {
        self.tools.push(tool);
    }

    /// Register a shared tool (Arc). Useful for tools that need to be
    /// cloned across multiple registries.
    pub fn register_shared(&mut self, tool: Arc<dyn Tool>) {
        self.shared_tools.push(tool);
    }

    /// Register all default built-in tools.
    pub fn register_defaults(&mut self) {
        use crate::tools::*;

        self.register(Box::new(bash::BashTool::default()));
        self.register(Box::new(file_read::FileReadTool));
        self.register(Box::new(file_write::FileWriteTool));
        self.register(Box::new(file_edit::FileEditTool));
        self.register(Box::new(glob_tool::GlobTool));
        self.register(Box::new(grep::GrepTool));
        self.register(Box::new(notebook::NotebookEditTool));
        self.register(Box::new(ask_user::AskUserQuestionTool));
        self.register(Box::new(todo::TodoWriteTool));
        self.register(Box::new(tasks::TaskCreateTool));
        self.register(Box::new(tasks::TaskGetTool));
        self.register(Box::new(tasks::TaskListTool));
        self.register(Box::new(tasks::TaskUpdateTool));
        self.register(Box::new(tasks::TaskStopTool));
        self.register(Box::new(tasks::TaskOutputTool));
    }

    /// Iterator over all tools (owned + shared).
    fn all_tools(&self) -> impl Iterator<Item = &dyn Tool> {
        self.tools.iter().map(|t| t.as_ref())
            .chain(self.shared_tools.iter().map(|t| t.as_ref()))
    }

    /// Find a tool by name.
    pub fn get(&self, name: &str) -> Option<&dyn Tool> {
        self.all_tools().find(|t| t.name() == name)
    }

    /// Get all tool names.
    pub fn names(&self) -> Vec<&str> {
        self.all_tools().map(|t| t.name()).collect()
    }

    /// Number of registered tools.
    pub fn len(&self) -> usize {
        self.tools.len() + self.shared_tools.len()
    }

    pub fn is_empty(&self) -> bool {
        self.tools.is_empty() && self.shared_tools.is_empty()
    }

    /// Generate API tool definitions for all registered tools.
    /// Only the last tool gets cache_control to stay within the API limit
    /// of 4 cache_control blocks per request.
    pub fn api_definitions(&self) -> Vec<ToolDefinition> {
        let all: Vec<&dyn Tool> = self.all_tools().collect();
        let len = all.len();
        all.into_iter()
            .enumerate()
            .map(|(i, tool)| ToolDefinition {
                name: tool.name().to_string(),
                description: Some(tool.description().to_string()),
                input_schema: tool.input_schema(),
                cache_control: if i == len - 1 {
                    Some(CacheControl::ephemeral())
                } else {
                    None
                },
            })
            .collect()
    }
}

impl Default for ToolRegistry {
    fn default() -> Self {
        Self::new()
    }
}

// ---------------------------------------------------------------------------
// Tool executor
// ---------------------------------------------------------------------------

/// Maximum result size before truncation (100KB).
const MAX_RESULT_SIZE: usize = 100 * 1024;

/// Manages tool execution with concurrency control and permissions.
pub struct ToolExecutor {
    pub registry: ToolRegistry,
    pub context: ToolContext,
    pub permission_rules: PermissionRules,
}

impl ToolExecutor {
    pub fn new(registry: ToolRegistry, context: ToolContext) -> Self {
        Self {
            registry,
            context,
            permission_rules: PermissionRules::default(),
        }
    }

    pub fn with_permission_rules(mut self, rules: PermissionRules) -> Self {
        self.permission_rules = rules;
        self
    }

    /// Execute multiple tool_use blocks, respecting concurrency safety.
    pub async fn execute_all(
        &self,
        tool_uses: Vec<crate::api::streaming::ToolUseBlock>,
    ) -> Vec<ToolExecutionResult> {
        let (safe, unsafe_): (Vec<_>, Vec<_>) = tool_uses
            .into_iter()
            .partition(|tu| {
                self.registry
                    .get(&tu.name)
                    .map(|t| t.is_concurrency_safe())
                    .unwrap_or(false)
            });

        let mut results = Vec::new();

        // Execute concurrency-safe tools in parallel
        if !safe.is_empty() {
            let safe_futures: Vec<_> = safe
                .into_iter()
                .map(|tu| self.execute_one(tu))
                .collect();
            let safe_results = futures::future::join_all(safe_futures).await;
            results.extend(safe_results);
        }

        // Execute non-safe tools sequentially
        for tu in unsafe_ {
            results.push(self.execute_one(tu).await);
        }

        results
    }

    /// Execute multiple tool_use blocks, yielding results incrementally as each
    /// tool completes. Concurrency-safe tools run in parallel (results arrive in
    /// completion order); sequential tools run one-by-one in order.
    pub fn execute_all_stream(
        &self,
        tool_uses: Vec<crate::api::streaming::ToolUseBlock>,
    ) -> Pin<Box<dyn Stream<Item = ToolExecutionResult> + Send + '_>> {
        Box::pin(async_stream::stream! {
            let (safe, unsafe_): (Vec<_>, Vec<_>) = tool_uses
                .into_iter()
                .partition(|tu| {
                    self.registry
                        .get(&tu.name)
                        .map(|t| t.is_concurrency_safe())
                        .unwrap_or(false)
                });

            // Execute concurrency-safe tools in parallel, yielding as each completes
            if !safe.is_empty() {
                let (tx, mut rx) = tokio::sync::mpsc::channel::<ToolExecutionResult>(safe.len());
                for tu in safe {
                    let tx = tx.clone();
                    // SAFETY: We need 'static futures for tokio::spawn, but execute_one
                    // borrows &self. Use a channel to bridge the gap — each task runs
                    // execute_one through a shared reference.
                    //
                    // We transmute the lifetime to 'static. This is sound because we
                    // consume all results from rx before this function returns, ensuring
                    // &self outlives all spawned tasks.
                    let this: &ToolExecutor = self;
                    let this: &'static ToolExecutor = unsafe { std::mem::transmute(this) };
                    tokio::spawn(async move {
                        let result = this.execute_one(tu).await;
                        let _ = tx.send(result).await;
                    });
                }
                drop(tx);
                while let Some(result) = rx.recv().await {
                    yield result;
                }
            }

            // Execute non-safe tools sequentially, yielding after each completes
            for tu in unsafe_ {
                yield self.execute_one(tu).await;
            }
        })
    }

    /// Execute a single tool_use block.
    async fn execute_one(
        &self,
        tool_use: crate::api::streaming::ToolUseBlock,
    ) -> ToolExecutionResult {
        // Check permissions
        let decision = self.permission_rules.check(&tool_use.name, &tool_use.input);
        match decision {
            PermissionDecision::Deny(reason) => {
                return ToolExecutionResult {
                    tool_use_id: tool_use.id,
                    result: ToolResult::error(format!("Permission denied: {reason}")),
                };
            }
            PermissionDecision::Ask => {
                if let Some(callback) = &self.context.permission_callback {
                    let request = ToolPermissionRequest {
                        tool_name: tool_use.name.clone(),
                        description: format!("Tool {} wants to execute", tool_use.name),
                        input: tool_use.input.clone(),
                    };
                    let allowed = callback(request).await;
                    if !allowed {
                        return ToolExecutionResult {
                            tool_use_id: tool_use.id,
                            result: ToolResult::error(
                                "The user denied permission for this tool call.".to_string()
                            ),
                        };
                    }
                    // Callback approved — proceed to execution
                } else if self.context.permission_mode != PermissionMode::BypassPermissions {
                    // No callback and not in bypass mode — deny
                    return ToolExecutionResult {
                        tool_use_id: tool_use.id,
                        result: ToolResult::error("Permission required but no callback available"),
                    };
                }
            }
            PermissionDecision::Allow => {}
        }

        // Find and execute the tool
        let tool = match self.registry.get(&tool_use.name) {
            Some(t) => t,
            None => {
                return ToolExecutionResult {
                    tool_use_id: tool_use.id,
                    result: ToolResult::error(format!("Unknown tool: {}", tool_use.name)),
                };
            }
        };

        // Validate input against schema before execution
        let schema = tool.input_schema();
        if let Err(validation_error) = validate_tool_input(&tool_use.input, &schema) {
            return ToolExecutionResult {
                tool_use_id: tool_use.id,
                result: ToolResult::error(format!(
                    "Input validation error for {}: {}",
                    tool_use.name, validation_error
                )),
            };
        }

        let result = tool.execute(tool_use.input, &self.context).await;

        // Truncate large results
        let result = truncate_result(result);

        ToolExecutionResult {
            tool_use_id: tool_use.id,
            result,
        }
    }

    /// Build a user message containing all tool results.
    pub fn build_tool_results_message(
        &self,
        results: Vec<ToolExecutionResult>,
    ) -> crate::api::types::ApiMessage {
        let content: Vec<ContentBlock> = results
            .into_iter()
            .map(|r| {
                ContentBlock::ToolResult {
                    tool_use_id: r.tool_use_id,
                    content: Some(r.result.to_api_content()),
                    is_error: if r.result.is_error { Some(true) } else { None },
                    cache_control: None,
                }
            })
            .collect();

        crate::api::types::ApiMessage::user(content)
    }
}

/// Result of executing a single tool.
#[derive(Debug, Clone)]
pub struct ToolExecutionResult {
    pub tool_use_id: String,
    pub result: ToolResult,
}

/// Validate tool input against the tool's input_schema.
///
/// Performs basic JSON schema validation:
/// - If schema expects `"type": "object"`, input must be an object.
/// - If schema has `"required"` array, all listed fields must be present in input.
///
/// Returns `Ok(())` on success, or `Err(message)` describing the validation failure.
fn validate_tool_input(input: &serde_json::Value, schema: &serde_json::Value) -> std::result::Result<(), String> {
    // Check type: object
    if let Some(schema_type) = schema.get("type").and_then(|t| t.as_str()) {
        if schema_type == "object" && !input.is_object() {
            return Err(format!(
                "Expected input to be an object, got {}",
                match input {
                    serde_json::Value::Null => "null",
                    serde_json::Value::Bool(_) => "boolean",
                    serde_json::Value::Number(_) => "number",
                    serde_json::Value::String(_) => "string",
                    serde_json::Value::Array(_) => "array",
                    serde_json::Value::Object(_) => unreachable!(),
                }
            ));
        }
    }

    // Check required fields
    if let Some(required) = schema.get("required").and_then(|r| r.as_array()) {
        if let Some(obj) = input.as_object() {
            let missing: Vec<&str> = required
                .iter()
                .filter_map(|r| r.as_str())
                .filter(|field| !obj.contains_key(*field))
                .collect();
            if !missing.is_empty() {
                return Err(format!(
                    "Missing required field{}: {}",
                    if missing.len() > 1 { "s" } else { "" },
                    missing.join(", ")
                ));
            }
        }
    }

    Ok(())
}

/// Truncate text results that exceed MAX_RESULT_SIZE.
fn truncate_result(mut result: ToolResult) -> ToolResult {
    for content in &mut result.content {
        if let ToolResultContent::Text(text) = content {
            if text.len() > MAX_RESULT_SIZE {
                let half = MAX_RESULT_SIZE / 2;
                let first = &text[..half];
                let last = &text[text.len() - half..];
                *text = format!(
                    "{first}\n\n... [truncated {} bytes] ...\n\n{last}",
                    text.len() - MAX_RESULT_SIZE
                );
            }
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    struct MockTool {
        name: &'static str,
        concurrent: bool,
    }

    #[async_trait]
    impl Tool for MockTool {
        fn name(&self) -> &str { self.name }
        fn description(&self) -> &str { "A mock tool" }
        fn input_schema(&self) -> serde_json::Value {
            serde_json::json!({
                "type": "object",
                "properties": {},
            })
        }
        fn is_concurrency_safe(&self) -> bool { self.concurrent }
        async fn execute(&self, _input: serde_json::Value, _ctx: &ToolContext) -> ToolResult {
            ToolResult::text(format!("executed {}", self.name))
        }
    }

    #[test]
    fn test_registry() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool { name: "test_tool", concurrent: false }));

        assert_eq!(reg.len(), 1);
        assert!(reg.get("test_tool").is_some());
        assert!(reg.get("nonexistent").is_none());
        assert_eq!(reg.names(), vec!["test_tool"]);
    }

    #[test]
    fn test_api_definitions() {
        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool { name: "bash", concurrent: false }));
        reg.register(Box::new(MockTool { name: "read", concurrent: true }));

        let defs = reg.api_definitions();
        assert_eq!(defs.len(), 2);
        assert_eq!(defs[0].name, "bash");
        assert_eq!(defs[1].name, "read");
        assert!(defs[0].cache_control.is_none()); // Only last tool gets cache_control
        assert!(defs[1].cache_control.is_some());
    }

    #[test]
    fn test_tool_result_helpers() {
        let r = ToolResult::text("ok");
        assert!(!r.is_error);
        assert_eq!(r.content.len(), 1);

        let r = ToolResult::error("fail");
        assert!(r.is_error);
    }

    #[test]
    fn test_truncate_result() {
        let short = ToolResult::text("short text");
        let truncated = truncate_result(short.clone());
        match &truncated.content[0] {
            ToolResultContent::Text(t) => assert_eq!(t, "short text"),
            _ => panic!(),
        }

        let long_text = "x".repeat(200 * 1024);
        let long = ToolResult::text(long_text);
        let truncated = truncate_result(long);
        match &truncated.content[0] {
            ToolResultContent::Text(t) => {
                assert!(t.len() < 200 * 1024);
                assert!(t.contains("[truncated"));
            }
            _ => panic!(),
        }
    }

    #[tokio::test]
    async fn test_executor_concurrent_vs_sequential() {
        use crate::api::streaming::ToolUseBlock;

        let mut reg = ToolRegistry::new();
        reg.register(Box::new(MockTool { name: "safe1", concurrent: true }));
        reg.register(Box::new(MockTool { name: "safe2", concurrent: true }));
        reg.register(Box::new(MockTool { name: "unsafe1", concurrent: false }));

        let mut ctx = ToolContext::default();
        ctx.permission_mode = PermissionMode::BypassPermissions;

        let executor = ToolExecutor::new(reg, ctx);

        let tool_uses = vec![
            ToolUseBlock { id: "t1".into(), name: "safe1".into(), input: serde_json::json!({}) },
            ToolUseBlock { id: "t2".into(), name: "safe2".into(), input: serde_json::json!({}) },
            ToolUseBlock { id: "t3".into(), name: "unsafe1".into(), input: serde_json::json!({}) },
        ];

        let results = executor.execute_all(tool_uses).await;
        assert_eq!(results.len(), 3);
        assert!(!results[0].result.is_error);
        assert!(!results[1].result.is_error);
        assert!(!results[2].result.is_error);
    }

    #[tokio::test]
    async fn test_executor_unknown_tool() {
        use crate::api::streaming::ToolUseBlock;

        let reg = ToolRegistry::new();
        let mut ctx = ToolContext::default();
        ctx.permission_mode = PermissionMode::BypassPermissions;

        let executor = ToolExecutor::new(reg, ctx);

        let results = executor.execute_all(vec![
            ToolUseBlock { id: "t1".into(), name: "nonexistent".into(), input: serde_json::json!({}) },
        ]).await;

        assert_eq!(results.len(), 1);
        assert!(results[0].result.is_error);
    }

    #[test]
    fn test_validate_tool_input_valid_object() {
        let schema = serde_json::json!({
            "type": "object",
            "properties": { "command": { "type": "string" } },
            "required": ["command"]
        });
        let input = serde_json::json!({ "command": "ls" });
        assert!(validate_tool_input(&input, &schema).is_ok());
    }

    #[test]
    fn test_validate_tool_input_not_object() {
        let schema = serde_json::json!({ "type": "object" });
        let input = serde_json::json!("a string");
        let err = validate_tool_input(&input, &schema).unwrap_err();
        assert!(err.contains("Expected input to be an object"));
        assert!(err.contains("string"));
    }

    #[test]
    fn test_validate_tool_input_missing_required() {
        let schema = serde_json::json!({
            "type": "object",
            "properties": {
                "command": { "type": "string" },
                "timeout": { "type": "number" }
            },
            "required": ["command", "timeout"]
        });
        let input = serde_json::json!({ "command": "ls" });
        let err = validate_tool_input(&input, &schema).unwrap_err();
        assert!(err.contains("Missing required field"));
        assert!(err.contains("timeout"));
    }

    #[test]
    fn test_validate_tool_input_no_required() {
        let schema = serde_json::json!({
            "type": "object",
            "properties": { "command": { "type": "string" } }
        });
        let input = serde_json::json!({});
        assert!(validate_tool_input(&input, &schema).is_ok());
    }

    #[test]
    fn test_validate_tool_input_null_input() {
        let schema = serde_json::json!({ "type": "object" });
        let input = serde_json::json!(null);
        let err = validate_tool_input(&input, &schema).unwrap_err();
        assert!(err.contains("null"));
    }

    #[test]
    fn test_validate_tool_input_array_input() {
        let schema = serde_json::json!({ "type": "object" });
        let input = serde_json::json!([1, 2, 3]);
        let err = validate_tool_input(&input, &schema).unwrap_err();
        assert!(err.contains("array"));
    }

    #[tokio::test]
    async fn test_executor_input_validation_failure() {
        use crate::api::streaming::ToolUseBlock;

        struct StrictTool;

        #[async_trait]
        impl Tool for StrictTool {
            fn name(&self) -> &str { "strict" }
            fn description(&self) -> &str { "A tool with required params" }
            fn input_schema(&self) -> serde_json::Value {
                serde_json::json!({
                    "type": "object",
                    "properties": { "path": { "type": "string" } },
                    "required": ["path"]
                })
            }
            async fn execute(&self, _input: serde_json::Value, _ctx: &ToolContext) -> ToolResult {
                ToolResult::text("should not reach here")
            }
        }

        let mut reg = ToolRegistry::new();
        reg.register(Box::new(StrictTool));

        let mut ctx = ToolContext::default();
        ctx.permission_mode = PermissionMode::BypassPermissions;

        let executor = ToolExecutor::new(reg, ctx);

        let results = executor.execute_all(vec![
            ToolUseBlock { id: "t1".into(), name: "strict".into(), input: serde_json::json!({}) },
        ]).await;

        assert_eq!(results.len(), 1);
        assert!(results[0].result.is_error);
        if let ToolResultContent::Text(ref text) = results[0].result.content[0] {
            assert!(text.contains("Input validation error"));
            assert!(text.contains("path"));
        }
    }
}
