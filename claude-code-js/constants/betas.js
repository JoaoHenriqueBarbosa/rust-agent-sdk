// Original: src/constants/betas.ts
var CLAUDE_CODE_20250219_BETA_HEADER = "claude-code-20250219", INTERLEAVED_THINKING_BETA_HEADER = "interleaved-thinking-2025-05-14", CONTEXT_1M_BETA_HEADER = "context-1m-2025-08-07", CONTEXT_MANAGEMENT_BETA_HEADER = "context-management-2025-06-27", STRUCTURED_OUTPUTS_BETA_HEADER = "structured-outputs-2025-12-15", WEB_SEARCH_BETA_HEADER = "web-search-2025-03-05", TOOL_SEARCH_BETA_HEADER_1P = "advanced-tool-use-2025-11-20", TOOL_SEARCH_BETA_HEADER_3P = "tool-search-tool-2025-10-19", EFFORT_BETA_HEADER = "effort-2025-11-24", TASK_BUDGETS_BETA_HEADER = "task-budgets-2026-03-13", PROMPT_CACHING_SCOPE_BETA_HEADER = "prompt-caching-scope-2026-01-05", FAST_MODE_BETA_HEADER = "fast-mode-2026-02-01", REDACT_THINKING_BETA_HEADER = "redact-thinking-2026-02-12", SUMMARIZE_CONNECTOR_TEXT_BETA_HEADER = "", AFK_MODE_BETA_HEADER = "", ADVISOR_BETA_HEADER = "advisor-tool-2026-03-01", BEDROCK_EXTRA_PARAMS_HEADERS, VERTEX_COUNT_TOKENS_ALLOWED_BETAS;
var init_betas = __esm(() => {
  BEDROCK_EXTRA_PARAMS_HEADERS = /* @__PURE__ */ new Set([
    "interleaved-thinking-2025-05-14",
    "context-1m-2025-08-07",
    "tool-search-tool-2025-10-19"
  ]), VERTEX_COUNT_TOKENS_ALLOWED_BETAS = /* @__PURE__ */ new Set([
    "claude-code-20250219",
    "interleaved-thinking-2025-05-14",
    "context-management-2025-06-27"
  ]);
});
