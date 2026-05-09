// Original: src/utils/queryContext.ts
async function fetchSystemPromptParts({
  tools,
  mainLoopModel,
  additionalWorkingDirectories,
  mcpClients,
  customSystemPrompt
}) {
  let [defaultSystemPrompt, userContext, systemContext] = await Promise.all([
    customSystemPrompt !== void 0 ? Promise.resolve([]) : getSystemPrompt(tools, mainLoopModel, additionalWorkingDirectories, mcpClients),
    getUserContext(),
    customSystemPrompt !== void 0 ? Promise.resolve({}) : getSystemContext()
  ]);
  return { defaultSystemPrompt, userContext, systemContext };
}
async function buildSideQuestionFallbackParams({
  tools,
  commands: commands7,
  mcpClients,
  messages,
  readFileState,
  getAppState,
  setAppState,
  customSystemPrompt,
  appendSystemPrompt,
  thinkingConfig,
  agents: agents2
}) {
  let mainLoopModel = getMainLoopModel(), appState = getAppState(), { defaultSystemPrompt, userContext, systemContext } = await fetchSystemPromptParts({
    tools,
    mainLoopModel,
    additionalWorkingDirectories: Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()),
    mcpClients,
    customSystemPrompt
  }), systemPrompt = asSystemPrompt([
    ...customSystemPrompt !== void 0 ? [customSystemPrompt] : defaultSystemPrompt,
    ...appendSystemPrompt ? [appendSystemPrompt] : []
  ]), last2 = messages.at(-1), forkContextMessages = last2?.type === "assistant" && last2.message.stop_reason === null ? messages.slice(0, -1) : messages, toolUseContext = {
    options: {
      commands: commands7,
      debug: !1,
      mainLoopModel,
      tools,
      verbose: !1,
      thinkingConfig: thinkingConfig ?? (shouldEnableThinkingByDefault() !== !1 ? { type: "adaptive" } : { type: "disabled" }),
      mcpClients,
      mcpResources: {},
      isNonInteractiveSession: !0,
      agentDefinitions: { activeAgents: agents2, allAgents: [] },
      customSystemPrompt,
      appendSystemPrompt
    },
    abortController: createAbortController(),
    readFileState,
    getAppState,
    setAppState,
    messages: forkContextMessages,
    setInProgressToolUseIDs: () => {},
    setResponseLength: () => {},
    updateFileHistoryState: () => {},
    updateAttributionState: () => {}
  };
  return {
    systemPrompt,
    userContext,
    systemContext,
    toolUseContext,
    forkContextMessages
  };
}
var init_queryContext = __esm(() => {
  init_prompts4();
  init_context2();
  init_abortController();
  init_model();
  init_thinking();
});
