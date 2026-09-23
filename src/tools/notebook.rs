//! NotebookEdit: troca, insere ou apaga uma célula de um notebook Jupyter,
//! com paridade com o `NotebookEditTool` do CLI 2.1.90
//! (`tools/NotebookEditTool/NotebookEditTool.js`, `utils/notebook.js`).
//!
//! As células são endereçadas pelo `cell_id` (o `id` da célula, ou
//! `cell-N` para o índice N), o notebook precisa ter sido lido antes
//! (`readFileState`), o arquivo é regravado com o `JSON.stringify(nb, null,
//! 1)` do JS preservando codificação e fim de linha, e o resultado é o texto
//! do `mapToolResultToToolResultBlockParam` com o `data` do JS no
//! `tool_use_result`.

use std::sync::OnceLock;

use async_trait::async_trait;
use serde_json::{json, Map, Value};

use crate::tools::file_edit::{FILE_MODIFIED_SINCE_READ_ERROR, FILE_NOT_READ_ERROR};
use crate::tools::file_state::FileState;
use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::fs_support as fs;
use crate::tools::permission::{PermissionResult, PermissionRules};

/// Edit Jupyter notebook cells.
pub struct NotebookEditTool;

fn description_text() -> &'static str {
    static TEXT: OnceLock<String> = OnceLock::new();
    TEXT.get_or_init(|| {
        crate::tools::fs_prompts::expand(crate::tools::fs_prompts::NOTEBOOK_EDIT_DESCRIPTION)
    })
}

fn schema_value() -> &'static Value {
    static SCHEMA: OnceLock<Value> = OnceLock::new();
    SCHEMA.get_or_init(|| {
        crate::tools::fs_prompts::schema(crate::tools::fs_prompts::NOTEBOOK_EDIT_SCHEMA)
    })
}

/// `parseCellId`: `cell-N` vira o índice N.
fn parse_cell_id(cell_id: &str) -> Option<usize> {
    cell_id
        .strip_prefix("cell-")?
        .parse::<usize>()
        .ok()
        .filter(|_| cell_id["cell-".len()..].chars().all(|c| c.is_ascii_digit()))
}

/// O caminho como o JS resolve (`isAbsolute ? p : resolve(cwd, p)`).
fn full_path(raw: &str, ctx: &ToolContext) -> std::path::PathBuf {
    let p = std::path::Path::new(raw);
    if p.is_absolute() {
        p.to_path_buf()
    } else {
        crate::tools::file_state::normalize_path(&ctx.working_directory.join(p))
    }
}

/// `JSON.stringify(value, null, 1)`.
fn stringify_indent_1(value: &Value) -> String {
    let mut buf = Vec::new();
    let formatter = serde_json::ser::PrettyFormatter::with_indent(b" ");
    let mut ser = serde_json::Serializer::with_formatter(&mut buf, formatter);
    serde::Serialize::serialize(value, &mut ser).expect("serialização de JSON em memória");
    String::from_utf8(buf).unwrap_or_default()
}

/// Um id de célula novo como o `Math.random().toString(36).substring(2, 15)`.
fn random_cell_id() -> String {
    use rand::Rng;
    const ALPHABET: &[u8] = b"0123456789abcdefghijklmnopqrstuvwxyz";
    let mut rng = rand::thread_rng();
    (0..13)
        .map(|_| ALPHABET[rng.gen_range(0..ALPHABET.len())] as char)
        .collect()
}

/// O `data` de falha do JS (a ordem das chaves é a do JS, com `error` antes
/// do `cell_id`).
fn failure(input: &Value, notebook_path: &str, error: &str) -> ToolResult {
    let mut data = Map::new();
    data.insert("new_source".into(), input["new_source"].clone());
    data.insert(
        "cell_type".into(),
        input
            .get("cell_type")
            .cloned()
            .unwrap_or_else(|| json!("code")),
    );
    data.insert("language".into(), json!("python"));
    data.insert("edit_mode".into(), json!("replace"));
    data.insert("error".into(), json!(error));
    if let Some(id) = input.get("cell_id") {
        data.insert("cell_id".into(), id.clone());
    }
    data.insert("notebook_path".into(), json!(notebook_path));
    data.insert("original_file".into(), json!(""));
    data.insert("updated_file".into(), json!(""));
    ToolResult::error(error).with_tool_use_result(Value::Object(data))
}

#[async_trait]
impl Tool for NotebookEditTool {
    fn name(&self) -> &str {
        "NotebookEdit"
    }

    fn is_edit_tool(&self) -> bool {
        true
    }

    fn description(&self) -> &str {
        description_text()
    }

    fn input_schema(&self) -> Value {
        schema_value().clone()
    }

    fn max_result_size_chars(&self) -> Option<usize> {
        Some(100_000)
    }

    async fn validate_input(&self, input: &Value, ctx: &ToolContext) -> Result<(), String> {
        let raw = input["notebook_path"].as_str().unwrap_or_default();
        let path = full_path(raw, ctx);
        let text = path.to_string_lossy();
        if text.starts_with("\\\\") || text.starts_with("//") {
            return Ok(());
        }
        if path.extension().map(|e| e != "ipynb").unwrap_or(true) {
            return Err("File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.".to_string());
        }
        let edit_mode = input["edit_mode"].as_str().unwrap_or("replace");
        if !matches!(edit_mode, "replace" | "insert" | "delete") {
            return Err("Edit mode must be replace, insert, or delete.".to_string());
        }
        if edit_mode == "insert" && input.get("cell_type").is_none() {
            return Err("Cell type is required when using edit_mode=insert.".to_string());
        }
        let Some(read) = ctx.file_state.get(&path) else {
            return Err(FILE_NOT_READ_ERROR.to_string());
        };
        if fs::modification_time_ms(&path).unwrap_or(0) > read.timestamp {
            return Err(FILE_MODIFIED_SINCE_READ_ERROR.to_string());
        }
        let content = match fs::read_file_with_metadata(&path) {
            Ok(meta) => meta.content,
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                return Err("Notebook file does not exist.".to_string())
            }
            Err(e) => return Err(e.to_string()),
        };
        let Ok(notebook) = serde_json::from_str::<Value>(&content) else {
            return Err("Notebook is not valid JSON.".to_string());
        };
        match input.get("cell_id").and_then(Value::as_str) {
            None => {
                if edit_mode != "insert" {
                    return Err(
                        "Cell ID must be specified when not inserting a new cell.".to_string()
                    );
                }
            }
            Some(cell_id) => {
                let cells = notebook["cells"].as_array().cloned().unwrap_or_default();
                if !cells.iter().any(|c| c["id"].as_str() == Some(cell_id)) {
                    match parse_cell_id(cell_id) {
                        Some(index) => {
                            if index >= cells.len() {
                                return Err(format!(
                                    "Cell with index {index} does not exist in notebook."
                                ));
                            }
                        }
                        None => {
                            return Err(format!(
                                "Cell with ID \"{cell_id}\" not found in notebook."
                            ))
                        }
                    }
                }
            }
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        input: &Value,
        ctx: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        let path = input["notebook_path"].as_str().unwrap_or_default();
        crate::tools::permission::check_write_permission(path, ctx, rules)
    }

    async fn execute(&self, input: Value, ctx: &ToolContext) -> ToolResult {
        let raw = input["notebook_path"]
            .as_str()
            .unwrap_or_default()
            .to_string();
        let path = full_path(&raw, ctx);
        let path_text = path.to_string_lossy().to_string();
        let new_source = input["new_source"].as_str().unwrap_or_default().to_string();
        let cell_id = input
            .get("cell_id")
            .and_then(Value::as_str)
            .map(str::to_string);
        let mut cell_type = input
            .get("cell_type")
            .and_then(Value::as_str)
            .map(str::to_string);
        let original_mode = input
            .get("edit_mode")
            .and_then(Value::as_str)
            .map(str::to_string);

        let meta = match fs::read_file_with_metadata(&path) {
            Ok(meta) => meta,
            Err(e) => return failure(&input, &path_text, &e.to_string()),
        };
        let mut notebook: Value = match serde_json::from_str(&meta.content) {
            Ok(v) => v,
            Err(_) => return failure(&input, &path_text, "Notebook is not valid JSON."),
        };
        let cells_len = notebook["cells"].as_array().map(Vec::len).unwrap_or(0);
        let mut cell_index = match &cell_id {
            None => 0usize,
            Some(id) => {
                let found = notebook["cells"]
                    .as_array()
                    .and_then(|cells| cells.iter().position(|c| c["id"].as_str() == Some(id)));
                let mut index = found.or_else(|| parse_cell_id(id)).unwrap_or(usize::MAX);
                if original_mode.as_deref() == Some("insert") {
                    index = index.wrapping_add(1);
                }
                index
            }
        };
        let mut edit_mode = original_mode.clone();
        if edit_mode.as_deref() == Some("replace") && cell_index == cells_len {
            edit_mode = Some("insert".to_string());
            if cell_type.is_none() {
                cell_type = Some("code".to_string());
            }
        }
        let language = notebook["metadata"]["language_info"]["name"]
            .as_str()
            .unwrap_or("python")
            .to_string();
        let nbformat = notebook["nbformat"].as_f64().unwrap_or(0.0);
        let nbformat_minor = notebook["nbformat_minor"].as_f64().unwrap_or(0.0);
        let mut new_cell_id: Option<String> = None;
        if nbformat > 4.0 || (nbformat == 4.0 && nbformat_minor >= 5.0) {
            if edit_mode.as_deref() == Some("insert") {
                new_cell_id = Some(random_cell_id());
            } else {
                new_cell_id = cell_id.clone();
            }
        }

        let Some(cells) = notebook["cells"].as_array_mut() else {
            return failure(
                &input,
                &path_text,
                "Cannot read properties of undefined (reading 'splice')",
            );
        };
        match edit_mode.as_deref() {
            Some("delete") => {
                if cell_index < cells.len() {
                    cells.remove(cell_index);
                }
            }
            Some("insert") => {
                let mut cell = Map::new();
                let is_markdown = cell_type.as_deref() == Some("markdown");
                cell.insert(
                    "cell_type".into(),
                    json!(if is_markdown { "markdown" } else { "code" }),
                );
                if let Some(id) = &new_cell_id {
                    cell.insert("id".into(), json!(id));
                }
                cell.insert("source".into(), json!(new_source));
                cell.insert("metadata".into(), json!({}));
                if !is_markdown {
                    cell.insert("execution_count".into(), Value::Null);
                    cell.insert("outputs".into(), json!([]));
                }
                cell_index = cell_index.min(cells.len());
                cells.insert(cell_index, Value::Object(cell));
            }
            _ => {
                let Some(target) = cells.get_mut(cell_index).and_then(Value::as_object_mut) else {
                    return failure(
                        &input,
                        &path_text,
                        "Cannot set properties of undefined (setting 'source')",
                    );
                };
                target.insert("source".into(), json!(new_source));
                if target.get("cell_type").and_then(Value::as_str) == Some("code") {
                    target.insert("execution_count".into(), Value::Null);
                    target.insert("outputs".into(), json!([]));
                }
                if let Some(ct) = &cell_type {
                    if target.get("cell_type").and_then(Value::as_str) != Some(ct.as_str()) {
                        target.insert("cell_type".into(), json!(ct));
                    }
                }
            }
        }

        let updated = stringify_indent_1(&notebook);
        if let Err(e) = fs::write_text_content(&path, &updated, meta.encoding, meta.line_endings) {
            return failure(&input, &path_text, &e.to_string());
        }
        ctx.file_state.set(
            &path,
            FileState {
                content: updated.clone(),
                timestamp: fs::modification_time_ms(&path).unwrap_or(0),
                offset: None,
                limit: None,
                is_partial_view: false,
            },
        );

        let mode = edit_mode.unwrap_or_else(|| "replace".to_string());
        let shown_id = new_cell_id
            .clone()
            .unwrap_or_else(|| "undefined".to_string());
        let text = match mode.as_str() {
            "replace" => format!("Updated cell {shown_id} with {new_source}"),
            "insert" => format!("Inserted cell {shown_id} with {new_source}"),
            "delete" => format!("Deleted cell {shown_id}"),
            _ => "Unknown edit mode".to_string(),
        };
        let mut data = Map::new();
        data.insert("new_source".into(), json!(new_source));
        data.insert(
            "cell_type".into(),
            json!(cell_type.unwrap_or_else(|| "code".to_string())),
        );
        data.insert("language".into(), json!(language));
        data.insert("edit_mode".into(), json!(mode));
        if let Some(id) = new_cell_id.filter(|id| !id.is_empty()) {
            data.insert("cell_id".into(), json!(id));
        }
        data.insert("error".into(), json!(""));
        data.insert("notebook_path".into(), json!(path_text));
        data.insert("original_file".into(), json!(meta.content));
        data.insert("updated_file".into(), json!(updated));
        ToolResult::text(text).with_tool_use_result(Value::Object(data))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const NOTEBOOK: &str = "{\n \"cells\": [\n  {\n   \"cell_type\": \"code\",\n   \"execution_count\": 1,\n   \"id\": \"abc123\",\n   \"metadata\": {},\n   \"outputs\": [],\n   \"source\": [\n    \"print(1)\"\n   ]\n  }\n ],\n \"metadata\": {\n  \"language_info\": {\n   \"name\": \"python\"\n  }\n },\n \"nbformat\": 4,\n \"nbformat_minor\": 5\n}\n";

    fn read_into_state(ctx: &ToolContext, path: &std::path::Path) {
        ctx.file_state.set(
            path,
            FileState {
                content: std::fs::read_to_string(path).unwrap(),
                timestamp: fs::modification_time_ms(path).unwrap(),
                offset: None,
                limit: None,
                is_partial_view: false,
            },
        );
    }

    #[tokio::test]
    async fn replace_matches_the_cli_capture() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("nb.ipynb");
        std::fs::write(&path, NOTEBOOK).unwrap();
        let ctx = ToolContext::default();
        read_into_state(&ctx, &path);
        let input = json!({"notebook_path": path.to_str().unwrap(), "cell_id": "abc123", "new_source": "print(2)"});
        NotebookEditTool.validate_input(&input, &ctx).await.unwrap();
        let result = NotebookEditTool.execute(input, &ctx).await;
        assert_eq!(result.text_content(), "Updated cell abc123 with print(2)");
        let data = result.tool_use_result.unwrap();
        let keys: Vec<&String> = data.as_object().unwrap().keys().collect();
        assert_eq!(
            keys,
            vec![
                "new_source",
                "cell_type",
                "language",
                "edit_mode",
                "cell_id",
                "error",
                "notebook_path",
                "original_file",
                "updated_file"
            ]
        );
        // Capturado do CLI: `source` vira string e a saída sai com indentação 1.
        assert_eq!(
            data["updated_file"],
            "{\n \"cells\": [\n  {\n   \"cell_type\": \"code\",\n   \"execution_count\": null,\n   \"id\": \"abc123\",\n   \"metadata\": {},\n   \"outputs\": [],\n   \"source\": \"print(2)\"\n  }\n ],\n \"metadata\": {\n  \"language_info\": {\n   \"name\": \"python\"\n  }\n },\n \"nbformat\": 4,\n \"nbformat_minor\": 5\n}"
        );
    }

    #[tokio::test]
    async fn validation_messages_follow_the_cli() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("nb.ipynb");
        std::fs::write(&path, NOTEBOOK).unwrap();
        let ctx = ToolContext::default();
        let not_read = NotebookEditTool
            .validate_input(&json!({"notebook_path": path.to_str().unwrap(), "cell_id": "cell-9", "new_source": "x"}), &ctx)
            .await
            .unwrap_err();
        assert_eq!(not_read, FILE_NOT_READ_ERROR);
        read_into_state(&ctx, &path);
        let missing = NotebookEditTool
            .validate_input(&json!({"notebook_path": path.to_str().unwrap(), "cell_id": "cell-9", "new_source": "x"}), &ctx)
            .await
            .unwrap_err();
        assert_eq!(missing, "Cell with index 9 does not exist in notebook.");
        let wrong_ext = NotebookEditTool
            .validate_input(
                &json!({"notebook_path": "/tmp/a.txt", "new_source": "x"}),
                &ctx,
            )
            .await
            .unwrap_err();
        assert!(wrong_ext.starts_with("File must be a Jupyter notebook"));
    }
}
