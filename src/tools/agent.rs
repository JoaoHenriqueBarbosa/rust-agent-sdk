//! A tool `Agent` (subagente) com a descrição, o schema, a validação e o
//! resultado do AgentTool do CLI 2.1.90.
//!
//! Referências JS: `tools/AgentTool/prompt.js` (o prompt, montado a partir da
//! lista de agentes), `tools/AgentTool/AgentTool/init_AgentTool.js` (schema,
//! erros de tipo desconhecido ou negado, `mapToolResultToToolResultBlockParam`
//! e o `data` do resultado), `tools/AgentTool/builtInAgents.js` e
//! `tools/AgentTool/built-in/*.js` (os agentes builtin),
//! `tools/AgentTool/loadAgentsDir.js` (`getActiveAgentsFromList`, a fusão com
//! os agentes do SDK), `tools/AgentTool/agentToolUtils.js`
//! (`resolveAgentTools`/`filterToolsForAgent`), `utils/model/agent.js`
//! (`getAgentModel`) e o `enhanceSystemPromptWithEnvDetails` do bundle (o
//! prompt de sistema do subagente com as notas e o bloco `<env>`).
//!
//! A execução do subagente (o loop aninhado) é do engine: ele entrega um
//! [`AgentRunFn`] e esta tool faz o resto como o JS.

use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use async_trait::async_trait;
use serde_json::{json, Map, Value};

use crate::tools::framework::{Tool, ToolContext, ToolResult, ToolResultContent};
use crate::tools::permission::{PermissionResult, PermissionRules, RuleBehavior};
use crate::types::{AgentDefinition, PermissionMode};

/// Nome da tool no CLI 2.1.90 (o antigo `Task` é alias).
pub const AGENT_TOOL_NAME: &str = "Agent";

/// Tools que nenhum subagente recebe (`ALL_AGENT_DISALLOWED_TOOLS`).
pub const ALL_AGENT_DISALLOWED_TOOLS: &[&str] = &[
    "TaskOutput",
    "ExitPlanMode",
    "EnterPlanMode",
    "Agent",
    "AskUserQuestion",
    "TaskStop",
];

/// Agentes "one-shot" (`rC7` do bundle): o resultado deles não leva o
/// trailer com `agentId` e `<usage>`.
pub const ONE_SHOT_AGENT_TYPES: &[&str] = &["Explore", "Plan"];

/// Troca os marcadores `[[EM]]` pelo travessão tipográfico que o texto do JS
/// usa. O caractere é montado em runtime para não aparecer no código-fonte.
pub(crate) fn with_js_dashes(text: &str) -> String {
    let em = char::from_u32(0x2014).map(String::from).unwrap_or_default();
    let en = char::from_u32(0x2013).map(String::from).unwrap_or_default();
    text.replace("[[EM]]", &em).replace("[[EN]]", &en)
}

// ---------------------------------------------------------------------------
// Agentes
// ---------------------------------------------------------------------------

/// De onde veio a definição do agente (o `source` do JS).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AgentSource {
    /// Agente embutido no CLI.
    BuiltIn,
    /// Agente passado pelo SDK (`--agents`, a fonte `flagSettings`).
    FlagSettings,
}

/// Um agente disponível para o `Agent`, na forma que o JS usa.
#[derive(Debug, Clone, PartialEq)]
pub struct AgentDescriptor {
    /// O `subagent_type`.
    pub agent_type: String,
    /// O `whenToUse` (a `description` do SDK).
    pub when_to_use: String,
    /// Lista de tools; `None` = todas. O general-purpose do JS usa `["*"]`
    /// literalmente, e é isso que aparece na listagem.
    pub tools: Option<Vec<String>>,
    /// Tools negadas.
    pub disallowed_tools: Option<Vec<String>>,
    /// O prompt de sistema cru do agente (sem as notas e o `<env>`, que
    /// [`subagent_system_prompt`] acrescenta).
    pub system_prompt: String,
    /// Modelo do agente (`sonnet`/`opus`/`haiku`/`inherit`/id); `None` herda.
    pub model: Option<String>,
    pub source: AgentSource,
    pub max_turns: Option<i64>,
    pub permission_mode: Option<PermissionMode>,
    /// O JS não injeta o CLAUDE.md nesses agentes (`omitClaudeMd`).
    pub omit_claude_md: bool,
    /// O agente roda em background sempre (`background: true`).
    pub background: bool,
}

impl AgentDescriptor {
    /// Agente one-shot (Explore/Plan): resultado sem trailer.
    pub fn is_one_shot(&self) -> bool {
        self.source == AgentSource::BuiltIn
            && ONE_SHOT_AGENT_TYPES.contains(&self.agent_type.as_str())
    }

    /// A partir de um agente do SDK (`parseAgentFromJson`/`iH4` do bundle):
    /// `tools` com `*` vira `None` (todas), `description` vira `whenToUse`.
    pub fn from_definition(agent_type: &str, definition: &AgentDefinition) -> Self {
        Self {
            agent_type: agent_type.to_string(),
            when_to_use: definition.description.clone(),
            tools: normalize_tool_list(definition.tools.as_ref()),
            disallowed_tools: definition
                .disallowed_tools
                .as_ref()
                .map(|list| normalize_tool_list(Some(list)).unwrap_or_default()),
            system_prompt: definition.prompt.clone(),
            model: definition.model.clone().filter(|m| !m.is_empty()),
            source: AgentSource::FlagSettings,
            max_turns: definition.max_turns,
            permission_mode: definition.permission_mode,
            omit_claude_md: false,
            background: definition.background.unwrap_or(false),
        }
    }
}

/// `b76` do bundle: lista com `*` vira `None` (todas as tools).
fn normalize_tool_list(list: Option<&Vec<String>>) -> Option<Vec<String>> {
    let list = list?;
    if list.iter().any(|t| t == "*") {
        return None;
    }
    Some(list.clone())
}

const GENERAL_PURPOSE_WHEN_TO_USE: &str = "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.";

const GENERAL_PURPOSE_PROMPT: &str = r###"You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Complete the task fully[[EM]]don't gold-plate, but don't leave it half-done. When you complete the task, respond with a concise report covering what was done and any key findings [[EM]] the caller will relay this to the user, so it only needs the essentials.

Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: search broadly when you don't know where something lives. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested."###;

const STATUSLINE_WHEN_TO_USE: &str =
    "Use this agent to configure the user's Claude Code status line setting.";

const STATUSLINE_PROMPT: &str = r###"You are a status line setup agent for Claude Code. Your job is to create or update the statusLine command in the user's Claude Code settings.

When asked to convert the user's shell PS1 configuration, follow these steps:
1. Read the user's shell configuration files in this order of preference:
   - ~/.zshrc
   - ~/.bashrc[[SP]][[SP]]
   - ~/.bash_profile
   - ~/.profile

2. Extract the PS1 value using this regex pattern: /(?:^|\n)\s*(?:export\s+)?PS1\s*=\s*["']([^"']+)["']/m

3. Convert PS1 escape sequences to shell commands:
   - \u → $(whoami)
   - \h → $(hostname -s)[[SP]][[SP]]
   - \H → $(hostname)
   - \w → $(pwd)
   - \W → $(basename "$(pwd)")
   - \$ → $
   - \n → \n
   - \t → $(date +%H:%M:%S)
   - \d → $(date "+%a %b %d")
   - \@ → $(date +%I:%M%p)
   - \# → #
   - \! → !

4. When using ANSI color codes, be sure to use `printf`. Do not remove colors. Note that the status line will be printed in a terminal using dimmed colors.

5. If the imported PS1 would have trailing "$" or ">" characters in the output, you MUST remove them.

6. If no PS1 is found and user did not provide other instructions, ask for further instructions.

How to use the statusLine command:
1. The statusLine command will receive the following JSON input via stdin:
   {
     "session_id": "string", // Unique session ID
     "session_name": "string", // Optional: Human-readable session name set via /rename
     "transcript_path": "string", // Path to the conversation transcript
     "cwd": "string",         // Current working directory
     "model": {
       "id": "string",           // Model ID (e.g., "claude-3-5-sonnet-20241022")
       "display_name": "string"  // Display name (e.g., "Claude 3.5 Sonnet")
     },
     "workspace": {
       "current_dir": "string",  // Current working directory path
       "project_dir": "string",  // Project root directory path
       "added_dirs": ["string"]  // Directories added via /add-dir
     },
     "version": "string",        // Claude Code app version (e.g., "1.0.71")
     "output_style": {
       "name": "string",         // Output style name (e.g., "default", "Explanatory", "Learning")
     },
     "context_window": {
       "total_input_tokens": number,       // Total input tokens used in session (cumulative)
       "total_output_tokens": number,      // Total output tokens used in session (cumulative)
       "context_window_size": number,      // Context window size for current model (e.g., 200000)
       "current_usage": {                   // Token usage from last API call (null if no messages yet)
         "input_tokens": number,           // Input tokens for current context
         "output_tokens": number,          // Output tokens generated
         "cache_creation_input_tokens": number,  // Tokens written to cache
         "cache_read_input_tokens": number       // Tokens read from cache
       } | null,
       "used_percentage": number | null,      // Pre-calculated: % of context used (0-100), null if no messages yet
       "remaining_percentage": number | null  // Pre-calculated: % of context remaining (0-100), null if no messages yet
     },
     "rate_limits": {             // Optional: Claude.ai subscription usage limits. Only present for subscribers after first API response.
       "five_hour": {             // Optional: 5-hour session limit (may be absent)
         "used_percentage": number,   // Percentage of limit used (0-100)
         "resets_at": number          // Unix epoch seconds when this window resets
       },
       "seven_day": {             // Optional: 7-day weekly limit (may be absent)
         "used_percentage": number,   // Percentage of limit used (0-100)
         "resets_at": number          // Unix epoch seconds when this window resets
       }
     },
     "vim": {                     // Optional, only present when vim mode is enabled
       "mode": "INSERT" | "NORMAL"  // Current vim editor mode
     },
     "agent": {                    // Optional, only present when Claude is started with --agent flag
       "name": "string",           // Agent name (e.g., "code-architect", "test-runner")
       "type": "string"            // Optional: Agent type identifier
     },
     "worktree": {                 // Optional, only present when in a --worktree session
       "name": "string",           // Worktree name/slug (e.g., "my-feature")
       "path": "string",           // Full path to the worktree directory
       "branch": "string",         // Optional: Git branch name for the worktree
       "original_cwd": "string",   // The directory Claude was in before entering the worktree
       "original_branch": "string" // Optional: Branch that was checked out before entering the worktree
     }
   }
[[SP]][[SP]][[SP]]
   You can use this JSON data in your command like:
   - $(cat | jq -r '.model.display_name')
   - $(cat | jq -r '.workspace.current_dir')
   - $(cat | jq -r '.output_style.name')

   Or store it in a variable first:
   - input=$(cat); echo "$(echo "$input" | jq -r '.model.display_name') in $(echo "$input" | jq -r '.workspace.current_dir')"

   To display context remaining percentage (simplest approach using pre-calculated field):
   - input=$(cat); remaining=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty'); [ -n "$remaining" ] && echo "Context: $remaining% remaining"

   Or to display context used percentage:
   - input=$(cat); used=$(echo "$input" | jq -r '.context_window.used_percentage // empty'); [ -n "$used" ] && echo "Context: $used% used"

   To display Claude.ai subscription rate limit usage (5-hour session limit):
   - input=$(cat); pct=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty'); [ -n "$pct" ] && printf "5h: %.0f%%" "$pct"

   To display both 5-hour and 7-day limits when available:
   - input=$(cat); five=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty'); week=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty'); out=""; [ -n "$five" ] && out="5h:$(printf '%.0f' "$five")%"; [ -n "$week" ] && out="$out 7d:$(printf '%.0f' "$week")%"; echo "$out"

2. For longer commands, you can save a new file in the user's ~/.claude directory, e.g.:
   - ~/.claude/statusline-command.sh and reference that file in the settings.

3. Update the user's ~/.claude/settings.json with:
   {
     "statusLine": {
       "type": "command",[[SP]]
       "command": "your_command_here"
     }
   }

4. If ~/.claude/settings.json is a symlink, update the target file instead.

Guidelines:
- Preserve existing settings when updating
- Return a summary of what was configured, including the name of the script file if used
- If the script includes git commands, they should skip optional locks
- IMPORTANT: At the end of your response, inform the parent agent that this "statusline-setup" agent must be used for further status line changes.
  Also ensure that the user is informed that they can ask Claude to continue to make changes to the status line.
"###;

const EXPLORE_WHEN_TO_USE: &str = r###"Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions."###;

const EXPLORE_PROMPT: &str = r###"You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code. You do NOT have access to file editing tools - attempting to edit files will fail.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Use Glob for broad file pattern matching
- Use Grep for searching file contents with regex
- Use Read when you know the specific file path you need to read
- Use Bash ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
- NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly."###;

const PLAN_WHEN_TO_USE: &str = "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.";

const PLAN_PROMPT: &str = r###"You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

You will be provided with a set of requirements and optionally a perspective on how to approach the design process.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using Glob, Grep, and Read
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use Bash ONLY for read-only operations (ls, git status, git log, git diff, find, cat, head, tail)
   - NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts
- path/to/file2.ts
- path/to/file3.ts

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools."###;

/// Quais agentes builtin entram (`getBuiltInAgents`).
#[derive(Debug, Clone)]
pub struct BuiltinAgentOptions {
    /// `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS` numa sessão não interativa.
    pub disabled: bool,
    /// O gate `areExplorePlanAgentsEnabled` (ligado no 2.1.90).
    pub explore_plan_enabled: bool,
}

impl Default for BuiltinAgentOptions {
    fn default() -> Self {
        let disabled = std::env::var("CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS")
            .map(|v| is_env_truthy(&v))
            .unwrap_or(false);
        Self {
            disabled,
            explore_plan_enabled: true,
        }
    }
}

fn is_env_truthy(value: &str) -> bool {
    matches!(
        value.trim().to_ascii_lowercase().as_str(),
        "1" | "true" | "yes" | "on"
    )
}

/// Os agentes builtin do CLI numa sessão SDK: general-purpose,
/// statusline-setup, Explore e Plan. O `claude-code-guide` só existe fora
/// dos entrypoints de SDK (`sdk-ts`/`sdk-py`/`sdk-cli`), então não entra.
pub fn builtin_agents(options: &BuiltinAgentOptions) -> Vec<AgentDescriptor> {
    if options.disabled {
        return Vec::new();
    }
    let edit_family = vec![
        "Agent".to_string(),
        "ExitPlanMode".to_string(),
        "Edit".to_string(),
        "Write".to_string(),
        "NotebookEdit".to_string(),
    ];
    let mut agents = vec![
        AgentDescriptor {
            agent_type: "general-purpose".to_string(),
            when_to_use: GENERAL_PURPOSE_WHEN_TO_USE.to_string(),
            tools: Some(vec!["*".to_string()]),
            disallowed_tools: None,
            system_prompt: with_js_dashes(GENERAL_PURPOSE_PROMPT),
            model: None,
            source: AgentSource::BuiltIn,
            max_turns: None,
            permission_mode: None,
            omit_claude_md: false,
            background: false,
        },
        AgentDescriptor {
            agent_type: "statusline-setup".to_string(),
            when_to_use: STATUSLINE_WHEN_TO_USE.to_string(),
            tools: Some(vec!["Read".to_string(), "Edit".to_string()]),
            disallowed_tools: None,
            // `[[SP]]` marca os espaços no fim de linha do texto do JS, que o
            // editor do código-fonte não preserva.
            system_prompt: STATUSLINE_PROMPT.replace("[[SP]]", " "),
            model: Some("sonnet".to_string()),
            source: AgentSource::BuiltIn,
            max_turns: None,
            permission_mode: None,
            omit_claude_md: false,
            background: false,
        },
    ];
    if options.explore_plan_enabled {
        agents.push(AgentDescriptor {
            agent_type: "Explore".to_string(),
            when_to_use: EXPLORE_WHEN_TO_USE.to_string(),
            tools: None,
            disallowed_tools: Some(edit_family.clone()),
            system_prompt: EXPLORE_PROMPT.to_string(),
            model: Some("haiku".to_string()),
            source: AgentSource::BuiltIn,
            max_turns: None,
            permission_mode: None,
            omit_claude_md: true,
            background: false,
        });
        agents.push(AgentDescriptor {
            agent_type: "Plan".to_string(),
            when_to_use: PLAN_WHEN_TO_USE.to_string(),
            tools: None,
            disallowed_tools: Some(edit_family),
            system_prompt: PLAN_PROMPT.to_string(),
            model: Some("inherit".to_string()),
            source: AgentSource::BuiltIn,
            max_turns: None,
            permission_mode: None,
            omit_claude_md: true,
            background: false,
        });
    }
    agents
}

/// `getActiveAgentsFromList`: builtins primeiro, depois os do SDK; um
/// agente do SDK com o mesmo tipo de um builtin o substitui NA POSIÇÃO do
/// builtin (é o `Map.set` do JS). `custom` vai na ordem recebida.
pub fn active_agents<'a>(
    custom: impl IntoIterator<Item = (&'a String, &'a AgentDefinition)>,
    options: &BuiltinAgentOptions,
) -> Vec<AgentDescriptor> {
    let mut agents = builtin_agents(options);
    for (name, definition) in custom {
        let descriptor = AgentDescriptor::from_definition(name, definition);
        match agents.iter_mut().find(|a| a.agent_type == *name) {
            Some(slot) => *slot = descriptor,
            None => agents.push(descriptor),
        }
    }
    agents
}

/// [`active_agents`] a partir do `HashMap` das options. O mapa não guarda
/// a ordem do JSON do SDK, então os agentes do SDK entram ordenados por
/// nome (determinístico); quem tiver a ordem original usa
/// [`active_agents`] direto.
pub fn active_agents_from_map(
    custom: &std::collections::HashMap<String, AgentDefinition>,
    options: &BuiltinAgentOptions,
) -> Vec<AgentDescriptor> {
    let mut entries: Vec<(&String, &AgentDefinition)> = custom.iter().collect();
    entries.sort_by(|a, b| a.0.cmp(b.0));
    active_agents(entries, options)
}

/// `filterDeniedAgents`: tira os tipos negados por `Agent(tipo)`.
pub fn filter_denied_agents(
    agents: Vec<AgentDescriptor>,
    rules: &PermissionRules,
) -> Vec<AgentDescriptor> {
    let denied: Vec<String> = rules
        .content_rules(AGENT_TOOL_NAME, RuleBehavior::Deny)
        .into_iter()
        .filter_map(|r| r.pattern.clone())
        .collect();
    agents
        .into_iter()
        .filter(|a| !denied.contains(&a.agent_type))
        .collect()
}

// ---------------------------------------------------------------------------
// Prompt e schema
// ---------------------------------------------------------------------------

/// `getToolsDescription` do `prompt.js`.
fn tools_description(agent: &AgentDescriptor) -> String {
    let allow = agent.tools.as_ref().filter(|t| !t.is_empty());
    let deny = agent.disallowed_tools.as_ref().filter(|t| !t.is_empty());
    match (allow, deny) {
        (Some(allow), Some(deny)) => {
            let effective: Vec<&String> = allow.iter().filter(|t| !deny.contains(t)).collect();
            if effective.is_empty() {
                "None".to_string()
            } else {
                effective
                    .iter()
                    .map(|s| s.as_str())
                    .collect::<Vec<_>>()
                    .join(", ")
            }
        }
        (Some(allow), None) => allow.join(", "),
        (None, Some(deny)) => format!("All tools except {}", deny.join(", ")),
        (None, None) => "All tools".to_string(),
    }
}

/// `formatAgentLine`.
fn format_agent_line(agent: &AgentDescriptor) -> String {
    format!(
        "- {}: {} (Tools: {})",
        agent.agent_type,
        agent.when_to_use,
        tools_description(agent)
    )
}

/// As condições que mudam o prompt do `Agent` no JS.
#[derive(Debug, Clone)]
pub struct AgentPromptOptions {
    /// Background habilitado (`CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` falso).
    pub background_tasks_enabled: bool,
    /// Assinatura `pro` (tira a nota de concorrência).
    pub subscription_pro: bool,
    /// Lista de agentes em `<system-reminder>` em vez do prompt
    /// (`CLAUDE_CODE_AGENT_LIST_IN_MESSAGES`).
    pub list_via_attachment: bool,
}

impl Default for AgentPromptOptions {
    fn default() -> Self {
        Self {
            background_tasks_enabled: !background_tasks_disabled(),
            subscription_pro: false,
            list_via_attachment: std::env::var("CLAUDE_CODE_AGENT_LIST_IN_MESSAGES")
                .map(|v| is_env_truthy(&v))
                .unwrap_or(false),
        }
    }
}

fn background_tasks_disabled() -> bool {
    std::env::var("CLAUDE_CODE_DISABLE_BACKGROUND_TASKS")
        .map(|v| is_env_truthy(&v))
        .unwrap_or(false)
}

const AGENT_PROMPT_TAIL: &str = r###"- To continue a previously spawned agent, use SendMessage with the agent's ID or name as the `to` field. The agent resumes with its full context preserved. Each Agent invocation starts fresh [[EM]] provide a complete task description.
- The agent's outputs should generally be trusted
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple Agent tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.
- You can optionally set `isolation: "worktree"` to run the agent in a temporary git worktree, giving it an isolated copy of the repository. The worktree is automatically cleaned up if the agent makes no changes; if changes are made, the worktree path and branch are returned in the result.

## Writing the prompt

Brief the agent like a smart colleague who just walked into the room [[EM]] it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters.
- Explain what you're trying to accomplish and why.
- Describe what you've already learned or ruled out.
- Give enough context about the surrounding problem that the agent can make judgment calls rather than just following a narrow instruction.
- If you need a short response, say so ("report in under 200 words").
- Lookups: hand over the exact command. Investigations: hand over the question [[EM]] prescribed steps become dead weight when the premise is wrong.

Terse command-style prompts produce shallow, generic work.

**Never delegate understanding.** Don't write "based on your findings, fix the bug" or "based on the research, implement it." Those phrases push synthesis onto the agent instead of doing it yourself. Write prompts that prove you understood: include file paths, line numbers, what specifically to change.


Example usage:

<example_agent_descriptions>
"test-runner": use this agent after you are done writing code to run tests
"greeting-responder": use this agent to respond to user greetings with a friendly joke
</example_agent_descriptions>

<example>
user: "Please write a function that checks if a number is prime"
assistant: I'm going to use the Write tool to write the following code:
<code>
function isPrime(n) {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
</code>
<commentary>
Since a significant piece of code was written and the task was completed, now use the test-runner agent to run the tests
</commentary>
assistant: Uses the Agent tool to launch the test-runner agent
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the Agent tool to launch the greeting-responder agent"
</example>
"###;

const AGENT_PROMPT_WHEN_NOT_TO_USE: &str = r###"
When NOT to use the Agent tool:
- If you want to read a specific file path, use the Read tool or the Glob tool instead of the Agent tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use the Glob tool instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the Read tool instead of the Agent tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above
"###;

const AGENT_PROMPT_BACKGROUND: &str = r###"
- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, you will be automatically notified when it completes [[EM]] do NOT sleep, poll, or proactively check on its progress. Continue with other work or respond to the user instead.
- **Foreground vs background**: Use foreground (default) when you need the agent's results before you can proceed [[EM]] e.g., research agents whose findings inform your next steps. Use background when you have genuinely independent work to do in parallel."###;

/// O prompt (descrição) do `Agent` como o CLI 2.1.90 monta numa sessão SDK
/// (sem fork, sem teammates): a lista de agentes com as tools de cada um,
/// o "When NOT to use", as notas de uso e os exemplos.
pub fn agent_tool_prompt(agents: &[AgentDescriptor], options: &AgentPromptOptions) -> String {
    let list = if options.list_via_attachment {
        "Available agent types are listed in <system-reminder> messages in the conversation."
            .to_string()
    } else {
        format!(
            "Available agent types and the tools they have access to:\n{}",
            agents
                .iter()
                .map(format_agent_line)
                .collect::<Vec<_>>()
                .join("\n")
        )
    };
    let head = format!(
        "Launch a new agent to handle complex, multi-step tasks autonomously.\n\nThe Agent tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.\n\n{list}\n\nWhen using the Agent tool, specify a subagent_type parameter to select which agent type to use. If omitted, the general-purpose agent is used."
    );
    let concurrency = if !options.list_via_attachment && !options.subscription_pro {
        "\n- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses"
    } else {
        ""
    };
    let background = if options.background_tasks_enabled {
        with_js_dashes(AGENT_PROMPT_BACKGROUND)
    } else {
        String::new()
    };
    format!(
        "{head}\n{AGENT_PROMPT_WHEN_NOT_TO_USE}\n\nUsage notes:\n- Always include a short description (3-5 words) summarizing what the agent will do{concurrency}\n- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.{background}\n{}",
        with_js_dashes(AGENT_PROMPT_TAIL)
    )
}

/// O input schema do `Agent` (o `z.toJSONSchema` do CLI 2.1.90). Sem
/// background, o `run_in_background` sai, como no JS.
pub fn agent_tool_input_schema(background_tasks_enabled: bool) -> Value {
    let mut properties = Map::new();
    properties.insert(
        "description".into(),
        json!({"description": "A short (3-5 word) description of the task", "type": "string"}),
    );
    properties.insert(
        "prompt".into(),
        json!({"description": "The task for the agent to perform", "type": "string"}),
    );
    properties.insert(
        "subagent_type".into(),
        json!({"description": "The type of specialized agent to use for this task", "type": "string"}),
    );
    properties.insert(
        "model".into(),
        json!({
            "description": "Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent.",
            "type": "string",
            "enum": ["sonnet", "opus", "haiku"]
        }),
    );
    if background_tasks_enabled {
        properties.insert(
            "run_in_background".into(),
            json!({
                "description": "Set to true to run this agent in the background. You will be notified when it completes.",
                "type": "boolean"
            }),
        );
    }
    properties.insert(
        "isolation".into(),
        json!({
            "description": "Isolation mode. \"worktree\" creates a temporary git worktree so the agent works on an isolated copy of the repo.",
            "type": "string",
            "enum": ["worktree"]
        }),
    );
    json!({
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": Value::Object(properties),
        "required": ["description", "prompt"],
        "additionalProperties": false
    })
}

// ---------------------------------------------------------------------------
// Modelo e tools do subagente
// ---------------------------------------------------------------------------

fn env_nonempty(key: &str) -> Option<String> {
    std::env::var(key).ok().filter(|v| !v.is_empty())
}

/// `parseUserSpecifiedModel`: resolve os aliases com os defaults do JS.
pub fn parse_user_specified_model(model: &str) -> String {
    let trimmed = model.trim();
    let lower = trimmed.to_lowercase();
    let has_1m = lower.ends_with("[1m]");
    let base = if has_1m {
        lower.trim_end_matches("[1m]").trim().to_string()
    } else {
        lower.clone()
    };
    let suffix = if has_1m { "[1m]" } else { "" };
    match base.as_str() {
        "sonnet" | "opusplan" => format!(
            "{}{suffix}",
            env_nonempty("ANTHROPIC_DEFAULT_SONNET_MODEL")
                .unwrap_or_else(|| "claude-sonnet-4-6".to_string())
        ),
        "haiku" => format!(
            "{}{suffix}",
            env_nonempty("ANTHROPIC_DEFAULT_HAIKU_MODEL")
                .unwrap_or_else(|| crate::tools::framework::DEFAULT_HAIKU_MODEL.to_string())
        ),
        "opus" => format!(
            "{}{suffix}",
            env_nonempty("ANTHROPIC_DEFAULT_OPUS_MODEL")
                .unwrap_or_else(|| "claude-opus-4-6".to_string())
        ),
        _ => {
            if has_1m {
                format!("{}[1m]", trimmed[..trimmed.len() - 4].trim())
            } else {
                trimmed.to_string()
            }
        }
    }
}

fn alias_matches_parent_tier(alias: &str, parent_model: &str) -> bool {
    let canonical = parent_model.to_lowercase();
    match alias.to_lowercase().as_str() {
        "opus" => canonical.contains("opus"),
        "sonnet" => canonical.contains("sonnet"),
        "haiku" => canonical.contains("haiku"),
        _ => false,
    }
}

/// `getAgentModel`: o modelo do subagente a partir do modelo do agente, do
/// pai e do `model` pedido na chamada. `CLAUDE_CODE_SUBAGENT_MODEL` vence.
pub fn resolve_agent_model(
    agent_model: Option<&str>,
    parent_model: &str,
    tool_model: Option<&str>,
) -> String {
    if let Some(forced) = env_nonempty("CLAUDE_CODE_SUBAGENT_MODEL") {
        return parse_user_specified_model(&forced);
    }
    if let Some(requested) = tool_model.filter(|m| !m.is_empty()) {
        if alias_matches_parent_tier(requested, parent_model) {
            return parent_model.to_string();
        }
        return parse_user_specified_model(requested);
    }
    let agent_model = agent_model.unwrap_or("inherit");
    if agent_model == "inherit" {
        return parent_model.to_string();
    }
    if alias_matches_parent_tier(agent_model, parent_model) {
        return parent_model.to_string();
    }
    parse_user_specified_model(agent_model)
}

/// `resolveAgentTools` + `filterToolsForAgent`: os nomes das tools que o
/// subagente recebe, dado o pool do pai (`available`, na ordem do pool).
/// MCP passa sempre; `ALL_AGENT_DISALLOWED_TOOLS` sai (ExitPlanMode fica
/// se o agente roda em plan); as negadas saem; lista explícita segue a
/// ordem da lista.
pub fn subagent_tool_names(agent: &AgentDescriptor, available: &[String]) -> Vec<String> {
    let plan_mode = agent.permission_mode == Some(PermissionMode::Plan);
    let filtered: Vec<&String> = available
        .iter()
        .filter(|name| {
            if name.starts_with("mcp__") {
                return true;
            }
            if name.as_str() == "ExitPlanMode" && plan_mode {
                return true;
            }
            !ALL_AGENT_DISALLOWED_TOOLS.contains(&name.as_str())
        })
        .collect();
    let denied: Vec<String> = agent
        .disallowed_tools
        .iter()
        .flatten()
        .map(|spec| crate::tools::permission::ToolPermissionRule::parse(spec).tool_name)
        .collect();
    let allowed: Vec<&String> = filtered
        .into_iter()
        .filter(|name| !denied.contains(name))
        .collect();
    match &agent.tools {
        None => allowed.into_iter().cloned().collect(),
        Some(list) if list.len() == 1 && list[0] == "*" => allowed.into_iter().cloned().collect(),
        Some(list) => {
            let mut resolved: Vec<String> = Vec::new();
            for spec in list {
                let name = crate::tools::permission::ToolPermissionRule::parse(spec).tool_name;
                if name == AGENT_TOOL_NAME {
                    continue;
                }
                if allowed.iter().any(|a| **a == name) && !resolved.contains(&name) {
                    resolved.push(name);
                }
            }
            resolved
        }
    }
}

// ---------------------------------------------------------------------------
// Prompt de sistema do subagente
// ---------------------------------------------------------------------------

/// O ambiente que entra no bloco `<env>` do prompt do subagente.
#[derive(Debug, Clone)]
pub struct SubagentEnvironment {
    pub working_directory: String,
    pub is_git_repo: bool,
    pub additional_directories: Vec<String>,
    /// `process.platform` (`linux`, `darwin`, `win32`).
    pub platform: String,
    /// `SHELL` reduzido como o JS (`zsh`, `bash` ou o caminho).
    pub shell: String,
    /// `uname -sr`.
    pub os_version: String,
    /// O modelo em que o subagente roda.
    pub model: String,
}

impl SubagentEnvironment {
    /// Detecta o ambiente como o JS: git pelo `.git` no caminho acima,
    /// plataforma, shell do `SHELL` e a versão do sistema pelo `uname`.
    pub fn detect(working_directory: &std::path::Path, model: &str) -> Self {
        let shell_env = std::env::var("SHELL").unwrap_or_else(|_| "unknown".to_string());
        let shell = if shell_env.contains("zsh") {
            "zsh".to_string()
        } else if shell_env.contains("bash") {
            "bash".to_string()
        } else {
            shell_env
        };
        let platform = match std::env::consts::OS {
            "macos" => "darwin",
            "windows" => "win32",
            other => other,
        }
        .to_string();
        let os_version = std::process::Command::new("uname")
            .arg("-sr")
            .output()
            .ok()
            .filter(|o| o.status.success())
            .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
            .unwrap_or_else(|| platform.clone());
        let is_git_repo = working_directory
            .ancestors()
            .any(|p| p.join(".git").exists());
        Self {
            working_directory: working_directory.display().to_string(),
            is_git_repo,
            additional_directories: Vec::new(),
            platform,
            shell,
            os_version,
            model: model.to_string(),
        }
    }
}

/// `getMarketingNameForModel` (`sn` do bundle).
pub fn model_marketing_name(model: &str) -> Option<String> {
    let one_m = model.to_lowercase().contains("[1m]");
    let m = model.to_lowercase();
    let with_1m = |name: &str| {
        if one_m {
            format!("{name} (with 1M context)")
        } else {
            name.to_string()
        }
    };
    if m.contains("claude-opus-4-6") {
        return Some(with_1m("Opus 4.6"));
    }
    if m.contains("claude-opus-4-5") {
        return Some("Opus 4.5".to_string());
    }
    if m.contains("claude-opus-4-1") {
        return Some("Opus 4.1".to_string());
    }
    if m.contains("claude-opus-4") {
        return Some("Opus 4".to_string());
    }
    if m.contains("claude-sonnet-4-6") {
        return Some(with_1m("Sonnet 4.6"));
    }
    if m.contains("claude-sonnet-4-5") {
        return Some(with_1m("Sonnet 4.5"));
    }
    if m.contains("claude-sonnet-4") {
        return Some(with_1m("Sonnet 4"));
    }
    if m.contains("claude-3-7-sonnet") {
        return Some("Claude 3.7 Sonnet".to_string());
    }
    if m.contains("claude-3-5-sonnet") {
        return Some("Claude 3.5 Sonnet".to_string());
    }
    if m.contains("claude-haiku-4-5") {
        return Some("Haiku 4.5".to_string());
    }
    if m.contains("claude-3-5-haiku") {
        return Some("Claude 3.5 Haiku".to_string());
    }
    None
}

/// O corte de conhecimento que o JS anuncia por modelo.
pub fn knowledge_cutoff(model: &str) -> Option<&'static str> {
    let m = model.to_lowercase();
    if m.contains("claude-sonnet-4-6") {
        Some("August 2025")
    } else if m.contains("claude-opus-4-6") || m.contains("claude-opus-4-5") {
        Some("May 2025")
    } else if m.contains("claude-haiku-4") {
        Some("February 2025")
    } else if m.contains("claude-opus-4") || m.contains("claude-sonnet-4") {
        Some("January 2025")
    } else {
        None
    }
}

const SUBAGENT_NOTES: &str = r###"Notes:
- Agent threads always have their cwd reset between bash calls, as a result please only use absolute file paths.
- In your final response, share file paths (always absolute, never relative) that are relevant to the task. Include code snippets only when the exact text is load-bearing (e.g., a bug you found, a function signature the caller asked for) [[EM]] do not recap code you merely read.
- For clear communication with the user the assistant MUST avoid using emojis.
- Do not use a colon before tool calls. Text like "Let me read the file:" followed by a read tool call should just be "Let me read the file." with a period."###;

/// O prompt de sistema do subagente como o JS monta
/// (`enhanceSystemPromptWithEnvDetails`): o prompt do agente, as notas e o
/// bloco `<env>` com o modelo e o corte de conhecimento.
pub fn subagent_system_prompt(agent_prompt: &str, env: &SubagentEnvironment) -> String {
    let model_line = match model_marketing_name(&env.model) {
        Some(name) => format!(
            "You are powered by the model named {name}. The exact model ID is {}.",
            env.model
        ),
        None => format!("You are powered by the model {}.", env.model),
    };
    let cutoff = knowledge_cutoff(&env.model)
        .map(|c| format!("\n\nAssistant knowledge cutoff is {c}."))
        .unwrap_or_default();
    let additional = if env.additional_directories.is_empty() {
        String::new()
    } else {
        format!(
            "Additional working directories: {}\n",
            env.additional_directories.join(", ")
        )
    };
    let env_block = format!(
        "Here is useful information about the environment you are running in:\n<env>\nWorking directory: {}\nIs directory a git repo: {}\n{additional}Platform: {}\nShell: {}\nOS Version: {}\n</env>\n{model_line}{cutoff}",
        env.working_directory,
        if env.is_git_repo { "Yes" } else { "No" },
        env.platform,
        env.shell,
        env.os_version,
    );
    [
        agent_prompt.to_string(),
        with_js_dashes(SUBAGENT_NOTES),
        env_block,
    ]
    .join("\n\n")
}

// ---------------------------------------------------------------------------
// A tool
// ---------------------------------------------------------------------------

/// O que o engine recebe para rodar um subagente.
#[derive(Debug, Clone)]
pub struct AgentRunRequest {
    /// O agente resolvido (já validado contra a lista e as regras).
    pub agent: AgentDescriptor,
    pub prompt: String,
    pub description: String,
    /// O modelo já resolvido com [`resolve_agent_model`].
    pub model: String,
    /// Background pedido (ou o agente é `background: true`).
    pub run_in_background: bool,
    /// `isolation` pedido (`worktree`).
    pub isolation: Option<String>,
}

/// O resultado de um subagente que terminou (o `data` do JS, antes do
/// `status`/`prompt`).
#[derive(Debug, Clone)]
pub struct SubagentCompletion {
    pub agent_id: String,
    /// Os blocos de texto da última mensagem do assistente com texto
    /// (`{type:"text", text}`), como o JS devolve.
    pub content: Vec<Value>,
    pub total_duration_ms: u64,
    /// Soma de input, cache e output da última resposta (`getTokenCountFromUsage`).
    pub total_tokens: u64,
    /// Quantos `tool_use` o subagente fez.
    pub total_tool_use_count: u64,
    /// O `usage` cru da última resposta.
    pub usage: Value,
    pub worktree_path: Option<String>,
    pub worktree_branch: Option<String>,
}

/// O que o runner devolve.
#[derive(Debug, Clone)]
pub enum AgentRunOutcome {
    Completed(SubagentCompletion),
    /// Subagente lançado em background.
    AsyncLaunched {
        agent_id: String,
        output_file: String,
        /// O pai tem Read/Bash para acompanhar o arquivo.
        can_read_output_file: bool,
    },
}

/// O runner do subagente, fornecido pelo engine. `Err(mensagem)` vira o
/// erro da tool com a mensagem crua (é o `throw` do JS).
pub type AgentRunFn = Arc<
    dyn Fn(AgentRunRequest) -> Pin<Box<dyn Future<Output = Result<AgentRunOutcome, String>> + Send>>
        + Send
        + Sync,
>;

/// A tool `Agent`.
pub struct AgentTool {
    agents: Vec<AgentDescriptor>,
    rules: PermissionRules,
    description: String,
    schema: Value,
    background_tasks_enabled: bool,
    runner: AgentRunFn,
}

impl AgentTool {
    /// `agents` é a lista ativa ([`active_agents`]); `rules` são as regras
    /// da sessão (as `Agent(tipo)` negadas somem da lista e da execução).
    pub fn new(agents: Vec<AgentDescriptor>, rules: PermissionRules, runner: AgentRunFn) -> Self {
        Self::with_prompt_options(agents, rules, runner, AgentPromptOptions::default())
    }

    pub fn with_prompt_options(
        agents: Vec<AgentDescriptor>,
        rules: PermissionRules,
        runner: AgentRunFn,
        options: AgentPromptOptions,
    ) -> Self {
        let visible = filter_denied_agents(agents.clone(), &rules);
        Self {
            description: agent_tool_prompt(&visible, &options),
            schema: agent_tool_input_schema(options.background_tasks_enabled),
            background_tasks_enabled: options.background_tasks_enabled,
            agents,
            rules,
            runner,
        }
    }

    /// Os agentes que o modelo pode pedir.
    pub fn agents(&self) -> &[AgentDescriptor] {
        &self.agents
    }

    /// Resolve o `subagent_type` como o `call` do JS: sem tipo é o
    /// general-purpose; tipo negado ou inexistente dá o erro do JS.
    pub fn resolve_agent(&self, subagent_type: Option<&str>) -> Result<&AgentDescriptor, String> {
        let wanted = subagent_type.unwrap_or("general-purpose");
        let visible: Vec<&AgentDescriptor> = {
            let denied: Vec<String> = self
                .rules
                .content_rules(AGENT_TOOL_NAME, RuleBehavior::Deny)
                .into_iter()
                .filter_map(|r| r.pattern.clone())
                .collect();
            self.agents
                .iter()
                .filter(|a| !denied.contains(&a.agent_type))
                .collect()
        };
        if let Some(found) = visible.iter().find(|a| a.agent_type == wanted) {
            return Ok(found);
        }
        if self.agents.iter().any(|a| a.agent_type == wanted) {
            return Err(format!(
                "Agent type '{wanted}' has been denied by permission rule '{AGENT_TOOL_NAME}({wanted})' from cliArg."
            ));
        }
        Err(format!(
            "Agent type '{wanted}' not found. Available agents: {}",
            visible
                .iter()
                .map(|a| a.agent_type.as_str())
                .collect::<Vec<_>>()
                .join(", ")
        ))
    }
}

/// O `tool_result` e o `tool_use_result` de um subagente que terminou
/// (`mapToolResultToToolResultBlockParam` com `status: "completed"`).
pub fn completed_agent_result(
    prompt: &str,
    agent: &AgentDescriptor,
    completion: &SubagentCompletion,
) -> ToolResult {
    let mut data = Map::new();
    data.insert("status".into(), json!("completed"));
    data.insert("prompt".into(), json!(prompt));
    data.insert("agentId".into(), json!(completion.agent_id));
    data.insert("agentType".into(), json!(agent.agent_type));
    data.insert("content".into(), Value::Array(completion.content.clone()));
    data.insert(
        "totalDurationMs".into(),
        json!(completion.total_duration_ms),
    );
    data.insert("totalTokens".into(), json!(completion.total_tokens));
    data.insert(
        "totalToolUseCount".into(),
        json!(completion.total_tool_use_count),
    );
    data.insert("usage".into(), completion.usage.clone());
    if let Some(path) = &completion.worktree_path {
        data.insert("worktreePath".into(), json!(path));
    }
    if let Some(branch) = &completion.worktree_branch {
        data.insert("worktreeBranch".into(), json!(branch));
    }

    let mut blocks: Vec<ToolResultContent> = completion
        .content
        .iter()
        .filter_map(|b| b.get("text").and_then(Value::as_str))
        .map(|t| ToolResultContent::Text(t.to_string()))
        .collect();
    if blocks.is_empty() {
        blocks.push(ToolResultContent::Text(
            "(Subagent completed but returned no output.)".to_string(),
        ));
    }
    let worktree = completion
        .worktree_path
        .as_ref()
        .map(|p| {
            format!(
                "\nworktreePath: {p}\nworktreeBranch: {}",
                completion
                    .worktree_branch
                    .clone()
                    .unwrap_or_else(|| "undefined".to_string())
            )
        })
        .unwrap_or_default();
    if !(agent.is_one_shot() && worktree.is_empty()) {
        blocks.push(ToolResultContent::Text(format!(
            "agentId: {id} (use SendMessage with to: '{id}' to continue this agent){worktree}\n<usage>total_tokens: {}\ntool_uses: {}\nduration_ms: {}</usage>",
            completion.total_tokens,
            completion.total_tool_use_count,
            completion.total_duration_ms,
            id = completion.agent_id,
        )));
    }
    ToolResult::mixed(blocks).with_tool_use_result(Value::Object(data))
}

/// O resultado de um subagente lançado em background (`async_launched`).
pub fn async_agent_result(
    description: &str,
    prompt: &str,
    agent_id: &str,
    output_file: &str,
    can_read_output_file: bool,
) -> ToolResult {
    let head = format!(
        "Async agent launched successfully.\nagentId: {agent_id} (internal ID - do not mention to user. Use SendMessage with to: '{agent_id}' to continue this agent.)\nThe agent is working in the background. You will be notified automatically when it completes."
    );
    let tail = if can_read_output_file {
        with_js_dashes(&format!(
            "Do not duplicate this agent's work [[EM]] avoid working with the same files or topics it is using. Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.\noutput_file: {output_file}\nIf asked, you can check progress before completion by using Read or Bash tail on the output file."
        ))
    } else {
        "Briefly tell the user what you launched and end your response. Do not generate any other text [[EM]] agent results will arrive in a subsequent message.".to_string()
    };
    let text = with_js_dashes(&format!("{head}\n{tail}"));
    let mut data = Map::new();
    data.insert("status".into(), json!("async_launched"));
    data.insert("agentId".into(), json!(agent_id));
    data.insert("description".into(), json!(description));
    data.insert("prompt".into(), json!(prompt));
    data.insert("outputFile".into(), json!(output_file));
    data.insert("canReadOutputFile".into(), json!(can_read_output_file));
    ToolResult::mixed(vec![ToolResultContent::Text(text)]).with_tool_use_result(Value::Object(data))
}

#[async_trait]
impl Tool for AgentTool {
    fn name(&self) -> &str {
        AGENT_TOOL_NAME
    }

    fn description(&self) -> &str {
        &self.description
    }

    fn input_schema(&self) -> Value {
        self.schema.clone()
    }

    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let prompt = input
            .get("prompt")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .to_string();
        let description = input
            .get("description")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .to_string();
        let agent = match self.resolve_agent(input.get("subagent_type").and_then(Value::as_str)) {
            Ok(agent) => agent.clone(),
            Err(message) => return ToolResult::error(message),
        };
        let parent_model = context
            .main_model
            .clone()
            .unwrap_or_else(|| "claude-sonnet-4-6".to_string());
        let model = resolve_agent_model(
            agent.model.as_deref(),
            &parent_model,
            input.get("model").and_then(Value::as_str),
        );
        let run_in_background = self.background_tasks_enabled
            && (input
                .get("run_in_background")
                .and_then(Value::as_bool)
                .unwrap_or(false)
                || agent.background);
        let request = AgentRunRequest {
            agent: agent.clone(),
            prompt: prompt.clone(),
            description: description.clone(),
            model,
            run_in_background,
            isolation: input
                .get("isolation")
                .and_then(Value::as_str)
                .map(str::to_string),
        };
        match (self.runner)(request).await {
            Ok(AgentRunOutcome::Completed(completion)) => {
                completed_agent_result(&prompt, &agent, &completion)
            }
            Ok(AgentRunOutcome::AsyncLaunched {
                agent_id,
                output_file,
                can_read_output_file,
            }) => async_agent_result(
                &description,
                &prompt,
                &agent_id,
                &output_file,
                can_read_output_file,
            ),
            Err(message) => ToolResult::error(message),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builtin_listing_follows_the_js_order_and_tool_descriptions() {
        let agents = builtin_agents(&BuiltinAgentOptions {
            disabled: false,
            explore_plan_enabled: true,
        });
        let lines: Vec<String> = agents.iter().map(format_agent_line).collect();
        assert!(lines[0].starts_with("- general-purpose: General-purpose agent"));
        assert!(lines[0].ends_with("(Tools: *)"));
        assert!(lines[1].ends_with("(Tools: Read, Edit)"));
        assert!(lines[2]
            .ends_with("(Tools: All tools except Agent, ExitPlanMode, Edit, Write, NotebookEdit)"));
    }

    #[test]
    fn sdk_agent_overrides_builtin_in_place_and_new_ones_go_last() {
        let mut custom = std::collections::HashMap::new();
        custom.insert(
            "Plan".to_string(),
            AgentDefinition::new("meu plano", "prompt"),
        );
        custom.insert(
            "revisor".to_string(),
            AgentDefinition::new("revisa", "prompt"),
        );
        let agents = active_agents_from_map(
            &custom,
            &BuiltinAgentOptions {
                disabled: false,
                explore_plan_enabled: true,
            },
        );
        let names: Vec<&str> = agents.iter().map(|a| a.agent_type.as_str()).collect();
        assert_eq!(
            names,
            vec![
                "general-purpose",
                "statusline-setup",
                "Explore",
                "Plan",
                "revisor"
            ]
        );
        assert_eq!(agents[3].when_to_use, "meu plano");
        assert_eq!(agents[4].source, AgentSource::FlagSettings);
    }

    #[test]
    fn model_resolution_follows_get_agent_model() {
        assert_eq!(
            resolve_agent_model(None, "claude-sonnet-4-6", None),
            "claude-sonnet-4-6"
        );
        assert_eq!(
            resolve_agent_model(Some("haiku"), "claude-sonnet-4-6", None),
            crate::tools::framework::DEFAULT_HAIKU_MODEL
        );
        assert_eq!(
            resolve_agent_model(Some("sonnet"), "claude-sonnet-4-5", None),
            "claude-sonnet-4-5"
        );
        assert_eq!(
            resolve_agent_model(Some("haiku"), "claude-sonnet-4-6", Some("opus")),
            "claude-opus-4-6"
        );
    }

    #[test]
    fn subagent_tools_follow_resolve_agent_tools() {
        let available: Vec<String> = [
            "Agent",
            "AskUserQuestion",
            "Bash",
            "Edit",
            "EnterPlanMode",
            "ExitPlanMode",
            "Read",
            "TaskOutput",
            "TaskStop",
            "Write",
            "mcp__omnia__buscar",
        ]
        .iter()
        .map(|s| s.to_string())
        .collect();
        let agents = builtin_agents(&BuiltinAgentOptions {
            disabled: false,
            explore_plan_enabled: true,
        });
        assert_eq!(
            subagent_tool_names(&agents[0], &available),
            vec!["Bash", "Edit", "Read", "Write", "mcp__omnia__buscar"]
        );
        assert_eq!(
            subagent_tool_names(&agents[1], &available),
            vec!["Read", "Edit"]
        );
        assert_eq!(
            subagent_tool_names(&agents[2], &available),
            vec!["Bash", "Read", "mcp__omnia__buscar"]
        );
    }

    #[test]
    fn prompt_has_no_raw_dash_markers() {
        let agents = builtin_agents(&BuiltinAgentOptions::default());
        let prompt = agent_tool_prompt(&agents, &AgentPromptOptions::default());
        assert!(!prompt.contains("[[EM]]"));
        assert!(prompt.contains(&format!(
            "starts fresh {} provide",
            char::from_u32(0x2014).unwrap()
        )));
    }
}
