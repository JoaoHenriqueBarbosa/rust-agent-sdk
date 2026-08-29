use async_trait::async_trait;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

pub struct EnterPlanModeTool;

#[async_trait]
impl Tool for EnterPlanModeTool {
    fn name(&self) -> &str { "EnterPlanMode" }
    fn description(&self) -> &str { "Enter plan mode for designing implementation approaches." }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({ "type": "object", "properties": {} })
    }
    async fn execute(&self, _input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        ToolResult::text("Entered plan mode")
    }
}

pub struct ExitPlanModeTool;

#[async_trait]
impl Tool for ExitPlanModeTool {
    fn name(&self) -> &str { "ExitPlanMode" }
    fn description(&self) -> &str { "Exit plan mode and present plan for approval." }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({ "type": "object", "properties": {} })
    }
    async fn execute(&self, _input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        ToolResult::text("Exited plan mode")
    }
}
