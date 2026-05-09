// Shared module state and imports
// Original: src/tools/PowerShellTool/PowerShellTool.tsx
__export(exports_PowerShellTool, {
  detectBlockedSleepPattern: () => detectBlockedSleepPattern,
  PowerShellTool: () => PowerShellTool
});
import { copyFile as copyFile5, stat as fsStat, truncate as fsTruncate, link as link4 } from "fs/promises";
async function* runPowerShellCommand({
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
    run_in_background,
    dangerouslyDisableSandbox
  } = input, timeoutMs = Math.min(timeout || getDefaultTimeoutMs(), getMaxTimeoutMs()), fullOutput = "", lastProgressOutput = "", lastTotalLines = 0, lastTotalBytes = 0, backgroundShellId = void 0, interruptBackgroundingStarted = !1, assistantAutoBackgrounded = !1, resolveProgress = null;
  function createProgressSignal() {
    return new Promise((resolve33) => {
      resolveProgress = () => resolve33(null);
    });
  }
  let shouldAutoBackground = !isBackgroundTasksDisabled && isAutobackgroundingAllowed(command12);
  if (!await getCachedPowerShellPath())
    return {
      stdout: "",
      stderr: "PowerShell is not available on this system.",
      code: 0,
      interrupted: !1
    };
  let shellCommand;
  try {
    shellCommand = await exec4(command12, abortController.signal, "powershell", {
      timeout: timeoutMs,
      onProgress(lastLines, allLines, totalLines, totalBytes, isIncomplete) {
        lastProgressOutput = lastLines, fullOutput = allLines, lastTotalLines = totalLines, lastTotalBytes = isIncomplete ? totalBytes : 0;
      },
      preventCwdChanges,
      shouldUseSandbox: getPlatform() === "windows" ? !1 : shouldUseSandbox({
        command: command12,
        dangerouslyDisableSandbox
      }),
      shouldAutoBackground
    });
  } catch (e) {
    return logError2(e), {
      stdout: "",
      stderr: `Failed to execute PowerShell command: ${errorMessage(e)}`,
      code: 0,
      interrupted: !1
    };
  }
  let resultPromise = shellCommand.result;
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
        throw Error("getAppState not available in runPowerShellCommand context");
      },
      setAppState
    })).taskId;
  }
  function startBackgrounding(eventName, backgroundFn) {
    if (foregroundTaskId) {
      if (!backgroundExistingForegroundTask(foregroundTaskId, shellCommand, description || command12, setAppState, toolUseId))
        return;
      backgroundShellId = foregroundTaskId, logEvent(eventName, {
        command_type: getCommandTypeForLogging(command12)
      }), backgroundFn?.(foregroundTaskId);
      return;
    }
    spawnBackgroundTask().then((shellId) => {
      backgroundShellId = shellId;
      let resolve33 = resolveProgress;
      if (resolve33)
        resolveProgress = null, resolve33();
      if (logEvent(eventName, {
        command_type: getCommandTypeForLogging(command12)
      }), backgroundFn)
        backgroundFn(shellId);
    });
  }
  if (shellCommand.onTimeout && shouldAutoBackground)
    shellCommand.onTimeout((backgroundFn) => {
      startBackgrounding("tengu_powershell_command_timeout_backgrounded", backgroundFn);
    });
  if (run_in_background === !0 && !isBackgroundTasksDisabled) {
    let shellId = await spawnBackgroundTask();
    return logEvent("tengu_powershell_command_explicitly_backgrounded", {
      command_type: getCommandTypeForLogging(command12)
    }), {
      stdout: "",
      stderr: "",
      code: 0,
      interrupted: !1,
      backgroundTaskId: shellId
    };
  }
  TaskOutput.startPolling(shellCommand.taskOutput.taskId);
  let startTime = Date.now(), nextProgressTime = startTime + PROGRESS_THRESHOLD_MS, foregroundTaskId = void 0;
  try {
    while (!0) {
      let now2 = Date.now(), timeUntilNextProgress = Math.max(0, nextProgressTime - now2), progressSignal = createProgressSignal(), result = await Promise.race([resultPromise, new Promise((resolve33) => setTimeout((r4) => r4(null), timeUntilNextProgress, resolve33).unref()), progressSignal]);
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
        return result;
      }
      if (backgroundShellId)
        return {
          stdout: interruptBackgroundingStarted ? fullOutput : "",
          stderr: "",
          code: 0,
          interrupted: !1,
          backgroundTaskId: backgroundShellId,
          assistantAutoBackgrounded
        };
      if (abortController.signal.aborted && abortController.signal.reason === "interrupt" && !interruptBackgroundingStarted) {
        if (interruptBackgroundingStarted = !0, !isBackgroundTasksDisabled) {
          startBackgrounding("tengu_powershell_command_interrupt_backgrounded");
          continue;
        }
        shellCommand.kill();
      }
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
      if (!isBackgroundTasksDisabled && backgroundShellId === void 0 && elapsedSeconds >= PROGRESS_THRESHOLD_MS / 1000 && setToolJSX) {
        if (!foregroundTaskId)
          foregroundTaskId = registerForeground({
            command: command12,
            description: description || command12,
            shellCommand,
            agentId
          }, setAppState, toolUseId);
        setToolJSX({
          jsx: /* @__PURE__ */ jsx_dev_runtime124.jsxDEV(BackgroundHint, {}, void 0, !1, void 0, this),
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
      }, nextProgressTime = Date.now() + PROGRESS_INTERVAL_MS;
    }
  } finally {
    if (TaskOutput.stopPolling(shellCommand.taskOutput.taskId), !backgroundShellId && shellCommand.status !== "backgrounded") {
      if (foregroundTaskId)
        unregisterForeground(foregroundTaskId, setAppState);
      shellCommand.cleanup();
    }
  }
}
var jsx_dev_runtime124, EOL4 = `
`, PS_SEARCH_COMMANDS, PS_READ_COMMANDS, PS_SEMANTIC_NEUTRAL_COMMANDS, PROGRESS_THRESHOLD_MS = 2000, PROGRESS_INTERVAL_MS = 1000, ASSISTANT_BLOCKING_BUDGET_MS = 15000, DISALLOWED_AUTO_BACKGROUND_COMMANDS, WINDOWS_SANDBOX_POLICY_REFUSAL = "Enterprise policy requires sandboxing, but sandboxing is not available on native Windows. Shell command execution is blocked on this platform by policy.", isBackgroundTasksDisabled, fullInputSchema, inputSchema11, outputSchema8, COMMON_BACKGROUND_COMMANDS, PowerShellTool;

