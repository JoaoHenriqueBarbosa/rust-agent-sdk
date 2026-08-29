// Original: src/tools/AgentTool/resumeAgent.ts
import { promises as fsp } from "fs";
async function resumeAgentBackground({
  agentId,
  prompt,
  toolUseContext,
  canUseTool,
  invokingRequestId
}) {
  let startTime = Date.now(), appState = toolUseContext.getAppState(), rootSetAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState, permissionMode = appState.toolPermissionContext.mode, [transcript, meta] = await Promise.all([
    getAgentTranscript(asAgentId(agentId)),
    readAgentMetadata(asAgentId(agentId))
  ]);
  if (!transcript)
    throw Error(`No transcript found for agent ID: ${agentId}`);
  let resumedMessages = filterWhitespaceOnlyAssistantMessages(filterOrphanedThinkingOnlyMessages(filterUnresolvedToolUses(transcript.messages))), resumedReplacementState = reconstructForSubagentResume(toolUseContext.contentReplacementState, resumedMessages, transcript.contentReplacements), resumedWorktreePath = meta?.worktreePath ? await fsp.stat(meta.worktreePath).then((s2) => s2.isDirectory() ? meta.worktreePath : void 0, () => {
    logForDebugging(`Resumed worktree ${meta.worktreePath} no longer exists; falling back to parent cwd`);
    return;
  }) : void 0;
  if (resumedWorktreePath) {
    let now2 = /* @__PURE__ */ new Date;
    await fsp.utimes(resumedWorktreePath, now2, now2);
  }
  let selectedAgent, isResumedFork = !1;
  if (meta?.agentType === FORK_AGENT.agentType)
    selectedAgent = FORK_AGENT, isResumedFork = !0;
  else if (meta?.agentType)
    selectedAgent = toolUseContext.options.agentDefinitions.activeAgents.find((a2) => a2.agentType === meta.agentType) ?? GENERAL_PURPOSE_AGENT;
  else
    selectedAgent = GENERAL_PURPOSE_AGENT;
  let uiDescription = meta?.description ?? "(resumed)", forkParentSystemPrompt;
  if (isResumedFork) {
    if (toolUseContext.renderedSystemPrompt)
      forkParentSystemPrompt = toolUseContext.renderedSystemPrompt;
    else {
      let mainThreadAgentDefinition = appState.agent ? appState.agentDefinitions.activeAgents.find((a2) => a2.agentType === appState.agent) : void 0, additionalWorkingDirectories = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()), defaultSystemPrompt = await getSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, additionalWorkingDirectories, toolUseContext.options.mcpClients);
      forkParentSystemPrompt = buildEffectiveSystemPrompt({
        mainThreadAgentDefinition,
        toolUseContext,
        customSystemPrompt: toolUseContext.options.customSystemPrompt,
        defaultSystemPrompt,
        appendSystemPrompt: toolUseContext.options.appendSystemPrompt
      });
    }
    if (!forkParentSystemPrompt)
      throw Error("Cannot resume fork agent: unable to reconstruct parent system prompt");
  }
  let resolvedAgentModel = getAgentModel(selectedAgent.model, toolUseContext.options.mainLoopModel, void 0, permissionMode), workerPermissionContext = {
    ...appState.toolPermissionContext,
    mode: selectedAgent.permissionMode ?? "acceptEdits"
  }, workerTools = isResumedFork ? toolUseContext.options.tools : assembleToolPool(workerPermissionContext, appState.mcp.tools), runAgentParams = {
    agentDefinition: selectedAgent,
    promptMessages: [
      ...resumedMessages,
      createUserMessage({ content: prompt })
    ],
    toolUseContext,
    canUseTool,
    isAsync: !0,
    querySource: getQuerySourceForAgent(selectedAgent.agentType, isBuiltInAgent(selectedAgent)),
    model: void 0,
    override: isResumedFork ? { systemPrompt: forkParentSystemPrompt } : void 0,
    availableTools: workerTools,
    forkContextMessages: void 0,
    ...isResumedFork && { useExactTools: !0 },
    worktreePath: resumedWorktreePath,
    description: meta?.description,
    contentReplacementState: resumedReplacementState
  }, agentBackgroundTask = registerAsyncAgent({
    agentId,
    description: uiDescription,
    prompt,
    selectedAgent,
    setAppState: rootSetAppState,
    toolUseId: toolUseContext.toolUseId
  }), metadata = {
    prompt,
    resolvedAgentModel,
    isBuiltInAgent: isBuiltInAgent(selectedAgent),
    startTime,
    agentType: selectedAgent.agentType,
    isAsync: !0
  }, asyncAgentContext = {
    agentId,
    parentSessionId: getParentSessionId2(),
    agentType: "subagent",
    subagentName: selectedAgent.agentType,
    isBuiltIn: isBuiltInAgent(selectedAgent),
    invokingRequestId,
    invocationKind: "resume",
    invocationEmitted: !1
  }, wrapWithCwd = (fn) => resumedWorktreePath ? runWithCwdOverride(resumedWorktreePath, fn) : fn();
  return runWithAgentContext(asyncAgentContext, () => wrapWithCwd(() => runAsyncAgentLifecycle({
    taskId: agentBackgroundTask.agentId,
    abortController: agentBackgroundTask.abortController,
    makeStream: (onCacheSafeParams) => runAgent({
      ...runAgentParams,
      override: {
        ...runAgentParams.override,
        agentId: asAgentId(agentBackgroundTask.agentId),
        abortController: agentBackgroundTask.abortController
      },
      onCacheSafeParams
    }),
    metadata,
    description: uiDescription,
    toolUseContext,
    rootSetAppState,
    agentIdForCleanup: agentId,
    enableSummarization: isCoordinatorMode() || isForkSubagentEnabled() || getSdkAgentProgressSummariesEnabled(),
    getWorktreeResult: async () => resumedWorktreePath ? { worktreePath: resumedWorktreePath } : {}
  }))), {
    agentId,
    description: uiDescription,
    outputFile: getTaskOutputPath(agentId)
  };
}
var init_resumeAgent = __esm(() => {
  init_state();
  init_prompts4();
  init_coordinatorMode();
  init_LocalAgentTask();
  init_tools2();
  init_ids();
  init_agentContext();
  init_cwd2();
  init_debug();
  init_messages3();
  init_agent();
  init_promptCategory();
  init_sessionStorage();
  init_systemPrompt();
  init_diskOutput();
  init_teammate();
  init_toolResultStorage();
  init_agentToolUtils();
  init_generalPurposeAgent();
  init_forkSubagent();
  init_loadAgentsDir();
  init_runAgent();
});
