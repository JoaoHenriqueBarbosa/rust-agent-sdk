//! Regras e decisões de permissão, na semântica do CLI.
//!
//! Referências JS: `utils/permissions/permissions.js` (a ordem da decisão),
//! `utils/permissions/permissionRuleParser.js` (o parse das regras),
//! `utils/permissions/filesystem/*.js` (a checagem de leitura e escrita por
//! caminho, com os diretórios de trabalho) e `cli/structuredIO.js` (o que vai
//! no `can_use_tool`).

use std::path::{Path, PathBuf};

use serde_json::{json, Value};

use crate::types::PermissionMode;

// ---------------------------------------------------------------------------
// Regras
// ---------------------------------------------------------------------------

/// Os aliases de nomes antigos que o JS normaliza ao ler uma regra
/// (`LEGACY_TOOL_NAME_ALIASES` de `permissionRuleParser.js`).
fn normalize_legacy_tool_name(name: &str) -> String {
    match name {
        "Task" => "Agent".to_string(),
        "KillShell" => "TaskStop".to_string(),
        "AgentOutputTool" | "BashOutputTool" => "TaskOutput".to_string(),
        other => other.to_string(),
    }
}

fn find_first_unescaped(s: &[char], target: char) -> Option<usize> {
    (0..s.len()).find(|&i| s[i] == target && backslashes_before(s, i).is_multiple_of(2))
}

fn find_last_unescaped(s: &[char], target: char) -> Option<usize> {
    (0..s.len())
        .rev()
        .find(|&i| s[i] == target && backslashes_before(s, i).is_multiple_of(2))
}

fn backslashes_before(s: &[char], i: usize) -> usize {
    s[..i].iter().rev().take_while(|c| **c == '\\').count()
}

fn unescape_rule_content(content: &str) -> String {
    content
        .replace("\\(", "(")
        .replace("\\)", ")")
        .replace("\\\\", "\\")
}

fn escape_rule_content(content: &str) -> String {
    content
        .replace('\\', "\\\\")
        .replace('(', "\\(")
        .replace(')', "\\)")
}

/// A single permission rule for a tool.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ToolPermissionRule {
    pub tool_name: String,
    /// O conteúdo entre parênteses (`ruleContent` do JS), quando há.
    pub pattern: Option<String>,
}

impl ToolPermissionRule {
    /// Parse de uma regra no formato do CLI (`permissionRuleValueFromString`):
    /// `Bash`, `Bash(git *)`, `Read(//etc/**)`, com `\(`/`\)` escapados.
    /// Conteúdo vazio ou `*` vira regra da tool inteira, e os nomes antigos
    /// (`Task`, `KillShell`, ...) são normalizados como no JS.
    pub fn parse(rule: &str) -> Self {
        let rule = rule.trim();
        let chars: Vec<char> = rule.chars().collect();
        let whole = || Self {
            tool_name: normalize_legacy_tool_name(rule),
            pattern: None,
        };
        let Some(open) = find_first_unescaped(&chars, '(') else {
            return whole();
        };
        let Some(close) = find_last_unescaped(&chars, ')') else {
            return whole();
        };
        if close <= open || close != chars.len() - 1 {
            return whole();
        }
        let tool_name: String = chars[..open].iter().collect();
        if tool_name.is_empty() {
            return whole();
        }
        let raw: String = chars[open + 1..close].iter().collect();
        if raw.is_empty() || raw == "*" {
            return Self {
                tool_name: normalize_legacy_tool_name(&tool_name),
                pattern: None,
            };
        }
        Self {
            tool_name: normalize_legacy_tool_name(&tool_name),
            pattern: Some(unescape_rule_content(&raw)),
        }
    }

    /// A regra de volta em texto (`permissionRuleValueToString`).
    pub fn to_rule_string(&self) -> String {
        match &self.pattern {
            None => self.tool_name.clone(),
            Some(content) => format!("{}({})", self.tool_name, escape_rule_content(content)),
        }
    }

    /// Casamento no nível da tool inteira, o `toolMatchesRule` do JS: regra
    /// com conteúdo nunca casa aqui; o nome exato casa; e `mcp__servidor` ou
    /// `mcp__servidor__*` casa todas as tools daquele servidor. `*` é uma
    /// extensão do SDK (casa qualquer tool).
    pub fn matches_tool(&self, tool_name: &str) -> bool {
        if self.pattern.is_some() {
            return false;
        }
        if self.tool_name == "*" || self.tool_name == tool_name {
            return true;
        }
        match (mcp_info(&self.tool_name), mcp_info(tool_name)) {
            (Some(rule), Some(tool)) => {
                matches!(rule.tool_name.as_deref(), None | Some("*"))
                    && rule.server_name == tool.server_name
            }
            _ => false,
        }
    }

    /// Whether this rule matches the given invocation. A rule without a
    /// pattern matches every invocation of the tool; with a pattern, the
    /// tool's primary string argument must match the glob. É a checagem
    /// genérica do SDK, que vale para qualquer tool; as tools de arquivo
    /// aplicam por cima a semântica de caminho do JS.
    fn matches(&self, tool_name: &str, input: &Value) -> bool {
        if self.pattern.is_none() {
            return self.matches_tool(tool_name);
        }
        if self.tool_name != "*" && self.tool_name != tool_name {
            return false;
        }
        match &self.pattern {
            None => true,
            Some(pattern) => primary_argument(tool_name, input)
                .map(|arg| glob_match(pattern, &arg))
                .unwrap_or(false),
        }
    }
}

/// Nome de tool MCP decomposto (`mcpInfoFromString`).
struct McpInfo {
    server_name: String,
    tool_name: Option<String>,
}

fn mcp_info(name: &str) -> Option<McpInfo> {
    let mut parts = name.split("__");
    if parts.next()? != "mcp" {
        return None;
    }
    let server = parts.next()?;
    if server.is_empty() {
        return None;
    }
    let rest: Vec<&str> = parts.collect();
    Some(McpInfo {
        server_name: server.to_string(),
        tool_name: if rest.is_empty() {
            None
        } else {
            Some(rest.join("__"))
        },
    })
}

/// The argument a rule pattern is matched against, the same convention the
/// CLI uses for rule content: the command for Bash, the path for file tools,
/// the URL for web tools.
fn primary_argument(tool_name: &str, input: &Value) -> Option<String> {
    let key = match tool_name {
        "Bash" => "command",
        "WebFetch" | "WebSearch" => "url",
        "NotebookEdit" => "notebook_path",
        _ => "file_path",
    };
    input
        .get(key)
        .and_then(|v| v.as_str())
        .map(str::to_string)
        .or_else(|| {
            // Fallback: qualquer primeiro campo string do input.
            input
                .as_object()
                .and_then(|obj| obj.values().find_map(|v| v.as_str().map(str::to_string)))
        })
}

/// Minimal glob: `*` matches any run of characters (including empty), other
/// characters match literally. Enough for CLI-style rules like `git *`.
fn glob_match(pattern: &str, text: &str) -> bool {
    fn inner(p: &[char], t: &[char]) -> bool {
        match p.split_first() {
            None => t.is_empty(),
            Some(('*', rest)) => (0..=t.len()).any(|i| inner(rest, &t[i..])),
            Some((c, rest)) => t
                .split_first()
                .map(|(tc, tr)| tc == c && inner(rest, tr))
                .unwrap_or(false),
        }
    }
    let p: Vec<char> = pattern.chars().collect();
    let t: Vec<char> = text.chars().collect();
    inner(&p, &t)
}

/// Permission rules: explicit allow/deny/ask lists.
#[derive(Debug, Clone, Default)]
pub struct PermissionRules {
    pub allow: Vec<ToolPermissionRule>,
    pub deny: Vec<ToolPermissionRule>,
    /// Regras `ask` (`alwaysAskRules` do JS): forçam a pergunta mesmo quando
    /// a tool seria permitida.
    pub ask: Vec<ToolPermissionRule>,
}

/// Result of checking permissions for a tool invocation.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PermissionDecision {
    /// Tool is explicitly allowed.
    Allow,
    /// Tool is explicitly denied with a reason.
    Deny(String),
    /// Permission must be requested from the user.
    Ask,
}

/// Comportamento de uma regra.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RuleBehavior {
    Allow,
    Deny,
    Ask,
}

impl RuleBehavior {
    fn as_str(&self) -> &'static str {
        match self {
            RuleBehavior::Allow => "allow",
            RuleBehavior::Deny => "deny",
            RuleBehavior::Ask => "ask",
        }
    }
}

impl PermissionRules {
    pub fn new() -> Self {
        Self::default()
    }

    /// Allow all tools (bypass permissions).
    pub fn allow_all() -> Self {
        Self {
            allow: vec![ToolPermissionRule {
                tool_name: "*".to_string(),
                pattern: None,
            }],
            deny: vec![],
            ask: vec![],
        }
    }

    /// Build rules from CLI-style `allowed_tools`/`disallowed_tools` lists
    /// (entries like `"Read"` or `"Bash(git *)"`).
    pub fn from_lists(allowed: &[String], disallowed: &[String]) -> Self {
        Self {
            allow: allowed
                .iter()
                .map(|r| ToolPermissionRule::parse(r))
                .collect(),
            deny: disallowed
                .iter()
                .map(|r| ToolPermissionRule::parse(r))
                .collect(),
            ask: Vec::new(),
        }
    }

    /// Add an allow rule.
    pub fn add_allow(&mut self, tool_name: impl Into<String>) {
        self.allow
            .push(ToolPermissionRule::parse(&tool_name.into()));
    }

    /// Add a deny rule.
    pub fn add_deny(&mut self, tool_name: impl Into<String>) {
        self.deny.push(ToolPermissionRule::parse(&tool_name.into()));
    }

    /// Add an ask rule.
    pub fn add_ask(&mut self, tool_name: impl Into<String>) {
        self.ask.push(ToolPermissionRule::parse(&tool_name.into()));
    }

    /// A tool denied UNCONDITIONALLY (bare deny rule, no pattern) should not
    /// even be offered to the model; this is what registry filtering asks.
    /// Segue o `filterToolsByDenyRules` do JS, inclusive `mcp__servidor` e
    /// `mcp__servidor__*`.
    pub fn is_tool_fully_denied(&self, tool_name: &str) -> bool {
        self.deny_rule_for_tool(tool_name).is_some()
    }

    /// A regra deny que casa a tool inteira (`getDenyRuleForTool`).
    pub fn deny_rule_for_tool(&self, tool_name: &str) -> Option<&ToolPermissionRule> {
        self.deny.iter().find(|r| r.matches_tool(tool_name))
    }

    /// A regra ask que casa a tool inteira (`getAskRuleForTool`).
    pub fn ask_rule_for_tool(&self, tool_name: &str) -> Option<&ToolPermissionRule> {
        self.ask.iter().find(|r| r.matches_tool(tool_name))
    }

    /// A regra allow que casa a tool inteira (`toolAlwaysAllowedRule`).
    pub fn allow_rule_for_tool(&self, tool_name: &str) -> Option<&ToolPermissionRule> {
        self.allow.iter().find(|r| r.matches_tool(tool_name))
    }

    /// As regras com conteúdo de uma tool num comportamento
    /// (`getRuleByContentsForToolName`), na ordem em que foram declaradas.
    pub fn content_rules(
        &self,
        tool_name: &str,
        behavior: RuleBehavior,
    ) -> Vec<&ToolPermissionRule> {
        let list = match behavior {
            RuleBehavior::Allow => &self.allow,
            RuleBehavior::Deny => &self.deny,
            RuleBehavior::Ask => &self.ask,
        };
        list.iter()
            .filter(|r| r.tool_name == tool_name && r.pattern.is_some())
            .collect()
    }

    /// Checagem genérica por regra, com a glob sobre o argumento principal.
    /// Deny rules take precedence over allow rules.
    pub fn check(&self, tool_name: &str, input: &Value) -> PermissionDecision {
        // Check deny rules first (deny takes precedence)
        for rule in &self.deny {
            if rule.matches(tool_name, input) {
                return PermissionDecision::Deny(format!("Tool '{}' is denied by rule", tool_name));
            }
        }

        // Check allow rules
        for rule in &self.allow {
            if rule.matches(tool_name, input) {
                return PermissionDecision::Allow;
            }
        }

        // No explicit rule: need to ask
        PermissionDecision::Ask
    }

    /// Regra com padrão que casa a invocação pela glob genérica (usada para
    /// tools sem checagem própria de conteúdo).
    pub fn pattern_rule_matching(
        &self,
        tool_name: &str,
        input: &Value,
        behavior: RuleBehavior,
    ) -> Option<&ToolPermissionRule> {
        let list = match behavior {
            RuleBehavior::Allow => &self.allow,
            RuleBehavior::Deny => &self.deny,
            RuleBehavior::Ask => &self.ask,
        };
        list.iter()
            .find(|r| r.pattern.is_some() && r.matches(tool_name, input))
    }
}

// ---------------------------------------------------------------------------
// Resultado de permissão (PermissionResult do JS)
// ---------------------------------------------------------------------------

/// Por que uma decisão foi tomada (`decisionReason` do JS).
#[derive(Debug, Clone, PartialEq)]
pub enum DecisionReason {
    /// Uma regra decidiu.
    Rule {
        rule: ToolPermissionRule,
        behavior: RuleBehavior,
    },
    /// O modo de permissão decidiu.
    Mode(PermissionMode),
    /// Um hook decidiu.
    Hook {
        hook_name: String,
        reason: Option<String>,
    },
    /// O caminho está fora dos diretórios de trabalho.
    WorkingDir(String),
    /// Checagem de segurança (arquivo sensível, padrão suspeito).
    SafetyCheck(String),
    /// Outros motivos, com o texto do JS.
    Other(String),
    /// Agente assíncrono sem canal de pergunta.
    AsyncAgent(String),
    /// O callback de permissão (a "permission prompt tool") decidiu.
    PermissionPromptTool,
}

impl DecisionReason {
    /// O `decision_reason` que vai no `can_use_tool`
    /// (`serializeDecisionReason` de `cli/structuredIO.js`): só os motivos
    /// que têm texto viajam.
    pub fn serialize_for_sdk(&self) -> Option<String> {
        match self {
            DecisionReason::Rule { .. }
            | DecisionReason::Mode(_)
            | DecisionReason::PermissionPromptTool => None,
            DecisionReason::Hook { reason, .. } => reason.clone(),
            DecisionReason::WorkingDir(reason)
            | DecisionReason::SafetyCheck(reason)
            | DecisionReason::Other(reason)
            | DecisionReason::AsyncAgent(reason) => Some(reason.clone()),
        }
    }
}

/// Dados de uma resposta `ask`/`passthrough`.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct PermissionAsk {
    /// A mensagem de pedido (vira a recusa em `dontAsk`/sem callback).
    pub message: String,
    /// Input reescrito pela checagem, quando há.
    pub updated_input: Option<Value>,
    /// `permission_suggestions` (atualizações de permissão sugeridas, na
    /// forma do `PermissionUpdateSchema` do JS).
    pub suggestions: Option<Value>,
    /// `blocked_path`: o caminho que motivou a pergunta.
    pub blocked_path: Option<String>,
    pub decision_reason: Option<DecisionReason>,
}

/// O resultado da checagem de permissão de uma tool (`checkPermissions`).
#[derive(Debug, Clone, PartialEq)]
pub enum PermissionResult {
    Allow {
        updated_input: Option<Value>,
        decision_reason: Option<DecisionReason>,
    },
    Ask(PermissionAsk),
    Deny {
        message: String,
        decision_reason: Option<DecisionReason>,
    },
    /// "Não tenho opinião": vira `ask` com a mensagem padrão se nenhuma regra
    /// ou modo permitir.
    Passthrough(PermissionAsk),
}

impl PermissionResult {
    pub fn allow() -> Self {
        PermissionResult::Allow {
            updated_input: None,
            decision_reason: None,
        }
    }

    /// Passthrough com a mensagem padrão do JS.
    pub fn passthrough(tool_name: &str) -> Self {
        PermissionResult::Passthrough(PermissionAsk {
            message: create_permission_request_message(tool_name, None),
            ..Default::default()
        })
    }

    pub fn ask(message: impl Into<String>) -> Self {
        PermissionResult::Ask(PermissionAsk {
            message: message.into(),
            ..Default::default()
        })
    }

    pub fn deny(message: impl Into<String>, decision_reason: Option<DecisionReason>) -> Self {
        PermissionResult::Deny {
            message: message.into(),
            decision_reason,
        }
    }
}

/// A mensagem de pedido de permissão (`createPermissionRequestMessage` de
/// `permissions.js`).
pub fn create_permission_request_message(
    tool_name: &str,
    decision_reason: Option<&DecisionReason>,
) -> String {
    match decision_reason {
        Some(DecisionReason::Hook { hook_name, reason }) => match reason {
            Some(reason) => format!("Hook '{hook_name}' blocked this action: {reason}"),
            None => format!("Hook '{hook_name}' requires approval for this {tool_name} command"),
        },
        // As regras do SDK chegam como `--allowedTools`/`--disallowedTools`,
        // a fonte `cliArg` do JS ("CLI argument").
        Some(DecisionReason::Rule { rule, .. }) => format!(
            "Permission rule '{}' from CLI argument requires approval for this {tool_name} command",
            rule.to_rule_string()
        ),
        Some(DecisionReason::PermissionPromptTool) => {
            format!("Tool '{tool_name}' requires approval for this {tool_name} command")
        }
        Some(DecisionReason::WorkingDir(reason))
        | Some(DecisionReason::SafetyCheck(reason))
        | Some(DecisionReason::Other(reason))
        | Some(DecisionReason::AsyncAgent(reason)) => reason.clone(),
        Some(DecisionReason::Mode(mode)) => format!(
            "Current permission mode ({}) requires approval for this {tool_name} command",
            permission_mode_title(*mode)
        ),
        None => format!(
            "Claude requested permissions to use {tool_name}, but you haven't granted it yet."
        ),
    }
}

/// `permissionModeTitle` do JS.
fn permission_mode_title(mode: PermissionMode) -> &'static str {
    match mode {
        PermissionMode::Default => "Default",
        PermissionMode::Plan => "Plan Mode",
        PermissionMode::AcceptEdits => "Accept edits",
        PermissionMode::BypassPermissions => "Bypass Permissions",
        PermissionMode::DontAsk => "Don't Ask",
        PermissionMode::Auto => "Auto mode",
    }
}

/// `DENIAL_WORKAROUND_GUIDANCE` do JS.
pub const DENIAL_WORKAROUND_GUIDANCE: &str = "IMPORTANT: You *may* attempt to accomplish this action using other tools that might naturally be used to accomplish this goal, e.g. using head instead of cat. But you *should not* attempt to work around this denial in malicious ways, e.g. do not use your ability to run tests to execute non-test actions. You should only try to work around this restriction in reasonable ways that do not attempt to bypass the intent behind this denial. If you believe this capability is essential to complete the user's request, STOP and explain to the user what you were trying to do and why you need this permission. Let the user decide how to proceed.";

/// `DONT_ASK_REJECT_MESSAGE` do JS.
pub fn dont_ask_reject_message(tool_name: &str) -> String {
    format!(
        "Permission to use {tool_name} has been denied because Claude Code is running in don't ask mode. {DENIAL_WORKAROUND_GUIDANCE}"
    )
}

// ---------------------------------------------------------------------------
// Caminhos (utils/path.js e utils/permissions/filesystem/*)
// ---------------------------------------------------------------------------

fn home_dir() -> Option<PathBuf> {
    std::env::var_os("HOME").map(PathBuf::from)
}

/// `expandPath` do JS: `~`, relativo ao `base`, e normalização.
pub fn expand_path(path: &str, base: &Path) -> PathBuf {
    let trimmed = path.trim();
    if trimmed.is_empty() {
        return crate::tools::file_state::normalize_path(base);
    }
    if trimmed == "~" {
        if let Some(home) = home_dir() {
            return home;
        }
    }
    if let Some(rest) = trimmed.strip_prefix("~/") {
        if let Some(home) = home_dir() {
            return crate::tools::file_state::normalize_path(&home.join(rest));
        }
    }
    let p = Path::new(trimmed);
    if p.is_absolute() {
        crate::tools::file_state::normalize_path(p)
    } else {
        crate::tools::file_state::normalize_path(&base.join(p))
    }
}

/// `getPathsForPermissionCheck`: o caminho, cada alvo da cadeia de symlinks
/// e, para caminho que ainda não existe, o ancestral existente mais fundo já
/// resolvido. Uma regra ou diretório de trabalho precisa valer para TODOS.
pub fn paths_for_permission_check(path: &Path) -> Vec<PathBuf> {
    let mut out: Vec<PathBuf> = vec![path.to_path_buf()];
    let text = path.to_string_lossy();
    if text.starts_with("//") || text.starts_with("\\\\") {
        return out;
    }
    let mut current = path.to_path_buf();
    let mut visited: Vec<PathBuf> = Vec::new();
    for _ in 0..40 {
        if visited.contains(&current) {
            break;
        }
        visited.push(current.clone());
        let meta = match std::fs::symlink_metadata(&current) {
            Ok(m) => m,
            Err(_) => {
                if current == path {
                    if let Some(resolved) = resolve_deepest_existing_ancestor(path) {
                        if !out.contains(&resolved) {
                            out.push(resolved);
                        }
                    }
                }
                break;
            }
        };
        if !meta.file_type().is_symlink() {
            break;
        }
        let Ok(target) = std::fs::read_link(&current) else {
            break;
        };
        let absolute = if target.is_absolute() {
            target
        } else {
            current.parent().map(|p| p.join(&target)).unwrap_or(target)
        };
        let absolute = crate::tools::file_state::normalize_path(&absolute);
        if !out.contains(&absolute) {
            out.push(absolute.clone());
        }
        current = absolute;
    }
    out
}

/// O ancestral existente mais fundo, resolvido com `realpath`, mais o resto
/// do caminho que ainda não existe. `None` quando nada muda.
fn resolve_deepest_existing_ancestor(path: &Path) -> Option<PathBuf> {
    let mut tail: Vec<std::ffi::OsString> = Vec::new();
    let mut cursor = path.to_path_buf();
    loop {
        if cursor.exists() {
            let real = std::fs::canonicalize(&cursor).ok()?;
            let mut full = real;
            for part in tail.iter().rev() {
                full.push(part);
            }
            return if full == path { None } else { Some(full) };
        }
        let name = cursor.file_name()?.to_os_string();
        tail.push(name);
        cursor = cursor.parent()?.to_path_buf();
    }
}

fn normalize_private(p: &str) -> String {
    let p = if let Some(rest) = p.strip_prefix("/private/var/") {
        format!("/var/{rest}")
    } else {
        p.to_string()
    };
    if p == "/private/tmp" {
        return "/tmp".to_string();
    }
    if let Some(rest) = p.strip_prefix("/private/tmp/") {
        return format!("/tmp/{rest}");
    }
    p
}

/// `path.posix.relative` para caminhos absolutos já normalizados.
pub fn relative_path(from: &Path, to: &Path) -> String {
    let from: Vec<_> = from.components().collect();
    let to: Vec<_> = to.components().collect();
    let common = from
        .iter()
        .zip(to.iter())
        .take_while(|(a, b)| a == b)
        .count();
    let mut parts: Vec<String> = Vec::new();
    for _ in common..from.len() {
        parts.push("..".to_string());
    }
    for c in &to[common..] {
        parts.push(c.as_os_str().to_string_lossy().to_string());
    }
    parts.join("/")
}

fn contains_path_traversal(p: &str) -> bool {
    p == ".." || p.starts_with("../") || p.contains("/../") || p.ends_with("/..")
}

/// `pathInWorkingPath`: o caminho está dentro do diretório (ou é ele), com a
/// comparação sem caixa do JS.
pub fn path_in_working_path(path: &Path, working: &Path) -> bool {
    let a = normalize_private(&path.to_string_lossy()).to_lowercase();
    let b = normalize_private(&working.to_string_lossy()).to_lowercase();
    let rel = relative_path(Path::new(&b), Path::new(&a));
    if rel.is_empty() {
        return true;
    }
    if contains_path_traversal(&rel) {
        return false;
    }
    !rel.starts_with('/')
}

/// `pathInAllowedWorkingPath`: TODOS os caminhos checados precisam cair em
/// algum diretório de trabalho (cada um com seus symlinks resolvidos).
pub fn path_in_allowed_working_path(paths: &[PathBuf], working_dirs: &[PathBuf]) -> bool {
    let resolved: Vec<PathBuf> = working_dirs
        .iter()
        .flat_map(|wd| paths_for_permission_check(wd))
        .collect();
    paths
        .iter()
        .all(|p| resolved.iter().any(|wd| path_in_working_path(p, wd)))
}

fn has_suspicious_windows_path_pattern(path: &str) -> bool {
    static TILDE_DIGIT: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    static TRAILING: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    static DEVICE: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    static DOTS: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    let tilde = TILDE_DIGIT.get_or_init(|| regex::Regex::new(r"~\d").expect("regex"));
    let trailing = TRAILING.get_or_init(|| regex::Regex::new(r"[.\s]+$").expect("regex"));
    let device = DEVICE.get_or_init(|| {
        regex::Regex::new(r"(?i)\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$").expect("regex")
    });
    let dots = DOTS.get_or_init(|| regex::Regex::new(r"(^|/|\\)\.{3,}(/|\\|$)").expect("regex"));
    tilde.is_match(path)
        || path.starts_with("\\\\?\\")
        || path.starts_with("\\\\.\\")
        || path.starts_with("//?/")
        || path.starts_with("//./")
        || trailing.is_match(path)
        || device.is_match(path)
        || dots.is_match(path)
}

/// Qual família de regras de caminho consultar (`toolType` do JS): `read`
/// usa as regras `Read(...)`, `edit` usa as regras `Edit(...)`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PathRuleKind {
    Read,
    Edit,
}

/// Casa um padrão estilo gitignore contra um caminho relativo com `/`.
fn gitignore_match(pattern: &str, relative: &str) -> bool {
    let mut pat = pattern.to_string();
    let dir_only = pat.ends_with('/') && pat.len() > 1;
    if dir_only {
        pat.pop();
    }
    let anchored = pat.starts_with('/') || pat.trim_start_matches('/').contains('/');
    let pat = pat.trim_start_matches('/').to_string();
    if pat.is_empty() {
        return false;
    }
    let segments: Vec<&str> = relative.split('/').collect();
    // O caminho casa se ele mesmo ou algum diretório pai casar (o `ignore`
    // do Node ignora tudo abaixo de um diretório ignorado).
    for end in 1..=segments.len() {
        let candidate = segments[..end].join("/");
        let is_full = end == segments.len();
        if dir_only && is_full {
            // Não dá para saber se o alvo é diretório sem tocar no disco; o
            // alvo casa pelos pais.
            continue;
        }
        if anchored {
            if glob_path_match(&pat, &candidate) {
                return true;
            }
        } else {
            let base = segments[end - 1];
            if glob_path_match(&pat, base) {
                return true;
            }
        }
    }
    false
}

/// Glob de caminho: `**` atravessa `/`, `*` e `?` não.
fn glob_path_match(pattern: &str, text: &str) -> bool {
    fn inner(p: &[char], t: &[char]) -> bool {
        match p {
            [] => t.is_empty(),
            ['*', '*', '/', rest @ ..] => {
                inner(rest, t) || (0..t.len()).any(|i| t[i] == '/' && inner(rest, &t[i + 1..]))
            }
            ['*', '*', rest @ ..] => (0..=t.len()).any(|i| inner(rest, &t[i..])),
            ['*', rest @ ..] => (0..=t.len())
                .take_while(|&i| i == 0 || t[i - 1] != '/')
                .any(|i| inner(rest, &t[i..])),
            ['?', rest @ ..] => matches!(t.first(), Some(c) if *c != '/') && inner(rest, &t[1..]),
            [c, rest @ ..] => t.first() == Some(c) && inner(rest, &t[1..]),
        }
    }
    let p: Vec<char> = pattern.chars().collect();
    let t: Vec<char> = text.chars().collect();
    inner(&p, &t)
}

/// `matchingRuleForInput`: a primeira regra de caminho (Read ou Edit) do
/// comportamento pedido que casa o caminho, com as raízes do JS: `//x` é
/// absoluto, `~/x` é relativo à home, `/x` é relativo ao diretório do
/// projeto, e o resto é relativo ao cwd sem âncora.
pub fn matching_path_rule<'a>(
    rules: &'a PermissionRules,
    path: &Path,
    kind: PathRuleKind,
    behavior: RuleBehavior,
    cwd: &Path,
) -> Option<&'a ToolPermissionRule> {
    let tool_name = match kind {
        PathRuleKind::Read => "Read",
        PathRuleKind::Edit => "Edit",
    };
    for rule in rules.content_rules(tool_name, behavior) {
        let Some(pattern) = rule.pattern.as_deref() else {
            continue;
        };
        let (root, relative_pattern): (PathBuf, String) =
            if let Some(rest) = pattern.strip_prefix("//") {
                (PathBuf::from("/"), format!("/{rest}"))
            } else if let Some(rest) = pattern.strip_prefix("~/") {
                match home_dir() {
                    Some(home) => (home, format!("/{rest}")),
                    None => continue,
                }
            } else if pattern.starts_with('/') {
                (cwd.to_path_buf(), pattern.to_string())
            } else {
                (
                    cwd.to_path_buf(),
                    pattern.strip_prefix("./").unwrap_or(pattern).to_string(),
                )
            };
        let adjusted = relative_pattern
            .strip_suffix("/**")
            .map(str::to_string)
            .unwrap_or(relative_pattern);
        let rel = relative_path(&root, path);
        if rel.is_empty() || rel.starts_with("../") || rel == ".." {
            continue;
        }
        if gitignore_match(&adjusted, &rel) {
            return Some(rule);
        }
    }
    None
}

/// Os diretórios de trabalho da sessão: o cwd e os adicionais.
pub fn working_directories(ctx: &crate::tools::framework::ToolContext) -> Vec<PathBuf> {
    let mut dirs = vec![ctx.working_directory.clone()];
    dirs.extend(ctx.additional_directories.iter().cloned());
    dirs
}

/// `getDirectoryForPath`.
fn directory_for_path(path: &Path) -> PathBuf {
    if std::fs::metadata(path).map(|m| m.is_dir()).unwrap_or(false) {
        return path.to_path_buf();
    }
    path.parent()
        .map(Path::to_path_buf)
        .unwrap_or_else(|| path.to_path_buf())
}

/// `createReadRuleSuggestion`.
fn read_rule_suggestion(dir: &Path) -> Option<Value> {
    let text = dir.to_string_lossy().to_string();
    if text == "/" {
        return None;
    }
    let content = if dir.is_absolute() {
        format!("/{text}/**")
    } else {
        format!("{text}/**")
    };
    Some(json!({
        "type": "addRules",
        "rules": [{"toolName": "Read", "ruleContent": content}],
        "behavior": "allow",
        "destination": "session",
    }))
}

/// Operação para `generateSuggestions`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SuggestionOperation {
    Read,
    Write,
}

/// `generateSuggestions` de `filesystem/generateSuggestions.js`.
pub fn generate_suggestions(
    path: &Path,
    operation: SuggestionOperation,
    mode: PermissionMode,
    paths: &[PathBuf],
    working_dirs: &[PathBuf],
) -> Value {
    let outside = !path_in_allowed_working_path(paths, working_dirs);
    if operation == SuggestionOperation::Read && outside {
        let dir = directory_for_path(path);
        let list: Vec<Value> = paths_for_permission_check(&dir)
            .iter()
            .filter_map(|d| read_rule_suggestion(d))
            .collect();
        return Value::Array(list);
    }
    let suggest_accept_edits = matches!(mode, PermissionMode::Default | PermissionMode::Plan);
    let mut updates: Vec<Value> = Vec::new();
    if suggest_accept_edits {
        updates.push(json!({"type": "setMode", "mode": "acceptEdits", "destination": "session"}));
    }
    if operation == SuggestionOperation::Write && outside {
        let dir = directory_for_path(path);
        let dirs: Vec<String> = paths_for_permission_check(&dir)
            .iter()
            .map(|d| d.to_string_lossy().to_string())
            .collect();
        updates.push(json!({
            "type": "addDirectories",
            "directories": dirs,
            "destination": "session",
        }));
    }
    Value::Array(updates)
}

const DANGEROUS_FILES: &[&str] = &[
    ".gitconfig",
    ".gitmodules",
    ".bashrc",
    ".bash_profile",
    ".zshrc",
    ".zprofile",
    ".profile",
    ".ripgreprc",
    ".mcp.json",
    ".claude.json",
];

const DANGEROUS_DIRECTORIES: &[&str] = &[".git", ".vscode", ".idea", ".claude"];

/// `isDangerousFilePathToAutoEdit`.
fn is_dangerous_file_path_to_auto_edit(path: &Path) -> bool {
    let text = path.to_string_lossy();
    if text.starts_with("\\\\") || text.starts_with("//") {
        return true;
    }
    let segments: Vec<String> = text.split('/').map(|s| s.to_string()).collect();
    for (i, segment) in segments.iter().enumerate() {
        let lower = segment.to_lowercase();
        for dir in DANGEROUS_DIRECTORIES {
            if lower != *dir {
                continue;
            }
            if *dir == ".claude" {
                if let Some(next) = segments.get(i + 1) {
                    if next.to_lowercase() == "worktrees" {
                        break;
                    }
                }
            }
            return true;
        }
    }
    if let Some(file_name) = segments.last() {
        let lower = file_name.to_lowercase();
        if DANGEROUS_FILES.iter().any(|f| *f == lower) {
            return true;
        }
    }
    false
}

/// `isClaudeConfigFilePath` (settings do projeto e `.claude/commands`,
/// `.claude/agents`, `.claude/skills` do cwd).
fn is_claude_config_file_path(path: &Path, cwd: &Path) -> bool {
    let lower = path.to_string_lossy().to_lowercase();
    if lower.ends_with("/.claude/settings.json") || lower.ends_with("/.claude/settings.local.json")
    {
        return true;
    }
    ["commands", "agents", "skills"]
        .iter()
        .any(|d| path_in_working_path(path, &cwd.join(".claude").join(d)))
}

/// `checkReadPermissionForTool`: a permissão de leitura por caminho (Read,
/// Glob, Grep). Dentro dos diretórios de trabalho é permitido; fora,
/// pergunta com `workingDir` e sugestões; as regras `Read(...)` do
/// chamador valem por cima.
pub fn check_read_permission(
    raw_path: &str,
    ctx: &crate::tools::framework::ToolContext,
    rules: &PermissionRules,
) -> PermissionResult {
    let cwd = ctx.working_directory.as_path();
    let absolute = expand_path(raw_path, cwd);
    let paths = paths_for_permission_check(&absolute);
    for p in &paths {
        let text = p.to_string_lossy();
        if text.starts_with("\\\\") || text.starts_with("//") {
            return PermissionResult::Ask(PermissionAsk {
                message: format!("Claude requested permissions to read from {raw_path}, which appears to be a UNC path that could access network resources."),
                decision_reason: Some(DecisionReason::Other("UNC path detected (defense-in-depth check)".to_string())),
                ..Default::default()
            });
        }
    }
    for p in &paths {
        if has_suspicious_windows_path_pattern(&p.to_string_lossy()) {
            return PermissionResult::Ask(PermissionAsk {
                message: format!("Claude requested permissions to read from {raw_path}, which contains a suspicious Windows path pattern that requires manual approval."),
                decision_reason: Some(DecisionReason::Other("Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification".to_string())),
                ..Default::default()
            });
        }
    }
    for p in &paths {
        if let Some(rule) =
            matching_path_rule(rules, p, PathRuleKind::Read, RuleBehavior::Deny, cwd)
        {
            return PermissionResult::Deny {
                message: format!("Permission to read {raw_path} has been denied."),
                decision_reason: Some(DecisionReason::Rule {
                    rule: rule.clone(),
                    behavior: RuleBehavior::Deny,
                }),
            };
        }
    }
    for p in &paths {
        if let Some(rule) = matching_path_rule(rules, p, PathRuleKind::Read, RuleBehavior::Ask, cwd)
        {
            return PermissionResult::Ask(PermissionAsk {
                message: format!(
                    "Claude requested permissions to read from {raw_path}, but you haven't granted it yet."
                ),
                decision_reason: Some(DecisionReason::Rule {
                    rule: rule.clone(),
                    behavior: RuleBehavior::Ask,
                }),
                ..Default::default()
            });
        }
    }
    let edit = check_write_permission(raw_path, ctx, rules);
    if matches!(edit, PermissionResult::Allow { .. }) {
        return edit;
    }
    let working_dirs = working_directories(ctx);
    if path_in_allowed_working_path(&paths, &working_dirs) {
        return PermissionResult::Allow {
            updated_input: None,
            decision_reason: Some(DecisionReason::Mode(PermissionMode::Default)),
        };
    }
    // Arquivos internos legíveis (`checkReadableInternalPath`): no nativo, o
    // diretório onde os resultados grandes de tool são persistidos.
    if let Some(dir) = &ctx.tool_results_dir {
        let dir = crate::tools::file_state::normalize_path(dir);
        if absolute == dir || absolute.starts_with(&dir) {
            return PermissionResult::Allow {
                updated_input: None,
                decision_reason: Some(DecisionReason::Other(
                    "Tool result files are allowed for reading".to_string(),
                )),
            };
        }
    }
    if let Some(rule) = matching_path_rule(
        rules,
        &absolute,
        PathRuleKind::Read,
        RuleBehavior::Allow,
        cwd,
    ) {
        return PermissionResult::Allow {
            updated_input: None,
            decision_reason: Some(DecisionReason::Rule {
                rule: rule.clone(),
                behavior: RuleBehavior::Allow,
            }),
        };
    }
    PermissionResult::Ask(PermissionAsk {
        message: format!(
            "Claude requested permissions to read from {raw_path}, but you haven't granted it yet."
        ),
        suggestions: Some(generate_suggestions(
            &absolute,
            SuggestionOperation::Read,
            ctx.mode(),
            &paths,
            &working_dirs,
        )),
        blocked_path: None,
        decision_reason: Some(DecisionReason::WorkingDir(
            "Path is outside allowed working directories".to_string(),
        )),
        updated_input: None,
    })
}

/// `checkWritePermissionForTool`: a permissão de escrita por caminho (Edit,
/// Write, NotebookEdit). Nunca é automática em modo default: em
/// `acceptEdits` é permitida dentro dos diretórios de trabalho; arquivos
/// sensíveis sempre perguntam.
pub fn check_write_permission(
    raw_path: &str,
    ctx: &crate::tools::framework::ToolContext,
    rules: &PermissionRules,
) -> PermissionResult {
    let cwd = ctx.working_directory.as_path();
    let absolute = expand_path(raw_path, cwd);
    let paths = paths_for_permission_check(&absolute);
    for p in &paths {
        if let Some(rule) =
            matching_path_rule(rules, p, PathRuleKind::Edit, RuleBehavior::Deny, cwd)
        {
            return PermissionResult::Deny {
                message: format!("Permission to edit {raw_path} has been denied."),
                decision_reason: Some(DecisionReason::Rule {
                    rule: rule.clone(),
                    behavior: RuleBehavior::Deny,
                }),
            };
        }
    }
    // `checkEditableInternalPath`: o launch.json de preview no cwd.
    if absolute.to_string_lossy().to_lowercase()
        == cwd
            .join(".claude")
            .join("launch.json")
            .to_string_lossy()
            .to_lowercase()
    {
        return PermissionResult::Allow {
            updated_input: None,
            decision_reason: Some(DecisionReason::Other(
                "Preview launch config is allowed for writing".to_string(),
            )),
        };
    }
    let working_dirs = working_directories(ctx);
    // `checkPathSafetyForAutoEdit`.
    let mut safety: Option<String> = None;
    if paths
        .iter()
        .any(|p| has_suspicious_windows_path_pattern(&p.to_string_lossy()))
    {
        safety = Some(format!("Claude requested permissions to write to {raw_path}, which contains a suspicious Windows path pattern that requires manual approval."));
    } else if paths.iter().any(|p| is_claude_config_file_path(p, cwd)) {
        safety = Some(format!(
            "Claude requested permissions to write to {raw_path}, but you haven't granted it yet."
        ));
    } else if paths.iter().any(|p| is_dangerous_file_path_to_auto_edit(p)) {
        safety = Some(format!(
            "Claude requested permissions to edit {raw_path} which is a sensitive file."
        ));
    }
    if let Some(message) = safety {
        return PermissionResult::Ask(PermissionAsk {
            message: message.clone(),
            suggestions: Some(generate_suggestions(
                &absolute,
                SuggestionOperation::Write,
                ctx.mode(),
                &paths,
                &working_dirs,
            )),
            decision_reason: Some(DecisionReason::SafetyCheck(message)),
            ..Default::default()
        });
    }
    for p in &paths {
        if let Some(rule) = matching_path_rule(rules, p, PathRuleKind::Edit, RuleBehavior::Ask, cwd)
        {
            return PermissionResult::Ask(PermissionAsk {
                message: format!(
                    "Claude requested permissions to write to {raw_path}, but you haven't granted it yet."
                ),
                decision_reason: Some(DecisionReason::Rule {
                    rule: rule.clone(),
                    behavior: RuleBehavior::Ask,
                }),
                ..Default::default()
            });
        }
    }
    let in_working_dir = path_in_allowed_working_path(&paths, &working_dirs);
    if ctx.mode() == PermissionMode::AcceptEdits && in_working_dir {
        return PermissionResult::Allow {
            updated_input: None,
            decision_reason: Some(DecisionReason::Mode(PermissionMode::AcceptEdits)),
        };
    }
    if let Some(rule) = matching_path_rule(
        rules,
        &absolute,
        PathRuleKind::Edit,
        RuleBehavior::Allow,
        cwd,
    ) {
        return PermissionResult::Allow {
            updated_input: None,
            decision_reason: Some(DecisionReason::Rule {
                rule: rule.clone(),
                behavior: RuleBehavior::Allow,
            }),
        };
    }
    PermissionResult::Ask(PermissionAsk {
        message: format!(
            "Claude requested permissions to write to {raw_path}, but you haven't granted it yet."
        ),
        suggestions: Some(generate_suggestions(
            &absolute,
            SuggestionOperation::Write,
            ctx.mode(),
            &paths,
            &working_dirs,
        )),
        decision_reason: if in_working_dir {
            None
        } else {
            Some(DecisionReason::WorkingDir(
                "Path is outside allowed working directories".to_string(),
            ))
        },
        ..Default::default()
    })
}

impl RuleBehavior {
    /// Texto do comportamento, para diagnósticos.
    pub fn label(&self) -> &'static str {
        self.as_str()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_allow_all() {
        let rules = PermissionRules::allow_all();
        assert_eq!(
            rules.check("anything", &serde_json::json!({})),
            PermissionDecision::Allow
        );
    }

    #[test]
    fn test_deny_takes_precedence() {
        let mut rules = PermissionRules::new();
        rules.add_allow("Bash");
        rules.add_deny("Bash");

        assert!(matches!(
            rules.check("Bash", &serde_json::json!({})),
            PermissionDecision::Deny(_)
        ));
    }

    #[test]
    fn test_specific_allow() {
        let mut rules = PermissionRules::new();
        rules.add_allow("Read");

        assert_eq!(
            rules.check("Read", &serde_json::json!({})),
            PermissionDecision::Allow
        );
        assert_eq!(
            rules.check("Write", &serde_json::json!({})),
            PermissionDecision::Ask
        );
    }

    #[test]
    fn test_no_rules_defaults_to_ask() {
        let rules = PermissionRules::new();
        assert_eq!(
            rules.check("Bash", &serde_json::json!({})),
            PermissionDecision::Ask
        );
    }

    #[test]
    fn test_wildcard_deny() {
        let mut rules = PermissionRules::new();
        rules.add_deny("*");

        assert!(matches!(
            rules.check("anything", &serde_json::json!({})),
            PermissionDecision::Deny(_)
        ));
    }

    #[test]
    fn pattern_rule_matches_the_command_glob() {
        let rules = PermissionRules::from_lists(&["Bash(git *)".to_string()], &[]);
        assert_eq!(
            rules.check("Bash", &serde_json::json!({"command": "git status"})),
            PermissionDecision::Allow
        );
        assert_eq!(
            rules.check("Bash", &serde_json::json!({"command": "rm -rf /"})),
            PermissionDecision::Ask
        );
    }

    #[test]
    fn pattern_deny_only_blocks_matching_invocations() {
        let rules = PermissionRules::from_lists(&[], &["Bash(rm *)".to_string()]);
        assert!(matches!(
            rules.check("Bash", &serde_json::json!({"command": "rm -rf x"})),
            PermissionDecision::Deny(_)
        ));
        assert_eq!(
            rules.check("Bash", &serde_json::json!({"command": "ls"})),
            PermissionDecision::Ask
        );
        // Deny com pattern NÃO remove a tool do registry.
        assert!(!rules.is_tool_fully_denied("Bash"));
    }

    #[test]
    fn bare_deny_marks_the_tool_fully_denied() {
        let rules = PermissionRules::from_lists(&[], &["WebFetch".to_string()]);
        assert!(rules.is_tool_fully_denied("WebFetch"));
        assert!(!rules.is_tool_fully_denied("Read"));
    }

    #[test]
    fn glob_matcher_basics() {
        assert!(glob_match("git *", "git push origin"));
        assert!(glob_match("*", ""));
        assert!(glob_match("a*c", "abc"));
        assert!(!glob_match("a*c", "abd"));
    }

    #[test]
    fn parse_follows_the_js_rule_parser() {
        // Conteúdo vazio ou `*` é a tool inteira; escapes são desfeitos.
        assert_eq!(ToolPermissionRule::parse("Bash(*)").pattern, None);
        assert_eq!(ToolPermissionRule::parse("Bash()").pattern, None);
        assert_eq!(
            ToolPermissionRule::parse("Bash(echo \\(x\\))")
                .pattern
                .as_deref(),
            Some("echo (x)")
        );
        // Nomes antigos viram os atuais, como no LEGACY_TOOL_NAME_ALIASES.
        assert_eq!(ToolPermissionRule::parse("Task").tool_name, "Agent");
        assert_eq!(ToolPermissionRule::parse("KillShell").tool_name, "TaskStop");
    }

    #[test]
    fn mcp_server_rules_cover_every_tool_of_the_server() {
        let rules = PermissionRules::from_lists(
            &["mcp__omnia__*".to_string()],
            &["mcp__outro".to_string()],
        );
        assert!(rules.allow_rule_for_tool("mcp__omnia__search").is_some());
        assert!(rules.allow_rule_for_tool("mcp__omniax__search").is_none());
        assert!(rules.is_tool_fully_denied("mcp__outro__qualquer"));
        assert!(!rules.is_tool_fully_denied("mcp__omnia__search"));
    }

    #[test]
    fn working_path_containment() {
        assert!(path_in_working_path(Path::new("/w/a/b"), Path::new("/w")));
        assert!(path_in_working_path(Path::new("/w"), Path::new("/w")));
        assert!(!path_in_working_path(Path::new("/wx/a"), Path::new("/w")));
        assert!(!path_in_working_path(
            Path::new("/etc/passwd"),
            Path::new("/w")
        ));
    }

    #[test]
    fn path_rules_use_gitignore_roots() {
        let rules = PermissionRules::from_lists(
            &[],
            &["Read(//etc/**)".to_string(), "Read(*.env)".to_string()],
        );
        let cwd = Path::new("/proj");
        assert!(matching_path_rule(
            &rules,
            Path::new("/etc/passwd"),
            PathRuleKind::Read,
            RuleBehavior::Deny,
            cwd
        )
        .is_some());
        // No gitignore o `*` casa vazio e o ponto inicial não é especial:
        // `*.env` pega `.env` em qualquer nível.
        assert!(matching_path_rule(
            &rules,
            Path::new("/proj/sub/.env"),
            PathRuleKind::Read,
            RuleBehavior::Deny,
            cwd
        )
        .is_some());
        assert!(matching_path_rule(
            &rules,
            Path::new("/proj/sub/prod.env"),
            PathRuleKind::Read,
            RuleBehavior::Deny,
            cwd
        )
        .is_some());
        assert!(matching_path_rule(
            &rules,
            Path::new("/proj/a.txt"),
            PathRuleKind::Read,
            RuleBehavior::Deny,
            cwd
        )
        .is_none());
    }

    #[test]
    fn read_inside_cwd_is_allowed_and_outside_asks_with_working_dir_reason() {
        let dir = tempfile::tempdir().unwrap();
        let ctx = crate::tools::framework::ToolContext {
            working_directory: dir.path().to_path_buf(),
            ..Default::default()
        };
        let rules = PermissionRules::default();
        let inside = dir.path().join("a.txt");
        assert!(matches!(
            check_read_permission(&inside.to_string_lossy(), &ctx, &rules),
            PermissionResult::Allow { .. }
        ));
        match check_read_permission("/etc/hostname", &ctx, &rules) {
            PermissionResult::Ask(ask) => {
                assert_eq!(
                    ask.message,
                    "Claude requested permissions to read from /etc/hostname, but you haven't granted it yet."
                );
                assert_eq!(
                    ask.decision_reason
                        .and_then(|r| r.serialize_for_sdk())
                        .as_deref(),
                    Some("Path is outside allowed working directories")
                );
                let suggestions = ask.suggestions.expect("sugestões");
                assert_eq!(suggestions[0]["rules"][0]["ruleContent"], "//etc/**");
                assert_eq!(suggestions[0]["destination"], "session");
            }
            other => panic!("esperava ask, veio {other:?}"),
        }
    }

    #[test]
    fn write_asks_in_default_mode_and_is_allowed_in_accept_edits_inside_cwd() {
        let dir = tempfile::tempdir().unwrap();
        let rules = PermissionRules::default();
        let target = dir.path().join("x.txt");
        let ctx = crate::tools::framework::ToolContext {
            working_directory: dir.path().to_path_buf(),
            ..Default::default()
        };
        assert!(matches!(
            check_write_permission(&target.to_string_lossy(), &ctx, &rules),
            PermissionResult::Ask(_)
        ));
        let ctx = crate::tools::framework::ToolContext {
            working_directory: dir.path().to_path_buf(),
            permission_mode: PermissionMode::AcceptEdits,
            ..Default::default()
        };
        assert!(matches!(
            check_write_permission(&target.to_string_lossy(), &ctx, &rules),
            PermissionResult::Allow { .. }
        ));
        // Arquivo sensível pergunta mesmo em acceptEdits.
        let git = dir.path().join(".git").join("config");
        assert!(matches!(
            check_write_permission(&git.to_string_lossy(), &ctx, &rules),
            PermissionResult::Ask(_)
        ));
    }
}
