// Original: src/commands/clear/conversation.ts
var exports_conversation = {};
__export(exports_conversation, {
  clearConversation: () => clearConversation
});
import { randomUUID as randomUUID23 } from "crypto";
async function clearConversation({
  setMessages,
  readFileState,
  discoveredSkillNames,
  loadedNestedMemoryPaths,
  getAppState,
  setAppState,
  setConversationId
}) {
  let sessionEndTimeoutMs = getSessionEndHookTimeoutMs();
  await executeSessionEndHooks("clear", {
    getAppState,
    setAppState,
    signal: AbortSignal.timeout(sessionEndTimeoutMs),
    timeoutMs: sessionEndTimeoutMs
  });
  let lastRequestId = getLastMainRequestId();
  if (lastRequestId)
    logEvent("tengu_cache_eviction_hint", {
      scope: "conversation_clear",
      last_request_id: lastRequestId
    });
  let preservedAgentIds = /* @__PURE__ */ new Set, preservedLocalAgents = [], shouldKillTask = (task) => ("isBackgrounded" in task) && task.isBackgrounded === !1;
  if (getAppState)
    for (let task of Object.values(getAppState().tasks)) {
      if (shouldKillTask(task))
        continue;
      if (isLocalAgentTask(task))
        preservedAgentIds.add(task.agentId), preservedLocalAgents.push(task);
      else if (isInProcessTeammateTask(task))
        preservedAgentIds.add(task.identity.agentId);
    }
  if (setMessages(() => []), setConversationId)
    setConversationId(randomUUID23());
  if (clearSessionCaches(preservedAgentIds), setCwd(getOriginalCwd()), readFileState.clear(), discoveredSkillNames?.clear(), loadedNestedMemoryPaths?.clear(), setAppState)
    setAppState((prev) => {
      let nextTasks = {};
      for (let [taskId, task] of Object.entries(prev.tasks)) {
        if (!shouldKillTask(task)) {
          nextTasks[taskId] = task;
          continue;
        }
        try {
          if (task.status === "running") {
            if (isLocalShellTask(task)) {
              if (task.shellCommand?.kill(), task.shellCommand?.cleanup(), task.cleanupTimeoutId)
                clearTimeout(task.cleanupTimeoutId);
            }
            if ("abortController" in task)
              task.abortController?.abort();
            if ("unregisterCleanup" in task)
              task.unregisterCleanup?.();
          }
        } catch (error44) {
          logError2(error44);
        }
        evictTaskOutput(taskId);
      }
      return {
        ...prev,
        tasks: nextTasks,
        attribution: createEmptyAttributionState(),
        standaloneAgentContext: void 0,
        fileHistory: {
          snapshots: [],
          trackedFiles: /* @__PURE__ */ new Set,
          snapshotSequence: 0
        },
        mcp: {
          clients: [],
          tools: [],
          commands: [],
          resources: {},
          pluginReconnectKey: prev.mcp.pluginReconnectKey
        }
      };
    });
  clearAllPlanSlugs(), clearSessionMetadata(), regenerateSessionId({ setCurrentAsParent: !0 }), await resetSessionFilePointer();
  for (let task of preservedLocalAgents) {
    if (task.status !== "running")
      continue;
    initTaskOutputAsSymlink(task.id, getAgentTranscriptPath(asAgentId(task.agentId)));
  }
  let worktreeSession = getCurrentWorktreeSession();
  if (worktreeSession)
    saveWorktreeState(worktreeSession);
  let hookMessages = await processSessionStartHooks("clear");
  if (hookMessages.length > 0)
    setMessages(() => hookMessages);
}
var init_conversation = __esm(() => {
  init_state();
  init_LocalAgentTask();
  init_ids();
  init_commitAttribution();
  init_hooks5();
  init_log3();
  init_plans();
  init_Shell();
  init_sessionStart();
  init_sessionStorage();
  init_diskOutput();
  init_worktree();
  init_caches();
});
