// function: executeInBackground
function executeInBackground({
  processId,
  hookId,
  shellCommand,
  asyncResponse,
  hookEvent,
  hookName,
  command: command19,
  asyncRewake,
  pluginId
}) {
  if (asyncRewake)
    return shellCommand.result.then(async (result) => {
      await new Promise((resolve45) => setImmediate(resolve45));
      let stdout = await shellCommand.taskOutput.getStdout(), stderr = shellCommand.taskOutput.getStderr();
      if (shellCommand.cleanup(), emitHookResponse({
        hookId,
        hookName,
        hookEvent,
        output: stdout + stderr,
        stdout,
        stderr,
        exitCode: result.code,
        outcome: result.code === 0 ? "success" : "error"
      }), result.code === 2)
        enqueuePendingNotification({
          value: wrapInSystemReminder(`Stop hook blocking error from command "${hookName}": ${stderr || stdout}`),
          mode: "task-notification"
        });
    }), !0;
  if (!shellCommand.background(processId))
    return !1;
  return registerPendingAsyncHook({
    processId,
    hookId,
    asyncResponse,
    hookEvent,
    hookName,
    command: command19,
    shellCommand,
    pluginId
  }), !0;
}
