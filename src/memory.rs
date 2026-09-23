//! Instruções de memória (`CLAUDE.md`) e o contexto de usuário que o CLI
//! prepara antes de cada chamada ao modelo.
//!
//! Porte de `utils/claudemd/*` (`getMemoryFiles`, `processMemoryFile`,
//! `processMdRules`, `parseMemoryFileContent`, `stripHtmlCommentsFromTokens`,
//! `extractIncludePathsFromTokens`, `getClaudeMds`), de `context.js`
//! (`getUserContext`) e de `utils/api.js` (`prependUserContext`) do CLI de
//! referência.
//!
//! O que é carregado, na ordem do CLI:
//! 1. o `CLAUDE.md` gerenciado (`/etc/claude-code/CLAUDE.md` no Linux) e as
//!    regras incondicionais de `/etc/claude-code/.claude/rules`, sempre;
//! 2. `~/.claude/CLAUDE.md` e `~/.claude/rules`, só com a fonte `user`;
//! 3. de cada diretório entre a raiz (exclusive) e o cwd, da raiz para o cwd:
//!    `CLAUDE.md`, `.claude/CLAUDE.md` e `.claude/rules` com a fonte
//!    `project`, e `CLAUDE.local.md` com a fonte `local`;
//! 4. o `MEMORY.md` da memória automática, quando ela está ligada.
//!
//! O resultado não vai para o system prompt: vira uma mensagem de usuário
//! `isMeta` com um `<system-reminder>`, posta NA FRENTE das mensagens de toda
//! chamada ao modelo e nunca gravada no transcript.

use std::collections::HashSet;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;

use regex::Regex;

use crate::api::types::{ApiMessage, ContentBlock};
use crate::types::SettingSource;

/// Texto que abre o bloco de instruções (`MEMORY_INSTRUCTION_PROMPT`).
pub const MEMORY_INSTRUCTION_PROMPT: &str = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written.";

/// Profundidade máxima de `@include` (`MAX_INCLUDE_DEPTH`).
const MAX_INCLUDE_DEPTH: usize = 5;

/// Limites do `MEMORY.md` (`truncateEntrypointContent`).
const MAX_ENTRYPOINT_LINES: usize = 200;
const MAX_ENTRYPOINT_BYTES: usize = 25_000;

/// Extensões que um `@include` pode trazer (`TEXT_FILE_EXTENSIONS`).
const TEXT_FILE_EXTENSIONS: &[&str] = &[
    ".md",
    ".txt",
    ".text",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".xml",
    ".csv",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".mjs",
    ".cjs",
    ".mts",
    ".cts",
    ".py",
    ".pyi",
    ".pyw",
    ".rb",
    ".erb",
    ".rake",
    ".go",
    ".rs",
    ".java",
    ".kt",
    ".kts",
    ".scala",
    ".c",
    ".cpp",
    ".cc",
    ".cxx",
    ".h",
    ".hpp",
    ".hxx",
    ".cs",
    ".swift",
    ".sh",
    ".bash",
    ".zsh",
    ".fish",
    ".ps1",
    ".bat",
    ".cmd",
    ".env",
    ".ini",
    ".cfg",
    ".conf",
    ".config",
    ".properties",
    ".sql",
    ".graphql",
    ".gql",
    ".proto",
    ".vue",
    ".svelte",
    ".astro",
    ".ejs",
    ".hbs",
    ".pug",
    ".jade",
    ".php",
    ".pl",
    ".pm",
    ".lua",
    ".r",
    ".R",
    ".dart",
    ".ex",
    ".exs",
    ".erl",
    ".hrl",
    ".clj",
    ".cljs",
    ".cljc",
    ".edn",
    ".hs",
    ".lhs",
    ".elm",
    ".ml",
    ".mli",
    ".f",
    ".f90",
    ".f95",
    ".for",
    ".cmake",
    ".make",
    ".makefile",
    ".gradle",
    ".sbt",
    ".rst",
    ".adoc",
    ".asciidoc",
    ".org",
    ".tex",
    ".latex",
    ".lock",
    ".log",
    ".diff",
    ".patch",
];

/// Origem de um arquivo de memória (o `type` do CLI).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MemoryType {
    Managed,
    User,
    Project,
    Local,
    AutoMem,
}

impl MemoryType {
    /// A descrição que o `getClaudeMds` põe depois do caminho.
    fn description(self) -> &'static str {
        match self {
            MemoryType::Project => " (project instructions, checked into the codebase)",
            MemoryType::Local => " (user's private project instructions, not checked in)",
            MemoryType::AutoMem => " (user's auto-memory, persists across conversations)",
            // User e Managed dividem a mesma descrição no CLI.
            MemoryType::User | MemoryType::Managed => {
                " (user's private global instructions for all projects)"
            }
        }
    }
}

/// Um arquivo de memória carregado.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MemoryFile {
    pub path: PathBuf,
    pub kind: MemoryType,
    pub content: String,
    /// Quem incluiu este arquivo por `@include`, quando foi incluído.
    pub parent: Option<PathBuf>,
    /// O frontmatter restringe o arquivo a caminhos (`globs` do CLI): uma
    /// regra assim só entra quando um arquivo casado é lido, nunca no
    /// contexto inicial.
    pub conditional: bool,
}

/// O que decide quais arquivos entram.
#[derive(Debug, Clone)]
pub struct MemoryConfig {
    /// O cwd original da sessão.
    pub cwd: PathBuf,
    /// Fontes habilitadas; `user`, `project` e `local` são as que importam
    /// aqui (a gerenciada e a de flag estão sempre ligadas no CLI).
    pub sources: Vec<SettingSource>,
    /// `CLAUDE_CONFIG_DIR` ou `~/.claude`.
    pub config_home: PathBuf,
    /// O home do usuário (`os.homedir()`), base do `~` nos `@include`.
    pub home: PathBuf,
    /// `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` já validado: o diretório da
    /// memória automática, quando o ambiente o fixa.
    pub auto_memory_override: Option<PathBuf>,
    /// Diretório gerenciado (`/etc/claude-code` no Linux).
    pub managed_dir: PathBuf,
    /// Base da memória automática (`CLAUDE_CODE_REMOTE_MEMORY_DIR` ou o
    /// `config_home`).
    pub memory_base: PathBuf,
    /// `isAutoMemoryEnabled()`.
    pub auto_memory_enabled: bool,
    /// `CLAUDE_CODE_DISABLE_CLAUDE_MDS` (ou modo bare): nenhum arquivo.
    pub disable_claude_mds: bool,
}

impl MemoryConfig {
    /// Monta a configuração como o CLI faria com este env (o das opções vence
    /// o do processo, como no resto do transporte nativo) e estas fontes.
    /// `sources = None` é o CLI sem `--setting-sources`: todas as fontes.
    pub fn from_env(
        cwd: &Path,
        sources: Option<&[SettingSource]>,
        env: &std::collections::HashMap<String, String>,
    ) -> Self {
        let var = |key: &str| -> Option<String> {
            match env.get(key) {
                Some(v) => Some(v.clone()),
                None => std::env::var(key).ok(),
            }
        };
        let home = PathBuf::from(var("HOME").unwrap_or_else(|| ".".to_string()));
        let config_home = var("CLAUDE_CONFIG_DIR")
            .filter(|v| !v.is_empty())
            .map(PathBuf::from)
            .unwrap_or_else(|| home.join(".claude"));
        let auto_memory_override = var("CLAUDE_COWORK_MEMORY_PATH_OVERRIDE")
            .as_deref()
            .and_then(validate_memory_path);
        let memory_base = var("CLAUDE_CODE_REMOTE_MEMORY_DIR")
            .filter(|v| !v.is_empty())
            .map(PathBuf::from)
            .unwrap_or_else(|| config_home.clone());
        let auto_memory_enabled = auto_memory_enabled(&var);
        let disable_claude_mds = is_env_truthy(var("CLAUDE_CODE_DISABLE_CLAUDE_MDS").as_deref())
            || is_env_truthy(var("CLAUDE_CODE_SIMPLE").as_deref());
        Self {
            cwd: cwd.to_path_buf(),
            sources: sources.map(<[_]>::to_vec).unwrap_or_else(|| {
                vec![
                    SettingSource::User,
                    SettingSource::Project,
                    SettingSource::Local,
                ]
            }),
            config_home,
            home,
            auto_memory_override,
            managed_dir: PathBuf::from("/etc/claude-code"),
            memory_base,
            auto_memory_enabled,
            disable_claude_mds,
        }
    }

    fn enabled(&self, source: SettingSource) -> bool {
        self.sources.contains(&source)
    }
}

/// `validateMemoryPath(raw, false)`: só caminho absoluto, com pelo menos 3
/// caracteres, sem `//` inicial nem byte nulo; a barra final some.
fn validate_memory_path(raw: &str) -> Option<PathBuf> {
    if raw.is_empty() || raw.contains('\0') || raw.starts_with("//") {
        return None;
    }
    let path = Path::new(raw);
    if !path.is_absolute() {
        return None;
    }
    let normalized = normalize_lexically(path);
    if normalized.as_os_str().len() < 3 {
        return None;
    }
    Some(normalized)
}

/// `isEnvTruthy` do CLI: `1`, `true`, `yes`, `on` (sem distinção de caixa).
fn is_env_truthy(value: Option<&str>) -> bool {
    matches!(
        value.map(|v| v.trim().to_ascii_lowercase()).as_deref(),
        Some("1" | "true" | "yes" | "on")
    )
}

/// `isEnvDefinedFalsy`: definido e explicitamente falso.
fn is_env_defined_falsy(value: Option<&str>) -> bool {
    matches!(
        value.map(|v| v.trim().to_ascii_lowercase()).as_deref(),
        Some("0" | "false" | "no" | "off")
    )
}

/// `isAutoMemoryEnabled`: a variável de desligar vence; definida e falsa
/// força ligado; modo simples e remoto sem diretório de memória desligam; o
/// resto segue a configuração, que por padrão é ligada.
fn auto_memory_enabled(var: &dyn Fn(&str) -> Option<String>) -> bool {
    let disable = var("CLAUDE_CODE_DISABLE_AUTO_MEMORY");
    if is_env_truthy(disable.as_deref()) {
        return false;
    }
    if is_env_defined_falsy(disable.as_deref()) {
        return true;
    }
    if is_env_truthy(var("CLAUDE_CODE_SIMPLE").as_deref()) {
        return false;
    }
    if is_env_truthy(var("CLAUDE_CODE_REMOTE").as_deref())
        && var("CLAUDE_CODE_REMOTE_MEMORY_DIR").is_none()
    {
        return false;
    }
    true
}

static FRONTMATTER_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^---\s*\n((?s:.*?))---\s*\n?").expect("regex"));
static COMMENT_SPAN_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?s)<!--.*?-->").expect("regex"));
static INCLUDE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?:^|\s)@((?:[^\s\\]|\\ )+)").expect("regex"));

/// `parseFrontmatter` + `parseFrontmatterPaths`: separa o frontmatter e diz
/// se ele restringe o arquivo a caminhos (`paths:`), o que torna uma regra
/// condicional.
fn split_frontmatter(raw: &str) -> (String, bool) {
    let Some(m) = FRONTMATTER_RE.captures(raw) else {
        return (raw.to_string(), false);
    };
    let whole = m.get(0).map(|g| g.end()).unwrap_or(0);
    let front = m.get(1).map(|g| g.as_str()).unwrap_or("");
    let content = raw[whole..].to_string();
    let patterns = frontmatter_paths(front);
    let conditional = !patterns.is_empty() && !patterns.iter().all(|p| p == "**");
    (content, conditional)
}

/// Os padrões do campo `paths` de um frontmatter YAML simples: valor na
/// mesma linha (texto, ou lista `[a, b]`) ou itens `- x` nas linhas seguintes.
fn frontmatter_paths(front: &str) -> Vec<String> {
    let mut lines = front.lines().peekable();
    while let Some(line) = lines.next() {
        let Some(rest) = line.trim_start().strip_prefix("paths:") else {
            continue;
        };
        let rest = rest.trim();
        let mut raw_items: Vec<String> = Vec::new();
        if rest.is_empty() {
            while let Some(next) = lines.peek() {
                let item = next.trim_start();
                let Some(value) = item.strip_prefix('-') else {
                    break;
                };
                raw_items.push(value.trim().to_string());
                lines.next();
            }
        } else if let Some(inner) = rest.strip_prefix('[').and_then(|r| r.strip_suffix(']')) {
            raw_items.extend(inner.split(',').map(|s| s.trim().to_string()));
        } else {
            raw_items.push(rest.to_string());
        }
        return raw_items
            .into_iter()
            .flat_map(|item| {
                item.split(',')
                    .map(|s| s.trim().trim_matches(['"', '\'']).to_string())
                    .collect::<Vec<_>>()
            })
            .map(|p| p.strip_suffix("/**").map(str::to_string).unwrap_or(p))
            .filter(|p| !p.is_empty())
            .collect();
    }
    Vec::new()
}

/// Uma linha que abre cerca de código (``` ou ~~~ com até 3 espaços antes).
fn fence_marker(line: &str) -> Option<(char, usize)> {
    let indent = line.len() - line.trim_start_matches(' ').len();
    if indent > 3 {
        return None;
    }
    let rest = &line[indent..];
    let ch = rest.chars().next()?;
    if ch != '`' && ch != '~' {
        return None;
    }
    let run = rest.chars().take_while(|c| *c == ch).count();
    (run >= 3).then_some((ch, run))
}

/// Um trecho do markdown: bloco de código, bloco HTML de comentário ou texto
/// comum. É a partição de nível de bloco que importa para o que o CLI faz
/// com os tokens do `marked`: comentário HTML de bloco some, e `@include` só
/// vale em texto (nunca em código).
enum Segment<'a> {
    Code(&'a str),
    Comment(&'a str),
    Text(&'a str),
}

/// Parte o conteúdo em [`Segment`]s, linha a linha, como o lexer de bloco:
/// cerca de código vai até a cerca de fechamento (ou o fim); um bloco de
/// comentário começa numa linha que abre com `<!--` (até 3 espaços antes) e
/// vai até o fim da linha que contém `-->`, levando as quebras de linha
/// seguintes (o `comment[^\n]*(\n+|$)` do `marked`).
fn segments(content: &str) -> Vec<Segment<'_>> {
    let mut out = Vec::new();
    let mut offsets: Vec<usize> = content.match_indices('\n').map(|(i, _)| i + 1).collect();
    offsets.insert(0, 0);
    let line_at = |start: usize| -> &str {
        let end = content[start..]
            .find('\n')
            .map(|i| start + i + 1)
            .unwrap_or(content.len());
        &content[start..end]
    };
    let mut text_start = 0usize;
    let mut i = 0usize;
    while i < offsets.len() && offsets[i] < content.len() {
        let start = offsets[i];
        let line = line_at(start);
        let trimmed = line.trim_end_matches(['\n', '\r']);
        if let Some((ch, run)) = fence_marker(trimmed) {
            if text_start < start {
                out.push(Segment::Text(&content[text_start..start]));
            }
            let mut j = i + 1;
            while j < offsets.len() && offsets[j] < content.len() {
                let candidate = line_at(offsets[j]).trim_end_matches(['\n', '\r']);
                if let Some((c2, r2)) = fence_marker(candidate) {
                    if c2 == ch && r2 >= run && candidate.trim().chars().all(|c| c == ch) {
                        j += 1;
                        break;
                    }
                }
                j += 1;
            }
            let end = offsets
                .get(j)
                .copied()
                .unwrap_or(content.len())
                .min(content.len());
            out.push(Segment::Code(&content[start..end]));
            text_start = end;
            i = j;
            continue;
        }
        let indent = trimmed.len() - trimmed.trim_start_matches(' ').len();
        if indent <= 3 && trimmed[indent..].starts_with("<!--") {
            if text_start < start {
                out.push(Segment::Text(&content[text_start..start]));
            }
            // Vai até a linha que fecha o comentário (ou o fim do texto).
            let mut j = i;
            let mut closed = false;
            while j < offsets.len() && offsets[j] < content.len() {
                let candidate = line_at(offsets[j]);
                let from = if j == i { indent + 4 } else { 0 };
                if candidate.get(from..).is_some_and(|s| s.contains("-->")) {
                    closed = true;
                    j += 1;
                    break;
                }
                j += 1;
            }
            // As quebras de linha seguintes (linhas vazias) vêm junto.
            if closed {
                while j < offsets.len()
                    && offsets[j] < content.len()
                    && line_at(offsets[j]).trim_end_matches('\r') == "\n"
                {
                    j += 1;
                }
            }
            let end = offsets
                .get(j)
                .copied()
                .unwrap_or(content.len())
                .min(content.len());
            out.push(Segment::Comment(&content[start..end]));
            text_start = end;
            i = j;
            continue;
        }
        i += 1;
    }
    if text_start < content.len() {
        out.push(Segment::Text(&content[text_start..]));
    }
    out
}

/// Remove os spans de código inline (`` `...` ``) de um trecho de texto, que
/// o `marked` transforma em `codespan` e o CLI pula ao procurar `@include`.
fn without_code_spans(text: &str) -> String {
    static CODESPAN_RE: LazyLock<Regex> =
        LazyLock::new(|| Regex::new(r"(`+)(?s:.+?)(`+)").expect("regex"));
    CODESPAN_RE.replace_all(text, " ").into_owned()
}

/// `stripHtmlCommentsFromTokens`: some o bloco de comentário cujo resto
/// (tirados os comentários) é só espaço; senão fica o resto.
fn strip_html_comments(content: &str) -> String {
    let mut result = String::new();
    for segment in segments(content) {
        match segment {
            Segment::Comment(raw) => {
                let trimmed = raw.trim_start();
                if trimmed.starts_with("<!--") && trimmed.contains("-->") {
                    let residue = COMMENT_SPAN_RE.replace_all(raw, "");
                    if !residue.trim().is_empty() {
                        result.push_str(&residue);
                    }
                    continue;
                }
                result.push_str(raw);
            }
            Segment::Code(raw) | Segment::Text(raw) => result.push_str(raw),
        }
    }
    result
}

/// `expandPath` de um caminho de `@include`: `~` vira o home, relativo é
/// resolvido contra o diretório do arquivo que inclui.
fn expand_include(path: &str, base_dir: &Path, home: &Path) -> PathBuf {
    if let Some(rest) = path.strip_prefix("~/") {
        return home.join(rest);
    }
    if path == "~" {
        return home.to_path_buf();
    }
    let p = Path::new(path);
    let joined = if p.is_absolute() {
        p.to_path_buf()
    } else {
        base_dir.join(p)
    };
    normalize_lexically(&joined)
}

/// Normalização léxica (`path.resolve` sem tocar o disco).
fn normalize_lexically(path: &Path) -> PathBuf {
    let mut out = PathBuf::new();
    for component in path.components() {
        match component {
            std::path::Component::ParentDir => {
                out.pop();
            }
            std::path::Component::CurDir => {}
            other => out.push(other.as_os_str()),
        }
    }
    out
}

/// `extractIncludePathsFromTokens`: os `@caminho` do texto (fora de código),
/// resolvidos.
fn include_paths(content: &str, base_path: &Path, home: &Path) -> Vec<PathBuf> {
    let base_dir = base_path.parent().unwrap_or(Path::new("/"));
    let mut seen = HashSet::new();
    let mut out = Vec::new();
    let mut scan = |text: &str| {
        for caps in INCLUDE_RE.captures_iter(text) {
            let Some(raw) = caps.get(1).map(|m| m.as_str()) else {
                continue;
            };
            let raw = raw.split('#').next().unwrap_or("");
            if raw.is_empty() {
                continue;
            }
            let path = raw.replace("\\ ", " ");
            let accepted = path.starts_with("./")
                || path.starts_with("~/")
                || (path.starts_with('/') && path != "/")
                || (!path.starts_with('@')
                    && !path.starts_with(['#', '%', '^', '&', '*', '(', ')'])
                    && path.chars().next().is_some_and(|c| {
                        c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-')
                    }));
            if accepted {
                let resolved = expand_include(&path, base_dir, home);
                if seen.insert(resolved.clone()) {
                    out.push(resolved);
                }
            }
        }
    };
    for segment in segments(content) {
        match segment {
            Segment::Code(_) => {}
            Segment::Comment(raw) => {
                let trimmed = raw.trim_start();
                if trimmed.starts_with("<!--") && trimmed.contains("-->") {
                    let residue = COMMENT_SPAN_RE.replace_all(raw, "");
                    if !residue.trim().is_empty() {
                        scan(&without_code_spans(&residue));
                    }
                }
            }
            Segment::Text(raw) => scan(&without_code_spans(raw)),
        }
    }
    out
}

/// `formatFileSize` do CLI.
fn format_file_size(bytes: usize) -> String {
    let kb = bytes as f64 / 1024.0;
    let fmt = |v: f64| {
        let s = format!("{v:.1}");
        s.strip_suffix(".0").map(str::to_string).unwrap_or(s)
    };
    if kb < 1.0 {
        return format!("{bytes} bytes");
    }
    if kb < 1024.0 {
        return format!("{}KB", fmt(kb));
    }
    let mb = kb / 1024.0;
    if mb < 1024.0 {
        return format!("{}MB", fmt(mb));
    }
    format!("{}GB", fmt(mb / 1024.0))
}

/// `truncateEntrypointContent`: o `MEMORY.md` passa de 200 linhas ou 25000
/// bytes e ganha o aviso do CLI no fim.
fn truncate_entrypoint(raw: &str) -> String {
    let trimmed = raw.trim();
    let lines: Vec<&str> = trimmed.split('\n').collect();
    let line_count = lines.len();
    let byte_count = trimmed.encode_utf16().count();
    let line_truncated = line_count > MAX_ENTRYPOINT_LINES;
    let byte_truncated = byte_count > MAX_ENTRYPOINT_BYTES;
    if !line_truncated && !byte_truncated {
        return trimmed.to_string();
    }
    let mut truncated = if line_truncated {
        lines[..MAX_ENTRYPOINT_LINES].join("\n")
    } else {
        trimmed.to_string()
    };
    if truncated.encode_utf16().count() > MAX_ENTRYPOINT_BYTES {
        let limit = char_boundary_for_utf16(&truncated, MAX_ENTRYPOINT_BYTES);
        let cut = truncated[..limit]
            .rfind('\n')
            .filter(|i| *i > 0)
            .unwrap_or(limit);
        truncated.truncate(cut);
    }
    let dash = char::from_u32(0x2014).unwrap_or('-');
    let reason = if byte_truncated && !line_truncated {
        format!(
            "{} (limit: {}) {dash} index entries are too long",
            format_file_size(byte_count),
            format_file_size(MAX_ENTRYPOINT_BYTES)
        )
    } else if line_truncated && !byte_truncated {
        format!("{line_count} lines (limit: {MAX_ENTRYPOINT_LINES})")
    } else {
        format!("{line_count} lines and {}", format_file_size(byte_count))
    };
    format!(
        "{truncated}\n\n> WARNING: MEMORY.md is {reason}. Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files."
    )
}

/// Índice de byte que corresponde a `units` unidades UTF-16 (o `length` do
/// JS), sem partir caractere.
fn char_boundary_for_utf16(text: &str, units: usize) -> usize {
    let mut count = 0usize;
    for (i, c) in text.char_indices() {
        if count + c.len_utf16() > units {
            return i;
        }
        count += c.len_utf16();
    }
    text.len()
}

struct Loader<'a> {
    config: &'a MemoryConfig,
    processed: HashSet<PathBuf>,
    home: PathBuf,
}

impl Loader<'_> {
    /// `processMemoryFile`.
    fn process_file(
        &mut self,
        path: &Path,
        kind: MemoryType,
        include_external: bool,
        depth: usize,
        parent: Option<&Path>,
    ) -> Vec<MemoryFile> {
        if self.processed.contains(path) || depth >= MAX_INCLUDE_DEPTH {
            return Vec::new();
        }
        let resolved = std::fs::canonicalize(path).unwrap_or_else(|_| path.to_path_buf());
        self.processed.insert(path.to_path_buf());
        if resolved != path {
            self.processed.insert(resolved.clone());
        }
        let Ok(raw) = std::fs::read_to_string(path) else {
            return Vec::new();
        };
        let ext = path
            .extension()
            .map(|e| format!(".{}", e.to_string_lossy().to_lowercase()))
            .unwrap_or_default();
        if !ext.is_empty() && !TEXT_FILE_EXTENSIONS.contains(&ext.as_str()) {
            return Vec::new();
        }
        let (without_frontmatter, conditional) = split_frontmatter(&raw);
        let content = if without_frontmatter.contains("<!--") {
            strip_html_comments(&without_frontmatter)
        } else {
            without_frontmatter.clone()
        };
        let includes = include_paths(&without_frontmatter, &resolved, &self.home);
        if content.trim().is_empty() {
            return Vec::new();
        }
        let mut result = vec![MemoryFile {
            path: path.to_path_buf(),
            kind,
            content,
            parent: parent.map(Path::to_path_buf),
            conditional,
        }];
        for include in includes {
            if !include.starts_with(&self.config.cwd) && !include_external {
                continue;
            }
            result.extend(self.process_file(
                &include,
                kind,
                include_external,
                depth + 1,
                Some(path),
            ));
        }
        result
    }

    /// `processMdRules` com `conditionalRule = false`: os `.md` de um diretório
    /// de regras (recursivo, seguindo links), só os sem `paths:`.
    fn process_rules(
        &mut self,
        dir: &Path,
        kind: MemoryType,
        include_external: bool,
        visited: &mut HashSet<PathBuf>,
    ) -> Vec<MemoryFile> {
        if visited.contains(dir) {
            return Vec::new();
        }
        let resolved = std::fs::canonicalize(dir).unwrap_or_else(|_| dir.to_path_buf());
        visited.insert(dir.to_path_buf());
        visited.insert(resolved.clone());
        let Ok(entries) = std::fs::read_dir(&resolved) else {
            return Vec::new();
        };
        let mut entries: Vec<_> = entries.flatten().collect();
        entries.sort_by_key(|e| e.file_name());
        let mut result = Vec::new();
        for entry in entries {
            // O CLI entra pelo caminho já resolvido do link simbólico, tanto
            // na recursão quanto no arquivo.
            let entry_path = std::fs::canonicalize(entry.path()).unwrap_or_else(|_| entry.path());
            let meta = std::fs::metadata(&entry_path);
            let is_dir = meta.as_ref().map(|m| m.is_dir()).unwrap_or(false);
            let is_file = meta.as_ref().map(|m| m.is_file()).unwrap_or(false);
            if is_dir {
                result.extend(self.process_rules(&entry_path, kind, include_external, visited));
            } else if is_file && entry.file_name().to_string_lossy().ends_with(".md") {
                // `files.filter((f) => !f.globs)`: o filtro vale para cada
                // arquivo devolvido, inclusive os trazidos por `@include`.
                let files = self.process_file(&entry_path, kind, include_external, 0, None);
                result.extend(files.into_iter().filter(|f| !f.conditional));
            }
        }
        result
    }
}

/// `getMemoryFiles`: os arquivos de memória na ordem do CLI.
pub fn get_memory_files(config: &MemoryConfig) -> Vec<MemoryFile> {
    let mut loader = Loader {
        config,
        processed: HashSet::new(),
        home: config.home.clone(),
    };
    let mut result = Vec::new();
    // Aprovação de includes externos mora na configuração de projeto do CLI
    // (`hasClaudeMdExternalIncludesApproved`), que o nativo não tem.
    let include_external = false;

    result.extend(loader.process_file(
        &config.managed_dir.join("CLAUDE.md"),
        MemoryType::Managed,
        include_external,
        0,
        None,
    ));
    let mut visited = HashSet::new();
    result.extend(loader.process_rules(
        &config.managed_dir.join(".claude").join("rules"),
        MemoryType::Managed,
        include_external,
        &mut visited,
    ));

    if config.enabled(SettingSource::User) {
        result.extend(loader.process_file(
            &config.config_home.join("CLAUDE.md"),
            MemoryType::User,
            true,
            0,
            None,
        ));
        let mut visited = HashSet::new();
        result.extend(loader.process_rules(
            &config.config_home.join("rules"),
            MemoryType::User,
            true,
            &mut visited,
        ));
    }

    // Da raiz (exclusive) até o cwd, na ordem raiz primeiro.
    let mut dirs: Vec<PathBuf> = Vec::new();
    let mut current = config.cwd.clone();
    while current.parent().is_some() {
        dirs.push(current.clone());
        match current.parent() {
            Some(parent) => current = parent.to_path_buf(),
            None => break,
        }
    }
    dirs.reverse();
    for dir in dirs {
        if config.enabled(SettingSource::Project) {
            result.extend(loader.process_file(
                &dir.join("CLAUDE.md"),
                MemoryType::Project,
                include_external,
                0,
                None,
            ));
            result.extend(loader.process_file(
                &dir.join(".claude").join("CLAUDE.md"),
                MemoryType::Project,
                include_external,
                0,
                None,
            ));
            let mut visited = HashSet::new();
            result.extend(loader.process_rules(
                &dir.join(".claude").join("rules"),
                MemoryType::Project,
                include_external,
                &mut visited,
            ));
        }
        if config.enabled(SettingSource::Local) {
            result.extend(loader.process_file(
                &dir.join("CLAUDE.local.md"),
                MemoryType::Local,
                include_external,
                0,
                None,
            ));
        }
    }

    if config.auto_memory_enabled {
        let entrypoint = auto_memory_entrypoint(config);
        if !loader.processed.contains(&entrypoint) {
            if let Ok(raw) = std::fs::read_to_string(&entrypoint) {
                let (without_frontmatter, _) = split_frontmatter(&raw);
                let stripped = if without_frontmatter.contains("<!--") {
                    strip_html_comments(&without_frontmatter)
                } else {
                    without_frontmatter
                };
                let content = truncate_entrypoint(&stripped);
                loader.processed.insert(entrypoint.clone());
                result.push(MemoryFile {
                    path: entrypoint,
                    kind: MemoryType::AutoMem,
                    content,
                    parent: None,
                    conditional: false,
                });
            }
        }
    }
    result
}

/// `getAutoMemEntrypoint`: `<base>/projects/<raiz do projeto sanitizada>/memory/MEMORY.md`,
/// ou `<override>/MEMORY.md` quando `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` fixa
/// o diretório. A raiz é a canônica do repositório git que contém o cwd (a do
/// repositório principal, para um worktree), ou o próprio cwd.
pub fn auto_memory_entrypoint(config: &MemoryConfig) -> PathBuf {
    if let Some(dir) = &config.auto_memory_override {
        return dir.join("MEMORY.md");
    }
    let root = git_root(&config.cwd)
        .map(|root| canonical_git_root(&root))
        .unwrap_or_else(|| config.cwd.clone());
    let key = crate::internal::sessions::sanitize_path(&root.to_string_lossy());
    config
        .memory_base
        .join("projects")
        .join(key)
        .join("memory")
        .join("MEMORY.md")
}

/// O diretório de trabalho do git que contém `start` (onde há `.git`).
fn git_root(start: &Path) -> Option<PathBuf> {
    let mut current = Some(start);
    while let Some(dir) = current {
        if dir.join(".git").exists() {
            return Some(dir.to_path_buf());
        }
        current = dir.parent();
    }
    None
}

/// `resolveCanonicalRoot`: para um worktree (`.git` é um arquivo `gitdir:`
/// apontando para `<comum>/worktrees/<nome>`, com o `gitdir` de volta para
/// este `.git`), a raiz do repositório principal; nos outros casos, a própria
/// raiz.
fn canonical_git_root(git_root: &Path) -> PathBuf {
    let resolve = || -> Option<PathBuf> {
        let content = std::fs::read_to_string(git_root.join(".git")).ok()?;
        let target = content.trim().strip_prefix("gitdir:")?.trim();
        let worktree_git_dir = normalize_lexically(&git_root.join(target));
        let common = std::fs::read_to_string(worktree_git_dir.join("commondir")).ok()?;
        let common_dir = normalize_lexically(&worktree_git_dir.join(common.trim()));
        if worktree_git_dir.parent()? != common_dir.join("worktrees") {
            return None;
        }
        let back = std::fs::read_to_string(worktree_git_dir.join("gitdir")).ok()?;
        let back = std::fs::canonicalize(back.trim()).ok()?;
        if back != std::fs::canonicalize(git_root).ok()?.join(".git") {
            return None;
        }
        if common_dir.file_name()? != ".git" {
            return Some(common_dir);
        }
        common_dir.parent().map(Path::to_path_buf)
    };
    resolve().unwrap_or_else(|| git_root.to_path_buf())
}

/// `getClaudeMds`: o texto do bloco de instruções, ou vazio sem arquivos.
pub fn get_claude_mds(files: &[MemoryFile]) -> String {
    let memories: Vec<String> = files
        .iter()
        .filter(|f| !f.content.is_empty())
        .map(|f| {
            format!(
                "Contents of {}{}:\n\n{}",
                f.path.display(),
                f.kind.description(),
                f.content.trim()
            )
        })
        .collect();
    if memories.is_empty() {
        return String::new();
    }
    format!("{MEMORY_INSTRUCTION_PROMPT}\n\n{}", memories.join("\n\n"))
}

/// `getLocalISODate`: `CLAUDE_CODE_OVERRIDE_DATE` ou a data local
/// `YYYY-MM-DD`.
pub fn local_iso_date(env: &std::collections::HashMap<String, String>) -> String {
    if let Some(date) = env
        .get("CLAUDE_CODE_OVERRIDE_DATE")
        .cloned()
        .or_else(|| std::env::var("CLAUDE_CODE_OVERRIDE_DATE").ok())
    {
        return date;
    }
    chrono::Local::now().format("%Y-%m-%d").to_string()
}

/// `getUserContext`: `claudeMd` (quando há instruções) e `currentDate`, nessa
/// ordem.
pub fn user_context(config: &MemoryConfig, date: &str) -> Vec<(String, String)> {
    let mut context = Vec::new();
    if !config.disable_claude_mds {
        let claude_md = get_claude_mds(&get_memory_files(config));
        if !claude_md.is_empty() {
            context.push(("claudeMd".to_string(), claude_md));
        }
    }
    context.push((
        "currentDate".to_string(),
        format!("Today's date is {date}."),
    ));
    context
}

/// O texto da mensagem de `prependUserContext` (vazio quando não há
/// contexto).
pub fn user_context_text(context: &[(String, String)]) -> Option<String> {
    if context.is_empty() {
        return None;
    }
    let entries = context
        .iter()
        .map(|(key, value)| format!("# {key}\n{value}"))
        .collect::<Vec<_>>()
        .join("\n");
    Some(format!(
        "<system-reminder>\nAs you answer the user's questions, you can use the following context:\n{entries}\n\n      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.\n</system-reminder>\n"
    ))
}

/// A mensagem `isMeta` que vai na frente das mensagens de cada chamada.
pub fn user_context_message(context: &[(String, String)]) -> Option<ApiMessage> {
    user_context_text(context).map(|text| ApiMessage::user(vec![ContentBlock::text(text)]))
}

/// `getUserContext` com o `memoize` do CLI: a primeira consulta lê os
/// arquivos de memória e fixa a data; as seguintes devolvem o mesmo valor,
/// sem reler o disco, até alguém chamar [`UserContextCache::clear`] (o
/// `runPostCompactCleanup` depois de uma compactação da conversa principal).
/// Um `CLAUDE.md` reescrito no meio da sessão só é visto depois disso, como
/// no CLI.
pub struct UserContextCache {
    config: MemoryConfig,
    env: std::collections::HashMap<String, String>,
    cached: std::sync::Mutex<Option<Option<ApiMessage>>>,
}

impl std::fmt::Debug for UserContextCache {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("UserContextCache")
            .field("config", &self.config)
            .finish_non_exhaustive()
    }
}

impl UserContextCache {
    /// `env` é o das opções, consultado para `CLAUDE_CODE_OVERRIDE_DATE`.
    pub fn new(config: MemoryConfig, env: std::collections::HashMap<String, String>) -> Self {
        Self {
            config,
            env,
            cached: std::sync::Mutex::new(None),
        }
    }

    /// A mensagem de `prependUserContext`, memoizada.
    pub fn message(&self) -> Option<ApiMessage> {
        let mut slot = self
            .cached
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner);
        if let Some(message) = slot.as_ref() {
            return message.clone();
        }
        let context = user_context(&self.config, &local_iso_date(&self.env));
        let message = user_context_message(&context);
        *slot = Some(message.clone());
        message
    }

    /// `getUserContext.cache.clear()` + `resetGetMemoryFilesCache`: a próxima
    /// consulta relê as memórias e a data.
    pub fn clear(&self) {
        *self
            .cached
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner) = None;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn config(cwd: &Path, home: &Path, sources: &[SettingSource]) -> MemoryConfig {
        MemoryConfig {
            cwd: cwd.to_path_buf(),
            sources: sources.to_vec(),
            config_home: home.join(".claude"),
            home: home.to_path_buf(),
            auto_memory_override: None,
            managed_dir: home.join("managed"),
            memory_base: home.join(".claude"),
            auto_memory_enabled: true,
            disable_claude_mds: false,
        }
    }

    #[test]
    fn so_projeto_carrega_do_cwd_e_nao_do_home() {
        let tmp = tempfile::tempdir().unwrap();
        let home = tmp.path().join("home");
        let cwd = tmp.path().join("work").join("sessao");
        std::fs::create_dir_all(home.join(".claude")).unwrap();
        std::fs::create_dir_all(cwd.join(".claude").join("rules")).unwrap();
        std::fs::write(home.join(".claude").join("CLAUDE.md"), "global do usuário").unwrap();
        std::fs::write(cwd.join("CLAUDE.md"), "instrução da sessão").unwrap();
        std::fs::write(
            cwd.join(".claude").join("rules").join("a.md"),
            "regra incondicional",
        )
        .unwrap();
        std::fs::write(
            cwd.join(".claude").join("rules").join("b.md"),
            "---\npaths: src/**\n---\nregra condicional",
        )
        .unwrap();

        let files = get_memory_files(&config(&cwd, &home, &[SettingSource::Project]));
        let contents: Vec<&str> = files.iter().map(|f| f.content.as_str()).collect();
        assert_eq!(contents, vec!["instrução da sessão", "regra incondicional"]);
        assert!(files.iter().all(|f| f.kind == MemoryType::Project));
    }

    #[test]
    fn comentario_html_de_bloco_some_do_conteudo() {
        let raw = "<!-- BEGIN:user-context 123 -->\n# Contexto\n\n- **Nome:** Ana\n\nResponda.\n<!-- END:user-context -->\n";
        assert_eq!(
            strip_html_comments(raw),
            "# Contexto\n\n- **Nome:** Ana\n\nResponda.\n"
        );
        let with_residue = "<!-- nota --> texto depois\n";
        assert_eq!(strip_html_comments(with_residue), " texto depois\n");
        let inside_code = "```\n<!-- fica -->\n```\n";
        assert_eq!(strip_html_comments(inside_code), inside_code);
    }

    #[test]
    fn include_resolve_relativo_e_ignora_codigo() {
        let base = Path::new("/p/CLAUDE.md");
        let home = Path::new("/h");
        let found = include_paths(
            "Veja @./a.md e `@b.md`\n```\n@c.md\n```\nemail j@x.com",
            base,
            home,
        );
        assert_eq!(found, vec![PathBuf::from("/p/a.md")]);
    }

    #[test]
    fn texto_do_contexto_e_o_do_cli() {
        let ctx = vec![
            ("claudeMd".to_string(), "X".to_string()),
            (
                "currentDate".to_string(),
                "Today's date is 2026-09-23.".to_string(),
            ),
        ];
        assert_eq!(
            user_context_text(&ctx).unwrap(),
            "<system-reminder>\nAs you answer the user's questions, you can use the following context:\n# claudeMd\nX\n# currentDate\nToday's date is 2026-09-23.\n\n      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.\n</system-reminder>\n"
        );
    }

    #[test]
    fn claude_mds_tem_cabecalho_e_descricao_por_tipo() {
        let files = vec![MemoryFile {
            path: PathBuf::from("/w/CLAUDE.md"),
            kind: MemoryType::Project,
            content: "  corpo  \n".to_string(),
            parent: None,
            conditional: false,
        }];
        assert_eq!(
            get_claude_mds(&files),
            format!("{MEMORY_INSTRUCTION_PROMPT}\n\nContents of /w/CLAUDE.md (project instructions, checked into the codebase):\n\ncorpo")
        );
    }

    #[test]
    fn memoria_automatica_entra_quando_existe() {
        let tmp = tempfile::tempdir().unwrap();
        let home = tmp.path().join("home");
        let cwd = tmp.path().join("w");
        std::fs::create_dir_all(&cwd).unwrap();
        let cfg = config(&cwd, &home, &[SettingSource::Project]);
        let entry = auto_memory_entrypoint(&cfg);
        std::fs::create_dir_all(entry.parent().unwrap()).unwrap();
        std::fs::write(&entry, "- lembrete\n").unwrap();
        let files = get_memory_files(&cfg);
        assert_eq!(files.last().map(|f| f.kind), Some(MemoryType::AutoMem));
        assert_eq!(files.last().map(|f| f.content.as_str()), Some("- lembrete"));
    }

    #[test]
    fn regra_incondicional_nao_arrasta_include_condicional() {
        let tmp = tempfile::tempdir().unwrap();
        let home = tmp.path().join("home");
        let cwd = tmp.path().join("w");
        let rules = cwd.join(".claude").join("rules");
        std::fs::create_dir_all(&rules).unwrap();
        std::fs::write(rules.join("a.md"), "regra @./parcial.md @./geral.md").unwrap();
        std::fs::write(
            rules.join("parcial.md"),
            "---\npaths: [\"src/**\"]\n---\nsó para src",
        )
        .unwrap();
        std::fs::write(rules.join("geral.md"), "vale sempre").unwrap();
        let files = get_memory_files(&config(&cwd, &home, &[SettingSource::Project]));
        let contents: Vec<&str> = files.iter().map(|f| f.content.as_str()).collect();
        // `a.md` traz as duas por include; o filtro `!f.globs` tira a
        // condicional e mantém a outra, que depois não se repete.
        assert_eq!(
            contents,
            vec!["regra @./parcial.md @./geral.md", "vale sempre"]
        );
    }

    #[test]
    fn sem_fonte_nenhuma_so_entram_gerenciada_e_memoria_automatica() {
        let tmp = tempfile::tempdir().unwrap();
        let home = tmp.path().join("home");
        let cwd = tmp.path().join("w");
        std::fs::create_dir_all(home.join("managed")).unwrap();
        std::fs::create_dir_all(home.join(".claude")).unwrap();
        std::fs::create_dir_all(&cwd).unwrap();
        std::fs::write(home.join("managed").join("CLAUDE.md"), "da empresa").unwrap();
        std::fs::write(home.join(".claude").join("CLAUDE.md"), "do usuário").unwrap();
        std::fs::write(cwd.join("CLAUDE.md"), "do projeto").unwrap();
        std::fs::write(cwd.join("CLAUDE.local.md"), "local").unwrap();
        let cfg = config(&cwd, &home, &[]);
        let entry = auto_memory_entrypoint(&cfg);
        std::fs::create_dir_all(entry.parent().unwrap()).unwrap();
        std::fs::write(&entry, "lembrete").unwrap();
        let kinds: Vec<MemoryType> = get_memory_files(&cfg).iter().map(|f| f.kind).collect();
        assert_eq!(kinds, vec![MemoryType::Managed, MemoryType::AutoMem]);
    }

    #[test]
    fn worktree_usa_a_raiz_do_repositorio_principal_na_memoria_automatica() {
        let tmp = tempfile::tempdir().unwrap();
        let tmp_path = std::fs::canonicalize(tmp.path()).unwrap();
        let main = tmp_path.join("main");
        let wt = tmp_path.join("wt");
        let wt_git = main.join(".git").join("worktrees").join("wt");
        std::fs::create_dir_all(&wt_git).unwrap();
        std::fs::create_dir_all(&wt).unwrap();
        std::fs::write(wt.join(".git"), format!("gitdir: {}\n", wt_git.display())).unwrap();
        std::fs::write(wt_git.join("commondir"), "../..\n").unwrap();
        std::fs::write(
            wt_git.join("gitdir"),
            format!("{}\n", wt.join(".git").display()),
        )
        .unwrap();
        assert_eq!(canonical_git_root(&wt), main);

        let cfg = config(&wt.join("sub"), &tmp_path.join("home"), &[]);
        let key = crate::internal::sessions::sanitize_path(&main.to_string_lossy());
        assert!(auto_memory_entrypoint(&cfg)
            .to_string_lossy()
            .contains(&key));
    }

    #[test]
    fn override_de_memoria_fixa_o_diretorio() {
        assert_eq!(validate_memory_path("relativo/x"), None);
        assert_eq!(validate_memory_path("/"), None);
        assert_eq!(validate_memory_path("//rede/x"), None);
        let mut cfg = config(Path::new("/w"), Path::new("/h"), &[]);
        cfg.auto_memory_override = validate_memory_path("/m/dir/");
        assert_eq!(
            auto_memory_entrypoint(&cfg),
            PathBuf::from("/m/dir/MEMORY.md")
        );
    }

    #[test]
    fn contexto_memoizado_so_rele_depois_do_clear() {
        let tmp = tempfile::tempdir().unwrap();
        let home = tmp.path().join("home");
        let cwd = tmp.path().join("w");
        std::fs::create_dir_all(&cwd).unwrap();
        std::fs::write(cwd.join("CLAUDE.md"), "versão 1").unwrap();
        let mut cfg = config(&cwd, &home, &[SettingSource::Project]);
        cfg.auto_memory_enabled = false;
        let env = std::collections::HashMap::from([(
            "CLAUDE_CODE_OVERRIDE_DATE".to_string(),
            "2026-09-23".to_string(),
        )]);
        let cache = UserContextCache::new(cfg, env);
        let text = |m: Option<ApiMessage>| serde_json::to_string(&m.unwrap()).unwrap();
        let first = text(cache.message());
        assert!(first.contains("versão 1"));
        assert!(first.contains("Today's date is 2026-09-23."));
        std::fs::write(cwd.join("CLAUDE.md"), "versão 2").unwrap();
        assert_eq!(text(cache.message()), first);
        cache.clear();
        assert!(text(cache.message()).contains("versão 2"));
    }
}
