// Original: src/services/compact/apiMicrocompact.ts
function getAPIContextManagement(options2) {
  let {
    hasThinking = !1,
    isRedactThinkingActive = !1,
    clearAllThinking = !1
  } = options2 ?? {}, strategies = [];
  if (hasThinking && !isRedactThinkingActive)
    strategies.push({
      type: "clear_thinking_20251015",
      keep: clearAllThinking ? { type: "thinking_turns", value: 1 } : "all"
    });
  return strategies.length > 0 ? { edits: strategies } : void 0;
}
var DEFAULT_MAX_INPUT_TOKENS = 180000, DEFAULT_TARGET_INPUT_TOKENS = 40000, TOOLS_CLEARABLE_RESULTS, TOOLS_CLEARABLE_USES;
var init_apiMicrocompact = __esm(() => {
  init_prompt2();
  init_prompt4();
  init_prompt5();
  init_prompt3();
  init_prompt6();
  init_shellToolUtils();
  init_envUtils();
  TOOLS_CLEARABLE_RESULTS = [
    ...SHELL_TOOL_NAMES,
    GLOB_TOOL_NAME,
    GREP_TOOL_NAME,
    FILE_READ_TOOL_NAME,
    WEB_FETCH_TOOL_NAME,
    WEB_SEARCH_TOOL_NAME
  ], TOOLS_CLEARABLE_USES = [
    FILE_EDIT_TOOL_NAME,
    FILE_WRITE_TOOL_NAME,
    NOTEBOOK_EDIT_TOOL_NAME
  ];
});
