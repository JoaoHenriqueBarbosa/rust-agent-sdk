// Original: src/utils/systemPrompt.ts
function isProactiveActive_SAFE_TO_CALL_ANYWHERE() {
  return proactiveModule?.isProactiveActive() ?? !1;
}
function buildEffectiveSystemPrompt({
  mainThreadAgentDefinition,
  toolUseContext,
  customSystemPrompt,
  defaultSystemPrompt,
  appendSystemPrompt,
  overrideSystemPrompt
}) {
  if (overrideSystemPrompt)
    return asSystemPrompt([overrideSystemPrompt]);
  let agentSystemPrompt = mainThreadAgentDefinition ? isBuiltInAgent(mainThreadAgentDefinition) ? mainThreadAgentDefinition.getSystemPrompt({
    toolUseContext: { options: toolUseContext.options }
  }) : mainThreadAgentDefinition.getSystemPrompt() : void 0;
  if (mainThreadAgentDefinition?.memory)
    logEvent("tengu_agent_memory_loaded", {
      ...!1,
      scope: mainThreadAgentDefinition.memory,
      source: "main-thread"
    });
  if (agentSystemPrompt && !0 && isProactiveActive_SAFE_TO_CALL_ANYWHERE())
    return asSystemPrompt([
      ...defaultSystemPrompt,
      `
# Custom Agent Instructions
${agentSystemPrompt}`,
      ...appendSystemPrompt ? [appendSystemPrompt] : []
    ]);
  return asSystemPrompt([
    ...agentSystemPrompt ? [agentSystemPrompt] : customSystemPrompt ? [customSystemPrompt] : defaultSystemPrompt,
    ...appendSystemPrompt ? [appendSystemPrompt] : []
  ]);
}
var proactiveModule = null;
var init_systemPrompt = __esm(() => {
  init_loadAgentsDir();
  init_envUtils();
});
