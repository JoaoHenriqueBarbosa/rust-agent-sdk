//! WebFetch com paridade com o CLI 2.1.90.
//!
//! Referências JS: `tools/WebFetchTool/WebFetchTool.js` (schema, permissão,
//! `validateInput`, `call` e o formato do resultado), `tools/WebFetchTool/utils.js`
//! (`validateURL`, redirects só no mesmo host, headers, limites, cache de 15
//! minutos, `applyPromptToMarkdown`), `tools/WebFetchTool/prompt.js`
//! (descrição e `makeSecondaryModelPrompt`), `tools/WebFetchTool/preapproved.js`
//! (hosts pré-aprovados), `services/api/claude/queryHaiku.js` (a chamada ao
//! modelo pequeno), `utils/mcpOutputStorage.js` (conteúdo binário salvo em
//! disco) e `constants/promptOverrides.js`.

use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
use std::time::{Duration, Instant};

use async_trait::async_trait;
use serde_json::{json, Value};

use crate::api::types::{ContentBlock, CreateMessageRequest, SystemBlock};
use crate::tools::framework::{format_file_size, js_len, js_slice, Tool, ToolContext, ToolResult};
use crate::tools::permission::{
    DecisionReason, PermissionAsk, PermissionResult, PermissionRules, RuleBehavior,
};

/// Nome da tool (`WEB_FETCH_TOOL_NAME`).
pub const WEB_FETCH_TOOL_NAME: &str = "WebFetch";

/// `MAX_URL_LENGTH`.
const MAX_URL_LENGTH: usize = 2000;
/// `MAX_HTTP_CONTENT_LENGTH` (10MB).
const MAX_HTTP_CONTENT_LENGTH: usize = 10_485_760;
/// `FETCH_TIMEOUT_MS`.
const FETCH_TIMEOUT_MS: u64 = 60_000;
/// `MAX_REDIRECTS`.
const MAX_REDIRECTS: usize = 10;
/// `MAX_MARKDOWN_LENGTH`.
pub const MAX_MARKDOWN_LENGTH: usize = 100_000;
/// `CACHE_TTL_MS` (15 minutos).
const CACHE_TTL: Duration = Duration::from_millis(900_000);
/// `MAX_CACHE_SIZE_BYTES` (50MB).
const MAX_CACHE_SIZE_BYTES: usize = 52_428_800;
/// O `max_tokens` que o CLI manda na chamada ao modelo pequeno (medido no
/// request do 2.1.90 para o haiku 4.5).
const SECONDARY_MAX_TOKENS: u32 = 32_000;

/// `AGENT_SDK_PREFIX` de `constants/system.js`: o prefixo de system prompt
/// que o CLI não interativo põe em toda chamada ao modelo.
pub const AGENT_SDK_PREFIX: &str = "You are a Claude agent, built on Anthropic's Claude Agent SDK.";
/// `DEFAULT_PREFIX` de `constants/system.js` (sessão interativa).
pub const DEFAULT_PREFIX: &str = "You are Claude Code, Anthropic's official CLI for Claude.";

/// O prefixo de system prompt do CLI para a sessão (`getCLISyspromptPrefix`).
pub fn cli_system_prefix(ctx: &ToolContext) -> &'static str {
    if ctx.non_interactive {
        AGENT_SDK_PREFIX
    } else {
        DEFAULT_PREFIX
    }
}

/// `User-Agent` do WebFetch (`getWebFetchUserAgent`).
pub const WEB_FETCH_USER_AGENT: &str =
    "Claude-User (claude-code/2.1.90; +https://support.anthropic.com/)";

const DESCRIPTION: &str = "IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs. Before using this tool, check if the URL points to an authenticated service (e.g. Google Docs, Confluence, Jira, GitHub). If so, look for a specialized MCP tool that provides authenticated access.

- Fetches content from a specified URL and processes it using an AI model
- Takes a URL and a prompt as input
- Fetches the URL content, converts HTML to markdown
- Processes the content with the prompt using a small, fast model
- Returns the model's response about the content
- Use this tool when you need to retrieve and analyze web content

Usage notes:
  - IMPORTANT: If an MCP-provided web fetch tool is available, prefer using that tool instead of this one, as it may have fewer restrictions.
  - The URL must be a fully-formed valid URL
  - HTTP URLs will be automatically upgraded to HTTPS
  - The prompt should describe what information you want to extract from the page
  - This tool is read-only and does not modify any files
  - Results may be summarized if the content is very large
  - Includes a self-cleaning 15-minute cache for faster responses when repeatedly accessing the same URL
  - When a URL redirects to a different host, the tool will inform you and provide the redirect URL in a special format. You should then make a new WebFetch request with the redirect URL to fetch the content.
  - For GitHub URLs, prefer using the gh CLI via Bash instead (e.g., gh pr view, gh issue view, gh api).
";

/// `PREAPPROVED_HOSTS` de `preapproved.js` (entradas com `/` valem por
/// prefixo de caminho).
const PREAPPROVED_HOSTS: &[&str] = &[
    "platform.claude.com",
    "code.claude.com",
    "modelcontextprotocol.io",
    "github.com/anthropics",
    "agentskills.io",
    "docs.python.org",
    "en.cppreference.com",
    "docs.oracle.com",
    "learn.microsoft.com",
    "developer.mozilla.org",
    "go.dev",
    "pkg.go.dev",
    "www.php.net",
    "docs.swift.org",
    "kotlinlang.org",
    "ruby-doc.org",
    "doc.rust-lang.org",
    "www.typescriptlang.org",
    "react.dev",
    "angular.io",
    "vuejs.org",
    "nextjs.org",
    "expressjs.com",
    "nodejs.org",
    "bun.sh",
    "jquery.com",
    "getbootstrap.com",
    "tailwindcss.com",
    "d3js.org",
    "threejs.org",
    "redux.js.org",
    "webpack.js.org",
    "jestjs.io",
    "reactrouter.com",
    "docs.djangoproject.com",
    "flask.palletsprojects.com",
    "fastapi.tiangolo.com",
    "pandas.pydata.org",
    "numpy.org",
    "www.tensorflow.org",
    "pytorch.org",
    "scikit-learn.org",
    "matplotlib.org",
    "requests.readthedocs.io",
    "jupyter.org",
    "laravel.com",
    "symfony.com",
    "wordpress.org",
    "docs.spring.io",
    "hibernate.org",
    "tomcat.apache.org",
    "gradle.org",
    "maven.apache.org",
    "asp.net",
    "dotnet.microsoft.com",
    "nuget.org",
    "blazor.net",
    "reactnative.dev",
    "docs.flutter.dev",
    "developer.apple.com",
    "developer.android.com",
    "keras.io",
    "spark.apache.org",
    "huggingface.co",
    "www.kaggle.com",
    "www.mongodb.com",
    "redis.io",
    "www.postgresql.org",
    "dev.mysql.com",
    "www.sqlite.org",
    "graphql.org",
    "prisma.io",
    "docs.aws.amazon.com",
    "cloud.google.com",
    "kubernetes.io",
    "www.docker.com",
    "www.terraform.io",
    "www.ansible.com",
    "vercel.com/docs",
    "docs.netlify.com",
    "devcenter.heroku.com",
    "cypress.io",
    "selenium.dev",
    "docs.unity.com",
    "docs.unrealengine.com",
    "git-scm.com",
    "nginx.org",
    "httpd.apache.org",
];

/// `isPreapprovedHost(hostname, pathname)`.
pub fn is_preapproved_host(hostname: &str, pathname: &str) -> bool {
    for entry in PREAPPROVED_HOSTS {
        match entry.find('/') {
            None => {
                if *entry == hostname {
                    return true;
                }
            }
            Some(slash) => {
                let (host, prefix) = entry.split_at(slash);
                if host == hostname
                    && (pathname == prefix || pathname.starts_with(&format!("{prefix}/")))
                {
                    return true;
                }
            }
        }
    }
    false
}

/// `isPreapprovedUrl`.
pub fn is_preapproved_url(url: &str) -> bool {
    match url::Url::parse(url) {
        Ok(parsed) => is_preapproved_host(parsed.host_str().unwrap_or(""), parsed.path()),
        Err(_) => false,
    }
}

/// O `hostname` do `new URL` do JS (IPv6 entre colchetes).
fn js_hostname(url: &url::Url) -> String {
    match url.host() {
        Some(url::Host::Ipv6(addr)) => format!("[{addr}]"),
        Some(host) => host.to_string(),
        None => String::new(),
    }
}

/// O `port` do `new URL` do JS (vazio na porta default do esquema).
fn js_port(url: &url::Url) -> String {
    url.port().map(|p| p.to_string()).unwrap_or_default()
}

/// `validateURL`.
fn validate_url(url: &str) -> bool {
    if js_len(url) > MAX_URL_LENGTH {
        return false;
    }
    let Ok(parsed) = url::Url::parse(url) else {
        return false;
    };
    if !parsed.username().is_empty() || parsed.password().is_some() {
        return false;
    }
    js_hostname(&parsed).split('.').count() >= 2
}

/// `isPermittedRedirect`: mesmo protocolo, mesma porta, sem credenciais e o
/// mesmo host descontado o `www.`.
pub fn is_permitted_redirect(original: &str, redirect: &str) -> bool {
    let (Ok(a), Ok(b)) = (url::Url::parse(original), url::Url::parse(redirect)) else {
        return false;
    };
    if a.scheme() != b.scheme() || js_port(&a) != js_port(&b) {
        return false;
    }
    if !b.username().is_empty() || b.password().is_some() {
        return false;
    }
    let strip = |h: String| h.strip_prefix("www.").map(str::to_string).unwrap_or(h);
    strip(js_hostname(&a)) == strip(js_hostname(&b))
}

/// `isBinaryContentType` de `utils/mcpOutputStorage.js`.
fn is_binary_content_type(content_type: &str) -> bool {
    if content_type.is_empty() {
        return false;
    }
    let mt = content_type
        .split(';')
        .next()
        .unwrap_or("")
        .trim()
        .to_lowercase();
    if mt.starts_with("text/") {
        return false;
    }
    if mt.ends_with("+json") || mt == "application/json" {
        return false;
    }
    if mt.ends_with("+xml") || mt == "application/xml" {
        return false;
    }
    if mt.starts_with("application/javascript") {
        return false;
    }
    mt != "application/x-www-form-urlencoded"
}

/// `extensionForMimeType` de `utils/mcpOutputStorage.js`.
fn extension_for_mime_type(mime: &str) -> &'static str {
    match mime
        .split(';')
        .next()
        .unwrap_or("")
        .trim()
        .to_lowercase()
        .as_str()
    {
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

/// `getPromptOverrides().webFetchCopyright`: `true` salvo quando
/// `~/.claude/promptOverrides.json` diz o contrário.
fn web_fetch_copyright() -> bool {
    static VALUE: OnceLock<bool> = OnceLock::new();
    *VALUE.get_or_init(|| {
        let Some(home) = std::env::var_os("HOME") else {
            return true;
        };
        let path = std::path::Path::new(&home)
            .join(".claude")
            .join("promptOverrides.json");
        std::fs::read_to_string(path)
            .ok()
            .and_then(|raw| serde_json::from_str::<Value>(&raw).ok())
            .and_then(|v| v.get("webFetchCopyright").cloned())
            .map(|v| match v {
                Value::Bool(b) => b,
                Value::Null => false,
                Value::Number(n) => n.as_f64().map(|f| f != 0.0).unwrap_or(false),
                Value::String(s) => !s.is_empty(),
                _ => true,
            })
            .unwrap_or(true)
    })
}

/// `makeSecondaryModelPrompt` literal.
pub fn make_secondary_model_prompt(markdown: &str, prompt: &str, is_preapproved: bool) -> String {
    let instructions = if is_preapproved {
        "Provide a concise response based on the content above. Include relevant details, code examples, and documentation excerpts as needed."
    } else if web_fetch_copyright() {
        "Provide a concise response based only on the content above. In your response:
 - Enforce a strict 125-character maximum for quotes from any source document. Open Source Software is ok as long as we respect the license.
 - Use quotation marks for exact language from articles; any language outside of the quotation should never be word-for-word the same.
 - You are not a lawyer and never comment on the legality of your own prompts and responses.
 - Never produce or reproduce exact song lyrics."
    } else {
        "Provide a thorough response based on the content above. Include full quotes, excerpts, code examples, lyrics, and any relevant details as needed. Reproduce content faithfully when the user requests it."
    };
    format!("\nWeb page content:\n---\n{markdown}\n---\n\n{prompt}\n\n{instructions}\n")
}

/// `REFUSAL_PATTERNS` + `looksLikeRefusal`.
fn looks_like_refusal(text: &str) -> bool {
    static PATTERNS: OnceLock<Vec<regex::Regex>> = OnceLock::new();
    let patterns = PATTERNS.get_or_init(|| {
        [
            r"(?i)copyright",
            r"(?i)protected by",
            r"(?i)can'?t reproduce",
            r"(?i)unable to reproduce",
            r"(?i)can'?t provide the (full|complete|exact)",
            r"(?i)unable to provide the (full|complete|exact)",
            r"(?i)I'?m not able to",
            r"(?i)instead.*(visit|check|go to|see)",
            r"(?i)owned by.*publishers?",
            r"(?i)cannot (share|copy|reproduce|provide)",
            r"(?i)recommend visiting",
            r"(?i)officially hosted",
        ]
        .iter()
        .map(|p| regex::Regex::new(p).expect("regex"))
        .collect()
    });
    patterns.iter().any(|p| p.is_match(text))
}

/// Uma entrada do `URL_CACHE`.
#[derive(Debug, Clone)]
struct CacheEntry {
    bytes: usize,
    code: u16,
    code_text: String,
    content: String,
    content_type: String,
    persisted_path: Option<String>,
    persisted_size: Option<usize>,
    size: usize,
    stored_at: Instant,
}

/// O `URL_CACHE` do JS: por processo, TTL de 15 minutos e teto de 50MB
/// somando o tamanho do conteúdo convertido.
/// Ordem de uso (da mais antiga para a mais recente) e as entradas.
type UrlCache = (Vec<String>, HashMap<String, CacheEntry>);

fn url_cache() -> &'static Mutex<UrlCache> {
    static CACHE: OnceLock<Mutex<UrlCache>> = OnceLock::new();
    CACHE.get_or_init(|| Mutex::new((Vec::new(), HashMap::new())))
}

fn cache_get(url: &str) -> Option<CacheEntry> {
    let mut guard = url_cache().lock().unwrap_or_else(|e| e.into_inner());
    let (order, map) = &mut *guard;
    let entry = map.get(url)?.clone();
    if entry.stored_at.elapsed() > CACHE_TTL {
        map.remove(url);
        order.retain(|k| k != url);
        return None;
    }
    order.retain(|k| k != url);
    order.push(url.to_string());
    Some(entry)
}

fn cache_set(url: &str, entry: CacheEntry) {
    let mut guard = url_cache().lock().unwrap_or_else(|e| e.into_inner());
    let (order, map) = &mut *guard;
    if entry.size > MAX_CACHE_SIZE_BYTES {
        return;
    }
    map.remove(url);
    order.retain(|k| k != url);
    map.insert(url.to_string(), entry);
    order.push(url.to_string());
    let mut total: usize = map.values().map(|e| e.size).sum();
    while total > MAX_CACHE_SIZE_BYTES && !order.is_empty() {
        let oldest = order.remove(0);
        if let Some(e) = map.remove(&oldest) {
            total -= e.size;
        }
    }
}

/// `clearWebFetchCache`.
pub fn clear_web_fetch_cache() {
    let mut guard = url_cache().lock().unwrap_or_else(|e| e.into_inner());
    guard.0.clear();
    guard.1.clear();
}

/// O resultado do fetch: conteúdo convertido, ou o aviso de redirect para
/// outro host.
enum FetchOutcome {
    Content(CacheEntry),
    Redirect {
        original_url: String,
        redirect_url: String,
        status: u16,
    },
}

/// Ajustes de transporte do fetch. O default é o do CLI; o único ajuste é
/// desligar o upgrade de `http` para `https`, que existe para servidores
/// locais sem TLS (testes e redes internas).
#[derive(Debug, Clone)]
pub struct WebFetchConfig {
    /// Troca `http:` por `https:` antes de buscar, como o JS (default `true`).
    pub upgrade_http_to_https: bool,
}

impl Default for WebFetchConfig {
    fn default() -> Self {
        Self {
            upgrade_http_to_https: true,
        }
    }
}

fn http_client() -> Result<reqwest::Client, String> {
    static CLIENT: OnceLock<reqwest::Client> = OnceLock::new();
    if let Some(c) = CLIENT.get() {
        return Ok(c.clone());
    }
    let client = reqwest::Client::builder()
        .timeout(Duration::from_millis(FETCH_TIMEOUT_MS))
        .redirect(reqwest::redirect::Policy::none())
        .build()
        .map_err(|e| e.to_string())?;
    Ok(CLIENT.get_or_init(|| client).clone())
}

/// A mensagem que o axios dá para a falha de rede, no que dá para reproduzir.
fn describe_request_error(err: &reqwest::Error) -> String {
    if err.is_timeout() {
        return format!("timeout of {FETCH_TIMEOUT_MS}ms exceeded");
    }
    let mut message = err.to_string();
    let mut source = std::error::Error::source(err);
    while let Some(inner) = source {
        message = inner.to_string();
        source = inner.source();
    }
    message
}

struct RawResponse {
    status: u16,
    status_text: String,
    content_type: String,
    body: Vec<u8>,
}

enum RawOutcome {
    Response(RawResponse),
    Redirect {
        original_url: String,
        redirect_url: String,
        status: u16,
    },
}

/// `getWithPermittedRedirects`.
async fn get_with_permitted_redirects(url: &str) -> Result<RawOutcome, String> {
    let client = http_client()?;
    let mut current = url.to_string();
    let mut depth = 0usize;
    loop {
        if depth > MAX_REDIRECTS {
            return Err(format!("Too many redirects (exceeded {MAX_REDIRECTS})"));
        }
        let response = client
            .get(&current)
            .header("Accept", "text/markdown, text/html, */*")
            .header("User-Agent", WEB_FETCH_USER_AGENT)
            .send()
            .await
            .map_err(|e| describe_request_error(&e))?;
        let status = response.status().as_u16();
        if matches!(status, 301 | 302 | 307 | 308) {
            let Some(location) = response
                .headers()
                .get("location")
                .and_then(|v| v.to_str().ok())
                .map(str::to_string)
            else {
                return Err("Redirect missing Location header".to_string());
            };
            let base = url::Url::parse(&current).map_err(|_| "Invalid URL".to_string())?;
            let redirect_url = base
                .join(&location)
                .map_err(|_| "Invalid URL".to_string())?
                .to_string();
            if is_permitted_redirect(&current, &redirect_url) {
                current = redirect_url;
                depth += 1;
                continue;
            }
            return Ok(RawOutcome::Redirect {
                original_url: current,
                redirect_url,
                status,
            });
        }
        if !(200..300).contains(&status) {
            if status == 403
                && response
                    .headers()
                    .get("x-proxy-error")
                    .and_then(|v| v.to_str().ok())
                    == Some("blocked-by-allowlist")
            {
                let host = url::Url::parse(&current)
                    .map(|u| js_hostname(&u))
                    .unwrap_or_default();
                return Err(json!({
                    "error_type": "EGRESS_BLOCKED",
                    "domain": host,
                    "message": format!("Access to {host} is blocked by the network egress proxy."),
                })
                .to_string());
            }
            return Err(format!("Request failed with status code {status}"));
        }
        let status_text = response
            .status()
            .canonical_reason()
            .unwrap_or("")
            .to_string();
        let content_type = response
            .headers()
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("")
            .to_string();
        let mut body: Vec<u8> = Vec::new();
        let mut response = response;
        while let Some(chunk) = response
            .chunk()
            .await
            .map_err(|e| describe_request_error(&e))?
        {
            body.extend_from_slice(&chunk);
            if body.len() > MAX_HTTP_CONTENT_LENGTH {
                return Err(format!(
                    "maxContentLength size of {MAX_HTTP_CONTENT_LENGTH} exceeded"
                ));
            }
        }
        return Ok(RawOutcome::Response(RawResponse {
            status,
            status_text,
            content_type,
            body,
        }));
    }
}

/// `getURLMarkdownContent`.
async fn get_url_markdown_content(
    url: &str,
    ctx: &ToolContext,
    config: &WebFetchConfig,
) -> Result<FetchOutcome, String> {
    if !validate_url(url) {
        return Err("Invalid URL".to_string());
    }
    if let Some(entry) = cache_get(url) {
        return Ok(FetchOutcome::Content(entry));
    }
    let mut upgraded = url.to_string();
    if let Ok(mut parsed) = url::Url::parse(url) {
        if config.upgrade_http_to_https
            && parsed.scheme() == "http"
            && parsed.set_scheme("https").is_ok()
        {
            upgraded = parsed.to_string();
        }
    }
    let raw = match get_with_permitted_redirects(&upgraded).await? {
        RawOutcome::Redirect {
            original_url,
            redirect_url,
            status,
        } => {
            return Ok(FetchOutcome::Redirect {
                original_url,
                redirect_url,
                status,
            })
        }
        RawOutcome::Response(r) => r,
    };
    let mut persisted_path = None;
    let mut persisted_size = None;
    if is_binary_content_type(&raw.content_type) {
        if let Some(dir) = &ctx.tool_results_dir {
            let millis = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_millis())
                .unwrap_or_default();
            let suffix: String = {
                use rand::Rng as _;
                let mut rng = rand::thread_rng();
                (0..6)
                    .map(|_| {
                        let n = rng.gen_range(0..36u32);
                        std::char::from_digit(n, 36).unwrap_or('0')
                    })
                    .collect()
            };
            let path = dir.join(format!(
                "webfetch-{millis}-{suffix}.{}",
                extension_for_mime_type(&raw.content_type)
            ));
            let written = async {
                tokio::fs::create_dir_all(dir).await?;
                tokio::fs::write(&path, &raw.body).await
            }
            .await;
            if written.is_ok() {
                persisted_path = Some(path.display().to_string());
                persisted_size = Some(raw.body.len());
            }
        }
    }
    let bytes = raw.body.len();
    let text = String::from_utf8_lossy(&raw.body).to_string();
    let (content, content_bytes) = if raw.content_type.contains("text/html") {
        // O Readability do JS nunca chega a ser aplicado no 2.1.90 (medido):
        // a página inteira vai para o turndown.
        let markdown = crate::tools::html_to_markdown::turndown(&text);
        let len = markdown.len();
        (markdown, len)
    } else {
        (text, bytes)
    };
    let entry = CacheEntry {
        bytes,
        code: raw.status,
        code_text: raw.status_text,
        content,
        content_type: raw.content_type,
        persisted_path,
        persisted_size,
        size: content_bytes.max(1),
        stored_at: Instant::now(),
    };
    cache_set(url, entry.clone());
    Ok(FetchOutcome::Content(entry))
}

/// `applyPromptToMarkdown`: o resumo pelo modelo pequeno.
async fn apply_prompt_to_markdown(
    prompt: &str,
    markdown: &str,
    ctx: &ToolContext,
    is_preapproved: bool,
) -> Result<String, String> {
    let Some(model_call) = &ctx.model_call else {
        return Err(
            "WebFetch needs a model to process the fetched content, and this session has no model call configured (ToolContext.model_call)."
                .to_string(),
        );
    };
    let truncated = if js_len(markdown) > MAX_MARKDOWN_LENGTH {
        format!(
            "{}\n\n[Content truncated due to length...]",
            js_slice(markdown, 0, MAX_MARKDOWN_LENGTH)
        )
    } else {
        markdown.to_string()
    };
    let model_prompt = make_secondary_model_prompt(&truncated, prompt, is_preapproved);
    let mut request = CreateMessageRequest::new(
        ctx.small_fast_model_name(),
        SECONDARY_MAX_TOKENS,
        vec![crate::api::types::ApiMessage::user(vec![
            ContentBlock::text(model_prompt),
        ])],
    );
    // `queryHaiku` com system vazio: só o prefixo do CLI, sem cache.
    request.system = Some(vec![SystemBlock::text(cli_system_prefix(ctx))]);
    request.tools = Some(Vec::new());
    request.temperature = Some(1.0);
    let response = model_call(request).await?;
    let result_text = match response.content.first() {
        Some(ContentBlock::Text { text, .. }) => text.clone(),
        _ => "No response from model".to_string(),
    };
    if !web_fetch_copyright() && looks_like_refusal(&result_text) {
        let dash = char::from_u32(0x2014).map(String::from).unwrap_or_default();
        return Ok(format!(
            "[Secondary model refused to reproduce content {dash} returning raw fetched content]\n\nUser prompt: {prompt}\n\n---\n\nFetched content:\n{truncated}"
        ));
    }
    Ok(result_text)
}

fn status_text_for_redirect(status: u16) -> &'static str {
    match status {
        301 => "Moved Permanently",
        308 => "Permanent Redirect",
        307 => "Temporary Redirect",
        _ => "Found",
    }
}

/// `webFetchToolInputToPermissionRuleContent`.
fn permission_rule_content(input: &Value) -> String {
    match input
        .get("url")
        .and_then(Value::as_str)
        .and_then(|u| url::Url::parse(u).ok())
    {
        Some(parsed) => format!("domain:{}", js_hostname(&parsed)),
        None => "input:[object Object]".to_string(),
    }
}

/// `buildSuggestions`.
fn build_suggestions(rule_content: &str) -> Value {
    json!([{
        "type": "addRules",
        "destination": "localSettings",
        "rules": [{"toolName": WEB_FETCH_TOOL_NAME, "ruleContent": rule_content}],
        "behavior": "allow",
    }])
}

/// A normalização do `z.string().url()` do zod: o valor vira o `href`, sem a
/// barra final que o `href` acrescenta quando a original não tinha.
fn normalize_url(value: &str) -> Option<String> {
    let parsed = url::Url::parse(value).ok()?;
    let href = parsed.to_string();
    if !value.ends_with('/') && href.ends_with('/') {
        Some(href[..href.len() - 1].to_string())
    } else {
        Some(href)
    }
}

/// O fluxo do `call` do JS, com a configuração de transporte.
pub async fn run_web_fetch(
    input: &Value,
    ctx: &ToolContext,
    config: &WebFetchConfig,
) -> ToolResult {
    let url = input
        .get("url")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string();
    let prompt = input
        .get("prompt")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string();
    let start = Instant::now();
    let outcome = match get_url_markdown_content(&url, ctx, config).await {
        Ok(o) => o,
        Err(e) => return ToolResult::error(e),
    };
    let (bytes, code, code_text, result) = match outcome {
        FetchOutcome::Redirect {
            original_url,
            redirect_url,
            status,
        } => {
            let status_text = status_text_for_redirect(status);
            let message = format!(
                "REDIRECT DETECTED: The URL redirects to a different host.\n\nOriginal URL: {original_url}\nRedirect URL: {redirect_url}\nStatus: {status} {status_text}\n\nTo complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:\n- url: \"{redirect_url}\"\n- prompt: \"{prompt}\""
            );
            (message.len(), status, status_text.to_string(), message)
        }
        FetchOutcome::Content(entry) => {
            let is_preapproved = is_preapproved_url(&url);
            let mut result = if is_preapproved
                && entry.content_type.contains("text/markdown")
                && js_len(&entry.content) < MAX_MARKDOWN_LENGTH
            {
                entry.content.clone()
            } else {
                match apply_prompt_to_markdown(&prompt, &entry.content, ctx, is_preapproved).await {
                    Ok(r) => r,
                    Err(e) => return ToolResult::error(e),
                }
            };
            if let Some(path) = &entry.persisted_path {
                result.push_str(&format!(
                    "\n\n[Binary content ({}, {}) also saved to {path}]",
                    entry.content_type,
                    format_file_size(entry.persisted_size.unwrap_or(entry.bytes) as u64)
                ));
            }
            (entry.bytes, entry.code, entry.code_text, result)
        }
    };
    let data = json!({
        "bytes": bytes,
        "code": code,
        "codeText": code_text,
        "result": result,
        "durationMs": start.elapsed().as_millis() as u64,
        "url": url,
    });
    ToolResult::text(result).with_tool_use_result(data)
}

/// Fetch content from a URL and process it with the small model.
pub struct WebFetchTool;

/// O WebFetch com ajustes de transporte ([`WebFetchConfig`]); a mesma tool
/// em tudo o mais.
pub struct ConfiguredWebFetchTool {
    pub config: WebFetchConfig,
}

fn input_schema() -> Value {
    json!({
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "url": {
                "description": "The URL to fetch content from",
                "type": "string",
                "format": "uri"
            },
            "prompt": {
                "description": "The prompt to run on the fetched content",
                "type": "string"
            }
        },
        "required": ["url", "prompt"],
        "additionalProperties": false
    })
}

fn preprocess(mut input: Value) -> Value {
    if let Some(obj) = input.as_object_mut() {
        if let Some(Value::String(u)) = obj.get("url") {
            if let Some(normalized) = normalize_url(u) {
                obj.insert("url".to_string(), Value::String(normalized));
            }
        }
    }
    input
}

/// O issue `invalid_format` do zod para URL que não parseia.
fn refine(input: &Value) -> Vec<Value> {
    match input.get("url").and_then(Value::as_str) {
        Some(u) if url::Url::parse(u).is_err() => {
            let mut issue = serde_json::Map::new();
            issue.insert("code".into(), json!("invalid_format"));
            issue.insert("format".into(), json!("url"));
            issue.insert("path".into(), json!(["url"]));
            issue.insert("message".into(), json!("Invalid URL"));
            vec![Value::Object(issue)]
        }
        _ => Vec::new(),
    }
}

fn validate(input: &Value) -> Result<(), String> {
    let url = input.get("url").and_then(Value::as_str).unwrap_or_default();
    if url::Url::parse(url).is_err() {
        return Err(format!(
            "Error: Invalid URL \"{url}\". The URL provided could not be parsed."
        ));
    }
    Ok(())
}

/// `checkPermissions` do WebFetch.
fn check(input: &Value, rules: &PermissionRules) -> PermissionResult {
    if let Some(parsed) = input
        .get("url")
        .and_then(Value::as_str)
        .and_then(|u| url::Url::parse(u).ok())
    {
        if is_preapproved_host(&js_hostname(&parsed), parsed.path()) {
            return PermissionResult::Allow {
                updated_input: Some(input.clone()),
                decision_reason: Some(DecisionReason::Other("Preapproved host".to_string())),
            };
        }
    }
    let rule_content = permission_rule_content(input);
    let find = |behavior: RuleBehavior| {
        rules
            .content_rules(WEB_FETCH_TOOL_NAME, behavior)
            .into_iter()
            .rev()
            .find(|r| r.pattern.as_deref() == Some(rule_content.as_str()))
            .cloned()
    };
    if let Some(rule) = find(RuleBehavior::Deny) {
        return PermissionResult::Deny {
            message: format!("{WEB_FETCH_TOOL_NAME} denied access to {rule_content}."),
            decision_reason: Some(DecisionReason::Rule {
                rule,
                behavior: RuleBehavior::Deny,
            }),
        };
    }
    let ask_message = format!(
        "Claude requested permissions to use {WEB_FETCH_TOOL_NAME}, but you haven't granted it yet."
    );
    if let Some(rule) = find(RuleBehavior::Ask) {
        return PermissionResult::Ask(PermissionAsk {
            message: ask_message,
            decision_reason: Some(DecisionReason::Rule {
                rule,
                behavior: RuleBehavior::Ask,
            }),
            suggestions: Some(build_suggestions(&rule_content)),
            ..Default::default()
        });
    }
    if let Some(rule) = find(RuleBehavior::Allow) {
        return PermissionResult::Allow {
            updated_input: Some(input.clone()),
            decision_reason: Some(DecisionReason::Rule {
                rule,
                behavior: RuleBehavior::Allow,
            }),
        };
    }
    PermissionResult::Ask(PermissionAsk {
        message: ask_message,
        suggestions: Some(build_suggestions(&rule_content)),
        ..Default::default()
    })
}

macro_rules! web_fetch_tool_impl {
    ($ty:ty) => {
        #[async_trait]
        impl Tool for $ty {
            fn name(&self) -> &str {
                WEB_FETCH_TOOL_NAME
            }

            fn description(&self) -> &str {
                DESCRIPTION
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
                Some(100_000)
            }

            fn preprocess_input(&self, input: Value) -> Value {
                preprocess(input)
            }

            fn refine_input(&self, input: &Value) -> Vec<Value> {
                refine(input)
            }

            async fn validate_input(
                &self,
                input: &Value,
                _context: &ToolContext,
            ) -> Result<(), String> {
                validate(input)
            }

            async fn check_permissions(
                &self,
                input: &Value,
                _context: &ToolContext,
                rules: &PermissionRules,
            ) -> PermissionResult {
                check(input, rules)
            }

            async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
                run_web_fetch(&input, context, &self.fetch_config()).await
            }
        }
    };
}

impl WebFetchTool {
    fn fetch_config(&self) -> WebFetchConfig {
        WebFetchConfig::default()
    }
}

impl ConfiguredWebFetchTool {
    fn fetch_config(&self) -> WebFetchConfig {
        self.config.clone()
    }
}

web_fetch_tool_impl!(WebFetchTool);
web_fetch_tool_impl!(ConfiguredWebFetchTool);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn preapproved_hosts_follow_the_js_rules() {
        assert!(is_preapproved_host("doc.rust-lang.org", "/std"));
        assert!(is_preapproved_host("github.com", "/anthropics"));
        assert!(is_preapproved_host("github.com", "/anthropics/claude-code"));
        assert!(!is_preapproved_host("github.com", "/anthropicsx"));
        assert!(!is_preapproved_host("example.com", "/"));
    }

    #[test]
    fn redirects_are_permitted_only_on_the_same_host() {
        assert!(is_permitted_redirect(
            "https://a.com/x",
            "https://www.a.com/y"
        ));
        assert!(!is_permitted_redirect("https://a.com/x", "https://b.com/y"));
        assert!(!is_permitted_redirect("https://a.com/x", "http://a.com/y"));
        assert!(!is_permitted_redirect(
            "https://a.com:8443/x",
            "https://a.com/y"
        ));
    }

    #[test]
    fn validate_url_needs_a_dotted_host_and_no_credentials() {
        assert!(validate_url("https://127.0.0.1:18125/page"));
        assert!(!validate_url("https://localhost/x"));
        assert!(!validate_url("https://u:p@a.com/"));
    }

    #[test]
    fn url_is_normalized_like_zod() {
        assert_eq!(
            normalize_url("HTTPS://127.0.0.1:18125/md").as_deref(),
            Some("https://127.0.0.1:18125/md")
        );
        assert_eq!(
            normalize_url("https://a.com").as_deref(),
            Some("https://a.com")
        );
        assert_eq!(
            normalize_url("https://a.com/").as_deref(),
            Some("https://a.com/")
        );
    }

    #[test]
    fn binary_content_types() {
        assert!(!is_binary_content_type("text/html; charset=utf-8"));
        assert!(!is_binary_content_type("application/ld+json"));
        assert!(is_binary_content_type("application/pdf"));
        assert!(!is_binary_content_type(""));
    }
}
