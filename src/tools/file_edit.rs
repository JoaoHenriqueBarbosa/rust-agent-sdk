use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Perform exact string replacements in files.
pub struct FileEditTool;

#[derive(Deserialize)]
struct FileEditInput {
    file_path: String,
    old_string: String,
    new_string: String,
    #[serde(default)]
    replace_all: bool,
}

#[async_trait]
impl Tool for FileEditTool {
    fn name(&self) -> &str { "Edit" }

    fn description(&self) -> &str {
        "Performs exact string replacements in files."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "file_path": {
                    "type": "string",
                    "description": "The absolute path to the file to modify"
                },
                "old_string": {
                    "type": "string",
                    "description": "The text to replace"
                },
                "new_string": {
                    "type": "string",
                    "description": "The text to replace it with"
                },
                "replace_all": {
                    "type": "boolean",
                    "description": "Replace all occurrences (default false)"
                }
            },
            "required": ["file_path", "old_string", "new_string"]
        })
    }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let input: FileEditInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        if input.old_string == input.new_string {
            return ToolResult::error("old_string and new_string must be different");
        }

        let raw_path = std::path::Path::new(&input.file_path);
        let path = if raw_path.is_absolute() {
            raw_path.to_path_buf()
        } else {
            context.working_directory.join(raw_path)
        };
        let content = match tokio::fs::read_to_string(&path).await {
            Ok(c) => c,
            Err(e) => return ToolResult::error(format!("Failed to read file: {e}")),
        };

        let count = content.matches(&input.old_string).count();

        if count == 0 {
            return ToolResult::error(format!(
                "old_string not found in {}. Make sure the string exists exactly as specified.",
                input.file_path
            ));
        }

        if count > 1 && !input.replace_all {
            return ToolResult::error(format!(
                "old_string found {} times in {}. Use replace_all: true to replace all occurrences, \
                 or provide more context to make the match unique.",
                count, input.file_path
            ));
        }

        let new_content = if input.replace_all {
            content.replace(&input.old_string, &input.new_string)
        } else {
            content.replacen(&input.old_string, &input.new_string, 1)
        };

        match tokio::fs::write(&path, &new_content).await {
            Ok(()) => {
                let replaced = if input.replace_all { count } else { 1 };
                ToolResult::text(format!(
                    "Successfully replaced {} occurrence{} in {}",
                    replaced,
                    if replaced > 1 { "s" } else { "" },
                    input.file_path
                ))
            }
            Err(e) => ToolResult::error(format!("Failed to write file: {e}")),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_edit_single_replacement() {
        let tool = FileEditTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "hello world").unwrap();

        let result = tool
            .execute(
                serde_json::json!({
                    "file_path": path.to_str().unwrap(),
                    "old_string": "hello",
                    "new_string": "goodbye"
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        assert_eq!(std::fs::read_to_string(&path).unwrap(), "goodbye world");
    }

    #[tokio::test]
    async fn test_edit_multiple_fails_without_replace_all() {
        let tool = FileEditTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "aaa bbb aaa").unwrap();

        let result = tool
            .execute(
                serde_json::json!({
                    "file_path": path.to_str().unwrap(),
                    "old_string": "aaa",
                    "new_string": "ccc"
                }),
                &ctx,
            )
            .await;
        assert!(result.is_error);
    }

    #[tokio::test]
    async fn test_edit_replace_all() {
        let tool = FileEditTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "aaa bbb aaa").unwrap();

        let result = tool
            .execute(
                serde_json::json!({
                    "file_path": path.to_str().unwrap(),
                    "old_string": "aaa",
                    "new_string": "ccc",
                    "replace_all": true
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        assert_eq!(std::fs::read_to_string(&path).unwrap(), "ccc bbb ccc");
    }

    #[tokio::test]
    async fn test_edit_not_found() {
        let tool = FileEditTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "hello").unwrap();

        let result = tool
            .execute(
                serde_json::json!({
                    "file_path": path.to_str().unwrap(),
                    "old_string": "notfound",
                    "new_string": "replacement"
                }),
                &ctx,
            )
            .await;
        assert!(result.is_error);
    }
}
