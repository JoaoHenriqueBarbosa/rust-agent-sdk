use async_trait::async_trait;

use crate::api::types::ToolDefinition;
use crate::tools::framework::{Tool, ToolContext, ToolResult};

/// Web search — executada PELO SERVIDOR da API (`web_search_20250305`), não
/// pelo SDK. A tool existe no registry só para ser DECLARADA no request: o
/// servidor roda a busca e devolve `server_tool_use` +
/// `web_search_tool_result` já prontos, que atravessam o acumulador sem
/// passar pelo executor. Se um `execute` chegar aqui, o backend não suporta a
/// server tool e a mensagem diz exatamente isso.
pub struct WebSearchTool {
    pub max_uses: Option<u32>,
}

impl Default for WebSearchTool {
    fn default() -> Self {
        Self { max_uses: Some(5) }
    }
}

#[async_trait]
impl Tool for WebSearchTool {
    fn name(&self) -> &str { "web_search" }

    fn description(&self) -> &str {
        "Search the web. Executed server-side by the Anthropic API."
    }

    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "query": { "type": "string", "description": "The search query" }
            },
            "required": ["query"]
        })
    }

    fn is_concurrency_safe(&self) -> bool { true }
    fn is_read_only(&self) -> bool { true }

    /// A definição enviada à API é a da SERVER tool (tipo versionado, sem
    /// input_schema) — é isso que faz o servidor executar a busca.
    fn api_definition(&self) -> Option<ToolDefinition> {
        Some(ToolDefinition::web_search(self.max_uses))
    }

    async fn execute(&self, _input: serde_json::Value, _context: &ToolContext) -> ToolResult {
        ToolResult::error(
            "web_search is a server-side tool: the API executes it and returns the \
             result directly. Receiving it here means this endpoint does not support \
             web_search_20250305 — use a backend that does, or drop the tool.",
        )
    }
}
