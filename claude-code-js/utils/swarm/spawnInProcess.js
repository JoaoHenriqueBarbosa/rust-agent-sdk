// Original: src/utils/swarm/spawnInProcess.ts
async function spawnInProcessTeammate(config10, context6) {
  let { name: name3, teamName, prompt, color: color2, planModeRequired, model } = config10, { setAppState } = context6, agentId = formatAgentId(name3, teamName), taskId = generateTaskId("in_process_teammate");
  logForDebugging(`[spawnInProcessTeammate] Spawning ${agentId} (taskId: ${taskId})`);
  try {
    let abortController = createAbortController(), parentSessionId = getSessionId(), identity17 = {
      agentId,
      agentName: name3,
      teamName,
      color: color2,
      planModeRequired,
      parentSessionId
    }, teammateContext = createTeammateContext({
      agentId,
      agentName: name3,
      teamName,
      color: color2,
      planModeRequired,
      parentSessionId,
      abortController
    });
    if (isPerfettoTracingEnabled())
      registerAgent(agentId, name3, parentSessionId);
    let description = `${name3}: ${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}`, taskState = {
      ...createTaskStateBase(taskId, "in_process_teammate", description, context6.toolUseId),
      type: "in_process_teammate",
      status: "running",
      identity: identity17,
      prompt,
      model,
      abortController,
      awaitingPlanApproval: !1,
      spinnerVerb: sample_default(getSpinnerVerbs()),
      pastTenseVerb: sample_default(TURN_COMPLETION_VERBS),
      permissionMode: planModeRequired ? "plan" : "default",
      isIdle: !1,
      shutdownRequested: !1,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      pendingUserMessages: [],
      messages: []
    }, unregisterCleanup = registerCleanup(async () => {
      logForDebugging(`[spawnInProcessTeammate] Cleanup called for ${agentId}`), abortController.abort();
    });
    return taskState.unregisterCleanup = unregisterCleanup, registerTask(taskState, setAppState), logForDebugging(`[spawnInProcessTeammate] Registered ${agentId} in AppState`), {
      success: !0,
      agentId,
      taskId,
      abortController,
      teammateContext
    };
  } catch (error44) {
    let errorMessage2 = error44 instanceof Error ? error44.message : "Unknown error during spawn";
    return logForDebugging(`[spawnInProcessTeammate] Failed to spawn ${agentId}: ${errorMessage2}`), {
      success: !1,
      agentId,
      error: errorMessage2
    };
  }
}
function killInProcessTeammate(taskId, setAppState) {
  let killed = !1, teamName = null, agentId = null, toolUseId, description;
  if (setAppState((prev) => {
    let task = prev.tasks[taskId];
    if (!task || task.type !== "in_process_teammate")
      return prev;
    let teammateTask = task;
    if (teammateTask.status !== "running")
      return prev;
    teamName = teammateTask.identity.teamName, agentId = teammateTask.identity.agentId, toolUseId = teammateTask.toolUseId, description = teammateTask.description, teammateTask.abortController?.abort(), teammateTask.unregisterCleanup?.(), killed = !0, teammateTask.onIdleCallbacks?.forEach((cb) => cb());
    let updatedTeamContext = prev.teamContext;
    if (prev.teamContext && prev.teamContext.teammates && agentId) {
      let { [agentId]: _, ...remainingTeammates } = prev.teamContext.teammates;
      updatedTeamContext = {
        ...prev.teamContext,
        teammates: remainingTeammates
      };
    }
    return {
      ...prev,
      teamContext: updatedTeamContext,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...teammateTask,
          status: "killed",
          notified: !0,
          endTime: Date.now(),
          onIdleCallbacks: [],
          messages: teammateTask.messages?.length ? [teammateTask.messages[teammateTask.messages.length - 1]] : void 0,
          pendingUserMessages: [],
          inProgressToolUseIDs: void 0,
          abortController: void 0,
          unregisterCleanup: void 0,
          currentWorkAbortController: void 0
        }
      }
    };
  }), teamName && agentId)
    removeMemberByAgentId(teamName, agentId);
  if (killed)
    evictTaskOutput(taskId), emitTaskTerminatedSdk(taskId, "stopped", {
      toolUseId,
      summary: description
    }), setTimeout(evictTerminalTask.bind(null, taskId, setAppState), STOPPED_DISPLAY_MS);
  if (agentId)
    unregisterAgent(agentId);
  return killed;
}
var init_spawnInProcess = __esm(() => {
  init_sample();
  init_state();
  init_spinnerVerbs();
  init_turnCompletionVerbs();
  init_Task();
  init_abortController();
  init_cleanupRegistry();
  init_debug();
  init_sdkEventQueue();
  init_diskOutput();
  init_framework();
  init_teammateContext();
  init_perfettoTracing();
  init_teamHelpers();
});
