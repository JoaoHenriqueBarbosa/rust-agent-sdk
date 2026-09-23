//! WebSearch com paridade com o CLI 2.1.90.
//!
//! Referências JS: `tools/WebSearchTool/WebSearchTool.js` (schema,
//! `validateInput`, permissão `passthrough`, a chamada aninhada com a server
//! tool `web_search_20250305`, `makeOutputFromSearchResponse` e o texto do
//! tool_result) e `tools/WebSearchTool/prompt.js` (descrição com o mês
//! corrente, `getLocalMonthYear` de `constants/common.js`).
//!
//! É uma tool CLIENTE: o modelo principal chama `WebSearch`, e a tool faz
//! uma segunda chamada ao modelo só com a server tool `web_search`, cujo
//! resultado vira o texto `Web search results for query: ...`.

use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
use std::time::Instant;

use async_trait::async_trait;
use serde_json::{json, Value};

use crate::api::types::{
    ApiMessage, ContentBlock, CreateMessageRequest, SystemBlock, ToolChoice, ToolDefinition,
};
use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::permission::{PermissionAsk, PermissionResult, PermissionRules};
use crate::tools::web_fetch::cli_system_prefix;

/// Nome da tool (`WEB_SEARCH_TOOL_NAME`).
pub const WEB_SEARCH_TOOL_NAME: &str = "WebSearch";

/// O system prompt da chamada aninhada.
const SEARCH_SYSTEM_PROMPT: &str = "You are an assistant for performing a web search tool use";

/// `max_tokens` da chamada aninhada (medido no request do CLI 2.1.90).
const SEARCH_MAX_TOKENS: u32 = 32_000;

/// Web search pelo modelo, com a server tool da API.
pub struct WebSearchTool {
    /// O gate `tengu_plum_vx3` do CLI: ligado, a busca vai ao modelo pequeno
    /// (`ANTHROPIC_SMALL_FAST_MODEL`/haiku) com `tool_choice` forçando
    /// `web_search` e sem thinking; desligado, vai ao modelo do loop
    /// principal sem `tool_choice`. O default é ligado, que é o valor que o
    /// GrowthBook serve ao CLI 2.1.90 (medido no request aninhado real).
    pub use_small_fast_model: bool,
}

impl Default for WebSearchTool {
    fn default() -> Self {
        Self {
            use_small_fast_model: true,
        }
    }
}

/// `getLocalMonthYear`: "September 2026", respeitando
/// `CLAUDE_CODE_OVERRIDE_DATE`.
pub fn local_month_year() -> String {
    use chrono::{Local, NaiveDate};
    let from_override = std::env::var("CLAUDE_CODE_OVERRIDE_DATE")
        .ok()
        .and_then(|raw| {
            chrono::DateTime::parse_from_rfc3339(&raw)
                .map(|d| d.with_timezone(&Local).date_naive())
                .ok()
                .or_else(|| NaiveDate::parse_from_str(&raw, "%Y-%m-%d").ok())
        });
    let date = from_override.unwrap_or_else(|| Local::now().date_naive());
    date.format("%B %Y").to_string()
}

/// `getWebSearchPrompt` com o mês dado.
pub fn web_search_prompt(month_year: &str) -> String {
    format!(
        "
- Allows Claude to search the web and use the results to inform responses
- Provides up-to-date information for current events and recent data
- Returns search result information formatted as search result blocks, including links as markdown hyperlinks
- Use this tool for accessing information beyond Claude's knowledge cutoff
- Searches are performed automatically within a single API call

CRITICAL REQUIREMENT - You MUST follow this:
  - After answering the user's question, you MUST include a \"Sources:\" section at the end of your response
  - In the Sources section, list all relevant URLs from the search results as markdown hyperlinks: [Title](URL)
  - This is MANDATORY - never skip including sources in your response
  - Example format:

    [Your answer here]

    Sources:
    - [Source Title 1](https://example.com/1)
    - [Source Title 2](https://example.com/2)

Usage notes:
  - Domain filtering is supported to include or block specific websites
  - Web search is only available in the US

IMPORTANT - Use the correct year in search queries:
  - The current month is {month_year}. You MUST use this year when searching for recent information, documentation, or current events.
  - Example: If the user asks for \"latest React docs\", search for \"React documentation\" with the current year, NOT last year
"
    )
}

/// A descrição do mês corrente, com vida estática (uma por mês, o trait
/// devolve `&str`).
fn current_description() -> &'static str {
    static CACHE: OnceLock<Mutex<HashMap<String, &'static str>>> = OnceLock::new();
    let month = local_month_year();
    let mut guard = CACHE
        .get_or_init(|| Mutex::new(HashMap::new()))
        .lock()
        .unwrap_or_else(|e| e.into_inner());
    if let Some(desc) = guard.get(&month) {
        return desc;
    }
    let leaked: &'static str = Box::leak(web_search_prompt(&month).into_boxed_str());
    guard.insert(month, leaked);
    leaked
}

fn string_list(input: &Value, key: &str) -> Option<Vec<String>> {
    input.get(key).and_then(Value::as_array).map(|items| {
        items
            .iter()
            .filter_map(Value::as_str)
            .map(str::to_string)
            .collect()
    })
}

/// `makeToolSchema`.
pub fn web_search_server_tool(input: &Value) -> ToolDefinition {
    ToolDefinition {
        r#type: Some("web_search_20250305".to_string()),
        name: "web_search".to_string(),
        allowed_domains: string_list(input, "allowed_domains"),
        blocked_domains: string_list(input, "blocked_domains"),
        max_uses: Some(8),
        ..Default::default()
    }
}

/// `makeOutputFromSearchResponse`: os resultados na ordem da resposta,
/// textos intercalados e os links de cada busca.
pub fn output_from_search_response(
    content: &[ContentBlock],
    query: &str,
    duration_seconds: f64,
) -> Value {
    let mut results: Vec<Value> = Vec::new();
    let mut text_acc = String::new();
    let mut in_text = true;
    for block in content {
        match block {
            ContentBlock::ServerToolUse { .. } if in_text => {
                in_text = false;
                let trimmed = text_acc.trim();
                if !trimmed.is_empty() {
                    results.push(Value::String(trimmed.to_string()));
                }
                text_acc.clear();
            }
            ContentBlock::ServerToolUse { .. } => {}
            ContentBlock::WebSearchToolResult {
                tool_use_id,
                content,
            } => match content.as_array() {
                Some(hits) => {
                    let hits: Vec<Value> = hits
                        .iter()
                        .map(|r| {
                            let mut hit = serde_json::Map::new();
                            if let Some(title) = r.get("title") {
                                hit.insert("title".into(), title.clone());
                            }
                            if let Some(url) = r.get("url") {
                                hit.insert("url".into(), url.clone());
                            }
                            Value::Object(hit)
                        })
                        .collect();
                    results.push(json!({"tool_use_id": tool_use_id, "content": hits}));
                }
                None => {
                    let code = match content.get("error_code") {
                        Some(Value::String(s)) => s.clone(),
                        Some(other) => other.to_string(),
                        None => "undefined".to_string(),
                    };
                    results.push(Value::String(format!("Web search error: {code}")));
                }
            },
            ContentBlock::Text { text, .. } => {
                if in_text {
                    text_acc.push_str(text);
                } else {
                    in_text = true;
                    text_acc = text.clone();
                }
            }
            _ => {}
        }
    }
    if !text_acc.is_empty() {
        results.push(Value::String(text_acc.trim().to_string()));
    }
    json!({
        "query": query,
        "results": results,
        "durationSeconds": duration_seconds,
    })
}

/// `mapToolResultToToolResultBlockParam` do WebSearch.
pub fn format_search_output(output: &Value) -> String {
    let query = output
        .get("query")
        .and_then(Value::as_str)
        .unwrap_or_default();
    let mut formatted = format!("Web search results for query: \"{query}\"\n\n");
    if let Some(results) = output.get("results").and_then(Value::as_array) {
        for result in results {
            match result {
                Value::Null => {}
                Value::String(s) => {
                    formatted.push_str(s);
                    formatted.push_str("\n\n");
                }
                other => {
                    let links = other.get("content").and_then(Value::as_array);
                    match links {
                        Some(links) if !links.is_empty() => {
                            formatted.push_str(&format!(
                                "Links: {}\n\n",
                                serde_json::to_string(links).unwrap_or_default()
                            ));
                        }
                        _ => formatted.push_str("No links found.\n\n"),
                    }
                }
            }
        }
    }
    formatted.push_str(
        "\nREMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks.",
    );
    formatted.trim().to_string()
}

#[async_trait]
impl Tool for WebSearchTool {
    fn name(&self) -> &str {
        WEB_SEARCH_TOOL_NAME
    }

    fn description(&self) -> &str {
        current_description()
    }

    fn input_schema(&self) -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "query": {
                    "description": "The search query to use",
                    "type": "string",
                    "minLength": 2
                },
                "allowed_domains": {
                    "description": "Only include search results from these domains",
                    "type": "array",
                    "items": {"type": "string"}
                },
                "blocked_domains": {
                    "description": "Never include search results from these domains",
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["query"],
            "additionalProperties": false
        })
    }

    fn is_concurrency_safe(&self) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    fn max_result_size_chars(&self) -> Option<usize> {
        Some(100_000)
    }

    async fn validate_input(&self, input: &Value, _context: &ToolContext) -> Result<(), String> {
        let query = input
            .get("query")
            .and_then(Value::as_str)
            .unwrap_or_default();
        if query.is_empty() {
            return Err("Error: Missing query".to_string());
        }
        let non_empty = |key: &str| {
            input
                .get(key)
                .and_then(Value::as_array)
                .map(|a| !a.is_empty())
                .unwrap_or(false)
        };
        if non_empty("allowed_domains") && non_empty("blocked_domains") {
            return Err(
                "Error: Cannot specify both allowed_domains and blocked_domains in the same request"
                    .to_string(),
            );
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::Passthrough(PermissionAsk {
            message: "WebSearchTool requires permission.".to_string(),
            suggestions: Some(json!([{
                "type": "addRules",
                "rules": [{"toolName": WEB_SEARCH_TOOL_NAME}],
                "behavior": "allow",
                "destination": "localSettings",
            }])),
            ..Default::default()
        })
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let Some(model_call) = &context.model_call else {
            return ToolResult::error(
                "WebSearch needs a model to run the search, and this session has no model call configured (ToolContext.model_call).",
            );
        };
        let model = if self.use_small_fast_model {
            context.small_fast_model_name()
        } else {
            match &context.main_model {
                Some(m) => m.clone(),
                None => {
                    return ToolResult::error(
                        "WebSearch needs the main loop model (ToolContext.main_model), and this session has none configured.",
                    )
                }
            }
        };
        let query = input
            .get("query")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .to_string();
        let start = Instant::now();
        let mut request = CreateMessageRequest::new(
            model,
            SEARCH_MAX_TOKENS,
            vec![ApiMessage::user(vec![ContentBlock::text_cached(format!(
                "Perform a web search for the query: {query}"
            ))])],
        );
        request.system = Some(vec![
            SystemBlock::text_cached(cli_system_prefix(context)),
            SystemBlock::text_cached(SEARCH_SYSTEM_PROMPT),
        ]);
        request.tools = Some(vec![web_search_server_tool(&input)]);
        // O JS faz esta chamada com `queryModelWithStreaming`; o motor honra
        // `stream` e monta a ApiResponse a partir do stream.
        request.stream = true;
        if self.use_small_fast_model {
            request.tool_choice = Some(ToolChoice::Tool {
                name: "web_search".to_string(),
            });
            request.temperature = Some(1.0);
        }
        let response = match model_call(request).await {
            Ok(r) => r,
            Err(e) => return ToolResult::error(e),
        };
        let duration_seconds = start.elapsed().as_secs_f64();
        let output = output_from_search_response(&response.content, &query, duration_seconds);
        ToolResult::text(format_search_output(&output)).with_tool_use_result(output)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn prompt_mentions_the_month() {
        let prompt = web_search_prompt("September 2026");
        assert!(prompt.contains("The current month is September 2026. You MUST"));
        assert!(prompt.starts_with("\n- Allows Claude"));
    }
}
