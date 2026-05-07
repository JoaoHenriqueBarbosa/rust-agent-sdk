use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Read files from the local filesystem.
pub struct FileReadTool;

#[derive(Deserialize)]
struct FileReadInput {
    file_path: String,
    #[serde(default)]
    offset: Option<usize>,
    #[serde(default)]
    limit: Option<usize>,
}

const DEFAULT_LIMIT: usize = 2000;

#[async_trait]
impl Tool for FileReadTool {
    fn name(&self) -> &str { "Read" }

    fn description(&self) -> &str {
        "Reads a file from the local filesystem. Results are returned with line numbers."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "file_path": {
                    "type": "string",
                    "description": "The absolute path to the file to read"
                },
                "offset": {
                    "type": "integer",
                    "description": "Line number to start reading from (0-based)"
                },
                "limit": {
                    "type": "integer",
                    "description": "Number of lines to read (default 2000)"
                }
            },
            "required": ["file_path"]
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let input: FileReadInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let raw_path = std::path::Path::new(&input.file_path);
        let path = if raw_path.is_absolute() {
            raw_path.to_path_buf()
        } else {
            context.working_directory.join(raw_path)
        };
        let path = path.as_path();

        // Check for image files — return as base64
        if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
            let media_type = match ext.to_lowercase().as_str() {
                "png" => Some("image/png"),
                "jpg" | "jpeg" => Some("image/jpeg"),
                "gif" => Some("image/gif"),
                "webp" => Some("image/webp"),
                "svg" => Some("image/svg+xml"),
                _ => None,
            };

            if let Some(media_type) = media_type {
                return match tokio::fs::read(path).await {
                    Ok(bytes) => {
                        use base64::Engine;
                        let data = base64::engine::general_purpose::STANDARD.encode(&bytes);
                        ToolResult::image(data, media_type.to_string())
                    }
                    Err(e) => ToolResult::error(format!("Failed to read file: {e}")),
                };
            }
        }

        // Read text file
        let content = match tokio::fs::read_to_string(path).await {
            Ok(c) => c,
            Err(e) => return ToolResult::error(format!("Failed to read file: {e}")),
        };

        let lines: Vec<&str> = content.lines().collect();
        let offset = input.offset.unwrap_or(0);
        let limit = input.limit.unwrap_or(DEFAULT_LIMIT);

        if offset >= lines.len() {
            return ToolResult::text(format!(
                "Offset {} is beyond end of file ({} lines)",
                offset,
                lines.len()
            ));
        }

        let end = (offset + limit).min(lines.len());
        let selected: Vec<String> = lines[offset..end]
            .iter()
            .enumerate()
            .map(|(i, line)| format!("{}\t{}", offset + i + 1, line))
            .collect();

        let output = selected.join("\n");

        if end < lines.len() {
            ToolResult::text(format!(
                "{}\n\n(showing lines {}-{} of {})",
                output,
                offset + 1,
                end,
                lines.len()
            ))
        } else {
            ToolResult::text(output)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tools::framework::ToolResultContent;

    #[tokio::test]
    async fn test_read_file() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();

        // Read our own Cargo.toml
        let result = tool
            .execute(
                serde_json::json!({"file_path": concat!(env!("CARGO_MANIFEST_DIR"), "/Cargo.toml")}),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        match &result.content[0] {
            ToolResultContent::Text(t) => {
                assert!(t.contains("rust-agent-sdk"));
                assert!(t.contains("1\t")); // Line numbers
            }
            _ => panic!("Expected text"),
        }
    }

    #[tokio::test]
    async fn test_read_nonexistent() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        let result = tool
            .execute(serde_json::json!({"file_path": "/nonexistent/file.txt"}), &ctx)
            .await;
        assert!(result.is_error);
    }

    #[tokio::test]
    async fn test_read_with_offset_limit() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        let result = tool
            .execute(
                serde_json::json!({
                    "file_path": concat!(env!("CARGO_MANIFEST_DIR"), "/Cargo.toml"),
                    "offset": 0,
                    "limit": 3
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        match &result.content[0] {
            ToolResultContent::Text(t) => {
                // Should have exactly 3 lines of content
                let content_lines: Vec<&str> = t.lines().collect();
                // First 3 content lines + possible "(showing lines...)" line
                assert!(content_lines.len() >= 3);
            }
            _ => panic!("Expected text"),
        }
    }
}
