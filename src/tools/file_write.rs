use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Write files to the local filesystem.
pub struct FileWriteTool;

#[derive(Deserialize)]
struct FileWriteInput {
    file_path: String,
    content: String,
}

#[async_trait]
impl Tool for FileWriteTool {
    fn name(&self) -> &str { "Write" }

    fn description(&self) -> &str {
        "Writes content to a file on the local filesystem. Creates parent directories if needed."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "file_path": {
                    "type": "string",
                    "description": "The absolute path to the file to write"
                },
                "content": {
                    "type": "string",
                    "description": "The content to write to the file"
                }
            },
            "required": ["file_path", "content"]
        })
    }

    async fn execute(&self, input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        let input: FileWriteInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let path = std::path::Path::new(&input.file_path);

        // Create parent directories
        if let Some(parent) = path.parent() {
            if let Err(e) = tokio::fs::create_dir_all(parent).await {
                return ToolResult::error(format!("Failed to create directory: {e}"));
            }
        }

        match tokio::fs::write(path, &input.content).await {
            Ok(()) => {
                let lines = input.content.lines().count();
                let bytes = input.content.len();
                ToolResult::text(format!(
                    "Successfully wrote {bytes} bytes ({lines} lines) to {}",
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
    async fn test_write_and_read() {
        let tool = FileWriteTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("test.txt");

        let result = tool
            .execute(
                serde_json::json!({
                    "file_path": path.to_str().unwrap(),
                    "content": "hello world\n"
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);

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
                serde_json::json!({
                    "file_path": path.to_str().unwrap(),
                    "content": "nested\n"
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        assert!(path.exists());
    }
}
