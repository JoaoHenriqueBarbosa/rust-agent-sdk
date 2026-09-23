//! `Skill`: carrega um skill (`SKILL.md`) no contexto da conversa.
//!
//! Referências JS: `tools/SkillTool/SkillTool.js` (validação, permissão por
//! regra `Skill(nome)`/`Skill(prefixo:*)` e por propriedades seguras, o
//! resultado `Launching skill: <nome>` com o conteúdo do skill como mensagem
//! nova), `tools/SkillTool/prompt.js` (o prompt e a listagem de skills com
//! orçamento de caracteres), `skills/loadSkillsDir.js` (leitura de
//! `<dir>/<nome>/SKILL.md`, frontmatter, `Base directory for this skill`),
//! `utils/argumentSubstitution.js` (`$ARGUMENTS`, `$0`, `$ARGUMENTS[n]`,
//! nomes de argumento), `utils/frontmatterParser.js`,
//! `utils/markdownConfigLoader.js` e `utils/promptShellExecution.js`
//! (comandos `!` embutidos no skill).
//!
//! Os skills vêm de `ToolContext::skill_directories` (os `.claude/skills` das
//! fontes de settings habilitadas, em ordem de precedência). Os skills
//! embutidos no binário do CLI (update-config, simplify, loop, claude-api,
//! ...) não existem no transporte nativo: pedir um deles dá o mesmo
//! `Unknown skill: <nome>` do JS para skill inexistente.

use std::path::{Path, PathBuf};

use async_trait::async_trait;
use serde_json::{json, Map, Value};

use crate::api::types::{ApiMessage, ContentBlock};
use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::permission::{
    DecisionReason, PermissionAsk, PermissionResult, PermissionRules, RuleBehavior,
};
use crate::types::PermissionMode;

pub struct SkillTool;

const SKILL_PROMPT: &str = r###"Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills match. Skills provide specialized capabilities and domain knowledge.

When users reference a "slash command" or "/<something>" (e.g., "/commit", "/review-pr"), they are referring to a skill. Use this tool to invoke it.

How to invoke:
- Use this tool with the skill name and optional arguments
- Examples:
  - `skill: "pdf"` - invoke the pdf skill
  - `skill: "commit", args: "-m 'Fix bug'"` - invoke with arguments
  - `skill: "review-pr", args: "123"` - invoke with arguments
  - `skill: "ms-office-suite:pdf"` - invoke using fully qualified name

Important:
- Available skills are listed in system-reminder messages in the conversation
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
- If you see a <command-name> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
"###;

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

fn parse_scalar(raw: &str) -> Value {
    let t = raw.trim();
    if t.is_empty() {
        return Value::Null;
    }
    if (t.starts_with('"') && t.ends_with('"') && t.len() >= 2)
        || (t.starts_with('\'') && t.ends_with('\'') && t.len() >= 2)
    {
        let inner = &t[1..t.len() - 1];
        return Value::String(if t.starts_with('"') {
            inner
                .replace("\\\"", "\"")
                .replace("\\n", "\n")
                .replace("\\\\", "\\")
        } else {
            inner.replace("''", "'")
        });
    }
    if t.starts_with('[') && t.ends_with(']') {
        let items: Vec<Value> = t[1..t.len() - 1]
            .split(',')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .map(parse_scalar)
            .collect();
        return Value::Array(items);
    }
    match t {
        "true" | "True" | "TRUE" => return Value::Bool(true),
        "false" | "False" | "FALSE" => return Value::Bool(false),
        "null" | "~" => return Value::Null,
        _ => {}
    }
    if let Ok(n) = t.parse::<i64>() {
        return json!(n);
    }
    if let Ok(n) = t.parse::<f64>() {
        return json!(n);
    }
    Value::String(t.to_string())
}

/// Um YAML de frontmatter no subconjunto que os skills usam: `chave:
/// valor`, listas com `-`, listas inline `[a, b]` e blocos `|`/`>`.
fn parse_yaml_subset(text: &str) -> Map<String, Value> {
    let lines: Vec<&str> = text.lines().collect();
    let mut out = Map::new();
    let mut i = 0;
    while i < lines.len() {
        let line = lines[i];
        if line.trim().is_empty() || line.trim_start().starts_with('#') || line.starts_with(' ') {
            i += 1;
            continue;
        }
        let Some((key, rest)) = line.split_once(':') else {
            i += 1;
            continue;
        };
        let key = key.trim().to_string();
        let rest = rest.trim();
        i += 1;
        if rest == "|" || rest == ">" || rest == "|-" || rest == ">-" {
            let mut block: Vec<String> = Vec::new();
            while i < lines.len() && (lines[i].starts_with(' ') || lines[i].trim().is_empty()) {
                block.push(lines[i].trim().to_string());
                i += 1;
            }
            let joined = if rest.starts_with('|') {
                block.join("\n")
            } else {
                block.join(" ")
            };
            let value = if rest.ends_with('-') {
                joined.trim_end().to_string()
            } else {
                format!("{}\n", joined.trim_end())
            };
            out.insert(key, Value::String(value));
            continue;
        }
        if rest.is_empty() {
            let mut items: Vec<Value> = Vec::new();
            while i < lines.len() && lines[i].trim_start().starts_with("- ") {
                items.push(parse_scalar(&lines[i].trim_start()[2..]));
                i += 1;
            }
            out.insert(
                key,
                if items.is_empty() {
                    Value::Null
                } else {
                    Value::Array(items)
                },
            );
            continue;
        }
        out.insert(key, parse_scalar(rest));
    }
    out
}

/// `parseFrontmatter`: o bloco entre `---` no começo e o resto do markdown.
pub fn parse_frontmatter(markdown: &str) -> (Map<String, Value>, String) {
    static RE: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
    let re = RE.get_or_init(|| regex::Regex::new(r"^---\s*\n([\s\S]*?)---\s*\n?").expect("regex"));
    match re.captures(markdown) {
        Some(caps) => {
            let whole = caps.get(0).map(|m| m.end()).unwrap_or(0);
            let text = caps.get(1).map(|m| m.as_str()).unwrap_or_default();
            (parse_yaml_subset(text), markdown[whole..].to_string())
        }
        None => (Map::new(), markdown.to_string()),
    }
}

/// `parseToolListFromCLI`: separa por vírgula e espaço fora de parênteses.
fn parse_tool_list(values: &[String]) -> Vec<String> {
    let mut out = Vec::new();
    for value in values {
        let mut current = String::new();
        let mut depth = 0i32;
        for c in value.chars() {
            match c {
                '(' => {
                    depth += 1;
                    current.push(c);
                }
                ')' => {
                    depth -= 1;
                    current.push(c);
                }
                ',' | ' ' | '\t' if depth == 0 => {
                    if !current.trim().is_empty() {
                        out.push(current.trim().to_string());
                    }
                    current.clear();
                }
                _ => current.push(c),
            }
        }
        if !current.trim().is_empty() {
            out.push(current.trim().to_string());
        }
    }
    out
}

fn value_as_string_list(value: Option<&Value>) -> Vec<String> {
    match value {
        Some(Value::String(s)) => vec![s.clone()],
        Some(Value::Array(items)) => items
            .iter()
            .filter_map(|v| v.as_str().map(str::to_string))
            .collect(),
        _ => Vec::new(),
    }
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

/// Um skill carregado de `<dir>/<nome>/SKILL.md` (o comando `prompt` do JS).
#[derive(Debug, Clone, PartialEq)]
pub struct SkillCommand {
    /// O nome (o diretório do skill).
    pub name: String,
    /// O `name` do frontmatter (`userFacingName`), quando difere.
    pub display_name: Option<String>,
    pub description: String,
    pub when_to_use: Option<String>,
    pub allowed_tools: Vec<String>,
    pub argument_names: Vec<String>,
    pub model: Option<String>,
    pub disable_model_invocation: bool,
    /// `context: fork`: o skill roda num subagente.
    pub fork_context: bool,
    /// O skill tem hooks no frontmatter (propriedade que o JS não considera
    /// segura para permitir sem perguntar).
    pub has_hooks: bool,
    /// O skill é condicional (`paths`) e só entra quando um arquivo casa.
    pub conditional: bool,
    pub base_dir: PathBuf,
    pub markdown: String,
}

impl SkillCommand {
    fn user_facing_name(&self) -> &str {
        self.display_name.as_deref().unwrap_or(&self.name)
    }

    /// `skillHasOnlySafeProperties`: sem allowed-tools e sem hooks.
    pub fn has_only_safe_properties(&self) -> bool {
        self.allowed_tools.is_empty() && !self.has_hooks
    }
}

/// `extractDescriptionFromMarkdown`.
fn description_from_markdown(content: &str, fallback: &str) -> String {
    let heading = regex::Regex::new(r"^#+\s+(.+)$").expect("regex");
    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        let text = heading
            .captures(trimmed)
            .and_then(|c| c.get(1))
            .map(|m| m.as_str().to_string())
            .unwrap_or_else(|| trimmed.to_string());
        return if text.chars().count() > 100 {
            format!("{}...", text.chars().take(97).collect::<String>())
        } else {
            text
        };
    }
    fallback.to_string()
}

/// Lê um skill de `<dir>/SKILL.md`.
fn load_skill(dir: &Path) -> Option<SkillCommand> {
    let name = dir.file_name()?.to_string_lossy().to_string();
    let raw = std::fs::read_to_string(dir.join("SKILL.md")).ok()?;
    let (frontmatter, markdown) = parse_frontmatter(&raw);
    let description = match frontmatter.get("description") {
        Some(Value::String(s)) if !s.trim().is_empty() => s.trim().to_string(),
        Some(Value::Number(n)) => n.to_string(),
        Some(Value::Bool(b)) => b.to_string(),
        _ => description_from_markdown(&markdown, "Skill"),
    };
    let model = match frontmatter.get("model").and_then(Value::as_str) {
        Some("inherit") | None => None,
        Some(m) => Some(crate::tools::agent::parse_user_specified_model(m)),
    };
    let argument_names: Vec<String> = match frontmatter.get("arguments") {
        Some(Value::String(s)) => s.split_whitespace().map(str::to_string).collect(),
        Some(Value::Array(items)) => items
            .iter()
            .filter_map(|v| v.as_str().map(str::to_string))
            .collect(),
        _ => Vec::new(),
    }
    .into_iter()
    .filter(|n| !n.trim().is_empty() && !n.chars().all(|c| c.is_ascii_digit()))
    .collect();
    let paths = value_as_string_list(frontmatter.get("paths"));
    let conditional = !paths.is_empty()
        && !paths
            .iter()
            .map(|p| p.trim_end_matches("/**"))
            .all(|p| p == "**" || p.is_empty());
    Some(SkillCommand {
        display_name: frontmatter.get("name").filter(|v| !v.is_null()).map(|v| {
            v.as_str()
                .map(str::to_string)
                .unwrap_or_else(|| v.to_string())
        }),
        name,
        description,
        when_to_use: frontmatter
            .get("when_to_use")
            .and_then(Value::as_str)
            .map(str::to_string),
        allowed_tools: parse_tool_list(&value_as_string_list(frontmatter.get("allowed-tools"))),
        argument_names,
        model,
        disable_model_invocation: matches!(
            frontmatter.get("disable-model-invocation"),
            Some(Value::Bool(true))
        ) || frontmatter
            .get("disable-model-invocation")
            .and_then(Value::as_str)
            == Some("true"),
        fork_context: frontmatter.get("context").and_then(Value::as_str) == Some("fork"),
        has_hooks: frontmatter
            .get("hooks")
            .map(|h| !h.is_null())
            .unwrap_or(false),
        conditional,
        base_dir: dir.to_path_buf(),
        markdown,
    })
}

/// Os skills disponíveis: cada `<dir>/<nome>/SKILL.md` dos diretórios, na
/// ordem dos diretórios e, dentro de cada um, por nome. Um nome repetido
/// fica com o primeiro (o de maior precedência). Skills condicionais
/// (`paths`) ficam de fora, como no JS antes de serem ativados.
pub fn load_skills(directories: &[PathBuf]) -> Vec<SkillCommand> {
    let mut skills: Vec<SkillCommand> = Vec::new();
    for dir in directories {
        let Ok(entries) = std::fs::read_dir(dir) else {
            continue;
        };
        let mut paths: Vec<PathBuf> = entries
            .filter_map(Result::ok)
            .map(|e| e.path())
            .filter(|p| p.is_dir())
            .collect();
        paths.sort();
        for path in paths {
            if let Some(skill) = load_skill(&path) {
                if skill.conditional || skills.iter().any(|s| s.name == skill.name) {
                    continue;
                }
                skills.push(skill);
            }
        }
    }
    skills
}

/// Os diretórios de skills que o JS lê para uma lista de fontes de
/// settings (`userSettings` = `~/.claude/skills`; `projectSettings` =
/// `.claude/skills` do cwd e de cada diretório acima até a home).
pub fn skill_directories_for_sources(cwd: &Path, sources: &[String]) -> Vec<PathBuf> {
    let mut dirs = Vec::new();
    let home = std::env::var_os("HOME").map(PathBuf::from);
    if sources.iter().any(|s| s == "project") {
        for ancestor in cwd.ancestors() {
            if Some(ancestor) == home.as_deref() {
                break;
            }
            dirs.push(ancestor.join(".claude").join("skills"));
        }
    }
    if sources.iter().any(|s| s == "user") {
        dirs.push(crate::tools::plan_mode::claude_config_home().join("skills"));
    }
    dirs
}

fn find_skill<'a>(name: &str, skills: &'a [SkillCommand]) -> Option<&'a SkillCommand> {
    skills
        .iter()
        .find(|s| s.name == name || s.user_facing_name() == name)
}

// ---------------------------------------------------------------------------
// Listagem para o system-reminder
// ---------------------------------------------------------------------------

const MAX_LISTING_DESC_CHARS: usize = 250;
const DEFAULT_CHAR_BUDGET: usize = 8_000;
const MIN_DESC_LENGTH: usize = 20;

fn listing_description(skill: &SkillCommand) -> String {
    let desc = match &skill.when_to_use {
        Some(w) => format!("{} - {w}", skill.description),
        None => skill.description.clone(),
    };
    if desc.chars().count() > MAX_LISTING_DESC_CHARS {
        format!(
            "{}\u{2026}",
            desc.chars()
                .take(MAX_LISTING_DESC_CHARS - 1)
                .collect::<String>()
        )
    } else {
        desc
    }
}

/// `formatCommandsWithinBudget`: a lista `- nome: descrição` com o orçamento
/// de caracteres do JS (1% da janela de contexto em caracteres, ou 8000).
pub fn format_skill_listing(skills: &[SkillCommand], context_window_tokens: Option<u64>) -> String {
    let visible: Vec<&SkillCommand> = skills
        .iter()
        .filter(|s| !s.disable_model_invocation)
        .collect();
    if visible.is_empty() {
        return String::new();
    }
    let budget = std::env::var("SLASH_COMMAND_TOOL_CHAR_BUDGET")
        .ok()
        .and_then(|v| v.parse::<usize>().ok())
        .filter(|v| *v > 0)
        .unwrap_or(match context_window_tokens {
            Some(tokens) => (tokens as f64 * 4.0 * 0.01) as usize,
            None => DEFAULT_CHAR_BUDGET,
        });
    let full: Vec<String> = visible
        .iter()
        .map(|s| format!("- {}: {}", s.name, listing_description(s)))
        .collect();
    let total: usize = full.iter().map(|e| e.chars().count()).sum::<usize>() + full.len() - 1;
    if total <= budget {
        return full.join("\n");
    }
    let overhead: usize = visible
        .iter()
        .map(|s| s.name.chars().count() + 4)
        .sum::<usize>()
        + visible.len()
        - 1;
    let max_desc = budget.saturating_sub(overhead) / visible.len();
    if max_desc < MIN_DESC_LENGTH {
        return visible
            .iter()
            .map(|s| format!("- {}", s.name))
            .collect::<Vec<_>>()
            .join("\n");
    }
    visible
        .iter()
        .map(|s| {
            let desc = listing_description(s);
            let cut = if desc.chars().count() > max_desc {
                format!(
                    "{}\u{2026}",
                    desc.chars()
                        .take(max_desc.saturating_sub(1))
                        .collect::<String>()
                )
            } else {
                desc
            };
            format!("- {}: {cut}", s.name)
        })
        .collect::<Vec<_>>()
        .join("\n")
}

/// O texto do `system-reminder` com a lista de skills (`skill_listing` em
/// `normalizeAttachmentForAPI.js`), para o engine anexar à primeira
/// mensagem do usuário. `None` quando não há skill.
pub fn skill_listing_reminder(
    skills: &[SkillCommand],
    context_window_tokens: Option<u64>,
) -> Option<String> {
    let content = format_skill_listing(skills, context_window_tokens);
    if content.is_empty() {
        return None;
    }
    Some(format!(
        "<system-reminder>\nThe following skills are available for use with the Skill tool:\n\n{content}\n</system-reminder>\n"
    ))
}

// ---------------------------------------------------------------------------
// Substituição de argumentos e comandos embutidos
// ---------------------------------------------------------------------------

/// Separa os argumentos como o `shell-quote` do JS (aspas simples e duplas).
fn parse_arguments(args: &str) -> Vec<String> {
    if args.trim().is_empty() {
        return Vec::new();
    }
    let mut out = Vec::new();
    let mut current = String::new();
    let mut in_token = false;
    let mut quote: Option<char> = None;
    let mut chars = args.chars().peekable();
    while let Some(c) = chars.next() {
        match quote {
            Some(q) => {
                if c == q {
                    quote = None;
                } else if c == '\\' && q == '"' {
                    if let Some(next) = chars.next() {
                        current.push(next);
                    }
                } else {
                    current.push(c);
                }
            }
            None => {
                if c == '\'' || c == '"' {
                    quote = Some(c);
                    in_token = true;
                } else if c.is_whitespace() {
                    if in_token {
                        out.push(std::mem::take(&mut current));
                        in_token = false;
                    }
                } else if c == '\\' {
                    if let Some(next) = chars.next() {
                        current.push(next);
                        in_token = true;
                    }
                } else {
                    current.push(c);
                    in_token = true;
                }
            }
        }
    }
    if quote.is_some() {
        return args.split_whitespace().map(str::to_string).collect();
    }
    if in_token {
        out.push(current);
    }
    out
}

/// `substituteArguments(content, args, true, argumentNames)`.
pub fn substitute_arguments(content: &str, args: &str, argument_names: &[String]) -> String {
    let parsed = parse_arguments(args);
    let original = content.to_string();
    let mut out = content.to_string();
    for (i, name) in argument_names.iter().enumerate() {
        let re = regex::Regex::new(&format!(r"\${}(?P<next>[^\[\w]|$)", regex::escape(name)))
            .expect("regex");
        let value = parsed.get(i).cloned().unwrap_or_default();
        out = re
            .replace_all(&out, |caps: &regex::Captures| {
                format!(
                    "{value}{}",
                    caps.name("next").map(|m| m.as_str()).unwrap_or("")
                )
            })
            .to_string();
    }
    let indexed = regex::Regex::new(r"\$ARGUMENTS\[(\d+)\]").expect("regex");
    out = indexed
        .replace_all(&out, |caps: &regex::Captures| {
            caps[1]
                .parse::<usize>()
                .ok()
                .and_then(|i| parsed.get(i).cloned())
                .unwrap_or_default()
        })
        .to_string();
    let positional = regex::Regex::new(r"\$(\d+)(?P<next>[^\w]|$)").expect("regex");
    out = positional
        .replace_all(&out, |caps: &regex::Captures| {
            let value = caps[1]
                .parse::<usize>()
                .ok()
                .and_then(|i| parsed.get(i).cloned())
                .unwrap_or_default();
            format!(
                "{value}{}",
                caps.name("next").map(|m| m.as_str()).unwrap_or("")
            )
        })
        .to_string();
    out = out.replace("$ARGUMENTS", args);
    if out == original && !args.is_empty() {
        out = format!("{out}\n\nARGUMENTS: {args}");
    }
    out
}

/// Os comandos `!` do skill (blocos ```` ```! ```` e `` !`cmd` ``).
fn embedded_shell_commands(text: &str) -> Vec<(String, String)> {
    let mut found = Vec::new();
    let block = regex::Regex::new(r"```!\s*\n?([\s\S]*?)\n?```").expect("regex");
    for caps in block.captures_iter(text) {
        found.push((caps[0].to_string(), caps[1].trim().to_string()));
    }
    if text.contains("!`") {
        let inline = regex::Regex::new(r"(?m)(^|\s)(!`([^`]+)`)").expect("regex");
        for caps in inline.captures_iter(text) {
            found.push((caps[2].to_string(), caps[3].trim().to_string()));
        }
    }
    found.retain(|(_, cmd)| !cmd.is_empty());
    found
}

/// Se o skill pode rodar o comando: em `bypassPermissions`, ou quando o
/// `allowed-tools` do skill libera o Bash para ele (`Bash`, `Bash(cmd)` ou
/// `Bash(prefixo:*)`).
fn shell_command_allowed(command: &str, skill: &SkillCommand, context: &ToolContext) -> bool {
    if context.mode() == PermissionMode::BypassPermissions {
        return true;
    }
    skill.allowed_tools.iter().any(|spec| {
        let rule = crate::tools::permission::ToolPermissionRule::parse(spec);
        if rule.tool_name != "Bash" {
            return false;
        }
        match rule.pattern.as_deref() {
            None => true,
            Some(p) => match p.strip_suffix(":*") {
                Some(prefix) => command == prefix || command.starts_with(&format!("{prefix} ")),
                None => command == p,
            },
        }
    })
}

/// `formatBashOutput`.
fn format_bash_output(stdout: &str, stderr: &str) -> String {
    let mut parts = Vec::new();
    if !stdout.trim().is_empty() {
        parts.push(stdout.trim().to_string());
    }
    if !stderr.trim().is_empty() {
        parts.push(format!("[stderr]\n{}", stderr.trim()));
    }
    parts.join("\n")
}

async fn run_embedded_commands(
    text: String,
    skill: &SkillCommand,
    context: &ToolContext,
) -> Result<String, String> {
    let mut result = text.clone();
    for (pattern, command) in embedded_shell_commands(&text) {
        if !shell_command_allowed(&command, skill, context) {
            return Err(format!(
                "Shell command permission check failed for pattern \"{pattern}\": {}",
                crate::tools::permission::create_permission_request_message("Bash", None)
            ));
        }
        let mut cmd = tokio::process::Command::new("bash");
        cmd.arg("-c")
            .arg(&command)
            .current_dir(&context.working_directory)
            .stdin(std::process::Stdio::null());
        context.prepare_child_env(&mut cmd);
        let output = cmd.output().await.map_err(|e| format!("[Error]\n{e}"))?;
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        if !output.status.success() {
            return Err(format!(
                "Shell command failed for pattern \"{pattern}\": {}",
                format_bash_output(&stdout, &stderr)
            ));
        }
        let rendered = format_bash_output(&stdout, &stderr);
        result = result.replacen(&pattern, &rendered, 1);
    }
    Ok(result)
}

/// O texto que o skill injeta (`getPromptForCommand`).
pub async fn skill_prompt_text(
    skill: &SkillCommand,
    args: &str,
    context: &ToolContext,
) -> Result<String, String> {
    let base = skill.base_dir.display().to_string();
    let content = format!(
        "Base directory for this skill: {base}\n\n{}",
        skill.markdown
    );
    let content = substitute_arguments(&content, args, &skill.argument_names);
    let content = content.replace("${CLAUDE_SKILL_DIR}", &base);
    run_embedded_commands(content, skill, context).await
}

fn normalized_name(skill: &str) -> String {
    let trimmed = skill.trim();
    trimmed.strip_prefix('/').unwrap_or(trimmed).to_string()
}

fn rule_matches(rule_content: &str, command_name: &str) -> bool {
    let normalized = rule_content.strip_prefix('/').unwrap_or(rule_content);
    if normalized == command_name {
        return true;
    }
    match normalized.strip_suffix(":*") {
        Some(prefix) => command_name.starts_with(prefix),
        None => false,
    }
}

#[async_trait]
impl Tool for SkillTool {
    fn name(&self) -> &str {
        "Skill"
    }

    fn description(&self) -> &str {
        SKILL_PROMPT
    }

    fn input_schema(&self) -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "skill": {
                    "description": "The skill name. E.g., \"commit\", \"review-pr\", or \"pdf\"",
                    "type": "string"
                },
                "args": {
                    "description": "Optional arguments for the skill",
                    "type": "string"
                }
            },
            "required": ["skill"],
            "additionalProperties": false
        })
    }

    /// O schema do JS é `z.object` (não estrito): chaves extras somem.
    fn preprocess_input(&self, input: Value) -> Value {
        match input {
            Value::Object(map) => {
                let mut out = Map::new();
                for key in ["skill", "args"] {
                    if let Some(v) = map.get(key) {
                        out.insert(key.to_string(), v.clone());
                    }
                }
                Value::Object(out)
            }
            other => other,
        }
    }

    async fn validate_input(&self, input: &Value, context: &ToolContext) -> Result<(), String> {
        let raw = input
            .get("skill")
            .and_then(Value::as_str)
            .unwrap_or_default();
        if raw.trim().is_empty() {
            return Err(format!("Invalid skill format: {raw}"));
        }
        let name = normalized_name(raw);
        let skills = load_skills(&context.skill_directories);
        let Some(skill) = find_skill(&name, &skills) else {
            return Err(format!("Unknown skill: {name}"));
        };
        if skill.disable_model_invocation {
            return Err(format!(
                "Skill {name} cannot be used with Skill tool due to disable-model-invocation"
            ));
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        input: &Value,
        context: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        let raw = input
            .get("skill")
            .and_then(Value::as_str)
            .unwrap_or_default();
        let name = normalized_name(raw);
        let mut updated = Map::new();
        updated.insert("skill".into(), json!(raw));
        if let Some(args) = input.get("args") {
            updated.insert("args".into(), args.clone());
        }
        let updated = Value::Object(updated);
        for rule in rules.content_rules("Skill", RuleBehavior::Deny) {
            if rule_matches(rule.pattern.as_deref().unwrap_or_default(), &name) {
                return PermissionResult::Deny {
                    message: "Skill execution blocked by permission rules".to_string(),
                    decision_reason: Some(DecisionReason::Rule {
                        rule: rule.clone(),
                        behavior: RuleBehavior::Deny,
                    }),
                };
            }
        }
        for rule in rules.content_rules("Skill", RuleBehavior::Allow) {
            if rule_matches(rule.pattern.as_deref().unwrap_or_default(), &name) {
                return PermissionResult::Allow {
                    updated_input: Some(updated),
                    decision_reason: Some(DecisionReason::Rule {
                        rule: rule.clone(),
                        behavior: RuleBehavior::Allow,
                    }),
                };
            }
        }
        let skills = load_skills(&context.skill_directories);
        if let Some(skill) = find_skill(&name, &skills) {
            if skill.has_only_safe_properties() {
                return PermissionResult::Allow {
                    updated_input: Some(updated),
                    decision_reason: None,
                };
            }
        }
        PermissionResult::Ask(PermissionAsk {
            message: format!("Execute skill: {name}"),
            updated_input: Some(updated),
            suggestions: Some(json!([
                {"type": "addRules", "rules": [{"toolName": "Skill", "ruleContent": name}],
                 "behavior": "allow", "destination": "localSettings"},
                {"type": "addRules", "rules": [{"toolName": "Skill", "ruleContent": format!("{name}:*")}],
                 "behavior": "allow", "destination": "localSettings"}
            ])),
            ..Default::default()
        })
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let raw = input
            .get("skill")
            .and_then(Value::as_str)
            .unwrap_or_default();
        let args = input
            .get("args")
            .and_then(Value::as_str)
            .unwrap_or_default();
        let name = normalized_name(raw);
        let skills = load_skills(&context.skill_directories);
        let Some(skill) = find_skill(&name, &skills) else {
            return ToolResult::error(format!("Unknown skill: {name}"));
        };
        if skill.fork_context {
            return ToolResult::error(format!(
                "Skill {name} uses context: fork, which runs the skill in a sub-agent; the native transport has no sub-agent runner for skills. Remove `context: fork` from the skill to run it inline."
            ));
        }
        let text = match skill_prompt_text(skill, args, context).await {
            Ok(text) => text,
            Err(message) => return ToolResult::error(message),
        };
        let mut data = Map::new();
        data.insert("success".into(), Value::Bool(true));
        data.insert("commandName".into(), json!(name));
        if !skill.allowed_tools.is_empty() {
            data.insert("allowedTools".into(), json!(skill.allowed_tools));
        }
        if let Some(model) = &skill.model {
            data.insert("model".into(), json!(model));
        }
        ToolResult::text(format!("Launching skill: {name}"))
            .with_tool_use_result(Value::Object(data))
            .with_new_messages(vec![ApiMessage::user(vec![ContentBlock::text(text)])])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn arguments_are_substituted_like_the_js() {
        assert_eq!(
            substitute_arguments("Do it with $ARGUMENTS.", "foo bar", &[]),
            "Do it with foo bar."
        );
        assert_eq!(
            substitute_arguments("A=$0 B=$ARGUMENTS[1]", "x \"y z\"", &[]),
            "A=x B=y z"
        );
        assert_eq!(
            substitute_arguments("sem marcador", "a", &[]),
            "sem marcador\n\nARGUMENTS: a"
        );
        assert_eq!(
            substitute_arguments("alvo: $alvo.", "prod", &["alvo".to_string()]),
            "alvo: prod."
        );
    }

    #[test]
    fn frontmatter_is_split_from_the_markdown() {
        let (fm, body) = parse_frontmatter("---\nname: demo\ndescription: Faz algo\nallowed-tools: Bash(git status:*), Read\n---\n\nCorpo\n");
        assert_eq!(fm["name"], json!("demo"));
        // O `\s*` depois do `---` final come as linhas em branco, como no JS.
        assert_eq!(body, "Corpo\n");
        let tools = parse_tool_list(&value_as_string_list(fm.get("allowed-tools")));
        assert_eq!(tools, vec!["Bash(git status:*)", "Read"]);
    }

    #[test]
    fn listing_matches_the_cli_format() {
        let skill = SkillCommand {
            name: "demo-skill".into(),
            display_name: Some("demo-skill".into()),
            description: "Demo skill for capture".into(),
            when_to_use: None,
            allowed_tools: vec![],
            argument_names: vec![],
            model: None,
            disable_model_invocation: false,
            fork_context: false,
            has_hooks: false,
            conditional: false,
            base_dir: PathBuf::from("/x"),
            markdown: String::new(),
        };
        assert_eq!(
            skill_listing_reminder(&[skill], None).unwrap(),
            "<system-reminder>\nThe following skills are available for use with the Skill tool:\n\n- demo-skill: Demo skill for capture\n</system-reminder>\n"
        );
    }
}
