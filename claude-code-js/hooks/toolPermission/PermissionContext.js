// Original: src/hooks/toolPermission/PermissionContext.ts
function createResolveOnce(resolve45) {
  let claimed = !1, delivered = !1;
  return {
    resolve(value) {
      if (delivered)
        return;
      delivered = !0, claimed = !0, resolve45(value);
    },
    isResolved() {
      return claimed;
    },
    claim() {
      if (claimed)
        return !1;
      return claimed = !0, !0;
    }
  };
}
function createPermissionContext(tool, input, toolUseContext, assistantMessage, toolUseID, setToolPermissionContext, queueOps) {
  let messageId = assistantMessage.message.id, ctx = {
    tool,
    input,
    toolUseContext,
    assistantMessage,
    messageId,
    toolUseID,
    logDecision(args, opts) {
      logPermissionDecision({
        tool,
        input: opts?.input ?? input,
        toolUseContext,
        messageId,
        toolUseID
      }, args, opts?.permissionPromptStartTimeMs);
    },
    logCancelled() {
      logEvent("tengu_tool_use_cancelled", {
        messageID: messageId,
        toolName: sanitizeToolNameForAnalytics(tool.name)
      });
    },
    async persistPermissions(updates) {
      if (updates.length === 0)
        return !1;
      persistPermissionUpdates(updates);
      let appState = toolUseContext.getAppState();
      return setToolPermissionContext(applyPermissionUpdates(appState.toolPermissionContext, updates)), updates.some((update2) => supportsPersistence(update2.destination));
    },
    resolveIfAborted(resolve45) {
      if (!toolUseContext.abortController.signal.aborted)
        return !1;
      return this.logCancelled(), resolve45(this.cancelAndAbort(void 0, !0)), !0;
    },
    cancelAndAbort(feedback2, isAbort, contentBlocks) {
      let sub = !!toolUseContext.agentId, baseMessage = feedback2 ? `${sub ? SUBAGENT_REJECT_MESSAGE_WITH_REASON_PREFIX : REJECT_MESSAGE_WITH_REASON_PREFIX}${feedback2}` : sub ? SUBAGENT_REJECT_MESSAGE : REJECT_MESSAGE, message = sub ? baseMessage : withMemoryCorrectionHint(baseMessage);
      if (isAbort || !feedback2 && !contentBlocks?.length && !sub)
        logForDebugging(`Aborting: tool=${tool.name} isAbort=${isAbort} hasFeedback=${!!feedback2} isSubagent=${sub}`), toolUseContext.abortController.abort();
      return { behavior: "ask", message, contentBlocks };
    },
    ...{},
    async runHooks(permissionMode, suggestions, updatedInput, permissionPromptStartTimeMs) {
      for await (let hookResult of executePermissionRequestHooks(tool.name, toolUseID, input, toolUseContext, permissionMode, suggestions, toolUseContext.abortController.signal))
        if (hookResult.permissionRequestResult) {
          let decision = hookResult.permissionRequestResult;
          if (decision.behavior === "allow") {
            let finalInput = decision.updatedInput ?? updatedInput ?? input;
            return await this.handleHookAllow(finalInput, decision.updatedPermissions ?? [], permissionPromptStartTimeMs);
          } else if (decision.behavior === "deny") {
            if (this.logDecision({ decision: "reject", source: { type: "hook" } }, { permissionPromptStartTimeMs }), decision.interrupt)
              logForDebugging(`Hook interrupt: tool=${tool.name} hookMessage=${decision.message}`), toolUseContext.abortController.abort();
            return this.buildDeny(decision.message || "Permission denied by hook", {
              type: "hook",
              hookName: "PermissionRequest",
              reason: decision.message
            });
          }
        }
      return null;
    },
    buildAllow(updatedInput, opts) {
      return {
        behavior: "allow",
        updatedInput,
        userModified: opts?.userModified ?? !1,
        ...opts?.decisionReason && { decisionReason: opts.decisionReason },
        ...opts?.acceptFeedback && { acceptFeedback: opts.acceptFeedback },
        ...opts?.contentBlocks && opts.contentBlocks.length > 0 && {
          contentBlocks: opts.contentBlocks
        }
      };
    },
    buildDeny(message, decisionReason) {
      return { behavior: "deny", message, decisionReason };
    },
    async handleUserAllow(updatedInput, permissionUpdates, feedback2, permissionPromptStartTimeMs, contentBlocks, decisionReason) {
      let acceptedPermanentUpdates = await this.persistPermissions(permissionUpdates);
      this.logDecision({
        decision: "accept",
        source: { type: "user", permanent: acceptedPermanentUpdates }
      }, { input: updatedInput, permissionPromptStartTimeMs });
      let userModified = tool.inputsEquivalent ? !tool.inputsEquivalent(input, updatedInput) : !1, trimmedFeedback = feedback2?.trim();
      return this.buildAllow(updatedInput, {
        userModified,
        decisionReason,
        acceptFeedback: trimmedFeedback || void 0,
        contentBlocks
      });
    },
    async handleHookAllow(finalInput, permissionUpdates, permissionPromptStartTimeMs) {
      let acceptedPermanentUpdates = await this.persistPermissions(permissionUpdates);
      return this.logDecision({
        decision: "accept",
        source: { type: "hook", permanent: acceptedPermanentUpdates }
      }, { input: finalInput, permissionPromptStartTimeMs }), this.buildAllow(finalInput, {
        decisionReason: { type: "hook", hookName: "PermissionRequest" }
      });
    },
    pushToQueue(item) {
      queueOps?.push(item);
    },
    removeFromQueue() {
      queueOps?.remove(toolUseID);
    },
    updateQueueItem(patch2) {
      queueOps?.update(toolUseID, patch2);
    }
  };
  return Object.freeze(ctx);
}
function createPermissionQueueOps(setToolUseConfirmQueue) {
  return {
    push(item) {
      setToolUseConfirmQueue((queue2) => [...queue2, item]);
    },
    remove(toolUseID) {
      setToolUseConfirmQueue((queue2) => queue2.filter((item) => item.toolUseID !== toolUseID));
    },
    update(toolUseID, patch2) {
      setToolUseConfirmQueue((queue2) => queue2.map((item) => item.toolUseID === toolUseID ? { ...item, ...patch2 } : item));
    }
  };
}
var init_PermissionContext = __esm(() => {
  init_metadata();
  init_bashPermissions();
  init_debug();
  init_hooks5();
  init_messages3();
  init_PermissionUpdate();
  init_permissionLogging();
});
