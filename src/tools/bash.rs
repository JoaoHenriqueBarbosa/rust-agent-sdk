use std::path::PathBuf;
use std::time::Duration;

use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Execute shell commands.
pub struct BashTool {
    pub default_timeout: Duration,
}

impl Default for BashTool {
    fn default() -> Self {
        Self {
            default_timeout: Duration::from_secs(120),
        }
    }
}

#[derive(Deserialize)]
struct BashInput {
    command: String,
    #[serde(default)]
    description: Option<String>,
    #[serde(default)]
    timeout: Option<u64>,
    #[serde(default)]
    run_in_background: Option<bool>,
}

#[async_trait]
impl Tool for BashTool {
    fn name(&self) -> &str { "Bash" }

    fn description(&self) -> &str {
        "Executes a given bash command and returns its output."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "The command to execute"
                },
                "description": {
                    "type": "string",
                    "description": "Description of what this command does"
                },
                "timeout": {
                    "type": "number",
                    "description": "Optional timeout in milliseconds (max 600000)"
                },
                "run_in_background": {
                    "type": "boolean",
                    "description": "Run the command in the background"
                }
            },
            "required": ["command"]
        })
    }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let input: BashInput = match serde_json::from_value(input) {
            Ok(i) => i,
            Err(e) => return ToolResult::error(format!("Invalid input: {e}")),
        };

        let timeout = input
            .timeout
            .map(|ms| Duration::from_millis(ms.min(600_000)))
            .unwrap_or(self.default_timeout);

        let cwd = &context.working_directory;

        let result = tokio::time::timeout(timeout, execute_command(&input.command, cwd)).await;

        match result {
            Ok(Ok(output)) => {
                if output.exit_code != 0 {
                    ToolResult {
                        content: vec![crate::tools::framework::ToolResultContent::Text(
                            format!(
                                "{}Exit code: {}",
                                if output.combined_output.is_empty() {
                                    String::new()
                                } else {
                                    format!("{}\n", output.combined_output)
                                },
                                output.exit_code
                            ),
                        )],
                        is_error: true,
                    }
                } else if output.combined_output.is_empty() {
                    ToolResult::text("(no output)")
                } else {
                    ToolResult::text(output.combined_output)
                }
            }
            Ok(Err(e)) => ToolResult::error(format!("Command failed: {e}")),
            Err(_) => ToolResult::error(format!(
                "Command timed out after {}s",
                timeout.as_secs()
            )),
        }
    }
}

struct CommandOutput {
    combined_output: String,
    exit_code: i32,
}

async fn execute_command(command: &str, cwd: &PathBuf) -> std::result::Result<CommandOutput, String> {
    let output = tokio::process::Command::new("bash")
        .arg("-c")
        .arg(command)
        .current_dir(cwd)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .output()
        .await
        .map_err(|e| format!("Failed to spawn process: {e}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    let combined = if stderr.is_empty() {
        stdout.to_string()
    } else if stdout.is_empty() {
        stderr.to_string()
    } else {
        format!("{stdout}{stderr}")
    };

    Ok(CommandOutput {
        combined_output: combined,
        exit_code: output.status.code().unwrap_or(-1),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_bash_echo() {
        let tool = BashTool::default();
        let ctx = ToolContext::default();
        let result = tool
            .execute(serde_json::json!({"command": "echo hello"}), &ctx)
            .await;
        assert!(!result.is_error);
        match &result.content[0] {
            crate::tools::framework::ToolResultContent::Text(t) => {
                assert!(t.contains("hello"));
            }
            _ => panic!("Expected text"),
        }
    }

    #[tokio::test]
    async fn test_bash_exit_code() {
        let tool = BashTool::default();
        let ctx = ToolContext::default();
        let result = tool
            .execute(serde_json::json!({"command": "exit 1"}), &ctx)
            .await;
        assert!(result.is_error);
    }

    #[tokio::test]
    async fn test_bash_timeout() {
        let tool = BashTool::default();
        let ctx = ToolContext::default();
        let result = tool
            .execute(serde_json::json!({"command": "sleep 10", "timeout": 100}), &ctx)
            .await;
        assert!(result.is_error);
        match &result.content[0] {
            crate::tools::framework::ToolResultContent::Text(t) => {
                assert!(t.contains("timed out"));
            }
            _ => panic!("Expected text"),
        }
    }
}
