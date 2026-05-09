// Original: src/hooks/useCanUseTool.tsx
function useCanUseTool(setToolUseConfirmQueue, setToolPermissionContext) {
  let $3 = import_compiler_runtime336.c(3), t0;
  if ($3[0] !== setToolPermissionContext || $3[1] !== setToolUseConfirmQueue)
    t0 = async (tool, input, toolUseContext, assistantMessage, toolUseID, forceDecision) => new Promise((resolve45) => {
      let ctx = createPermissionContext(tool, input, toolUseContext, assistantMessage, toolUseID, setToolPermissionContext, createPermissionQueueOps(setToolUseConfirmQueue));
      if (ctx.resolveIfAborted(resolve45))
        return;
      return (forceDecision !== void 0 ? Promise.resolve(forceDecision) : hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseID)).then(async (result) => {
        if (result.behavior === "allow") {
          if (ctx.resolveIfAborted(resolve45))
            return;
          ctx.logDecision({
            decision: "accept",
            source: "config"
          }), resolve45(ctx.buildAllow(result.updatedInput ?? input, {
            decisionReason: result.decisionReason
          }));
          return;
        }
        let appState = toolUseContext.getAppState(), description = await tool.description(input, {
          isNonInteractiveSession: toolUseContext.options.isNonInteractiveSession,
          toolPermissionContext: appState.toolPermissionContext,
          tools: toolUseContext.options.tools
        });
        if (ctx.resolveIfAborted(resolve45))
          return;
        switch (result.behavior) {
          case "deny": {
            logPermissionDecision({
              tool,
              input,
              toolUseContext,
              messageId: ctx.messageId,
              toolUseID
            }, {
              decision: "reject",
              source: "config"
            }), resolve45(result);
            return;
          }
          case "ask": {
            if (appState.toolPermissionContext.awaitAutomatedChecksBeforeDialog) {
              let coordinatorDecision = await handleCoordinatorPermission({
                ctx,
                ...{},
                updatedInput: result.updatedInput,
                suggestions: result.suggestions,
                permissionMode: appState.toolPermissionContext.mode
              });
              if (coordinatorDecision) {
                resolve45(coordinatorDecision);
                return;
              }
            }
            if (ctx.resolveIfAborted(resolve45))
              return;
            let swarmDecision = await handleSwarmWorkerPermission({
              ctx,
              description,
              ...{},
              updatedInput: result.updatedInput,
              suggestions: result.suggestions
            });
            if (swarmDecision) {
              resolve45(swarmDecision);
              return;
            }
            handleInteractivePermission({
              ctx,
              description,
              result,
              awaitAutomatedChecksBeforeDialog: appState.toolPermissionContext.awaitAutomatedChecksBeforeDialog,
              bridgeCallbacks: void 0,
              channelCallbacks: appState.channelPermissionCallbacks
            }, resolve45);
            return;
          }
        }
      }).catch((error44) => {
        if (error44 instanceof AbortError || error44 instanceof APIUserAbortError)
          logForDebugging(`Permission check threw ${error44.constructor.name} for tool=${tool.name}: ${error44.message}`), ctx.logCancelled(), resolve45(ctx.cancelAndAbort(void 0, !0));
        else
          logError2(error44), resolve45(ctx.cancelAndAbort(void 0, !0));
      }).finally(() => {
        clearClassifierChecking(toolUseID);
      });
    }), $3[0] = setToolPermissionContext, $3[1] = setToolUseConfirmQueue, $3[2] = t0;
  else
    t0 = $3[2];
  return t0;
}
var import_compiler_runtime336, useCanUseTool_default;
var init_useCanUseTool = __esm(() => {
  init_sdk();
  init_classifierApprovals();
  init_debug();
  init_errors();
  init_log3();
  init_permissions2();
  init_coordinatorHandler();
  init_interactiveHandler();
  init_swarmWorkerHandler();
  init_PermissionContext();
  init_permissionLogging();
  import_compiler_runtime336 = __toESM(require_react_compiler_runtime_development(), 1);
  useCanUseTool_default = useCanUseTool;
});
