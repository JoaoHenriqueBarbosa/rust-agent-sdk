// Original: src/tasks/RemoteAgentTask/RemoteAgentTask.tsx
function isRemoteTaskType(v2) {
  return REMOTE_TASK_TYPES.includes(v2 ?? "");
}
async function persistRemoteAgentMetadata(meta) {
  try {
    await writeRemoteAgentMetadata(meta.taskId, meta);
  } catch (e) {
    logForDebugging(`persistRemoteAgentMetadata failed: ${String(e)}`);
  }
}
async function removeRemoteAgentMetadata(taskId) {
  try {
    await deleteRemoteAgentMetadata(taskId);
  } catch (e) {
    logForDebugging(`removeRemoteAgentMetadata failed: ${String(e)}`);
  }
}
async function checkRemoteAgentEligibility({
  skipBundle = !1
} = {}) {
  let errors8 = await checkBackgroundRemoteSessionEligibility({
    skipBundle
  });
  if (errors8.length > 0)
    return {
      eligible: !1,
      errors: errors8
    };
  return {
    eligible: !0
  };
}
function formatPreconditionError(error44) {
  switch (error44.type) {
    case "not_logged_in":
      return "Please run /login and sign in with your Claude.ai account (not Console).";
    case "no_remote_environment":
      return "No cloud environment available. Set one up at https://claude.ai/code/onboarding?magic=env-setup";
    case "not_in_git_repo":
      return "Background tasks require a git repository. Initialize git or run from a git repository.";
    case "no_git_remote":
      return "Background tasks require a GitHub remote. Add one with `git remote add origin REPO_URL`.";
    case "github_app_not_installed":
      return `The Claude GitHub app must be installed on this repository first.
https://github.com/apps/claude/installations/new`;
    case "policy_blocked":
      return "Remote sessions are disabled by your organization's policy. Contact your organization admin to enable them.";
  }
}
function enqueueRemoteNotification(taskId, title, status, setAppState, toolUseId) {
  if (!markTaskNotified(taskId, setAppState))
    return;
  let statusText = status === "completed" ? "completed successfully" : status === "failed" ? "failed" : "was stopped", toolUseIdLine = toolUseId ? `
<${TOOL_USE_ID_TAG}>${toolUseId}</${TOOL_USE_ID_TAG}>` : "", outputPath = getTaskOutputPath(taskId), message = `<${TASK_NOTIFICATION_TAG}>
<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>${toolUseIdLine}
<${TASK_TYPE_TAG}>remote_agent</${TASK_TYPE_TAG}>
<${OUTPUT_FILE_TAG}>${outputPath}</${OUTPUT_FILE_TAG}>
<${STATUS_TAG}>${status}</${STATUS_TAG}>
<${SUMMARY_TAG}>Remote task "${title}" ${statusText}</${SUMMARY_TAG}>
</${TASK_NOTIFICATION_TAG}>`;
  enqueuePendingNotification({
    value: message,
    mode: "task-notification"
  });
}
function markTaskNotified(taskId, setAppState) {
  let shouldEnqueue = !1;
  return updateTaskState(taskId, setAppState, (task) => {
    if (task.notified)
      return task;
    return shouldEnqueue = !0, {
      ...task,
      notified: !0
    };
  }), shouldEnqueue;
}
function extractReviewFromLog(log3) {
  for (let i5 = log3.length - 1;i5 >= 0; i5--) {
    let msg = log3[i5];
    if (msg?.type === "system" && (msg.subtype === "hook_progress" || msg.subtype === "hook_response")) {
      let tagged = extractTag(msg.stdout, REMOTE_REVIEW_TAG);
      if (tagged?.trim())
        return tagged.trim();
    }
  }
  for (let i5 = log3.length - 1;i5 >= 0; i5--) {
    let msg = log3[i5];
    if (msg?.type !== "assistant")
      continue;
    let fullText = extractTextContent(msg.message.content, `
`), tagged = extractTag(fullText, REMOTE_REVIEW_TAG);
    if (tagged?.trim())
      return tagged.trim();
  }
  let hookStdout = log3.filter((msg) => msg.type === "system" && (msg.subtype === "hook_progress" || msg.subtype === "hook_response")).map((msg) => msg.stdout).join(""), hookTagged = extractTag(hookStdout, REMOTE_REVIEW_TAG);
  if (hookTagged?.trim())
    return hookTagged.trim();
  return log3.filter((msg) => msg.type === "assistant").map((msg) => extractTextContent(msg.message.content, `
`)).join(`
`).trim() || null;
}
function extractReviewTagFromLog(log3) {
  for (let i5 = log3.length - 1;i5 >= 0; i5--) {
    let msg = log3[i5];
    if (msg?.type === "system" && (msg.subtype === "hook_progress" || msg.subtype === "hook_response")) {
      let tagged = extractTag(msg.stdout, REMOTE_REVIEW_TAG);
      if (tagged?.trim())
        return tagged.trim();
    }
  }
  for (let i5 = log3.length - 1;i5 >= 0; i5--) {
    let msg = log3[i5];
    if (msg?.type !== "assistant")
      continue;
    let fullText = extractTextContent(msg.message.content, `
`), tagged = extractTag(fullText, REMOTE_REVIEW_TAG);
    if (tagged?.trim())
      return tagged.trim();
  }
  let hookStdout = log3.filter((msg) => msg.type === "system" && (msg.subtype === "hook_progress" || msg.subtype === "hook_response")).map((msg) => msg.stdout).join(""), hookTagged = extractTag(hookStdout, REMOTE_REVIEW_TAG);
  if (hookTagged?.trim())
    return hookTagged.trim();
  return null;
}
function enqueueRemoteReviewNotification(taskId, reviewContent, setAppState) {
  if (!markTaskNotified(taskId, setAppState))
    return;
  let message = `<${TASK_NOTIFICATION_TAG}>
<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>
<${TASK_TYPE_TAG}>remote_agent</${TASK_TYPE_TAG}>
<${STATUS_TAG}>completed</${STATUS_TAG}>
<${SUMMARY_TAG}>Remote review completed</${SUMMARY_TAG}>
</${TASK_NOTIFICATION_TAG}>
The remote review produced the following findings:

${reviewContent}`;
  enqueuePendingNotification({
    value: message,
    mode: "task-notification"
  });
}
function enqueueRemoteReviewFailureNotification(taskId, reason, setAppState) {
  if (!markTaskNotified(taskId, setAppState))
    return;
  let message = `<${TASK_NOTIFICATION_TAG}>
<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>
<${TASK_TYPE_TAG}>remote_agent</${TASK_TYPE_TAG}>
<${STATUS_TAG}>failed</${STATUS_TAG}>
<${SUMMARY_TAG}>Remote review failed: ${reason}</${SUMMARY_TAG}>
</${TASK_NOTIFICATION_TAG}>
Remote review did not produce output (${reason}). Tell the user to retry /ultrareview, or use /review for a local review instead.`;
  enqueuePendingNotification({
    value: message,
    mode: "task-notification"
  });
}
function extractTodoListFromLog(log3) {
  let todoListMessage = log3.findLast((msg) => msg.type === "assistant" && msg.message.content.some((block2) => block2.type === "tool_use" && block2.name === TodoWriteTool.name));
  if (!todoListMessage)
    return [];
  let input = todoListMessage.message.content.find((block2) => block2.type === "tool_use" && block2.name === TodoWriteTool.name)?.input;
  if (!input)
    return [];
  let parsedInput = TodoWriteTool.inputSchema.safeParse(input);
  if (!parsedInput.success)
    return [];
  return parsedInput.data.todos;
}
function registerRemoteAgentTask(options2) {
  let {
    remoteTaskType,
    session,
    command: command12,
    context: context6,
    toolUseId,
    isRemoteReview,
    isUltraplan,
    isLongRunning,
    remoteTaskMetadata
  } = options2, taskId = generateTaskId("remote_agent");
  initTaskOutput(taskId);
  let taskState = {
    ...createTaskStateBase(taskId, "remote_agent", session.title, toolUseId),
    type: "remote_agent",
    remoteTaskType,
    status: "running",
    sessionId: session.id,
    command: command12,
    title: session.title,
    todoList: [],
    log: [],
    isRemoteReview,
    isUltraplan,
    isLongRunning,
    pollStartedAt: Date.now(),
    remoteTaskMetadata
  };
  registerTask(taskState, context6.setAppState), persistRemoteAgentMetadata({
    taskId,
    remoteTaskType,
    sessionId: session.id,
    title: session.title,
    command: command12,
    spawnedAt: Date.now(),
    toolUseId,
    isUltraplan,
    isRemoteReview,
    isLongRunning,
    remoteTaskMetadata
  });
  let stopPolling = startRemoteSessionPolling(taskId, context6);
  return {
    taskId,
    sessionId: session.id,
    cleanup: stopPolling
  };
}
async function restoreRemoteAgentTasks(context6) {
  try {
    await restoreRemoteAgentTasksImpl(context6);
  } catch (e) {
    logForDebugging(`restoreRemoteAgentTasks failed: ${String(e)}`);
  }
}
async function restoreRemoteAgentTasksImpl(context6) {
  let persisted = await listRemoteAgentMetadata();
  if (persisted.length === 0)
    return;
  for (let meta of persisted) {
    let remoteStatus;
    try {
      remoteStatus = (await fetchSession(meta.sessionId)).session_status;
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("Session not found:"))
        logForDebugging(`restoreRemoteAgentTasks: dropping ${meta.taskId} (404: ${String(e)})`), removeRemoteAgentMetadata(meta.taskId);
      else
        logForDebugging(`restoreRemoteAgentTasks: skipping ${meta.taskId} (recoverable: ${String(e)})`);
      continue;
    }
    if (remoteStatus === "archived") {
      removeRemoteAgentMetadata(meta.taskId);
      continue;
    }
    let taskState = {
      ...createTaskStateBase(meta.taskId, "remote_agent", meta.title, meta.toolUseId),
      type: "remote_agent",
      remoteTaskType: isRemoteTaskType(meta.remoteTaskType) ? meta.remoteTaskType : "remote-agent",
      status: "running",
      sessionId: meta.sessionId,
      command: meta.command,
      title: meta.title,
      todoList: [],
      log: [],
      isRemoteReview: meta.isRemoteReview,
      isUltraplan: meta.isUltraplan,
      isLongRunning: meta.isLongRunning,
      startTime: meta.spawnedAt,
      pollStartedAt: Date.now(),
      remoteTaskMetadata: meta.remoteTaskMetadata
    };
    registerTask(taskState, context6.setAppState), initTaskOutput(meta.taskId), startRemoteSessionPolling(meta.taskId, context6);
  }
}
function startRemoteSessionPolling(taskId, context6) {
  let isRunning = !0, POLL_INTERVAL_MS = 1000, REMOTE_REVIEW_TIMEOUT_MS = 1800000, STABLE_IDLE_POLLS = 5, consecutiveIdlePolls = 0, lastEventId = null, accumulatedLog = [], cachedReviewContent = null, poll = async () => {
    if (!isRunning)
      return;
    try {
      let task = context6.getAppState().tasks?.[taskId];
      if (!task || task.status !== "running")
        return;
      let response7 = await pollRemoteSessionEvents(task.sessionId, lastEventId);
      lastEventId = response7.lastEventId;
      let logGrew = response7.newEvents.length > 0;
      if (logGrew) {
        accumulatedLog = [...accumulatedLog, ...response7.newEvents];
        let deltaText = response7.newEvents.map((msg) => {
          if (msg.type === "assistant")
            return msg.message.content.filter((block2) => block2.type === "text").map((block2) => ("text" in block2) ? block2.text : "").join(`
`);
          return jsonStringify(msg);
        }).join(`
`);
        if (deltaText)
          appendTaskOutput(taskId, deltaText + `
`);
      }
      if (response7.sessionStatus === "archived") {
        updateTaskState(taskId, context6.setAppState, (t2) => t2.status === "running" ? {
          ...t2,
          status: "completed",
          endTime: Date.now()
        } : t2), enqueueRemoteNotification(taskId, task.title, "completed", context6.setAppState, task.toolUseId), evictTaskOutput(taskId), removeRemoteAgentMetadata(taskId);
        return;
      }
      let checker = completionCheckers.get(task.remoteTaskType);
      if (checker) {
        let completionResult = await checker(task.remoteTaskMetadata);
        if (completionResult !== null) {
          updateTaskState(taskId, context6.setAppState, (t2) => t2.status === "running" ? {
            ...t2,
            status: "completed",
            endTime: Date.now()
          } : t2), enqueueRemoteNotification(taskId, completionResult, "completed", context6.setAppState, task.toolUseId), evictTaskOutput(taskId), removeRemoteAgentMetadata(taskId);
          return;
        }
      }
      let result = task.isUltraplan || task.isLongRunning ? void 0 : accumulatedLog.findLast((msg) => msg.type === "result");
      if (task.isRemoteReview && logGrew && cachedReviewContent === null)
        cachedReviewContent = extractReviewTagFromLog(response7.newEvents);
      let newProgress;
      if (task.isRemoteReview && logGrew) {
        let open9 = `<${REMOTE_REVIEW_PROGRESS_TAG}>`, close = `</${REMOTE_REVIEW_PROGRESS_TAG}>`;
        for (let ev of response7.newEvents)
          if (ev.type === "system" && (ev.subtype === "hook_progress" || ev.subtype === "hook_response")) {
            let s2 = ev.stdout, closeAt = s2.lastIndexOf(close), openAt = closeAt === -1 ? -1 : s2.lastIndexOf(open9, closeAt);
            if (openAt !== -1 && closeAt > openAt)
              try {
                let p4 = JSON.parse(s2.slice(openAt + open9.length, closeAt));
                newProgress = {
                  stage: p4.stage,
                  bugsFound: p4.bugs_found ?? 0,
                  bugsVerified: p4.bugs_verified ?? 0,
                  bugsRefuted: p4.bugs_refuted ?? 0
                };
              } catch {}
          }
      }
      let hasAnyOutput = accumulatedLog.some((msg) => msg.type === "assistant" || task.isRemoteReview && msg.type === "system" && (msg.subtype === "hook_progress" || msg.subtype === "hook_response"));
      if (response7.sessionStatus === "idle" && !logGrew && hasAnyOutput)
        consecutiveIdlePolls++;
      else
        consecutiveIdlePolls = 0;
      let stableIdle = consecutiveIdlePolls >= STABLE_IDLE_POLLS, hasSessionStartHook = accumulatedLog.some((m4) => m4.type === "system" && (m4.subtype === "hook_started" || m4.subtype === "hook_progress" || m4.subtype === "hook_response") && m4.hook_event === "SessionStart"), hasAssistantEvents = accumulatedLog.some((m4) => m4.type === "assistant"), sessionDone = task.isRemoteReview && (cachedReviewContent !== null || !hasSessionStartHook && stableIdle && hasAssistantEvents), reviewTimedOut = task.isRemoteReview && Date.now() - task.pollStartedAt > REMOTE_REVIEW_TIMEOUT_MS, newStatus = result ? result.subtype === "success" ? "completed" : "failed" : sessionDone || reviewTimedOut ? "completed" : accumulatedLog.length > 0 ? "running" : "starting", raceTerminated = !1;
      if (updateTaskState(taskId, context6.setAppState, (prevTask) => {
        if (prevTask.status !== "running")
          return raceTerminated = !0, prevTask;
        if (!logGrew && (newStatus === "running" || newStatus === "starting"))
          return prevTask;
        return {
          ...prevTask,
          status: newStatus === "starting" ? "running" : newStatus,
          log: accumulatedLog,
          todoList: logGrew ? extractTodoListFromLog(accumulatedLog) : prevTask.todoList,
          reviewProgress: newProgress ?? prevTask.reviewProgress,
          endTime: result || sessionDone || reviewTimedOut ? Date.now() : void 0
        };
      }), raceTerminated)
        return;
      if (result || sessionDone || reviewTimedOut) {
        let finalStatus = result && result.subtype !== "success" ? "failed" : "completed";
        if (task.isRemoteReview) {
          let reviewContent = cachedReviewContent ?? extractReviewFromLog(accumulatedLog);
          if (reviewContent && finalStatus === "completed") {
            enqueueRemoteReviewNotification(taskId, reviewContent, context6.setAppState), evictTaskOutput(taskId), removeRemoteAgentMetadata(taskId);
            return;
          }
          updateTaskState(taskId, context6.setAppState, (t2) => ({
            ...t2,
            status: "failed"
          }));
          let reason = result && result.subtype !== "success" ? "remote session returned an error" : reviewTimedOut && !sessionDone ? "remote session exceeded 30 minutes" : "no review output \u2014 orchestrator may have exited early";
          enqueueRemoteReviewFailureNotification(taskId, reason, context6.setAppState), evictTaskOutput(taskId), removeRemoteAgentMetadata(taskId);
          return;
        }
        enqueueRemoteNotification(taskId, task.title, finalStatus, context6.setAppState, task.toolUseId), evictTaskOutput(taskId), removeRemoteAgentMetadata(taskId);
        return;
      }
    } catch (error44) {
      logError2(error44), consecutiveIdlePolls = 0;
      try {
        let task = context6.getAppState().tasks?.[taskId];
        if (task?.isRemoteReview && task.status === "running" && Date.now() - task.pollStartedAt > REMOTE_REVIEW_TIMEOUT_MS) {
          updateTaskState(taskId, context6.setAppState, (t2) => ({
            ...t2,
            status: "failed",
            endTime: Date.now()
          })), enqueueRemoteReviewFailureNotification(taskId, "remote session exceeded 30 minutes", context6.setAppState), evictTaskOutput(taskId), removeRemoteAgentMetadata(taskId);
          return;
        }
      } catch {}
    }
    if (isRunning)
      setTimeout(poll, POLL_INTERVAL_MS);
  };
  return poll(), () => {
    isRunning = !1;
  };
}
function getRemoteTaskSessionUrl(sessionId) {
  return getRemoteSessionUrl(sessionId, process.env.SESSION_INGRESS_URL);
}
var REMOTE_TASK_TYPES, completionCheckers, RemoteAgentTask;
var init_RemoteAgentTask = __esm(() => {
  init_xml();
  init_Task();
  init_TodoWriteTool();
  init_remoteSession();
  init_debug();
  init_log3();
  init_messageQueueManager();
  init_messages3();
  init_sdkEventQueue();
  init_sessionStorage();
  init_slowOperations();
  init_diskOutput();
  init_framework();
  init_api2();
  init_teleport();
  REMOTE_TASK_TYPES = ["remote-agent", "ultraplan", "ultrareview", "autofix-pr", "background-pr"];
  completionCheckers = /* @__PURE__ */ new Map;
  RemoteAgentTask = {
    name: "RemoteAgentTask",
    type: "remote_agent",
    async kill(taskId, setAppState) {
      let toolUseId, description, sessionId, killed = !1;
      if (updateTaskState(taskId, setAppState, (task) => {
        if (task.status !== "running")
          return task;
        return toolUseId = task.toolUseId, description = task.description, sessionId = task.sessionId, killed = !0, {
          ...task,
          status: "killed",
          notified: !0,
          endTime: Date.now()
        };
      }), killed) {
        if (emitTaskTerminatedSdk(taskId, "stopped", {
          toolUseId,
          summary: description
        }), sessionId)
          archiveRemoteSession(sessionId).catch((e) => logForDebugging(`RemoteAgentTask archive failed: ${String(e)}`));
      }
      evictTaskOutput(taskId), removeRemoteAgentMetadata(taskId), logForDebugging(`RemoteAgentTask ${taskId} killed, archiving session ${sessionId ?? "unknown"}`);
    }
  };
});
