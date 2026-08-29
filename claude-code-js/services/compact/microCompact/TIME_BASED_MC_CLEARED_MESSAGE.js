// var: TIME_BASED_MC_CLEARED_MESSAGE
var TIME_BASED_MC_CLEARED_MESSAGE = "[Old tool result content cleared]", IMAGE_MAX_TOKEN_SIZE = 2000, COMPACTABLE_TOOLS, cachedMCModule = null, cachedMCState = null, pendingCacheEdits = null;
var init_microCompact = __esm(() => {
  init_prompt2();
  init_prompt4();
  init_prompt5();
  init_prompt3();
  init_prompt6();
  init_debug();
  init_shellToolUtils();
  init_slowOperations();
  init_tokenEstimation();
  init_compactWarningState();
  init_timeBasedMCConfig();
  COMPACTABLE_TOOLS = /* @__PURE__ */ new Set([
    FILE_READ_TOOL_NAME,
    ...SHELL_TOOL_NAMES,
    GREP_TOOL_NAME,
    GLOB_TOOL_NAME,
    WEB_SEARCH_TOOL_NAME,
    WEB_FETCH_TOOL_NAME,
    FILE_EDIT_TOOL_NAME,
    FILE_WRITE_TOOL_NAME
  ]);
});
