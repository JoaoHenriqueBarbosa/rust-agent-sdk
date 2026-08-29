// Original: src/services/mcp/elicitationHandler.ts
function getElicitationMode(params) {
  return params.mode === "url" ? "url" : "form";
}
function findElicitationInQueue(queue2, serverName, elicitationId) {
  return queue2.findIndex((e) => e.serverName === serverName && e.params.mode === "url" && ("elicitationId" in e.params) && e.params.elicitationId === elicitationId);
}
function registerElicitationHandler(client15, serverName, setAppState) {
  try {
    client15.setRequestHandler(ElicitRequestSchema, async (request2, extra) => {
      logMCPDebug(serverName, `Received elicitation request: ${jsonStringify(request2)}`);
      let mode = getElicitationMode(request2.params);
      logEvent("tengu_mcp_elicitation_shown", {
        mode
      });
      try {
        let hookResponse = await runElicitationHooks(serverName, request2.params, extra.signal);
        if (hookResponse)
          return logMCPDebug(serverName, `Elicitation resolved by hook: ${jsonStringify(hookResponse)}`), logEvent("tengu_mcp_elicitation_response", {
            mode,
            action: hookResponse.action
          }), hookResponse;
        let elicitationId = mode === "url" && "elicitationId" in request2.params ? request2.params.elicitationId : void 0, rawResult = await new Promise((resolve25) => {
          let onAbort = () => {
            resolve25({ action: "cancel" });
          };
          if (extra.signal.aborted) {
            onAbort();
            return;
          }
          let waitingState = elicitationId ? { actionLabel: "Skip confirmation" } : void 0;
          setAppState((prev) => ({
            ...prev,
            elicitation: {
              queue: [
                ...prev.elicitation.queue,
                {
                  serverName,
                  requestId: extra.requestId,
                  params: request2.params,
                  signal: extra.signal,
                  waitingState,
                  respond: (result2) => {
                    extra.signal.removeEventListener("abort", onAbort), logEvent("tengu_mcp_elicitation_response", {
                      mode,
                      action: result2.action
                    }), resolve25(result2);
                  }
                }
              ]
            }
          })), extra.signal.addEventListener("abort", onAbort, { once: !0 });
        });
        return logMCPDebug(serverName, `Elicitation response: ${jsonStringify(rawResult)}`), await runElicitationResultHooks(serverName, rawResult, extra.signal, mode, elicitationId);
      } catch (error44) {
        return logMCPError(serverName, `Elicitation error: ${error44}`), { action: "cancel" };
      }
    }), client15.setNotificationHandler(ElicitationCompleteNotificationSchema, (notification) => {
      let { elicitationId } = notification.params;
      logMCPDebug(serverName, `Received elicitation completion notification: ${elicitationId}`), executeNotificationHooks({
        message: `MCP server "${serverName}" confirmed elicitation ${elicitationId} complete`,
        notificationType: "elicitation_complete"
      });
      let found = !1;
      if (setAppState((prev) => {
        let idx = findElicitationInQueue(prev.elicitation.queue, serverName, elicitationId);
        if (idx === -1)
          return prev;
        found = !0;
        let queue2 = [...prev.elicitation.queue];
        return queue2[idx] = { ...queue2[idx], completed: !0 }, { ...prev, elicitation: { queue: queue2 } };
      }), !found)
        logMCPDebug(serverName, `Ignoring completion notification for unknown elicitation: ${elicitationId}`);
    });
  } catch {
    return;
  }
}
async function runElicitationHooks(serverName, params, signal) {
  try {
    let mode = params.mode === "url" ? "url" : "form", url3 = "url" in params ? params.url : void 0, elicitationId = "elicitationId" in params ? params.elicitationId : void 0, { elicitationResponse, blockingError } = await executeElicitationHooks({
      serverName,
      message: params.message,
      requestedSchema: "requestedSchema" in params ? params.requestedSchema : void 0,
      signal,
      mode,
      url: url3,
      elicitationId
    });
    if (blockingError)
      return { action: "decline" };
    if (elicitationResponse)
      return {
        action: elicitationResponse.action,
        content: elicitationResponse.content
      };
    return;
  } catch (error44) {
    logMCPError(serverName, `Elicitation hook error: ${error44}`);
    return;
  }
}
async function runElicitationResultHooks(serverName, result, signal, mode, elicitationId) {
  try {
    let { elicitationResultResponse, blockingError } = await executeElicitationResultHooks({
      serverName,
      action: result.action,
      content: result.content,
      signal,
      mode,
      elicitationId
    });
    if (blockingError)
      return executeNotificationHooks({
        message: `Elicitation response for server "${serverName}": decline`,
        notificationType: "elicitation_response"
      }), { action: "decline" };
    let finalResult = elicitationResultResponse ? {
      action: elicitationResultResponse.action,
      content: elicitationResultResponse.content ?? result.content
    } : result;
    return executeNotificationHooks({
      message: `Elicitation response for server "${serverName}": ${finalResult.action}`,
      notificationType: "elicitation_response"
    }), finalResult;
  } catch (error44) {
    return logMCPError(serverName, `ElicitationResult hook error: ${error44}`), executeNotificationHooks({
      message: `Elicitation response for server "${serverName}": ${result.action}`,
      notificationType: "elicitation_response"
    }), result;
  }
}
var init_elicitationHandler = __esm(() => {
  init_types();
  init_hooks5();
  init_log3();
  init_slowOperations();
});
