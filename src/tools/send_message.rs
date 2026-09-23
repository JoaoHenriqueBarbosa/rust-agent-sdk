use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Send a message to another agent or task.
pub struct SendMessageTool;

// Campos lidos só pelo serde: o parse valida o shape do input mesmo
// quando a tool (stub) não consome cada campo.
#[allow(dead_code)]
#[derive(Deserialize)]
struct SendMessageInput {
    to: String,
    message: String,
}

#[async_trait]
impl Tool for SendMessageTool {
    fn name(&self) -> &str {
        "SendMessage"
    }

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

    /// O schema do JS é `z.object` (`tools/SendMessageTool/SendMessageTool.js`,
    /// não estrito): chaves extras somem no parse.
    fn preprocess_input(&self, mut input: serde_json::Value) -> serde_json::Value {
        crate::tools::schema_validation::strip_unknown_keys(&mut input, &self.input_schema());
        input
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let _input: SendMessageInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        // Requires the agent messaging system to be wired up.
        ToolResult::error("SendMessage requires an agent-team runtime, which is only available through the CLI subprocess transport. Use the CLI transport for multi-agent messaging.")
    }
}
