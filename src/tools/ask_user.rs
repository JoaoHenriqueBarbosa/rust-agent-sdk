use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Ask the user a question during execution.
pub struct AskUserQuestionTool;

#[derive(Deserialize)]
struct AskUserInput {
    question: String,
    #[serde(default)]
    options: Option<Vec<String>>,
}

#[async_trait]
impl Tool for AskUserQuestionTool {
    fn name(&self) -> &str { "AskUserQuestion" }

    fn description(&self) -> &str {
        "Ask the user a question and wait for their response."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "question": { "type": "string", "description": "The question to ask" },
                "options": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "Optional list of answer choices"
                }
            },
            "required": ["question"]
        })
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let _input: AskUserInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        // This tool requires a user interaction callback to be configured.
        // The AgenticLoop will wire this up to emit events and wait for responses.
        ToolResult::error("AskUserQuestion requires a user interaction callback (not yet wired)")
    }
}
