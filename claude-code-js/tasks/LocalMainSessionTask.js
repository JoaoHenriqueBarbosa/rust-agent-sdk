// Original: src/tasks/LocalMainSessionTask.ts
import { randomBytes as randomBytes11 } from "crypto";
function generateMainSessionTaskId() {
  let bytes = randomBytes11(8), id = "s";
  for (let i5 = 0;i5 < 8; i5++)
    id += TASK_ID_ALPHABET[bytes[i5] % TASK_ID_ALPHABET.length];
  return id;
}
function registerMainSessionTask(description, setAppState, mainThreadAgentDefinition, existingAbortController) {
  let taskId = generateMainSessionTaskId();
  initTaskOutputAsSymlink(taskId, getAgentTranscriptPath(asAgentId(taskId)));
  let abortController = existingAbortController ?? createAbortController(), unregisterCleanup = registerCleanup(async () => {
    setAppState((prev) => {
      let { [taskId]: removed, ...rest } = prev.tasks;
      return { ...prev, tasks: rest };
    });
  }), selectedAgent = mainThreadAgentDefinition ?? DEFAULT_MAIN_SESSION_AGENT, taskState = {
    ...createTaskStateBase(taskId, "local_agent", description),
    type: "local_agent",
    status: "running",
    agentId: taskId,
    prompt: description,
    selectedAgent,
    agentType: "main-session",
    abortController,
    unregisterCleanup,
    retrieved: !1,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    isBackgrounded: !0,
    pendingMessages: [],
    retain: !1,
    diskLoaded: !1
  };
  return logForDebugging(`[LocalMainSessionTask] Registering task ${taskId} with description: ${description}`), registerTask(taskState, setAppState), setAppState((prev) => {
    let hasTask = taskId in prev.tasks;
    return logForDebugging(`[LocalMainSessionTask] After registration, task ${taskId} exists in state: ${hasTask}`), prev;
  }), { taskId, abortSignal: abortController.signal };
}
function completeMainSessionTask(taskId, success2, setAppState) {
  let wasBackgrounded = !0, toolUseId;
  if (updateTaskState(taskId, setAppState, (task) => {
    if (task.status !== "running")
      return task;
    return wasBackgrounded = task.isBackgrounded ?? !0, toolUseId = task.toolUseId, task.unregisterCleanup?.(), {
      ...task,
      status: success2 ? "completed" : "failed",
      endTime: Date.now(),
      messages: task.messages?.length ? [task.messages.at(-1)] : void 0
    };
  }), evictTaskOutput(taskId), wasBackgrounded)
    enqueueMainSessionNotification(taskId, "Background session", success2 ? "completed" : "failed", setAppState, toolUseId);
  else
    updateTaskState(taskId, setAppState, (task) => ({ ...task, notified: !0 })), emitTaskTerminatedSdk(taskId, success2 ? "completed" : "failed", {
      toolUseId,
      summary: "Background session"
    });
}
function enqueueMainSessionNotification(taskId, description, status, setAppState, toolUseId) {
  let shouldEnqueue = !1;
  if (updateTaskState(taskId, setAppState, (task) => {
    if (task.notified)
      return task;
    return shouldEnqueue = !0, { ...task, notified: !0 };
  }), !shouldEnqueue)
    return;
  let summary = status === "completed" ? `Background session "${description}" completed` : `Background session "${description}" failed`, toolUseIdLine = toolUseId ? `
<${TOOL_USE_ID_TAG}>${toolUseId}</${TOOL_USE_ID_TAG}>` : "", outputPath = getTaskOutputPath(taskId), message = `<${TASK_NOTIFICATION_TAG}>
<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>${toolUseIdLine}
<${OUTPUT_FILE_TAG}>${outputPath}</${OUTPUT_FILE_TAG}>
<${STATUS_TAG}>${status}</${STATUS_TAG}>
<${SUMMARY_TAG}>${summary}</${SUMMARY_TAG}>
</${TASK_NOTIFICATION_TAG}>`;
  enqueuePendingNotification({ value: message, mode: "task-notification" });
}
function isMainSessionTask(task) {
  if (typeof task !== "object" || task === null || !("type" in task) || !("agentType" in task))
    return !1;
  return task.type === "local_agent" && task.agentType === "main-session";
}
function startBackgroundSession({
  messages,
  queryParams,
  description,
  setAppState,
  agentDefinition
}) {
  let { taskId, abortSignal } = registerMainSessionTask(description, setAppState, agentDefinition);
  return recordSidechainTranscript(messages, taskId).catch((err2) => logForDebugging(`bg-session initial transcript write failed: ${err2}`)), runWithAgentContext({
    agentId: taskId,
    agentType: "subagent",
    subagentName: "main-session",
    isBuiltIn: !0
  }, async () => {
    try {
      let bgMessages = [...messages], recentActivities = [], toolCount = 0, tokenCount = 0, lastRecordedUuid = messages.at(-1)?.uuid ?? null;
      for await (let event of query({
        messages: bgMessages,
        ...queryParams
      })) {
        if (abortSignal.aborted) {
          let alreadyNotified = !1;
          if (updateTaskState(taskId, setAppState, (task) => {
            return alreadyNotified = task.notified === !0, alreadyNotified ? task : { ...task, notified: !0 };
          }), !alreadyNotified)
            emitTaskTerminatedSdk(taskId, "stopped", {
              summary: description
            });
          return;
        }
        if (event.type !== "user" && event.type !== "assistant" && event.type !== "system")
          continue;
        if (bgMessages.push(event), recordSidechainTranscript([event], taskId, lastRecordedUuid).catch((err2) => logForDebugging(`bg-session transcript write failed: ${err2}`)), lastRecordedUuid = event.uuid, event.type === "assistant") {
          for (let block2 of event.message.content)
            if (block2.type === "text")
              tokenCount += roughTokenCountEstimation(block2.text);
            else if (block2.type === "tool_use") {
              toolCount++;
              let activity = {
                toolName: block2.name,
                input: block2.input
              };
              if (recentActivities.push(activity), recentActivities.length > MAX_RECENT_ACTIVITIES)
                recentActivities.shift();
            }
        }
        setAppState((prev) => {
          let task = prev.tasks[taskId];
          if (!task || task.type !== "local_agent")
            return prev;
          let prevProgress = task.progress;
          if (prevProgress?.tokenCount === tokenCount && prevProgress.toolUseCount === toolCount && task.messages === bgMessages)
            return prev;
          return {
            ...prev,
            tasks: {
              ...prev.tasks,
              [taskId]: {
                ...task,
                progress: {
                  tokenCount,
                  toolUseCount: toolCount,
                  recentActivities: prevProgress?.toolUseCount === toolCount ? prevProgress.recentActivities : [...recentActivities]
                },
                messages: bgMessages
              }
            }
          };
        });
      }
      completeMainSessionTask(taskId, !0, setAppState);
    } catch (error44) {
      logError2(error44), completeMainSessionTask(taskId, !1, setAppState);
    }
  }), taskId;
}
var DEFAULT_MAIN_SESSION_AGENT, TASK_ID_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", MAX_RECENT_ACTIVITIES = 5;
var init_LocalMainSessionTask = __esm(() => {
  init_xml();
  init_query();
  init_tokenEstimation();
  init_Task();
  init_ids();
  init_abortController();
  init_agentContext();
  init_cleanupRegistry();
  init_debug();
  init_log3();
  init_messageQueueManager();
  init_sdkEventQueue();
  init_sessionStorage();
  init_diskOutput();
  init_framework();
  DEFAULT_MAIN_SESSION_AGENT = {
    agentType: "main-session",
    whenToUse: "Main session query",
    source: "userSettings",
    getSystemPrompt: () => ""
  };
});
