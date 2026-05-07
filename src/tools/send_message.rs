use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Send a message to another agent or task.
pub struct SendMessageTool;

#[derive(Deserialize)]
struct SendMessageInput {
    to: String,
    message: String,
}

#[async_trait]
impl Tool for SendMessageTool {
    fn name(&self) -> &str { "SendMessage" }

    fn description(&self) -> &str {
        "Send a message to another agent or task."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "to": { "type": "string", "description": "Target agent or task ID" },
                "message": { "type": "string", "description": "Message content" }
            },
            "required": ["to", "message"]
        })
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let _input: SendMessageInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        // Requires the agent messaging system to be wired up.
        ToolResult::error("SendMessage requires agent messaging (not yet wired)")
    }
}
