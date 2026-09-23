//! Peças compartilhadas por Bash, Edit, Write, Glob, Grep e NotebookEdit,
//! portadas do CLI 2.1.90.
//!
//! - o diff de linhas do `jsdiff` (`diffLines` + `structuredPatch`, com a
//!   mesma escolha de caminho do Myers, `services/api/sessionIngress/*.js`),
//!   que produz o `structuredPatch` do `tool_use_result` de Edit e Write;
//! - a leitura com metadados (`readFileSyncWithMetadata` de
//!   `utils/fileRead.js`) e a escrita que preserva codificação e fim de linha
//!   (`writeTextContent` de `utils/file.js`);
//! - as sugestões de caminho das mensagens de "não existe"
//!   (`findSimilarFile`, `suggestPathUnderCwd`) e o `toRelativePath`;
//! - a normalização de aspas do Edit (`tools/FileEditTool/utils.js`);
//! - a chamada ao ripgrep (`utils/ripgrep.js`).

use std::path::{Path, PathBuf};
use std::rc::Rc;

use serde_json::{json, Value};

// ---------------------------------------------------------------------------
// Diff (jsdiff)
// ---------------------------------------------------------------------------

/// Um componente do resultado do diff.
#[derive(Debug, Clone)]
struct Component {
    count: usize,
    added: bool,
    removed: bool,
    previous: Option<Rc<Component>>,
}

#[derive(Clone)]
struct DiffPath {
    old_pos: isize,
    last: Option<Rc<Component>>,
}

/// Um trecho do resultado de `diffLines`.
#[derive(Debug, Clone)]
pub(crate) struct Change {
    pub value: String,
    pub added: bool,
    pub removed: bool,
}

/// `lineDiff.tokenize`: cada linha com o seu `\n`.
fn tokenize_lines(value: &str) -> Vec<String> {
    let mut out = Vec::new();
    let mut current = String::new();
    for ch in value.chars() {
        current.push(ch);
        if ch == '\n' {
            out.push(std::mem::take(&mut current));
        }
    }
    if !current.is_empty() {
        out.push(current);
    }
    out
}

fn add_to_path(path: &DiffPath, added: bool, removed: bool, old_pos_inc: isize) -> DiffPath {
    let last = path.last.clone();
    match &last {
        Some(l) if l.added == added && l.removed == removed => DiffPath {
            old_pos: path.old_pos + old_pos_inc,
            last: Some(Rc::new(Component {
                count: l.count + 1,
                added,
                removed,
                previous: l.previous.clone(),
            })),
        },
        _ => DiffPath {
            old_pos: path.old_pos + old_pos_inc,
            last: Some(Rc::new(Component {
                count: 1,
                added,
                removed,
                previous: last,
            })),
        },
    }
}

fn extract_common(path: &mut DiffPath, new: &[String], old: &[String], diagonal: isize) -> isize {
    let new_len = new.len() as isize;
    let old_len = old.len() as isize;
    let mut old_pos = path.old_pos;
    let mut new_pos = old_pos - diagonal;
    let mut common = 0usize;
    while new_pos + 1 < new_len
        && old_pos + 1 < old_len
        && old[(old_pos + 1) as usize] == new[(new_pos + 1) as usize]
    {
        new_pos += 1;
        old_pos += 1;
        common += 1;
    }
    if common > 0 {
        path.last = Some(Rc::new(Component {
            count: common,
            added: false,
            removed: false,
            previous: path.last.clone(),
        }));
    }
    path.old_pos = old_pos;
    new_pos
}

fn build_values(last: Option<Rc<Component>>, new: &[String], old: &[String]) -> Vec<Change> {
    let mut components: Vec<Rc<Component>> = Vec::new();
    let mut cursor = last;
    while let Some(c) = cursor {
        cursor = c.previous.clone();
        components.push(c);
    }
    components.reverse();
    let mut out = Vec::new();
    let (mut new_pos, mut old_pos) = (0usize, 0usize);
    for c in components {
        if !c.removed {
            let value = new[new_pos..new_pos + c.count].concat();
            new_pos += c.count;
            if !c.added {
                old_pos += c.count;
            }
            out.push(Change {
                value,
                added: c.added,
                removed: false,
            });
        } else {
            let value = old[old_pos..old_pos + c.count].concat();
            old_pos += c.count;
            out.push(Change {
                value,
                added: false,
                removed: true,
            });
        }
    }
    out
}

/// `diffLines(old, new)` do jsdiff, com o teto de tempo do CLI
/// (`DIFF_TIMEOUT_MS`, 5s). `None` quando estoura o tempo.
pub(crate) fn diff_lines(old_str: &str, new_str: &str) -> Option<Vec<Change>> {
    let old: Vec<String> = tokenize_lines(old_str);
    let new: Vec<String> = tokenize_lines(new_str);
    let new_len = new.len() as isize;
    let old_len = old.len() as isize;
    let max_edit_length = new_len + old_len;
    let deadline = std::time::Instant::now() + std::time::Duration::from_millis(5000);

    let mut best: std::collections::HashMap<isize, DiffPath> = std::collections::HashMap::new();
    let mut first = DiffPath {
        old_pos: -1,
        last: None,
    };
    let new_pos = extract_common(&mut first, &new, &old, 0);
    if first.old_pos + 1 >= old_len && new_pos + 1 >= new_len {
        return Some(build_values(first.last, &new, &old));
    }
    best.insert(0, first);
    let mut min_diagonal = isize::MIN;
    let mut max_diagonal = isize::MAX;
    let mut edit_length: isize = 1;
    while edit_length <= max_edit_length && std::time::Instant::now() <= deadline {
        let mut diagonal = min_diagonal.max(-edit_length);
        while diagonal <= max_diagonal.min(edit_length) {
            let remove_path = best.get(&(diagonal - 1)).cloned();
            let add_path = best.get(&(diagonal + 1)).cloned();
            if remove_path.is_some() {
                best.remove(&(diagonal - 1));
            }
            let can_add = match &add_path {
                Some(p) => {
                    let add_new_pos = p.old_pos - diagonal;
                    0 <= add_new_pos && add_new_pos < new_len
                }
                None => false,
            };
            let can_remove = remove_path
                .as_ref()
                .map(|p| p.old_pos + 1 < old_len)
                .unwrap_or(false);
            if !can_add && !can_remove {
                best.remove(&diagonal);
                diagonal += 2;
                continue;
            }
            let mut base = if !can_remove
                || (can_add
                    && remove_path.as_ref().map(|p| p.old_pos).unwrap_or(0)
                        < add_path.as_ref().map(|p| p.old_pos).unwrap_or(0))
            {
                add_to_path(add_path.as_ref().expect("add path"), true, false, 0)
            } else {
                add_to_path(remove_path.as_ref().expect("remove path"), false, true, 1)
            };
            let new_pos = extract_common(&mut base, &new, &old, diagonal);
            if base.old_pos + 1 >= old_len && new_pos + 1 >= new_len {
                return Some(build_values(base.last, &new, &old));
            }
            if base.old_pos + 1 >= old_len {
                max_diagonal = max_diagonal.min(diagonal - 1);
            }
            if new_pos + 1 >= new_len {
                min_diagonal = min_diagonal.max(diagonal + 1);
            }
            best.insert(diagonal, base);
            diagonal += 2;
        }
        edit_length += 1;
    }
    None
}

/// `splitLines` do `structuredPatch`: as linhas mantêm o `\n`.
fn split_patch_lines(text: &str) -> Vec<String> {
    let has_trailing = text.ends_with('\n');
    let mut result: Vec<String> = text.split('\n').map(|l| format!("{l}\n")).collect();
    if has_trailing {
        result.pop();
    } else if let Some(last) = result.pop() {
        result.push(last[..last.len() - 1].to_string());
    }
    result
}

/// Um hunk do `structuredPatch` (a forma do JSON do JS).
#[derive(Debug, Clone, PartialEq)]
pub(crate) struct Hunk {
    pub old_start: usize,
    pub old_lines: usize,
    pub new_start: usize,
    pub new_lines: usize,
    pub lines: Vec<String>,
}

impl Hunk {
    pub fn to_json(&self) -> Value {
        json!({
            "oldStart": self.old_start,
            "oldLines": self.old_lines,
            "newStart": self.new_start,
            "newLines": self.new_lines,
            "lines": self.lines,
        })
    }
}

/// `structuredPatch(..., {context})` do jsdiff: os hunks.
pub(crate) fn structured_patch(old_str: &str, new_str: &str, context: usize) -> Vec<Hunk> {
    let Some(mut diff) = diff_lines(old_str, new_str) else {
        return Vec::new();
    };
    diff.push(Change {
        value: String::new(),
        added: false,
        removed: false,
    });
    let lines_of: Vec<Vec<String>> = diff
        .iter()
        .enumerate()
        .map(|(i, c)| {
            if i == diff.len() - 1 {
                Vec::new()
            } else {
                split_patch_lines(&c.value)
            }
        })
        .collect();
    let mut hunks: Vec<Hunk> = Vec::new();
    let (mut old_range_start, mut new_range_start) = (0usize, 0usize);
    let mut cur_range: Vec<String> = Vec::new();
    let (mut old_line, mut new_line) = (1usize, 1usize);
    for i in 0..diff.len() {
        let current = &diff[i];
        let lines = &lines_of[i];
        if current.added || current.removed {
            if old_range_start == 0 {
                old_range_start = old_line;
                new_range_start = new_line;
                if i > 0 {
                    let prev = &lines_of[i - 1];
                    cur_range = if context > 0 {
                        let start = prev.len().saturating_sub(context);
                        prev[start..].iter().map(|l| format!(" {l}")).collect()
                    } else {
                        Vec::new()
                    };
                    old_range_start -= cur_range.len();
                    new_range_start -= cur_range.len();
                }
            }
            let sign = if current.added { '+' } else { '-' };
            cur_range.extend(lines.iter().map(|l| format!("{sign}{l}")));
            if current.added {
                new_line += lines.len();
            } else {
                old_line += lines.len();
            }
        } else {
            if old_range_start != 0 {
                if lines.len() <= context * 2 && i + 2 < diff.len() {
                    cur_range.extend(lines.iter().map(|l| format!(" {l}")));
                } else {
                    let context_size = lines.len().min(context);
                    cur_range.extend(lines[..context_size].iter().map(|l| format!(" {l}")));
                    hunks.push(Hunk {
                        old_start: old_range_start,
                        old_lines: old_line - old_range_start + context_size,
                        new_start: new_range_start,
                        new_lines: new_line - new_range_start + context_size,
                        lines: std::mem::take(&mut cur_range),
                    });
                    old_range_start = 0;
                    new_range_start = 0;
                }
            }
            old_line += lines.len();
            new_line += lines.len();
        }
    }
    for hunk in &mut hunks {
        let mut fixed: Vec<String> = Vec::new();
        for line in &hunk.lines {
            if let Some(stripped) = line.strip_suffix('\n') {
                fixed.push(stripped.to_string());
            } else {
                fixed.push(line.clone());
                fixed.push("\\ No newline at end of file".to_string());
            }
        }
        hunk.lines = fixed;
    }
    hunks
}

/// `CONTEXT_LINES` de `utils/diff.js`.
pub(crate) const CONTEXT_LINES: usize = 3;

/// `convertLeadingTabsToSpaces` de `utils/file.js`: cada tab do começo de
/// cada linha vira dois espaços (só para o diff exibido).
pub(crate) fn convert_leading_tabs_to_spaces(content: &str) -> String {
    if !content.contains('\t') {
        return content.to_string();
    }
    let mut out = String::with_capacity(content.len());
    let mut at_line_start = true;
    for ch in content.chars() {
        if at_line_start && ch == '\t' {
            out.push_str("  ");
            continue;
        }
        at_line_start = matches!(ch, '\n' | '\r' | '\u{2028}' | '\u{2029}');
        out.push(ch);
    }
    out
}

/// O patch entre dois conteúdos, como o `getPatchFromContents` (tabs de
/// começo de linha convertidos, contexto 3), em JSON.
pub(crate) fn patch_json(old: &str, new: &str) -> Value {
    Value::Array(
        structured_patch(
            &convert_leading_tabs_to_spaces(old),
            &convert_leading_tabs_to_spaces(new),
            CONTEXT_LINES,
        )
        .iter()
        .map(Hunk::to_json)
        .collect(),
    )
}

// ---------------------------------------------------------------------------
// Leitura e escrita com metadados
// ---------------------------------------------------------------------------

/// Codificação detectada (`detectEncodingForResolvedPath`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Encoding {
    Utf8,
    Utf16Le,
}

/// Fim de linha detectado (`detectLineEndingsForString`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum LineEndings {
    Lf,
    Crlf,
}

/// O resultado de `readFileSyncWithMetadata`.
#[derive(Debug, Clone)]
pub(crate) struct FileMeta {
    /// Conteúdo com `\r\n` trocado por `\n`.
    pub content: String,
    pub encoding: Encoding,
    pub line_endings: LineEndings,
}

fn decode(bytes: &[u8]) -> (String, Encoding) {
    if bytes.len() >= 2 && bytes[0] == 0xFF && bytes[1] == 0xFE {
        let units: Vec<u16> = bytes
            .chunks(2)
            .map(|c| u16::from_le_bytes([c[0], *c.get(1).unwrap_or(&0)]))
            .collect();
        (String::from_utf16_lossy(&units), Encoding::Utf16Le)
    } else {
        (String::from_utf8_lossy(bytes).into_owned(), Encoding::Utf8)
    }
}

fn detect_line_endings(raw: &str) -> LineEndings {
    let head: String = raw.chars().take(4096).collect();
    let (mut crlf, mut lf) = (0usize, 0usize);
    let mut prev = '\0';
    for ch in head.chars() {
        if ch == '\n' {
            if prev == '\r' {
                crlf += 1;
            } else {
                lf += 1;
            }
        }
        prev = ch;
    }
    if crlf > lf {
        LineEndings::Crlf
    } else {
        LineEndings::Lf
    }
}

/// `readFileSyncWithMetadata`: lê (seguindo symlinks), detecta codificação e
/// fim de linha, e normaliza `\r\n` para `\n`.
pub(crate) fn read_file_with_metadata(path: &Path) -> std::io::Result<FileMeta> {
    let bytes = std::fs::read(path)?;
    let (raw, encoding) = decode(&bytes);
    let line_endings = detect_line_endings(&raw);
    Ok(FileMeta {
        content: raw.replace("\r\n", "\n"),
        encoding,
        line_endings,
    })
}

/// `writeTextContent`: grava na codificação dada, com `\r\n` quando o
/// arquivo original era CRLF.
pub(crate) fn write_text_content(
    path: &Path,
    content: &str,
    encoding: Encoding,
    endings: LineEndings,
) -> std::io::Result<()> {
    let text = match endings {
        LineEndings::Crlf => content
            .replace("\r\n", "\n")
            .split('\n')
            .collect::<Vec<_>>()
            .join("\r\n"),
        LineEndings::Lf => content.to_string(),
    };
    let bytes: Vec<u8> = match encoding {
        Encoding::Utf8 => text.into_bytes(),
        Encoding::Utf16Le => text.encode_utf16().flat_map(|u| u.to_le_bytes()).collect(),
    };
    std::fs::write(path, bytes)
}

/// `getFileModificationTime`: mtime em milissegundos, arredondado para baixo.
pub(crate) fn modification_time_ms(path: &Path) -> std::io::Result<i64> {
    let modified = std::fs::metadata(path)?.modified()?;
    let millis = match modified.duration_since(std::time::UNIX_EPOCH) {
        Ok(d) => d.as_millis() as i64,
        Err(e) => -(e.duration().as_millis() as i64),
    };
    Ok(millis)
}

// ---------------------------------------------------------------------------
// Caminhos
// ---------------------------------------------------------------------------

/// `FILE_NOT_FOUND_CWD_NOTE` de `utils/file.js`.
pub(crate) const FILE_NOT_FOUND_CWD_NOTE: &str = "Note: your current working directory is";

/// `findSimilarFile`: um arquivo irmão com o mesmo nome e outra extensão.
pub(crate) fn find_similar_file(path: &Path) -> Option<String> {
    let dir = path.parent()?;
    let stem = path.file_stem()?.to_string_lossy().to_string();
    let entries = std::fs::read_dir(dir).ok()?;
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        let entry_stem = Path::new(&name)
            .file_stem()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_default();
        if entry_stem == stem && dir.join(&name) != path {
            return Some(name);
        }
    }
    None
}

/// `suggestPathUnderCwd`: quando o caminho pedido cai no pai do cwd, o mesmo
/// caminho relativo dentro do cwd, se existir.
pub(crate) fn suggest_path_under_cwd(requested: &Path, cwd: &Path) -> Option<String> {
    let cwd_parent = cwd.parent()?;
    let mut resolved = requested.to_path_buf();
    if let (Some(dir), Some(name)) = (requested.parent(), requested.file_name()) {
        if let Ok(real) = std::fs::canonicalize(dir) {
            resolved = real.join(name);
        }
    }
    let parent_text = cwd_parent.to_string_lossy();
    let prefix = if parent_text == "/" {
        "/".to_string()
    } else {
        format!("{parent_text}/")
    };
    let resolved_text = resolved.to_string_lossy().to_string();
    let cwd_text = cwd.to_string_lossy().to_string();
    if !resolved_text.starts_with(&prefix)
        || resolved_text.starts_with(&format!("{cwd_text}/"))
        || resolved_text == cwd_text
    {
        return None;
    }
    let rel = resolved.strip_prefix(cwd_parent).ok()?;
    let corrected = cwd.join(rel);
    if std::fs::metadata(&corrected).is_ok() {
        Some(corrected.to_string_lossy().to_string())
    } else {
        None
    }
}

/// `toRelativePath`: relativo ao cwd, salvo quando sairia dele (`..`).
pub(crate) fn to_relative_path(absolute: &str, cwd: &Path) -> String {
    // O `path.relative` do Node resolve os dois lados antes de comparar.
    let resolved = crate::tools::file_state::normalize_path(&cwd.join(absolute));
    let rel = crate::tools::permission::relative_path(cwd, &resolved);
    if rel.starts_with("..") {
        absolute.to_string()
    } else {
        rel
    }
}

/// O caminho absoluto de um input (`expandPath` relativo ao cwd).
pub(crate) fn absolute(raw: &str, cwd: &Path) -> PathBuf {
    crate::tools::permission::expand_path(raw, cwd)
}

// ---------------------------------------------------------------------------
// Aspas do Edit (tools/FileEditTool/utils.js)
// ---------------------------------------------------------------------------

const LEFT_SINGLE: char = '\u{2018}';
const RIGHT_SINGLE: char = '\u{2019}';
const LEFT_DOUBLE: char = '\u{201C}';
const RIGHT_DOUBLE: char = '\u{201D}';

fn normalize_quotes(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            LEFT_SINGLE | RIGHT_SINGLE => '\'',
            LEFT_DOUBLE | RIGHT_DOUBLE => '"',
            other => other,
        })
        .collect()
}

/// `findActualString`: o trecho do arquivo que casa a busca, aceitando aspas
/// curvas no arquivo quando a busca veio com aspas retas (e vice-versa).
pub(crate) fn find_actual_string(content: &str, search: &str) -> Option<String> {
    if content.contains(search) {
        return Some(search.to_string());
    }
    let normalized_search = normalize_quotes(search);
    let normalized_content = normalize_quotes(content);
    // A normalização troca um char por outro de mesmo tamanho em UTF-16, então
    // os índices em chars valem nos dois textos.
    let content_chars: Vec<char> = content.chars().collect();
    let norm_chars: Vec<char> = normalized_content.chars().collect();
    let search_chars: Vec<char> = normalized_search.chars().collect();
    if search_chars.is_empty() {
        return None;
    }
    let idx = norm_chars
        .windows(search_chars.len())
        .position(|w| w == search_chars.as_slice())?;
    // O JS corta `searchString.length` unidades UTF-16 a partir do índice.
    let wanted = search.encode_utf16().count();
    let mut units = 0usize;
    let mut out = String::new();
    for ch in &content_chars[idx..] {
        if units >= wanted {
            break;
        }
        units += ch.len_utf16();
        out.push(*ch);
    }
    Some(out)
}

fn is_opening_context(chars: &[char], index: usize) -> bool {
    if index == 0 {
        return true;
    }
    let prev = chars[index - 1];
    matches!(prev, ' ' | '\t' | '\n' | '\r' | '(' | '[' | '{')
        || prev as u32 == 0x2014
        || prev as u32 == 0x2013
}

/// `preserveQuoteStyle`: quando o arquivo usa aspas curvas, o texto novo
/// também passa a usar.
pub(crate) fn preserve_quote_style(old: &str, actual_old: &str, new: &str) -> String {
    if old == actual_old {
        return new.to_string();
    }
    let has_double = actual_old.contains(LEFT_DOUBLE) || actual_old.contains(RIGHT_DOUBLE);
    let has_single = actual_old.contains(LEFT_SINGLE) || actual_old.contains(RIGHT_SINGLE);
    if !has_double && !has_single {
        return new.to_string();
    }
    let mut result = new.to_string();
    if has_double {
        let chars: Vec<char> = result.chars().collect();
        result = chars
            .iter()
            .enumerate()
            .map(|(i, c)| {
                if *c == '"' {
                    if is_opening_context(&chars, i) {
                        LEFT_DOUBLE
                    } else {
                        RIGHT_DOUBLE
                    }
                } else {
                    *c
                }
            })
            .collect();
    }
    if has_single {
        let chars: Vec<char> = result.chars().collect();
        result = chars
            .iter()
            .enumerate()
            .map(|(i, c)| {
                if *c != '\'' {
                    return *c;
                }
                let prev_letter = i > 0 && chars[i - 1].is_alphabetic();
                let next_letter = chars.get(i + 1).map(|n| n.is_alphabetic()).unwrap_or(false);
                if prev_letter && next_letter {
                    RIGHT_SINGLE
                } else if is_opening_context(&chars, i) {
                    LEFT_SINGLE
                } else {
                    RIGHT_SINGLE
                }
            })
            .collect();
    }
    result
}

/// `stripTrailingWhitespace`: tira o espaço do fim de cada linha, mantendo os
/// separadores (`\r\n`, `\n` ou `\r`).
pub(crate) fn strip_trailing_whitespace(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    let mut line = String::new();
    let mut chars = text.chars().peekable();
    while let Some(ch) = chars.next() {
        if ch == '\r' || ch == '\n' {
            out.push_str(line.trim_end_matches(is_js_whitespace));
            line.clear();
            out.push(ch);
            if ch == '\r' && chars.peek() == Some(&'\n') {
                out.push('\n');
                chars.next();
            }
        } else {
            line.push(ch);
        }
    }
    out.push_str(line.trim_end_matches(is_js_whitespace));
    out
}

/// O `\s` do JS (espaço em branco Unicode mais o BOM).
fn is_js_whitespace(c: char) -> bool {
    c.is_whitespace() || c == '\u{FEFF}'
}

/// `DESANITIZATIONS` de `tools/FileEditTool/utils.js`: as abreviações que a
/// API aplica em marcações e que o Edit desfaz quando o arquivo tem a forma
/// longa.
pub(crate) const DESANITIZATIONS: &[(&str, &str)] = &[
    ("<fnr>", "<function_results>"),
    ("<n>", "<name>"),
    ("</n>", "</name>"),
    ("<o>", "<output>"),
    ("</o>", "</output>"),
    ("<e>", "<error>"),
    ("</e>", "</error>"),
    ("<s>", "<system>"),
    ("</s>", "</system>"),
    ("<r>", "<result>"),
    ("</r>", "</result>"),
    ("< META_START >", "<META_START>"),
    ("< META_END >", "<META_END>"),
    ("< EOT >", "<EOT>"),
    ("< META >", "<META>"),
    ("< SOS >", "<SOS>"),
    ("\n\nH:", "\n\nHuman:"),
    ("\n\nA:", "\n\nAssistant:"),
];

/// `isMarkdown` do `normalizeToolInput` (`.md`/`.mdx` não perdem o espaço de
/// fim de linha, que no Markdown é quebra).
pub(crate) fn is_markdown_path(path: &str) -> bool {
    let lower = path.to_lowercase();
    lower.ends_with(".md") || lower.ends_with(".mdx")
}

// ---------------------------------------------------------------------------
// ripgrep
// ---------------------------------------------------------------------------

/// O binário do ripgrep: `USE_BUILTIN_RIPGREP`/vendor não existem no nativo,
/// então vale o `rg` do PATH (o modo `system` do `getRipgrepConfig`).
pub(crate) fn ripgrep_path() -> Option<PathBuf> {
    let path_var = std::env::var_os("PATH")?;
    std::env::split_paths(&path_var)
        .map(|dir| dir.join("rg"))
        .find(|candidate| candidate.is_file())
}

/// O resultado de uma chamada ao ripgrep.
pub(crate) enum RipgrepOutcome {
    Lines(Vec<String>),
    /// Falha que o JS propaga como erro da tool.
    Error(String),
}

/// `ripGrep(args, target)`: roda com o timeout de 20s do JS, e trata o
/// código 1 (nada encontrado) como lista vazia. Saída parcial de um erro
/// (código 2, arquivo ilegível) segue como resultado, como no JS.
pub(crate) async fn run_ripgrep(rg: &Path, args: &[String], target: &Path) -> RipgrepOutcome {
    let timeout = std::env::var("CLAUDE_CODE_GLOB_TIMEOUT_SECONDS")
        .ok()
        .and_then(|v| v.parse::<u64>().ok())
        .filter(|v| *v > 0)
        .map(std::time::Duration::from_secs)
        .unwrap_or(std::time::Duration::from_secs(20));
    let mut command = tokio::process::Command::new(rg);
    command
        .args(args)
        .arg(target)
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .kill_on_drop(true);
    let output = match tokio::time::timeout(timeout, command.output()).await {
        Ok(Ok(output)) => output,
        Ok(Err(e)) => return RipgrepOutcome::Error(format!("spawn {} {e}", rg.display())),
        Err(_) => {
            return RipgrepOutcome::Error(format!(
                "Ripgrep search timed out after {} seconds. The search may have matched files but did not complete in time. Try searching a more specific path or pattern.",
                timeout.as_secs()
            ))
        }
    };
    let split = |bytes: &[u8]| -> Vec<String> {
        String::from_utf8_lossy(bytes)
            .trim()
            .split('\n')
            .map(|l| l.strip_suffix('\r').unwrap_or(l).to_string())
            .filter(|l| !l.is_empty())
            .collect()
    };
    match output.status.code() {
        Some(0) => RipgrepOutcome::Lines(split(&output.stdout)),
        Some(1) => RipgrepOutcome::Lines(Vec::new()),
        _ => {
            let lines = split(&output.stdout);
            if lines.is_empty() && !output.stderr.is_empty() && output.status.code() != Some(2) {
                return RipgrepOutcome::Error(
                    String::from_utf8_lossy(&output.stderr).trim().to_string(),
                );
            }
            RipgrepOutcome::Lines(lines)
        }
    }
}

// ---------------------------------------------------------------------------
// Busca sem ripgrep
// ---------------------------------------------------------------------------

/// Expande chaves (`*.{ts,tsx}`) em alternativas.
fn expand_braces(pattern: &str) -> Vec<String> {
    let chars: Vec<char> = pattern.chars().collect();
    let mut depth = 0i32;
    let mut open = None;
    for (i, c) in chars.iter().enumerate() {
        match c {
            '\\' => {}
            '{' => {
                if depth == 0 {
                    open = Some(i);
                }
                depth += 1;
            }
            '}' if depth > 0 => {
                depth -= 1;
                if depth == 0 {
                    let start = open.unwrap_or(0);
                    let head: String = chars[..start].iter().collect();
                    let tail: String = chars[i + 1..].iter().collect();
                    let body: Vec<char> = chars[start + 1..i].to_vec();
                    let mut alternatives = Vec::new();
                    let mut current = String::new();
                    let mut inner = 0i32;
                    for ch in body {
                        match ch {
                            '{' => {
                                inner += 1;
                                current.push(ch);
                            }
                            '}' => {
                                inner -= 1;
                                current.push(ch);
                            }
                            ',' if inner == 0 => alternatives.push(std::mem::take(&mut current)),
                            _ => current.push(ch),
                        }
                    }
                    alternatives.push(current);
                    return alternatives
                        .into_iter()
                        .flat_map(|alt| expand_braces(&format!("{head}{alt}{tail}")))
                        .collect();
                }
            }
            _ => {}
        }
    }
    vec![pattern.to_string()]
}

fn glob_to_regex(pattern: &str) -> String {
    let chars: Vec<char> = pattern.chars().collect();
    let mut re = String::from("^");
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        match c {
            '*' if chars.get(i + 1) == Some(&'*') => {
                if chars.get(i + 2) == Some(&'/') {
                    re.push_str("(?:.*/)?");
                    i += 3;
                } else {
                    re.push_str(".*");
                    i += 2;
                }
            }
            '*' => {
                re.push_str("[^/]*");
                i += 1;
            }
            '?' => {
                re.push_str("[^/]");
                i += 1;
            }
            '[' => {
                let mut j = i + 1;
                let mut class = String::from("[");
                if chars.get(j) == Some(&'!') || chars.get(j) == Some(&'^') {
                    class.push('^');
                    j += 1;
                }
                while j < chars.len() && chars[j] != ']' {
                    if chars[j] == '\\' {
                        class.push('\\');
                    }
                    class.push(chars[j]);
                    j += 1;
                }
                if j < chars.len() {
                    class.push(']');
                    re.push_str(&class);
                    i = j + 1;
                } else {
                    re.push_str("\\[");
                    i += 1;
                }
            }
            '\\' if i + 1 < chars.len() => {
                re.push_str(&regex::escape(&chars[i + 1].to_string()));
                i += 2;
            }
            other => {
                re.push_str(&regex::escape(&other.to_string()));
                i += 1;
            }
        }
    }
    re.push('$');
    re
}

/// Um glob no estilo do `--glob` do ripgrep: sem `/` casa o nome em qualquer
/// nível; com `/`, casa o caminho relativo à raiz da busca; `!` nega.
#[derive(Debug)]
pub(crate) struct RgGlob {
    negated: bool,
    anchored: bool,
    regexes: Vec<regex::Regex>,
}

impl RgGlob {
    pub fn new(pattern: &str) -> Option<Self> {
        let (negated, body) = match pattern.strip_prefix('!') {
            Some(rest) => (true, rest),
            None => (false, pattern),
        };
        let trimmed = body.trim_end_matches('/');
        let anchored = trimmed.trim_start_matches('/').contains('/') || trimmed.starts_with('/');
        let body = trimmed.trim_start_matches('/');
        let regexes = expand_braces(body)
            .iter()
            .filter_map(|p| regex::Regex::new(&glob_to_regex(p)).ok())
            .collect::<Vec<_>>();
        if regexes.is_empty() {
            return None;
        }
        Some(Self {
            negated,
            anchored,
            regexes,
        })
    }

    /// Se casa o caminho relativo (com `/`). Diretórios pais também valem:
    /// um diretório casado cobre tudo abaixo dele.
    fn matches_path(&self, relative: &str) -> bool {
        let segments: Vec<&str> = relative.split('/').collect();
        for end in 1..=segments.len() {
            let candidate = if self.anchored {
                segments[..end].join("/")
            } else {
                segments[end - 1].to_string()
            };
            if self.regexes.iter().any(|r| r.is_match(&candidate)) {
                return true;
            }
        }
        false
    }
}

/// Aplica uma lista de globs de override do ripgrep a um caminho relativo:
/// com algum glob positivo, o arquivo precisa casar um deles; qualquer glob
/// negado que case exclui (o último que casar decide, como no ripgrep).
pub(crate) fn rg_globs_allow(globs: &[RgGlob], relative: &str) -> bool {
    let has_positive = globs.iter().any(|g| !g.negated);
    let mut decision: Option<bool> = None;
    for glob in globs {
        if glob.matches_path(relative) {
            decision = Some(!glob.negated);
        }
    }
    match decision {
        Some(d) => d,
        None => !has_positive,
    }
}

/// Todos os arquivos abaixo de `root` (inclusive ocultos), sem seguir
/// symlinks de diretório, com o caminho relativo em `/`.
pub(crate) fn walk_files(root: &Path, skip_dirs: &[&str]) -> Vec<(PathBuf, String)> {
    let mut out = Vec::new();
    if root.is_file() {
        let name = root
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();
        out.push((root.to_path_buf(), name));
        return out;
    }
    let mut stack: Vec<(PathBuf, String)> = vec![(root.to_path_buf(), String::new())];
    while let Some((dir, rel)) = stack.pop() {
        let Ok(entries) = std::fs::read_dir(&dir) else {
            continue;
        };
        let mut entries: Vec<_> = entries.flatten().collect();
        entries.sort_by_key(|e| e.file_name());
        for entry in entries {
            let name = entry.file_name().to_string_lossy().to_string();
            let child_rel = if rel.is_empty() {
                name.clone()
            } else {
                format!("{rel}/{name}")
            };
            let Ok(file_type) = entry.file_type() else {
                continue;
            };
            if file_type.is_dir() {
                if !skip_dirs.contains(&name.as_str()) {
                    stack.push((entry.path(), child_rel));
                }
            } else if (file_type.is_file() || file_type.is_symlink()) && entry.path().is_file() {
                out.push((entry.path(), child_rel));
            }
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn lines(patch: &[Hunk]) -> Vec<Vec<String>> {
        patch.iter().map(|h| h.lines.clone()).collect()
    }

    #[test]
    fn structured_patch_matches_the_cli_capture_for_a_single_line_change() {
        let patch = structured_patch("alpha\nbeta\ngamma\n", "alpha\nBETA\ngamma\n", 3);
        assert_eq!(patch.len(), 1);
        assert_eq!(
            (
                patch[0].old_start,
                patch[0].old_lines,
                patch[0].new_start,
                patch[0].new_lines
            ),
            (1, 3, 1, 3)
        );
        assert_eq!(lines(&patch)[0], vec![" alpha", "-beta", "+BETA", " gamma"]);
    }

    #[test]
    fn structured_patch_interleaves_like_jsdiff_for_replace_all() {
        // Capturado do CLI 2.1.90 (replace_all de "foo" por "baz").
        let patch = patch_json(
            "foo\nbar\nfoo\n\ttabbed \"quoted\"\n",
            "baz\nbar\nbaz\n\ttabbed \"quoted\"\n",
        );
        assert_eq!(
            patch,
            json!([{"oldStart": 1, "oldLines": 4, "newStart": 1, "newLines": 4,
                    "lines": ["-foo", "+baz", " bar", "-foo", "+baz", "   tabbed \"quoted\""]}])
        );
    }

    #[test]
    fn structured_patch_for_new_content_and_missing_newline() {
        assert_eq!(
            patch_json("", "new file\n"),
            json!([{"oldStart": 1, "oldLines": 0, "newStart": 1, "newLines": 1, "lines": ["+new file"]}])
        );
        let patch = structured_patch("a\nb", "a\nc", 3);
        assert_eq!(
            lines(&patch)[0],
            vec![
                " a",
                "-b",
                "\\ No newline at end of file",
                "+c",
                "\\ No newline at end of file"
            ]
        );
    }

    #[test]
    fn write_update_patch_matches_the_capture() {
        assert_eq!(
            patch_json("alpha\nBETA\ngamma\n", "alpha\nnew\n"),
            json!([{"oldStart": 1, "oldLines": 3, "newStart": 1, "newLines": 2,
                    "lines": [" alpha", "-BETA", "-gamma", "+new"]}])
        );
    }

    #[test]
    fn distant_changes_become_separate_hunks() {
        let old: String = (1..=20).map(|i| format!("l{i}\n")).collect();
        let new = old.replace("l2\n", "X\n").replace("l18\n", "Y\n");
        let patch = structured_patch(&old, &new, 3);
        assert_eq!(patch.len(), 2);
        assert_eq!((patch[0].old_start, patch[0].old_lines), (1, 5));
        assert_eq!((patch[1].old_start, patch[1].old_lines), (15, 6));
    }

    #[test]
    fn curly_quotes_are_found_and_preserved() {
        let content = "say \u{201C}hi\u{201D} now";
        let actual = find_actual_string(content, "\"hi\"").unwrap();
        assert_eq!(actual, "\u{201C}hi\u{201D}");
        assert_eq!(
            preserve_quote_style("\"hi\"", &actual, "\"bye\""),
            "\u{201C}bye\u{201D}"
        );
        assert_eq!(
            preserve_quote_style("'x'", "\u{2018}x\u{2019}", "it's 'y'"),
            "it\u{2019}s \u{2018}y\u{2019}"
        );
    }

    #[test]
    fn trailing_whitespace_is_stripped_per_line() {
        assert_eq!(
            strip_trailing_whitespace("one  \ntwo\t\r\nthree "),
            "one\ntwo\r\nthree"
        );
    }

    #[test]
    fn leading_tabs_become_two_spaces() {
        assert_eq!(
            convert_leading_tabs_to_spaces("\t\ta\tb\n\tc"),
            "    a\tb\n  c"
        );
    }

    #[test]
    fn crlf_and_utf16_roundtrip() {
        let dir = tempfile::tempdir().unwrap();
        let p = dir.path().join("f.txt");
        std::fs::write(&p, "a\r\nb\r\n").unwrap();
        let meta = read_file_with_metadata(&p).unwrap();
        assert_eq!(meta.content, "a\nb\n");
        assert_eq!(meta.line_endings, LineEndings::Crlf);
        write_text_content(&p, "a\nc\n", meta.encoding, meta.line_endings).unwrap();
        assert_eq!(std::fs::read(&p).unwrap(), b"a\r\nc\r\n");

        let u = dir.path().join("u.txt");
        let bytes: Vec<u8> = "\u{FEFF}oi\n"
            .encode_utf16()
            .flat_map(|x| x.to_le_bytes())
            .collect();
        std::fs::write(&u, &bytes).unwrap();
        let meta = read_file_with_metadata(&u).unwrap();
        assert_eq!(meta.encoding, Encoding::Utf16Le);
        assert_eq!(meta.content, "\u{FEFF}oi\n");
        write_text_content(&u, &meta.content, meta.encoding, meta.line_endings).unwrap();
        assert_eq!(std::fs::read(&u).unwrap(), bytes);
    }

    #[test]
    fn relative_paths_follow_to_relative_path() {
        let cwd = Path::new("/p/proj");
        assert_eq!(to_relative_path("/p/proj/a/b.txt", cwd), "a/b.txt");
        assert_eq!(to_relative_path("/p/other/x", cwd), "/p/other/x");
    }
}
