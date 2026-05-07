use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Edit Jupyter notebook cells.
pub struct NotebookEditTool;

#[derive(Deserialize)]
struct NotebookEditInput {
    notebook_path: String,
    new_source: String,
    #[serde(default)]
    cell_number: Option<usize>,
    #[serde(default)]
    cell_type: Option<String>,
    #[serde(default)]
    edit_mode: Option<String>,
}

#[async_trait]
impl Tool for NotebookEditTool {
    fn name(&self) -> &str { "NotebookEdit" }

    fn description(&self) -> &str {
        "Replaces, inserts, or deletes a cell in a Jupyter notebook (.ipynb file)."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "notebook_path": { "type": "string", "description": "Absolute path to the .ipynb file" },
                "new_source": { "type": "string", "description": "New source for the cell" },
                "cell_number": { "type": "integer", "description": "0-indexed cell number" },
                "cell_type": { "type": "string", "enum": ["code", "markdown"] },
                "edit_mode": { "type": "string", "enum": ["replace", "insert", "delete"] }
            },
            "required": ["notebook_path", "new_source"]
        })
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let input: NotebookEditInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let content = match tokio::fs::read_to_string(&input.notebook_path).await {
            Ok(c) => c,
            Err(e) => return ToolResult::error(format!("Failed to read notebook: {e}")),
        };

        let mut notebook: serde_json::Value = match serde_json::from_str(&content) {
            Ok(v) => v,
            Err(e) => return ToolResult::error(format!("Invalid notebook JSON: {e}")),
        };

        let cells = match notebook.get_mut("cells").and_then(|c| c.as_array_mut()) {
            Some(c) => c,
            None => return ToolResult::error("Notebook has no cells array"),
        };

        let mode = input.edit_mode.as_deref().unwrap_or("replace");
        let cell_type = input.cell_type.as_deref().unwrap_or("code");

        match mode {
            "insert" => {
                let idx = input.cell_number.unwrap_or(cells.len());
                let new_cell = serde_json::json!({
                    "cell_type": cell_type,
                    "metadata": {},
                    "source": input.new_source.lines().map(|l| format!("{l}\n")).collect::<Vec<_>>(),
                    "outputs": if cell_type == "code" { serde_json::json!([]) } else { serde_json::json!(null) }
                });
                let idx = idx.min(cells.len());
                cells.insert(idx, new_cell);
            }
            "delete" => {
                let idx = input.cell_number.unwrap_or(0);
                if idx >= cells.len() {
                    return ToolResult::error(format!("Cell index {} out of range (0-{})", idx, cells.len() - 1));
                }
                cells.remove(idx);
            }
            "replace" | _ => {
                let idx = input.cell_number.unwrap_or(0);
                if idx >= cells.len() {
                    return ToolResult::error(format!("Cell index {} out of range (0-{})", idx, cells.len() - 1));
                }
                let source: Vec<String> = input.new_source.lines().map(|l| format!("{l}\n")).collect();
                cells[idx]["source"] = serde_json::json!(source);
                if let Some(ct) = input.cell_type.as_deref() {
                    cells[idx]["cell_type"] = serde_json::json!(ct);
                }
            }
        }

        let output = serde_json::to_string_pretty(&notebook).unwrap();
        match tokio::fs::write(&input.notebook_path, output).await {
            Ok(()) => ToolResult::text(format!("Successfully {mode}d cell in {}", input.notebook_path)),
            Err(e) => ToolResult::error(format!("Failed to write notebook: {e}")),
        }
    }
}
