// Shared module state and imports
// Original: src/tools/BashTool/BashTool.tsx
import { copyFile as copyFile6, stat as fsStat2, truncate as fsTruncate2, link as link5 } from "fs/promises";
async function* runShellCommand({
  input,
  abortController,
  setAppState,
  setToolJSX,
  preventCwdChanges,
  isMainThread,
  toolUseId,
  agentId
}) {
  let {
    command: command12,
    description,
    timeout,
    run_in_background
  } = input, timeoutMs = timeout || getDefaultTimeoutMs2(), fullOutput = "", lastProgressOutput = "", lastTotalLines = 0, lastTotalBytes = 0, backgroundShellId = void 0, assistantAutoBackgrounded = !1, resolveProgress = null;
  function createProgressSignal() {
    return new Promise((resolve35) => {
      resolveProgress = () => resolve35(null);
    });
  }
  let shouldAutoBackground = !isBackgroundTasksDisabled3 && isAutobackgroundingAllowed2(command12), shellCommand = await exec4(command12, abortController.signal, "bash", {
    timeout: timeoutMs,
    onProgress(lastLines, allLines, totalLines, totalBytes, isIncomplete) {
      lastProgressOutput = lastLines, fullOutput = allLines, lastTotalLines = totalLines, lastTotalBytes = isIncomplete ? totalBytes : 0;
      let resolve35 = resolveProgress;
      if (resolve35)
        resolveProgress = null, resolve35();
    },
    preventCwdChanges,
    shouldUseSandbox: shouldUseSandbox(input),
    shouldAutoBackground
  }), resultPromise = shellCommand.result;
  async function spawnBackgroundTask() {
    return (await spawnShellTask({
      command: command12,
      description: description || command12,
      shellCommand,
      toolUseId,
      agentId
    }, {
      abortController,
      getAppState: () => {
        throw Error("getAppState not available in runShellCommand context");
      },
      setAppState
    })).taskId;
  }
  function startBackgrounding(eventName, backgroundFn) {
    if (foregroundTaskId) {
      if (!backgroundExistingForegroundTask(foregroundTaskId, shellCommand, description || command12, setAppState, toolUseId))
        return;
      backgroundShellId = foregroundTaskId, logEvent(eventName, {
        command_type: getCommandTypeForLogging2(command12)
      }), backgroundFn?.(foregroundTaskId);
      return;
    }
    spawnBackgroundTask().then((shellId) => {
      backgroundShellId = shellId;
      let resolve35 = resolveProgress;
      if (resolve35)
        resolveProgress = null, resolve35();
      if (logEvent(eventName, {
        command_type: getCommandTypeForLogging2(command12)
      }), backgroundFn)
        backgroundFn(shellId);
    });
  }
  if (shellCommand.onTimeout && shouldAutoBackground)
    shellCommand.onTimeout((backgroundFn) => {
      startBackgrounding("tengu_bash_command_timeout_backgrounded", backgroundFn);
    });
  if (run_in_background === !0 && !isBackgroundTasksDisabled3) {
    let shellId = await spawnBackgroundTask();
    return logEvent("tengu_bash_command_explicitly_backgrounded", {
      command_type: getCommandTypeForLogging2(command12)
    }), {
      stdout: "",
      stderr: "",
      code: 0,
      interrupted: !1,
      backgroundTaskId: shellId
    };
  }
  let startTime = Date.now(), foregroundTaskId = void 0;
  {
    let initialResult = await Promise.race([resultPromise, new Promise((resolve35) => {
      setTimeout((r4) => r4(null), PROGRESS_THRESHOLD_MS3, resolve35).unref();
    })]);
    if (initialResult !== null)
      return shellCommand.cleanup(), initialResult;
    if (backgroundShellId)
      return {
        stdout: "",
        stderr: "",
        code: 0,
        interrupted: !1,
        backgroundTaskId: backgroundShellId,
        assistantAutoBackgrounded
      };
  }
  TaskOutput.startPolling(shellCommand.taskOutput.taskId);
  try {
    while (!0) {
      let progressSignal = createProgressSignal(), result = await Promise.race([resultPromise, progressSignal]);
      if (result !== null) {
        if (result.backgroundTaskId !== void 0) {
          markTaskNotified2(result.backgroundTaskId, setAppState);
          let fixedResult = {
            ...result,
            backgroundTaskId: void 0
          }, {
            taskOutput
          } = shellCommand;
          if (taskOutput.stdoutToFile && !taskOutput.outputFileRedundant)
            fixedResult.outputFilePath = taskOutput.path, fixedResult.outputFileSize = taskOutput.outputFileSize, fixedResult.outputTaskId = taskOutput.taskId;
          return shellCommand.cleanup(), fixedResult;
        }
        if (foregroundTaskId)
          unregisterForeground(foregroundTaskId, setAppState);
        return shellCommand.cleanup(), result;
      }
      if (backgroundShellId)
        return {
          stdout: "",
          stderr: "",
          code: 0,
          interrupted: !1,
          backgroundTaskId: backgroundShellId,
          assistantAutoBackgrounded
        };
      if (foregroundTaskId) {
        if (shellCommand.status === "backgrounded")
          return {
            stdout: "",
            stderr: "",
            code: 0,
            interrupted: !1,
            backgroundTaskId: foregroundTaskId,
            backgroundedByUser: !0
          };
      }
      let elapsed = Date.now() - startTime, elapsedSeconds = Math.floor(elapsed / 1000);
      if (!isBackgroundTasksDisabled3 && backgroundShellId === void 0 && elapsedSeconds >= PROGRESS_THRESHOLD_MS3 / 1000 && setToolJSX) {
        if (!foregroundTaskId)
          foregroundTaskId = registerForeground({
            command: command12,
            description: description || command12,
            shellCommand,
            agentId
          }, setAppState, toolUseId);
        setToolJSX({
          jsx: /* @__PURE__ */ jsx_dev_runtime153.jsxDEV(BackgroundHint, {}, void 0, !1, void 0, this),
          shouldHidePromptInput: !1,
          shouldContinueAnimation: !0,
          showSpinner: !0
        });
      }
      yield {
        type: "progress",
        fullOutput,
        output: lastProgressOutput,
        elapsedTimeSeconds: elapsedSeconds,
        totalLines: lastTotalLines,
        totalBytes: lastTotalBytes,
        taskId: shellCommand.taskOutput.taskId,
        ...timeout ? {
          timeoutMs
        } : void 0
      };
    }
  } finally {
    TaskOutput.stopPolling(shellCommand.taskOutput.taskId);
  }
}
var jsx_dev_runtime153, EOL6 = `
`, PROGRESS_THRESHOLD_MS3 = 2000, ASSISTANT_BLOCKING_BUDGET_MS2 = 15000, BASH_SEARCH_COMMANDS, BASH_READ_COMMANDS, BASH_LIST_COMMANDS, BASH_SEMANTIC_NEUTRAL_COMMANDS, BASH_SILENT_COMMANDS, DISALLOWED_AUTO_BACKGROUND_COMMANDS2, isBackgroundTasksDisabled3, fullInputSchema3, inputSchema39, COMMON_BACKGROUND_COMMANDS2, outputSchema31, BashTool;

