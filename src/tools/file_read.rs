use async_trait::async_trait;
use serde::Deserialize;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Read files from the local filesystem — com paridade de COMPORTAMENTO com o
/// Read do Claude Code: offset 1-based, limites de bytes/tokens com erros que
/// ensinam o modelo a repaginar, avisos em `<system-reminder>` literais, e
/// bloqueio de device paths. O modelo foi treinado contra o Read do CLI;
/// divergir aqui produz erro silencioso (numeração deslocada) ou loop (erro
/// que o modelo não reconhece).
pub struct FileReadTool;

#[derive(Deserialize)]
struct FileReadInput {
    file_path: String,
    #[serde(default)]
    offset: Option<usize>,
    #[serde(default)]
    limit: Option<usize>,
}

/// Teto de bytes quando `limit` não é dado (MAX_OUTPUT_SIZE do CLI).
const MAX_OUTPUT_SIZE: usize = 256 * 1024;

/// Teto de tokens estimados da saída (DEFAULT_MAX_OUTPUT_TOKENS do CLI).
const MAX_OUTPUT_TOKENS: usize = 25_000;

/// Device paths que bloqueiam ou produzem saída infinita — ler `/dev/zero`
/// trava o worker até a memória acabar.
const BLOCKED_DEVICE_PATHS: &[&str] = &[
    "/dev/zero",
    "/dev/random",
    "/dev/urandom",
    "/dev/full",
    "/dev/stdin",
    "/dev/stdout",
    "/dev/stderr",
    "/dev/fd/0",
    "/dev/fd/1",
    "/dev/fd/2",
];

/// Extensões que o Read trata como imagem (a lista do CLI — svg NÃO está
/// nela: svg é XML e a API rejeita `image/svg+xml`).
fn image_media_type(ext: &str) -> Option<&'static str> {
    match ext {
        "png" => Some("image/png"),
        "jpg" | "jpeg" => Some("image/jpeg"),
        "gif" => Some("image/gif"),
        "webp" => Some("image/webp"),
        _ => None,
    }
}

/// Extensões binárias que o Read recusa com mensagem própria.
const BINARY_EXTENSIONS: &[&str] = &[
    "zip", "tar", "gz", "bz2", "xz", "7z", "rar", "exe", "dll", "so", "dylib", "bin", "o", "a",
    "class", "jar", "war", "pyc", "wasm", "db", "sqlite", "parquet", "ico", "icns", "mp3", "mp4",
    "avi", "mov", "mkv", "wav", "flac", "ogg", "woff", "woff2", "ttf", "otf", "eot",
];

fn is_blocked_device(path: &std::path::Path) -> bool {
    let text = path.to_string_lossy();
    if BLOCKED_DEVICE_PATHS.contains(&text.as_ref()) {
        return true;
    }
    // /proc/<pid>/fd/{0,1,2}
    let mut parts = path.components();
    use std::path::Component;
    matches!(
        (
            parts.next(),
            parts.next(),
            parts.next(),
            parts.next(),
            parts.next(),
            parts.next(),
        ),
        (
            Some(Component::RootDir),
            Some(Component::Normal(proc_)),
            Some(Component::Normal(_pid)),
            Some(Component::Normal(fd)),
            Some(Component::Normal(n)),
            None,
        ) if proc_ == "proc" && fd == "fd" && matches!(n.to_str(), Some("0" | "1" | "2"))
    )
}

#[async_trait]
impl Tool for FileReadTool {
    fn name(&self) -> &str { "Read" }

    fn description(&self) -> &str {
        // O prompt completo importa: é por ele que o modelo decide como usar
        // offset/limit e como interpretar os avisos.
        "Reads a file from the local filesystem. You can access any file directly by using this tool.\n\
         Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.\n\n\
         Usage:\n\
         - The file_path parameter must be an absolute path, not a relative path\n\
         - By default, it reads the whole file; large files require offset and limit\n\
         - The offset parameter is the LINE NUMBER to start reading from (1-based)\n\
         - The limit parameter is how many lines to read\n\
         - Any lines longer than 2000 characters will be truncated\n\
         - Results are returned using cat -n format, with line numbers starting at 1\n\
         - This tool can read images (eg PNG, JPG, GIF, WEBP) and returns them visually\n\
         - This tool can only read files, not directories\n\
         - If the file exists but is empty, a system reminder warning will be returned instead of file contents\n\
         - If the file is too large, an error will suggest using offset and limit to read specific portions"
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
                    "minimum": 0,
                    "description": "The line number to start reading from. Only provide if the file is too large to read at once"
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "The number of lines to read. Only provide if the file is too large to read at once."
                }
            },
            "required": ["file_path"],
            "additionalProperties": false
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

        if is_blocked_device(path) {
            return ToolResult::error(format!(
                "Cannot read {}: this device file would block or produce infinite output.",
                path.display()
            ));
        }

        let extension = path
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| e.to_lowercase())
            .unwrap_or_default();

        if let Some(media_type) = image_media_type(&extension) {
            return match tokio::fs::read(path).await {
                Ok(bytes) => {
                    use base64::Engine;
                    let data = base64::engine::general_purpose::STANDARD.encode(&bytes);
                    ToolResult::image(data, media_type.to_string())
                }
                Err(e) => ToolResult::error(format!("Failed to read file: {e}")),
            };
        }

        if BINARY_EXTENSIONS.contains(&extension.as_str()) {
            return ToolResult::error(format!(
                "This tool cannot read binary files. The file appears to be a binary .{extension} file. Please use appropriate tools for binary file analysis."
            ));
        }

        // Leitura tolerante a não-UTF8, como o Buffer→string do CLI.
        let bytes = match tokio::fs::read(path).await {
            Ok(b) => b,
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                // O cwd na mensagem é o que faz o modelo se autocorrigir
                // quando errou o caminho relativo/absoluto.
                return ToolResult::error(format!(
                    "File does not exist. Note: your current working directory is {}.",
                    context.working_directory.display()
                ));
            }
            Err(e) => return ToolResult::error(format!("Failed to read file: {e}")),
        };
        let mut content = String::from_utf8_lossy(&bytes).into_owned();
        // BOM removido — senão entra na linha 1.
        if content.starts_with('\u{feff}') {
            content.remove(0);
        }

        if content.is_empty() {
            // O texto LITERAL do CLI: é o que o modelo reconhece como "vazio",
            // não como erro de uso.
            return ToolResult::text(
                "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>",
            );
        }

        let lines: Vec<&str> = content.lines().collect();
        // offset é 1-BASED (número de linha), como no CLI: 0 e 1 são a
        // primeira linha. O modelo manda números de linha, não índices.
        let offset = input.offset.unwrap_or(0);
        let start_line = offset.max(1);
        let start_index = start_line - 1;

        if start_index >= lines.len() {
            return ToolResult::text(format!(
                "<system-reminder>Warning: the file exists but is shorter than the provided offset ({offset}). The file has {} lines.</system-reminder>",
                lines.len()
            ));
        }

        // Sem limit: o arquivo inteiro, limitado por BYTES — e o erro ensina a
        // repaginar, em vez de truncar em silêncio.
        if input.limit.is_none() && content.len() > MAX_OUTPUT_SIZE {
            return ToolResult::error(format!(
                "File content ({} bytes) exceeds maximum allowed size ({MAX_OUTPUT_SIZE} bytes). Use offset and limit parameters to read specific portions of the file.",
                content.len()
            ));
        }

        let end = match input.limit {
            Some(limit) => (start_index + limit).min(lines.len()),
            None => lines.len(),
        };
        let selected: Vec<String> = lines[start_index..end]
            .iter()
            .enumerate()
            .map(|(i, line)| {
                // Linhas além de 2000 chars são cortadas (em fronteira de char).
                let mut line = *line;
                if line.len() > 2000 {
                    let mut cut = 2000;
                    while cut > 0 && !line.is_char_boundary(cut) {
                        cut -= 1;
                    }
                    line = &line[..cut];
                }
                format!("{}\t{}", start_line + i, line)
            })
            .collect();

        let output = selected.join("\n");

        // Teto de tokens estimados, com o mesmo remédio do teto de bytes.
        let estimated_tokens = output.len() / 4;
        if estimated_tokens > MAX_OUTPUT_TOKENS {
            return ToolResult::error(format!(
                "File content ({estimated_tokens} tokens) exceeds maximum allowed tokens ({MAX_OUTPUT_TOKENS}). Use offset and limit parameters to read specific portions of the file."
            ));
        }

        ToolResult::text(output)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tools::framework::ToolResultContent;

    fn text_of(result: &ToolResult) -> &str {
        match &result.content[0] {
            ToolResultContent::Text(t) => t,
            _ => panic!("Expected text"),
        }
    }

    #[tokio::test]
    async fn test_read_file() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();

        let result = tool
            .execute(
                serde_json::json!({"file_path": concat!(env!("CARGO_MANIFEST_DIR"), "/Cargo.toml")}),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        let t = text_of(&result);
        assert!(t.contains("rust-agent-sdk"));
        assert!(t.starts_with("1\t")); // cat -n a partir de 1
    }

    #[tokio::test]
    async fn test_read_nonexistent_names_the_cwd() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        let result = tool
            .execute(serde_json::json!({"file_path": "/nonexistent/file.txt"}), &ctx)
            .await;
        assert!(result.is_error);
        // O cwd na mensagem é o que permite ao modelo se autocorrigir.
        assert!(text_of(&result).contains("current working directory"));
    }

    #[tokio::test]
    async fn test_offset_is_one_based() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let file = dir.path().join("nums.txt");
        tokio::fs::write(&file, "um\ndois\ntres\n").await.unwrap();

        // offset=2 é a LINHA 2 ("dois"), não o índice 2 ("tres").
        let result = tool
            .execute(
                serde_json::json!({"file_path": file.display().to_string(), "offset": 2, "limit": 1}),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        assert_eq!(text_of(&result), "2\tdois");
    }

    #[tokio::test]
    async fn test_empty_file_is_a_system_reminder() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let file = dir.path().join("empty.txt");
        tokio::fs::write(&file, "").await.unwrap();

        let result = tool
            .execute(serde_json::json!({"file_path": file.display().to_string()}), &ctx)
            .await;
        // Aviso, não erro — e no texto LITERAL que o modelo reconhece.
        assert!(!result.is_error);
        assert!(text_of(&result).contains("<system-reminder>Warning: the file exists but the contents are empty."));
    }

    #[tokio::test]
    async fn test_offset_beyond_eof_is_a_system_reminder() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let file = dir.path().join("short.txt");
        tokio::fs::write(&file, "linha\n").await.unwrap();

        let result = tool
            .execute(
                serde_json::json!({"file_path": file.display().to_string(), "offset": 99}),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        let t = text_of(&result);
        assert!(t.contains("shorter than the provided offset (99)"));
        assert!(t.contains("The file has 1 lines."));
    }

    #[tokio::test]
    async fn test_blocked_device_paths() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        // /dev/zero travaria o worker consumindo memória até morrer.
        let result = tool
            .execute(serde_json::json!({"file_path": "/dev/zero"}), &ctx)
            .await;
        assert!(result.is_error);
        assert!(text_of(&result).contains("would block or produce infinite output"));
    }

    #[tokio::test]
    async fn test_large_file_without_limit_teaches_pagination() {
        let tool = FileReadTool;
        let ctx = ToolContext::default();
        let dir = tempfile::tempdir().unwrap();
        let file = dir.path().join("big.txt");
        tokio::fs::write(&file, "x".repeat(300 * 1024)).await.unwrap();

        let result = tool
            .execute(serde_json::json!({"file_path": file.display().to_string()}), &ctx)
            .await;
        assert!(result.is_error);
        // O erro TEM de ensinar o remédio (offset/limit) — é o que faz o
        // modelo repaginar em vez de desistir.
        assert!(text_of(&result).contains("Use offset and limit parameters"));

        // Com limit explícito a leitura parcial passa.
        let result = tool
            .execute(
                serde_json::json!({"file_path": file.display().to_string(), "limit": 1, "offset": 1}),
                &ctx,
            )
            .await;
        assert!(!result.is_error || text_of(&result).contains("tokens"));
    }
}
