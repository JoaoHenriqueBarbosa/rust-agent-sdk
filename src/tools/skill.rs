use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

pub struct SkillTool;

#[derive(Deserialize)]
struct SkillInput {
    skill: String,
    #[serde(default)]
    args: Option<String>,
}

#[async_trait]
impl Tool for SkillTool {
    fn name(&self) -> &str { "Skill" }
    fn description(&self) -> &str { "Execute a skill within the conversation." }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "skill": { "type": "string", "description": "The skill name" },
                "args": { "type": "string", "description": "Optional arguments" }
            },
            "required": ["skill"]
        })
    }
    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let _input: SkillInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };
        ToolResult::error("Skill system requires skill registry (not yet wired)")
    }
}
