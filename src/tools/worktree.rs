use async_trait::async_trait;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

pub struct EnterWorktreeTool;

#[async_trait]
impl Tool for EnterWorktreeTool {
    fn name(&self) -> &str { "EnterWorktree" }
    fn description(&self) -> &str { "Create an isolated git worktree for the current session." }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "name": { "type": "string", "description": "Optional name for the worktree" }
            }
        })
    }
    async fn execute(&self, _input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        ToolResult::error("Worktree management requires git integration (not yet wired)")
    }
}

pub struct ExitWorktreeTool;

#[async_trait]
impl Tool for ExitWorktreeTool {
    fn name(&self) -> &str { "ExitWorktree" }
    fn description(&self) -> &str { "Exit the current worktree session." }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "action": { "type": "string", "enum": ["keep", "remove"] }
            },
            "required": ["action"]
        })
    }
    async fn execute(&self, _input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        ToolResult::error("Worktree management requires git integration (not yet wired)")
    }
}
