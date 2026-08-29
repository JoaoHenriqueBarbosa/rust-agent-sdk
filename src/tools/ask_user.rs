use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Ask the user a question during execution.
///
/// Paridade com o CLI: a pergunta chega ao usuário pelo canal de PERMISSÃO
/// (can_use_tool) — o cliente responde `allow` com `updatedInput` carregando
/// `answers`, e a execução só devolve essas respostas ao modelo. Um deny é o
/// usuário recusando responder.
pub struct AskUserQuestionTool;

// O parse valida o shape do input (o formato de questions do CLI).
#[allow(dead_code)]
#[derive(Deserialize)]
struct AskUserInput {
    questions: Vec<Question>,
    #[serde(default)]
    answers: Option<serde_json::Value>,
}

#[allow(dead_code)]
#[derive(Deserialize)]
struct Question {
    question: String,
    #[serde(default)]
    header: Option<String>,
    #[serde(default)]
    options: Option<serde_json::Value>,
    #[serde(default, rename = "multiSelect")]
    multi_select: Option<bool>,
}

#[async_trait]
impl Tool for AskUserQuestionTool {
    fn name(&self) -> &str { "AskUserQuestion" }
    fn always_asks(&self) -> bool { true }

    fn description(&self) -> &str {
        "Ask the user one or more questions and wait for their answers. \
         The client answers through the permission callback: respond allow with \
         updatedInput.answers = {\"<question>\": \"<answer>\"}."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "question": { "type": "string" },
                            "header": { "type": "string" },
                            "options": { "type": "array" },
                            "multiSelect": { "type": "boolean" }
                        },
                        "required": ["question"]
                    }
                },
                "answers": {
                    "type": "object",
                    "description": "Filled by the client via updatedInput on approval"
                }
            },
            "required": ["questions"]
        })
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let parsed: AskUserInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };
        match parsed.answers {
            Some(answers) if !answers.is_null() => ToolResult::text(format!(
                "The user answered: {}",
                serde_json::to_string(&answers).unwrap_or_default()
            )),
            _ => ToolResult::error(
                "No answers were provided. The client must respond to the can_use_tool \
                 request with behavior=allow and updatedInput.answers filled in.",
            ),
        }
    }
}
