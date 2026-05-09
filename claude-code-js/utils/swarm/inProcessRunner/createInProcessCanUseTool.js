// function: createInProcessCanUseTool
function createInProcessCanUseTool(identity17, abortController, onPermissionWaitMs) {
  return async (tool, input, toolUseContext, assistantMessage, toolUseID, forceDecision) => {
    let result = forceDecision ?? await hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseID);
    if (result.behavior !== "ask")
      return result;
    if (abortController.signal.aborted)
      return { behavior: "ask", message: SUBAGENT_REJECT_MESSAGE };
    let appState = toolUseContext.getAppState(), description = await tool.description(input, {
      isNonInteractiveSession: toolUseContext.options.isNonInteractiveSession,
      toolPermissionContext: appState.toolPermissionContext,
      tools: toolUseContext.options.tools
    });
    if (abortController.signal.aborted)
      return { behavior: "ask", message: SUBAGENT_REJECT_MESSAGE };
    let setToolUseConfirmQueue = getLeaderToolUseConfirmQueue();
    if (setToolUseConfirmQueue)
      return new Promise((resolve27) => {
        let decisionMade = !1, permissionStartMs = Date.now(), reportPermissionWait = () => {
          onPermissionWaitMs?.(Date.now() - permissionStartMs);
        }, onAbortListener = () => {
          if (decisionMade)
            return;
          decisionMade = !0, reportPermissionWait(), resolve27({ behavior: "ask", message: SUBAGENT_REJECT_MESSAGE }), setToolUseConfirmQueue((queue2) => queue2.filter((item) => item.toolUseID !== toolUseID));
        };
        abortController.signal.addEventListener("abort", onAbortListener, {
          once: !0
        }), setToolUseConfirmQueue((queue2) => [
          ...queue2,
          {
            assistantMessage,
            tool,
            description,
            input,
            toolUseContext,
            toolUseID,
            permissionResult: result,
            permissionPromptStartTimeMs: permissionStartMs,
            workerBadge: identity17.color ? { name: identity17.agentName, color: identity17.color } : void 0,
            onUserInteraction() {},
            onAbort() {
              if (decisionMade)
                return;
              decisionMade = !0, abortController.signal.removeEventListener("abort", onAbortListener), reportPermissionWait(), resolve27({ behavior: "ask", message: SUBAGENT_REJECT_MESSAGE });
            },
            async onAllow(updatedInput, permissionUpdates, feedback, contentBlocks) {
              if (decisionMade)
                return;
              if (decisionMade = !0, abortController.signal.removeEventListener("abort", onAbortListener), reportPermissionWait(), persistPermissionUpdates(permissionUpdates), permissionUpdates.length > 0) {
                let setToolPermissionContext = getLeaderSetToolPermissionContext();
                if (setToolPermissionContext) {
                  let currentAppState = toolUseContext.getAppState(), updatedContext = applyPermissionUpdates(currentAppState.toolPermissionContext, permissionUpdates);
                  setToolPermissionContext(updatedContext, {
                    preserveMode: !0
                  });
                }
              }
              let trimmedFeedback = feedback?.trim();
              resolve27({
                behavior: "allow",
                updatedInput,
                userModified: !1,
                acceptFeedback: trimmedFeedback || void 0,
                ...contentBlocks && contentBlocks.length > 0 && { contentBlocks }
              });
            },
            onReject(feedback, contentBlocks) {
              if (decisionMade)
                return;
              decisionMade = !0, abortController.signal.removeEventListener("abort", onAbortListener), reportPermissionWait();
              let message = feedback ? `${SUBAGENT_REJECT_MESSAGE_WITH_REASON_PREFIX}${feedback}` : SUBAGENT_REJECT_MESSAGE;
              resolve27({ behavior: "ask", message, contentBlocks });
            },
            async recheckPermission() {
              if (decisionMade)
                return;
              let freshResult = await hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseID);
              if (freshResult.behavior === "allow")
                decisionMade = !0, abortController.signal.removeEventListener("abort", onAbortListener), reportPermissionWait(), setToolUseConfirmQueue((queue3) => queue3.filter((item) => item.toolUseID !== toolUseID)), resolve27({
                  ...freshResult,
                  updatedInput: input,
                  userModified: !1
                });
            }
          }
        ]);
      });
    return new Promise((resolve27) => {
      let request2 = createPermissionRequest({
        toolName: tool.name,
        toolUseId: toolUseID,
        input,
        description,
        permissionSuggestions: result.suggestions,
        workerId: identity17.agentId,
        workerName: identity17.agentName,
        workerColor: identity17.color,
        teamName: identity17.teamName
      });
      registerPermissionCallback({
        requestId: request2.id,
        toolUseId: toolUseID,
        onAllow(updatedInput, permissionUpdates, _feedback, contentBlocks) {
          cleanup(), persistPermissionUpdates(permissionUpdates);
          let finalInput = updatedInput && Object.keys(updatedInput).length > 0 ? updatedInput : input;
          resolve27({
            behavior: "allow",
            updatedInput: finalInput,
            userModified: !1,
            ...contentBlocks && contentBlocks.length > 0 && { contentBlocks }
          });
        },
        onReject(feedback, contentBlocks) {
          cleanup();
          let message = feedback ? `${SUBAGENT_REJECT_MESSAGE_WITH_REASON_PREFIX}${feedback}` : SUBAGENT_REJECT_MESSAGE;
          resolve27({ behavior: "ask", message, contentBlocks });
        }
      }), sendPermissionRequestViaMailbox(request2);
      let pollInterval = setInterval(async (abortController2, cleanup2, resolve28, identity18, request3) => {
        if (abortController2.signal.aborted) {
          cleanup2(), resolve28({ behavior: "ask", message: SUBAGENT_REJECT_MESSAGE });
          return;
        }
        let allMessages = await readMailbox(identity18.agentName, identity18.teamName);
        for (let i5 = 0;i5 < allMessages.length; i5++) {
          let msg = allMessages[i5];
          if (msg && !msg.read) {
            let parsed = isPermissionResponse(msg.text);
            if (parsed && parsed.request_id === request3.id) {
              if (await markMessageAsReadByIndex(identity18.agentName, identity18.teamName, i5), parsed.subtype === "success")
                processMailboxPermissionResponse({
                  requestId: parsed.request_id,
                  decision: "approved",
                  updatedInput: parsed.response?.updated_input,
                  permissionUpdates: parsed.response?.permission_updates
                });
              else
                processMailboxPermissionResponse({
                  requestId: parsed.request_id,
                  decision: "rejected",
                  feedback: parsed.error
                });
              return;
            }
          }
        }
      }, PERMISSION_POLL_INTERVAL_MS, abortController, cleanup, resolve27, identity17, request2), onAbortListener = () => {
        cleanup(), resolve27({ behavior: "ask", message: SUBAGENT_REJECT_MESSAGE });
      };
      abortController.signal.addEventListener("abort", onAbortListener, {
        once: !0
      });
      function cleanup() {
        clearInterval(pollInterval), unregisterPermissionCallback(request2.id), abortController.signal.removeEventListener("abort", onAbortListener);
      }
    });
  };
}
