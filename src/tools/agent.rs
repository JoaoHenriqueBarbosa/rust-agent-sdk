use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Spawn a sub-agent with isolated context.
pub struct AgentTool;

// Campos lidos só pelo serde: o parse valida o shape do input mesmo
// quando a tool (stub) não consome cada campo.
#[allow(dead_code)]
#[derive(Deserialize)]
struct AgentInput {
    prompt: String,
    #[serde(default)]
    description: Option<String>,
}

#[async_trait]
impl Tool for AgentTool {
    fn name(&self) -> &str { "Agent" }

    fn description(&self) -> &str {
        "Launch a new agent to handle complex, multi-step tasks."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "prompt": { "type": "string", "description": "The task for the agent to perform" },
                "description": { "type": "string", "description": "Short description of the task" }
            },
            "required": ["prompt"]
        })
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let _input: AgentInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        // O subagente REAL é o NativeAgentTool do transporte nativo; este stub
        // genérico só existe para registries montados à mão sem client.
        // This will be connected in the AgenticLoop implementation.
        ToolResult::error("This generic Agent stub has no API client. In the native transport the Task/Agent tool is provided automatically; register it there instead.")
    }
}
