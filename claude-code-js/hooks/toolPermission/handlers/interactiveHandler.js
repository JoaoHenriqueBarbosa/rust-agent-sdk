// Original: src/hooks/toolPermission/handlers/interactiveHandler.ts
import { randomUUID as randomUUID37 } from "crypto";
function handleInteractivePermission(params, resolve45) {
  let {
    ctx,
    description,
    result,
    awaitAutomatedChecksBeforeDialog,
    bridgeCallbacks,
    channelCallbacks
  } = params, { resolve: resolveOnce, isResolved, claim } = createResolveOnce(resolve45), userInteracted = !1, checkmarkTransitionTimer, checkmarkAbortHandler, bridgeRequestId = bridgeCallbacks ? randomUUID37() : void 0, channelUnsubscribe, permissionPromptStartTimeMs = Date.now(), displayInput = result.updatedInput ?? ctx.input;
  function clearClassifierIndicator() {}
  if (ctx.pushToQueue({
    assistantMessage: ctx.assistantMessage,
    tool: ctx.tool,
    description,
    input: displayInput,
    toolUseContext: ctx.toolUseContext,
    toolUseID: ctx.toolUseID,
    permissionResult: result,
    permissionPromptStartTimeMs,
    onUserInteraction() {
      if (Date.now() - permissionPromptStartTimeMs < 200)
        return;
      userInteracted = !0, clearClassifierChecking(ctx.toolUseID), clearClassifierIndicator();
    },
    onDismissCheckmark() {
      if (checkmarkTransitionTimer) {
        if (clearTimeout(checkmarkTransitionTimer), checkmarkTransitionTimer = void 0, checkmarkAbortHandler)
          ctx.toolUseContext.abortController.signal.removeEventListener("abort", checkmarkAbortHandler), checkmarkAbortHandler = void 0;
        ctx.removeFromQueue();
      }
    },
    onAbort() {
      if (!claim())
        return;
      if (bridgeCallbacks && bridgeRequestId)
        bridgeCallbacks.sendResponse(bridgeRequestId, {
          behavior: "deny",
          message: "User aborted"
        }), bridgeCallbacks.cancelRequest(bridgeRequestId);
      channelUnsubscribe?.(), ctx.logCancelled(), ctx.logDecision({ decision: "reject", source: { type: "user_abort" } }, { permissionPromptStartTimeMs }), resolveOnce(ctx.cancelAndAbort(void 0, !0));
    },
    async onAllow(updatedInput, permissionUpdates, feedback2, contentBlocks) {
      if (!claim())
        return;
      if (bridgeCallbacks && bridgeRequestId)
        bridgeCallbacks.sendResponse(bridgeRequestId, {
          behavior: "allow",
          updatedInput,
          updatedPermissions: permissionUpdates
        }), bridgeCallbacks.cancelRequest(bridgeRequestId);
      channelUnsubscribe?.(), resolveOnce(await ctx.handleUserAllow(updatedInput, permissionUpdates, feedback2, permissionPromptStartTimeMs, contentBlocks, result.decisionReason));
    },
    onReject(feedback2, contentBlocks) {
      if (!claim())
        return;
      if (bridgeCallbacks && bridgeRequestId)
        bridgeCallbacks.sendResponse(bridgeRequestId, {
          behavior: "deny",
          message: feedback2 ?? "User denied permission"
        }), bridgeCallbacks.cancelRequest(bridgeRequestId);
      channelUnsubscribe?.(), ctx.logDecision({
        decision: "reject",
        source: { type: "user_reject", hasFeedback: !!feedback2 }
      }, { permissionPromptStartTimeMs }), resolveOnce(ctx.cancelAndAbort(feedback2, void 0, contentBlocks));
    },
    async recheckPermission() {
      if (isResolved())
        return;
      let freshResult = await hasPermissionsToUseTool(ctx.tool, ctx.input, ctx.toolUseContext, ctx.assistantMessage, ctx.toolUseID);
      if (freshResult.behavior === "allow") {
        if (!claim())
          return;
        if (bridgeCallbacks && bridgeRequestId)
          bridgeCallbacks.cancelRequest(bridgeRequestId);
        channelUnsubscribe?.(), ctx.removeFromQueue(), ctx.logDecision({ decision: "accept", source: "config" }), resolveOnce(ctx.buildAllow(freshResult.updatedInput ?? ctx.input));
      }
    }
  }), bridgeCallbacks && bridgeRequestId) {
    bridgeCallbacks.sendRequest(bridgeRequestId, ctx.tool.name, displayInput, ctx.toolUseID, description, result.suggestions, result.blockedPath);
    let signal = ctx.toolUseContext.abortController.signal, unsubscribe2 = bridgeCallbacks.onResponse(bridgeRequestId, (response7) => {
      if (!claim())
        return;
      if (signal.removeEventListener("abort", unsubscribe2), clearClassifierChecking(ctx.toolUseID), clearClassifierIndicator(), ctx.removeFromQueue(), channelUnsubscribe?.(), response7.behavior === "allow") {
        if (response7.updatedPermissions?.length)
          ctx.persistPermissions(response7.updatedPermissions);
        ctx.logDecision({
          decision: "accept",
          source: {
            type: "user",
            permanent: !!response7.updatedPermissions?.length
          }
        }, { permissionPromptStartTimeMs }), resolveOnce(ctx.buildAllow(response7.updatedInput ?? displayInput));
      } else
        ctx.logDecision({
          decision: "reject",
          source: {
            type: "user_reject",
            hasFeedback: !!response7.message
          }
        }, { permissionPromptStartTimeMs }), resolveOnce(ctx.cancelAndAbort(response7.message));
    });
    signal.addEventListener("abort", unsubscribe2, { once: !0 });
  }
  if (channelCallbacks && !ctx.tool.requiresUserInteraction?.()) {
    let channelRequestId = shortRequestId(ctx.toolUseID), allowedChannels = getAllowedChannels(), channelClients = filterPermissionRelayClients(ctx.toolUseContext.getAppState().mcp.clients, (name3) => findChannelEntry(name3, allowedChannels) !== void 0);
    if (channelClients.length > 0) {
      let params2 = {
        request_id: channelRequestId,
        tool_name: ctx.tool.name,
        description,
        input_preview: truncateForPreview(displayInput)
      };
      for (let client16 of channelClients) {
        if (client16.type !== "connected")
          continue;
        client16.client.notification({
          method: CHANNEL_PERMISSION_REQUEST_METHOD,
          params: params2
        }).catch((e) => {
          logForDebugging(`Channel permission_request failed for ${client16.name}: ${errorMessage(e)}`, { level: "error" });
        });
      }
      let channelSignal = ctx.toolUseContext.abortController.signal, mapUnsub = channelCallbacks.onResponse(channelRequestId, (response7) => {
        if (!claim())
          return;
        if (channelUnsubscribe?.(), clearClassifierChecking(ctx.toolUseID), clearClassifierIndicator(), ctx.removeFromQueue(), bridgeCallbacks && bridgeRequestId)
          bridgeCallbacks.cancelRequest(bridgeRequestId);
        if (response7.behavior === "allow")
          ctx.logDecision({
            decision: "accept",
            source: { type: "user", permanent: !1 }
          }, { permissionPromptStartTimeMs }), resolveOnce(ctx.buildAllow(displayInput));
        else
          ctx.logDecision({
            decision: "reject",
            source: { type: "user_reject", hasFeedback: !1 }
          }, { permissionPromptStartTimeMs }), resolveOnce(ctx.cancelAndAbort(`Denied via channel ${response7.fromServer}`));
      });
      channelUnsubscribe = () => {
        mapUnsub(), channelSignal.removeEventListener("abort", channelUnsubscribe);
      }, channelSignal.addEventListener("abort", channelUnsubscribe, {
        once: !0
      });
    }
  }
  if (!awaitAutomatedChecksBeforeDialog)
    (async () => {
      if (isResolved())
        return;
      let currentAppState = ctx.toolUseContext.getAppState(), hookDecision = await ctx.runHooks(currentAppState.toolPermissionContext.mode, result.suggestions, result.updatedInput, permissionPromptStartTimeMs);
      if (!hookDecision || !claim())
        return;
      if (bridgeCallbacks && bridgeRequestId)
        bridgeCallbacks.cancelRequest(bridgeRequestId);
      channelUnsubscribe?.(), ctx.removeFromQueue(), resolveOnce(hookDecision);
    })();
}
var init_interactiveHandler = __esm(() => {
  init_debug();
  init_state();
  init_channelNotification();
  init_channelPermissions();
  init_classifierApprovals();
  init_errors();
  init_permissions2();
  init_PermissionContext();
});
