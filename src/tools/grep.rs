//! Grep: busca de conteúdo com ripgrep, com paridade com o `GrepTool` do CLI
//! 2.1.90 (`tools/GrepTool/GrepTool.js`, `utils/ripgrep.js`).
//!
//! Os argumentos do `rg` são montados como no JS (`--hidden`, exclusão dos
//! diretórios de VCS, `--max-columns 500`, `-l`/`-c`/`-n`, contexto, `-U
//! --multiline-dotall`, `--type`, `--glob` com a divisão por espaço e
//! vírgula), a saída passa pelo `applyHeadLimit` (250 por padrão,
//! `head_limit: 0` sem limite, `offset`), os caminhos viram relativos ao cwd,
//! `files_with_matches` vem ordenado pela modificação (mais recente
//! primeiro), e o texto e o `tool_use_result` são os do JS.
//!
//! Sem `rg` no PATH, a busca é feita em Rust com o mesmo motor de regex que
//! o ripgrep usa (a crate `regex`) e o mesmo formato de saída; nesse modo o
//! `.gitignore` não é aplicado.

use std::path::{Path, PathBuf};
use std::sync::OnceLock;

use async_trait::async_trait;
use serde_json::{json, Map, Value};

use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::fs_support::{self as fs, RgGlob, RipgrepOutcome};
use crate::tools::permission::{PermissionResult, PermissionRules};
use crate::tools::schema_validation::{semantic_boolean, semantic_number};

/// Search file contents with regex.
pub struct GrepTool;

/// `DEFAULT_HEAD_LIMIT`.
const DEFAULT_HEAD_LIMIT: usize = 250;

/// `VCS_DIRECTORIES_TO_EXCLUDE`.
const VCS_DIRECTORIES: &[&str] = &[".git", ".svn", ".hg", ".bzr", ".jj", ".sl"];

fn description_text() -> &'static str {
    static TEXT: OnceLock<String> = OnceLock::new();
    TEXT.get_or_init(|| {
        crate::tools::fs_prompts::expand(crate::tools::fs_prompts::GREP_DESCRIPTION)
    })
}

fn schema_value() -> &'static Value {
    static SCHEMA: OnceLock<Value> = OnceLock::new();
    SCHEMA.get_or_init(|| crate::tools::fs_prompts::schema(crate::tools::fs_prompts::GREP_SCHEMA))
}

/// O número como o `toString()` do JS.
fn js_number(value: &Value) -> Option<String> {
    let n = value.as_f64()?;
    Some(if n.fract() == 0.0 && n.abs() < 1e21 {
        format!("{}", n as i64)
    } else {
        format!("{n}")
    })
}

/// `applyHeadLimit`.
fn apply_head_limit(
    items: Vec<String>,
    limit: Option<i64>,
    offset: usize,
) -> (Vec<String>, Option<usize>) {
    if limit == Some(0) {
        return (items.into_iter().skip(offset).collect(), None);
    }
    let effective = limit
        .map(|l| l.max(0) as usize)
        .unwrap_or(DEFAULT_HEAD_LIMIT);
    let total = items.len();
    let sliced: Vec<String> = items.into_iter().skip(offset).take(effective).collect();
    let truncated = total.saturating_sub(offset) > effective;
    (sliced, if truncated { Some(effective) } else { None })
}

/// `formatLimitInfo`.
fn format_limit_info(applied_limit: Option<usize>, applied_offset: usize) -> String {
    let mut parts = Vec::new();
    if let Some(limit) = applied_limit {
        parts.push(format!("limit: {limit}"));
    }
    if applied_offset > 0 {
        parts.push(format!("offset: {applied_offset}"));
    }
    parts.join(", ")
}

/// As opções já interpretadas.
struct GrepOptions {
    pattern: String,
    glob: Option<String>,
    file_type: Option<String>,
    output_mode: String,
    before: Option<Value>,
    after: Option<Value>,
    context_c: Option<Value>,
    context: Option<Value>,
    line_numbers: bool,
    case_insensitive: bool,
    head_limit: Option<i64>,
    offset: usize,
    multiline: bool,
    /// Os `--glob !padrão` das regras deny de `Read(...)`, depois dos globs
    /// do input, como o JS monta.
    ignore_globs: Vec<String>,
}

impl GrepOptions {
    fn from_input(input: &Value) -> Self {
        let get = |k: &str| input.get(k).filter(|v| !v.is_null()).cloned();
        Self {
            pattern: input["pattern"].as_str().unwrap_or_default().to_string(),
            glob: input
                .get("glob")
                .and_then(Value::as_str)
                .map(str::to_string),
            file_type: input
                .get("type")
                .and_then(Value::as_str)
                .map(str::to_string),
            output_mode: input
                .get("output_mode")
                .and_then(Value::as_str)
                .unwrap_or("files_with_matches")
                .to_string(),
            before: get("-B"),
            after: get("-A"),
            context_c: get("-C"),
            context: get("context"),
            line_numbers: input.get("-n").and_then(Value::as_bool).unwrap_or(true),
            case_insensitive: input.get("-i").and_then(Value::as_bool).unwrap_or(false),
            head_limit: input
                .get("head_limit")
                .and_then(Value::as_f64)
                .map(|n| n as i64),
            offset: input
                .get("offset")
                .and_then(Value::as_f64)
                .map(|n| n.max(0.0) as usize)
                .unwrap_or(0),
            multiline: input
                .get("multiline")
                .and_then(Value::as_bool)
                .unwrap_or(false),
            ignore_globs: Vec::new(),
        }
    }

    /// Os padrões de `--glob` como o JS divide.
    fn glob_patterns(&self) -> Vec<String> {
        let Some(glob) = &self.glob else {
            return Vec::new();
        };
        let mut out = Vec::new();
        for raw in glob.split_whitespace() {
            if raw.contains('{') && raw.contains('}') {
                out.push(raw.to_string());
            } else {
                out.extend(raw.split(',').filter(|s| !s.is_empty()).map(str::to_string));
            }
        }
        out.into_iter().filter(|s| !s.is_empty()).collect()
    }

    /// (antes, depois) de contexto, só no modo `content`.
    fn context_lines(&self) -> (usize, usize) {
        if self.output_mode != "content" {
            return (0, 0);
        }
        let n = |v: &Option<Value>| {
            v.as_ref()
                .and_then(Value::as_f64)
                .map(|x| x.max(0.0) as usize)
        };
        if let Some(c) = n(&self.context).or_else(|| n(&self.context_c)) {
            return (c, c);
        }
        (n(&self.before).unwrap_or(0), n(&self.after).unwrap_or(0))
    }

    fn rg_args(&self) -> Vec<String> {
        let mut args: Vec<String> = vec!["--hidden".into()];
        for dir in VCS_DIRECTORIES {
            args.push("--glob".into());
            args.push(format!("!{dir}"));
        }
        args.push("--max-columns".into());
        args.push("500".into());
        if self.multiline {
            args.push("-U".into());
            args.push("--multiline-dotall".into());
        }
        if self.case_insensitive {
            args.push("-i".into());
        }
        match self.output_mode.as_str() {
            "files_with_matches" => args.push("-l".into()),
            "count" => args.push("-c".into()),
            _ => {}
        }
        if self.line_numbers && self.output_mode == "content" {
            args.push("-n".into());
        }
        if self.output_mode == "content" {
            if let Some(c) = self.context.as_ref().and_then(js_number) {
                args.push("-C".into());
                args.push(c);
            } else if let Some(c) = self.context_c.as_ref().and_then(js_number) {
                args.push("-C".into());
                args.push(c);
            } else {
                if let Some(b) = self.before.as_ref().and_then(js_number) {
                    args.push("-B".into());
                    args.push(b);
                }
                if let Some(a) = self.after.as_ref().and_then(js_number) {
                    args.push("-A".into());
                    args.push(a);
                }
            }
        }
        if self.pattern.starts_with('-') {
            args.push("-e".into());
        }
        args.push(self.pattern.clone());
        if let Some(t) = &self.file_type {
            args.push("--type".into());
            args.push(t.clone());
        }
        for g in self.glob_patterns() {
            args.push("--glob".into());
            args.push(g);
        }
        for g in &self.ignore_globs {
            args.push("--glob".into());
            args.push(g.clone());
        }
        args
    }
}

// ---------------------------------------------------------------------------
// Busca sem ripgrep (mesmo formato de saída do rg)
// ---------------------------------------------------------------------------

/// As extensões dos tipos mais comuns do `rg --type-list`.
fn type_globs(name: &str) -> Option<&'static [&'static str]> {
    Some(match name {
        "js" => &["*.js", "*.jsx", "*.mjs", "*.cjs", "*.vue"],
        "ts" => &["*.ts", "*.tsx", "*.cts", "*.mts"],
        "py" => &["*.py", "*.pyi"],
        "rust" => &["*.rs"],
        "go" => &["*.go"],
        "java" => &["*.java", "*.jsp", "*.jspx", "*.properties"],
        "c" => &["*.[chH]", "*.[chH].in", "*.cats"],
        "cpp" => &["*.[ChH]", "*.cc", "*.[ch]pp", "*.[ch]xx", "*.hh", "*.inl"],
        "cs" => &["*.cs"],
        "rb" | "ruby" => &["*.rb", "*.gemspec", "Gemfile", "Rakefile"],
        "php" => &["*.php", "*.php3", "*.php4", "*.php5", "*.phtml"],
        "sh" => &["*.bash", "*.sh", "*.zsh", ".bashrc", ".zshrc", ".profile"],
        "md" | "markdown" => &[
            "*.markdown",
            "*.md",
            "*.mdown",
            "*.mdwn",
            "*.mkd",
            "*.mkdn",
            "*.mdx",
        ],
        "json" => &["*.json", "*.jsonl", "*.geojson"],
        "yaml" => &["*.yaml", "*.yml"],
        "toml" => &["*.toml", "Cargo.lock"],
        "html" => &["*.htm", "*.html", "*.ejs"],
        "css" => &["*.css", "*.scss"],
        "sql" => &["*.sql", "*.psql"],
        "kotlin" => &["*.kt", "*.kts"],
        "swift" => &["*.swift"],
        "txt" => &["*.txt"],
        "xml" => &["*.xml", "*.xml.dist", "*.xsd", "*.xsl", "*.xslt"],
        _ => return None,
    })
}

fn is_binary(bytes: &[u8]) -> bool {
    bytes.iter().take(8192).any(|b| *b == 0)
}

/// Emula o `rg` para os modos do Grep.
fn search_without_ripgrep(opts: &GrepOptions, target: &Path) -> Result<Vec<String>, String> {
    let mut pattern = opts.pattern.clone();
    if opts.multiline {
        pattern = format!("(?s){pattern}");
    }
    if opts.case_insensitive {
        pattern = format!("(?i){pattern}");
    }
    let regex = regex::Regex::new(&pattern).map_err(|e| format!("rg: regex parse error:\n{e}"))?;
    let mut globs: Vec<RgGlob> = VCS_DIRECTORIES
        .iter()
        .filter_map(|d| RgGlob::new(&format!("!{d}")))
        .collect();
    for g in opts.glob_patterns().iter().chain(opts.ignore_globs.iter()) {
        if let Some(glob) = RgGlob::new(g) {
            globs.push(glob);
        }
    }
    let type_filter: Option<Vec<RgGlob>> = match &opts.file_type {
        Some(t) => Some(
            type_globs(t)
                .ok_or_else(|| format!("rg: unrecognized file type: {t}"))?
                .iter()
                .filter_map(|g| RgGlob::new(g))
                .collect(),
        ),
        None => None,
    };
    let single_file = target.is_file();
    let target_text = target.to_string_lossy().to_string();
    let (before, after) = opts.context_lines();
    let mut out: Vec<String> = Vec::new();
    let mut files = fs::walk_files(target, VCS_DIRECTORIES);
    files.sort_by(|a, b| a.1.cmp(&b.1));
    for (path, rel) in files {
        if !single_file {
            if !fs::rg_globs_allow(&globs, &rel) {
                continue;
            }
            if let Some(types) = &type_filter {
                if !types
                    .iter()
                    .any(|g| fs::rg_globs_allow(std::slice::from_ref(g), &rel))
                {
                    continue;
                }
            }
        }
        let Ok(bytes) = std::fs::read(&path) else {
            continue;
        };
        if is_binary(&bytes) {
            continue;
        }
        let content = String::from_utf8_lossy(&bytes).into_owned();
        let display = if single_file {
            target_text.clone()
        } else {
            format!("{}/{rel}", target_text.trim_end_matches('/'))
        };
        let lines: Vec<&str> = content.split('\n').collect();
        let line_count = if content.ends_with('\n') {
            lines.len() - 1
        } else {
            lines.len()
        };
        // Linhas que casam (no multiline, toda linha coberta por um match).
        let mut matched = vec![false; line_count];
        let mut match_count = 0usize;
        if opts.multiline {
            let mut starts = vec![0usize];
            for (i, b) in content.bytes().enumerate() {
                if b == b'\n' {
                    starts.push(i + 1);
                }
            }
            for m in regex.find_iter(&content) {
                match_count += 1;
                let first = starts.partition_point(|s| *s <= m.start()) - 1;
                let last_byte = if m.end() > m.start() {
                    m.end() - 1
                } else {
                    m.start()
                };
                let last = starts.partition_point(|s| *s <= last_byte) - 1;
                for flag in matched
                    .iter_mut()
                    .take((last + 1).min(line_count))
                    .skip(first)
                {
                    *flag = true;
                }
            }
        } else {
            for (i, line) in lines.iter().take(line_count).enumerate() {
                let n = regex.find_iter(line).count();
                if n > 0 {
                    matched[i] = true;
                    match_count += n;
                }
            }
        }
        if match_count == 0 {
            continue;
        }
        let prefix = |sep: char, line_no: usize| -> String {
            let mut p = String::new();
            if !single_file {
                p.push_str(&display);
                p.push(sep);
            }
            if opts.line_numbers {
                p.push_str(&line_no.to_string());
                p.push(sep);
            }
            p
        };
        match opts.output_mode.as_str() {
            "files_with_matches" => out.push(display.clone()),
            "count" => {
                let lines_matched = matched.iter().filter(|m| **m).count();
                if single_file {
                    out.push(lines_matched.to_string());
                } else {
                    out.push(format!("{display}:{lines_matched}"));
                }
            }
            _ => {
                let mut shown = vec![false; line_count];
                for (i, _) in matched.iter().enumerate().filter(|(_, m)| **m) {
                    let from = i.saturating_sub(before);
                    let to = (i + after).min(line_count.saturating_sub(1));
                    for flag in shown.iter_mut().take(to + 1).skip(from) {
                        *flag = true;
                    }
                }
                let mut last_shown: Option<usize> = None;
                for i in 0..line_count {
                    if !shown[i] {
                        continue;
                    }
                    if (before > 0 || after > 0) && last_shown.is_some_and(|l| l + 1 < i) {
                        out.push("--".to_string());
                    }
                    let sep = if matched[i] { ':' } else { '-' };
                    let text = lines[i].strip_suffix('\r').unwrap_or(lines[i]);
                    let body = if text.len() > 500 {
                        let n = regex.find_iter(text).count();
                        format!("[Omitted long line with {n} matches]")
                    } else {
                        text.to_string()
                    };
                    out.push(format!("{}{body}", prefix(sep, i + 1)));
                    last_shown = Some(i);
                }
                if before > 0 || after > 0 {
                    // O rg separa grupos de arquivos diferentes com `--`.
                    out.push("--".to_string());
                }
            }
        }
    }
    if opts.output_mode == "content"
        && (before > 0 || after > 0)
        && out.last().map(|l| l == "--").unwrap_or(false)
    {
        out.pop();
    }
    Ok(out)
}

#[async_trait]
impl Tool for GrepTool {
    fn name(&self) -> &str {
        "Grep"
    }

    fn description(&self) -> &str {
        description_text()
    }

    fn input_schema(&self) -> Value {
        schema_value().clone()
    }

    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    fn max_result_size_chars(&self) -> Option<usize> {
        Some(20_000)
    }

    /// `semanticNumber`/`semanticBoolean` dos campos numéricos e booleanos.
    fn preprocess_input(&self, input: Value) -> Value {
        let Value::Object(mut map) = input else {
            return input;
        };
        for key in ["-B", "-A", "-C", "context", "head_limit", "offset"] {
            if let Some(v) = map.get(key).cloned() {
                map.insert(key.to_string(), semantic_number(&v));
            }
        }
        for key in ["-n", "-i", "multiline"] {
            if let Some(v) = map.get(key).cloned() {
                map.insert(key.to_string(), semantic_boolean(&v));
            }
        }
        Value::Object(map)
    }

    async fn validate_input(&self, input: &Value, ctx: &ToolContext) -> Result<(), String> {
        let Some(path) = input
            .get("path")
            .and_then(Value::as_str)
            .filter(|p| !p.is_empty())
        else {
            return Ok(());
        };
        let absolute = fs::absolute(path, &ctx.cwd());
        let text = absolute.to_string_lossy();
        if text.starts_with("\\\\") || text.starts_with("//") {
            return Ok(());
        }
        match std::fs::metadata(&absolute) {
            Ok(_) => Ok(()),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                let mut message = format!(
                    "Path does not exist: {path}. {} {}.",
                    fs::FILE_NOT_FOUND_CWD_NOTE,
                    ctx.cwd().display()
                );
                if let Some(suggestion) = fs::suggest_path_under_cwd(&absolute, &ctx.cwd()) {
                    message.push_str(&format!(" Did you mean {suggestion}?"));
                }
                Err(message)
            }
            Err(e) => Err(e.to_string()),
        }
    }

    async fn check_permissions(
        &self,
        input: &Value,
        ctx: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        // `getPath` do Grep: o path cru, ou o cwd.
        let path = match input
            .get("path")
            .and_then(Value::as_str)
            .filter(|p| !p.is_empty())
        {
            Some(p) => p.to_string(),
            None => ctx.cwd().to_string_lossy().to_string(),
        };
        crate::tools::permission::check_read_permission(&path, ctx, rules)
    }

    async fn execute(&self, input: Value, ctx: &ToolContext) -> ToolResult {
        let mut opts = GrepOptions::from_input(&input);
        let cwd = &ctx.cwd();
        // As regras deny de `Read(...)` viram `--glob !padrão` relativos ao
        // cwd corrente (`getFileReadIgnorePatterns`); padrão sem barra no
        // começo casa em qualquer nível (`!**/padrão`).
        opts.ignore_globs = crate::tools::permission::file_read_ignore_patterns(ctx, cwd)
            .into_iter()
            .map(|p| {
                if p.starts_with('/') {
                    format!("!{p}")
                } else {
                    format!("!**/{p}")
                }
            })
            .collect();
        let target: PathBuf = match input
            .get("path")
            .and_then(Value::as_str)
            .filter(|p| !p.is_empty())
        {
            Some(p) => fs::absolute(p, cwd),
            None => cwd.clone(),
        };
        let results = match fs::ripgrep_path() {
            Some(rg) => {
                match fs::run_ripgrep(&rg, &opts.rg_args(), &target, &ctx.working_directory).await {
                    RipgrepOutcome::Lines(lines) => lines,
                    RipgrepOutcome::Error(e) => return ToolResult::error(e),
                }
            }
            None => match search_without_ripgrep(&opts, &target) {
                Ok(lines) => lines,
                Err(e) => return ToolResult::error(e),
            },
        };

        match opts.output_mode.as_str() {
            "content" => {
                let (limited, applied_limit) =
                    apply_head_limit(results, opts.head_limit, opts.offset);
                let final_lines: Vec<String> = limited
                    .into_iter()
                    .map(|line| match line.find(':') {
                        Some(idx) if idx > 0 => format!(
                            "{}{}",
                            fs::to_relative_path(&line[..idx], cwd),
                            &line[idx..]
                        ),
                        _ => line,
                    })
                    .collect();
                let content = final_lines.join("\n");
                let limit_info = format_limit_info(applied_limit, opts.offset);
                let shown = if content.is_empty() {
                    "No matches found".to_string()
                } else {
                    content.clone()
                };
                let text = if limit_info.is_empty() {
                    shown
                } else {
                    format!("{shown}\n\n[Showing results with pagination = {limit_info}]")
                };
                let mut data = Map::new();
                data.insert("mode".into(), json!("content"));
                data.insert("numFiles".into(), json!(0));
                data.insert("filenames".into(), json!([]));
                data.insert("content".into(), json!(content));
                data.insert("numLines".into(), json!(final_lines.len()));
                if let Some(limit) = applied_limit {
                    data.insert("appliedLimit".into(), json!(limit));
                }
                if opts.offset > 0 {
                    data.insert("appliedOffset".into(), json!(opts.offset));
                }
                ToolResult::text(text).with_tool_use_result(Value::Object(data))
            }
            "count" => {
                let (limited, applied_limit) =
                    apply_head_limit(results, opts.head_limit, opts.offset);
                let final_lines: Vec<String> = limited
                    .into_iter()
                    .map(|line| match line.rfind(':') {
                        Some(idx) if idx > 0 => format!(
                            "{}{}",
                            fs::to_relative_path(&line[..idx], cwd),
                            &line[idx..]
                        ),
                        _ => line,
                    })
                    .collect();
                let (mut total, mut files) = (0u64, 0u64);
                for line in &final_lines {
                    if let Some(idx) = line.rfind(':').filter(|i| *i > 0) {
                        let digits: String = line[idx + 1..]
                            .trim_start()
                            .chars()
                            .take_while(|c| c.is_ascii_digit())
                            .collect();
                        if let Ok(n) = digits.parse::<u64>() {
                            total += n;
                            files += 1;
                        }
                    }
                }
                let content = final_lines.join("\n");
                let limit_info = format_limit_info(applied_limit, opts.offset);
                let raw = if content.is_empty() {
                    "No matches found".to_string()
                } else {
                    content.clone()
                };
                let text = format!(
                    "{raw}\n\nFound {total} total {} across {files} {}.{}",
                    if total == 1 {
                        "occurrence"
                    } else {
                        "occurrences"
                    },
                    if files == 1 { "file" } else { "files" },
                    if limit_info.is_empty() {
                        String::new()
                    } else {
                        format!(" with pagination = {limit_info}")
                    }
                );
                let mut data = Map::new();
                data.insert("mode".into(), json!("count"));
                data.insert("numFiles".into(), json!(files));
                data.insert("filenames".into(), json!([]));
                data.insert("content".into(), json!(content));
                data.insert("numMatches".into(), json!(total));
                if let Some(limit) = applied_limit {
                    data.insert("appliedLimit".into(), json!(limit));
                }
                if opts.offset > 0 {
                    data.insert("appliedOffset".into(), json!(opts.offset));
                }
                ToolResult::text(text).with_tool_use_result(Value::Object(data))
            }
            _ => {
                let mut with_time: Vec<(f64, String)> = results
                    .into_iter()
                    .map(|p| {
                        let mtime = std::fs::metadata(&p)
                            .and_then(|m| m.modified())
                            .ok()
                            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                            .map(|d| d.as_secs_f64() * 1000.0)
                            .unwrap_or(0.0);
                        (mtime, p)
                    })
                    .collect();
                with_time.sort_by(|a, b| {
                    b.0.partial_cmp(&a.0)
                        .unwrap_or(std::cmp::Ordering::Equal)
                        .then_with(|| crate::tools::framework::locale_compare(&a.1, &b.1))
                });
                let sorted: Vec<String> = with_time.into_iter().map(|(_, p)| p).collect();
                let (limited, applied_limit) =
                    apply_head_limit(sorted, opts.head_limit, opts.offset);
                let filenames: Vec<String> = limited
                    .iter()
                    .map(|p| fs::to_relative_path(p, cwd))
                    .collect();
                let limit_info = format_limit_info(applied_limit, opts.offset);
                let text = if filenames.is_empty() {
                    "No files found".to_string()
                } else {
                    format!(
                        "Found {} {}{}\n{}",
                        filenames.len(),
                        if filenames.len() == 1 {
                            "file"
                        } else {
                            "files"
                        },
                        if limit_info.is_empty() {
                            String::new()
                        } else {
                            format!(" {limit_info}")
                        },
                        filenames.join("\n")
                    )
                };
                let mut data = Map::new();
                data.insert("mode".into(), json!("files_with_matches"));
                data.insert("filenames".into(), json!(filenames));
                data.insert("numFiles".into(), json!(filenames.len()));
                if let Some(limit) = applied_limit {
                    data.insert("appliedLimit".into(), json!(limit));
                }
                if opts.offset > 0 {
                    data.insert("appliedOffset".into(), json!(opts.offset));
                }
                ToolResult::text(text).with_tool_use_result(Value::Object(data))
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn fixture() -> tempfile::TempDir {
        let dir = tempfile::tempdir().unwrap();
        std::fs::write(dir.path().join("a.txt"), "alpha\nbeta\ngamma\n").unwrap();
        std::fs::create_dir(dir.path().join("sub")).unwrap();
        std::fs::write(dir.path().join("sub").join("b.rs"), "fn alpha() {}\n").unwrap();
        dir
    }

    fn ctx(dir: &Path) -> ToolContext {
        ToolContext {
            working_directory: dir.to_path_buf(),
            ..Default::default()
        }
    }

    #[tokio::test]
    async fn files_with_matches_is_the_default() {
        let dir = fixture();
        let result = GrepTool
            .execute(json!({"pattern": "alpha"}), &ctx(dir.path()))
            .await;
        let text = result.text_content();
        assert!(text.starts_with("Found 2 files\n"), "{text}");
        assert!(
            text.contains("a.txt") && text.contains("sub/b.rs"),
            "{text}"
        );
        let data = result.tool_use_result.unwrap();
        assert_eq!(data["mode"], "files_with_matches");
        assert_eq!(data["numFiles"], 2);
    }

    #[tokio::test]
    async fn content_mode_uses_relative_paths_and_line_numbers() {
        let dir = fixture();
        let result = GrepTool
            .execute(
                json!({"pattern": "beta", "output_mode": "content"}),
                &ctx(dir.path()),
            )
            .await;
        assert_eq!(result.text_content(), "a.txt:2:beta");
    }

    #[tokio::test]
    async fn no_match_texts_follow_the_cli() {
        let dir = fixture();
        let c = ctx(dir.path());
        assert_eq!(
            GrepTool
                .execute(json!({"pattern": "zzz"}), &c)
                .await
                .text_content(),
            "No files found"
        );
        assert_eq!(
            GrepTool
                .execute(json!({"pattern": "zzz", "output_mode": "content"}), &c)
                .await
                .text_content(),
            "No matches found"
        );
    }

    #[tokio::test]
    async fn count_mode_sums_occurrences() {
        let dir = fixture();
        let result = GrepTool
            .execute(
                json!({"pattern": "a", "output_mode": "count", "glob": "*.txt"}),
                &ctx(dir.path()),
            )
            .await;
        assert_eq!(
            result.text_content(),
            "a.txt:3\n\nFound 3 total occurrences across 1 file."
        );
    }

    #[test]
    fn head_limit_follows_apply_head_limit() {
        let items: Vec<String> = (0..5).map(|i| i.to_string()).collect();
        assert_eq!(
            apply_head_limit(items.clone(), Some(2), 1),
            (vec!["1".into(), "2".into()], Some(2))
        );
        assert_eq!(apply_head_limit(items.clone(), Some(0), 3).0.len(), 2);
        assert_eq!(apply_head_limit(items, None, 0).1, None);
    }

    #[test]
    fn fallback_search_matches_rg_output_format() {
        let dir = fixture();
        let opts = GrepOptions::from_input(&json!({
            "pattern": "beta", "output_mode": "content", "-C": 1
        }));
        let lines = search_without_ripgrep(&opts, dir.path()).unwrap();
        let base = dir.path().to_string_lossy();
        assert_eq!(
            lines,
            vec![
                format!("{base}/a.txt-1-alpha"),
                format!("{base}/a.txt:2:beta"),
                format!("{base}/a.txt-3-gamma"),
            ]
        );
    }
}
