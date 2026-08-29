// function: handleSetPermissionMode
function handleSetPermissionMode(request2, requestId, toolPermissionContext, output) {
  if (request2.mode === "bypassPermissions") {
    if (isBypassPermissionsModeDisabled())
      return output.enqueue({
        type: "control_response",
        response: {
          subtype: "error",
          request_id: requestId,
          error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
        }
      }), toolPermissionContext;
    if (!toolPermissionContext.isBypassPermissionsModeAvailable)
      return output.enqueue({
        type: "control_response",
        response: {
          subtype: "error",
          request_id: requestId,
          error: "Cannot set permission mode to bypassPermissions because the session was not launched with --dangerously-skip-permissions"
        }
      }), toolPermissionContext;
  }
  return output.enqueue({
    type: "control_response",
    response: {
      subtype: "success",
      request_id: requestId,
      response: {
        mode: request2.mode
      }
    }
  }), {
    ...transitionPermissionMode(toolPermissionContext.mode, request2.mode, toolPermissionContext),
    mode: request2.mode
  };
}
