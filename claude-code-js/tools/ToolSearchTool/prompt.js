// Original: src/tools/ToolSearchTool/prompt.ts
var exports_prompt3 = {};
__export(exports_prompt3, {
  isDeferredTool: () => isDeferredTool,
  getPrompt: () => getPrompt2,
  formatDeferredToolLine: () => formatDeferredToolLine,
  TOOL_SEARCH_TOOL_NAME: () => TOOL_SEARCH_TOOL_NAME
});
function getToolLocationHint() {
  return "Deferred tools appear by name in <available-deferred-tools> messages.";
}
function isDeferredTool(tool) {
  if (tool.alwaysLoad === !0)
    return !1;
  if (tool.isMcp === !0)
    return !0;
  if (tool.name === TOOL_SEARCH_TOOL_NAME)
    return !1;
  if (BRIEF_TOOL_NAME3 && tool.name === BRIEF_TOOL_NAME3)
    return !1;
  return tool.shouldDefer === !0;
}
function formatDeferredToolLine(tool) {
  return tool.name;
}
function getPrompt2() {
  return PROMPT_HEAD + getToolLocationHint() + PROMPT_TAIL;
}
var BRIEF_TOOL_NAME3, PROMPT_HEAD = `Fetches full schema definitions for deferred tools so they can be called.

`, PROMPT_TAIL = ` Until fetched, only the name is known \u2014 no schema, can't invoke. Takes a query, returns matched tools' complete JSONSchema in a <functions> block. Once returned, callable like any tool.

Result format: each tool as one <function>{"description": "...", "name": "...", "parameters": {...}}</function> line.

Query forms:
- "select:Read,Edit,Grep" \u2014 exact names
- "notebook jupyter" \u2014 keyword search, up to max_results
- "+slack send" \u2014 require "slack" in name, rank by rest`;
var init_prompt8 = __esm(() => {
  init_state();
  init_constants3();
  BRIEF_TOOL_NAME3 = (init_prompt(), __toCommonJS(exports_prompt)).BRIEF_TOOL_NAME;
});
