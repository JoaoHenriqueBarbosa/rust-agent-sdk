use std::path::{Path, PathBuf};

use async_trait::async_trait;
use regex::Regex;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Search file contents with regex.
pub struct GrepTool;

#[derive(Deserialize)]
struct GrepInput {
    pattern: String,
    #[serde(default)]
    path: Option<String>,
    #[serde(default)]
    include: Option<String>,
}

const MAX_RESULTS: usize = 200;

#[async_trait]
impl Tool for GrepTool {
    fn name(&self) -> &str { "Grep" }

    fn description(&self) -> &str {
        "Search for a pattern in files using regex. Returns matching lines with file paths and line numbers."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "pattern": {
                    "type": "string",
                    "description": "The regex pattern to search for"
                },
                "path": {
                    "type": "string",
                    "description": "Directory to search in (defaults to working directory)"
                },
                "include": {
                    "type": "string",
                    "description": "Glob pattern for files to include (e.g. '*.rs')"
                }
            },
            "required": ["pattern"]
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let input: GrepInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let regex = match Regex::new(&input.pattern) {
            Ok(r) => r,
            Err(e) => return ToolResult::error(format!("Invalid regex: {e}")),
        };

        let search_path = input
            .path
            .as_deref()
            .map(PathBuf::from)
            .unwrap_or_else(|| context.working_directory.clone());

        let include_pattern = input.include.as_deref();

        let mut results: Vec<String> = Vec::new();
        search_recursive(&search_path, &regex, include_pattern, &mut results);

        if results.is_empty() {
            ToolResult::text("No matches found")
        } else {
            let total = results.len();
            if total > MAX_RESULTS {
                results.truncate(MAX_RESULTS);
                ToolResult::text(format!(
                    "{}\n\n... (showing {MAX_RESULTS} of {total} matches)",
                    results.join("\n")
                ))
            } else {
                ToolResult::text(format!(
                    "{}\n\n{total} match{}",
                    results.join("\n"),
                    if total == 1 { "" } else { "es" }
                ))
            }
        }
    }
}

fn search_recursive(
    path: &Path,
    regex: &Regex,
    include_pattern: Option<&str>,
    results: &mut Vec<String>,
) {
    if results.len() >= MAX_RESULTS * 2 {
        return;
    }

    if path.is_file() {
        if let Some(pattern) = include_pattern {
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                if let Ok(glob_pat) = glob::Pattern::new(pattern) {
                    if !glob_pat.matches(name) {
                        return;
                    }
                }
            }
        }

        if let Ok(content) = std::fs::read_to_string(path) {
            for (line_num, line) in content.lines().enumerate() {
                if regex.is_match(line) {
                    results.push(format!("{}:{}:{}", path.display(), line_num + 1, line));
                }
            }
        }
    } else if path.is_dir() {
        // Skip hidden directories and common ignore paths
        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
            if name.starts_with('.') || name == "node_modules" || name == "target" {
                return;
            }
        }

        if let Ok(entries) = std::fs::read_dir(path) {
            let mut entries: Vec<_> = entries.filter_map(|e| e.ok()).collect();
            entries.sort_by_key(|e| e.file_name());
            for entry in entries {
                search_recursive(&entry.path(), regex, include_pattern, results);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_grep_finds_pattern() {
        let tool = GrepTool;
        let mut ctx = ToolContext::default();
        ctx.working_directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"));

        let result = tool
            .execute(
                serde_json::json!({"pattern": "rust-agent-sdk", "include": "*.toml"}),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        match &result.content[0] {
            crate::tools::framework::ToolResultContent::Text(t) => {
                assert!(t.contains("Cargo.toml"));
                assert!(t.contains("rust-agent-sdk"));
            }
            _ => panic!("Expected text"),
        }
    }

    #[tokio::test]
    async fn test_grep_no_match() {
        let tool = GrepTool;
        let mut ctx = ToolContext::default();
        ctx.working_directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"));

        let result = tool
            .execute(
                serde_json::json!({"pattern": "zzz_nonexistent_pattern_xyz", "include": "*.toml"}),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        match &result.content[0] {
            crate::tools::framework::ToolResultContent::Text(t) => {
                assert!(t.contains("No matches"));
            }
            _ => panic!("Expected text"),
        }
    }
}
