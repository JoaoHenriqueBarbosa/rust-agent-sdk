//! Paridade das tools builtin do transporte nativo com o CLI 2.1.90.
//!
//! As fixtures em `tests/fixtures/cli_2_1_90/tools/` são as definições que o
//! CLI 2.1.90 de verdade mandou à API (capturadas com um servidor local no
//! lugar da API, sessão `-p` com `--setting-sources project`), com os
//! caracteres não ASCII escapados no JSON. Descrição e `input_schema` de cada
//! builtin precisam sair idênticos, porque o modelo foi treinado contra eles.

use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use async_trait::async_trait;
use serde_json::{json, Value};

use prana::api::streaming::ToolUseBlock;
use prana::tools::framework::{
    PermissionCallbackFn, PermissionOutcome, Tool, ToolContext, ToolExecutor,
    ToolPermissionRequest, ToolRegistry, ToolResult, DEFAULT_TOOL_NAMES,
};
use prana::tools::permission::PermissionRules;

fn fixture(name: &str) -> Value {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures/cli_2_1_90/tools")
        .join(format!("{name}.json"));
    let text = std::fs::read_to_string(&path)
        .unwrap_or_else(|e| panic!("fixture {}: {e}", path.display()));
    serde_json::from_str(&text).expect("fixture JSON")
}

/// O mês corrente no formato do prompt do WebSearch (`September 2026`).
fn current_month_line() -> String {
    format!(
        "The current month is {}.",
        chrono::Local::now().format("%B %Y")
    )
}

/// Troca a linha do mês da fixture pela do mês corrente: é a única parte
/// dinâmica do prompt do WebSearch.
fn normalize_web_search_month(description: &str) -> String {
    let marker = "The current month is ";
    let Some(start) = description.find(marker) else {
        return description.to_string();
    };
    let end = description[start..]
        .find('.')
        .map(|i| start + i + 1)
        .unwrap_or(description.len());
    format!(
        "{}{}{}",
        &description[..start],
        current_month_line(),
        &description[end..]
    )
}

#[test]
fn builtin_definitions_match_the_cli_capture() {
    let mut mismatches: Vec<String> = Vec::new();
    for name in DEFAULT_TOOL_NAMES {
        if *name == "Agent" {
            // O Agent é montado pelo engine com os agentes da sessão; tem
            // teste próprio abaixo.
            continue;
        }
        let tool = ToolRegistry::builtin(name).unwrap_or_else(|| panic!("builtin {name}"));
        let expected = fixture(name);
        let mut expected_description = expected["description"].as_str().unwrap().to_string();
        if *name == "WebSearch" {
            expected_description = normalize_web_search_month(&expected_description);
        }
        let description = tool.description().to_string();
        let description_ok = description == expected_description
            || (*name == "Read"
                && description == fixture("Read.variant_a")["description"].as_str().unwrap());
        if !description_ok {
            mismatches.push(format!(
                "{name}: descrição difere\n--- esperado\n{expected_description}\n--- obtido\n{description}"
            ));
        }
        if tool.input_schema() != expected["input_schema"] {
            mismatches.push(format!(
                "{name}: input_schema difere\n--- esperado\n{}\n--- obtido\n{}",
                serde_json::to_string_pretty(&expected["input_schema"]).unwrap(),
                serde_json::to_string_pretty(&tool.input_schema()).unwrap()
            ));
        }
        // A ordem das chaves também faz parte do texto que a API recebe.
        let wire = serde_json::to_string(&tool.input_schema()).unwrap();
        let expected_wire = serde_json::to_string(&expected["input_schema"]).unwrap();
        if wire != expected_wire && tool.input_schema() == expected["input_schema"] {
            mismatches.push(format!(
                "{name}: ordem das chaves do input_schema difere\n{expected_wire}\n{wire}"
            ));
        }
    }
    assert!(mismatches.is_empty(), "{}", mismatches.join("\n\n"));
}

#[test]
fn agent_definition_matches_the_cli_capture_without_custom_agents() {
    use prana::tools::agent::{
        active_agents_from_map, agent_tool_input_schema, agent_tool_prompt, AgentPromptOptions,
        BuiltinAgentOptions,
    };
    // Capturado em modo SDK (`CLAUDE_CODE_ENTRYPOINT=sdk-py`), sem agentes
    // do chamador: só os builtin do modo SDK.
    let expected = fixture("Agent");
    let agents = active_agents_from_map(
        &std::collections::HashMap::new(),
        &BuiltinAgentOptions::default(),
    );
    let options = AgentPromptOptions::default();
    assert_eq!(
        agent_tool_prompt(&agents, &options),
        expected["description"].as_str().unwrap()
    );
    assert_eq!(
        serde_json::to_string(&agent_tool_input_schema(options.background_tasks_enabled)).unwrap(),
        serde_json::to_string(&expected["input_schema"]).unwrap()
    );
}

/// Tool de teste que só ocupa um nome (o Agent do engine, as MCP da sessão).
struct Named(&'static str);

#[async_trait]
impl Tool for Named {
    fn name(&self) -> &str {
        self.0
    }
    fn description(&self) -> &str {
        "tool de teste"
    }
    fn input_schema(&self) -> Value {
        json!({"type": "object", "properties": {}})
    }
    async fn execute(&self, _input: Value, _ctx: &ToolContext) -> ToolResult {
        ToolResult::text(format!("executou {}", self.0))
    }
}

#[test]
fn production_scenario_exposes_the_cli_tools_in_the_cli_order() {
    // O cenário do serviço de chat: allowed_tools com as MCP exatas e o
    // disallowed das tools de escrita e busca local.
    let disallowed: Vec<String> = [
        "Bash",
        "Write",
        "Edit",
        "MultiEdit",
        "NotebookEdit",
        "Glob",
        "Grep",
        "TodoWrite",
    ]
    .iter()
    .map(|s| s.to_string())
    .collect();
    let allowed = vec![
        "mcp__omnia__search_docs".to_string(),
        "mcp__omnia__get_order".to_string(),
    ];
    let rules = PermissionRules::from_lists(&allowed, &disallowed);

    let mut registry = ToolRegistry::new();
    registry.register_defaults();
    registry.register(Box::new(Named("Agent")));
    registry.register(Box::new(Named("mcp__omnia__search_docs")));
    registry.register(Box::new(Named("mcp__omnia__get_order")));
    registry.retain(|name| !rules.is_tool_fully_denied(name));

    assert_eq!(
        registry.ordered_names(),
        vec![
            "Agent",
            "AskUserQuestion",
            "EnterPlanMode",
            "EnterWorktree",
            "ExitPlanMode",
            "ExitWorktree",
            "Read",
            "Skill",
            "TaskOutput",
            "TaskStop",
            "WebFetch",
            "WebSearch",
            "mcp__omnia__get_order",
            "mcp__omnia__search_docs",
        ]
    );
    let definitions = registry.api_definitions();
    assert_eq!(definitions.len(), 14);
    assert_eq!(definitions[0].name, "Agent");
    // WebSearch é tool CLIENTE no CLI: definição comum, sem tipo de server
    // tool no request principal.
    let web_search = definitions.iter().find(|d| d.name == "WebSearch").unwrap();
    assert!(web_search.r#type.is_none());
}

type Seen = Arc<Mutex<Vec<ToolPermissionRequest>>>;

fn callback(outcome: PermissionOutcome) -> (PermissionCallbackFn, Seen) {
    let seen: Seen = Arc::new(Mutex::new(Vec::new()));
    let seen_cb = Arc::clone(&seen);
    let cb: PermissionCallbackFn = Arc::new(move |request| {
        seen_cb.lock().unwrap().push(request);
        let outcome = outcome.clone();
        Box::pin(async move { outcome })
    });
    (cb, seen)
}

fn use_block(id: &str, name: &str, input: Value) -> ToolUseBlock {
    ToolUseBlock {
        id: id.to_string(),
        name: name.to_string(),
        input,
    }
}

#[tokio::test]
async fn read_inside_the_cwd_needs_no_callback_and_outside_asks_it() {
    let cwd = tempfile::tempdir().unwrap();
    let inside = cwd.path().join("pedido.txt");
    std::fs::write(&inside, "linha um\nlinha dois\n").unwrap();
    let outside = tempfile::tempdir().unwrap();
    let outside_file = outside.path().join("fora.txt");
    std::fs::write(&outside_file, "segredo\n").unwrap();

    let (cb, seen) = callback(PermissionOutcome::Deny {
        message: "Fora do diretório da sessão.".to_string(),
    });
    let mut registry = ToolRegistry::new();
    registry.register(ToolRegistry::builtin("Read").unwrap());
    let ctx = ToolContext {
        working_directory: cwd.path().to_path_buf(),
        permission_callback: Some(cb),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry, ctx);

    let results = executor
        .execute_all(vec![
            use_block("t1", "Read", json!({"file_path": inside.to_string_lossy()})),
            use_block(
                "t2",
                "Read",
                json!({"file_path": outside_file.to_string_lossy()}),
            ),
        ])
        .await;

    // Dentro do cwd: sem pergunta, com o conteúdo numerado.
    assert!(!results[0].result.is_error);
    assert!(results[0]
        .result
        .text_content()
        .starts_with("1\tlinha um\n2\tlinha dois"));

    // Fora do cwd: a pergunta chega ao callback com o motivo e a sugestão do
    // CLI, e a recusa do callback é o que o modelo lê.
    assert!(results[1].denied);
    assert_eq!(
        results[1].result.text_content(),
        "Fora do diretório da sessão."
    );
    let requests = seen.lock().unwrap();
    assert_eq!(requests.len(), 1, "só a leitura de fora pergunta");
    assert_eq!(requests[0].tool_name, "Read");
    assert_eq!(requests[0].tool_use_id.as_deref(), Some("t2"));
    assert_eq!(
        requests[0].decision_reason.as_deref(),
        Some("Path is outside allowed working directories")
    );
    let suggestions = requests[0]
        .permission_suggestions
        .clone()
        .expect("sugestões");
    assert_eq!(suggestions[0]["type"], "addRules");
    assert_eq!(suggestions[0]["behavior"], "allow");
}

#[tokio::test]
async fn read_only_is_not_auto_allowed_for_mcp_tools() {
    // Uma tool MCP sem regra allow pergunta, mesmo que se declare read-only.
    struct ReadOnlyMcp;
    #[async_trait]
    impl Tool for ReadOnlyMcp {
        fn name(&self) -> &str {
            "mcp__omnia__listar"
        }
        fn description(&self) -> &str {
            "lista"
        }
        fn input_schema(&self) -> Value {
            json!({"type": "object", "properties": {}})
        }
        fn is_read_only(&self) -> bool {
            true
        }
        async fn execute(&self, _input: Value, _ctx: &ToolContext) -> ToolResult {
            ToolResult::text("lista")
        }
    }
    let (cb, seen) = callback(PermissionOutcome::Allow {
        updated_input: None,
    });
    let mut registry = ToolRegistry::new();
    registry.register(Box::new(ReadOnlyMcp));
    let ctx = ToolContext {
        permission_callback: Some(cb),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry, ctx);
    let results = executor
        .execute_all(vec![use_block("t1", "mcp__omnia__listar", json!({}))])
        .await;
    assert_eq!(results[0].result.text_content(), "lista");
    assert_eq!(seen.lock().unwrap().len(), 1);
}

#[tokio::test]
async fn disallowed_rule_denial_uses_the_cli_message() {
    let mut registry = ToolRegistry::new();
    registry.register(ToolRegistry::builtin("Read").unwrap());
    let executor = ToolExecutor::new(registry, ToolContext::default())
        .with_permission_rules(PermissionRules::from_lists(&[], &["Read".to_string()]));
    let results = executor
        .execute_all(vec![use_block(
            "t1",
            "Read",
            json!({"file_path": "/etc/hostname"}),
        )])
        .await;
    assert!(results[0].denied);
    assert_eq!(
        results[0].result.text_content(),
        "Permission to use Read has been denied."
    );
}
