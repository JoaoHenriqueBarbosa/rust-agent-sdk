use async_trait::async_trait;

use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::types::PermissionMode;

pub struct EnterPlanModeTool;

#[async_trait]
impl Tool for EnterPlanModeTool {
    fn name(&self) -> &str { "EnterPlanMode" }
    fn description(&self) -> &str {
        "Enter plan mode: only read-only tools may run until the plan is approved via ExitPlanMode."
    }
    fn is_read_only(&self) -> bool { true }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({ "type": "object", "properties": {} })
    }
    async fn execute(&self, _input: serde_json::Value, context: &ToolContext) -> ToolResult {
        context.set_mode(PermissionMode::Plan);
        ToolResult::text(
            "Entered plan mode. Explore the codebase and design the approach; \
             mutating tools are blocked until the plan is approved with ExitPlanMode.",
        )
    }
}

pub struct ExitPlanModeTool;

#[async_trait]
impl Tool for ExitPlanModeTool {
    fn name(&self) -> &str { "ExitPlanMode" }
    fn description(&self) -> &str {
        "Present the plan for approval and exit plan mode. Approval is requested \
         through the permission callback; once approved, edits are auto-accepted."
    }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "plan": { "type": "string", "description": "The plan to present for approval" }
            }
        })
    }
    async fn execute(&self, _input: serde_json::Value, context: &ToolContext) -> ToolResult {
        // Se a execução chegou aqui, a permissão (can_use_tool) já aprovou o
        // plano — o CLI volta em acceptEdits depois da aprovação.
        context.set_mode(PermissionMode::AcceptEdits);
        ToolResult::text("Plan approved. Exited plan mode; edits are now auto-accepted.")
    }
}
