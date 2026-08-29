// Original: src/hooks/toolPermission/handlers/swarmWorkerHandler.ts
async function handleSwarmWorkerPermission(params) {
  if (!isAgentSwarmsEnabled() || !isSwarmWorker())
    return null;
  let { ctx, description, updatedInput, suggestions } = params, classifierResult = null;
  if (classifierResult)
    return classifierResult;
  try {
    let clearPendingRequest = () => ctx.toolUseContext.setAppState((prev) => ({
      ...prev,
      pendingWorkerRequest: null
    }));
    return await new Promise((resolve45) => {
      let { resolve: resolveOnce, claim } = createResolveOnce(resolve45), request2 = createPermissionRequest({
        toolName: ctx.tool.name,
        toolUseId: ctx.toolUseID,
        input: ctx.input,
        description,
        permissionSuggestions: suggestions
      });
      registerPermissionCallback({
        requestId: request2.id,
        toolUseId: ctx.toolUseID,
        async onAllow(allowedInput, permissionUpdates, feedback2, contentBlocks) {
          if (!claim())
            return;
          clearPendingRequest();
          let finalInput = allowedInput && Object.keys(allowedInput).length > 0 ? allowedInput : ctx.input;
          resolveOnce(await ctx.handleUserAllow(finalInput, permissionUpdates, feedback2, void 0, contentBlocks));
        },
        onReject(feedback2, contentBlocks) {
          if (!claim())
            return;
          clearPendingRequest(), ctx.logDecision({
            decision: "reject",
            source: { type: "user_reject", hasFeedback: !!feedback2 }
          }), resolveOnce(ctx.cancelAndAbort(feedback2, void 0, contentBlocks));
        }
      }), sendPermissionRequestViaMailbox(request2), ctx.toolUseContext.setAppState((prev) => ({
        ...prev,
        pendingWorkerRequest: {
          toolName: ctx.tool.name,
          toolUseId: ctx.toolUseID,
          description
        }
      })), ctx.toolUseContext.abortController.signal.addEventListener("abort", () => {
        if (!claim())
          return;
        clearPendingRequest(), ctx.logCancelled(), resolveOnce(ctx.cancelAndAbort(void 0, !0));
      }, { once: !0 });
    });
  } catch (error44) {
    return logError2(toError(error44)), null;
  }
}
var init_swarmWorkerHandler = __esm(() => {
  init_agentSwarmsEnabled();
  init_errors();
  init_log3();
  init_permissionSync();
  init_useSwarmPermissionPoller();
  init_PermissionContext();
});
