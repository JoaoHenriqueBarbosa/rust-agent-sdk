//! Paridade de Bash, Edit, Write, Glob, Grep e NotebookEdit do transporte
//! nativo com o CLI 2.1.90.
//!
//! As descrições e os schemas são conferidos pelo SHA-256 do que o CLI 2.1.90
//! real mandou à API (capturado com um servidor local no
//! `ANTHROPIC_BASE_URL`, modelo default `claude-sonnet-4-6`); os resultados,
//! pelos textos e `tool_use_result` que o mesmo CLI devolveu. Tudo passa pelo
//! `ToolExecutor`, na ordem do JS: schema, `validateInput`, permissão,
//! execução. Nenhum teste toca rede.

use std::path::Path;
use std::sync::{Arc, Mutex};

use serde_json::{json, Value};
use sha2::{Digest, Sha256};

use prana::tools::file_state::FileState;
use prana::tools::framework::{
    PermissionCallbackFn, PermissionOutcome, ToolContext, ToolExecutor, ToolPermissionRequest,
    ToolRegistry,
};
use prana::tools::permission::PermissionRules;
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

#[test]
fn definitions_match_the_cli_capture() {
    // (nome, sha256 da descrição, sha256 do schema compacto na ordem do CLI)
    let expected = [
        (
            "Bash",
            "af0a6aa16a7457b802146a19367056734e351cd2422c5fbed6c166ac1b0d705d",
            "a3bcdb53d0bbd3a93dadb854b34b363303bcbe59a0b404328146f80b3d4f83e0",
        ),
        (
            "Edit",
            "50a851ce06c2e219aa83c30ead8f0a70693dcc9bfec417d0355aa7fe948a3833",
            "817017bfbd1919c88d58f4284924e233c594e76409e8d2ac2489f0701282e69d",
        ),
        (
            "Write",
            "70103362310e68e4354843200e7d54db8cd08aefd058617ac9ddd98fc5b8eae0",
            "afb946a50519ce686704d62a989f9a803d246d411f4c3aeec64c5ab09f6d4005",
        ),
        (
            "Glob",
            "6194aea168bb308f0fd6801bc938a35d3160a8f5339d5d5170ab688990239f80",
            "8e0245e67bbe76c6b42457f13660bf8f8c91f25436d851318f832326d16c2c4f",
        ),
        (
            "Grep",
            "b51741096735333cfc72878140e2313c0acc9f73226149fc1855ac348df91df4",
            "6b1355441a911e25f494c0dd9f3b74759d7578788ef1ee4bb2c2fd85f0471fa8",
        ),
        (
            "NotebookEdit",
            "348e820c2a610e6c339d1aa067884f0aea292e9aa21ac19bb9ca181a9a18e067",
            "2da1abf7e4a5e3420370cad93b2fc956e274b743c4206d7b85c2f8219f0429eb",
        ),
    ];
    let registry = registry_with(&["Bash", "Edit", "Write", "Glob", "Grep", "NotebookEdit"]);
    for def in registry.api_definitions() {
        let (_, desc_hash, schema_hash) = expected
            .iter()
            .find(|(n, _, _)| *n == def.name)
            .expect("tool conhecida");
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

fn mark_read(ctx: &ToolContext, path: &Path) {
    let content = std::fs::read_to_string(path).unwrap();
    let mtime = std::fs::metadata(path)
        .unwrap()
        .modified()
        .unwrap()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as i64;
    ctx.file_state.set(
        path,
        FileState {
            content,
            timestamp: mtime,
            offset: None,
            limit: None,
            is_partial_view: false,
        },
    );
}

fn bypass_ctx(dir: &Path) -> ToolContext {
    ToolContext {
        working_directory: dir.to_path_buf(),
        permission_mode: PermissionMode::BypassPermissions,
        ..Default::default()
    }
}

#[tokio::test]
async fn edit_follows_the_cli_capture() {
    let dir = tempfile::tempdir().unwrap();
    let a = dir.path().join("a.txt");
    std::fs::write(&a, "alpha\nbeta\ngamma\n").unwrap();
    let executor = ToolExecutor::new(registry_with(&["Edit"]), bypass_ctx(dir.path()));

    // Sem leitura, o validateInput recusa antes de tudo.
    let not_read = executor
        .execute_all(vec![tool_use(
            "t0",
            "Edit",
            json!({"file_path": a.to_str().unwrap(), "old_string": "beta", "new_string": "BETA"}),
        )])
        .await;
    assert_eq!(
        not_read[0].result.text_content(),
        "<tool_use_error>File has not been read yet. Read it first before writing to it.</tool_use_error>"
    );
    assert_eq!(
        not_read[0].result.tool_use_result,
        Some(json!(
            "Error: File has not been read yet. Read it first before writing to it."
        ))
    );

    mark_read(&executor.context, &a);
    // O espaço de fim de linha do new_string cai, como no normalizeToolInput.
    let edited = executor
        .execute_all(vec![tool_use(
            "t1",
            "Edit",
            json!({"file_path": a.to_str().unwrap(), "old_string": "beta", "new_string": "BETA  "}),
        )])
        .await;
    assert_eq!(
        edited[0].result.text_content(),
        format!("The file {} has been updated successfully.", a.display())
    );
    assert_eq!(
        edited[0].result.tool_use_result,
        Some(json!({
            "filePath": a.to_str().unwrap(),
            "oldString": "beta",
            "newString": "BETA",
            "originalFile": "alpha\nbeta\ngamma\n",
            "structuredPatch": [{"oldStart": 1, "oldLines": 3, "newStart": 1, "newLines": 3,
                                  "lines": [" alpha", "-beta", "+BETA", " gamma"]}],
            "userModified": false,
            "replaceAll": false,
        }))
    );
    let keys: Vec<String> = edited[0]
        .result
        .tool_use_result
        .as_ref()
        .unwrap()
        .as_object()
        .unwrap()
        .keys()
        .cloned()
        .collect();
    assert_eq!(
        keys,
        vec![
            "filePath",
            "oldString",
            "newString",
            "originalFile",
            "structuredPatch",
            "userModified",
            "replaceAll"
        ]
    );
    assert_eq!(std::fs::read_to_string(&a).unwrap(), "alpha\nBETA\ngamma\n");

    // A edição atualiza o readFileState: uma segunda edição não pede Read.
    let again = executor
        .execute_all(vec![tool_use(
            "t2",
            "Edit",
            json!({"file_path": a.to_str().unwrap(), "old_string": "same", "new_string": "same"}),
        )])
        .await;
    assert_eq!(
        again[0].result.text_content(),
        "<tool_use_error>No changes to make: old_string and new_string are exactly the same.</tool_use_error>"
    );
}

#[tokio::test]
async fn edit_accepts_curly_quotes_like_find_actual_string() {
    let dir = tempfile::tempdir().unwrap();
    let f = dir.path().join("q.txt");
    std::fs::write(&f, "\ttabbed \"quoted\"\n").unwrap();
    let executor = ToolExecutor::new(registry_with(&["Edit"]), bypass_ctx(dir.path()));
    mark_read(&executor.context, &f);
    // Capturado do CLI: o modelo mandou aspas curvas, o arquivo tem retas.
    let old = format!("\ttabbed {}quoted{}", '\u{201C}', '\u{201D}');
    let result = executor
        .execute_all(vec![tool_use(
            "t1",
            "Edit",
            json!({"file_path": f.to_str().unwrap(), "old_string": old, "new_string": "\ttabbed \"new\" it's"}),
        )])
        .await;
    let data = result[0].result.tool_use_result.clone().unwrap();
    assert_eq!(data["oldString"], "\ttabbed \"quoted\"");
    assert_eq!(
        data["structuredPatch"][0]["lines"],
        json!(["-  tabbed \"quoted\"", "+  tabbed \"new\" it's"])
    );
}

#[tokio::test]
async fn write_follows_the_cli_capture() {
    let dir = tempfile::tempdir().unwrap();
    let executor = ToolExecutor::new(registry_with(&["Write"]), bypass_ctx(dir.path()));
    let w = dir.path().join("w.txt");
    let created = executor
        .execute_all(vec![tool_use(
            "t1",
            "Write",
            json!({"file_path": w.to_str().unwrap(), "content": "one  \ntwo\n"}),
        )])
        .await;
    assert_eq!(
        created[0].result.text_content(),
        format!("File created successfully at: {}", w.display())
    );
    assert_eq!(
        created[0].result.tool_use_result,
        Some(json!({
            "type": "create",
            "filePath": w.to_str().unwrap(),
            "content": "one\ntwo\n",
            "structuredPatch": [],
            "originalFile": null,
        }))
    );
    // Criar registra a leitura: a atualização seguinte passa.
    let updated = executor
        .execute_all(vec![tool_use(
            "t2",
            "Write",
            json!({"file_path": w.to_str().unwrap(), "content": "one\nnew\n"}),
        )])
        .await;
    assert_eq!(
        updated[0].result.text_content(),
        format!("The file {} has been updated successfully.", w.display())
    );
    let data = updated[0].result.tool_use_result.clone().unwrap();
    assert_eq!(data["type"], "update");
    assert_eq!(
        data["structuredPatch"],
        json!([{"oldStart": 1, "oldLines": 2, "newStart": 1, "newLines": 2,
                "lines": [" one", "-two", "+new"]}])
    );
}

#[tokio::test]
async fn glob_and_grep_follow_the_cli_texts() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(dir.path().join("a.txt"), "alpha\nbeta\n").unwrap();
    std::fs::create_dir(dir.path().join("sub")).unwrap();
    std::fs::write(dir.path().join("sub").join("b.txt"), "x\n").unwrap();
    let executor = ToolExecutor::new(registry_with(&["Glob", "Grep"]), bypass_ctx(dir.path()));
    let results = executor
        .execute_all(vec![
            tool_use("g1", "Glob", json!({"pattern": "*.zzz"})),
            tool_use("g2", "Glob", json!({"pattern": "*", "path": "nodir"})),
            tool_use("r1", "Grep", json!({"pattern": "zzzz"})),
            tool_use(
                "r2",
                "Grep",
                json!({"pattern": "alpha", "output_mode": "content", "-n": "false"}),
            ),
            tool_use(
                "r3",
                "Grep",
                json!({"pattern": "a", "output_mode": "content", "head_limit": 1, "offset": 1}),
            ),
            tool_use("g3", "Glob", json!({"pattern": "**/*.txt"})),
        ])
        .await;
    assert_eq!(results[0].result.text_content(), "No files found");
    let g1 = results[0].result.tool_use_result.clone().unwrap();
    assert_eq!(
        g1.as_object().unwrap().keys().cloned().collect::<Vec<_>>(),
        vec!["filenames", "durationMs", "numFiles", "truncated"]
    );
    assert_eq!(
        results[1].result.text_content(),
        format!(
            "<tool_use_error>Directory does not exist: nodir. Note: your current working directory is {}.</tool_use_error>",
            dir.path().display()
        )
    );
    assert_eq!(results[2].result.text_content(), "No files found");
    assert_eq!(
        results[2].result.tool_use_result,
        Some(json!({"mode": "files_with_matches", "filenames": [], "numFiles": 0}))
    );
    assert_eq!(results[3].result.text_content(), "a.txt:alpha");
    // Duas linhas casam; com offset 1 sobra uma, que cabe no limite: o
    // `appliedLimit` do JS fica ausente e só o offset aparece.
    assert_eq!(
        results[4].result.text_content(),
        "a.txt:2:beta\n\n[Showing results with pagination = offset: 1]"
    );
    let mut files: Vec<String> = results[5]
        .result
        .text_content()
        .lines()
        .map(str::to_string)
        .collect();
    files.sort();
    assert_eq!(files, vec!["a.txt", "sub/b.txt"]);
}

#[tokio::test]
async fn grep_type_errors_use_the_zod_format() {
    let dir = tempfile::tempdir().unwrap();
    let executor = ToolExecutor::new(registry_with(&["Grep"]), bypass_ctx(dir.path()));
    let results = executor
        .execute_all(vec![tool_use(
            "r1",
            "Grep",
            json!({"pattern": "a", "-A": "x"}),
        )])
        .await;
    assert_eq!(
        results[0].result.text_content(),
        "<tool_use_error>InputValidationError: Grep failed due to the following issue:\nThe parameter `-A` type is expected as `number` but provided as `string`</tool_use_error>"
    );
}

#[tokio::test]
async fn bash_results_follow_the_cli_capture() {
    let dir = tempfile::tempdir().unwrap();
    let executor = ToolExecutor::new(registry_with(&["Bash"]), bypass_ctx(dir.path()));
    let results = executor
        .execute_all(vec![
            tool_use(
                "b1",
                "Bash",
                json!({"command": "printf '\\n\\n  abc  \\n\\n'"}),
            ),
            tool_use("b2", "Bash", json!({"command": "true"})),
            tool_use("b3", "Bash", json!({"command": "exit 1"})),
            tool_use("b4", "Bash", json!({"command": "mkdir -p novo"})),
            tool_use(
                "b5",
                "Bash",
                json!({"command": "echo $CLAUDECODE $GIT_EDITOR"}),
            ),
        ])
        .await;
    assert_eq!(results[0].result.text_content(), "  abc");
    assert_eq!(
        results[1].result.text_content(),
        "(Bash completed with no output)"
    );
    assert_eq!(results[2].result.text_content(), "Exit code 1");
    assert_eq!(
        results[2].result.tool_use_result,
        Some(json!("Error: Exit code 1"))
    );
    assert_eq!(
        results[3].result.tool_use_result,
        Some(
            json!({"stdout": "", "stderr": "", "interrupted": false, "isImage": false, "noOutputExpected": true})
        )
    );
    assert_eq!(results[4].result.text_content(), "1 true");
}

fn recording_callback() -> (PermissionCallbackFn, Arc<Mutex<Vec<ToolPermissionRequest>>>) {
    let seen = Arc::new(Mutex::new(Vec::new()));
    let seen_cb = Arc::clone(&seen);
    let callback: PermissionCallbackFn = Arc::new(move |req| {
        seen_cb.lock().unwrap().push(req);
        Box::pin(async {
            PermissionOutcome::Deny {
                message: "negado pelo teste".to_string(),
            }
        })
    });
    (callback, seen)
}

#[tokio::test]
async fn permissions_follow_the_js_checks() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(dir.path().join("a.txt"), "alpha\n").unwrap();
    let (callback, seen) = recording_callback();
    let ctx = ToolContext {
        working_directory: dir.path().to_path_buf(),
        permission_callback: Some(callback),
        ..Default::default()
    };
    let executor = ToolExecutor::new(registry_with(&["Bash", "Glob", "Grep", "Write"]), ctx)
        .with_permission_rules(PermissionRules::from_lists(
            &["Bash(git status:*)".to_string()],
            &[],
        ));
    let w = dir.path().join("novo.txt");
    let results = executor
        .execute_all(vec![
            // Leitura dentro do cwd: sem pergunta.
            tool_use("p1", "Glob", json!({"pattern": "*.txt"})),
            tool_use("p2", "Grep", json!({"pattern": "alpha"})),
            tool_use(
                "p3",
                "Bash",
                json!({"command": "ls -la && cat a.txt | wc -l"}),
            ),
            // Prefixo liberado por regra.
            tool_use("p4", "Bash", json!({"command": "git status --short"})),
            // Escrita em default: pergunta ao callback.
            tool_use(
                "p5",
                "Write",
                json!({"file_path": w.to_str().unwrap(), "content": "x"}),
            ),
            // Comando que exige aprovação.
            tool_use("p6", "Bash", json!({"command": "npm install"})),
            // Leitura fora do cwd: pergunta.
            tool_use("p7", "Glob", json!({"pattern": "*", "path": "/etc"})),
        ])
        .await;
    assert!(!results[0].denied && !results[1].denied && !results[2].denied);
    assert!(!results[3].denied, "{}", results[3].result.text_content());
    assert!(results[4].denied && results[5].denied && results[6].denied);
    let requests = seen.lock().unwrap();
    let names: Vec<&str> = requests.iter().map(|r| r.tool_name.as_str()).collect();
    assert_eq!(names, vec!["Write", "Bash", "Glob"]);
    // Escrita em default sugere acceptEdits, como o generateSuggestions.
    assert_eq!(
        requests[0].permission_suggestions,
        Some(json!([{"type": "setMode", "mode": "acceptEdits", "destination": "session"}]))
    );
    assert_eq!(
        requests[1].decision_reason.as_deref(),
        Some("This command requires approval")
    );
    assert_eq!(
        requests[1].permission_suggestions.as_ref().unwrap()[0]["rules"][0]["ruleContent"],
        "npm install:*"
    );
    assert_eq!(
        requests[2].decision_reason.as_deref(),
        Some("Path is outside allowed working directories")
    );
}

#[tokio::test]
async fn notebook_edit_goes_through_the_executor() {
    let dir = tempfile::tempdir().unwrap();
    let nb = dir.path().join("nb.ipynb");
    std::fs::write(
        &nb,
        "{\n \"cells\": [\n  {\n   \"cell_type\": \"markdown\",\n   \"id\": \"m1\",\n   \"metadata\": {},\n   \"source\": [\n    \"# T\"\n   ]\n  }\n ],\n \"metadata\": {},\n \"nbformat\": 4,\n \"nbformat_minor\": 5\n}\n",
    )
    .unwrap();
    let executor = ToolExecutor::new(registry_with(&["NotebookEdit"]), bypass_ctx(dir.path()));
    mark_read(&executor.context, &nb);
    let results = executor
        .execute_all(vec![tool_use(
            "n1",
            "NotebookEdit",
            json!({"notebook_path": nb.to_str().unwrap(), "cell_id": "m1", "edit_mode": "delete", "new_source": ""}),
        )])
        .await;
    assert_eq!(results[0].result.text_content(), "Deleted cell m1");
    let written: Value = serde_json::from_str(&std::fs::read_to_string(&nb).unwrap()).unwrap();
    assert_eq!(written["cells"], json!([]));
}
