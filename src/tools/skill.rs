use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

pub struct SkillTool;

// Campos lidos só pelo serde: o parse valida o shape do input mesmo
// quando a tool (stub) não consome cada campo.
#[allow(dead_code)]
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
        ToolResult::error("Skill requires the CLI skill loader (skills directories, frontmatter). Use the CLI subprocess transport to invoke skills.")
    }
}
