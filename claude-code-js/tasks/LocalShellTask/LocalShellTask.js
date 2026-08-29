// Original: src/tasks/LocalShellTask/LocalShellTask.tsx
import { stat as stat28 } from "fs/promises";
function looksLikePrompt(tail) {
  let lastLine2 = tail.trimEnd().split(`
`).pop() ?? "";
  return PROMPT_PATTERNS.some((p4) => p4.test(lastLine2));
}
function startStallWatchdog(taskId, description, kind, toolUseId, agentId) {
  if (kind === "monitor")
    return () => {};
  let outputPath = getTaskOutputPath(taskId), lastSize = 0, lastGrowth = Date.now(), cancelled = !1, timer = setInterval(() => {
    stat28(outputPath).then((s2) => {
      if (s2.size > lastSize) {
        lastSize = s2.size, lastGrowth = Date.now();
        return;
      }
      if (Date.now() - lastGrowth < STALL_THRESHOLD_MS)
        return;
      tailFile(outputPath, STALL_TAIL_BYTES).then(({
        content
      }) => {
        if (cancelled)
          return;
        if (!looksLikePrompt(content)) {
          lastGrowth = Date.now();
          return;
        }
        cancelled = !0, clearInterval(timer);
        let toolUseIdLine = toolUseId ? `
<${TOOL_USE_ID_TAG}>${toolUseId}</${TOOL_USE_ID_TAG}>` : "", summary = `${BACKGROUND_BASH_SUMMARY_PREFIX}"${description}" appears to be waiting for interactive input`, message = `<${TASK_NOTIFICATION_TAG}>
<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>${toolUseIdLine}
<${OUTPUT_FILE_TAG}>${outputPath}</${OUTPUT_FILE_TAG}>
<${SUMMARY_TAG}>${escapeXml(summary)}</${SUMMARY_TAG}>
</${TASK_NOTIFICATION_TAG}>
Last output:
${content.trimEnd()}

The command is likely blocked on an interactive prompt. Kill this task and re-run with piped input (e.g., \`echo y | command\`) or a non-interactive flag if one exists.`;
        enqueuePendingNotification({
          value: message,
          mode: "task-notification",
          priority: "next",
          agentId
        });
      }, () => {});
    }, () => {});
  }, STALL_CHECK_INTERVAL_MS);
  return timer.unref(), () => {
    cancelled = !0, clearInterval(timer);
  };
}
function enqueueShellNotification(taskId, description, status, exitCode, setAppState, toolUseId, kind = "bash", agentId) {
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
  let summary;
  switch (status) {
    case "completed":
      summary = `${BACKGROUND_BASH_SUMMARY_PREFIX}"${description}" completed${exitCode !== void 0 ? ` (exit code ${exitCode})` : ""}`;
      break;
    case "failed":
      summary = `${BACKGROUND_BASH_SUMMARY_PREFIX}"${description}" failed${exitCode !== void 0 ? ` with exit code ${exitCode}` : ""}`;
      break;
    case "killed":
      summary = `${BACKGROUND_BASH_SUMMARY_PREFIX}"${description}" was stopped`;
      break;
  }
  let outputPath = getTaskOutputPath(taskId), toolUseIdLine = toolUseId ? `
<${TOOL_USE_ID_TAG}>${toolUseId}</${TOOL_USE_ID_TAG}>` : "", message = `<${TASK_NOTIFICATION_TAG}>
<${TASK_ID_TAG}>${taskId}</${TASK_ID_TAG}>${toolUseIdLine}
<${OUTPUT_FILE_TAG}>${outputPath}</${OUTPUT_FILE_TAG}>
<${STATUS_TAG}>${status}</${STATUS_TAG}>
<${SUMMARY_TAG}>${escapeXml(summary)}</${SUMMARY_TAG}>
</${TASK_NOTIFICATION_TAG}>`;
  enqueuePendingNotification({
    value: message,
    mode: "task-notification",
    priority: "later",
    agentId
  });
}
async function spawnShellTask(input, context6) {
  let {
    command: command12,
    description,
    shellCommand,
    toolUseId,
    agentId,
    kind
  } = input, {
    setAppState
  } = context6, {
    taskOutput
  } = shellCommand, taskId = taskOutput.taskId, unregisterCleanup = registerCleanup(async () => {
    killTask(taskId, setAppState);
  }), taskState = {
    ...createTaskStateBase(taskId, "local_bash", description, toolUseId),
    type: "local_bash",
    status: "running",
    command: command12,
    completionStatusSentInAttachment: !1,
    shellCommand,
    unregisterCleanup,
    lastReportedTotalLines: 0,
    isBackgrounded: !0,
    agentId,
    kind
  };
  registerTask(taskState, setAppState), shellCommand.background(taskId);
  let cancelStallWatchdog = startStallWatchdog(taskId, description, kind, toolUseId, agentId);
  return shellCommand.result.then(async (result) => {
    cancelStallWatchdog(), await flushAndCleanup(shellCommand);
    let wasKilled = !1;
    updateTaskState(taskId, setAppState, (task) => {
      if (task.status === "killed")
        return wasKilled = !0, task;
      return {
        ...task,
        status: result.code === 0 ? "completed" : "failed",
        result: {
          code: result.code,
          interrupted: result.interrupted
        },
        shellCommand: null,
        unregisterCleanup: void 0,
        endTime: Date.now()
      };
    }), enqueueShellNotification(taskId, description, wasKilled ? "killed" : result.code === 0 ? "completed" : "failed", result.code, setAppState, toolUseId, kind, agentId), evictTaskOutput(taskId);
  }), {
    taskId,
    cleanup: () => {
      unregisterCleanup();
    }
  };
}
function registerForeground(input, setAppState, toolUseId) {
  let {
    command: command12,
    description,
    shellCommand,
    agentId
  } = input, taskId = shellCommand.taskOutput.taskId, unregisterCleanup = registerCleanup(async () => {
    killTask(taskId, setAppState);
  }), taskState = {
    ...createTaskStateBase(taskId, "local_bash", description, toolUseId),
    type: "local_bash",
    status: "running",
    command: command12,
    completionStatusSentInAttachment: !1,
    shellCommand,
    unregisterCleanup,
    lastReportedTotalLines: 0,
    isBackgrounded: !1,
    agentId
  };
  return registerTask(taskState, setAppState), taskId;
}
function backgroundTask(taskId, getAppState, setAppState) {
  let task = getAppState().tasks[taskId];
  if (!isLocalShellTask(task) || task.isBackgrounded || !task.shellCommand)
    return !1;
  let { shellCommand, description } = task, {
    toolUseId,
    kind,
    agentId
  } = task;
  if (!shellCommand.background(taskId))
    return !1;
  setAppState((prev) => {
    let prevTask = prev.tasks[taskId];
    if (!isLocalShellTask(prevTask) || prevTask.isBackgrounded)
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
  let cancelStallWatchdog = startStallWatchdog(taskId, description, kind, toolUseId, agentId);
  return shellCommand.result.then(async (result) => {
    cancelStallWatchdog(), await flushAndCleanup(shellCommand);
    let wasKilled = !1, cleanupFn;
    if (updateTaskState(taskId, setAppState, (t2) => {
      if (t2.status === "killed")
        return wasKilled = !0, t2;
      return cleanupFn = t2.unregisterCleanup, {
        ...t2,
        status: result.code === 0 ? "completed" : "failed",
        result: {
          code: result.code,
          interrupted: result.interrupted
        },
        shellCommand: null,
        unregisterCleanup: void 0,
        endTime: Date.now()
      };
    }), cleanupFn?.(), wasKilled)
      enqueueShellNotification(taskId, description, "killed", result.code, setAppState, toolUseId, kind, agentId);
    else {
      let finalStatus = result.code === 0 ? "completed" : "failed";
      enqueueShellNotification(taskId, description, finalStatus, result.code, setAppState, toolUseId, kind, agentId);
    }
    evictTaskOutput(taskId);
  }), !0;
}
function hasForegroundTasks(state3) {
  return Object.values(state3.tasks).some((task) => {
    if (isLocalShellTask(task) && !task.isBackgrounded && task.shellCommand)
      return !0;
    if (isLocalAgentTask(task) && !task.isBackgrounded && !isMainSessionTask(task))
      return !0;
    return !1;
  });
}
function backgroundAll(getAppState, setAppState) {
  let state3 = getAppState(), foregroundBashTaskIds = Object.keys(state3.tasks).filter((id) => {
    let task = state3.tasks[id];
    return isLocalShellTask(task) && !task.isBackgrounded && task.shellCommand;
  });
  for (let taskId of foregroundBashTaskIds)
    backgroundTask(taskId, getAppState, setAppState);
  let foregroundAgentTaskIds = Object.keys(state3.tasks).filter((id) => {
    let task = state3.tasks[id];
    return isLocalAgentTask(task) && !task.isBackgrounded;
  });
  for (let taskId of foregroundAgentTaskIds)
    backgroundAgentTask(taskId, getAppState, setAppState);
}
function backgroundExistingForegroundTask(taskId, shellCommand, description, setAppState, toolUseId) {
  if (!shellCommand.background(taskId))
    return !1;
  let agentId;
  setAppState((prev) => {
    let prevTask = prev.tasks[taskId];
    if (!isLocalShellTask(prevTask) || prevTask.isBackgrounded)
      return prev;
    return agentId = prevTask.agentId, {
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
  let cancelStallWatchdog = startStallWatchdog(taskId, description, void 0, toolUseId, agentId);
  return shellCommand.result.then(async (result) => {
    cancelStallWatchdog(), await flushAndCleanup(shellCommand);
    let wasKilled = !1, cleanupFn;
    updateTaskState(taskId, setAppState, (t2) => {
      if (t2.status === "killed")
        return wasKilled = !0, t2;
      return cleanupFn = t2.unregisterCleanup, {
        ...t2,
        status: result.code === 0 ? "completed" : "failed",
        result: {
          code: result.code,
          interrupted: result.interrupted
        },
        shellCommand: null,
        unregisterCleanup: void 0,
        endTime: Date.now()
      };
    }), cleanupFn?.();
    let finalStatus = wasKilled ? "killed" : result.code === 0 ? "completed" : "failed";
    enqueueShellNotification(taskId, description, finalStatus, result.code, setAppState, toolUseId, void 0, agentId), evictTaskOutput(taskId);
  }), !0;
}
function markTaskNotified2(taskId, setAppState) {
  updateTaskState(taskId, setAppState, (t2) => t2.notified ? t2 : {
    ...t2,
    notified: !0
  });
}
function unregisterForeground(taskId, setAppState) {
  let cleanupFn;
  setAppState((prev) => {
    let task = prev.tasks[taskId];
    if (!isLocalShellTask(task) || task.isBackgrounded)
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
async function flushAndCleanup(shellCommand) {
  try {
    await shellCommand.taskOutput.flush(), shellCommand.cleanup();
  } catch (error44) {
    logError2(error44);
  }
}
var BACKGROUND_BASH_SUMMARY_PREFIX = "Background command ", STALL_CHECK_INTERVAL_MS = 5000, STALL_THRESHOLD_MS = 45000, STALL_TAIL_BYTES = 1024, PROMPT_PATTERNS, LocalShellTask;
var init_LocalShellTask = __esm(() => {
  init_xml();
  init_speculation();
  init_Task();
  init_cleanupRegistry();
  init_fsOperations();
  init_log3();
  init_messageQueueManager();
  init_diskOutput();
  init_framework();
  init_LocalAgentTask();
  init_LocalMainSessionTask();
  init_killShellTasks();
  PROMPT_PATTERNS = [
    /\(y\/n\)/i,
    /\[y\/n\]/i,
    /\(yes\/no\)/i,
    /\b(?:Do you|Would you|Shall I|Are you sure|Ready to)\b.*\? *$/i,
    /Press (any key|Enter)/i,
    /Continue\?/i,
    /Overwrite\?/i
  ];
  LocalShellTask = {
    name: "LocalShellTask",
    type: "local_bash",
    async kill(taskId, setAppState) {
      killTask(taskId, setAppState);
    }
  };
});
