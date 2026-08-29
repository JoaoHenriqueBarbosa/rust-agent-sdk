// Original: src/query/stopHooks.ts
async function* handleStopHooks(messagesForQuery, assistantMessages, systemPrompt, userContext, systemContext, toolUseContext, querySource, stopHookActive) {
  let hookStartTime = Date.now(), stopHookContext = {
    messages: [...messagesForQuery, ...assistantMessages],
    systemPrompt,
    userContext,
    systemContext,
    toolUseContext,
    querySource
  };
  if (querySource === "repl_main_thread" || querySource === "sdk")
    saveCacheSafeParams(createCacheSafeParams(stopHookContext));
  if (!isBareMode()) {
    if (!isEnvDefinedFalsy(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION))
      executePromptSuggestion(stopHookContext);
    if (!toolUseContext.agentId)
      executeAutoDream(stopHookContext, toolUseContext.appendSystemMessage);
  }
  try {
    let blockingErrors = [], permissionMode = toolUseContext.getAppState().toolPermissionContext.mode, generator = executeStopHooks(permissionMode, toolUseContext.abortController.signal, void 0, stopHookActive ?? !1, toolUseContext.agentId, toolUseContext, [...messagesForQuery, ...assistantMessages], toolUseContext.agentType), stopHookToolUseID = "", hookCount = 0, preventedContinuation = !1, stopReason = "", hasOutput = !1, hookErrors = [], hookInfos = [];
    for await (let result of generator) {
      if (result.message) {
        if (yield result.message, result.message.type === "progress" && result.message.toolUseID) {
          stopHookToolUseID = result.message.toolUseID, hookCount++;
          let progressData = result.message.data;
          if (progressData.command)
            hookInfos.push({
              command: progressData.command,
              promptText: progressData.promptText
            });
        }
        if (result.message.type === "attachment") {
          let attachment = result.message.attachment;
          if ("hookEvent" in attachment && (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop")) {
            if (attachment.type === "hook_non_blocking_error")
              hookErrors.push(attachment.stderr || `Exit code ${attachment.exitCode}`), hasOutput = !0;
            else if (attachment.type === "hook_error_during_execution")
              hookErrors.push(attachment.content), hasOutput = !0;
            else if (attachment.type === "hook_success") {
              if (attachment.stdout && attachment.stdout.trim() || attachment.stderr && attachment.stderr.trim())
                hasOutput = !0;
            }
            if ("durationMs" in attachment && "command" in attachment) {
              let info = hookInfos.find((i5) => i5.command === attachment.command && i5.durationMs === void 0);
              if (info)
                info.durationMs = attachment.durationMs;
            }
          }
        }
      }
      if (result.blockingError) {
        let userMessage = createUserMessage({
          content: getStopHookMessage(result.blockingError),
          isMeta: !0
        });
        blockingErrors.push(userMessage), yield userMessage, hasOutput = !0, hookErrors.push(result.blockingError.blockingError);
      }
      if (result.preventContinuation)
        preventedContinuation = !0, stopReason = result.stopReason || "Stop hook prevented continuation", yield createAttachmentMessage({
          type: "hook_stopped_continuation",
          message: stopReason,
          hookName: "Stop",
          toolUseID: stopHookToolUseID,
          hookEvent: "Stop"
        });
      if (toolUseContext.abortController.signal.aborted)
        return logEvent("tengu_pre_stop_hooks_cancelled", {
          queryChainId: toolUseContext.queryTracking?.chainId,
          queryDepth: toolUseContext.queryTracking?.depth
        }), yield createUserInterruptionMessage({
          toolUse: !1
        }), { blockingErrors: [], preventContinuation: !0 };
    }
    if (hookCount > 0) {
      if (yield createStopHookSummaryMessage2(hookCount, hookInfos, hookErrors, preventedContinuation, stopReason, hasOutput, "suggestion", stopHookToolUseID), hookErrors.length > 0) {
        let expandShortcut = getShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o");
        toolUseContext.addNotification?.({
          key: "stop-hook-error",
          text: `Stop hook error occurred \xB7 ${expandShortcut} to see`,
          priority: "immediate"
        });
      }
    }
    if (preventedContinuation)
      return { blockingErrors: [], preventContinuation: !0 };
    if (blockingErrors.length > 0)
      return { blockingErrors, preventContinuation: !1 };
    if (isTeammate()) {
      let teammateName = getAgentName() ?? "", teamName = getTeamName() ?? "", teammateBlockingErrors = [], teammatePreventedContinuation = !1, teammateStopReason, teammateHookToolUseID = "", taskListId = getTaskListId(), inProgressTasks = (await listTasks(taskListId)).filter((t2) => t2.status === "in_progress" && t2.owner === teammateName);
      for (let task of inProgressTasks) {
        let taskCompletedGenerator = executeTaskCompletedHooks(task.id, task.subject, task.description, teammateName, teamName, permissionMode, toolUseContext.abortController.signal, void 0, toolUseContext);
        for await (let result of taskCompletedGenerator) {
          if (result.message) {
            if (result.message.type === "progress" && result.message.toolUseID)
              teammateHookToolUseID = result.message.toolUseID;
            yield result.message;
          }
          if (result.blockingError) {
            let userMessage = createUserMessage({
              content: getTaskCompletedHookMessage(result.blockingError),
              isMeta: !0
            });
            teammateBlockingErrors.push(userMessage), yield userMessage;
          }
          if (result.preventContinuation)
            teammatePreventedContinuation = !0, teammateStopReason = result.stopReason || "TaskCompleted hook prevented continuation", yield createAttachmentMessage({
              type: "hook_stopped_continuation",
              message: teammateStopReason,
              hookName: "TaskCompleted",
              toolUseID: teammateHookToolUseID,
              hookEvent: "TaskCompleted"
            });
          if (toolUseContext.abortController.signal.aborted)
            return { blockingErrors: [], preventContinuation: !0 };
        }
      }
      let teammateIdleGenerator = executeTeammateIdleHooks(teammateName, teamName, permissionMode, toolUseContext.abortController.signal);
      for await (let result of teammateIdleGenerator) {
        if (result.message) {
          if (result.message.type === "progress" && result.message.toolUseID)
            teammateHookToolUseID = result.message.toolUseID;
          yield result.message;
        }
        if (result.blockingError) {
          let userMessage = createUserMessage({
            content: getTeammateIdleHookMessage(result.blockingError),
            isMeta: !0
          });
          teammateBlockingErrors.push(userMessage), yield userMessage;
        }
        if (result.preventContinuation)
          teammatePreventedContinuation = !0, teammateStopReason = result.stopReason || "TeammateIdle hook prevented continuation", yield createAttachmentMessage({
            type: "hook_stopped_continuation",
            message: teammateStopReason,
            hookName: "TeammateIdle",
            toolUseID: teammateHookToolUseID,
            hookEvent: "TeammateIdle"
          });
        if (toolUseContext.abortController.signal.aborted)
          return { blockingErrors: [], preventContinuation: !0 };
      }
      if (teammatePreventedContinuation)
        return { blockingErrors: [], preventContinuation: !0 };
      if (teammateBlockingErrors.length > 0)
        return {
          blockingErrors: teammateBlockingErrors,
          preventContinuation: !1
        };
    }
    return { blockingErrors: [], preventContinuation: !1 };
  } catch (error44) {
    let durationMs = Date.now() - hookStartTime;
    return logEvent("tengu_stop_hook_error", {
      duration: durationMs,
      queryChainId: toolUseContext.queryTracking?.chainId,
      queryDepth: toolUseContext.queryTracking?.depth
    }), yield createSystemMessage(`Stop hook failed: ${errorMessage(error44)}`, "warning"), { blockingErrors: [], preventContinuation: !1 };
  }
}
var init_stopHooks = __esm(() => {
  init_shortcutFormat();
  init_attachments2();
  init_errors();
  init_hooks5();
  init_messages3();
  init_tasks();
  init_teammate();
  init_autoDream();
  init_promptSuggestion();
  init_envUtils();
  init_forkedAgent();
});
