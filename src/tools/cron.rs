use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

pub struct ScheduleCronTool;

#[derive(Deserialize)]
struct CronInput {
    cron: String,
    prompt: String,
    #[serde(default)]
    recurring: Option<bool>,
}

#[async_trait]
impl Tool for ScheduleCronTool {
    fn name(&self) -> &str { "ScheduleCron" }
    fn description(&self) -> &str { "Schedule a prompt to run on a cron schedule." }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "cron": { "type": "string", "description": "5-field cron expression" },
                "prompt": { "type": "string", "description": "Prompt to run" },
                "recurring": { "type": "boolean", "description": "Whether to repeat" }
            },
            "required": ["cron", "prompt"]
        })
    }
    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let _input: CronInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };
        ToolResult::error("Cron scheduling requires scheduler integration (not yet wired)")
    }
}
