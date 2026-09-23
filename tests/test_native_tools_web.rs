//! Paridade do WebFetch e do WebSearch nativos com o CLI 2.1.90.
//!
//! As expectativas vêm de capturas do CLI real (`claude -p` contra um
//! servidor local): o markdown que o turndown produz, o texto e o
//! `tool_use_result` de cada caso, os erros, e a forma das chamadas
//! aninhadas ao modelo. Nada aqui toca rede externa: o site é um servidor
//! HTTP local e o modelo é um `ModelCallFn` que registra o request.

use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};

use serde_json::{json, Value};

use rust_agent_sdk::api::streaming::ToolUseBlock;
use rust_agent_sdk::api::types::{ApiResponse, ContentBlock, Role, Usage};
use rust_agent_sdk::tools::framework::{
    ModelCallFn, PermissionCallbackFn, PermissionOutcome, Tool, ToolContext, ToolExecutor,
    ToolPermissionRequest, ToolRegistry,
};
use rust_agent_sdk::tools::html_to_markdown::turndown;
use rust_agent_sdk::tools::permission::{PermissionResult, PermissionRules};
use rust_agent_sdk::tools::web_fetch::{
    make_secondary_model_prompt, ConfiguredWebFetchTool, WebFetchConfig, WebFetchTool,
};
use rust_agent_sdk::tools::web_search::WebSearchTool;
use rust_agent_sdk::PermissionMode;

// ---------------------------------------------------------------------------
// Fixtures capturadas do CLI
// ---------------------------------------------------------------------------

const PAGE_HTML: &str = r#"<!DOCTYPE html><html><head><title>Página de teste</title></head><body>
<nav><a href="/x">Menu</a></nav>
<article><h1>Título principal</h1>
<p>Primeiro parágrafo com <strong>negrito</strong>, <em>itálico</em> e um <a href="https://example.com/doc">link</a>.</p>
<h2>Seção</h2>
<ul><li>item um</li><li>item dois</li></ul>
<ol><li>primeiro</li><li>segundo</li></ol>
<pre><code>fn main() { println!("oi"); }</code></pre>
<p>Texto com <code>inline</code> e caracteres * _ [ ] # especiais.</p>
<blockquote>Uma citação.</blockquote>
<hr>
<p>Fim do artigo com bastante texto para o Readability considerar conteúdo relevante. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
</article><footer>Rodapé</footer></body></html>"#;

const PAGE_MD: &str = r#"Página de teste

[Menu](/x)

Título principal
================

Primeiro parágrafo com **negrito**, _itálico_ e um [link](https://example.com/doc).

Seção
-----

*   item um
*   item dois

1.  primeiro
2.  segundo

    fn main() { println!("oi"); }

Texto com `inline` e caracteres \* \_ \[ \] # especiais.

> Uma citação.

* * *

Fim do artigo com bastante texto para o Readability considerar conteúdo relevante. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Rodapé"#;

const TRICKY_HTML: &str = r#"<html><head><title>T</title><style>p{}</style><script>alert(1)</script></head><body>
<h3>Sub   título</h3>
<p>Linha um<br>linha dois &amp; &lt;tag&gt; &nbsp; fim</p>
<p><img src="/a.png" alt="imagem"> <a href="/rel" title="Título">relativo</a></p>
<ul><li>a<ul><li>a1</li><li>a2</li></ul></li><li>b</li></ul>
<table><tr><th>C1</th><th>C2</th></tr><tr><td>v1</td><td>v2</td></tr></table>
<pre><code class="language-js">const a = 1;
const b = 2;</code></pre>
<p>Use <code>a `b` c</code> e 1. número e + mais - menos</p>
<h4>Quatro</h4><h5>Cinco</h5><h6>Seis</h6>
<div>div solto</div><span>span</span>
<p>   espaços    múltiplos   </p>
<noscript>sem script</noscript>
</body></html>"#;

fn tricky_md() -> String {
    // O `&nbsp;` sobrevive ao colapso de espaços do turndown.
    format!(
        "Tp{{}}alert(1)\n\n### Sub título\n\nLinha um  \nlinha dois & <tag> {} fim\n\n![imagem](/a.png) [relativo](/rel \"Título\")\n\n*   a\n    *   a1\n    *   a2\n*   b\n\nC1\n\nC2\n\nv1\n\nv2\n\n    const a = 1;\n    const b = 2;\n\nUse ``a `b` c`` e 1. número e + mais - menos\n\n#### Quatro\n\n##### Cinco\n\n###### Seis\n\ndiv solto\n\nspan\n\nespaços múltiplos\n\nsem script",
        '\u{a0}'
    )
}

const PARA: &str = "Este é um parágrafo longo sobre programação assíncrona em Rust, com futures, executores e tarefas que cooperam entre si, escrito para ter bastante texto. ";

fn long_html() -> String {
    format!(
        "<!DOCTYPE html><html><head><title>Artigo longo</title><style>body{{color:red}}</style><script>var x = 1;</script></head><body>\n<header><nav><ul><li><a href=\"/\">Início</a></li><li><a href=\"/blog\">Blog</a></li></ul></nav></header>\n<main><article><h1>Async em Rust</h1>\n<p>{}</p><p>{}</p><h2>Detalhes</h2><p>{}</p>\n</article></main><aside>Barra lateral com propaganda</aside><footer>Copyright 2026</footer></body></html>",
        PARA.repeat(4),
        PARA.repeat(4),
        PARA.repeat(3)
    )
}

fn long_md() -> String {
    format!(
        "Artigo longobody{{color:red}}var x = 1;\n\n*   [Início](/)\n*   [Blog](/blog)\n\nAsync em Rust\n=============\n\n{}\n\n{}\n\nDetalhes\n--------\n\n{}\n\nBarra lateral com propaganda\n\nCopyright 2026",
        PARA.repeat(4).trim_end(),
        PARA.repeat(4).trim_end(),
        PARA.repeat(3).trim_end()
    )
}

#[test]
fn turndown_matches_the_cli_markdown() {
    assert_eq!(turndown(PAGE_HTML), PAGE_MD);
    assert_eq!(turndown(TRICKY_HTML), tricky_md());
    assert_eq!(turndown(&long_html()), long_md());
}

// ---------------------------------------------------------------------------
// Infra: site local, modelo falso, executor
// ---------------------------------------------------------------------------

struct Site {
    base: String,
    port: u16,
    hits: Arc<AtomicUsize>,
    user_agents: Arc<Mutex<Vec<(String, String)>>>,
}

async fn start_site() -> Site {
    use axum::http::{header, HeaderMap, StatusCode};
    use axum::response::IntoResponse;
    use axum::routing::get;

    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let port = listener.local_addr().unwrap().port();
    let hits = Arc::new(AtomicUsize::new(0));
    let user_agents: Arc<Mutex<Vec<(String, String)>>> = Arc::new(Mutex::new(Vec::new()));
    let record = {
        let hits = Arc::clone(&hits);
        let agents = Arc::clone(&user_agents);
        move |headers: &HeaderMap| {
            hits.fetch_add(1, Ordering::SeqCst);
            let get = |k: &str| {
                headers
                    .get(k)
                    .and_then(|v| v.to_str().ok())
                    .unwrap_or("")
                    .to_string()
            };
            agents
                .lock()
                .unwrap()
                .push((get("user-agent"), get("accept")));
        }
    };
    let r1 = record.clone();
    let r2 = record.clone();
    let r3 = record.clone();
    let r4 = record.clone();
    let r5 = record.clone();
    let r6 = record;
    let app = axum::Router::new()
        .route(
            "/page",
            get(move |h: HeaderMap| async move {
                r1(&h);
                (
                    [(header::CONTENT_TYPE, "text/html; charset=utf-8")],
                    PAGE_HTML,
                )
                    .into_response()
            }),
        )
        .route(
            "/md",
            get(move |h: HeaderMap| async move {
                r2(&h);
                (
                    [(header::CONTENT_TYPE, "text/markdown")],
                    "# Markdown\n\nConteúdo.",
                )
                    .into_response()
            }),
        )
        .route(
            "/redir",
            get(move |h: HeaderMap| async move {
                r3(&h);
                (
                    StatusCode::FOUND,
                    [(header::LOCATION, format!("http://localhost:{port}/page"))],
                )
                    .into_response()
            }),
        )
        .route(
            "/same",
            get(move |h: HeaderMap| async move {
                r4(&h);
                (StatusCode::MOVED_PERMANENTLY, [(header::LOCATION, "/page")]).into_response()
            }),
        )
        .route(
            "/404",
            get(move |h: HeaderMap| async move {
                r5(&h);
                (StatusCode::NOT_FOUND, "não achei").into_response()
            }),
        )
        .route(
            "/bin",
            get(move |h: HeaderMap| async move {
                r6(&h);
                (
                    [(header::CONTENT_TYPE, "application/pdf")],
                    vec![37u8, 80, 68, 70],
                )
                    .into_response()
            }),
        );
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });
    Site {
        base: format!("http://127.0.0.1:{port}"),
        port,
        hits,
        user_agents,
    }
}

type Recorded = Arc<Mutex<Vec<Value>>>;

fn fake_model(content: Vec<ContentBlock>) -> (ModelCallFn, Recorded) {
    let recorded: Recorded = Arc::new(Mutex::new(Vec::new()));
    let seen = Arc::clone(&recorded);
    let call: ModelCallFn = Arc::new(move |request| {
        seen.lock()
            .unwrap()
            .push(serde_json::to_value(&request).unwrap());
        let content = content.clone();
        let model = request.model.clone();
        Box::pin(async move {
            Ok(ApiResponse {
                id: "msg_fake".to_string(),
                r#type: "message".to_string(),
                role: Role::Assistant,
                content,
                model,
                stop_reason: Some("end_turn".to_string()),
                stop_sequence: None,
                usage: Usage::default(),
            })
        })
    });
    (call, recorded)
}

fn executor(tool: Box<dyn Tool>, ctx: ToolContext, rules: PermissionRules) -> ToolExecutor {
    let mut registry = ToolRegistry::new();
    registry.register(tool);
    ToolExecutor::new(registry, ctx).with_permission_rules(rules)
}

fn local_fetch() -> Box<dyn Tool> {
    Box::new(ConfiguredWebFetchTool {
        config: WebFetchConfig {
            upgrade_http_to_https: false,
        },
    })
}

async fn run(exec: &ToolExecutor, name: &str, input: Value) -> (String, bool, Value) {
    let results = exec
        .execute_all(vec![ToolUseBlock {
            id: "toolu_t".to_string(),
            name: name.to_string(),
            input,
        }])
        .await;
    let r = &results[0].result;
    (
        r.text_content(),
        r.is_error,
        r.tool_use_result.clone().unwrap_or(Value::Null),
    )
}

fn bypass_ctx(model_call: Option<ModelCallFn>) -> ToolContext {
    ToolContext {
        permission_mode: PermissionMode::BypassPermissions,
        model_call,
        main_model: Some("claude-sonnet-4-6".to_string()),
        small_fast_model: Some("claude-haiku-4-5-20251001".to_string()),
        ..Default::default()
    }
}

// ---------------------------------------------------------------------------
// WebFetch
// ---------------------------------------------------------------------------

#[test]
fn web_fetch_definition_is_the_cli_one() {
    let tool = WebFetchTool;
    assert_eq!(tool.name(), "WebFetch");
    assert!(tool
        .description()
        .starts_with("IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs."));
    assert!(tool.description().ends_with(
        "  - For GitHub URLs, prefer using the gh CLI via Bash instead (e.g., gh pr view, gh issue view, gh api).\n"
    ));
    assert_eq!(
        serde_json::to_string(&tool.input_schema()).unwrap(),
        r#"{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{"url":{"description":"The URL to fetch content from","type":"string","format":"uri"},"prompt":{"description":"The prompt to run on the fetched content","type":"string"}},"required":["url","prompt"],"additionalProperties":false}"#
    );
}

#[tokio::test]
async fn web_fetch_converts_html_and_summarizes_with_the_small_model() {
    let site = start_site().await;
    let (model_call, recorded) = fake_model(vec![ContentBlock::text("resumo do modelo")]);
    let exec = executor(
        local_fetch(),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let url = format!("{}/page", site.base);
    let (text, is_error, data) =
        run(&exec, "WebFetch", json!({"url": url, "prompt": "resuma"})).await;
    assert!(!is_error, "{text}");
    assert_eq!(text, "resumo do modelo");
    // A ordem das chaves é a do `data` do JS.
    let keys: Vec<&str> = data
        .as_object()
        .unwrap()
        .keys()
        .map(String::as_str)
        .collect();
    assert_eq!(
        keys,
        vec!["bytes", "code", "codeText", "result", "durationMs", "url"]
    );
    assert_eq!(data["bytes"], json!(PAGE_HTML.len()));
    assert_eq!(data["code"], json!(200));
    assert_eq!(data["codeText"], json!("OK"));
    assert_eq!(data["url"], json!(url));

    let requests = recorded.lock().unwrap().clone();
    assert_eq!(requests.len(), 1);
    let request = &requests[0];
    assert_eq!(request["model"], "claude-haiku-4-5-20251001");
    assert_eq!(request["max_tokens"], 32000);
    assert_eq!(request["temperature"], 1.0);
    assert_eq!(
        request["system"],
        json!([{"type": "text", "text": "You are a Claude agent, built on Anthropic's Claude Agent SDK."}])
    );
    assert_eq!(
        request["messages"][0]["content"][0]["text"],
        json!(make_secondary_model_prompt(PAGE_MD, "resuma", false))
    );
    // Os headers do JS.
    let (ua, accept) = site.user_agents.lock().unwrap()[0].clone();
    assert_eq!(
        ua,
        "Claude-User (claude-code/2.1.90; +https://support.anthropic.com/)"
    );
    assert_eq!(accept, "text/markdown, text/html, */*");

    // Cache de 15 minutos: a segunda busca da mesma URL não vai ao site.
    let before = site.hits.load(Ordering::SeqCst);
    let (_, is_error, _) = run(&exec, "WebFetch", json!({"url": url, "prompt": "de novo"})).await;
    assert!(!is_error);
    assert_eq!(site.hits.load(Ordering::SeqCst), before);
}

#[test]
fn secondary_prompt_is_the_cli_literal() {
    assert_eq!(
        make_secondary_model_prompt("# Markdown\n\nConteúdo.", "resuma", false),
        "\nWeb page content:\n---\n# Markdown\n\nConteúdo.\n---\n\nresuma\n\nProvide a concise response based only on the content above. In your response:\n - Enforce a strict 125-character maximum for quotes from any source document. Open Source Software is ok as long as we respect the license.\n - Use quotation marks for exact language from articles; any language outside of the quotation should never be word-for-word the same.\n - You are not a lawyer and never comment on the legality of your own prompts and responses.\n - Never produce or reproduce exact song lyrics.\n"
    );
    assert!(make_secondary_model_prompt("x", "p", true).ends_with(
        "\n\nProvide a concise response based on the content above. Include relevant details, code examples, and documentation excerpts as needed.\n"
    ));
}

#[tokio::test]
async fn web_fetch_reports_a_cross_host_redirect_like_the_cli() {
    let site = start_site().await;
    let (model_call, recorded) = fake_model(vec![ContentBlock::text("x")]);
    let exec = executor(
        local_fetch(),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let url = format!("{}/redir", site.base);
    let (text, is_error, data) = run(
        &exec,
        "WebFetch",
        json!({"url": url, "prompt": "resuma \"isso\""}),
    )
    .await;
    assert!(!is_error);
    let expected = format!(
        "REDIRECT DETECTED: The URL redirects to a different host.\n\nOriginal URL: {url}\nRedirect URL: http://localhost:{port}/page\nStatus: 302 Found\n\nTo complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:\n- url: \"http://localhost:{port}/page\"\n- prompt: \"resuma \"isso\"\"",
        port = site.port
    );
    assert_eq!(text, expected);
    assert_eq!(data["code"], json!(302));
    assert_eq!(data["codeText"], json!("Found"));
    assert_eq!(data["bytes"], json!(expected.len()));
    // O redirect para outro host não chama o modelo.
    assert!(recorded.lock().unwrap().is_empty());
}

#[tokio::test]
async fn web_fetch_follows_same_host_redirects() {
    let site = start_site().await;
    let (model_call, _) = fake_model(vec![ContentBlock::text("ok")]);
    let exec = executor(
        local_fetch(),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let url = format!("{}/same", site.base);
    let (text, is_error, data) =
        run(&exec, "WebFetch", json!({"url": url, "prompt": "resuma"})).await;
    assert!(!is_error, "{text}");
    assert_eq!(data["code"], json!(200));
    assert_eq!(data["url"], json!(url));
}

#[tokio::test]
async fn web_fetch_errors_follow_the_cli() {
    let site = start_site().await;
    let (model_call, _) = fake_model(vec![ContentBlock::text("ok")]);
    let exec = executor(
        local_fetch(),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );

    let (text, is_error, data) = run(
        &exec,
        "WebFetch",
        json!({"url": format!("{}/404", site.base), "prompt": "resuma"}),
    )
    .await;
    assert!(is_error);
    assert_eq!(text, "Request failed with status code 404");
    assert_eq!(data, json!("Error: Request failed with status code 404"));

    // Sem ponto no host: o `validateURL` recusa depois do schema.
    let (text, is_error, data) = run(
        &exec,
        "WebFetch",
        json!({"url": "https://localhost/x", "prompt": "resuma"}),
    )
    .await;
    assert!(is_error);
    assert_eq!(text, "Invalid URL");
    assert_eq!(data, json!("Error: Invalid URL"));

    // URL que não parseia: o `invalid_format` do zod.
    let (text, _, data) = run(
        &exec,
        "WebFetch",
        json!({"url": "not a url", "prompt": "resuma"}),
    )
    .await;
    assert_eq!(
        text,
        "<tool_use_error>InputValidationError: [\n  {\n    \"code\": \"invalid_format\",\n    \"format\": \"url\",\n    \"path\": [\n      \"url\"\n    ],\n    \"message\": \"Invalid URL\"\n  }\n]</tool_use_error>"
    );
    assert_eq!(
        data,
        json!("InputValidationError: [\n  {\n    \"code\": \"invalid_format\",\n    \"format\": \"url\",\n    \"path\": [\n      \"url\"\n    ],\n    \"message\": \"Invalid URL\"\n  }\n]")
    );

    // Sem prompt.
    let (text, _, _) = run(
        &exec,
        "WebFetch",
        json!({"url": format!("{}/md", site.base)}),
    )
    .await;
    assert_eq!(
        text,
        "<tool_use_error>InputValidationError: WebFetch failed due to the following issue:\nThe required parameter `prompt` is missing</tool_use_error>"
    );
}

#[tokio::test]
async fn web_fetch_normalizes_the_url_like_zod() {
    let site = start_site().await;
    let (model_call, _) = fake_model(vec![ContentBlock::text("ok")]);
    let exec = executor(
        local_fetch(),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let upper = format!("HTTP://127.0.0.1:{}/md", site.port);
    let (_, is_error, data) =
        run(&exec, "WebFetch", json!({"url": upper, "prompt": "resuma"})).await;
    assert!(!is_error);
    assert_eq!(
        data["url"],
        json!(format!("http://127.0.0.1:{}/md", site.port))
    );
    assert_eq!(data["bytes"], json!("# Markdown\n\nConteúdo.".len()));
}

#[tokio::test]
async fn web_fetch_upgrades_http_to_https_by_default() {
    // O servidor local só fala HTTP: com o upgrade do JS, a busca vai por
    // TLS, falha, e nenhuma requisição HTTP em texto claro chega ao site.
    let site = start_site().await;
    let (model_call, _) = fake_model(vec![ContentBlock::text("ok")]);
    let exec = executor(
        Box::new(WebFetchTool),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let (_, is_error, _) = run(
        &exec,
        "WebFetch",
        json!({"url": format!("{}/page?upgrade", site.base), "prompt": "resuma"}),
    )
    .await;
    assert!(is_error);
    assert_eq!(site.hits.load(Ordering::SeqCst), 0);
}

#[tokio::test]
async fn web_fetch_saves_binary_content_and_says_where() {
    let site = start_site().await;
    let dir = tempfile::tempdir().unwrap();
    let (model_call, _) = fake_model(vec![ContentBlock::text("pdf lido")]);
    let ctx = ToolContext {
        tool_results_dir: Some(dir.path().to_path_buf()),
        ..bypass_ctx(Some(model_call))
    };
    let exec = executor(local_fetch(), ctx, PermissionRules::default());
    let (text, is_error, _) = run(
        &exec,
        "WebFetch",
        json!({"url": format!("{}/bin", site.base), "prompt": "leia"}),
    )
    .await;
    assert!(!is_error, "{text}");
    assert!(
        text.starts_with("pdf lido\n\n[Binary content (application/pdf, 4 bytes) also saved to "),
        "{text}"
    );
    let saved: Vec<_> = std::fs::read_dir(dir.path()).unwrap().collect();
    assert_eq!(saved.len(), 1);
}

#[tokio::test]
async fn web_fetch_without_model_call_fails_explicitly() {
    let site = start_site().await;
    let exec = executor(local_fetch(), bypass_ctx(None), PermissionRules::default());
    let (text, is_error, _) = run(
        &exec,
        "WebFetch",
        json!({"url": format!("{}/page", site.base), "prompt": "resuma"}),
    )
    .await;
    assert!(is_error);
    assert!(text.contains("no model call configured"), "{text}");
}

#[tokio::test]
async fn web_fetch_permission_follows_the_cli() {
    let tool = WebFetchTool;
    let ctx = ToolContext::default();
    let rules = PermissionRules::default();
    // Host pré-aprovado: permitido sem perguntar.
    let allowed = tool
        .check_permissions(
            &json!({"url": "https://doc.rust-lang.org/std", "prompt": "p"}),
            &ctx,
            &rules,
        )
        .await;
    assert!(matches!(allowed, PermissionResult::Allow { .. }));
    // Qualquer outro: pergunta, com a sugestão de regra do domínio.
    match tool
        .check_permissions(
            &json!({"url": "https://example.com/a", "prompt": "p"}),
            &ctx,
            &rules,
        )
        .await
    {
        PermissionResult::Ask(ask) => {
            assert_eq!(
                ask.message,
                "Claude requested permissions to use WebFetch, but you haven't granted it yet."
            );
            assert_eq!(
                serde_json::to_string(&ask.suggestions.unwrap()).unwrap(),
                r#"[{"type":"addRules","destination":"localSettings","rules":[{"toolName":"WebFetch","ruleContent":"domain:example.com"}],"behavior":"allow"}]"#
            );
        }
        other => panic!("esperava ask: {other:?}"),
    }
    // Regras `WebFetch(domain:...)`.
    let rules = PermissionRules::from_lists(
        &["WebFetch(domain:ok.com)".to_string()],
        &["WebFetch(domain:bad.com)".to_string()],
    );
    assert!(matches!(
        tool.check_permissions(
            &json!({"url": "https://ok.com/a", "prompt": "p"}),
            &ctx,
            &rules
        )
        .await,
        PermissionResult::Allow { .. }
    ));
    match tool
        .check_permissions(
            &json!({"url": "https://bad.com/a", "prompt": "p"}),
            &ctx,
            &rules,
        )
        .await
    {
        PermissionResult::Deny { message, .. } => {
            assert_eq!(message, "WebFetch denied access to domain:bad.com.")
        }
        other => panic!("esperava deny: {other:?}"),
    }
}

#[tokio::test]
async fn web_fetch_asks_the_callback_with_the_suggestions() {
    let seen: Arc<Mutex<Vec<ToolPermissionRequest>>> = Arc::new(Mutex::new(Vec::new()));
    let seen_cb = Arc::clone(&seen);
    let callback: PermissionCallbackFn = Arc::new(move |req| {
        seen_cb.lock().unwrap().push(req);
        Box::pin(async {
            PermissionOutcome::Deny {
                message: "não".to_string(),
            }
        })
    });
    let ctx = ToolContext {
        permission_callback: Some(callback),
        ..Default::default()
    };
    let exec = executor(Box::new(WebFetchTool), ctx, PermissionRules::default());
    let (text, is_error, _) = run(
        &exec,
        "WebFetch",
        json!({"url": "https://example.com/a", "prompt": "p"}),
    )
    .await;
    assert!(is_error);
    assert_eq!(text, "não");
    let requests = seen.lock().unwrap();
    assert_eq!(requests.len(), 1);
    assert_eq!(
        requests[0].permission_suggestions.as_ref().unwrap()[0]["rules"][0]["ruleContent"],
        "domain:example.com"
    );
}

// ---------------------------------------------------------------------------
// WebSearch
// ---------------------------------------------------------------------------

/// A resposta que a captura usou na chamada aninhada.
fn search_blocks() -> Vec<ContentBlock> {
    serde_json::from_value(json!([
        {"type": "text", "text": "Vou buscar."},
        {"type": "server_tool_use", "id": "srvtoolu_01", "name": "web_search", "input": {"query": "rust async 2026"}},
        {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_01", "content": [
            {"type": "web_search_result", "title": "Async Rust", "url": "https://rust-lang.github.io/async-book/", "encrypted_content": "abc", "page_age": null},
            {"type": "web_search_result", "title": "Tokio", "url": "https://tokio.rs/", "encrypted_content": "def", "page_age": "2 days ago"}
        ]},
        {"type": "text", "text": "Rust async usa futures."},
        {"type": "text", "text": " E tokio."},
        {"type": "server_tool_use", "id": "srvtoolu_02", "name": "web_search", "input": {"query": "x"}},
        {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_02", "content": {"type": "web_search_tool_result_error", "error_code": "max_uses_exceeded"}},
        {"type": "server_tool_use", "id": "srvtoolu_03", "name": "web_search", "input": {"query": "y"}},
        {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_03", "content": []}
    ]))
    .unwrap()
}

#[tokio::test]
async fn web_search_result_text_and_data_match_the_cli_capture() {
    let (model_call, recorded) = fake_model(search_blocks());
    let exec = executor(
        Box::new(WebSearchTool::default()),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let (text, is_error, data) = run(&exec, "WebSearch", json!({"query": "rust async"})).await;
    assert!(!is_error);
    assert_eq!(
        text,
        "Web search results for query: \"rust async\"\n\nVou buscar.\n\nLinks: [{\"title\":\"Async Rust\",\"url\":\"https://rust-lang.github.io/async-book/\"},{\"title\":\"Tokio\",\"url\":\"https://tokio.rs/\"}]\n\nRust async usa futures. E tokio.\n\nWeb search error: max_uses_exceeded\n\nNo links found.\n\n\nREMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks."
    );
    let mut data = data;
    assert!(data["durationSeconds"].is_number());
    data.as_object_mut().unwrap().remove("durationSeconds");
    assert_eq!(
        data,
        json!({"query": "rust async", "results": [
            "Vou buscar.",
            {"tool_use_id": "srvtoolu_01", "content": [
                {"title": "Async Rust", "url": "https://rust-lang.github.io/async-book/"},
                {"title": "Tokio", "url": "https://tokio.rs/"}
            ]},
            "Rust async usa futures. E tokio.",
            "Web search error: max_uses_exceeded",
            {"tool_use_id": "srvtoolu_03", "content": []}
        ]})
    );

    // O request aninhado, como o CLI 2.1.90 manda com o gate servido.
    let requests = recorded.lock().unwrap().clone();
    let request = &requests[0];
    assert_eq!(request["model"], "claude-haiku-4-5-20251001");
    assert_eq!(request["max_tokens"], 32000);
    assert_eq!(
        request["tool_choice"],
        json!({"type": "tool", "name": "web_search"})
    );
    assert_eq!(
        request["tools"],
        json!([{"type": "web_search_20250305", "name": "web_search", "max_uses": 8}])
    );
    assert_eq!(
        request["system"],
        json!([
            {"type": "text", "text": "You are a Claude agent, built on Anthropic's Claude Agent SDK.", "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": "You are an assistant for performing a web search tool use", "cache_control": {"type": "ephemeral"}}
        ])
    );
    assert_eq!(
        request["messages"],
        json!([{"role": "user", "content": [{"type": "text", "text": "Perform a web search for the query: rust async", "cache_control": {"type": "ephemeral"}}]}])
    );
}

#[tokio::test]
async fn web_search_with_the_gate_off_uses_the_main_model_and_domains() {
    let (model_call, recorded) = fake_model(vec![ContentBlock::text("nada")]);
    let exec = executor(
        Box::new(WebSearchTool {
            use_small_fast_model: false,
        }),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let (_, is_error, _) = run(
        &exec,
        "WebSearch",
        json!({"query": "rust", "allowed_domains": ["a.com"]}),
    )
    .await;
    assert!(!is_error);
    let request = recorded.lock().unwrap()[0].clone();
    assert_eq!(request["model"], "claude-sonnet-4-6");
    assert!(request.get("tool_choice").is_none());
    assert_eq!(
        request["tools"],
        json!([{"type": "web_search_20250305", "name": "web_search", "allowed_domains": ["a.com"], "max_uses": 8}])
    );
}

#[tokio::test]
async fn web_search_validation_follows_the_cli() {
    let (model_call, _) = fake_model(vec![]);
    let exec = executor(
        Box::new(WebSearchTool::default()),
        bypass_ctx(Some(model_call)),
        PermissionRules::default(),
    );
    let (text, is_error, data) = run(
        &exec,
        "WebSearch",
        json!({"query": "rust", "allowed_domains": ["a.com"], "blocked_domains": ["b.com"]}),
    )
    .await;
    assert!(is_error);
    assert_eq!(
        text,
        "<tool_use_error>Error: Cannot specify both allowed_domains and blocked_domains in the same request</tool_use_error>"
    );
    assert_eq!(
        data,
        json!("Error: Error: Cannot specify both allowed_domains and blocked_domains in the same request")
    );
    let (text, _, _) = run(&exec, "WebSearch", json!({"query": "r"})).await;
    assert_eq!(
        text,
        "<tool_use_error>InputValidationError: [\n  {\n    \"origin\": \"string\",\n    \"code\": \"too_small\",\n    \"minimum\": 2,\n    \"inclusive\": true,\n    \"path\": [\n      \"query\"\n    ],\n    \"message\": \"Too small: expected string to have >=2 characters\"\n  }\n]</tool_use_error>"
    );
}

#[tokio::test]
async fn web_search_asks_with_the_cli_suggestion() {
    let seen: Arc<Mutex<Vec<ToolPermissionRequest>>> = Arc::new(Mutex::new(Vec::new()));
    let seen_cb = Arc::clone(&seen);
    let callback: PermissionCallbackFn = Arc::new(move |req| {
        seen_cb.lock().unwrap().push(req);
        Box::pin(async {
            PermissionOutcome::Deny {
                message: "sem busca".to_string(),
            }
        })
    });
    let ctx = ToolContext {
        permission_callback: Some(callback),
        ..Default::default()
    };
    let exec = executor(
        Box::new(WebSearchTool::default()),
        ctx,
        PermissionRules::default(),
    );
    let (text, _, _) = run(&exec, "WebSearch", json!({"query": "rust"})).await;
    assert_eq!(text, "sem busca");
    let requests = seen.lock().unwrap();
    assert_eq!(
        requests[0].description,
        "Claude requested permissions to use WebSearch, but you haven't granted it yet."
    );
    assert_eq!(
        serde_json::to_string(requests[0].permission_suggestions.as_ref().unwrap()).unwrap(),
        r#"[{"type":"addRules","rules":[{"toolName":"WebSearch"}],"behavior":"allow","destination":"localSettings"}]"#
    );
}

#[test]
fn web_search_definition_is_the_cli_one() {
    let tool = WebSearchTool::default();
    let month = rust_agent_sdk::tools::web_search::local_month_year();
    assert!(tool.description().contains(&format!(
        "  - The current month is {month}. You MUST use this year"
    )));
    assert_eq!(
        serde_json::to_string(&tool.input_schema()).unwrap(),
        r#"{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{"query":{"description":"The search query to use","type":"string","minLength":2},"allowed_domains":{"description":"Only include search results from these domains","type":"array","items":{"type":"string"}},"blocked_domains":{"description":"Never include search results from these domains","type":"array","items":{"type":"string"}}},"required":["query"],"additionalProperties":false}"#
    );
    // Tool cliente: sem definição de server tool no request principal.
    assert!(tool.api_definition().is_none());
}
