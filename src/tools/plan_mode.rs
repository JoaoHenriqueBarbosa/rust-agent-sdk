//! `EnterPlanMode` e `ExitPlanMode`.
//!
//! Referências JS: `tools/EnterPlanModeTool/EnterPlanModeTool.js` e
//! `prompt.js` (o prompt, a recusa em contexto de agente, o texto do
//! resultado sem a fase de entrevista) e
//! `tools/ExitPlanModeTool/ExitPlanModeV2Tool.js` e `prompt.js` (o schema
//! com `allowedPrompts` e passthrough, a recusa fora do plan mode, o `ask`
//! "Exit plan mode?" com `requiresUserInteraction`, o arquivo de plano em
//! `~/.claude/plans/<slug>.md`, a volta ao modo anterior ao plano e os
//! textos do resultado).

use std::path::PathBuf;

use async_trait::async_trait;
use rand::seq::SliceRandom;
use serde_json::{json, Map, Value};

use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::permission::{PermissionAsk, PermissionResult, PermissionRules};
use crate::types::PermissionMode;

const ENTER_PLAN_MODE_PROMPT: &str = r###"Use this tool proactively when you're about to start a non-trivial implementation task. Getting user sign-off on your approach before writing code prevents wasted effort and ensures alignment. This tool transitions you into plan mode where you can explore the codebase and design an implementation approach for user approval.

## When to Use This Tool

**Prefer using EnterPlanMode** for implementation tasks unless they're simple. Use it when ANY of these conditions apply:

1. **New Feature Implementation**: Adding meaningful new functionality
   - Example: "Add a logout button" - where should it go? What should happen on click?
   - Example: "Add form validation" - what rules? What error messages?

2. **Multiple Valid Approaches**: The task can be solved in several different ways
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

3. **Code Modifications**: Changes that affect existing behavior or structure
   - Example: "Update the login flow" - what exactly should change?
   - Example: "Refactor this component" - what's the target architecture?

4. **Architectural Decisions**: The task requires choosing between patterns or technologies
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

5. **Multi-File Changes**: The task will likely touch more than 2-3 files
   - Example: "Refactor the authentication system"
   - Example: "Add a new API endpoint with tests"

6. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

7. **User Preferences Matter**: The implementation could reasonably go multiple ways
   - If you would use AskUserQuestion to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Agent tool with explore agent instead)

## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use AskUserQuestion if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

## Examples

### GOOD - Use EnterPlanMode:
User: "Add user authentication to the app"
- Requires architectural decisions (session vs JWT, where to store tokens, middleware structure)

User: "Optimize the database queries"
- Multiple approaches possible, need to profile first, significant impact

User: "Implement dark mode"
- Architectural decision on theme system, affects many components

User: "Add a delete button to the user profile"
- Seems simple but involves: where to place it, confirmation dialog, API call, error handling, state updates

User: "Update the error handling in the API"
- Affects multiple files, user should approve the approach

### BAD - Don't use EnterPlanMode:
User: "Fix the typo in the README"
- Straightforward, no planning needed

User: "Add a console.log to debug this function"
- Simple, obvious implementation

User: "What files handle routing?"
- Research task, not implementation planning

## Important Notes

- This tool REQUIRES user approval - they must consent to entering plan mode
- If unsure whether to use it, err on the side of planning - it's better to get alignment upfront than to redo work
- Users appreciate being consulted before significant changes are made to their codebase
"###;

const EXIT_PLAN_MODE_PROMPT: &str = r###"Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Before Using This Tool
Ensure your plan is complete and unambiguous:
- If you have unresolved questions about requirements or approach, use AskUserQuestion first (in earlier phases)
- Once your plan is finalized, use THIS tool to request approval

**Important:** Do NOT use AskUserQuestion to ask "Is this plan okay?" or "Should I proceed?" - that's exactly what THIS tool does. ExitPlanMode inherently requests user approval of your plan.

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.
"###;

const ENTERED_PLAN_MODE: &str = "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.";

const ENTERED_PLAN_MODE_INSTRUCTIONS: &str = r###"In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase."###;

/// O diretório de configuração do CLI (`getClaudeConfigHomeDir`).
pub fn claude_config_home() -> PathBuf {
    if let Some(dir) = std::env::var_os("CLAUDE_CONFIG_DIR").filter(|d| !d.is_empty()) {
        return PathBuf::from(dir);
    }
    std::env::var_os("HOME")
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".claude")
}

/// O diretório de planos (`getPlansDirectory`).
pub fn plans_directory() -> PathBuf {
    claude_config_home().join("plans")
}

/// Um slug de três palavras como o do JS (`adjetivo-gerúndio-sobrenome`).
pub fn generate_plan_slug() -> String {
    const ADJECTIVES: &[&str] = &[
        "mighty", "quiet", "brave", "gentle", "swift", "clever", "bright", "calm", "eager",
        "lively", "bold", "curious", "happy", "keen", "noble", "witty",
    ];
    const VERBS: &[&str] = &[
        "wobbling",
        "dancing",
        "singing",
        "drifting",
        "roaming",
        "gliding",
        "spinning",
        "wandering",
        "humming",
        "leaping",
        "floating",
        "sparkling",
    ];
    const NAMES: &[&str] = &[
        "hellman", "turing", "lovelace", "hopper", "knuth", "dijkstra", "curie", "noether",
        "shannon", "ritchie", "hamilton", "babbage",
    ];
    let mut rng = rand::thread_rng();
    format!(
        "{}-{}-{}",
        ADJECTIVES.choose(&mut rng).unwrap_or(&"quiet"),
        VERBS.choose(&mut rng).unwrap_or(&"drifting"),
        NAMES.choose(&mut rng).unwrap_or(&"turing"),
    )
}

/// O arquivo de plano da sessão (`getPlanFilePath`); subagentes usam
/// `<slug>-agent-<id>.md`.
pub fn plan_file_path(context: &ToolContext) -> PathBuf {
    let slug = match &context.task_store {
        Some(store) => store.plan_slug(generate_plan_slug),
        None => generate_plan_slug(),
    };
    let name = match &context.agent_id {
        Some(agent) => format!("{slug}-agent-{agent}.md"),
        None => format!("{slug}.md"),
    };
    plans_directory().join(name)
}

pub struct EnterPlanModeTool;

#[async_trait]
impl Tool for EnterPlanModeTool {
    fn name(&self) -> &str {
        "EnterPlanMode"
    }

    fn description(&self) -> &str {
        ENTER_PLAN_MODE_PROMPT
    }

    fn input_schema(&self) -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {},
            "additionalProperties": false
        })
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

    async fn execute(&self, _input: Value, context: &ToolContext) -> ToolResult {
        if context.agent_id.is_some() {
            return ToolResult::error("EnterPlanMode tool cannot be used in agent contexts");
        }
        let previous = context.mode();
        if previous != PermissionMode::Plan {
            if let Some(store) = &context.task_store {
                store.set_pre_plan_mode(Some(previous));
            }
        }
        context.set_mode(PermissionMode::Plan);
        ToolResult::text(format!(
            "{ENTERED_PLAN_MODE}\n\n{ENTERED_PLAN_MODE_INSTRUCTIONS}"
        ))
        .with_tool_use_result(json!({"message": ENTERED_PLAN_MODE}))
    }
}

pub struct ExitPlanModeTool;

/// O schema do `ExitPlanMode` (strictObject com passthrough).
pub fn exit_plan_mode_schema() -> Value {
    json!({
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "allowedPrompts": {
                "description": "Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.",
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "tool": {
                            "description": "The tool this prompt applies to",
                            "type": "string",
                            "enum": ["Bash"]
                        },
                        "prompt": {
                            "description": "Semantic description of the action, e.g. \"run tests\", \"install dependencies\"",
                            "type": "string"
                        }
                    },
                    "required": ["tool", "prompt"],
                    "additionalProperties": false
                }
            }
        },
        "additionalProperties": {}
    })
}

/// O texto do resultado do `ExitPlanMode` (`mapToolResultToToolResultBlockParam`).
pub fn exit_plan_mode_result_text(
    is_agent: bool,
    plan: Option<&str>,
    file_path: &str,
    plan_was_edited: bool,
) -> String {
    if is_agent {
        return "User has approved the plan. There is nothing else needed from you now. Please respond with \"ok\"".to_string();
    }
    let Some(plan) = plan.filter(|p| !p.trim().is_empty()) else {
        return "User has approved exiting plan mode. You can now proceed.".to_string();
    };
    format!(
        "User has approved your plan. You can now start coding. Start with updating your todo list if applicable\n\nYour plan has been saved to: {file_path}\nYou can refer back to it if needed during implementation.\n\n## {}:\n{plan}",
        if plan_was_edited {
            "Approved Plan (edited by user)"
        } else {
            "Approved Plan"
        }
    )
}

#[async_trait]
impl Tool for ExitPlanModeTool {
    fn name(&self) -> &str {
        "ExitPlanMode"
    }

    /// `normalizeToolInput` do ExitPlanMode: com um plano no arquivo de
    /// plano (`getPlan`), o input ganha `plan` e `planFilePath`.
    fn normalize_input(&self, input: Value, context: &ToolContext) -> Value {
        let path = plan_file_path(context);
        let Ok(plan) = std::fs::read_to_string(&path) else {
            return input;
        };
        let Value::Object(mut map) = input else {
            return input;
        };
        map.insert("plan".into(), Value::String(plan));
        map.insert(
            "planFilePath".into(),
            Value::String(path.to_string_lossy().to_string()),
        );
        Value::Object(map)
    }

    /// `normalizeToolInputForAPI`: o `plan` e o `planFilePath` injetados não
    /// voltam à API.
    fn normalize_input_for_api(&self, input: Value) -> Value {
        match input {
            Value::Object(mut map)
                if map.contains_key("plan") || map.contains_key("planFilePath") =>
            {
                map.shift_remove("plan");
                map.shift_remove("planFilePath");
                Value::Object(map)
            }
            other => other,
        }
    }

    fn description(&self) -> &str {
        EXIT_PLAN_MODE_PROMPT
    }

    fn input_schema(&self) -> Value {
        exit_plan_mode_schema()
    }

    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }

    fn requires_user_interaction(&self) -> bool {
        true
    }

    async fn validate_input(&self, _input: &Value, context: &ToolContext) -> Result<(), String> {
        if context.mode() != PermissionMode::Plan {
            return Err("You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.".to_string());
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::Ask(PermissionAsk {
            message: "Exit plan mode?".to_string(),
            updated_input: Some(input.clone()),
            ..Default::default()
        })
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let is_agent = context.agent_id.is_some();
        let file_path = plan_file_path(context);
        let input_plan = input
            .get("plan")
            .and_then(Value::as_str)
            .map(str::to_string);
        if let Some(plan) = &input_plan {
            if let Some(dir) = file_path.parent() {
                let _ = tokio::fs::create_dir_all(dir).await;
            }
            let _ = tokio::fs::write(&file_path, plan).await;
        }
        let plan = match &input_plan {
            Some(p) => Some(p.clone()),
            None => tokio::fs::read_to_string(&file_path).await.ok(),
        };
        if context.mode() == PermissionMode::Plan {
            let restore = context
                .task_store
                .as_ref()
                .and_then(|s| s.take_pre_plan_mode())
                .unwrap_or(PermissionMode::Default);
            context.set_mode(restore);
        }
        let file_path_text = file_path.display().to_string();
        let text = exit_plan_mode_result_text(
            is_agent,
            plan.as_deref(),
            &file_path_text,
            input_plan.is_some(),
        );
        let mut data = Map::new();
        data.insert(
            "plan".into(),
            plan.clone().map(Value::String).unwrap_or(Value::Null),
        );
        data.insert("isAgent".into(), Value::Bool(is_agent));
        data.insert("filePath".into(), Value::String(file_path_text));
        if input_plan.is_some() {
            data.insert("planWasEdited".into(), Value::Bool(true));
        }
        ToolResult::text(text).with_tool_use_result(Value::Object(data))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exit_texts_follow_the_js() {
        assert_eq!(
            exit_plan_mode_result_text(false, None, "/p.md", false),
            "User has approved exiting plan mode. You can now proceed."
        );
        let text =
            exit_plan_mode_result_text(false, Some("# Meu plano\n\n1. Fazer X"), "/p.md", true);
        assert_eq!(
            text,
            "User has approved your plan. You can now start coding. Start with updating your todo list if applicable\n\nYour plan has been saved to: /p.md\nYou can refer back to it if needed during implementation.\n\n## Approved Plan (edited by user):\n# Meu plano\n\n1. Fazer X"
        );
    }
}
