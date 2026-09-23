//! HTML para Markdown com a saída do turndown que o WebFetch do CLI usa.
//!
//! Referência JS: `tools/WebFetchTool/UI/init_turndown_es.js`,
//! `TurndownService.js`, `collapseWhitespace.js`, `process23.js`,
//! `replacementForNode.js`, `flankingWhitespace.js`, `edgeWhitespace.js`,
//! `escapeMarkdown.js`, `join85.js` e `postProcess2.js`: o turndown com as
//! opções default (`headingStyle: "setext"`, `hr: "* * *"`,
//! `bulletListMarker: "*"`, `codeBlockStyle: "indented"`, `emDelimiter: "_"`,
//! `strongDelimiter: "**"`, `linkStyle: "inlined"`, `br: "  "`).
//!
//! É um port, e não uma aproximação por outra biblioteca, porque o texto que
//! o modelo pequeno recebe precisa ser o mesmo. Medido contra o CLI 2.1.90:
//! o Readability do `getURLMarkdownContent` nunca chega a ser aplicado (a
//! página inteira vai para o turndown, inclusive o texto de `<title>`,
//! `<style>` e `<script>`, que o parser coloca dentro do `<x-turndown>`), e
//! este módulo reproduz exatamente isso. O parse é o do html5ever, que segue
//! o mesmo algoritmo HTML5 do domino usado pelo turndown no Node.

use std::sync::OnceLock;

use html5ever::tendril::TendrilSink;
use markup5ever_rcdom::{Handle, NodeData, RcDom};
use regex::Regex;

const BLOCK_ELEMENTS: &[&str] = &[
    "ADDRESS",
    "ARTICLE",
    "ASIDE",
    "AUDIO",
    "BLOCKQUOTE",
    "BODY",
    "CANVAS",
    "CENTER",
    "DD",
    "DIR",
    "DIV",
    "DL",
    "DT",
    "FIELDSET",
    "FIGCAPTION",
    "FIGURE",
    "FOOTER",
    "FORM",
    "FRAMESET",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HEADER",
    "HGROUP",
    "HR",
    "HTML",
    "ISINDEX",
    "LI",
    "MAIN",
    "MENU",
    "NAV",
    "NOFRAMES",
    "NOSCRIPT",
    "OL",
    "OUTPUT",
    "P",
    "PRE",
    "SECTION",
    "TABLE",
    "TBODY",
    "TD",
    "TFOOT",
    "TH",
    "THEAD",
    "TR",
    "UL",
];

const VOID_ELEMENTS: &[&str] = &[
    "AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK",
    "META", "PARAM", "SOURCE", "TRACK", "WBR",
];

const MEANINGFUL_WHEN_BLANK: &[&str] = &[
    "A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO",
];

/// O `\s` do JS.
fn js_space(c: char) -> bool {
    matches!(
        c,
        '\t' | '\n' | '\u{0b}' | '\u{0c}' | '\r' | ' ' | '\u{a0}' | '\u{1680}' | '\u{2000}'
            ..='\u{200a}'
                | '\u{2028}'
                | '\u{2029}'
                | '\u{202f}'
                | '\u{205f}'
                | '\u{3000}'
                | '\u{feff}'
    )
}

fn ascii_space(c: char) -> bool {
    matches!(c, ' ' | '\t' | '\r' | '\n')
}

/// `String.prototype.trim` do JS.
fn js_trim(s: &str) -> &str {
    s.trim_matches(js_space)
}

fn js_len(s: &str) -> usize {
    s.encode_utf16().count()
}

#[derive(Debug, Clone)]
enum Kind {
    Element {
        /// O `nodeName` do DOM: maiúsculo para HTML.
        name: String,
        attrs: Vec<(String, String)>,
    },
    Text(String),
    Comment,
}

#[derive(Debug, Clone)]
struct TNode {
    kind: Kind,
    parent: Option<usize>,
    children: Vec<usize>,
}

/// Árvore própria (arena), com os ponteiros de pai e irmão que o turndown
/// usa e a remoção de nós que o `collapseWhitespace` faz.
struct Tree {
    nodes: Vec<TNode>,
}

impl Tree {
    fn name(&self, i: usize) -> &str {
        match &self.nodes[i].kind {
            Kind::Element { name, .. } => name,
            Kind::Text(_) => "#text",
            Kind::Comment => "#comment",
        }
    }

    fn is_element(&self, i: usize) -> bool {
        matches!(self.nodes[i].kind, Kind::Element { .. })
    }

    fn attr(&self, i: usize, key: &str) -> Option<&str> {
        match &self.nodes[i].kind {
            Kind::Element { attrs, .. } => attrs
                .iter()
                .find(|(k, _)| k == key)
                .map(|(_, v)| v.as_str()),
            _ => None,
        }
    }

    fn parent(&self, i: usize) -> Option<usize> {
        self.nodes[i].parent
    }

    fn first_child(&self, i: usize) -> Option<usize> {
        self.nodes[i].children.first().copied()
    }

    fn index_in_parent(&self, i: usize) -> Option<(usize, usize)> {
        let p = self.parent(i)?;
        let pos = self.nodes[p].children.iter().position(|c| *c == i)?;
        Some((p, pos))
    }

    fn next_sibling(&self, i: usize) -> Option<usize> {
        let (p, pos) = self.index_in_parent(i)?;
        self.nodes[p].children.get(pos + 1).copied()
    }

    fn previous_sibling(&self, i: usize) -> Option<usize> {
        let (p, pos) = self.index_in_parent(i)?;
        if pos == 0 {
            None
        } else {
            self.nodes[p].children.get(pos - 1).copied()
        }
    }

    fn remove(&mut self, i: usize) {
        if let Some((p, pos)) = self.index_in_parent(i) {
            self.nodes[p].children.remove(pos);
        }
        self.nodes[i].parent = None;
    }

    fn text_content(&self, i: usize) -> String {
        let mut out = String::new();
        self.collect_text(i, &mut out);
        out
    }

    fn collect_text(&self, i: usize, out: &mut String) {
        match &self.nodes[i].kind {
            Kind::Text(t) => out.push_str(t),
            Kind::Element { .. } => {
                for c in &self.nodes[i].children {
                    self.collect_text(*c, out);
                }
            }
            Kind::Comment => {}
        }
    }

    fn has_descendant_named(&self, i: usize, names: &[&str]) -> bool {
        self.nodes[i].children.iter().any(|c| {
            (self.is_element(*c) && names.contains(&self.name(*c)))
                || self.has_descendant_named(*c, names)
        })
    }

    fn is_block(&self, i: usize) -> bool {
        BLOCK_ELEMENTS.contains(&self.name(i))
    }

    fn is_void(&self, i: usize) -> bool {
        VOID_ELEMENTS.contains(&self.name(i))
    }

    fn is_pre(&self, i: usize) -> bool {
        self.name(i) == "PRE"
    }

    fn is_code(&self, i: usize) -> bool {
        if self.name(i) == "CODE" {
            return true;
        }
        match self.parent(i) {
            Some(p) => self.is_code(p),
            None => false,
        }
    }

    fn is_blank(&self, i: usize) -> bool {
        !self.is_void(i)
            && !MEANINGFUL_WHEN_BLANK.contains(&self.name(i))
            && self.text_content(i).chars().all(js_space)
            && !self.has_descendant_named(i, VOID_ELEMENTS)
            && !self.has_descendant_named(i, MEANINGFUL_WHEN_BLANK)
    }

    fn last_element_child(&self, i: usize) -> Option<usize> {
        self.nodes[i]
            .children
            .iter()
            .rev()
            .find(|c| self.is_element(**c))
            .copied()
    }
}

fn node_name(qual: &html5ever::QualName) -> String {
    let local = qual.local.to_string();
    if qual.ns == html5ever::ns!(html) {
        local.to_ascii_uppercase()
    } else {
        local
    }
}

/// Copia a subárvore do rcdom para a arena.
fn copy_subtree(handle: &Handle, parent: Option<usize>, tree: &mut Tree) -> Option<usize> {
    let kind = match &handle.data {
        NodeData::Element { name, attrs, .. } => Kind::Element {
            name: node_name(name),
            attrs: attrs
                .borrow()
                .iter()
                .map(|a| (a.name.local.to_string(), a.value.to_string()))
                .collect(),
        },
        NodeData::Text { contents } => Kind::Text(contents.borrow().to_string()),
        NodeData::Comment { .. } => Kind::Comment,
        _ => return None,
    };
    let idx = tree.nodes.len();
    tree.nodes.push(TNode {
        kind,
        parent,
        children: Vec::new(),
    });
    for child in handle.children.borrow().iter() {
        if let Some(c) = copy_subtree(child, Some(idx), tree) {
            tree.nodes[idx].children.push(c);
        }
    }
    Some(idx)
}

fn find_root(handle: &Handle) -> Option<Handle> {
    if let NodeData::Element { attrs, .. } = &handle.data {
        if attrs
            .borrow()
            .iter()
            .any(|a| &*a.name.local == "id" && &*a.value == "turndown-root")
        {
            return Some(handle.clone());
        }
    }
    for child in handle.children.borrow().iter() {
        if let Some(found) = find_root(child) {
            return Some(found);
        }
    }
    None
}

/// `next` do `collapseWhitespace`.
fn next_node(tree: &Tree, prev: Option<usize>, current: usize) -> Option<usize> {
    if prev.and_then(|p| tree.parent(p)) == Some(current) || tree.is_pre(current) {
        return tree.next_sibling(current).or_else(|| tree.parent(current));
    }
    tree.first_child(current)
        .or_else(|| tree.next_sibling(current))
        .or_else(|| tree.parent(current))
}

/// `remove` do `collapseWhitespace`: devolve o próximo nó a visitar.
fn remove_node(tree: &mut Tree, i: usize) -> Option<usize> {
    let next = tree.next_sibling(i).or_else(|| tree.parent(i));
    tree.remove(i);
    next
}

fn text_data(tree: &Tree, i: usize) -> &str {
    match &tree.nodes[i].kind {
        Kind::Text(t) => t,
        _ => "",
    }
}

fn set_text(tree: &mut Tree, i: usize, value: String) {
    tree.nodes[i].kind = Kind::Text(value);
}

/// `collapseWhitespace` do turndown.
fn collapse_whitespace(tree: &mut Tree, root: usize) {
    if tree.first_child(root).is_none() || tree.is_pre(root) {
        return;
    }
    static WS: OnceLock<Regex> = OnceLock::new();
    let ws = WS.get_or_init(|| Regex::new(r"[ \r\n\t]+").expect("regex"));
    let mut prev_text: Option<usize> = None;
    let mut keep_leading_ws = false;
    let mut prev: Option<usize> = None;
    let mut node = next_node(tree, prev, root);
    while let Some(current) = node {
        if current == root {
            break;
        }
        match tree.nodes[current].kind.clone() {
            Kind::Text(data) => {
                let mut text = ws.replace_all(&data, " ").to_string();
                let prev_ends_space = prev_text
                    .map(|p| text_data(tree, p).ends_with(' '))
                    .unwrap_or(true);
                if prev_ends_space && !keep_leading_ws && text.starts_with(' ') {
                    text.remove(0);
                }
                if text.is_empty() {
                    node = remove_node(tree, current);
                    continue;
                }
                set_text(tree, current, text);
                prev_text = Some(current);
            }
            Kind::Element { .. } => {
                if tree.is_block(current) || tree.name(current) == "BR" {
                    if let Some(p) = prev_text {
                        let trimmed = text_data(tree, p)
                            .strip_suffix(' ')
                            .map(str::to_string)
                            .unwrap_or_else(|| text_data(tree, p).to_string());
                        set_text(tree, p, trimmed);
                    }
                    prev_text = None;
                    keep_leading_ws = false;
                } else if tree.is_void(current) || tree.is_pre(current) {
                    prev_text = None;
                    keep_leading_ws = true;
                } else if prev_text.is_some() {
                    keep_leading_ws = false;
                }
            }
            Kind::Comment => {
                node = remove_node(tree, current);
                continue;
            }
        }
        let next = next_node(tree, prev, current);
        prev = Some(current);
        node = next;
    }
    if let Some(p) = prev_text {
        let trimmed = text_data(tree, p)
            .strip_suffix(' ')
            .map(str::to_string)
            .unwrap_or_else(|| text_data(tree, p).to_string());
        let empty = trimmed.is_empty();
        set_text(tree, p, trimmed);
        if empty {
            tree.remove(p);
        }
    }
}

/// `escapeMarkdown` do turndown (as regex sem `m` só casam no início).
pub fn escape_markdown(input: &str) -> String {
    static ESCAPES: OnceLock<Vec<(Regex, &'static str)>> = OnceLock::new();
    let escapes = ESCAPES.get_or_init(|| {
        [
            (r"\\", r"\\\\"),
            (r"\*", r"\*"),
            (r"^-", r"\-"),
            (r"^\+ ", r"\+ "),
            (r"^(=+)", r"\$1"),
            (r"^(#{1,6}) ", r"\$1 "),
            (r"`", r"\`"),
            (r"^~~~", r"\~~~"),
            (r"\[", r"\["),
            (r"\]", r"\]"),
            (r"^>", r"\>"),
            (r"_", r"\_"),
            (r"^(\d+)\. ", r"$1\. "),
        ]
        .into_iter()
        .map(|(re, rep)| (Regex::new(re).expect("regex"), rep))
        .collect()
    });
    let mut out = input.to_string();
    for (re, rep) in escapes {
        out = re.replace_all(&out, *rep).to_string();
    }
    out
}

/// `edgeWhitespace`: (leading, leadingAscii, leadingNonAscii, trailing,
/// trailingNonAscii, trailingAscii).
struct Edges {
    leading: String,
    leading_ascii: String,
    leading_non_ascii: String,
    trailing: String,
    trailing_non_ascii: String,
    trailing_ascii: String,
}

fn edge_whitespace(s: &str) -> Edges {
    let chars: Vec<char> = s.chars().collect();
    let first_non_space = chars.iter().position(|c| !js_space(*c));
    let ascii_prefix = chars.iter().take_while(|c| ascii_space(**c)).count();
    match first_non_space {
        None => {
            let leading_ascii: String = chars[..ascii_prefix].iter().collect();
            let leading_non_ascii: String = chars[ascii_prefix..].iter().collect();
            Edges {
                leading: s.to_string(),
                leading_ascii,
                leading_non_ascii,
                trailing: String::new(),
                trailing_non_ascii: String::new(),
                trailing_ascii: String::new(),
            }
        }
        Some(first) => {
            let last = chars.iter().rposition(|c| !js_space(*c)).unwrap_or(first);
            let tail = &chars[last + 1..];
            let ascii_suffix = tail.iter().rev().take_while(|c| ascii_space(**c)).count();
            let split = tail.len() - ascii_suffix;
            Edges {
                leading: chars[..first].iter().collect(),
                leading_ascii: chars[..ascii_prefix.min(first)].iter().collect(),
                leading_non_ascii: chars[ascii_prefix.min(first)..first].iter().collect(),
                trailing: tail.iter().collect(),
                trailing_non_ascii: tail[..split].iter().collect(),
                trailing_ascii: tail[split..].iter().collect(),
            }
        }
    }
}

fn is_flanked_by_whitespace(tree: &Tree, i: usize, left: bool) -> bool {
    let sibling = if left {
        tree.previous_sibling(i)
    } else {
        tree.next_sibling(i)
    };
    let Some(s) = sibling else {
        return false;
    };
    let test = |t: &str| {
        if left {
            t.ends_with(' ')
        } else {
            t.starts_with(' ')
        }
    };
    match &tree.nodes[s].kind {
        Kind::Text(t) => test(t),
        Kind::Element { .. } if !tree.is_block(s) => test(&tree.text_content(s)),
        _ => false,
    }
}

fn flanking_whitespace(tree: &Tree, i: usize) -> (String, String) {
    if tree.is_block(i) {
        return (String::new(), String::new());
    }
    let edges = edge_whitespace(&tree.text_content(i));
    let mut leading = edges.leading;
    let mut trailing = edges.trailing;
    if !edges.leading_ascii.is_empty() && is_flanked_by_whitespace(tree, i, true) {
        leading = edges.leading_non_ascii;
    }
    if !edges.trailing_ascii.is_empty() && is_flanked_by_whitespace(tree, i, false) {
        trailing = edges.trailing_non_ascii;
    }
    (leading, trailing)
}

fn trim_leading_newlines(s: &str) -> &str {
    s.trim_start_matches('\n')
}

fn trim_trailing_newlines(s: &str) -> &str {
    s.trim_end_matches('\n')
}

fn trim_newlines(s: &str) -> &str {
    trim_trailing_newlines(trim_leading_newlines(s))
}

/// `join` do turndown.
fn join(output: &str, replacement: &str) -> String {
    let s1 = trim_trailing_newlines(output);
    let s2 = trim_leading_newlines(replacement);
    let nls = (output.len() - s1.len()).max(replacement.len() - s2.len());
    let separator = &"\n\n"[..nls.min(2)];
    format!("{s1}{separator}{s2}")
}

fn clean_attribute(attr: Option<&str>) -> String {
    static RE: OnceLock<Regex> = OnceLock::new();
    let re = RE.get_or_init(|| Regex::new(r"(\n+\s*)+").expect("regex"));
    match attr {
        Some(a) if !a.is_empty() => re.replace_all(a, "\n").to_string(),
        _ => String::new(),
    }
}

fn escape_link_destination(destination: &str) -> String {
    let mut escaped = String::new();
    for c in destination.chars() {
        if matches!(c, '<' | '>' | '(' | ')') {
            escaped.push('\\');
        }
        escaped.push(c);
    }
    if escaped.contains(' ') {
        format!("<{escaped}>")
    } else {
        escaped
    }
}

fn escape_link_title(title: &str) -> String {
    title.replace('"', "\\\"")
}

/// O `Number(x)` do JS para o atributo `start`, formatado como o JS.
fn js_number_string(value: &str, index: usize) -> String {
    let trimmed = js_trim(value);
    let parsed = if trimmed.is_empty() {
        Some(0.0)
    } else {
        trimmed.parse::<f64>().ok().filter(|n| n.is_finite())
    };
    match parsed {
        Some(n) => {
            let total = n + index as f64;
            if total.fract() == 0.0 && total.abs() < 1e21 {
                format!("{}", total as i64)
            } else {
                format!("{total}")
            }
        }
        None => "NaN".to_string(),
    }
}

fn replace_line_starts(content: &str, prefix: &str) -> String {
    let mut out = String::from(prefix);
    for c in content.chars() {
        out.push(c);
        if matches!(c, '\n' | '\r' | '\u{2028}' | '\u{2029}') {
            out.push_str(prefix);
        }
    }
    out
}

struct Converter {
    tree: Tree,
}

impl Converter {
    fn process(&self, parent: usize) -> String {
        let mut output = String::new();
        for &child in &self.tree.nodes[parent].children {
            let replacement = match &self.tree.nodes[child].kind {
                Kind::Text(t) => {
                    if self.tree.is_code(child) {
                        t.clone()
                    } else {
                        escape_markdown(t)
                    }
                }
                Kind::Element { .. } => self.replacement_for_node(child),
                Kind::Comment => String::new(),
            };
            output = join(&output, &replacement);
        }
        output
    }

    fn replacement_for_node(&self, i: usize) -> String {
        let mut content = self.process(i);
        let (leading, trailing) = flanking_whitespace(&self.tree, i);
        if !leading.is_empty() || !trailing.is_empty() {
            content = js_trim(&content).to_string();
        }
        format!("{leading}{}{trailing}", self.apply_rule(i, content))
    }

    fn apply_rule(&self, i: usize, content: String) -> String {
        let tree = &self.tree;
        let name = tree.name(i).to_string();
        if tree.is_blank(i) {
            return if tree.is_block(i) {
                "\n\n".to_string()
            } else {
                String::new()
            };
        }
        match name.as_str() {
            "P" => return format!("\n\n{content}\n\n"),
            "BR" => return "  \n".to_string(),
            "H1" | "H2" | "H3" | "H4" | "H5" | "H6" => {
                let level: usize = name[1..].parse().unwrap_or(1);
                if level < 3 {
                    let underline = (if level == 1 { "=" } else { "-" }).repeat(js_len(&content));
                    return format!("\n\n{content}\n{underline}\n\n");
                }
                return format!("\n\n{} {content}\n\n", "#".repeat(level));
            }
            "BLOCKQUOTE" => {
                let quoted = replace_line_starts(trim_newlines(&content), "> ");
                return format!("\n\n{quoted}\n\n");
            }
            "UL" | "OL" => {
                let parent = tree.parent(i);
                let nested = parent
                    .map(|p| tree.name(p) == "LI" && tree.last_element_child(p) == Some(i))
                    .unwrap_or(false);
                return if nested {
                    format!("\n{content}")
                } else {
                    format!("\n\n{content}\n\n")
                };
            }
            "LI" => {
                let mut prefix = "*   ".to_string();
                if let Some(p) = tree.parent(i) {
                    if tree.name(p) == "OL" {
                        let index = tree.nodes[p]
                            .children
                            .iter()
                            .filter(|c| tree.is_element(**c))
                            .position(|c| *c == i)
                            .unwrap_or(0);
                        let number = match tree.attr(p, "start") {
                            Some(start) if !start.is_empty() => js_number_string(start, index),
                            _ => (index + 1).to_string(),
                        };
                        prefix = format!("{number}.  ");
                    }
                }
                let is_paragraph = content.ends_with('\n');
                let mut body = trim_newlines(&content).to_string();
                if is_paragraph {
                    body.push('\n');
                }
                let indent = format!("\n{}", " ".repeat(js_len(&prefix)));
                let body = body.replace('\n', &indent);
                let tail = if tree.next_sibling(i).is_some() {
                    "\n"
                } else {
                    ""
                };
                return format!("{prefix}{body}{tail}");
            }
            "PRE" => {
                if let Some(first) = tree.first_child(i) {
                    if tree.name(first) == "CODE" {
                        let code = tree.text_content(first).replace('\n', "\n    ");
                        return format!("\n\n    {code}\n\n");
                    }
                }
            }
            "HR" => return "\n\n* * *\n\n".to_string(),
            "A" => {
                if let Some(href) = tree.attr(i, "href").filter(|h| !h.is_empty()) {
                    let title = escape_link_title(&clean_attribute(tree.attr(i, "title")));
                    let title_part = if title.is_empty() {
                        String::new()
                    } else {
                        format!(" \"{title}\"")
                    };
                    return format!("[{content}]({}{title_part})", escape_link_destination(href));
                }
            }
            "EM" | "I" => {
                if js_trim(&content).is_empty() {
                    return String::new();
                }
                return format!("_{content}_");
            }
            "STRONG" | "B" => {
                if js_trim(&content).is_empty() {
                    return String::new();
                }
                return format!("**{content}**");
            }
            "CODE" => {
                let has_siblings =
                    tree.previous_sibling(i).is_some() || tree.next_sibling(i).is_some();
                let is_code_block = tree
                    .parent(i)
                    .map(|p| tree.name(p) == "PRE")
                    .unwrap_or(false)
                    && !has_siblings;
                if !is_code_block {
                    return inline_code(&content);
                }
            }
            "IMG" => {
                let alt = escape_markdown(&clean_attribute(tree.attr(i, "alt")));
                let src = escape_link_destination(tree.attr(i, "src").unwrap_or(""));
                let title = clean_attribute(tree.attr(i, "title"));
                let title_part = if title.is_empty() {
                    String::new()
                } else {
                    format!(" \"{}\"", escape_link_title(&title))
                };
                return if src.is_empty() {
                    String::new()
                } else {
                    format!("![{alt}]({src}{title_part})")
                };
            }
            _ => {}
        }
        if tree.is_block(i) {
            format!("\n\n{content}\n\n")
        } else {
            content
        }
    }
}

/// A regra `code` (código inline) do turndown.
fn inline_code(content: &str) -> String {
    if content.is_empty() {
        return String::new();
    }
    static NL: OnceLock<Regex> = OnceLock::new();
    let nl = NL.get_or_init(|| Regex::new(r"\r?\n|\r").expect("regex"));
    let content = nl.replace_all(content, " ").to_string();
    let chars: Vec<char> = content.chars().collect();
    let padded = chars.len() >= 3
        && chars[0] == ' '
        && chars[chars.len() - 1] == ' '
        && chars[1..chars.len() - 1].iter().any(|c| *c != ' ');
    let extra = if content.starts_with('`') || content.ends_with('`') || padded {
        " "
    } else {
        ""
    };
    // Todas as sequências de crases; o delimitador cresce até não coincidir
    // com nenhuma.
    let mut runs: Vec<usize> = Vec::new();
    let mut count = 0usize;
    for c in content.chars() {
        if c == '`' {
            count += 1;
        } else if count > 0 {
            runs.push(count);
            count = 0;
        }
    }
    if count > 0 {
        runs.push(count);
    }
    let mut size = 1usize;
    while runs.contains(&size) {
        size += 1;
    }
    let delimiter = "`".repeat(size);
    format!("{delimiter}{extra}{content}{extra}{delimiter}")
}

/// `TurndownService().turndown(html)` com as opções default.
pub fn turndown(html: &str) -> String {
    if html.is_empty() {
        return String::new();
    }
    let wrapped = format!("<x-turndown id=\"turndown-root\">{html}</x-turndown>");
    let opts = html5ever::ParseOpts {
        tree_builder: html5ever::tree_builder::TreeBuilderOpts {
            // O domino do turndown parseia com scripting desligado.
            scripting_enabled: false,
            ..Default::default()
        },
        ..Default::default()
    };
    let dom: RcDom = html5ever::parse_document(RcDom::default(), opts).one(wrapped);
    let Some(root_handle) = find_root(&dom.document) else {
        return String::new();
    };
    let mut tree = Tree { nodes: Vec::new() };
    let Some(root) = copy_subtree(&root_handle, None, &mut tree) else {
        return String::new();
    };
    collapse_whitespace(&mut tree, root);
    let converter = Converter { tree };
    let output = converter.process(root);
    // `postProcess`: sem as regras de `append` (link por referência não é o
    // default), só os cortes das pontas.
    let start = output
        .find(|c: char| !matches!(c, '\t' | '\r' | '\n'))
        .unwrap_or(output.len());
    let trimmed = &output[start..];
    trimmed
        .trim_end_matches(|c: char| matches!(c, '\t' | '\r' | '\n') || js_space(c))
        .to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn basic_rules_follow_turndown_defaults() {
        assert_eq!(turndown("<h1>Oi</h1>"), "Oi\n==");
        assert_eq!(turndown("<h3>Oi</h3>"), "### Oi");
        assert_eq!(turndown("<p>a <b>b</b> <i>c</i></p>"), "a **b** _c_");
        assert_eq!(turndown("<ul><li>x</li><li>y</li></ul>"), "*   x\n*   y");
        assert_eq!(
            turndown("<ol start=\"3\"><li>x</li><li>y</li></ol>"),
            "3.  x\n4.  y"
        );
        assert_eq!(turndown("<hr>"), "* * *");
        assert_eq!(turndown("<p>1. a * b _c_</p>"), "1\\. a \\* b \\_c\\_");
        assert_eq!(turndown("<code>a`b</code>"), "``a`b``");
        assert_eq!(
            turndown("<a href=\"/x y\" title=\"t\">l</a>"),
            "[l](</x y> \"t\")"
        );
        assert_eq!(turndown("<pre><code>a\nb</code></pre>"), "    a\n    b");
        assert_eq!(
            turndown("<blockquote><p>a</p><p>b</p></blockquote>"),
            "> a\n> \n> b"
        );
    }

    #[test]
    fn head_text_goes_through_like_in_the_cli() {
        // O parser põe title/style/script dentro do x-turndown, e o turndown
        // não tem regra para eles: o texto sai cru (medido no CLI 2.1.90).
        let md = turndown(
            "<html><head><title>T</title><style>p{}</style></head><body><p>x</p></body></html>",
        );
        assert_eq!(md, "Tp{}\n\nx");
    }
}
