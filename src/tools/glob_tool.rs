use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Find files by glob pattern.
pub struct GlobTool;

#[derive(Deserialize)]
struct GlobInput {
    pattern: String,
    #[serde(default)]
    path: Option<String>,
}

#[async_trait]
impl Tool for GlobTool {
    fn name(&self) -> &str { "Glob" }

    fn description(&self) -> &str {
        "Find files matching a glob pattern. Returns matching file paths."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "pattern": {
                    "type": "string",
                    "description": "The glob pattern to match files"
                },
                "path": {
                    "type": "string",
                    "description": "Base directory to search from (defaults to working directory)"
                }
            },
            "required": ["pattern"]
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let input: GlobInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let base = input
            .path
            .as_deref()
            .map(std::path::PathBuf::from)
            .unwrap_or_else(|| context.working_directory.clone());

        let full_pattern = if input.pattern.starts_with('/') {
            input.pattern.clone()
        } else {
            format!("{}/{}", base.display(), input.pattern)
        };

        let entries = match glob::glob(&full_pattern) {
            Ok(entries) => entries,
            Err(e) => return ToolResult::error(format!("Invalid glob pattern: {e}")),
        };

        let mut paths: Vec<String> = Vec::new();
        for entry in entries {
            match entry {
                Ok(path) => paths.push(path.display().to_string()),
                Err(e) => paths.push(format!("Error: {e}")),
            }
        }

        if paths.is_empty() {
            ToolResult::text("No files found matching pattern")
        } else {
            let count = paths.len();
            ToolResult::text(format!(
                "{}\n\n{count} file{} found",
                paths.join("\n"),
                if count == 1 { "" } else { "s" }
            ))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_glob_finds_cargo_toml() {
        let tool = GlobTool;
        let mut ctx = ToolContext::default();
        ctx.working_directory = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"));

        let result = tool
            .execute(serde_json::json!({"pattern": "Cargo.toml"}), &ctx)
            .await;
        assert!(!result.is_error);
        match &result.content[0] {
            crate::tools::framework::ToolResultContent::Text(t) => {
                assert!(t.contains("Cargo.toml"));
            }
            _ => panic!("Expected text"),
        }
    }

    #[tokio::test]
    async fn test_glob_no_match() {
        let tool = GlobTool;
        let mut ctx = ToolContext::default();
        ctx.working_directory = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"));

        let result = tool
            .execute(serde_json::json!({"pattern": "*.nonexistent_extension_xyz"}), &ctx)
            .await;
        assert!(!result.is_error);
        match &result.content[0] {
            crate::tools::framework::ToolResultContent::Text(t) => {
                assert!(t.contains("No files found"));
            }
            _ => panic!("Expected text"),
        }
    }
}
