use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Write or update a todo list.
pub struct TodoWriteTool;

// Campos lidos só pelo serde: o parse valida o shape do input mesmo
// quando a tool (stub) não consome cada campo.
#[allow(dead_code)]
#[derive(Deserialize)]
struct TodoWriteInput {
    todos: Vec<TodoItem>,
}

// Campos lidos só pelo serde: o parse valida o shape do input.
#[allow(dead_code)]
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
    fn is_read_only(&self) -> bool { true }

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

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let parsed: TodoWriteInput = match serde_json::from_value(input.clone()) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let count = parsed.todos.len();
        let new_todos = input.get("todos").cloned().unwrap_or(serde_json::json!([]));
        // Persiste no store da sessão e devolve old/new como o CLI.
        if let Some(store) = &context.todo_store {
            let old_todos = {
                let mut guard = store.lock().unwrap_or_else(|e| e.into_inner());
                std::mem::replace(&mut *guard, new_todos.clone())
            };
            let payload = serde_json::json!({
                "oldTodos": old_todos,
                "newTodos": new_todos,
            });
            return ToolResult::text(format!(
                "Updated {count} todo items\n{}",
                serde_json::to_string(&payload).unwrap_or_default()
            ));
        }
        ToolResult::text(format!("Updated {count} todo items"))
    }
}
