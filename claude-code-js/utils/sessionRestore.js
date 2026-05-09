// Original: src/utils/sessionRestore.ts
import { dirname as dirname61 } from "path";
function extractTodosFromTranscript(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (msg?.type !== "assistant")
      continue;
    let toolUse = msg.message.content.find((block2) => block2.type === "tool_use" && block2.name === TODO_WRITE_TOOL_NAME);
    if (!toolUse || toolUse.type !== "tool_use")
      continue;
    let input = toolUse.input;
    if (input === null || typeof input !== "object")
      return [];
    let parsed = TodoListSchema().safeParse(input.todos);
    return parsed.success ? parsed.data : [];
  }
  return [];
}
function restoreSessionStateFromLog(result, setAppState) {
  if (result.fileHistorySnapshots && result.fileHistorySnapshots.length > 0)
    fileHistoryRestoreStateFromLog(result.fileHistorySnapshots, (newState) => {
      setAppState((prev) => ({ ...prev, fileHistory: newState }));
    });
  if (!isTodoV2Enabled() && result.messages && result.messages.length > 0) {
    let todos = extractTodosFromTranscript(result.messages);
    if (todos.length > 0) {
      let agentId = getSessionId();
      setAppState((prev) => ({
        ...prev,
        todos: { ...prev.todos, [agentId]: todos }
      }));
    }
  }
}
function computeRestoredAttributionState(result) {
  return;
}
function computeStandaloneAgentContext(agentName, agentColor) {
  if (!agentName && !agentColor)
    return;
  return {
    name: agentName ?? "",
    color: agentColor === "default" ? void 0 : agentColor
  };
}
function restoreAgentFromSession(agentSetting, currentAgentDefinition, agentDefinitions) {
  if (currentAgentDefinition)
    return { agentDefinition: currentAgentDefinition, agentType: void 0 };
  if (!agentSetting)
    return setMainThreadAgentType(void 0), { agentDefinition: void 0, agentType: void 0 };
  let resumedAgent = agentDefinitions.activeAgents.find((agent) => agent.agentType === agentSetting);
  if (!resumedAgent)
    return logForDebugging(`Resumed session had agent "${agentSetting}" but it is no longer available. Using default behavior.`), setMainThreadAgentType(void 0), { agentDefinition: void 0, agentType: void 0 };
  if (setMainThreadAgentType(resumedAgent.agentType), !getMainLoopModelOverride() && resumedAgent.model && resumedAgent.model !== "inherit")
    setMainLoopModelOverride(parseUserSpecifiedModel(resumedAgent.model));
  return { agentDefinition: resumedAgent, agentType: resumedAgent.agentType };
}
async function refreshAgentDefinitionsForModeSwitch(modeWasSwitched, currentCwd2, cliAgents, currentAgentDefinitions) {
  return currentAgentDefinitions;
}
function restoreWorktreeForResume(worktreeSession) {
  let fresh = getCurrentWorktreeSession();
  if (fresh) {
    saveWorktreeState(fresh);
    return;
  }
  if (!worktreeSession)
    return;
  try {
    process.chdir(worktreeSession.worktreePath);
  } catch {
    saveWorktreeState(null);
    return;
  }
  setCwd(worktreeSession.worktreePath), setOriginalCwd(getCwd()), restoreWorktreeSession(worktreeSession), clearMemoryFileCaches(), clearSystemPromptSections(), getPlansDirectory.cache.clear?.();
}
function exitRestoredWorktree() {
  let current = getCurrentWorktreeSession();
  if (!current)
    return;
  restoreWorktreeSession(null), clearMemoryFileCaches(), clearSystemPromptSections(), getPlansDirectory.cache.clear?.();
  try {
    process.chdir(current.originalCwd);
  } catch {
    return;
  }
  setCwd(current.originalCwd), setOriginalCwd(getCwd());
}
async function processResumedConversation(result, opts, context7) {
  let modeWarning;
  if (!opts.forkSession) {
    let sid = opts.sessionIdOverride ?? result.sessionId;
    if (sid)
      switchSession(asSessionId(sid), opts.transcriptPath ? dirname61(opts.transcriptPath) : null), await renameRecordingForSession(), await resetSessionFilePointer(), restoreCostStateForSession(sid);
  } else if (result.contentReplacements?.length)
    await recordContentReplacement(result.contentReplacements);
  if (restoreSessionMetadata(opts.forkSession ? { ...result, worktreeSession: void 0 } : result), !opts.forkSession)
    restoreWorktreeForResume(result.worktreeSession), adoptResumedSessionFile();
  let { agentDefinition: restoredAgent, agentType: resumedAgentType } = restoreAgentFromSession(result.agentSetting, context7.mainThreadAgentDefinition, context7.agentDefinitions), restoredAttribution = opts.includeAttribution ? computeRestoredAttributionState(result) : void 0, standaloneAgentContext = computeStandaloneAgentContext(result.agentName, result.agentColor);
  updateSessionName(result.agentName);
  let refreshedAgentDefs = await refreshAgentDefinitionsForModeSwitch(!!modeWarning, context7.currentCwd, context7.cliAgents, context7.agentDefinitions);
  return {
    messages: result.messages,
    fileHistorySnapshots: result.fileHistorySnapshots,
    contentReplacements: result.contentReplacements,
    agentName: result.agentName,
    agentColor: result.agentColor === "default" ? void 0 : result.agentColor,
    restoredAgentDef: restoredAgent,
    initialState: {
      ...context7.initialState,
      ...resumedAgentType && { agent: resumedAgentType },
      ...restoredAttribution && { attribution: restoredAttribution },
      ...standaloneAgentContext && { standaloneAgentContext },
      agentDefinitions: refreshedAgentDefs
    }
  };
}
var init_sessionRestore = __esm(() => {
  init_state();
  init_systemPromptSections();
  init_cost_tracker();
  init_loadAgentsDir();
  init_ids();
  init_asciicast();
  init_claudemd();
  init_commitAttribution();
  init_concurrentSessions();
  init_cwd2();
  init_debug();
  init_fileHistory();
  init_messages3();
  init_model();
  init_plans();
  init_Shell();
  init_sessionStorage();
  init_tasks();
  init_types19();
  init_worktree();
});
