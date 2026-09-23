//! Conversão do resultado de um `tools/call` MCP no tool_result do CLI, e os
//! utilitários de nome e descrição das tools MCP.
//!
//! Referências JS: `services/mcp/client/callMCPTool.js` (`isError` vira erro
//! com o texto do primeiro bloco, ou `result.error`, ou `Unknown error`),
//! `services/mcp/client/transformMCPResult.js` (`toolResult` legado,
//! `structuredContent` como JSON e os blocos), `transformResultContent.js`
//! (texto, imagem, áudio, recurso, link de recurso),
//! `services/mcp/client/processMCPResult.js` e `utils/mcpValidation.js`
//! (o teto de tokens: persistir em arquivo com as instruções de
//! `utils/mcpOutputStorage.js` ou cortar quando há imagem),
//! `services/mcp/normalization.js` (`normalizeNameForMCP`),
//! `services/mcp/mcpStringUtils.js` (`buildMcpToolName`) e o `prompt()` das
//! tools MCP em `services/mcp/client/init_client20.js` (descrição cortada em
//! 2048 com `… [truncated]`).

use std::path::Path;

use serde_json::{json, Value};

use crate::tools::framework::{ToolResult, ToolResultContent};
use crate::tools::permission::{PermissionAsk, PermissionResult};

/// `MAX_MCP_DESCRIPTION_LENGTH`.
pub const MAX_MCP_DESCRIPTION_LENGTH: usize = 2048;

/// `DEFAULT_MAX_MCP_OUTPUT_TOKENS`.
pub const DEFAULT_MAX_MCP_OUTPUT_TOKENS: usize = 25_000;

/// `IMAGE_TOKEN_ESTIMATE`.
const IMAGE_TOKEN_ESTIMATE: usize = 1_600;

/// `normalizeNameForMCP`: tudo fora de `[a-zA-Z0-9_-]` vira `_`; nomes de
/// servidor `claude.ai ...` ainda colapsam e aparam os `_`.
pub fn normalize_name_for_mcp(name: &str) -> String {
    let mut normalized: String = name
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || c == '_' || c == '-' {
                c
            } else {
                '_'
            }
        })
        .collect();
    if name.starts_with("claude.ai ") {
        let mut collapsed = String::new();
        let mut last_underscore = false;
        for c in normalized.chars() {
            if c == '_' {
                if !last_underscore {
                    collapsed.push(c);
                }
                last_underscore = true;
            } else {
                collapsed.push(c);
                last_underscore = false;
            }
        }
        normalized = collapsed.trim_matches('_').to_string();
    }
    normalized
}

/// `buildMcpToolName`: `mcp__<servidor>__<tool>` com os dois normalizados.
pub fn build_mcp_tool_name(server_name: &str, tool_name: &str) -> String {
    format!(
        "mcp__{}__{}",
        normalize_name_for_mcp(server_name),
        normalize_name_for_mcp(tool_name)
    )
}

/// A descrição que vai ao modelo: cortada em 2048 unidades com
/// `… [truncated]` (o caractere é a reticência U+2026).
pub fn mcp_tool_description(description: &str) -> String {
    if crate::tools::framework::js_len(description) > MAX_MCP_DESCRIPTION_LENGTH {
        format!(
            "{}\u{2026} [truncated]",
            crate::tools::framework::js_slice(description, 0, MAX_MCP_DESCRIPTION_LENGTH)
        )
    } else {
        description.to_string()
    }
}

/// O `checkPermissions` de toda tool MCP: `passthrough` com a sugestão de
/// regra allow para a tool inteira.
pub fn mcp_check_permissions(full_tool_name: &str) -> PermissionResult {
    PermissionResult::Passthrough(PermissionAsk {
        message: crate::tools::permission::create_permission_request_message(full_tool_name, None),
        suggestions: Some(json!([{
            "type": "addRules",
            "rules": [{"toolName": full_tool_name}],
            "behavior": "allow",
            "destination": "localSettings"
        }])),
        ..Default::default()
    })
}

/// O `mcpMeta` que o JS anexa ao frame `user` (fora do subagente):
/// `_meta` e `structuredContent` crus do servidor, quando vieram.
pub fn mcp_meta(result: &Value) -> Option<Value> {
    let meta = result.get("_meta").filter(|v| !v.is_null());
    let structured = result.get("structuredContent").filter(|v| !v.is_null());
    if meta.is_none() && structured.is_none() {
        return None;
    }
    let mut out = serde_json::Map::new();
    if let Some(m) = meta {
        out.insert("_meta".into(), m.clone());
    }
    if let Some(s) = structured {
        out.insert("structuredContent".into(), s.clone());
    }
    Some(Value::Object(out))
}

/// `inferCompactSchema`.
fn infer_compact_schema(value: &Value, depth: i32) -> String {
    match value {
        Value::Null => "null".to_string(),
        Value::Array(items) => match items.first() {
            None => "[]".to_string(),
            Some(first) => format!("[{}]", infer_compact_schema(first, depth - 1)),
        },
        Value::Object(map) => {
            if depth <= 0 {
                return "{...}".to_string();
            }
            let props: Vec<String> = map
                .iter()
                .take(10)
                .map(|(k, v)| format!("{k}: {}", infer_compact_schema(v, depth - 1)))
                .collect();
            let suffix = if map.len() > 10 { ", ..." } else { "" };
            format!("{{{}{suffix}}}", props.join(", "))
        }
        Value::String(_) => "string".to_string(),
        Value::Number(_) => "number".to_string(),
        Value::Bool(_) => "boolean".to_string(),
    }
}

/// O conteúdo transformado (`transformMCPResult`).
enum Transformed {
    /// Texto único (`toolResult` legado ou `structuredContent`).
    Text { text: String, format: String },
    /// Blocos (`content`), na forma da API.
    Blocks { blocks: Vec<Value>, format: String },
}

fn persist_dir_blob(
    bytes: &[u8],
    mime: Option<&str>,
    server: &str,
    prefix: &str,
    dir: Option<&Path>,
) -> Value {
    let mime_text = mime.unwrap_or("unknown type");
    let Some(dir) = dir else {
        return json!({"type": "text", "text": format!("{prefix}Binary content ({mime_text}, {} bytes) could not be saved to disk: no tool results directory", bytes.len())});
    };
    let ext = extension_for_mime(mime);
    let id = format!(
        "mcp-{}-blob-{}-{}",
        normalize_name_for_mcp(server),
        chrono::Utc::now().timestamp_millis(),
        &uuid::Uuid::new_v4().simple().to_string()[..6]
    );
    let path = dir.join(format!("{id}.{ext}"));
    let written = std::fs::create_dir_all(dir).and_then(|_| std::fs::write(&path, bytes));
    match written {
        Ok(()) => json!({"type": "text", "text": format!(
            "{prefix}Binary content ({mime_text}, {}) saved to {}",
            crate::tools::framework::format_file_size(bytes.len() as u64),
            path.display()
        )}),
        Err(e) => json!({"type": "text", "text": format!(
            "{prefix}Binary content ({mime_text}, {} bytes) could not be saved to disk: {e}",
            bytes.len()
        )}),
    }
}

/// `extensionForMimeType`.
fn extension_for_mime(mime: Option<&str>) -> &'static str {
    let Some(mime) = mime else {
        return "bin";
    };
    let base = mime
        .split(';')
        .next()
        .unwrap_or_default()
        .trim()
        .to_lowercase();
    match base.as_str() {
        "application/pdf" => "pdf",
        "application/json" => "json",
        "text/csv" => "csv",
        "text/plain" => "txt",
        "text/html" => "html",
        "text/markdown" => "md",
        "application/zip" => "zip",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => "xlsx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" => "pptx",
        "application/msword" => "doc",
        "application/vnd.ms-excel" => "xls",
        "audio/mpeg" => "mp3",
        "audio/wav" => "wav",
        "audio/ogg" => "ogg",
        "video/mp4" => "mp4",
        "video/webm" => "webm",
        "image/png" => "png",
        "image/jpeg" => "jpg",
        "image/gif" => "gif",
        "image/webp" => "webp",
        "image/svg+xml" => "svg",
        _ => "bin",
    }
}

const IMAGE_MIME_TYPES: &[&str] = &["image/jpeg", "image/png", "image/gif", "image/webp"];

/// A imagem pelo `maybeResizeAndDownsampleImageBuffer`, como o JS faz com
/// toda imagem de MCP. A falha do redimensionamento derruba o resultado
/// inteiro da tool, como no JS (o erro sobe pelo `callMCPTool`).
fn resized_image_block(data: &str, ext: &str) -> Result<Value, String> {
    use base64::Engine as _;
    let engine = base64::engine::general_purpose::STANDARD;
    // O `Buffer.from(..., "base64")` do Node ignora caracteres inválidos em
    // vez de falhar; base64 ilegível vira buffer vazio e cai no erro do
    // redimensionamento.
    let bytes = engine.decode(data).unwrap_or_default();
    let resized = crate::tools::image_resize::maybe_resize_and_downsample(&bytes, bytes.len(), ext)
        .map_err(|e| e.0)?;
    Ok(json!({"type": "image", "source": {
        "data": engine.encode(&resized.buffer),
        "media_type": format!("image/{}", resized.media_type),
        "type": "base64"
    }}))
}

/// `transformResultContent`: um bloco MCP nos blocos da API.
fn transform_block(block: &Value, server: &str, dir: Option<&Path>) -> Result<Vec<Value>, String> {
    use base64::Engine as _;
    let kind = block
        .get("type")
        .and_then(Value::as_str)
        .unwrap_or_default();
    Ok(match kind {
        "text" => vec![
            json!({"type": "text", "text": block.get("text").and_then(Value::as_str).unwrap_or_default()}),
        ],
        "audio" => {
            let data = block
                .get("data")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let bytes = base64::engine::general_purpose::STANDARD
                .decode(data)
                .unwrap_or_default();
            vec![persist_dir_blob(
                &bytes,
                block.get("mimeType").and_then(Value::as_str),
                server,
                &format!("[Audio from {server}] "),
                dir,
            )]
        }
        "image" => {
            let data = block
                .get("data")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let ext = block
                .get("mimeType")
                .and_then(Value::as_str)
                .and_then(|m| m.split('/').nth(1))
                .unwrap_or("png");
            vec![resized_image_block(data, ext)?]
        }
        "resource" => {
            let resource = block.get("resource").cloned().unwrap_or(Value::Null);
            let uri = resource
                .get("uri")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let prefix = format!("[Resource from {server} at {uri}] ");
            if let Some(text) = resource.get("text").and_then(Value::as_str) {
                return Ok(vec![
                    json!({"type": "text", "text": format!("{prefix}{text}")}),
                ]);
            }
            if let Some(blob) = resource.get("blob").and_then(Value::as_str) {
                let mime = resource.get("mimeType").and_then(Value::as_str);
                if IMAGE_MIME_TYPES.contains(&mime.unwrap_or_default()) {
                    let ext = mime.and_then(|m| m.split('/').nth(1)).unwrap_or("png");
                    return Ok(vec![
                        json!({"type": "text", "text": prefix}),
                        resized_image_block(blob, ext)?,
                    ]);
                }
                let bytes = base64::engine::general_purpose::STANDARD
                    .decode(blob)
                    .unwrap_or_default();
                return Ok(vec![persist_dir_blob(&bytes, mime, server, &prefix, dir)]);
            }
            Vec::new()
        }
        "resource_link" => {
            let name = block
                .get("name")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let uri = block.get("uri").and_then(Value::as_str).unwrap_or_default();
            let mut text = format!("[Resource link: {name}] {uri}");
            if let Some(description) = block.get("description").and_then(Value::as_str) {
                if !description.is_empty() {
                    text.push_str(&format!(" ({description})"));
                }
            }
            vec![json!({"type": "text", "text": text})]
        }
        _ => Vec::new(),
    })
}

fn rough_tokens(text: &str) -> usize {
    (crate::tools::framework::js_len(text) as f64 / 4.0).round() as usize
}

fn max_mcp_output_tokens() -> usize {
    std::env::var("MAX_MCP_OUTPUT_TOKENS")
        .ok()
        .and_then(|v| v.trim().parse::<usize>().ok())
        .filter(|v| *v > 0)
        .unwrap_or(DEFAULT_MAX_MCP_OUTPUT_TOKENS)
}

fn truncation_message() -> String {
    format!(
        "\n\n[OUTPUT TRUNCATED - exceeded {} token limit]\n\nThe tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.",
        max_mcp_output_tokens()
    )
}

/// `toLocaleString` do Node para inteiros (separador de milhar `,`).
fn locale_int(n: usize) -> String {
    let digits = n.to_string();
    let mut out = String::new();
    for (i, c) in digits.chars().enumerate() {
        if i > 0 && (digits.len() - i).is_multiple_of(3) {
            out.push(',');
        }
        out.push(c);
    }
    out
}

/// `getLargeOutputInstructions`.
fn large_output_instructions(path: &Path, length: usize, format: &str) -> String {
    format!(
        "Error: result ({} characters) exceeds maximum allowed tokens. Output has been saved to {}.\nFormat: {format}\nUse offset and limit parameters to read specific portions of the file, search within it for specific content, and jq to make structured queries.\nREQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:\n- You MUST read the content from the file at {} in sequential chunks until 100% of the content has been read.\n- If you receive truncation warnings when reading the file, reduce the chunk size until you have read 100% of the content without truncation.\n- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***\n",
        locale_int(length),
        path.display(),
        path.display()
    )
}

fn blocks_to_contents(blocks: &[Value]) -> Vec<ToolResultContent> {
    blocks
        .iter()
        .filter_map(|b| match b.get("type").and_then(Value::as_str) {
            Some("text") => Some(ToolResultContent::Text(
                b.get("text")
                    .and_then(Value::as_str)
                    .unwrap_or_default()
                    .to_string(),
            )),
            Some("image") => Some(ToolResultContent::Image {
                data: b
                    .pointer("/source/data")
                    .and_then(Value::as_str)
                    .unwrap_or_default()
                    .to_string(),
                media_type: b
                    .pointer("/source/media_type")
                    .and_then(Value::as_str)
                    .unwrap_or("image/png")
                    .to_string(),
            }),
            _ => None,
        })
        .collect()
}

/// Converte o `result` de um `tools/call` MCP no `ToolResult` do CLI.
///
/// * `server_name`/`tool_name`: os nomes crus (do servidor e da tool no
///   servidor), usados nas mensagens e nos arquivos persistidos.
/// * `tool_results_dir`: onde persistir resultado acima do teto de tokens e
///   binários (o `tool-results` da sessão); `None` corta em vez de salvar.
///
/// O conteúdo sai como string quando o JS devolve string
/// (`structuredContent`, `toolResult`, instruções de arquivo salvo) e como
/// blocos quando devolve blocos; o `tool_use_result` é esse mesmo conteúdo.
/// `isError` vira erro com o texto do primeiro bloco (ou `result.error`, ou
/// `Unknown error`), como o `McpToolCallError` do JS.
pub fn mcp_call_result_to_tool_result(
    result: &Value,
    server_name: &str,
    tool_name: &str,
    tool_results_dir: Option<&Path>,
) -> ToolResult {
    if result
        .get("isError")
        .and_then(Value::as_bool)
        .unwrap_or(false)
    {
        let details = match result.get("content").and_then(Value::as_array) {
            Some(content) if !content.is_empty() => content[0]
                .get("text")
                .and_then(Value::as_str)
                .map(str::to_string)
                .unwrap_or_else(|| "Unknown error".to_string()),
            _ => match result.get("error") {
                Some(Value::String(s)) => s.clone(),
                Some(other) if !other.is_null() => other.to_string(),
                _ => "Unknown error".to_string(),
            },
        };
        return ToolResult::error(details.clone())
            .with_tool_use_result(Value::String(format!("Error: {details}")));
    }

    let transformed = if let Some(legacy) = result.get("toolResult") {
        Transformed::Text {
            text: match legacy {
                Value::String(s) => s.clone(),
                other => other.to_string(),
            },
            format: "Plain text".to_string(),
        }
    } else if let Some(structured) = result.get("structuredContent").filter(|v| !v.is_null()) {
        Transformed::Text {
            text: serde_json::to_string(structured).unwrap_or_default(),
            format: format!("JSON with schema: {}", infer_compact_schema(structured, 2)),
        }
    } else if let Some(content) = result.get("content").and_then(Value::as_array) {
        let mut blocks: Vec<Value> = Vec::new();
        for block in content {
            match transform_block(block, server_name, tool_results_dir) {
                Ok(transformed) => blocks.extend(transformed),
                // Como no JS: o erro da imagem sobe e o resultado inteiro
                // vira erro da tool, com a mensagem do erro.
                Err(message) => {
                    return ToolResult::error(message.clone())
                        .with_tool_use_result(Value::String(format!("Error: {message}")));
                }
            }
        }
        let format = format!(
            "JSON array with schema: {}",
            infer_compact_schema(&Value::Array(blocks.clone()), 2)
        );
        Transformed::Blocks { blocks, format }
    } else {
        let message = format!(
            "MCP server \"{server_name}\" tool \"{tool_name}\": unexpected response format"
        );
        return ToolResult::error(message.clone())
            .with_tool_use_result(Value::String(format!("Error: {message}")));
    };

    let max_tokens = max_mcp_output_tokens();
    let (size, has_images) = match &transformed {
        Transformed::Text { text, .. } => (rough_tokens(text), false),
        Transformed::Blocks { blocks, .. } => (
            blocks
                .iter()
                .map(|b| match b.get("type").and_then(Value::as_str) {
                    Some("text") => {
                        rough_tokens(b.get("text").and_then(Value::as_str).unwrap_or_default())
                    }
                    Some("image") => IMAGE_TOKEN_ESTIMATE,
                    _ => 0,
                })
                .sum(),
            blocks
                .iter()
                .any(|b| b.get("type").and_then(Value::as_str) == Some("image")),
        ),
    };
    // O JS confirma o excesso com a contagem de tokens da API; sem ela, a
    // estimativa local (4 caracteres por token) decide.
    let too_large = size > max_tokens;

    if too_large && !has_images {
        if let Some(dir) = tool_results_dir {
            let (content_str, format) = match &transformed {
                Transformed::Text { text, format } => (text.clone(), format.clone()),
                Transformed::Blocks { blocks, format } => (
                    serde_json::to_string_pretty(&Value::Array(blocks.clone())).unwrap_or_default(),
                    format.clone(),
                ),
            };
            let id = format!(
                "mcp-{}-{}-{}",
                normalize_name_for_mcp(server_name),
                normalize_name_for_mcp(tool_name),
                chrono::Utc::now().timestamp_millis()
            );
            let path = dir.join(format!("{id}.txt"));
            let saved =
                std::fs::create_dir_all(dir).and_then(|_| std::fs::write(&path, &content_str));
            let text = match saved {
                Ok(()) => large_output_instructions(
                    &path,
                    crate::tools::framework::js_len(&content_str),
                    &format,
                ),
                Err(e) => format!(
                    "Error: result ({} characters) exceeds maximum allowed tokens. Failed to save output to file: {e}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.",
                    locale_int(crate::tools::framework::js_len(&content_str))
                ),
            };
            return ToolResult::text(text.clone()).with_tool_use_result(Value::String(text));
        }
    }

    match transformed {
        Transformed::Text { mut text, .. } => {
            if too_large {
                text = format!(
                    "{}{}",
                    crate::tools::framework::js_slice(&text, 0, max_tokens * 4),
                    truncation_message()
                );
            }
            ToolResult::text(text.clone()).with_tool_use_result(Value::String(text))
        }
        Transformed::Blocks { mut blocks, .. } => {
            if too_large {
                let max_chars = max_tokens * 4;
                let mut current = 0usize;
                let mut kept: Vec<Value> = Vec::new();
                for block in blocks {
                    match block.get("type").and_then(Value::as_str) {
                        Some("text") => {
                            let text = block
                                .get("text")
                                .and_then(Value::as_str)
                                .unwrap_or_default();
                            let remaining = max_chars.saturating_sub(current);
                            if remaining == 0 {
                                break;
                            }
                            let len = crate::tools::framework::js_len(text);
                            if len <= remaining {
                                current += len;
                                kept.push(block);
                            } else {
                                kept.push(json!({"type": "text", "text": crate::tools::framework::js_slice(text, 0, remaining)}));
                                break;
                            }
                        }
                        Some("image") => {
                            let image_chars = IMAGE_TOKEN_ESTIMATE * 4;
                            if current + image_chars <= max_chars {
                                current += image_chars;
                                kept.push(block);
                            }
                        }
                        _ => kept.push(block),
                    }
                }
                kept.push(json!({"type": "text", "text": truncation_message()}));
                blocks = kept;
            }
            ToolResult::mixed(blocks_to_contents(&blocks))
                .with_tool_use_result(Value::Array(blocks))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn content_blocks_stay_as_array() {
        let result =
            json!({"content": [{"type": "text", "text": "a"}, {"type": "text", "text": "b"}]});
        let out = mcp_call_result_to_tool_result(&result, "srv", "t", None);
        assert!(!out.is_error);
        assert!(!out.content_as_string);
        assert_eq!(out.content.len(), 2);
        assert_eq!(
            out.tool_use_result,
            Some(json!([{"type": "text", "text": "a"}, {"type": "text", "text": "b"}]))
        );
    }

    #[test]
    fn structured_content_wins_and_goes_as_json_string() {
        let result = json!({"content": [{"type": "text", "text": "ignorado"}], "structuredContent": {"a": 1}});
        let out = mcp_call_result_to_tool_result(&result, "srv", "t", None);
        assert!(out.content_as_string);
        assert_eq!(out.text_content(), "{\"a\":1}");
    }

    #[test]
    fn is_error_uses_first_block_or_unknown_error() {
        let out = mcp_call_result_to_tool_result(
            &json!({"isError": true, "content": [{"type": "text", "text": "falhou"}]}),
            "srv",
            "t",
            None,
        );
        assert!(out.is_error);
        assert_eq!(out.text_content(), "falhou");
        let out = mcp_call_result_to_tool_result(
            &json!({"isError": true, "content": []}),
            "srv",
            "t",
            None,
        );
        assert_eq!(out.text_content(), "Unknown error");
    }

    #[test]
    fn image_that_fails_to_resize_fails_the_whole_result_like_the_js() {
        let result = json!({"content": [
            {"type": "text", "text": "antes"},
            {"type": "image", "data": "", "mimeType": "image/png"}
        ]});
        let out = mcp_call_result_to_tool_result(&result, "srv", "t", None);
        assert!(out.is_error);
        assert_eq!(out.text_content(), "Image file is empty (0 bytes)");
        assert_eq!(
            out.tool_use_result,
            Some(json!("Error: Image file is empty (0 bytes)"))
        );
    }

    #[test]
    fn resource_and_link_get_the_js_prefixes() {
        let result = json!({"content": [
            {"type": "resource", "resource": {"uri": "file:///a", "text": "conteúdo"}},
            {"type": "resource_link", "name": "doc", "uri": "https://x", "description": "d"}
        ]});
        let out = mcp_call_result_to_tool_result(&result, "srv", "t", None);
        assert_eq!(
            out.text_content(),
            "[Resource from srv at file:///a] conteúdo\n[Resource link: doc] https://x (d)"
        );
    }

    #[test]
    fn names_and_descriptions_follow_the_js() {
        assert_eq!(
            build_mcp_tool_name("my server", "do.it"),
            "mcp__my_server__do_it"
        );
        assert_eq!(
            normalize_name_for_mcp("claude.ai Google Drive"),
            "claude_ai_Google_Drive"
        );
        let long = "a".repeat(3000);
        let cut = mcp_tool_description(&long);
        assert!(cut.ends_with("\u{2026} [truncated]"));
        assert_eq!(crate::tools::framework::js_len(&cut), 2048 + 13);
    }

    #[test]
    fn large_text_is_persisted_with_instructions() {
        let dir = tempfile::tempdir().unwrap();
        let big = "x".repeat(DEFAULT_MAX_MCP_OUTPUT_TOKENS * 4 + 100);
        let result = json!({"content": [{"type": "text", "text": big}]});
        let out = mcp_call_result_to_tool_result(&result, "srv", "t", Some(dir.path()));
        let text = out.text_content();
        assert!(text.starts_with("Error: result ("), "{text}");
        assert!(text.contains("Format: JSON array with schema: [{type: string, text: string}]"));
    }
}
