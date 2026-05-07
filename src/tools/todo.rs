use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Write or update a todo list.
pub struct TodoWriteTool;

#[derive(Deserialize)]
struct TodoWriteInput {
    todos: Vec<TodoItem>,
}

#[derive(Deserialize)]
struct TodoItem {
    id: String,
    content: String,
    #[serde(default)]
    status: Option<String>,
}

#[async_trait]
impl Tool for TodoWriteTool {
    fn name(&self) -> &str { "TodoWrite" }

    fn description(&self) -> &str {
        "Write or update a structured task list."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "todos": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": { "type": "string" },
                            "content": { "type": "string" },
                            "status": { "type": "string", "enum": ["pending", "in_progress", "done"] }
                        },
                        "required": ["id", "content"]
                    }
                }
            },
            "required": ["todos"]
        })
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let input: TodoWriteInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let count = input.todos.len();
        ToolResult::text(format!("Updated {count} todo items"))
    }
}
