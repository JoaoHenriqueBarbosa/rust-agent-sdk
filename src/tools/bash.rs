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

// Campos lidos só pelo serde: o parse valida o shape do input.
#[allow(dead_code)]
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
    fn name(&self) -> &str {
        "Bash"
    }

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

        let cwd = &context.working_directory;

        // run_in_background: spawna com stdout/stderr num arquivo e registra
        // no task store — TaskOutput lê, TaskStop mata.
        if input.run_in_background == Some(true) {
            let Some(store) = context.task_store.clone() else {
                return ToolResult::error(
                    "run_in_background requires a task store in this session",
                );
            };
            let out_dir = context
                .tool_results_dir
                .clone()
                .unwrap_or_else(std::env::temp_dir);
            if let Err(e) = tokio::fs::create_dir_all(&out_dir).await {
                return ToolResult::error(format!("Failed to create output dir: {e}"));
            }
            let output_path =
                out_dir.join(format!("bash-bg-{}.output", uuid::Uuid::new_v4().simple()));
            let file = match std::fs::File::create(&output_path) {
                Ok(f) => f,
                Err(e) => return ToolResult::error(format!("Failed to create output file: {e}")),
            };
            let stderr_file = match file.try_clone() {
                Ok(f) => f,
                Err(e) => return ToolResult::error(format!("Failed to clone output file: {e}")),
            };
            let mut builder = tokio::process::Command::new("bash");
            builder
                .arg("-c")
                .arg(&input.command)
                .current_dir(cwd)
                .stdin(std::process::Stdio::null())
                .stdout(std::process::Stdio::from(file))
                .stderr(std::process::Stdio::from(stderr_file));
            context.prepare_child_env(&mut builder);
            let child = builder.spawn();
            let child = match child {
                Ok(c) => c,
                Err(e) => return ToolResult::error(format!("Failed to spawn process: {e}")),
            };
            let description = input
                .description
                .unwrap_or_else(|| input.command.chars().take(80).collect());
            let id = store
                .register_background(description, output_path.clone(), child)
                .await;
            return ToolResult::text(format!(
                "Command running in background with ID: {id}. Output is being written to: {}. \
                 Use TaskOutput to read it and TaskStop to stop it.",
                output_path.display()
            ));
        }

        let timeout = input
            .timeout
            .map(|ms| Duration::from_millis(ms.min(600_000)))
            .unwrap_or(self.default_timeout);

        let result =
            tokio::time::timeout(timeout, execute_command(&input.command, cwd, context)).await;

        match result {
            Ok(Ok(output)) => {
                if output.exit_code != 0 {
                    ToolResult {
                        content: vec![crate::tools::framework::ToolResultContent::Text(format!(
                            "{}Exit code: {}",
                            if output.combined_output.is_empty() {
                                String::new()
                            } else {
                                format!("{}\n", output.combined_output)
                            },
                            output.exit_code
                        ))],
                        is_error: true,
                    }
                } else if output.combined_output.is_empty() {
                    ToolResult::text("(no output)")
                } else {
                    ToolResult::text(output.combined_output)
                }
            }
            Ok(Err(e)) => ToolResult::error(format!("Command failed: {e}")),
            Err(_) => ToolResult::error(format!("Command timed out after {}s", timeout.as_secs())),
        }
    }
}

struct CommandOutput {
    combined_output: String,
    exit_code: i32,
}

async fn execute_command(
    command: &str,
    cwd: &PathBuf,
    context: &ToolContext,
) -> std::result::Result<CommandOutput, String> {
    let mut builder = tokio::process::Command::new("bash");
    builder
        .arg("-c")
        .arg(command)
        .current_dir(cwd)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped());
    context.prepare_child_env(&mut builder);
    let output = builder
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

    /// O corte de ambiente precisa alcançar o que o processo HERDA, e não só o
    /// que a sessão acrescenta.
    ///
    /// Este teste existe porque a primeira versão filtrava apenas o
    /// `extra_env`, e a credencial do motor continuava visível para quem
    /// digitasse `env` no shell: `Command` herda o ambiente do pai, e o filtro
    /// não tocava nessa herança.
    #[tokio::test]
    async fn variavel_negada_nao_chega_ao_shell() {
        // Nome improvável de propósito: os testes deste crate compartilham
        // processo, e uma variável de nome comum atrapalharia os vizinhos.
        std::env::set_var("BASHTOOL_TESTE_SEGREDO", "valor-que-nao-pode-vazar");

        let tool = BashTool::default();
        let comando = serde_json::json!({
            "command": "echo ${BASHTOOL_TESTE_SEGREDO:-AUSENTE}"
        });

        // Sem denylist, o comportamento histórico se mantém: o filho herda.
        let herdado = tool.execute(comando.clone(), &ToolContext::default()).await;
        assert!(
            texto_de(&herdado).contains("valor-que-nao-pode-vazar"),
            "sem denylist o shell deveria herdar a variável, veio: {}",
            texto_de(&herdado)
        );

        // Com o prefixo negado, ela some do ambiente do filho.
        let cortado = ToolContext {
            denied_env_prefixes: vec!["BASHTOOL_TESTE_".to_string()],
            ..Default::default()
        };
        let resultado = tool.execute(comando, &cortado).await;
        let saida = texto_de(&resultado);
        assert!(
            saida.contains("AUSENTE"),
            "a variável negada vazou para o shell: {saida}"
        );
        assert!(
            !saida.contains("valor-que-nao-pode-vazar"),
            "a variável negada vazou para o shell: {saida}"
        );

        std::env::remove_var("BASHTOOL_TESTE_SEGREDO");
    }

    fn texto_de(result: &ToolResult) -> String {
        match result.content.first() {
            Some(crate::tools::framework::ToolResultContent::Text(t)) => t.clone(),
            _ => String::new(),
        }
    }

    #[tokio::test]
    async fn test_bash_timeout() {
        let tool = BashTool::default();
        let ctx = ToolContext::default();
        let result = tool
            .execute(
                serde_json::json!({"command": "sleep 10", "timeout": 100}),
                &ctx,
            )
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
