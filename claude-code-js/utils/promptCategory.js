// Original: src/utils/promptCategory.ts
function getQuerySourceForAgent(agentType, isBuiltInAgent2) {
  if (isBuiltInAgent2)
    return agentType ? `agent:builtin:${agentType}` : "agent:default";
  else
    return "agent:custom";
}
function getQuerySourceForREPL() {
  let style = getSettings_DEPRECATED()?.outputStyle ?? DEFAULT_OUTPUT_STYLE_NAME;
  if (style === DEFAULT_OUTPUT_STYLE_NAME)
    return "repl_main_thread";
  return style in OUTPUT_STYLE_CONFIG ? `repl_main_thread:outputStyle:${style}` : "repl_main_thread:outputStyle:custom";
}
var init_promptCategory = __esm(() => {
  init_outputStyles();
  init_settings2();
});
