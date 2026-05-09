// Original: src/tools/REPLTool/constants.ts
function isReplModeEnabled() {
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_REPL))
    return !1;
  if (isEnvTruthy(process.env.CLAUDE_REPL_MODE))
    return !0;
  return !1;
}
var REPL_TOOL_NAME = "REPL", REPL_ONLY_TOOLS;
var init_constants9 = __esm(() => {
  init_envUtils();
  init_constants3();
  init_prompt2();
  init_prompt4();
  init_prompt5();
  REPL_ONLY_TOOLS = /* @__PURE__ */ new Set([
    FILE_READ_TOOL_NAME,
    FILE_WRITE_TOOL_NAME,
    FILE_EDIT_TOOL_NAME,
    GLOB_TOOL_NAME,
    GREP_TOOL_NAME,
    BASH_TOOL_NAME,
    NOTEBOOK_EDIT_TOOL_NAME,
    AGENT_TOOL_NAME
  ]);
});
