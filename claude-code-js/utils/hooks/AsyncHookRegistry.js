// Original: src/utils/hooks/AsyncHookRegistry.ts
function registerPendingAsyncHook({
  processId,
  hookId,
  asyncResponse,
  hookName,
  hookEvent,
  command: command12,
  shellCommand,
  toolName,
  pluginId
}) {
  let timeout = asyncResponse.asyncTimeout || 15000;
  logForDebugging(`Hooks: Registering async hook ${processId} (${hookName}) with timeout ${timeout}ms`);
  let stopProgressInterval = startHookProgressInterval({
    hookId,
    hookName,
    hookEvent,
    getOutput: async () => {
      let taskOutput = pendingHooks.get(processId)?.shellCommand?.taskOutput;
      if (!taskOutput)
        return { stdout: "", stderr: "", output: "" };
      let stdout = await taskOutput.getStdout(), stderr = taskOutput.getStderr();
      return { stdout, stderr, output: stdout + stderr };
    }
  });
  pendingHooks.set(processId, {
    processId,
    hookId,
    hookName,
    hookEvent,
    toolName,
    pluginId,
    command: command12,
    startTime: Date.now(),
    timeout,
    responseAttachmentSent: !1,
    shellCommand,
    stopProgressInterval
  });
}
async function finalizeHook(hook, exitCode, outcome) {
  hook.stopProgressInterval();
  let taskOutput = hook.shellCommand?.taskOutput, stdout = taskOutput ? await taskOutput.getStdout() : "", stderr = taskOutput?.getStderr() ?? "";
  hook.shellCommand?.cleanup(), emitHookResponse({
    hookId: hook.hookId,
    hookName: hook.hookName,
    hookEvent: hook.hookEvent,
    output: stdout + stderr,
    stdout,
    stderr,
    exitCode,
    outcome
  });
}
async function checkForAsyncHookResponses() {
  let responses = [], pendingCount = pendingHooks.size;
  logForDebugging(`Hooks: Found ${pendingCount} total hooks in registry`);
  let hooks = Array.from(pendingHooks.values()), settled = await Promise.allSettled(hooks.map(async (hook) => {
    let stdout = await hook.shellCommand?.taskOutput.getStdout() ?? "", stderr = hook.shellCommand?.taskOutput.getStderr() ?? "";
    if (logForDebugging(`Hooks: Checking hook ${hook.processId} (${hook.hookName}) - attachmentSent: ${hook.responseAttachmentSent}, stdout length: ${stdout.length}`), !hook.shellCommand)
      return logForDebugging(`Hooks: Hook ${hook.processId} has no shell command, removing from registry`), hook.stopProgressInterval(), { type: "remove", processId: hook.processId };
    if (logForDebugging(`Hooks: Hook shell status ${hook.shellCommand.status}`), hook.shellCommand.status === "killed")
      return logForDebugging(`Hooks: Hook ${hook.processId} is ${hook.shellCommand.status}, removing from registry`), hook.stopProgressInterval(), hook.shellCommand.cleanup(), { type: "remove", processId: hook.processId };
    if (hook.shellCommand.status !== "completed")
      return { type: "skip" };
    if (hook.responseAttachmentSent || !stdout.trim())
      return logForDebugging(`Hooks: Skipping hook ${hook.processId} - already delivered/sent or no stdout`), hook.stopProgressInterval(), { type: "remove", processId: hook.processId };
    let lines2 = stdout.split(`
`);
    logForDebugging(`Hooks: Processing ${lines2.length} lines of stdout for ${hook.processId}`);
    let exitCode = (await hook.shellCommand.result).code, response7 = {};
    for (let line of lines2)
      if (line.trim().startsWith("{")) {
        logForDebugging(`Hooks: Found JSON line: ${line.trim().substring(0, 100)}...`);
        try {
          let parsed = jsonParse(line.trim());
          if (!("async" in parsed)) {
            logForDebugging(`Hooks: Found sync response from ${hook.processId}: ${jsonStringify(parsed)}`), response7 = parsed;
            break;
          }
        } catch {
          logForDebugging(`Hooks: Failed to parse JSON from ${hook.processId}: ${line.trim()}`);
        }
      }
    return hook.responseAttachmentSent = !0, await finalizeHook(hook, exitCode, exitCode === 0 ? "success" : "error"), {
      type: "response",
      processId: hook.processId,
      isSessionStart: hook.hookEvent === "SessionStart",
      payload: {
        processId: hook.processId,
        response: response7,
        hookName: hook.hookName,
        hookEvent: hook.hookEvent,
        toolName: hook.toolName,
        pluginId: hook.pluginId,
        stdout,
        stderr,
        exitCode
      }
    };
  })), sessionStartCompleted = !1;
  for (let s2 of settled) {
    if (s2.status !== "fulfilled") {
      logForDebugging(`Hooks: checkForAsyncHookResponses callback rejected: ${s2.reason}`, { level: "error" });
      continue;
    }
    let r4 = s2.value;
    if (r4.type === "remove")
      pendingHooks.delete(r4.processId);
    else if (r4.type === "response") {
      if (responses.push(r4.payload), pendingHooks.delete(r4.processId), r4.isSessionStart)
        sessionStartCompleted = !0;
    }
  }
  if (sessionStartCompleted)
    logForDebugging("Invalidating session env cache after SessionStart hook completed"), invalidateSessionEnvCache();
  return logForDebugging(`Hooks: checkForNewResponses returning ${responses.length} responses`), responses;
}
function removeDeliveredAsyncHooks(processIds) {
  for (let processId of processIds) {
    let hook = pendingHooks.get(processId);
    if (hook && hook.responseAttachmentSent)
      logForDebugging(`Hooks: Removing delivered hook ${processId}`), hook.stopProgressInterval(), pendingHooks.delete(processId);
  }
}
async function finalizePendingAsyncHooks() {
  let hooks = Array.from(pendingHooks.values());
  await Promise.all(hooks.map(async (hook) => {
    if (hook.shellCommand?.status === "completed") {
      let result = await hook.shellCommand.result;
      await finalizeHook(hook, result.code, result.code === 0 ? "success" : "error");
    } else {
      if (hook.shellCommand && hook.shellCommand.status !== "killed")
        hook.shellCommand.kill();
      await finalizeHook(hook, 1, "cancelled");
    }
  })), pendingHooks.clear();
}
var pendingHooks;
var init_AsyncHookRegistry = __esm(() => {
  init_debug();
  init_sessionEnvironment();
  init_slowOperations();
  init_hookEvents();
  pendingHooks = /* @__PURE__ */ new Map;
});
