use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Spawn a sub-agent with isolated context.
pub struct AgentTool;

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

        // Agent tool requires the agentic loop to be wired up.
        // This will be connected in the AgenticLoop implementation.
        ToolResult::error("Agent tool requires integration with AgenticLoop (not yet wired)")
    }
}
