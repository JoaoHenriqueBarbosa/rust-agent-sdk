//! Write: grava um arquivo inteiro, com paridade com o `FileWriteTool` do
//! CLI 2.1.90 (`tools/FileWriteTool/FileWriteTool.js`).
//!
//! - Descrição e schema literais do CLI.
//! - O conteúdo perde o espaço de fim de linha (salvo em Markdown), como o
//!   `normalizeToolInput` de `utils/api.js` faz ao receber o tool_use.
//! - `validateInput`: arquivo existente precisa ter sido lido por inteiro
//!   (`readFileState`) e não pode ter mudado no disco depois da leitura.
//! - A escrita preserva a codificação do arquivo existente e grava com `\n`.
//! - Resultado: `File created successfully at: ...` ou `The file ... has
//!   been updated successfully.`, e o `tool_use_result` com `type`,
//!   `filePath`, `content`, `structuredPatch` e `originalFile`.

use std::sync::OnceLock;

use async_trait::async_trait;
use serde_json::{json, Value};

use crate::tools::file_edit::{
    FILE_MODIFIED_SINCE_READ_ERROR, FILE_NOT_READ_ERROR, FILE_UNEXPECTEDLY_MODIFIED_ERROR,
};
use crate::tools::file_state::FileState;
use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::fs_support::{self as fs, Encoding, LineEndings};
use crate::tools::permission::{PermissionResult, PermissionRules};

/// Write files to the local filesystem.
pub struct FileWriteTool;

fn description_text() -> &'static str {
    static TEXT: OnceLock<String> = OnceLock::new();
    TEXT.get_or_init(|| {
        crate::tools::fs_prompts::expand(crate::tools::fs_prompts::WRITE_DESCRIPTION)
    })
}

fn schema_value() -> &'static Value {
    static SCHEMA: OnceLock<Value> = OnceLock::new();
    SCHEMA.get_or_init(|| crate::tools::fs_prompts::schema(crate::tools::fs_prompts::WRITE_SCHEMA))
}

/// O `(file_path, content)` depois da normalização do CLI.
fn normalized(input: &Value) -> (String, String) {
    let file_path = input["file_path"].as_str().unwrap_or_default().to_string();
    let content = input["content"].as_str().unwrap_or_default().to_string();
    let content = if fs::is_markdown_path(&file_path) {
        content
    } else {
        fs::strip_trailing_whitespace(&content)
    };
    (file_path, content)
}

#[async_trait]
impl Tool for FileWriteTool {
    fn name(&self) -> &str {
        "Write"
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
        let (file_path, _) = normalized(input);
        let full_path = fs::absolute(&file_path, &ctx.working_directory);
        let text = full_path.to_string_lossy();
        if text.starts_with("\\\\") || text.starts_with("//") {
            return Ok(());
        }
        match std::fs::metadata(&full_path) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(()),
            Err(e) => return Err(e.to_string()),
        }
        let Some(read) = ctx
            .file_state
            .get(&full_path)
            .filter(|r| !r.is_partial_view)
        else {
            return Err(FILE_NOT_READ_ERROR.to_string());
        };
        if fs::modification_time_ms(&full_path).unwrap_or(0) > read.timestamp {
            return Err(FILE_MODIFIED_SINCE_READ_ERROR.to_string());
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        input: &Value,
        ctx: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        let path = input["file_path"].as_str().unwrap_or_default();
        crate::tools::permission::check_write_permission(path, ctx, rules)
    }

    async fn execute(&self, input: Value, ctx: &ToolContext) -> ToolResult {
        let (file_path, content) = normalized(&input);
        let full_path = fs::absolute(&file_path, &ctx.working_directory);
        if let Some(parent) = full_path.parent() {
            if let Err(e) = std::fs::create_dir_all(parent) {
                return ToolResult::error(e.to_string());
            }
        }
        let meta = match fs::read_file_with_metadata(&full_path) {
            Ok(meta) => Some(meta),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => None,
            Err(e) => return ToolResult::error(e.to_string()),
        };
        if let Some(meta) = &meta {
            let last_write = fs::modification_time_ms(&full_path).unwrap_or(0);
            let last_read = ctx.file_state.get(&full_path);
            let stale = match &last_read {
                None => true,
                Some(read) => last_write > read.timestamp,
            };
            if stale {
                let full_read = last_read
                    .as_ref()
                    .map(|r| r.offset.is_none() && r.limit.is_none())
                    .unwrap_or(false);
                let same = last_read
                    .as_ref()
                    .map(|r| r.content == meta.content)
                    .unwrap_or(false);
                if !full_read || !same {
                    return ToolResult::error(FILE_UNEXPECTEDLY_MODIFIED_ERROR);
                }
            }
        }
        let encoding = meta.as_ref().map(|m| m.encoding).unwrap_or(Encoding::Utf8);
        let old_content = meta.map(|m| m.content);
        if let Err(e) = fs::write_text_content(&full_path, &content, encoding, LineEndings::Lf) {
            return ToolResult::error(e.to_string());
        }
        ctx.file_state.set(
            &full_path,
            FileState {
                content: content.clone(),
                timestamp: fs::modification_time_ms(&full_path).unwrap_or(0),
                offset: None,
                limit: None,
                is_partial_view: false,
            },
        );
        // O JS testa `if (oldContent)`: arquivo existente mas vazio conta como
        // criação.
        match old_content.filter(|c| !c.is_empty()) {
            Some(old) => {
                let patch = fs::patch_json(&old, &content);
                ToolResult::text(format!(
                    "The file {file_path} has been updated successfully."
                ))
                .with_tool_use_result(json!({
                    "type": "update",
                    "filePath": file_path,
                    "content": content,
                    "structuredPatch": patch,
                    "originalFile": old,
                }))
            }
            None => ToolResult::text(format!("File created successfully at: {file_path}"))
                .with_tool_use_result(json!({
                    "type": "create",
                    "filePath": file_path,
                    "content": content,
                    "structuredPatch": [],
                    "originalFile": null,
                })),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_write_and_read() {
        let tool = FileWriteTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("test.txt");

        let result = tool
            .execute(
                json!({
                    "file_path": path.to_str().unwrap(),
                    "content": "hello world\n"
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        assert_eq!(
            result.text_content(),
            format!("File created successfully at: {}", path.display())
        );

        let content = std::fs::read_to_string(&path).unwrap();
        assert_eq!(content, "hello world\n");
    }

    #[tokio::test]
    async fn test_write_creates_parents() {
        let tool = FileWriteTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("a").join("b").join("c.txt");

        let result = tool
            .execute(
                json!({
                    "file_path": path.to_str().unwrap(),
                    "content": "nested\n"
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        assert!(path.exists());
    }

    #[tokio::test]
    async fn existing_unread_file_is_refused_before_permission() {
        let tool = FileWriteTool;
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("x.txt");
        std::fs::write(&path, "old").unwrap();
        let ctx = ToolContext::default();
        let err = tool
            .validate_input(
                &json!({"file_path": path.to_str().unwrap(), "content": "n"}),
                &ctx,
            )
            .await
            .unwrap_err();
        assert_eq!(err, FILE_NOT_READ_ERROR);
    }
}
