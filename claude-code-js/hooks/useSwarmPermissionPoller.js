// Original: src/hooks/useSwarmPermissionPoller.ts
function parsePermissionUpdates(raw) {
  if (!Array.isArray(raw))
    return [];
  let schema5 = permissionUpdateSchema(), valid = [];
  for (let entry of raw) {
    let result = schema5.safeParse(entry);
    if (result.success)
      valid.push(result.data);
    else
      logForDebugging(`[SwarmPermissionPoller] Dropping malformed permissionUpdate entry: ${result.error.message}`, { level: "warn" });
  }
  return valid;
}
function registerPermissionCallback(callback) {
  pendingCallbacks.set(callback.requestId, callback), logForDebugging(`[SwarmPermissionPoller] Registered callback for request ${callback.requestId}`);
}
function unregisterPermissionCallback(requestId) {
  pendingCallbacks.delete(requestId), logForDebugging(`[SwarmPermissionPoller] Unregistered callback for request ${requestId}`);
}
function hasPermissionCallback(requestId) {
  return pendingCallbacks.has(requestId);
}
function clearAllPendingCallbacks() {
  pendingCallbacks.clear(), pendingSandboxCallbacks.clear();
}
function processMailboxPermissionResponse(params) {
  let callback = pendingCallbacks.get(params.requestId);
  if (!callback)
    return logForDebugging(`[SwarmPermissionPoller] No callback registered for mailbox response ${params.requestId}`), !1;
  if (logForDebugging(`[SwarmPermissionPoller] Processing mailbox response for request ${params.requestId}: ${params.decision}`), pendingCallbacks.delete(params.requestId), params.decision === "approved") {
    let permissionUpdates = parsePermissionUpdates(params.permissionUpdates), updatedInput = params.updatedInput;
    callback.onAllow(updatedInput, permissionUpdates);
  } else
    callback.onReject(params.feedback);
  return !0;
}
function registerSandboxPermissionCallback(callback) {
  pendingSandboxCallbacks.set(callback.requestId, callback), logForDebugging(`[SwarmPermissionPoller] Registered sandbox callback for request ${callback.requestId}`);
}
function hasSandboxPermissionCallback(requestId) {
  return pendingSandboxCallbacks.has(requestId);
}
function processSandboxPermissionResponse(params) {
  let callback = pendingSandboxCallbacks.get(params.requestId);
  if (!callback)
    return logForDebugging(`[SwarmPermissionPoller] No sandbox callback registered for request ${params.requestId}`), !1;
  return logForDebugging(`[SwarmPermissionPoller] Processing sandbox response for request ${params.requestId}: allow=${params.allow}`), pendingSandboxCallbacks.delete(params.requestId), callback.resolve(params.allow), !0;
}
var import_react55, pendingCallbacks, pendingSandboxCallbacks;
var init_useSwarmPermissionPoller = __esm(() => {
  init_debug();
  init_errors();
  init_PermissionUpdateSchema();
  init_permissionSync();
  init_teammate();
  import_react55 = __toESM(require_react_development(), 1);
  pendingCallbacks = /* @__PURE__ */ new Map;
  pendingSandboxCallbacks = /* @__PURE__ */ new Map;
});
