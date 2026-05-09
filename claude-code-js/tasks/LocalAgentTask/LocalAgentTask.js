// Original: src/tasks/LocalAgentTask/LocalAgentTask.tsx
function createProgressTracker() {
  return {
    toolUseCount: 0,
    latestInputTokens: 0,
    cumulativeOutputTokens: 0,
    recentActivities: []
  };
}
function getTokenCountFromTracker(tracker) {
  return tracker.latestInputTokens + tracker.cumulativeOutputTokens;
}
function updateProgressFromMessage(tracker, message, resolveActivityDescription, tools) {
  if (message.type !== "assistant")
    return;
  let usage = message.message.usage;
  tracker.latestInputTokens = usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0), tracker.cumulativeOutputTokens += usage.output_tokens;
  for (let content of message.message.content)
    if (content.type === "tool_use") {
      if (tracker.toolUseCount++, content.name !== SYNTHETIC_OUTPUT_TOOL_NAME) {
        let input = content.input, classification = tools ? getToolSearchOrReadInfo(content.name, input, tools) : void 0;
        tracker.recentActivities.push({
          toolName: content.name,
          input,
          activityDescription: resolveActivityDescription?.(content.name, input),
          isSearch: classification?.isSearch,
          isRead: classification?.isRead
        });
      }
    }
  while (tracker.recentActivities.length > MAX_RECENT_ACTIVITIES2)
    tracker.recentActivities.shift();
}
function getProgressUpdate(tracker) {
  return {
    toolUseCount: tracker.toolUseCount,
    tokenCount: getTokenCountFromTracker(tracker),
    lastActivity: tracker.recentActivities.length > 0 ? tracker.recentActivities[tracker.recentActivities.length - 1] : void 0,
    recentActivities: [...tracker.recentActivities]
  };
}
function createActivityDescriptionResolver(tools) {
  return (toolName, input) => {
    return findToolByName(tools, toolName)?.getActivityDescription?.(input) ?? void 0;
  };
}
function isLocalAgentTask(task) {
  return typeof task === "object" && task !== null && "type" in task && task.type === "local_agent";
}
function isPanelAgentTask(t2) {
  return isLocalAgentTask(t2) && t2.agentType !== "main-session";
}
function queuePendingMessage(taskId, msg, setAppState) {
  updateTaskState(taskId, setAppState, (task) => ({
    ...task,
    pendingMessages: [...task.pendingMessages, msg]
  }));
}
function appendMessageToLocalAgent(taskId, message, setAppState) {
  updateTaskState(taskId, setAppState, (task) => ({
    ...task,
    messages: [...task.messages ?? [], message]
  }));
}
function drainPendingMessages(taskId, getAppState, setAppState) {
  let task = getAppState().tasks[taskId];
  if (!isLocalAgentTask(task) || task.pendingMessages.length === 0)
    return [];
  let drained = task.pendingMessages;
  return updateTaskState(taskId, setAppState, (t2) => ({
    ...t2,
    pendingMessages: []
  })), drained;
}
function enqueueAgentNotification({
  taskId,
  description,
  status,
  error: error44,
  setAppState,
  finalMessage,
  usage,
  toolUseId,
  worktreePath,
  worktreeBranch
}) {
  let shouldEnqueue = !1;
  if (updateTaskState(taskId, setAppState, (task) => {
    if (task.notified)
      return task;
    return shouldEnqueue = !0, {
      ...task,
      notified: !0
    };
  }), !shouldEnqueue)
    return;
  abortSpeculation(setAppState);
  let summary = status === "completed" ? `Agent "${description}" completed` : status === "failed" ? `Agent "${description}" failed: ${error44 || "Unknown error"}` : `Agent "${description}" was stopped`, outputPath = getTaskOutputPath(taskId), toolUseIdLine = toolUseId ? `
<${TOOL_USE_ID_TAG}>${toolUseId}</${TOOL_USE_ID_TAG}>` : "", resultSection = finalMessage ? `
<result>${finalMessage}</result>` : "", usageSection = usage ? `
<usage><total_tokens>${usage.totalTokens}</total_tokens><tool_uses>${usage.toolUses}</tool_uses><duration_ms>${usage.durationMs}</duration_ms></usage>` : "", worktreeSection = worktreePath ? `
<${WORKTREE_TAG}><${WORKTREE_PATH_TAG}>${worktreePath}</${WORKTREE_PATH_TAG}>${worktreeBranch ? `<${WORKTREE_BRANCH_TAG}>${worktreeBranch}</${WORKTREE_BRANCH_TAG}>` : ""}</${WORKTREE_TAG}>` : "", message = `<${TASK_NOTIFICATION_TAG}>
<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>${toolUseIdLine}
<${OUTPUT_FILE_TAG}>${outputPath}</${OUTPUT_FILE_TAG}>
<${STATUS_TAG}>${status}</${STATUS_TAG}>
<${SUMMARY_TAG}>${summary}</${SUMMARY_TAG}>${resultSection}${usageSection}${worktreeSection}
</${TASK_NOTIFICATION_TAG}>`;
  enqueuePendingNotification({
    value: message,
    mode: "task-notification"
  });
}
function killAsyncAgent(taskId, setAppState) {
  let killed = !1;
  if (updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running")
      return task;
    return killed = !0, task.abortController?.abort(), task.unregisterCleanup?.(), {
      ...task,
      status: "killed",
      endTime: Date.now(),
      evictAfter: task.retain ? void 0 : Date.now() + PANEL_GRACE_MS,
      abortController: void 0,
      unregisterCleanup: void 0,
      selectedAgent: void 0
    };
  }), killed)
    evictTaskOutput(taskId);
}
function killAllRunningAgentTasks(tasks, setAppState) {
  for (let [taskId, task] of Object.entries(tasks))
    if (task.type === "local_agent" && task.status === "running")
      killAsyncAgent(taskId, setAppState);
}
function markAgentsNotified(taskId, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    if (task.notified)
      return task;
    return {
      ...task,
      notified: !0
    };
  });
}
function updateAgentProgress(taskId, progress, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running")
      return task;
    let existingSummary = task.progress?.summary;
    return {
      ...task,
      progress: existingSummary ? {
        ...progress,
        summary: existingSummary
      } : progress
    };
  });
}
function updateAgentSummary(taskId, summary, setAppState) {
  let captured = null;
  if (updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running")
      return task;
    return captured = {
      tokenCount: task.progress?.tokenCount ?? 0,
      toolUseCount: task.progress?.toolUseCount ?? 0,
      startTime: task.startTime,
      toolUseId: task.toolUseId
    }, {
      ...task,
      progress: {
        ...task.progress,
        toolUseCount: task.progress?.toolUseCount ?? 0,
        tokenCount: task.progress?.tokenCount ?? 0,
        summary
      }
    };
  }), captured && getSdkAgentProgressSummariesEnabled()) {
    let {
      tokenCount,
      toolUseCount,
      startTime,
      toolUseId
    } = captured;
    emitTaskProgress({
      taskId,
      toolUseId,
      description: summary,
      startTime,
      totalTokens: tokenCount,
      toolUses: toolUseCount,
      summary
    });
  }
}
function completeAgentTask(result, setAppState) {
  let taskId = result.agentId;
  updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running")
      return task;
    return task.unregisterCleanup?.(), {
      ...task,
      status: "completed",
      result,
      endTime: Date.now(),
      evictAfter: task.retain ? void 0 : Date.now() + PANEL_GRACE_MS,
      abortController: void 0,
      unregisterCleanup: void 0,
      selectedAgent: void 0
    };
  }), evictTaskOutput(taskId);
}
function failAgentTask(taskId, error44, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running")
      return task;
    return task.unregisterCleanup?.(), {
      ...task,
      status: "failed",
      error: error44,
      endTime: Date.now(),
      evictAfter: task.retain ? void 0 : Date.now() + PANEL_GRACE_MS,
      abortController: void 0,
      unregisterCleanup: void 0,
      selectedAgent: void 0
    };
  }), evictTaskOutput(taskId);
}
function registerAsyncAgent({
  agentId,
  description,
  prompt,
  selectedAgent,
  setAppState,
  parentAbortController,
  toolUseId
}) {
  initTaskOutputAsSymlink(agentId, getAgentTranscriptPath(asAgentId(agentId)));
  let abortController = parentAbortController ? createChildAbortController(parentAbortController) : createAbortController(), taskState = {
    ...createTaskStateBase(agentId, "local_agent", description, toolUseId),
    type: "local_agent",
    status: "running",
    agentId,
    prompt,
    selectedAgent,
    agentType: selectedAgent.agentType ?? "general-purpose",
    abortController,
    retrieved: !1,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: !0,
    pendingMessages: [],
    retain: !1,
    diskLoaded: !1
  }, unregisterCleanup = registerCleanup(async () => {
    killAsyncAgent(agentId, setAppState);
  });
  return taskState.unregisterCleanup = unregisterCleanup, registerTask(taskState, setAppState), taskState;
}
function registerAgentForeground({
  agentId,
  description,
  prompt,
  selectedAgent,
  setAppState,
  autoBackgroundMs,
  toolUseId
}) {
  initTaskOutputAsSymlink(agentId, getAgentTranscriptPath(asAgentId(agentId)));
  let abortController = createAbortController(), unregisterCleanup = registerCleanup(async () => {
    killAsyncAgent(agentId, setAppState);
  }), taskState = {
    ...createTaskStateBase(agentId, "local_agent", description, toolUseId),
    type: "local_agent",
    status: "running",
    agentId,
    prompt,
    selectedAgent,
    agentType: selectedAgent.agentType ?? "general-purpose",
    abortController,
    unregisterCleanup,
    retrieved: !1,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: !1,
    pendingMessages: [],
    retain: !1,
    diskLoaded: !1
  }, resolveBackgroundSignal, backgroundSignal = new Promise((resolve35) => {
    resolveBackgroundSignal = resolve35;
  });
  backgroundSignalResolvers.set(agentId, resolveBackgroundSignal), registerTask(taskState, setAppState);
  let cancelAutoBackground;
  if (autoBackgroundMs !== void 0 && autoBackgroundMs > 0) {
    let timer = setTimeout((setAppState2, agentId2) => {
      setAppState2((prev) => {
        let prevTask = prev.tasks[agentId2];
        if (!isLocalAgentTask(prevTask) || prevTask.isBackgrounded)
          return prev;
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [agentId2]: {
              ...prevTask,
              isBackgrounded: !0
            }
          }
        };
      });
      let resolver = backgroundSignalResolvers.get(agentId2);
      if (resolver)
        resolver(), backgroundSignalResolvers.delete(agentId2);
    }, autoBackgroundMs, setAppState, agentId);
    cancelAutoBackground = () => clearTimeout(timer);
  }
  return {
    taskId: agentId,
    backgroundSignal,
    cancelAutoBackground
  };
}
function backgroundAgentTask(taskId, getAppState, setAppState) {
  let task = getAppState().tasks[taskId];
  if (!isLocalAgentTask(task) || task.isBackgrounded)
    return !1;
  setAppState((prev) => {
    let prevTask = prev.tasks[taskId];
    if (!isLocalAgentTask(prevTask))
      return prev;
    return {
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...prevTask,
          isBackgrounded: !0
        }
      }
    };
  });
  let resolver = backgroundSignalResolvers.get(taskId);
  if (resolver)
    resolver(), backgroundSignalResolvers.delete(taskId);
  return !0;
}
function unregisterAgentForeground(taskId, setAppState) {
  backgroundSignalResolvers.delete(taskId);
  let cleanupFn;
  setAppState((prev) => {
    let task = prev.tasks[taskId];
    if (!isLocalAgentTask(task) || task.isBackgrounded)
      return prev;
    cleanupFn = task.unregisterCleanup;
    let {
      [taskId]: removed,
      ...rest
    } = prev.tasks;
    return {
      ...prev,
      tasks: rest
    };
  }), cleanupFn?.();
}
var MAX_RECENT_ACTIVITIES2 = 5, LocalAgentTask, backgroundSignalResolvers;
var init_LocalAgentTask = __esm(() => {
  init_state();
  init_xml();
  init_speculation();
  init_Task();
  init_Tool();
  init_SyntheticOutputTool();
  init_ids();
  init_abortController();
  init_cleanupRegistry();
  init_collapseReadSearch();
  init_messageQueueManager();
  init_sessionStorage();
  init_diskOutput();
  init_framework();
  init_sdkProgress();
  LocalAgentTask = {
    name: "LocalAgentTask",
    type: "local_agent",
    async kill(taskId, setAppState) {
      killAsyncAgent(taskId, setAppState);
    }
  };
  backgroundSignalResolvers = /* @__PURE__ */ new Map;
});
