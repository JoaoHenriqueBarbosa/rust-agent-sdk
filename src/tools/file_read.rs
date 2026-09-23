//! O Read, com paridade com o `FileReadTool` do CLI 2.1.90
//! (`tools/FileReadTool/FileReadTool/init_FileReadTool.js`, `callInner.js`,
//! `prompt.js`, `limits.js`, `utils/readFileInRange.js`, `utils/file.js`,
//! `utils/notebook.js`, `utils/imageResizer.js`, `utils/pdf.js`).
//!
//! O modelo foi treinado contra o Read do CLI; divergir aqui produz erro
//! silencioso (numeração deslocada) ou loop (erro que o modelo não
//! reconhece). Por isso cada texto, limite e mensagem segue o JS.

use std::path::{Path, PathBuf};

use async_trait::async_trait;
use serde_json::{json, Value};

use crate::api::types::{ApiMessage, ContentBlock, ImageSource};
use crate::tools::file_state::FileState;
use crate::tools::framework::{
    format_file_size, js_len, Tool, ToolContext, ToolResult, ToolResultContent,
};
use crate::tools::image_resize::{
    compress_image_buffer_with_token_limit, create_image_metadata_text,
    detect_image_format_from_buffer, maybe_resize_and_downsample, ultra_compressed_jpeg,
};
use crate::tools::pdf::{
    extract_pdf_pages, get_pdf_page_count, is_pdf_extension, is_pdf_supported, list_page_images,
    parse_pdf_page_range, read_pdf, PDF_AT_MENTION_INLINE_THRESHOLD, PDF_MAX_PAGES_PER_READ,
};
use crate::tools::permission::{
    check_read_permission, expand_path, PermissionResult, PermissionRules,
};
use crate::tools::schema_validation::semantic_number;

/// `MAX_LINES_TO_READ` de `prompt.js`.
pub const MAX_LINES_TO_READ: u64 = 2000;

/// `MAX_OUTPUT_SIZE` de `utils/file.js` (256KB): teto de bytes sem `limit`.
pub const MAX_OUTPUT_SIZE: u64 = 262_144;

/// `DEFAULT_MAX_OUTPUT_TOKENS` de `limits.js`.
pub const DEFAULT_MAX_OUTPUT_TOKENS: usize = 25_000;

/// `FAST_PATH_MAX_SIZE` de `readFileInRange.js` (10MB).
const FAST_PATH_MAX_SIZE: u64 = 10_485_760;

/// Tamanho do bloco da leitura em streaming (`highWaterMark` do JS).
const STREAM_CHUNK: u64 = 524_288;

/// `FILE_NOT_FOUND_CWD_NOTE` de `utils/file.js`.
const FILE_NOT_FOUND_CWD_NOTE: &str = "Note: your current working directory is";

/// `LINE_FORMAT_INSTRUCTION` de `prompt.js`.
const LINE_FORMAT_INSTRUCTION: &str =
    "- Results are returned using cat -n format, with line numbers starting at 1";

/// `OFFSET_INSTRUCTION_DEFAULT` de `prompt.js`.
const OFFSET_INSTRUCTION_DEFAULT: &str = "- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters";

/// `OFFSET_INSTRUCTION_TARGETED` de `prompt.js`.
const OFFSET_INSTRUCTION_TARGETED: &str = "- When you already know which part of the file you need, only read that part. This can be important for larger files.";

/// O valor de `targetedRangeNudge` que o CLI usa quando a configuração
/// remota (`tengu_amber_wren`) chega: `true`, medido no 2.1.90. Sem a
/// configuração remota (primeira execução sem cache) o CLI usa o texto
/// default; [`read_tool_prompt`] reproduz os dois.
pub const TARGETED_RANGE_NUDGE: bool = true;

/// `CYBER_RISK_MITIGATION_REMINDER` de `init_FileReadTool.js`.
const CYBER_RISK_MITIGATION_REMINDER: &str = "\n\n<system-reminder>\nWhenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.\n</system-reminder>\n";

/// `BLOCKED_DEVICE_PATHS` de `init_FileReadTool.js`.
const BLOCKED_DEVICE_PATHS: &[&str] = &[
    "/dev/zero",
    "/dev/random",
    "/dev/urandom",
    "/dev/full",
    "/dev/stdin",
    "/dev/tty",
    "/dev/console",
    "/dev/stdout",
    "/dev/stderr",
    "/dev/fd/0",
    "/dev/fd/1",
    "/dev/fd/2",
];

/// `IMAGE_EXTENSIONS` de `init_FileReadTool.js`.
const IMAGE_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg", "gif", "webp"];

/// `BINARY_EXTENSIONS` de `constants/files.js`.
const BINARY_EXTENSIONS: &[&str] = &[
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".tiff", ".tif", ".mp4", ".mov",
    ".avi", ".mkv", ".webm", ".wmv", ".flv", ".m4v", ".mpeg", ".mpg", ".mp3", ".wav", ".ogg",
    ".flac", ".aac", ".m4a", ".wma", ".aiff", ".opus", ".zip", ".tar", ".gz", ".bz2", ".7z",
    ".rar", ".xz", ".z", ".tgz", ".iso", ".exe", ".dll", ".so", ".dylib", ".bin", ".o", ".a",
    ".obj", ".lib", ".app", ".msi", ".deb", ".rpm", ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".ppt", ".pptx", ".odt", ".ods", ".odp", ".ttf", ".otf", ".woff", ".woff2", ".eot", ".pyc",
    ".pyo", ".class", ".jar", ".war", ".ear", ".node", ".wasm", ".rlib", ".sqlite", ".sqlite3",
    ".db", ".mdb", ".idx", ".psd", ".ai", ".eps", ".sketch", ".fig", ".xd", ".blend", ".3ds",
    ".max", ".swf", ".fla", ".lockb", ".dat", ".data",
];

/// O prompt do Read (`renderPromptTemplate` de `prompt.js`): o suporte a PDF
/// depende do modelo (`isPDFSupported`) e a linha de offset/limit depende do
/// `targetedRangeNudge` da configuração remota.
pub fn read_tool_prompt(pdf_supported: bool, targeted_range_nudge: bool) -> String {
    let offset_instruction = if targeted_range_nudge {
        OFFSET_INSTRUCTION_TARGETED
    } else {
        OFFSET_INSTRUCTION_DEFAULT
    };
    let pdf = if pdf_supported {
        format!("\n- This tool can read PDF files (.pdf). For large PDFs (more than {PDF_AT_MENTION_INLINE_THRESHOLD} pages), you MUST provide the pages parameter to read specific page ranges (e.g., pages: \"1-5\"). Reading a large PDF without the pages parameter will fail. Maximum {PDF_MAX_PAGES_PER_READ} pages per request.")
    } else {
        String::new()
    };
    format!(
        "Reads a file from the local filesystem. You can access any file directly by using this tool.\n\
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.\n\
\n\
Usage:\n\
- The file_path parameter must be an absolute path, not a relative path\n\
- By default, it reads up to {MAX_LINES_TO_READ} lines starting from the beginning of the file\n\
{offset_instruction}\n\
{LINE_FORMAT_INSTRUCTION}\n\
- This tool allows Claude Code to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually as Claude Code is a multimodal LLM.{pdf}\n\
- This tool can read Jupyter notebooks (.ipynb files) and returns all cells with their outputs, combining code, text, and visualizations.\n\
- This tool can only read files, not directories. To read a directory, use an ls command via the Bash tool.\n\
- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.\n\
- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents."
    )
}

/// `FILE_UNCHANGED_STUB` de `prompt.js`. O texto do JS tem um travessão, que
/// é montado em runtime.
pub fn file_unchanged_stub() -> String {
    let dash = char::from_u32(0x2014).unwrap_or('-');
    format!("File unchanged since last read. The content from the earlier Read tool_result in this conversation is still current {dash} refer to that instead of re-reading.")
}

fn default_prompt() -> &'static str {
    static PROMPT: std::sync::OnceLock<String> = std::sync::OnceLock::new();
    PROMPT.get_or_init(|| read_tool_prompt(true, TARGETED_RANGE_NUDGE))
}

/// Read files from the local filesystem, como o Read do CLI.
pub struct FileReadTool;

impl FileReadTool {
    /// O Read com o prompt do modelo dado (sem a linha de PDF para os modelos
    /// que não leem PDF, como o `isPDFSupported` do JS).
    pub fn for_model(model: Option<&str>) -> ModelScopedFileReadTool {
        ModelScopedFileReadTool {
            prompt: read_tool_prompt(is_pdf_supported(model), TARGETED_RANGE_NUDGE),
        }
    }
}

/// O Read com um prompt calculado para um modelo específico.
pub struct ModelScopedFileReadTool {
    prompt: String,
}

fn input_schema() -> Value {
    json!({
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "file_path": {
                "description": "The absolute path to the file to read",
                "type": "string"
            },
            "offset": {
                "description": "The line number to start reading from. Only provide if the file is too large to read at once",
                "type": "integer",
                "minimum": 0,
                "maximum": 9007199254740991i64
            },
            "limit": {
                "description": "The number of lines to read. Only provide if the file is too large to read at once.",
                "type": "integer",
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991i64
            },
            "pages": {
                "description": format!("Page range for PDF files (e.g., \"1-5\", \"3\", \"10-20\"). Only applicable to PDF files. Maximum {PDF_MAX_PAGES_PER_READ} pages per request."),
                "type": "string"
            }
        },
        "required": ["file_path"],
        "additionalProperties": false
    })
}

/// `path.extname` do Node.
fn js_extname(path: &str) -> String {
    let base = path.rsplit('/').next().unwrap_or(path);
    match base.rfind('.') {
        Some(idx) if idx > 0 => base[idx..].to_string(),
        _ => String::new(),
    }
}

/// `hasBinaryExtension`: o sufixo desde o último ponto do caminho inteiro.
fn has_binary_extension(path: &str) -> bool {
    let ext = match path.rfind('.') {
        Some(idx) => path[idx..].to_lowercase(),
        None => path
            .chars()
            .last()
            .map(|c| c.to_lowercase().to_string())
            .unwrap_or_default(),
    };
    BINARY_EXTENSIONS.contains(&ext.as_str())
}

/// `isBlockedDevicePath`.
fn is_blocked_device_path(path: &str) -> bool {
    BLOCKED_DEVICE_PATHS.contains(&path)
        || (path.starts_with("/proc/")
            && (path.ends_with("/fd/0") || path.ends_with("/fd/1") || path.ends_with("/fd/2")))
}

/// O teto de tokens: `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` ou 25000.
fn max_tokens(ctx: &ToolContext) -> usize {
    let raw = ctx
        .extra_env
        .get("CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS")
        .cloned()
        .or_else(|| std::env::var("CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS").ok());
    raw.and_then(|v| {
        let digits: String = v
            .trim()
            .chars()
            .take_while(|c| c.is_ascii_digit())
            .collect();
        digits.parse::<usize>().ok()
    })
    .filter(|n| *n > 0)
    .unwrap_or(DEFAULT_MAX_OUTPUT_TOKENS)
}

/// `shouldIncludeFileReadMitigation`: todos os modelos, menos o
/// claude-opus-4-6 (`MITIGATION_EXEMPT_MODELS`). Sem modelo conhecido vale o
/// default do CLI, que não é isento.
fn should_include_mitigation(model: Option<&str>) -> bool {
    !model
        .map(|m| m.to_lowercase().contains("claude-opus-4-6"))
        .unwrap_or(false)
}

/// `roughTokenCountEstimationForFileType`.
fn rough_token_estimate(content: &str, ext: &str) -> usize {
    let bytes_per_token = match ext {
        "json" | "jsonl" | "jsonc" => 2.0,
        _ => 4.0,
    };
    (js_len(content) as f64 / bytes_per_token).round() as usize
}

/// `validateContentTokens`. O JS confirma com a API de contagem de tokens
/// quando a estimativa passa de 1/4 do teto e, sem a API, usa a estimativa;
/// o nativo não tem o endpoint de contagem, então vale a estimativa.
fn validate_content_tokens(content: &str, ext: &str, max_tokens: usize) -> Result<(), String> {
    let estimate = rough_token_estimate(content, ext);
    if estimate == 0 || estimate <= max_tokens / 4 {
        return Ok(());
    }
    if estimate > max_tokens {
        return Err(format!(
            "File content ({estimate} tokens) exceeds maximum allowed tokens ({max_tokens}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file."
        ));
    }
    Ok(())
}

/// `addLineNumbers` (prefixo compacto `N\t`, o formato ligado no 2.1.90).
fn add_line_numbers(content: &str, start_line: u64) -> String {
    if content.is_empty() {
        return String::new();
    }
    content
        .split('\n')
        .enumerate()
        .map(|(i, line)| {
            let line = line.strip_suffix('\r').unwrap_or(line);
            format!("{}\t{}", i as u64 + start_line, line)
        })
        .collect::<Vec<_>>()
        .join("\n")
}

/// O mtime em milissegundos, truncado (`Math.floor(stats.mtimeMs)`).
fn mtime_ms(meta: &std::fs::Metadata) -> i64 {
    meta.modified()
        .ok()
        .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

/// Falha da leitura: arquivo inexistente (vira a mensagem com sugestão) ou
/// qualquer outro erro, já com o texto final.
enum ReadError {
    NotFound,
    Message(String),
}

impl From<String> for ReadError {
    fn from(s: String) -> Self {
        ReadError::Message(s)
    }
}

/// A mensagem de erro de fs do Node (`CODE: descrição, syscall 'caminho'`).
fn node_fs_error(err: &std::io::Error, syscall: &str, path: &Path) -> ReadError {
    use std::io::ErrorKind;
    let path = path.to_string_lossy();
    let described = |code: &str, text: &str| format!("{code}: {text}, {syscall} '{path}'");
    let message = match err.kind() {
        ErrorKind::NotFound => return ReadError::NotFound,
        ErrorKind::PermissionDenied => described("EACCES", "permission denied"),
        ErrorKind::IsADirectory => described("EISDIR", "illegal operation on a directory"),
        ErrorKind::NotADirectory => described("ENOTDIR", "not a directory"),
        _ => match err.raw_os_error() {
            Some(libc::ELOOP) => described("ELOOP", "too many symbolic links encountered"),
            Some(libc::EMFILE) => described("EMFILE", "too many open files"),
            _ => err.to_string(),
        },
    };
    ReadError::Message(message)
}

/// Resultado de `readFileInRange`.
struct RangeRead {
    content: String,
    line_count: u64,
    total_lines: u64,
    mtime_ms: i64,
    /// O arquivo não tem nenhum byte.
    is_empty_file: bool,
}

/// Seleciona as linhas `[offset, offset + max_lines)` de um texto já
/// decodificado (`readFileInRangeFast`).
fn select_lines(text: &str, offset: u64, max_lines: Option<u64>) -> (Vec<String>, u64) {
    let text = text.strip_prefix('\u{feff}').unwrap_or(text);
    let end = max_lines
        .map(|m| offset.saturating_add(m))
        .unwrap_or(u64::MAX);
    let mut selected: Vec<String> = Vec::new();
    let mut index: u64 = 0;
    for piece in text.split('\n') {
        if index >= offset && index < end {
            let line = piece.strip_suffix('\r').unwrap_or(piece);
            selected.push(line.to_string());
        }
        index += 1;
    }
    (selected, index)
}

/// `readFileInRange(filePath, offset, maxLines, maxBytes)`.
async fn read_file_in_range(
    path: &Path,
    offset: u64,
    max_lines: Option<u64>,
    max_bytes: Option<u64>,
) -> Result<RangeRead, ReadError> {
    let meta = tokio::fs::metadata(path)
        .await
        .map_err(|e| node_fs_error(&e, "stat", path))?;
    if meta.is_dir() {
        return Err(ReadError::Message(format!(
            "EISDIR: illegal operation on a directory, read '{}'",
            path.to_string_lossy()
        )));
    }
    let too_large = |size: u64, max: u64| {
        ReadError::Message(format!(
            "File content ({}) exceeds maximum allowed size ({}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.",
            format_file_size(size),
            format_file_size(max)
        ))
    };
    if meta.is_file() && meta.len() < FAST_PATH_MAX_SIZE {
        if let Some(max) = max_bytes {
            if meta.len() > max {
                return Err(too_large(meta.len(), max));
            }
        }
        let bytes = tokio::fs::read(path)
            .await
            .map_err(|e| node_fs_error(&e, "open", path))?;
        let text = String::from_utf8_lossy(&bytes);
        let (selected, total_lines) = select_lines(&text, offset, max_lines);
        return Ok(RangeRead {
            line_count: selected.len() as u64,
            content: selected.join("\n"),
            total_lines,
            mtime_ms: mtime_ms(&meta),
            is_empty_file: bytes.is_empty(),
        });
    }
    // Streaming (arquivos grandes ou especiais): sem `limit`, o JS aborta no
    // primeiro bloco que passa do teto, e o tamanho relatado é o lido.
    if let Some(max) = max_bytes {
        if meta.is_file() && meta.len() > max {
            return Err(too_large(STREAM_CHUNK.min(meta.len()), max));
        }
    }
    let mut total_read: u64 = 0;
    use tokio::io::AsyncBufReadExt as _;
    let file = tokio::fs::File::open(path)
        .await
        .map_err(|e| node_fs_error(&e, "open", path))?;
    let mut reader = tokio::io::BufReader::with_capacity(STREAM_CHUNK as usize, file);
    let end = max_lines
        .map(|m| offset.saturating_add(m))
        .unwrap_or(u64::MAX);
    let mut selected: Vec<String> = Vec::new();
    let mut index: u64 = 0;
    let mut buf: Vec<u8> = Vec::new();
    let mut first = true;
    loop {
        buf.clear();
        let n = reader
            .read_until(b'\n', &mut buf)
            .await
            .map_err(|e| ReadError::Message(e.to_string()))?;
        total_read += n as u64;
        if let Some(max) = max_bytes {
            if total_read > max {
                return Err(too_large(total_read, max));
            }
        }
        if n == 0 {
            // A última linha (vazia quando o arquivo termina em `\n`).
            if index >= offset && index < end {
                selected.push(String::new());
            }
            index += 1;
            break;
        }
        let ended = buf.last() == Some(&b'\n');
        if ended {
            buf.pop();
        }
        let mut line = String::from_utf8_lossy(&buf).into_owned();
        if first {
            first = false;
            if let Some(rest) = line.strip_prefix('\u{feff}') {
                line = rest.to_string();
            }
        }
        if index >= offset && index < end {
            let line = line.strip_suffix('\r').map(str::to_string).unwrap_or(line);
            selected.push(line);
        }
        if !ended {
            index += 1;
            break;
        }
        index += 1;
    }
    Ok(RangeRead {
        line_count: selected.len() as u64,
        content: selected.join("\n"),
        total_lines: index,
        mtime_ms: mtime_ms(&meta),
        is_empty_file: total_read == 0,
    })
}

/// `getAlternateScreenshotPath`: o nome de screenshot do macOS com espaço
/// comum ou espaço fino antes de AM/PM.
fn alternate_screenshot_path(path: &str) -> Option<String> {
    static RE: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    let re =
        RE.get_or_init(|| regex::Regex::new(r"^(.+)([ \x{202F}])(AM|PM)(\.png)$").expect("regex"));
    let file_name = path.rsplit('/').next().unwrap_or(path);
    let caps = re.captures(file_name)?;
    let current = caps.get(2)?.as_str();
    let alternate = if current == " " { "\u{202F}" } else { " " };
    let from = format!("{current}{}{}", &caps[3], &caps[4]);
    let to = format!("{alternate}{}{}", &caps[3], &caps[4]);
    Some(path.replacen(&from, &to, 1))
}

/// `findSimilarFile`: outro arquivo no mesmo diretório com o mesmo nome e
/// extensão diferente.
fn find_similar_file(path: &Path) -> Option<String> {
    let dir = path.parent()?;
    let stem = |name: &str| {
        let ext = js_extname(name);
        name[..name.len() - ext.len()].to_string()
    };
    let wanted = stem(&path.file_name()?.to_string_lossy());
    for entry in std::fs::read_dir(dir).ok()?.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        if stem(&name) == wanted && dir.join(&name) != path {
            return Some(name);
        }
    }
    None
}

/// `suggestPathUnderCwd`: o mesmo caminho relativo ao pai do cwd, trazido
/// para dentro do cwd, quando ele existe.
fn suggest_path_under_cwd(requested: &Path, cwd: &Path) -> Option<String> {
    let parent = cwd.parent().unwrap_or(cwd);
    let resolved = requested
        .parent()
        .and_then(|d| std::fs::canonicalize(d).ok())
        .and_then(|d| requested.file_name().map(|n| d.join(n)))
        .unwrap_or_else(|| requested.to_path_buf());
    let parent_str = parent.to_string_lossy().to_string();
    let parent_prefix = if parent_str == "/" {
        "/".to_string()
    } else {
        format!("{parent_str}/")
    };
    let resolved_str = resolved.to_string_lossy().to_string();
    let cwd_str = cwd.to_string_lossy().to_string();
    if !resolved_str.starts_with(&parent_prefix)
        || resolved_str.starts_with(&format!("{cwd_str}/"))
        || resolved_str == cwd_str
    {
        return None;
    }
    let rel = resolved.strip_prefix(parent).ok()?;
    let corrected = cwd.join(rel);
    if corrected.exists() {
        Some(corrected.to_string_lossy().to_string())
    } else {
        None
    }
}

/// O que `callInner` produz: o resultado pronto para o modelo.
type Inner = Result<ToolResult, ReadError>;

fn image_block(media_type: &str, data: String) -> ToolResultContent {
    ToolResultContent::Image {
        data,
        media_type: media_type.to_string(),
    }
}

/// `readImageWithTokenBudget` + o mapeamento do resultado de imagem.
async fn read_image(resolved: &Path, max_tokens: usize) -> Inner {
    use base64::Engine;
    let engine = &base64::engine::general_purpose::STANDARD;
    let bytes = tokio::fs::read(resolved)
        .await
        .map_err(|e| node_fs_error(&e, "open", resolved))?;
    let original_size = bytes.len();
    if original_size == 0 {
        return Err(ReadError::Message(format!(
            "Image file is empty: {}",
            resolved.to_string_lossy()
        )));
    }
    let detected_media_type = detect_image_format_from_buffer(&bytes);
    let detected_format = detected_media_type.trim_start_matches("image/");
    let resized = maybe_resize_and_downsample(&bytes, original_size, detected_format)
        .map_err(|e| ReadError::Message(e.0))?;
    let mut base64 = engine.encode(&resized.buffer);
    let mut media_type = format!("image/{}", resized.media_type);
    let mut dimensions = resized.dimensions;
    if (base64.len() as f64 * 0.125).ceil() as usize > max_tokens {
        dimensions = None;
        match compress_image_buffer_with_token_limit(&bytes, max_tokens, Some(detected_media_type))
        {
            Ok(compressed) => {
                base64 = compressed.base64;
                media_type = compressed.media_type;
            }
            Err(_) => match ultra_compressed_jpeg(&bytes) {
                Ok(jpeg) => {
                    base64 = engine.encode(&jpeg);
                    media_type = "image/jpeg".to_string();
                }
                Err(_) => {
                    base64 = engine.encode(&bytes);
                    media_type = format!("image/{detected_format}");
                }
            },
        }
    }
    let mut file = serde_json::Map::new();
    file.insert("base64".into(), json!(base64));
    file.insert("type".into(), json!(media_type));
    file.insert("originalSize".into(), json!(original_size));
    if let Some(d) = &dimensions {
        file.insert("dimensions".into(), d.to_json());
    }
    let data = json!({"type": "image", "file": Value::Object(file)});
    let mut result =
        ToolResult::mixed(vec![image_block(&media_type, base64)]).with_tool_use_result(data);
    if let Some(text) = dimensions.and_then(|d| create_image_metadata_text(&d, None)) {
        result = result.with_new_messages(vec![ApiMessage::user(vec![ContentBlock::text(text)])]);
    }
    Ok(result)
}

/// O PDF (`callInner`, ramo `isPDFExtension`).
async fn read_pdf_file(resolved: &Path, pages: Option<&str>, ctx: &ToolContext) -> Inner {
    let tool_results_dir = ctx
        .tool_results_dir
        .clone()
        .unwrap_or_else(|| std::env::temp_dir().join("claude-tool-results"));
    if let Some(pages) = pages {
        let range = parse_pdf_page_range(pages);
        let parts = extract_pdf_pages(resolved, range, &tool_results_dir)
            .await
            .map_err(ReadError::Message)?;
        let mut blocks: Vec<ContentBlock> = Vec::new();
        for image_path in list_page_images(&parts.output_dir)
            .await
            .map_err(ReadError::Message)?
        {
            let bytes = tokio::fs::read(&image_path)
                .await
                .map_err(|e| ReadError::Message(e.to_string()))?;
            let resized = maybe_resize_and_downsample(&bytes, bytes.len(), "jpeg")
                .map_err(|e| ReadError::Message(e.0))?;
            use base64::Engine;
            blocks.push(ContentBlock::Image {
                source: ImageSource {
                    r#type: "base64".to_string(),
                    media_type: format!("image/{}", resized.media_type),
                    data: base64::engine::general_purpose::STANDARD.encode(&resized.buffer),
                },
            });
        }
        let text = format!(
            "PDF pages extracted: {} page(s) from {} ({})",
            parts.count,
            parts.file_path,
            format_file_size(parts.original_size)
        );
        let mut result = ToolResult::text(text).with_tool_use_result(parts.to_json());
        if !blocks.is_empty() {
            result = result.with_new_messages(vec![ApiMessage::user(blocks)]);
        }
        return Ok(result);
    }
    if let Some(count) = get_pdf_page_count(resolved).await {
        if count > PDF_AT_MENTION_INLINE_THRESHOLD {
            return Err(ReadError::Message(format!(
                "This PDF has {count} pages, which is too many to read at once. Use the pages parameter to read specific page ranges (e.g., pages: \"1-5\"). Maximum {PDF_MAX_PAGES_PER_READ} pages per request."
            )));
        }
    }
    tokio::fs::metadata(resolved)
        .await
        .map_err(|e| node_fs_error(&e, "stat", resolved))?;
    // O JS ainda renderiza as páginas quando o PDF passa de 3MB
    // (PDF_EXTRACT_SIZE_THRESHOLD) ou o modelo não lê PDF, só para
    // telemetria; o resultado não é usado, então o nativo não repete isso.
    // O `stat` fica: é ele que transforma arquivo inexistente na mensagem
    // com sugestão de caminho.
    if !is_pdf_supported(ctx.main_model.as_deref()) {
        return Err(ReadError::Message(format!(
            "Reading full PDFs is not supported with this model. Use a newer model (Sonnet 3.5 v2 or later), or use the pages parameter to read specific page ranges (e.g., pages: \"1-5\", maximum {PDF_MAX_PAGES_PER_READ} pages per request). Page extraction requires poppler-utils: install with `brew install poppler` on macOS or `apt-get install poppler-utils` on Debian/Ubuntu."
        )));
    }
    let data = read_pdf(resolved).await.map_err(ReadError::Message)?;
    let text = format!(
        "PDF file read: {} ({})",
        data.file_path,
        format_file_size(data.original_size)
    );
    let document = ContentBlock::document_base64("application/pdf", data.base64.clone());
    Ok(ToolResult::text(text)
        .with_tool_use_result(data.to_json())
        .with_new_messages(vec![ApiMessage::user(vec![document])]))
}

// ---------------------------------------------------------------------------
// Notebook (utils/notebook.js)
// ---------------------------------------------------------------------------

/// `LARGE_OUTPUT_THRESHOLD` de `utils/notebook.js`.
const LARGE_OUTPUT_THRESHOLD: usize = 10_000;

/// `getMaxOutputLength` (BASH_MAX_OUTPUT_LENGTH, default 30000, teto 150000).
fn max_output_length(ctx: &ToolContext) -> usize {
    ctx.extra_env
        .get("BASH_MAX_OUTPUT_LENGTH")
        .cloned()
        .or_else(|| std::env::var("BASH_MAX_OUTPUT_LENGTH").ok())
        .and_then(|v| v.trim().parse::<usize>().ok())
        .filter(|n| *n > 0)
        .map(|n| n.min(150_000))
        .unwrap_or(30_000)
}

/// `formatOutput(...).truncatedContent` do Bash.
fn format_output(content: &str, max_len: usize) -> String {
    static RE: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    let re = RE.get_or_init(|| {
        regex::Regex::new(r"(?i)^data:image/[a-z0-9.+_-]+;base64,").expect("regex")
    });
    if re.is_match(content) || js_len(content) <= max_len {
        return content.to_string();
    }
    let head = crate::tools::framework::js_slice(content, 0, max_len);
    let tail_newlines = content[head.len()..].matches('\n').count();
    format!("{head}\n\n... [{} lines truncated] ...", tail_newlines + 1)
}

fn text_of(value: Option<&Value>) -> Option<String> {
    match value? {
        Value::String(s) => Some(s.clone()),
        Value::Array(parts) => Some(
            parts
                .iter()
                .map(|p| p.as_str().unwrap_or_default())
                .collect::<String>(),
        ),
        _ => None,
    }
}

fn process_output_text(value: Option<&Value>, max_len: usize) -> String {
    match text_of(value) {
        Some(t) if !t.is_empty() => format_output(&t, max_len),
        _ => String::new(),
    }
}

fn extract_image(data: &Value) -> Option<Value> {
    for media in ["image/png", "image/jpeg"] {
        if let Some(s) = data.get(media).and_then(Value::as_str) {
            let cleaned: String = s.chars().filter(|c| !c.is_whitespace()).collect();
            return Some(json!({"image_data": cleaned, "media_type": media}));
        }
    }
    None
}

fn process_output(output: &Value, max_len: usize) -> Value {
    let kind = output
        .get("output_type")
        .and_then(Value::as_str)
        .unwrap_or("");
    match kind {
        "stream" => json!({
            "output_type": kind,
            "text": process_output_text(output.get("text"), max_len),
        }),
        "execute_result" | "display_data" => {
            let mut out = serde_json::Map::new();
            out.insert("output_type".into(), json!(kind));
            let data = output.get("data");
            out.insert(
                "text".into(),
                json!(process_output_text(
                    data.and_then(|d| d.get("text/plain")),
                    max_len
                )),
            );
            if let Some(image) = data.and_then(extract_image) {
                out.insert("image".into(), image);
            }
            Value::Object(out)
        }
        "error" => {
            let traceback = output
                .get("traceback")
                .and_then(Value::as_array)
                .map(|t| {
                    t.iter()
                        .map(|l| l.as_str().unwrap_or_default().to_string())
                        .collect::<Vec<_>>()
                        .join("\n")
                })
                .unwrap_or_default();
            let text = format!(
                "{}: {}\n{}",
                output
                    .get("ename")
                    .and_then(Value::as_str)
                    .unwrap_or("undefined"),
                output
                    .get("evalue")
                    .and_then(Value::as_str)
                    .unwrap_or("undefined"),
                traceback
            );
            json!({"output_type": kind, "text": format_output(&text, max_len)})
        }
        // Correção de bug do JS: lá um `output_type` desconhecido vira
        // `undefined` e o mapeamento seguinte quebra com "Cannot read
        // properties of undefined (reading 'text')", derrubando a leitura do
        // notebook inteiro. Aqui a saída desconhecida vira `null` e é pulada.
        _ => Value::Null,
    }
}

fn is_large_outputs(outputs: &[Value]) -> bool {
    let mut size = 0usize;
    for o in outputs {
        if o.is_null() {
            continue;
        }
        size += o
            .get("text")
            .and_then(Value::as_str)
            .map(js_len)
            .unwrap_or(0);
        size += o
            .pointer("/image/image_data")
            .and_then(Value::as_str)
            .map(js_len)
            .unwrap_or(0);
        if size > LARGE_OUTPUT_THRESHOLD {
            return true;
        }
    }
    false
}

fn process_cell(cell: &Value, index: usize, language: &str, max_len: usize) -> Value {
    let cell_type = cell.get("cell_type").cloned().unwrap_or(Value::Null);
    let cell_id = cell
        .get("id")
        .and_then(Value::as_str)
        .map(str::to_string)
        .unwrap_or_else(|| format!("cell-{index}"));
    let is_code = cell_type == "code";
    let mut data = serde_json::Map::new();
    data.insert("cellType".into(), cell_type);
    data.insert(
        "source".into(),
        match cell.get("source") {
            Some(Value::Array(_)) => json!(text_of(cell.get("source")).unwrap_or_default()),
            Some(other) => other.clone(),
            None => Value::Null,
        },
    );
    if is_code {
        // `execution_count || undefined`: 0 e null somem.
        if let Some(n) = cell
            .get("execution_count")
            .filter(|v| v.as_f64().map(|n| n != 0.0).unwrap_or(false))
        {
            data.insert("execution_count".into(), n.clone());
        }
    }
    data.insert("cell_id".into(), json!(cell_id));
    if is_code {
        data.insert("language".into(), json!(language));
        if let Some(outputs) = cell.get("outputs").and_then(Value::as_array) {
            if !outputs.is_empty() {
                let processed: Vec<Value> =
                    outputs.iter().map(|o| process_output(o, max_len)).collect();
                let value = if is_large_outputs(&processed) {
                    json!([{
                        "output_type": "stream",
                        "text": format!("Outputs are too large to include. Use Bash with: cat <notebook_path> | jq '.cells[{index}].outputs'"),
                    }])
                } else {
                    Value::Array(processed)
                };
                data.insert("outputs".into(), value);
            }
        }
    }
    Value::Object(data)
}

fn js_string(v: Option<&Value>) -> String {
    match v {
        Some(Value::String(s)) => s.clone(),
        Some(Value::Null) => "null".to_string(),
        None => "undefined".to_string(),
        Some(other) => other.to_string(),
    }
}

/// `mapNotebookCellsToToolResult`: um bloco por célula e saída, com textos
/// vizinhos fundidos por `\n`.
fn notebook_content(cells: &[Value]) -> Vec<ToolResultContent> {
    let mut blocks: Vec<ToolResultContent> = Vec::new();
    let push = |block: ToolResultContent, blocks: &mut Vec<ToolResultContent>| {
        if let (Some(ToolResultContent::Text(prev)), ToolResultContent::Text(cur)) =
            (blocks.last_mut(), &block)
        {
            prev.push('\n');
            prev.push_str(cur);
            return;
        }
        blocks.push(block);
    };
    for cell in cells {
        let cell_type = js_string(cell.get("cellType"));
        let language = js_string(cell.get("language"));
        let mut metadata = String::new();
        if cell_type != "code" {
            metadata.push_str(&format!("<cell_type>{cell_type}</cell_type>"));
        }
        if language != "python" && cell_type == "code" {
            metadata.push_str(&format!("<language>{language}</language>"));
        }
        let id = js_string(cell.get("cell_id"));
        let source = js_string(cell.get("source"));
        push(
            ToolResultContent::Text(format!(
                "<cell id=\"{id}\">{metadata}{source}</cell id=\"{id}\">"
            )),
            &mut blocks,
        );
        if let Some(outputs) = cell.get("outputs").and_then(Value::as_array) {
            for output in outputs {
                if let Some(text) = output.get("text").and_then(Value::as_str) {
                    if !text.is_empty() {
                        push(ToolResultContent::Text(format!("\n{text}")), &mut blocks);
                    }
                }
                if let Some(image) = output.get("image") {
                    push(
                        ToolResultContent::Image {
                            data: js_string(image.get("image_data")),
                            media_type: js_string(image.get("media_type")),
                        },
                        &mut blocks,
                    );
                }
            }
        }
    }
    blocks
}

async fn read_notebook_file(
    file_path: &str,
    full: &Path,
    resolved: &Path,
    offset: u64,
    limit: Option<u64>,
    max_tokens: usize,
    ctx: &ToolContext,
) -> Inner {
    let bytes = tokio::fs::read(resolved)
        .await
        .map_err(|e| node_fs_error(&e, "open", resolved))?;
    let notebook: Value =
        serde_json::from_slice(&bytes).map_err(|e| ReadError::Message(e.to_string()))?;
    let Some(metadata) = notebook.get("metadata") else {
        return Err(ReadError::Message(
            "Cannot read properties of undefined (reading 'language_info')".to_string(),
        ));
    };
    let language = metadata
        .pointer("/language_info/name")
        .and_then(Value::as_str)
        .unwrap_or("python")
        .to_string();
    let max_len = max_output_length(ctx);
    let cells: Vec<Value> = notebook
        .get("cells")
        .and_then(Value::as_array)
        .map(|cells| {
            cells
                .iter()
                .enumerate()
                .map(|(i, c)| process_cell(c, i, &language, max_len))
                .collect()
        })
        .unwrap_or_default();
    let cells_json = serde_json::to_string(&cells).unwrap_or_default();
    let cells_bytes = cells_json.len() as u64;
    if cells_bytes > MAX_OUTPUT_SIZE {
        return Err(ReadError::Message(format!(
            "Notebook content ({}) exceeds maximum allowed size ({}). Use Bash with jq to read specific portions:\n  cat \"{file_path}\" | jq '.cells[:20]' # First 20 cells\n  cat \"{file_path}\" | jq '.cells[100:120]' # Cells 100-120\n  cat \"{file_path}\" | jq '.cells | length' # Count total cells\n  cat \"{file_path}\" | jq '.cells[] | select(.cell_type==\"code\") | .source' # All code sources",
            format_file_size(cells_bytes),
            format_file_size(MAX_OUTPUT_SIZE)
        )));
    }
    validate_content_tokens(&cells_json, "ipynb", max_tokens).map_err(ReadError::Message)?;
    let meta = tokio::fs::metadata(resolved)
        .await
        .map_err(|e| node_fs_error(&e, "stat", resolved))?;
    ctx.file_state.set(
        full,
        FileState {
            content: cells_json,
            timestamp: mtime_ms(&meta),
            offset: Some(offset),
            limit,
            is_partial_view: false,
        },
    );
    let content = notebook_content(&cells);
    let data = json!({"type": "notebook", "file": {"filePath": file_path, "cells": cells}});
    Ok(ToolResult::mixed(content).with_tool_use_result(data))
}

#[allow(clippy::too_many_arguments)]
async fn read_text_file(
    file_path: &str,
    full: &Path,
    resolved: &Path,
    ext: &str,
    offset: u64,
    limit: Option<u64>,
    max_tokens: usize,
    ctx: &ToolContext,
) -> Inner {
    let line_offset = if offset == 0 { 0 } else { offset - 1 };
    let max_bytes = if limit.is_none() {
        Some(MAX_OUTPUT_SIZE)
    } else {
        None
    };
    let read = read_file_in_range(resolved, line_offset, limit, max_bytes).await?;
    validate_content_tokens(&read.content, ext, max_tokens).map_err(ReadError::Message)?;
    ctx.file_state.set(
        full,
        FileState {
            content: read.content.clone(),
            timestamp: read.mtime_ms,
            offset: Some(offset),
            limit,
            is_partial_view: false,
        },
    );
    let text = if !read.content.is_empty() {
        let mitigation = if should_include_mitigation(ctx.main_model.as_deref()) {
            CYBER_RISK_MITIGATION_REMINDER
        } else {
            ""
        };
        format!("{}{mitigation}", add_line_numbers(&read.content, offset))
    } else if read.total_lines == 0 || read.is_empty_file {
        // Correção de bug do JS: lá o `readFileInRange` conta 1 linha num
        // arquivo vazio, o ramo `totalLines === 0` nunca acontece e o modelo
        // lê "shorter than the provided offset (1). The file has 1 lines."
        // num arquivo vazio. Aqui o arquivo sem bytes recebe o aviso de
        // arquivo vazio que o prompt do Read promete.
        "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
            .to_string()
    } else {
        format!(
            "<system-reminder>Warning: the file exists but is shorter than the provided offset ({offset}). The file has {} lines.</system-reminder>",
            read.total_lines
        )
    };
    let data = json!({
        "type": "text",
        "file": {
            "filePath": file_path,
            "content": read.content,
            "numLines": read.line_count,
            "startLine": offset,
            "totalLines": read.total_lines,
        }
    });
    Ok(ToolResult::text(text).with_tool_use_result(data))
}

/// `callInner`.
#[allow(clippy::too_many_arguments)]
async fn call_inner(
    file_path: &str,
    full: &Path,
    resolved: &Path,
    ext: &str,
    offset: u64,
    limit: Option<u64>,
    pages: Option<&str>,
    max_tokens: usize,
    ctx: &ToolContext,
) -> Inner {
    if ext == "ipynb" {
        return read_notebook_file(file_path, full, resolved, offset, limit, max_tokens, ctx).await;
    }
    if IMAGE_EXTENSIONS.contains(&ext) {
        return read_image(resolved, max_tokens).await;
    }
    if is_pdf_extension(ext) {
        return read_pdf_file(resolved, pages, ctx).await;
    }
    read_text_file(
        file_path, full, resolved, ext, offset, limit, max_tokens, ctx,
    )
    .await
}

fn as_u64(v: Option<&Value>) -> Option<u64> {
    v.and_then(|v| v.as_u64().or_else(|| v.as_f64().map(|f| f as u64)))
}

async fn read(input: Value, ctx: &ToolContext) -> ToolResult {
    let file_path = input
        .get("file_path")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string();
    let offset = as_u64(input.get("offset")).unwrap_or(1);
    let limit = as_u64(input.get("limit"));
    let pages = input.get("pages").and_then(Value::as_str);
    let max_tokens = max_tokens(ctx);
    let ext = js_extname(&file_path)
        .to_lowercase()
        .trim_start_matches('.')
        .to_string();
    let full = expand_path(&file_path, &ctx.working_directory);

    // Releitura do mesmo recorte de um arquivo que não mudou: o stub.
    if let Some(existing) = ctx.file_state.get(&full) {
        if !existing.is_partial_view
            && existing.offset.is_some()
            && existing.offset == Some(offset)
            && existing.limit == limit
        {
            if let Ok(meta) = tokio::fs::metadata(&full).await {
                if mtime_ms(&meta) == existing.timestamp {
                    return ToolResult::text(file_unchanged_stub()).with_tool_use_result(json!({
                        "type": "file_unchanged",
                        "file": {"filePath": file_path},
                    }));
                }
            }
        }
    }

    let first = call_inner(
        &file_path, &full, &full, &ext, offset, limit, pages, max_tokens, ctx,
    )
    .await;
    match first {
        Ok(result) => result,
        Err(ReadError::Message(message)) => ToolResult::error(message),
        Err(ReadError::NotFound) => {
            let full_str = full.to_string_lossy().to_string();
            if let Some(alternate) = alternate_screenshot_path(&full_str) {
                match call_inner(
                    &file_path,
                    &full,
                    Path::new(&alternate),
                    &ext,
                    offset,
                    limit,
                    pages,
                    max_tokens,
                    ctx,
                )
                .await
                {
                    Ok(result) => return result,
                    Err(ReadError::Message(message)) => return ToolResult::error(message),
                    Err(ReadError::NotFound) => {}
                }
            }
            let cwd: PathBuf = ctx.working_directory.clone();
            let mut message = format!(
                "File does not exist. {FILE_NOT_FOUND_CWD_NOTE} {}.",
                cwd.to_string_lossy()
            );
            if let Some(suggestion) = suggest_path_under_cwd(&full, &cwd) {
                message.push_str(&format!(" Did you mean {suggestion}?"));
            } else if let Some(similar) = find_similar_file(&full) {
                message.push_str(&format!(" Did you mean {similar}?"));
            }
            ToolResult::error(message)
        }
    }
}

/// `validateInput` do Read (as checagens antes da permissão).
fn validate(input: &Value, ctx: &ToolContext) -> Result<(), String> {
    let file_path = input
        .get("file_path")
        .and_then(Value::as_str)
        .unwrap_or_default();
    if let Some(pages) = input.get("pages").and_then(Value::as_str) {
        let Some(parsed) = parse_pdf_page_range(pages) else {
            return Err(format!(
                "Invalid pages parameter: \"{pages}\". Use formats like \"1-5\", \"3\", or \"10-20\". Pages are 1-indexed."
            ));
        };
        let count = match parsed.last_page {
            None => PDF_MAX_PAGES_PER_READ + 1,
            Some(last) => last - parsed.first_page + 1,
        };
        if count > PDF_MAX_PAGES_PER_READ {
            return Err(format!(
                "Page range \"{pages}\" exceeds maximum of {PDF_MAX_PAGES_PER_READ} pages per request. Please use a smaller range."
            ));
        }
    }
    let raw = file_path.trim();
    if raw.starts_with("\\\\") || raw.starts_with("//") {
        return Ok(());
    }
    let full = expand_path(file_path, &ctx.working_directory)
        .to_string_lossy()
        .to_string();
    let ext = js_extname(&full).to_lowercase();
    if has_binary_extension(&full)
        && !is_pdf_extension(&ext)
        && !IMAGE_EXTENSIONS.contains(&ext.trim_start_matches('.'))
    {
        return Err(format!(
            "This tool cannot read binary files. The file appears to be a binary {ext} file. Please use appropriate tools for binary file analysis."
        ));
    }
    if is_blocked_device_path(&full) {
        return Err(format!(
            "Cannot read '{file_path}': this device file would block or produce infinite output."
        ));
    }
    Ok(())
}

/// `semanticNumber` em `offset` e `limit`.
fn preprocess(mut input: Value) -> Value {
    if let Some(obj) = input.as_object_mut() {
        for key in ["offset", "limit"] {
            if let Some(v) = obj.get(key).map(semantic_number) {
                obj.insert(key.to_string(), v);
            }
        }
    }
    input
}

/// `getPath`: o `file_path`, ou o cwd quando vazio.
fn permission_path(input: &Value, ctx: &ToolContext) -> String {
    match input.get("file_path").and_then(Value::as_str) {
        Some(p) if !p.is_empty() => p.to_string(),
        _ => ctx.working_directory.to_string_lossy().to_string(),
    }
}

#[async_trait]
impl Tool for FileReadTool {
    fn name(&self) -> &str {
        "Read"
    }

    fn description(&self) -> &str {
        default_prompt()
    }

    fn input_schema(&self) -> Value {
        input_schema()
    }

    fn is_concurrency_safe(&self) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    /// `maxResultSizeChars: Infinity`: o Read nunca é persistido em disco.
    fn max_result_size_chars(&self) -> Option<usize> {
        None
    }

    fn preprocess_input(&self, input: Value) -> Value {
        preprocess(input)
    }

    async fn validate_input(&self, input: &Value, context: &ToolContext) -> Result<(), String> {
        validate(input, context)
    }

    async fn check_permissions(
        &self,
        input: &Value,
        context: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        check_read_permission(&permission_path(input, context), context, rules)
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        read(input, context).await
    }
}

#[async_trait]
impl Tool for ModelScopedFileReadTool {
    fn name(&self) -> &str {
        "Read"
    }

    fn description(&self) -> &str {
        &self.prompt
    }

    fn input_schema(&self) -> Value {
        input_schema()
    }

    fn is_concurrency_safe(&self) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    fn max_result_size_chars(&self) -> Option<usize> {
        None
    }

    fn preprocess_input(&self, input: Value) -> Value {
        preprocess(input)
    }

    async fn validate_input(&self, input: &Value, context: &ToolContext) -> Result<(), String> {
        validate(input, context)
    }

    async fn check_permissions(
        &self,
        input: &Value,
        context: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        check_read_permission(&permission_path(input, context), context, rules)
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        read(input, context).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extname_and_binary_extension_follow_node() {
        assert_eq!(js_extname("/a/b.TXT"), ".TXT");
        assert_eq!(js_extname("/a/.bashrc"), "");
        assert_eq!(js_extname("/a.b/file"), "");
        assert!(has_binary_extension("/x/y.ZIP"));
        assert!(!has_binary_extension("/x/y.rs"));
    }

    #[test]
    fn line_numbers_are_compact_and_start_at_the_offset() {
        assert_eq!(add_line_numbers("um\ndois", 1), "1\tum\n2\tdois");
        assert_eq!(add_line_numbers("um\r\ndois", 0), "0\tum\n1\tdois");
        assert_eq!(add_line_numbers("", 1), "");
    }

    #[test]
    fn select_lines_matches_read_file_in_range_fast() {
        let (lines, total) = select_lines("\u{feff}a\r\nb\r\nc", 0, None);
        assert_eq!(lines, vec!["a", "b", "c"]);
        assert_eq!(total, 3);
        let (lines, total) = select_lines("", 0, None);
        assert_eq!(lines, vec![""]);
        assert_eq!(total, 1);
        let (lines, total) = select_lines("um\ndois\ntres\n", 1, Some(1));
        assert_eq!(lines, vec!["dois"]);
        assert_eq!(total, 4);
    }

    #[test]
    fn screenshot_alternate_path_swaps_the_space() {
        let thin = "\u{202F}";
        assert_eq!(
            alternate_screenshot_path("/tmp/Shot 10.00.00 AM.png").as_deref(),
            Some(format!("/tmp/Shot 10.00.00{thin}AM.png").as_str())
        );
        assert_eq!(alternate_screenshot_path("/tmp/a.png"), None);
    }

    #[test]
    fn prompt_variants() {
        let p = read_tool_prompt(true, true);
        assert!(p.contains("- When you already know which part of the file you need"));
        assert!(p.contains("This tool can read PDF files (.pdf)."));
        let p = read_tool_prompt(false, false);
        assert!(p.contains("- You can optionally specify a line offset and limit"));
        assert!(!p.contains("PDF"));
    }
}
