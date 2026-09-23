//! PDF no Read, como `utils/pdf.js` e `utils/pdfUtils.js` do CLI 2.1.90: o
//! parse do parâmetro `pages`, a contagem de páginas com `pdfinfo`, a leitura
//! do documento inteiro em base64 e a renderização de páginas com
//! `pdftoppm -jpeg -r 100` (poppler-utils), com os limites e as mensagens do
//! JS.

use std::path::{Path, PathBuf};
use std::time::Duration;

use serde_json::{json, Value};

use crate::tools::framework::format_file_size;

/// `API_PDF_MAX_PAGES` de `constants/apiLimits.js`.
pub const API_PDF_MAX_PAGES: u64 = 100;
/// `PDF_TARGET_RAW_SIZE` (20MB): teto do documento inteiro.
pub const PDF_TARGET_RAW_SIZE: u64 = 20_971_520;
/// `PDF_EXTRACT_SIZE_THRESHOLD` (3MB).
pub const PDF_EXTRACT_SIZE_THRESHOLD: u64 = 3_145_728;
/// `PDF_MAX_EXTRACT_SIZE` (100MB): teto da renderização de páginas.
pub const PDF_MAX_EXTRACT_SIZE: u64 = 104_857_600;
/// `PDF_MAX_PAGES_PER_READ`.
pub const PDF_MAX_PAGES_PER_READ: u64 = 20;
/// `PDF_AT_MENTION_INLINE_THRESHOLD`: acima disso o Read exige `pages`.
pub const PDF_AT_MENTION_INLINE_THRESHOLD: u64 = 10;

/// Intervalo de páginas (`lastPage` infinito vira `None`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PageRange {
    pub first_page: u64,
    pub last_page: Option<u64>,
}

/// O `parseInt(s, 10)` do JS: dígitos iniciais (com sinal e espaços à
/// esquerda); `None` quando não há número.
fn js_parse_int(s: &str) -> Option<i64> {
    let t = s.trim_start();
    let (neg, rest) = match t.strip_prefix('-') {
        Some(r) => (true, r),
        None => (false, t.strip_prefix('+').unwrap_or(t)),
    };
    let digits: String = rest.chars().take_while(|c| c.is_ascii_digit()).collect();
    if digits.is_empty() {
        return None;
    }
    let n: i64 = digits.parse().ok()?;
    Some(if neg { -n } else { n })
}

/// `parsePDFPageRange`: `"3"`, `"1-5"`, `"10-"`; páginas começam em 1.
pub fn parse_pdf_page_range(pages: &str) -> Option<PageRange> {
    let trimmed = pages.trim();
    if trimmed.is_empty() {
        return None;
    }
    if let Some(head) = trimmed.strip_suffix('-') {
        let first = js_parse_int(head)?;
        if first < 1 {
            return None;
        }
        return Some(PageRange {
            first_page: first as u64,
            last_page: None,
        });
    }
    match trimmed.find('-') {
        None => {
            let page = js_parse_int(trimmed)?;
            if page < 1 {
                return None;
            }
            Some(PageRange {
                first_page: page as u64,
                last_page: Some(page as u64),
            })
        }
        Some(dash) => {
            let first = js_parse_int(&trimmed[..dash])?;
            let last = js_parse_int(&trimmed[dash + 1..])?;
            if first < 1 || last < 1 || last < first {
                return None;
            }
            Some(PageRange {
                first_page: first as u64,
                last_page: Some(last as u64),
            })
        }
    }
}

/// `isPDFSupported`: todo modelo lê PDF, menos o claude-3-haiku. Sem modelo
/// conhecido vale o default do CLI (que suporta).
pub fn is_pdf_supported(model: Option<&str>) -> bool {
    !model
        .map(|m| m.to_lowercase().contains("claude-3-haiku"))
        .unwrap_or(false)
}

/// `isPDFExtension` (com ou sem o ponto).
pub fn is_pdf_extension(ext: &str) -> bool {
    ext.trim_start_matches('.').eq_ignore_ascii_case("pdf")
}

/// A mensagem da API para PDF grande demais (`getPdfTooLargeErrorMessage` de
/// `services/api/errors.js`), para o loop usar quando a API recusar o
/// documento.
pub fn pdf_too_large_error_message(non_interactive: bool) -> String {
    let limits = format!(
        "max {API_PDF_MAX_PAGES} pages, {}",
        format_file_size(PDF_TARGET_RAW_SIZE)
    );
    if non_interactive {
        format!("PDF too large ({limits}). Try reading the file a different way (e.g., extract text with pdftotext).")
    } else {
        format!("PDF too large ({limits}). Double press esc to go back and try again, or use pdftotext to convert to text first.")
    }
}

/// O documento inteiro lido (`readPDF` com sucesso).
#[derive(Debug, Clone)]
pub struct PdfData {
    pub file_path: String,
    pub base64: String,
    pub original_size: u64,
}

impl PdfData {
    /// O `data` do JS: `{type:"pdf", file:{filePath, base64, originalSize}}`.
    pub fn to_json(&self) -> Value {
        json!({
            "type": "pdf",
            "file": {
                "filePath": self.file_path,
                "base64": self.base64,
                "originalSize": self.original_size,
            }
        })
    }
}

/// Páginas renderizadas (`extractPDFPages` com sucesso).
#[derive(Debug, Clone)]
pub struct PdfParts {
    pub file_path: String,
    pub original_size: u64,
    pub output_dir: PathBuf,
    pub count: usize,
}

impl PdfParts {
    /// O `data` do JS: `{type:"parts", file:{filePath, originalSize,
    /// outputDir, count}}`.
    pub fn to_json(&self) -> Value {
        json!({
            "type": "parts",
            "file": {
                "filePath": self.file_path,
                "originalSize": self.original_size,
                "outputDir": self.output_dir.to_string_lossy(),
                "count": self.count,
            }
        })
    }
}

/// `readPDF`: o arquivo inteiro em base64, com os erros do JS.
pub async fn read_pdf(path: &Path) -> Result<PdfData, String> {
    let display = path.to_string_lossy().to_string();
    let meta = tokio::fs::metadata(path).await.map_err(|e| e.to_string())?;
    let size = meta.len();
    if size == 0 {
        return Err(format!("PDF file is empty: {display}"));
    }
    if size > PDF_TARGET_RAW_SIZE {
        return Err(format!(
            "PDF file exceeds maximum allowed size of {}.",
            format_file_size(PDF_TARGET_RAW_SIZE)
        ));
    }
    let bytes = tokio::fs::read(path).await.map_err(|e| e.to_string())?;
    if !bytes.starts_with(b"%PDF-") {
        return Err(format!(
            "File is not a valid PDF (missing %PDF- header): {display}"
        ));
    }
    use base64::Engine;
    Ok(PdfData {
        file_path: display,
        base64: base64::engine::general_purpose::STANDARD.encode(&bytes),
        original_size: size,
    })
}

/// Saída de um processo, no formato do `execFileNoThrow`.
struct ExecResult {
    code: i32,
    stdout: String,
    stderr: String,
}

async fn exec_no_throw(program: &str, args: &[String], timeout: Duration) -> ExecResult {
    let mut command = tokio::process::Command::new(program);
    command
        .args(args)
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .kill_on_drop(true);
    let child = match command.spawn() {
        Ok(c) => c,
        Err(e) => {
            return ExecResult {
                code: 1,
                stdout: String::new(),
                stderr: e.to_string(),
            }
        }
    };
    match tokio::time::timeout(timeout, child.wait_with_output()).await {
        Ok(Ok(out)) => ExecResult {
            code: out.status.code().unwrap_or(1),
            stdout: String::from_utf8_lossy(&out.stdout).to_string(),
            stderr: String::from_utf8_lossy(&out.stderr).to_string(),
        },
        Ok(Err(e)) => ExecResult {
            code: 1,
            stdout: String::new(),
            stderr: e.to_string(),
        },
        Err(_) => ExecResult {
            code: 1,
            stdout: String::new(),
            stderr: String::new(),
        },
    }
}

/// `getPDFPageCount`: `pdfinfo` com timeout de 10s; `None` quando falha.
pub async fn get_pdf_page_count(path: &Path) -> Option<u64> {
    let out = exec_no_throw(
        "pdfinfo",
        &[path.to_string_lossy().to_string()],
        Duration::from_secs(10),
    )
    .await;
    if out.code != 0 {
        return None;
    }
    static RE: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    let re = RE.get_or_init(|| regex::Regex::new(r"(?m)^Pages:\s+(\d+)").expect("regex"));
    re.captures(&out.stdout)
        .and_then(|c| c.get(1))
        .and_then(|m| m.as_str().parse().ok())
}

/// `isPdftoppmAvailable` (memorizado por processo, como no JS).
async fn is_pdftoppm_available() -> bool {
    static AVAILABLE: tokio::sync::OnceCell<bool> = tokio::sync::OnceCell::const_new();
    *AVAILABLE
        .get_or_init(|| async {
            let out = exec_no_throw("pdftoppm", &["-v".to_string()], Duration::from_secs(5)).await;
            // Binário ausente: o spawn falha e não há stderr do pdftoppm.
            let spawned = !out.stderr.contains("No such file or directory");
            out.code == 0 || (spawned && !out.stderr.is_empty())
        })
        .await
}

/// `extractPDFPages`: renderiza as páginas em JPEG a 100 dpi num diretório
/// `pdf-<uuid>` dentro de `tool_results_dir`.
pub async fn extract_pdf_pages(
    path: &Path,
    range: Option<PageRange>,
    tool_results_dir: &Path,
) -> Result<PdfParts, String> {
    let meta = tokio::fs::metadata(path).await.map_err(|e| e.to_string())?;
    let size = meta.len();
    let display = path.to_string_lossy().to_string();
    if size == 0 {
        return Err(format!("PDF file is empty: {display}"));
    }
    if size > PDF_MAX_EXTRACT_SIZE {
        return Err(format!(
            "PDF file exceeds maximum allowed size for text extraction ({}).",
            format_file_size(PDF_MAX_EXTRACT_SIZE)
        ));
    }
    if !is_pdftoppm_available().await {
        return Err("pdftoppm is not installed. Install poppler-utils (e.g. `brew install poppler` or `apt-get install poppler-utils`) to enable PDF page rendering.".to_string());
    }
    let output_dir = tool_results_dir.join(format!("pdf-{}", uuid::Uuid::new_v4()));
    tokio::fs::create_dir_all(&output_dir)
        .await
        .map_err(|e| e.to_string())?;
    let prefix = output_dir.join("page");
    let mut args: Vec<String> = vec!["-jpeg".into(), "-r".into(), "100".into()];
    if let Some(r) = range {
        args.push("-f".into());
        args.push(r.first_page.to_string());
        if let Some(last) = r.last_page {
            args.push("-l".into());
            args.push(last.to_string());
        }
    }
    args.push(display.clone());
    args.push(prefix.to_string_lossy().to_string());
    let out = exec_no_throw("pdftoppm", &args, Duration::from_secs(120)).await;
    if out.code != 0 {
        let lower = out.stderr.to_lowercase();
        if lower.contains("password") {
            return Err(
                "PDF is password-protected. Please provide an unprotected version.".to_string(),
            );
        }
        if lower.contains("damaged") || lower.contains("corrupt") || lower.contains("invalid") {
            return Err("PDF file is corrupted or invalid.".to_string());
        }
        return Err(format!("pdftoppm failed: {}", out.stderr));
    }
    let images = list_page_images(&output_dir).await?;
    if images.is_empty() {
        return Err("pdftoppm produced no output pages. The PDF may be invalid.".to_string());
    }
    Ok(PdfParts {
        file_path: display,
        original_size: size,
        output_dir,
        count: images.len(),
    })
}

/// Os `.jpg` do diretório, em ordem (o `readdir(...).filter(...).sort()`).
pub async fn list_page_images(dir: &Path) -> Result<Vec<PathBuf>, String> {
    let mut entries = tokio::fs::read_dir(dir).await.map_err(|e| e.to_string())?;
    let mut names: Vec<String> = Vec::new();
    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let name = entry.file_name().to_string_lossy().to_string();
        if name.ends_with(".jpg") {
            names.push(name);
        }
    }
    names.sort();
    Ok(names.into_iter().map(|n| dir.join(n)).collect())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn page_range_parsing_follows_the_js() {
        assert_eq!(
            parse_pdf_page_range("3"),
            Some(PageRange {
                first_page: 3,
                last_page: Some(3)
            })
        );
        assert_eq!(
            parse_pdf_page_range(" 1-5 "),
            Some(PageRange {
                first_page: 1,
                last_page: Some(5)
            })
        );
        assert_eq!(
            parse_pdf_page_range("10-"),
            Some(PageRange {
                first_page: 10,
                last_page: None
            })
        );
        assert_eq!(parse_pdf_page_range("abc"), None);
        assert_eq!(parse_pdf_page_range("0"), None);
        assert_eq!(parse_pdf_page_range("5-2"), None);
        assert_eq!(parse_pdf_page_range(""), None);
        // parseInt ignora o lixo depois dos dígitos, como no JS.
        assert_eq!(
            parse_pdf_page_range("2x"),
            Some(PageRange {
                first_page: 2,
                last_page: Some(2)
            })
        );
    }

    #[test]
    fn pdf_support_depends_on_the_model() {
        assert!(is_pdf_supported(None));
        assert!(is_pdf_supported(Some("claude-sonnet-4-6")));
        assert!(!is_pdf_supported(Some("claude-3-haiku-20240307")));
    }

    #[test]
    fn too_large_message_matches_the_js() {
        assert_eq!(
            pdf_too_large_error_message(true),
            "PDF too large (max 100 pages, 20MB). Try reading the file a different way (e.g., extract text with pdftotext)."
        );
    }
}
