// Original: src/utils/hooks/hookEvents.ts
function registerHookEventHandler(handler4) {
  if (eventHandler = handler4, handler4 && pendingEvents.length > 0)
    for (let event of pendingEvents.splice(0))
      handler4(event);
}
function emit(event) {
  if (eventHandler)
    eventHandler(event);
  else if (pendingEvents.push(event), pendingEvents.length > MAX_PENDING_EVENTS)
    pendingEvents.shift();
}
function shouldEmit(hookEvent) {
  if (ALWAYS_EMITTED_HOOK_EVENTS.includes(hookEvent))
    return !0;
  return allHookEventsEnabled && HOOK_EVENTS.includes(hookEvent);
}
function emitHookStarted(hookId, hookName, hookEvent) {
  if (!shouldEmit(hookEvent))
    return;
  emit({
    type: "started",
    hookId,
    hookName,
    hookEvent
  });
}
function emitHookProgress(data) {
  if (!shouldEmit(data.hookEvent))
    return;
  emit({
    type: "progress",
    ...data
  });
}
function startHookProgressInterval(params) {
  if (!shouldEmit(params.hookEvent))
    return () => {};
  let lastEmittedOutput = "", interval = setInterval(() => {
    params.getOutput().then(({ stdout, stderr, output }) => {
      if (output === lastEmittedOutput)
        return;
      lastEmittedOutput = output, emitHookProgress({
        hookId: params.hookId,
        hookName: params.hookName,
        hookEvent: params.hookEvent,
        stdout,
        stderr,
        output
      });
    });
  }, params.intervalMs ?? 1000);
  return interval.unref(), () => clearInterval(interval);
}
function emitHookResponse(data) {
  let outputToLog = data.stdout || data.stderr || data.output;
  if (outputToLog)
    logForDebugging(`Hook ${data.hookName} (${data.hookEvent}) ${data.outcome}:
${outputToLog}`);
  if (!shouldEmit(data.hookEvent))
    return;
  emit({
    type: "response",
    ...data
  });
}
function setAllHookEventsEnabled(enabled2) {
  allHookEventsEnabled = enabled2;
}
var ALWAYS_EMITTED_HOOK_EVENTS, MAX_PENDING_EVENTS = 100, pendingEvents, eventHandler = null, allHookEventsEnabled = !1;
var init_hookEvents = __esm(() => {
  init_coreTypes();
  init_debug();
  ALWAYS_EMITTED_HOOK_EVENTS = ["SessionStart", "Setup"], pendingEvents = [];
});
