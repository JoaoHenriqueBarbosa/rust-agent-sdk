//! Paridade das tools de interação e sessão do transporte nativo com o CLI
//! 2.1.90: Agent, AskUserQuestion, Skill, EnterWorktree/ExitWorktree,
//! EnterPlanMode/ExitPlanMode, TaskOutput/TaskStop, TodoWrite e a conversão
//! de resultado MCP.
//!
//! As descrições, os schemas e os prompts de sistema dos subagentes são
//! conferidos pelo SHA-256 do texto que o CLI 2.1.90 real mandou à API
//! (capturado com um servidor local no `ANTHROPIC_BASE_URL`, em modo SDK
//! com `CLAUDE_CODE_ENTRYPOINT=sdk-py`); os resultados, pelos textos que o
//! mesmo CLI devolveu nos `tool_result`. Nenhum teste toca rede.

use std::path::Path;
use std::sync::Arc;

use serde_json::{json, Value};
use sha2::{Digest, Sha256};

use prana::tools::agent::{
    active_agents_from_map, builtin_agents, subagent_system_prompt, AgentDescriptor,
    AgentPromptOptions, AgentRunFn, AgentRunOutcome, AgentSource, AgentTool, BuiltinAgentOptions,
    SubagentCompletion, SubagentEnvironment,
};
use prana::tools::framework::{
    PermissionCallbackFn, PermissionOutcome, ToolContext, ToolExecutionResult, ToolExecutor,
    ToolPermissionRequest, ToolRegistry,
};
use prana::tools::permission::PermissionRules;
use prana::tools::task_store::TaskStore;
use prana::types::PermissionMode;

fn sha(text: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(text.as_bytes());
    hasher
        .finalize()
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect()
}

fn tool_use(id: &str, name: &str, input: Value) -> prana::api::streaming::ToolUseBlock {
    prana::api::streaming::ToolUseBlock {
        id: id.to_string(),
        name: name.to_string(),
        input,
    }
}

fn registry_with(names: &[&str]) -> ToolRegistry {
    let mut registry = ToolRegistry::new();
    for name in names {
        registry.register(ToolRegistry::builtin(name).expect("builtin"));
    }
    registry
}

fn text_of(result: &ToolExecutionResult) -> String {
    result.result.text_content()
}

type Seen = Arc<std::sync::Mutex<Vec<ToolPermissionRequest>>>;

fn callback(outcome: PermissionOutcome) -> (PermissionCallbackFn, Seen) {
    let seen: Seen = Arc::new(std::sync::Mutex::new(Vec::new()));
    let seen_cb = Arc::clone(&seen);
    let cb: PermissionCallbackFn = Arc::new(move |request| {
        seen_cb.lock().unwrap().push(request);
        let outcome = outcome.clone();
        Box::pin(async move { outcome })
    });
    (cb, seen)
}

/// Os planos vão para um diretório temporário, nunca para a home real.
fn isolate_config_home() {
    static DIR: std::sync::OnceLock<tempfile::TempDir> = std::sync::OnceLock::new();
    let dir = DIR.get_or_init(|| tempfile::tempdir().unwrap());
    std::env::set_var("CLAUDE_CONFIG_DIR", dir.path());
}

// ---------------------------------------------------------------------------
// Descrições e schemas contra a captura do CLI
// ---------------------------------------------------------------------------

/// (tool, sha256 da descrição, sha256 do schema em JSON compacto), da
/// requisição real do CLI 2.1.90 em modo SDK.
const CAPTURED: &[(&str, &str, &str)] = &[
    (
        "AskUserQuestion",
        "d13afb721c6aaa5d79a0d10fc4e1c05a2271914f12572b3ecbbd67d5af79af09",
        "2e4845645a6b7dba870dbf1d603b452f8838418467ce03d264d7fc9eee516701",
    ),
    (
        "EnterPlanMode",
        "da6247581299df00293c939487513c190e840f591ce516f12abc5576dbaa74de",
        "25c7d85c859a6f78f6f4e83edf2d3073645b7c71d2832348387882a6833b1834",
    ),
    (
        "ExitPlanMode",
        "9a76355a2730e9d3e96eef6683a5e7003c94f615b815e391454a1d38a660b2f0",
        "10b6b14fa4631e913d1cdfb6a4ed5def541cdd73f2f65430ac688e17ad7c8b71",
    ),
    (
        "EnterWorktree",
        "6b12f177663fed89c95fbba352a0399ca76fc4b62854e34d465ffe77436f181d",
        "99305a79fb5363db0fd199683417a1e1fe65f0eb0f267b9ea87d745140000848",
    ),
    (
        "ExitWorktree",
        "63e763304c955ebf3f58ec48bffa71fcf54b87ad4ef8319cf3bf284fe7e19411",
        "2cc3f9ef86ce57093a6f4c273c818e95b730f9b5f81c623618d3d9193ebd2c3c",
    ),
    (
        "Skill",
        "b7b5734f7a750d891f67b0cff9c2b44cd948f199a53ad185403087794a6ec702",
        "99c4e1bf71c79d39b7514a7597b9cf041169b9f91a8ca2a0471139677ecafd57",
    ),
    (
        "TaskOutput",
        "3c22d2149a4d61be32d29c5984dd66b1f33db597be0bd70ca28e96c97fdcc89b",
        "ac3b00a7b7ce78b1333c78dc0d7da705f6dca4f78aaf42b8f9c4e588a9f03fe4",
    ),
    (
        "TaskStop",
        "049769e0c50d66f60158a425be924ca357ec1c9e17147aa7360f31027bb7a62c",
        "ef093179a53233e9f1f0bb755077114a8a4b604a77fb364688750ed734876eaa",
    ),
    (
        "TodoWrite",
        "a973f0bb257fc19d2a303adf8172323ac3da6dc4da051466f53af0daa18a36a0",
        "8dd516684bc2c5fe145e9fc869d735c689face88a8495a074fa5258d2110d6f0",
    ),
];

#[test]
fn descriptions_and_schemas_match_the_cli_capture() {
    let names: Vec<&str> = CAPTURED.iter().map(|c| c.0).collect();
    let registry = registry_with(&names);
    for def in registry.api_definitions() {
        let (_, desc_hash, schema_hash) = CAPTURED
            .iter()
            .find(|c| c.0 == def.name)
            .expect("capturada");
        assert_eq!(
            &sha(def.description.as_deref().unwrap_or_default()),
            desc_hash,
            "descrição de {} diverge do CLI",
            def.name
        );
        assert_eq!(
            &sha(&serde_json::to_string(&def.input_schema).unwrap()),
            schema_hash,
            "schema de {} diverge do CLI",
            def.name
        );
    }
}

fn noop_runner() -> AgentRunFn {
    Arc::new(|_request| Box::pin(async { Err("runner de teste".to_string()) }))
}

#[test]
fn agent_description_and_schema_match_the_cli_in_sdk_mode() {
    use prana::tools::framework::Tool;
    let tool = AgentTool::with_prompt_options(
        builtin_agents(&BuiltinAgentOptions {
            disabled: false,
            explore_plan_enabled: true,
        }),
        PermissionRules::default(),
        noop_runner(),
        AgentPromptOptions {
            background_tasks_enabled: true,
            subscription_pro: false,
            list_via_attachment: false,
        },
    );
    assert_eq!(
        sha(tool.description()),
        "ce678e1504bcd1a0ff949a7c3c16ba75fa7b203553872fb3a45952a8902a8c24"
    );
    assert_eq!(
        sha(&serde_json::to_string(&tool.input_schema()).unwrap()),
        "9b0b81e5b97eb8341162c2e009ae10cff0d22310494545539301fb3a48ab41f4"
    );
}

#[test]
fn agent_listing_with_an_extra_agent_matches_the_cli_outside_sdk() {
    use prana::tools::framework::Tool;
    // Fora do SDK o CLI lista também o claude-code-guide; com ele como
    // agente extra, a descrição fica idêntica à captura do CLI.
    let mut agents = builtin_agents(&BuiltinAgentOptions {
        disabled: false,
        explore_plan_enabled: true,
    });
    agents.push(AgentDescriptor {
        agent_type: "claude-code-guide".to_string(),
        when_to_use: "Use this agent when the user asks questions (\"Can Claude...\", \"Does Claude...\", \"How do I...\") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can continue via SendMessage.".to_string(),
        tools: Some(
            ["Glob", "Grep", "Read", "WebFetch", "WebSearch"]
                .iter()
                .map(|s| s.to_string())
                .collect(),
        ),
        disallowed_tools: None,
        system_prompt: String::new(),
        model: Some("haiku".to_string()),
        source: AgentSource::BuiltIn,
        max_turns: None,
        permission_mode: None,
        omit_claude_md: false,
        background: false,
    });
    let tool = AgentTool::with_prompt_options(
        agents,
        PermissionRules::default(),
        noop_runner(),
        AgentPromptOptions {
            background_tasks_enabled: true,
            subscription_pro: false,
            list_via_attachment: false,
        },
    );
    assert_eq!(
        sha(tool.description()),
        "a1f486be7d5f09d09a1edb23848882d8774af78ddc04efa5ff507737c1261a59"
    );
}

#[test]
fn subagent_system_prompts_match_the_cli_capture() {
    let agents = builtin_agents(&BuiltinAgentOptions {
        disabled: false,
        explore_plan_enabled: true,
    });
    let env = |model: &str| {
        SubagentEnvironment {
        working_directory: "/tmp/claude-1000/-home-john-projects-rust-agent-sdk/2773161d-205e-49fa-85ec-8a1cddad5744/scratchpad/cc290/proj".to_string(),
        is_git_repo: false,
        additional_directories: Vec::new(),
        platform: "linux".to_string(),
        shell: "zsh".to_string(),
        os_version: "Linux 6.12.101+deb13-amd64".to_string(),
        model: model.to_string(),
    }
    };
    let expected = [
        (
            "general-purpose",
            "claude-sonnet-4-6",
            "a3c73b6ec4ef3b48195a6da4b4c12b413f8759f803fa6e37a9aa0c96a9f5cd72",
        ),
        (
            "statusline-setup",
            "claude-sonnet-4-6",
            "264e28aa2454aecc0fdbf90d1783400bd7075dfc689714f0278eff28342fc6db",
        ),
        (
            "Explore",
            "claude-haiku-4-5-20251001",
            "30f3ebe20db40266e71f5c31edeb04b25de6af4b2248c896dea6771f768b8b59",
        ),
        (
            "Plan",
            "claude-sonnet-4-6",
            "7f4bfcb3013d13d76359b2aeccb859b2f7e201f8f3d20a4d2035ab7e899073f7",
        ),
    ];
    for (agent_type, model, hash) in expected {
        let agent = agents.iter().find(|a| a.agent_type == agent_type).unwrap();
        assert_eq!(
            sha(&subagent_system_prompt(&agent.system_prompt, &env(model))),
            hash,
            "prompt de sistema do {agent_type} diverge do CLI"
        );
    }
}

// ---------------------------------------------------------------------------
// Agent
// ---------------------------------------------------------------------------

fn completing_runner(agent_id: &'static str) -> AgentRunFn {
    Arc::new(move |request| {
        Box::pin(async move {
            assert_eq!(request.prompt, "faça");
            Ok(AgentRunOutcome::Completed(SubagentCompletion {
                agent_id: agent_id.to_string(),
                content: vec![json!({"type": "text", "text": "ok"})],
                total_duration_ms: 37,
                total_tokens: 2,
                total_tool_use_count: 0,
                usage: json!({"input_tokens": 1, "output_tokens": 1}),
                worktree_path: None,
                worktree_branch: None,
            }))
        })
    })
}

#[tokio::test]
async fn agent_result_matches_the_cli_blocks_and_data() {
    let agents = active_agents_from_map(
        &Default::default(),
        &BuiltinAgentOptions {
            disabled: false,
            explore_plan_enabled: true,
        },
    );
    let mut registry = ToolRegistry::new();
    registry.register(Box::new(AgentTool::new(
        agents,
        PermissionRules::default(),
        completing_runner("a9bbc34933a1411bc"),
    )));
    let executor = ToolExecutor::new(registry, ToolContext::default());
    let results = executor
        .execute_all(vec![
            tool_use("t1", "Agent", json!({"description": "d", "prompt": "faça"})),
            tool_use(
                "t2",
                "Agent",
                json!({"description": "d", "prompt": "faça", "subagent_type": "Explore"}),
            ),
            tool_use(
                "t3",
                "Agent",
                json!({"description": "d", "prompt": "x", "subagent_type": "nope"}),
            ),
        ])
        .await;
    // Capturado do CLI: general-purpose leva o trailer; Explore não.
    assert_eq!(
        text_of(&results[0]),
        "ok\nagentId: a9bbc34933a1411bc (use SendMessage with to: 'a9bbc34933a1411bc' to continue this agent)\n<usage>total_tokens: 2\ntool_uses: 0\nduration_ms: 37</usage>"
    );
    assert!(!results[0].result.content_as_string);
    let data = results[0].result.tool_use_result.clone().unwrap();
    let keys: Vec<&str> = data
        .as_object()
        .unwrap()
        .keys()
        .map(String::as_str)
        .collect();
    assert_eq!(
        keys,
        vec![
            "status",
            "prompt",
            "agentId",
            "agentType",
            "content",
            "totalDurationMs",
            "totalTokens",
            "totalToolUseCount",
            "usage"
        ]
    );
    assert_eq!(text_of(&results[1]), "ok");
    assert!(results[2].result.is_error);
    assert_eq!(
        text_of(&results[2]),
        "Agent type 'nope' not found. Available agents: general-purpose, statusline-setup, Explore, Plan"
    );
}

#[tokio::test]
async fn denied_agent_type_disappears_and_errors_like_the_cli() {
    let rules = PermissionRules::from_lists(&[], &["Agent(Explore)".to_string()]);
    let tool = AgentTool::new(
        builtin_agents(&BuiltinAgentOptions {
            disabled: false,
            explore_plan_enabled: true,
        }),
        rules.clone(),
        completing_runner("x"),
    );
    use prana::tools::framework::Tool;
    assert!(!tool.description().contains("- Explore:"));
    let mut registry = ToolRegistry::new();
    registry.register(Box::new(tool));
    let executor = ToolExecutor::new(registry, ToolContext::default()).with_permission_rules(rules);
    let results = executor
        .execute_all(vec![tool_use(
            "t1",
            "Agent",
            json!({"description": "d", "prompt": "faça", "subagent_type": "Explore"}),
        )])
        .await;
    assert_eq!(
        text_of(&results[0]),
        "Agent type 'Explore' has been denied by permission rule 'Agent(Explore)' from cliArg."
    );
}

// ---------------------------------------------------------------------------
// AskUserQuestion
// ---------------------------------------------------------------------------

#[tokio::test]
async fn ask_user_question_goes_through_the_callback_and_formats_like_the_cli() {
    let answered = json!({
        "questions": [{"question": "Qual lib?", "header": "Lib", "options": [
            {"label": "A", "description": "a"}, {"label": "B", "description": "b"}], "multiSelect": false}],
        "answers": {"Qual lib?": "B"},
        "annotations": {"Qual lib?": {"notes": "prefiro B"}}
    });
    let (cb, seen) = callback(PermissionOutcome::Allow {
        updated_input: Some(answered),
    });
    // Mesmo em bypass o AskUserQuestion pergunta: é interação obrigatória.
    let ctx = ToolContext {
        permission_mode: PermissionMode::BypassPermissions,
        permission_callback: Some(cb),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["AskUserQuestion"]), ctx);
    let results = executor
        .execute_all(vec![tool_use(
            "t1",
            "AskUserQuestion",
            json!({"questions": [{"question": "Qual lib?", "header": "Lib", "options": [
                {"label": "A", "description": "a"}, {"label": "B", "description": "b", "extra": 1}]}]}),
        )])
        .await;
    assert_eq!(
        text_of(&results[0]),
        "User has answered your questions: \"Qual lib?\"=\"B\" user notes: prefiro B. You can now continue with the user's answers in mind."
    );
    // O callback recebe o input já normalizado pelo parse (default de
    // multiSelect e chave extra da opção removida), como no can_use_tool do CLI.
    let requests = seen.lock().unwrap();
    assert_eq!(
        requests[0].input,
        json!({"questions": [{"question": "Qual lib?", "header": "Lib", "options": [
            {"label": "A", "description": "a"}, {"label": "B", "description": "b"}], "multiSelect": false}]})
    );
    assert_eq!(
        results[0].result.tool_use_result,
        Some(json!({
            "questions": [{"question": "Qual lib?", "header": "Lib", "options": [
                {"label": "A", "description": "a"}, {"label": "B", "description": "b"}], "multiSelect": false}],
            "answers": {"Qual lib?": "B"},
            "annotations": {"Qual lib?": {"notes": "prefiro B"}}
        }))
    );
}

#[tokio::test]
async fn ask_user_question_without_answers_is_not_an_error() {
    let (cb, _) = callback(PermissionOutcome::Allow {
        updated_input: None,
    });
    let ctx = ToolContext {
        permission_callback: Some(cb),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["AskUserQuestion"]), ctx);
    let results = executor
        .execute_all(vec![tool_use(
            "t1",
            "AskUserQuestion",
            json!({"questions": [{"question": "Q?", "header": "H", "options": [
                {"label": "A", "description": "a"}, {"label": "B", "description": "b"}]}]}),
        )])
        .await;
    assert!(!results[0].result.is_error);
    assert_eq!(
        text_of(&results[0]),
        "User has answered your questions: . You can now continue with the user's answers in mind."
    );
}

#[tokio::test]
async fn ask_user_question_uniqueness_refinement_uses_the_zod_message() {
    let (cb, seen) = callback(PermissionOutcome::Allow {
        updated_input: None,
    });
    let ctx = ToolContext {
        permission_callback: Some(cb),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["AskUserQuestion"]), ctx);
    let results = executor
        .execute_all(vec![tool_use(
            "t1",
            "AskUserQuestion",
            json!({"questions": [{"question": "Qual?", "header": "H", "options": [
                {"label": "A", "description": "a"}, {"label": "A", "description": "b"}], "multiSelect": false}]}),
        )])
        .await;
    // Texto exato capturado do CLI.
    assert_eq!(
        text_of(&results[0]),
        "<tool_use_error>InputValidationError: [\n  {\n    \"code\": \"custom\",\n    \"path\": [],\n    \"message\": \"Question texts must be unique, option labels must be unique within each question\"\n  }\n]</tool_use_error>"
    );
    assert!(seen.lock().unwrap().is_empty());
}

// ---------------------------------------------------------------------------
// Plan mode
// ---------------------------------------------------------------------------

#[tokio::test]
async fn plan_mode_round_trip_follows_the_cli() {
    isolate_config_home();
    let shared = Arc::new(std::sync::RwLock::new(PermissionMode::AcceptEdits));
    let (cb, seen) = callback(PermissionOutcome::Allow {
        updated_input: None,
    });
    let ctx = ToolContext {
        permission_mode_shared: Some(Arc::clone(&shared)),
        permission_callback: Some(cb),
        task_store: Some(Arc::new(TaskStore::new())),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["EnterPlanMode", "ExitPlanMode"]), ctx);

    let results = executor
        .execute_all(vec![tool_use("t0", "ExitPlanMode", json!({}))])
        .await;
    assert_eq!(
        text_of(&results[0]),
        "<tool_use_error>You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.</tool_use_error>"
    );

    let results = executor
        .execute_all(vec![tool_use("t1", "EnterPlanMode", json!({}))])
        .await;
    assert_eq!(*shared.read().unwrap(), PermissionMode::Plan);
    assert!(text_of(&results[0]).starts_with(
        "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.\n\nIn plan mode, you should:\n1. Thoroughly explore"
    ));
    assert_eq!(
        results[0].result.tool_use_result,
        Some(
            json!({"message": "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."})
        )
    );

    let results = executor
        .execute_all(vec![tool_use(
            "t2",
            "ExitPlanMode",
            json!({"plan": "# Meu plano\n\n1. Fazer X"}),
        )])
        .await;
    // A aprovação passa pelo callback, e o modo volta ao de antes do plano.
    assert_eq!(seen.lock().unwrap().len(), 1);
    assert_eq!(*shared.read().unwrap(), PermissionMode::AcceptEdits);
    let text = text_of(&results[0]);
    assert!(text.starts_with("User has approved your plan. You can now start coding. Start with updating your todo list if applicable\n\nYour plan has been saved to: "));
    assert!(text.ends_with("\n\n## Approved Plan (edited by user):\n# Meu plano\n\n1. Fazer X"));
    let data = results[0].result.tool_use_result.clone().unwrap();
    let file = data["filePath"].as_str().unwrap();
    assert_eq!(
        std::fs::read_to_string(file).unwrap(),
        "# Meu plano\n\n1. Fazer X"
    );
    assert_eq!(data["planWasEdited"], json!(true));
}

// ---------------------------------------------------------------------------
// TodoWrite
// ---------------------------------------------------------------------------

#[tokio::test]
async fn todo_write_is_allowed_without_callback_and_returns_old_and_new() {
    let store = Arc::new(std::sync::Mutex::new(Value::Null));
    let ctx = ToolContext {
        todo_store: Some(Arc::clone(&store)),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["TodoWrite"]), ctx);
    let first = json!([{"content": "Fazer X", "status": "in_progress", "activeForm": "Fazendo X"}]);
    let done = json!([{"content": "Fazer X", "status": "completed", "activeForm": "Fazendo X"}]);
    let results = executor
        .execute_all(vec![
            tool_use("t1", "TodoWrite", json!({"todos": first})),
            tool_use("t2", "TodoWrite", json!({"todos": done})),
        ])
        .await;
    assert_eq!(
        text_of(&results[0]),
        "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
    );
    assert_eq!(
        results[0].result.tool_use_result,
        Some(json!({"oldTodos": [], "newTodos": first, "verificationNudgeNeeded": false}))
    );
    assert_eq!(
        results[1].result.tool_use_result,
        Some(json!({"oldTodos": first, "newTodos": done, "verificationNudgeNeeded": false}))
    );
    // Tudo concluído: a lista guardada zera, como no JS.
    assert_eq!(*store.lock().unwrap(), json!([]));
}

// ---------------------------------------------------------------------------
// TaskOutput e TaskStop
// ---------------------------------------------------------------------------

async fn spawn_background(store: &TaskStore, dir: &Path, script: &str) -> String {
    let out = dir.join(format!("{}.out", uuid::Uuid::new_v4()));
    let file = std::fs::File::create(&out).unwrap();
    let child = tokio::process::Command::new("sh")
        .args(["-c", script])
        .stdout(std::process::Stdio::from(file))
        .spawn()
        .unwrap();
    store
        .register_background_command("teste".into(), script.into(), out, child)
        .await
}

#[tokio::test]
async fn task_output_and_stop_follow_the_cli() {
    let dir = tempfile::tempdir().unwrap();
    let store = Arc::new(TaskStore::new());
    let failing = spawn_background(&store, dir.path(), "echo oi; exit 3").await;
    let sleeping = spawn_background(&store, dir.path(), "sleep 30").await;
    let ctx = ToolContext {
        task_store: Some(Arc::clone(&store)),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["TaskOutput", "TaskStop"]), ctx);
    let results = executor
        .execute_all(vec![
            tool_use("t1", "TaskOutput", json!({"task_id": failing})),
            tool_use("t2", "TaskOutput", json!({"task_id": "nope"})),
            tool_use("t3", "TaskStop", json!({})),
            tool_use("t4", "TaskStop", json!({"task_id": "nope"})),
            tool_use("t5", "TaskStop", json!({"task_id": sleeping})),
            tool_use("t6", "TaskStop", json!({"task_id": sleeping})),
        ])
        .await;
    assert_eq!(
        text_of(&results[0]),
        format!("<retrieval_status>success</retrieval_status>\n\n<task_id>{failing}</task_id>\n\n<task_type>local_bash</task_type>\n\n<status>failed</status>\n\n<exit_code>3</exit_code>\n\n<output>\noi\n</output>")
    );
    // Textos capturados do CLI.
    assert_eq!(
        text_of(&results[1]),
        "<tool_use_error>No task found with ID: nope</tool_use_error>"
    );
    assert_eq!(
        text_of(&results[2]),
        "<tool_use_error>Missing required parameter: task_id</tool_use_error>"
    );
    assert_eq!(
        text_of(&results[3]),
        "<tool_use_error>No task found with ID: nope</tool_use_error>"
    );
    assert_eq!(
        text_of(&results[4]),
        format!("{{\"message\":\"Successfully stopped task: {sleeping} (sleep 30)\",\"task_id\":\"{sleeping}\",\"task_type\":\"local_bash\",\"command\":\"sleep 30\"}}")
    );
    assert_eq!(
        text_of(&results[5]),
        format!("<tool_use_error>Task {sleeping} is not running (status: killed)</tool_use_error>")
    );
}

// ---------------------------------------------------------------------------
// Skill
// ---------------------------------------------------------------------------

#[tokio::test]
async fn skill_injects_the_content_as_a_new_message_like_the_cli() {
    let root = tempfile::tempdir().unwrap();
    let skill_dir = root.path().join("demo-skill");
    std::fs::create_dir_all(&skill_dir).unwrap();
    std::fs::write(
        skill_dir.join("SKILL.md"),
        "---\nname: demo-skill\ndescription: Demo skill for capture\n---\n\nDo the demo thing with $ARGUMENTS.\n",
    )
    .unwrap();
    let ctx = ToolContext {
        skill_directories: vec![root.path().to_path_buf()],
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["Skill"]), ctx);
    let results = executor
        .execute_all(vec![
            tool_use(
                "t1",
                "Skill",
                json!({"skill": "demo-skill", "args": "foo bar"}),
            ),
            tool_use("t2", "Skill", json!({"skill": "nope"})),
        ])
        .await;
    // Capturado do CLI: resultado curto, conteúdo do skill numa mensagem nova.
    assert_eq!(text_of(&results[0]), "Launching skill: demo-skill");
    assert_eq!(
        results[0].result.tool_use_result,
        Some(json!({"success": true, "commandName": "demo-skill"}))
    );
    let message = serde_json::to_value(&results[0].result.new_messages).unwrap();
    assert_eq!(
        message,
        json!([{"role": "user", "content": [{"type": "text", "text": format!(
            "Base directory for this skill: {}\n\nDo the demo thing with foo bar.\n",
            skill_dir.display()
        )}]}])
    );
    assert_eq!(
        text_of(&results[1]),
        "<tool_use_error>Unknown skill: nope</tool_use_error>"
    );
}

#[tokio::test]
async fn skill_with_allowed_tools_asks_and_deny_rule_blocks() {
    let root = tempfile::tempdir().unwrap();
    let skill_dir = root.path().join("deploy");
    std::fs::create_dir_all(&skill_dir).unwrap();
    std::fs::write(
        skill_dir.join("SKILL.md"),
        "---\ndescription: Deploy\nallowed-tools: Bash(git status:*)\n---\nDeploy.\n",
    )
    .unwrap();
    let (cb, seen) = callback(PermissionOutcome::Deny {
        message: "não".into(),
    });
    let ctx = ToolContext {
        skill_directories: vec![root.path().to_path_buf()],
        permission_callback: Some(cb),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["Skill"]), ctx);
    let results = executor
        .execute_all(vec![tool_use("t1", "Skill", json!({"skill": "deploy"}))])
        .await;
    assert!(results[0].denied);
    {
        let requests = seen.lock().unwrap();
        assert_eq!(requests[0].description, "Execute skill: deploy");
        assert_eq!(
            requests[0].permission_suggestions.as_ref().unwrap()[1]["rules"][0]["ruleContent"],
            json!("deploy:*")
        );
    }

    let executor = ToolExecutor::new(
        registry_with(&["Skill"]),
        ToolContext {
            skill_directories: vec![root.path().to_path_buf()],
            ..Default::default()
        },
    )
    .with_permission_rules(PermissionRules::from_lists(
        &[],
        &["Skill(dep:*)".to_string()],
    ));
    let results = executor
        .execute_all(vec![tool_use("t2", "Skill", json!({"skill": "deploy"}))])
        .await;
    assert_eq!(
        text_of(&results[0]),
        "Skill execution blocked by permission rules"
    );
}

// ---------------------------------------------------------------------------
// Worktree
// ---------------------------------------------------------------------------

fn git(dir: &Path, args: &[&str]) {
    let status = std::process::Command::new("git")
        .args(args)
        .current_dir(dir)
        .env("GIT_AUTHOR_NAME", "t")
        .env("GIT_AUTHOR_EMAIL", "t@t")
        .env("GIT_COMMITTER_NAME", "t")
        .env("GIT_COMMITTER_EMAIL", "t@t")
        .output()
        .unwrap();
    assert!(status.status.success(), "git {args:?}: {status:?}");
}

#[tokio::test]
async fn worktree_errors_match_the_cli_capture() {
    let plain = tempfile::tempdir().unwrap();
    let ctx = ToolContext {
        working_directory: plain.path().to_path_buf(),
        task_store: Some(Arc::new(TaskStore::new())),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["EnterWorktree", "ExitWorktree"]), ctx);
    let results = executor
        .execute_all(vec![
            tool_use("t1", "ExitWorktree", json!({"action": "keep"})),
            tool_use("t2", "EnterWorktree", json!({"name": "wt1"})),
            tool_use("t3", "EnterWorktree", json!({"name": "a/../b"})),
        ])
        .await;
    let em = char::from_u32(0x2014).unwrap();
    assert_eq!(
        text_of(&results[0]),
        format!("<tool_use_error>No-op: there is no active EnterWorktree session to exit. This tool only operates on worktrees created by EnterWorktree in the current session {em} it will not touch worktrees created manually or in a previous session. No filesystem changes were made.</tool_use_error>")
    );
    assert_eq!(
        text_of(&results[1]),
        "Cannot create a worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems."
    );
    assert!(text_of(&results[2]).contains("\"code\": \"custom\""));
}

#[tokio::test]
async fn worktree_enter_and_remove_in_a_real_repo() {
    let repo = tempfile::tempdir().unwrap();
    git(repo.path(), &["init", "-q", "-b", "main"]);
    std::fs::write(repo.path().join("a.txt"), "a").unwrap();
    git(repo.path(), &["add", "."]);
    git(repo.path(), &["commit", "-q", "-m", "base"]);
    let repo_root = std::fs::canonicalize(repo.path()).unwrap();
    let store = Arc::new(TaskStore::new());
    let ctx = ToolContext {
        working_directory: repo_root.clone(),
        task_store: Some(Arc::clone(&store)),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["EnterWorktree", "ExitWorktree"]), ctx);
    let results = executor
        .execute_all(vec![tool_use(
            "t1",
            "EnterWorktree",
            json!({"name": "wt1"}),
        )])
        .await;
    let path = repo_root.join(".claude").join("worktrees").join("wt1");
    assert_eq!(
        text_of(&results[0]),
        format!("Created worktree at {} on branch worktree-wt1. The session is now working in the worktree. Use ExitWorktree to leave mid-session, or exit the session to be prompted.", path.display())
    );
    assert!(path.join("a.txt").exists());
    assert_eq!(store.effective_cwd(), Some(path.clone()));

    // Arquivo novo na worktree: remover sem confirmação é recusado.
    std::fs::write(path.join("novo.txt"), "n").unwrap();
    let em = char::from_u32(0x2014).unwrap();
    let results = executor
        .execute_all(vec![tool_use(
            "t2",
            "ExitWorktree",
            json!({"action": "remove"}),
        )])
        .await;
    assert_eq!(
        text_of(&results[0]),
        format!("<tool_use_error>Worktree has 1 uncommitted file. Removing will discard this work permanently. Confirm with the user, then re-invoke with discard_changes: true {em} or use action: \"keep\" to preserve the worktree.</tool_use_error>")
    );
    let results = executor
        .execute_all(vec![tool_use(
            "t3",
            "ExitWorktree",
            json!({"action": "remove", "discard_changes": true}),
        )])
        .await;
    assert_eq!(
        text_of(&results[0]),
        format!(
            "Exited and removed worktree at {}. Discarded 1 uncommitted file. Session is now back in {}.",
            path.display(),
            repo_root.display()
        )
    );
    assert!(!path.exists());
    assert_eq!(store.effective_cwd(), None);
}

// ---------------------------------------------------------------------------
// MCP
// ---------------------------------------------------------------------------

#[test]
fn mcp_result_conversion_follows_the_cli() {
    use prana::tools::mcp_result::mcp_call_result_to_tool_result;
    let out = mcp_call_result_to_tool_result(&json!({"content": []}), "srv", "t", None);
    assert!(out.content.is_empty());
    let out = mcp_call_result_to_tool_result(
        &json!({"isError": true, "error": "quebrou"}),
        "srv",
        "t",
        None,
    );
    assert_eq!(out.text_content(), "quebrou");
    assert_eq!(out.tool_use_result, Some(json!("Error: quebrou")));
}
