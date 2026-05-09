// Original: src/query.ts
function* yieldMissingToolResultBlocks(assistantMessages, errorMessage2) {
  for (let assistantMessage of assistantMessages) {
    let toolUseBlocks = assistantMessage.message.content.filter((content) => content.type === "tool_use");
    for (let toolUse of toolUseBlocks)
      yield createUserMessage({
        content: [
          {
            type: "tool_result",
            content: errorMessage2,
            is_error: !0,
            tool_use_id: toolUse.id
          }
        ],
        toolUseResult: errorMessage2,
        sourceToolAssistantUUID: assistantMessage.uuid
      });
  }
}
function isWithheldMaxOutputTokens(msg) {
  return msg?.type === "assistant" && msg.apiError === "max_output_tokens";
}
async function* query(params) {
  let consumedCommandUuids = [], terminal = yield* queryLoop(params, consumedCommandUuids);
  for (let uuid8 of consumedCommandUuids)
    notifyCommandLifecycle(uuid8, "completed");
  return terminal;
}
async function* queryLoop(params, consumedCommandUuids) {
  let __stack = [];
  try {
    let {
      systemPrompt,
      userContext,
      systemContext,
      canUseTool,
      fallbackModel,
      querySource,
      maxTurns,
      skipCacheWrite
    } = params;
    let deps = params.deps ?? productionDeps();
    let state3 = {
      messages: params.messages,
      toolUseContext: params.toolUseContext,
      maxOutputTokensOverride: params.maxOutputTokensOverride,
      autoCompactTracking: void 0,
      stopHookActive: void 0,
      maxOutputTokensRecoveryCount: 0,
      hasAttemptedReactiveCompact: !1,
      turnCount: 1,
      pendingToolUseSummary: void 0,
      transition: void 0
    };
    let budgetTracker = null;
    let taskBudgetRemaining = void 0;
    let config10 = buildQueryConfig();
    const pendingMemoryPrefetch = __using(__stack, startRelevantMemoryPrefetch(state3.messages, state3.toolUseContext), 0);
    while (!0) {
      let { toolUseContext } = state3, {
        messages,
        autoCompactTracking,
        maxOutputTokensRecoveryCount,
        hasAttemptedReactiveCompact,
        maxOutputTokensOverride,
        pendingToolUseSummary,
        stopHookActive,
        turnCount
      } = state3, pendingSkillPrefetch = skillPrefetch?.startSkillDiscoveryPrefetch(null, messages, toolUseContext);
      if (yield { type: "stream_request_start" }, queryCheckpoint("query_fn_entry"), !toolUseContext.agentId)
        headlessProfilerCheckpoint("query_started");
      let queryTracking = toolUseContext.queryTracking ? {
        chainId: toolUseContext.queryTracking.chainId,
        depth: toolUseContext.queryTracking.depth + 1
      } : {
        chainId: deps.uuid(),
        depth: 0
      }, queryChainIdForAnalytics = queryTracking.chainId;
      toolUseContext = {
        ...toolUseContext,
        queryTracking
      };
      let messagesForQuery = [...getMessagesAfterCompactBoundary(messages)], tracking = autoCompactTracking, persistReplacements = querySource.startsWith("agent:") || querySource.startsWith("repl_main_thread");
      messagesForQuery = await applyToolResultBudget(messagesForQuery, toolUseContext.contentReplacementState, persistReplacements ? (records) => void recordContentReplacement(records, toolUseContext.agentId).catch(logError2) : void 0, new Set(toolUseContext.options.tools.filter((t2) => !Number.isFinite(t2.maxResultSizeChars)).map((t2) => t2.name)));
      let snipTokensFreed = 0;
      queryCheckpoint("query_microcompact_start"), messagesForQuery = (await deps.microcompact(messagesForQuery, toolUseContext, querySource)).messages;
      let pendingCacheEdits2 = void 0;
      queryCheckpoint("query_microcompact_end");
      let fullSystemPrompt = asSystemPrompt(appendSystemContext(systemPrompt, systemContext));
      queryCheckpoint("query_autocompact_start");
      let { compactionResult, consecutiveFailures } = await deps.autocompact(messagesForQuery, toolUseContext, {
        systemPrompt,
        userContext,
        systemContext,
        toolUseContext,
        forkContextMessages: messagesForQuery
      }, querySource, tracking, snipTokensFreed);
      if (queryCheckpoint("query_autocompact_end"), compactionResult) {
        let {
          preCompactTokenCount,
          postCompactTokenCount,
          truePostCompactTokenCount,
          compactionUsage
        } = compactionResult;
        if (logEvent("tengu_auto_compact_succeeded", {
          originalMessageCount: messages.length,
          compactedMessageCount: compactionResult.summaryMessages.length + compactionResult.attachments.length + compactionResult.hookResults.length,
          preCompactTokenCount,
          postCompactTokenCount,
          truePostCompactTokenCount,
          compactionInputTokens: compactionUsage?.input_tokens,
          compactionOutputTokens: compactionUsage?.output_tokens,
          compactionCacheReadTokens: compactionUsage?.cache_read_input_tokens ?? 0,
          compactionCacheCreationTokens: compactionUsage?.cache_creation_input_tokens ?? 0,
          compactionTotalTokens: compactionUsage ? compactionUsage.input_tokens + (compactionUsage.cache_creation_input_tokens ?? 0) + (compactionUsage.cache_read_input_tokens ?? 0) + compactionUsage.output_tokens : 0,
          queryChainId: queryChainIdForAnalytics,
          queryDepth: queryTracking.depth
        }), params.taskBudget) {
          let preCompactContext = finalContextTokensFromLastResponse(messagesForQuery);
          taskBudgetRemaining = Math.max(0, (taskBudgetRemaining ?? params.taskBudget.total) - preCompactContext);
        }
        tracking = {
          compacted: !0,
          turnId: deps.uuid(),
          turnCounter: 0,
          consecutiveFailures: 0
        };
        let postCompactMessages = buildPostCompactMessages(compactionResult);
        for (let message of postCompactMessages)
          yield message;
        messagesForQuery = postCompactMessages;
      } else if (consecutiveFailures !== void 0)
        tracking = {
          ...tracking ?? { compacted: !1, turnId: "", turnCounter: 0 },
          consecutiveFailures
        };
      toolUseContext = {
        ...toolUseContext,
        messages: messagesForQuery
      };
      let assistantMessages = [], toolResults = [], toolUseBlocks = [], needsFollowUp = !1;
      queryCheckpoint("query_setup_start");
      let streamingToolExecutor = config10.gates.streamingToolExecution ? new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext) : null, appState = toolUseContext.getAppState(), permissionMode = appState.toolPermissionContext.mode, currentModel = getRuntimeMainLoopModel({
        permissionMode,
        mainLoopModel: toolUseContext.options.mainLoopModel,
        exceeds200kTokens: permissionMode === "plan" && doesMostRecentAssistantMessageExceed200k(messagesForQuery)
      });
      queryCheckpoint("query_setup_end");
      let dumpPromptsFetch = config10.gates.isAnt ? createDumpPromptsFetch(toolUseContext.agentId ?? config10.sessionId) : void 0, collapseOwnsIt = !1, mediaRecoveryEnabled = reactiveCompact?.isReactiveCompactEnabled() ?? !1;
      if (!compactionResult && querySource !== "compact" && querySource !== "session_memory" && !(reactiveCompact?.isReactiveCompactEnabled() && isAutoCompactEnabled()) && !collapseOwnsIt) {
        let { isAtBlockingLimit } = calculateTokenWarningState(tokenCountWithEstimation(messagesForQuery) - snipTokensFreed, toolUseContext.options.mainLoopModel);
        if (isAtBlockingLimit)
          return yield createAssistantAPIErrorMessage({
            content: PROMPT_TOO_LONG_ERROR_MESSAGE,
            error: "invalid_request"
          }), { reason: "blocking_limit" };
      }
      let attemptWithFallback = !0;
      queryCheckpoint("query_api_loop_start");
      try {
        while (attemptWithFallback) {
          attemptWithFallback = !1;
          try {
            let streamingFallbackOccured = !1;
            queryCheckpoint("query_api_streaming_start");
            for await (let message of deps.callModel({
              messages: prependUserContext(messagesForQuery, userContext),
              systemPrompt: fullSystemPrompt,
              thinkingConfig: toolUseContext.options.thinkingConfig,
              tools: toolUseContext.options.tools,
              signal: toolUseContext.abortController.signal,
              options: {
                async getToolPermissionContext() {
                  return toolUseContext.getAppState().toolPermissionContext;
                },
                model: currentModel,
                ...config10.gates.fastModeEnabled && {
                  fastMode: appState.fastMode
                },
                toolChoice: void 0,
                isNonInteractiveSession: toolUseContext.options.isNonInteractiveSession,
                fallbackModel,
                onStreamingFallback: () => {
                  streamingFallbackOccured = !0;
                },
                querySource,
                agents: toolUseContext.options.agentDefinitions.activeAgents,
                allowedAgentTypes: toolUseContext.options.agentDefinitions.allowedAgentTypes,
                hasAppendSystemPrompt: !!toolUseContext.options.appendSystemPrompt,
                maxOutputTokensOverride,
                fetchOverride: dumpPromptsFetch,
                mcpTools: appState.mcp.tools,
                hasPendingMcpServers: appState.mcp.clients.some((c3) => c3.type === "pending"),
                queryTracking,
                effortValue: appState.effortValue,
                advisorModel: appState.advisorModel,
                skipCacheWrite,
                agentId: toolUseContext.agentId,
                addNotification: toolUseContext.addNotification,
                ...params.taskBudget && {
                  taskBudget: {
                    total: params.taskBudget.total,
                    ...taskBudgetRemaining !== void 0 && {
                      remaining: taskBudgetRemaining
                    }
                  }
                }
              }
            })) {
              if (streamingFallbackOccured) {
                for (let msg of assistantMessages)
                  yield { type: "tombstone", message: msg };
                if (logEvent("tengu_orphaned_messages_tombstoned", {
                  orphanedMessageCount: assistantMessages.length,
                  queryChainId: queryChainIdForAnalytics,
                  queryDepth: queryTracking.depth
                }), assistantMessages.length = 0, toolResults.length = 0, toolUseBlocks.length = 0, needsFollowUp = !1, streamingToolExecutor)
                  streamingToolExecutor.discard(), streamingToolExecutor = new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext);
              }
              let yieldMessage = message;
              if (message.type === "assistant") {
                let clonedContent;
                for (let i5 = 0;i5 < message.message.content.length; i5++) {
                  let block2 = message.message.content[i5];
                  if (block2.type === "tool_use" && typeof block2.input === "object" && block2.input !== null) {
                    let tool = findToolByName(toolUseContext.options.tools, block2.name);
                    if (tool?.backfillObservableInput) {
                      let originalInput = block2.input, inputCopy = { ...originalInput };
                      if (tool.backfillObservableInput(inputCopy), Object.keys(inputCopy).some((k3) => !(k3 in originalInput)))
                        clonedContent ??= [...message.message.content], clonedContent[i5] = { ...block2, input: inputCopy };
                    }
                  }
                }
                if (clonedContent)
                  yieldMessage = {
                    ...message,
                    message: { ...message.message, content: clonedContent }
                  };
              }
              let withheld = !1;
              if (reactiveCompact?.isWithheldPromptTooLong(message))
                withheld = !0;
              if (mediaRecoveryEnabled && reactiveCompact?.isWithheldMediaSizeError(message))
                withheld = !0;
              if (isWithheldMaxOutputTokens(message))
                withheld = !0;
              if (!withheld)
                yield yieldMessage;
              if (message.type === "assistant") {
                assistantMessages.push(message);
                let msgToolUseBlocks = message.message.content.filter((content) => content.type === "tool_use");
                if (msgToolUseBlocks.length > 0)
                  toolUseBlocks.push(...msgToolUseBlocks), needsFollowUp = !0;
                if (streamingToolExecutor && !toolUseContext.abortController.signal.aborted)
                  for (let toolBlock of msgToolUseBlocks)
                    streamingToolExecutor.addTool(toolBlock, message);
              }
              if (streamingToolExecutor && !toolUseContext.abortController.signal.aborted) {
                for (let result of streamingToolExecutor.getCompletedResults())
                  if (result.message)
                    yield result.message, toolResults.push(...normalizeMessagesForAPI([result.message], toolUseContext.options.tools).filter((_) => _.type === "user"));
              }
            }
            queryCheckpoint("query_api_streaming_end");
          } catch (innerError) {
            if (innerError instanceof FallbackTriggeredError && fallbackModel) {
              if (currentModel = fallbackModel, attemptWithFallback = !0, yield* yieldMissingToolResultBlocks(assistantMessages, "Model fallback triggered"), assistantMessages.length = 0, toolResults.length = 0, toolUseBlocks.length = 0, needsFollowUp = !1, streamingToolExecutor)
                streamingToolExecutor.discard(), streamingToolExecutor = new StreamingToolExecutor(toolUseContext.options.tools, canUseTool, toolUseContext);
              toolUseContext.options.mainLoopModel = fallbackModel, logEvent("tengu_model_fallback_triggered", {
                original_model: innerError.originalModel,
                fallback_model: fallbackModel,
                entrypoint: "cli",
                queryChainId: queryChainIdForAnalytics,
                queryDepth: queryTracking.depth
              }), yield createSystemMessage(`Switched to ${renderModelName(innerError.fallbackModel)} due to high demand for ${renderModelName(innerError.originalModel)}`, "warning");
              continue;
            }
            throw innerError;
          }
        }
      } catch (error44) {
        logError2(error44);
        let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
        if (logEvent("tengu_query_error", {
          assistantMessages: assistantMessages.length,
          toolUses: assistantMessages.flatMap((_) => _.message.content.filter((content) => content.type === "tool_use")).length,
          queryChainId: queryChainIdForAnalytics,
          queryDepth: queryTracking.depth
        }), error44 instanceof ImageSizeError || error44 instanceof ImageResizeError)
          return yield createAssistantAPIErrorMessage({
            content: error44.message
          }), { reason: "image_error" };
        return yield* yieldMissingToolResultBlocks(assistantMessages, errorMessage2), yield createAssistantAPIErrorMessage({
          content: errorMessage2
        }), logAntError("Query error", error44), { reason: "model_error", error: error44 };
      }
      if (assistantMessages.length > 0)
        executePostSamplingHooks([...messagesForQuery, ...assistantMessages], systemPrompt, userContext, systemContext, toolUseContext, querySource);
      if (toolUseContext.abortController.signal.aborted) {
        if (streamingToolExecutor) {
          for await (let update2 of streamingToolExecutor.getRemainingResults())
            if (update2.message)
              yield update2.message;
        } else
          yield* yieldMissingToolResultBlocks(assistantMessages, "Interrupted by user");
        if (toolUseContext.abortController.signal.reason !== "interrupt")
          yield createUserInterruptionMessage({
            toolUse: !1
          });
        return { reason: "aborted_streaming" };
      }
      if (pendingToolUseSummary) {
        let summary = await pendingToolUseSummary;
        if (summary)
          yield summary;
      }
      if (!needsFollowUp) {
        let lastMessage = assistantMessages.at(-1), isWithheld413 = lastMessage?.type === "assistant" && lastMessage.isApiErrorMessage && isPromptTooLongMessage(lastMessage), isWithheldMedia = mediaRecoveryEnabled && reactiveCompact?.isWithheldMediaSizeError(lastMessage);
        if ((isWithheld413 || isWithheldMedia) && reactiveCompact) {
          let compacted = await reactiveCompact.tryReactiveCompact({
            hasAttempted: hasAttemptedReactiveCompact,
            querySource,
            aborted: toolUseContext.abortController.signal.aborted,
            messages: messagesForQuery,
            cacheSafeParams: {
              systemPrompt,
              userContext,
              systemContext,
              toolUseContext,
              forkContextMessages: messagesForQuery
            }
          });
          if (compacted) {
            if (params.taskBudget) {
              let preCompactContext = finalContextTokensFromLastResponse(messagesForQuery);
              taskBudgetRemaining = Math.max(0, (taskBudgetRemaining ?? params.taskBudget.total) - preCompactContext);
            }
            let postCompactMessages = buildPostCompactMessages(compacted);
            for (let msg of postCompactMessages)
              yield msg;
            state3 = {
              messages: postCompactMessages,
              toolUseContext,
              autoCompactTracking: void 0,
              maxOutputTokensRecoveryCount,
              hasAttemptedReactiveCompact: !0,
              maxOutputTokensOverride: void 0,
              pendingToolUseSummary: void 0,
              stopHookActive: void 0,
              turnCount,
              transition: { reason: "reactive_compact_retry" }
            };
            continue;
          }
          return yield lastMessage, executeStopFailureHooks(lastMessage, toolUseContext), { reason: isWithheldMedia ? "image_error" : "prompt_too_long" };
        }
        if (isWithheldMaxOutputTokens(lastMessage)) {
          if (maxOutputTokensRecoveryCount < MAX_OUTPUT_TOKENS_RECOVERY_LIMIT) {
            let recoveryMessage = createUserMessage({
              content: "Output token limit hit. Resume directly \u2014 no apology, no recap of what you were doing. " + "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
              isMeta: !0
            });
            state3 = {
              messages: [
                ...messagesForQuery,
                ...assistantMessages,
                recoveryMessage
              ],
              toolUseContext,
              autoCompactTracking: tracking,
              maxOutputTokensRecoveryCount: maxOutputTokensRecoveryCount + 1,
              hasAttemptedReactiveCompact,
              maxOutputTokensOverride: void 0,
              pendingToolUseSummary: void 0,
              stopHookActive: void 0,
              turnCount,
              transition: {
                reason: "max_output_tokens_recovery",
                attempt: maxOutputTokensRecoveryCount + 1
              }
            };
            continue;
          }
          yield lastMessage;
        }
        if (lastMessage?.isApiErrorMessage)
          return executeStopFailureHooks(lastMessage, toolUseContext), { reason: "completed" };
        let stopHookResult = yield* handleStopHooks(messagesForQuery, assistantMessages, systemPrompt, userContext, systemContext, toolUseContext, querySource, stopHookActive);
        if (stopHookResult.preventContinuation)
          return { reason: "stop_hook_prevented" };
        if (stopHookResult.blockingErrors.length > 0) {
          state3 = {
            messages: [
              ...messagesForQuery,
              ...assistantMessages,
              ...stopHookResult.blockingErrors
            ],
            toolUseContext,
            autoCompactTracking: tracking,
            maxOutputTokensRecoveryCount: 0,
            hasAttemptedReactiveCompact,
            maxOutputTokensOverride: void 0,
            pendingToolUseSummary: void 0,
            stopHookActive: !0,
            turnCount,
            transition: { reason: "stop_hook_blocking" }
          };
          continue;
        }
        return { reason: "completed" };
      }
      let shouldPreventContinuation = !1, updatedToolUseContext = toolUseContext;
      if (queryCheckpoint("query_tool_execution_start"), streamingToolExecutor)
        logEvent("tengu_streaming_tool_execution_used", {
          tool_count: toolUseBlocks.length,
          queryChainId: queryChainIdForAnalytics,
          queryDepth: queryTracking.depth
        });
      else
        logEvent("tengu_streaming_tool_execution_not_used", {
          tool_count: toolUseBlocks.length,
          queryChainId: queryChainIdForAnalytics,
          queryDepth: queryTracking.depth
        });
      let toolUpdates = streamingToolExecutor ? streamingToolExecutor.getRemainingResults() : runTools(toolUseBlocks, assistantMessages, canUseTool, toolUseContext);
      for await (let update2 of toolUpdates) {
        if (update2.message) {
          if (yield update2.message, update2.message.type === "attachment" && update2.message.attachment.type === "hook_stopped_continuation")
            shouldPreventContinuation = !0;
          toolResults.push(...normalizeMessagesForAPI([update2.message], toolUseContext.options.tools).filter((_) => _.type === "user"));
        }
        if (update2.newContext)
          updatedToolUseContext = {
            ...update2.newContext,
            queryTracking
          };
      }
      queryCheckpoint("query_tool_execution_end");
      let nextPendingToolUseSummary;
      if (config10.gates.emitToolUseSummaries && toolUseBlocks.length > 0 && !toolUseContext.abortController.signal.aborted && !toolUseContext.agentId) {
        let lastAssistantMessage = assistantMessages.at(-1), lastAssistantText;
        if (lastAssistantMessage) {
          let textBlocks = lastAssistantMessage.message.content.filter((block2) => block2.type === "text");
          if (textBlocks.length > 0) {
            let lastTextBlock = textBlocks.at(-1);
            if (lastTextBlock && "text" in lastTextBlock)
              lastAssistantText = lastTextBlock.text;
          }
        }
        let toolUseIds = toolUseBlocks.map((block2) => block2.id), toolInfoForSummary = toolUseBlocks.map((block2) => {
          let toolResult = toolResults.find((result) => result.type === "user" && Array.isArray(result.message.content) && result.message.content.some((content) => content.type === "tool_result" && content.tool_use_id === block2.id)), resultContent = toolResult?.type === "user" && Array.isArray(toolResult.message.content) ? toolResult.message.content.find((c3) => c3.type === "tool_result" && c3.tool_use_id === block2.id) : void 0;
          return {
            name: block2.name,
            input: block2.input,
            output: resultContent && "content" in resultContent ? resultContent.content : null
          };
        });
        nextPendingToolUseSummary = generateToolUseSummary({
          tools: toolInfoForSummary,
          signal: toolUseContext.abortController.signal,
          isNonInteractiveSession: toolUseContext.options.isNonInteractiveSession,
          lastAssistantText
        }).then((summary) => {
          if (summary)
            return createToolUseSummaryMessage(summary, toolUseIds);
          return null;
        }).catch(() => null);
      }
      if (toolUseContext.abortController.signal.aborted) {
        if (toolUseContext.abortController.signal.reason !== "interrupt")
          yield createUserInterruptionMessage({
            toolUse: !0
          });
        let nextTurnCountOnAbort = turnCount + 1;
        if (maxTurns && nextTurnCountOnAbort > maxTurns)
          yield createAttachmentMessage({
            type: "max_turns_reached",
            maxTurns,
            turnCount: nextTurnCountOnAbort
          });
        return { reason: "aborted_tools" };
      }
      if (shouldPreventContinuation)
        return { reason: "hook_stopped" };
      if (tracking?.compacted)
        tracking.turnCounter++, logEvent("tengu_post_autocompact_turn", {
          turnId: tracking.turnId,
          turnCounter: tracking.turnCounter,
          queryChainId: queryChainIdForAnalytics,
          queryDepth: queryTracking.depth
        });
      logEvent("tengu_query_before_attachments", {
        messagesForQueryCount: messagesForQuery.length,
        assistantMessagesCount: assistantMessages.length,
        toolResultsCount: toolResults.length,
        queryChainId: queryChainIdForAnalytics,
        queryDepth: queryTracking.depth
      });
      let sleepRan = toolUseBlocks.some((b) => b.name === SLEEP_TOOL_NAME), isMainThread = querySource.startsWith("repl_main_thread") || querySource === "sdk", currentAgentId = toolUseContext.agentId, queuedCommandsSnapshot = getCommandsByMaxPriority(sleepRan ? "later" : "next").filter((cmd) => {
        if (isSlashCommand(cmd))
          return !1;
        if (isMainThread)
          return cmd.agentId === void 0;
        return cmd.mode === "task-notification" && cmd.agentId === currentAgentId;
      });
      for await (let attachment of getAttachmentMessages(null, updatedToolUseContext, null, queuedCommandsSnapshot, [...messagesForQuery, ...assistantMessages, ...toolResults], querySource))
        yield attachment, toolResults.push(attachment);
      if (pendingMemoryPrefetch && pendingMemoryPrefetch.settledAt !== null && pendingMemoryPrefetch.consumedOnIteration === -1) {
        let memoryAttachments = filterDuplicateMemoryAttachments(await pendingMemoryPrefetch.promise, toolUseContext.readFileState);
        for (let memAttachment of memoryAttachments) {
          let msg = createAttachmentMessage(memAttachment);
          yield msg, toolResults.push(msg);
        }
        pendingMemoryPrefetch.consumedOnIteration = turnCount - 1;
      }
      if (skillPrefetch && pendingSkillPrefetch) {
        let skillAttachments = await skillPrefetch.collectSkillDiscoveryPrefetch(pendingSkillPrefetch);
        for (let att of skillAttachments) {
          let msg = createAttachmentMessage(att);
          yield msg, toolResults.push(msg);
        }
      }
      let consumedCommands = queuedCommandsSnapshot.filter((cmd) => cmd.mode === "prompt" || cmd.mode === "task-notification");
      if (consumedCommands.length > 0) {
        for (let cmd of consumedCommands)
          if (cmd.uuid)
            consumedCommandUuids.push(cmd.uuid), notifyCommandLifecycle(cmd.uuid, "started");
        remove(consumedCommands);
      }
      let fileChangeAttachmentCount = count2(toolResults, (tr) => tr.type === "attachment" && tr.attachment.type === "edited_text_file");
      if (logEvent("tengu_query_after_attachments", {
        totalToolResultsCount: toolResults.length,
        fileChangeAttachmentCount,
        queryChainId: queryChainIdForAnalytics,
        queryDepth: queryTracking.depth
      }), updatedToolUseContext.options.refreshTools) {
        let refreshedTools = updatedToolUseContext.options.refreshTools();
        if (refreshedTools !== updatedToolUseContext.options.tools)
          updatedToolUseContext = {
            ...updatedToolUseContext,
            options: {
              ...updatedToolUseContext.options,
              tools: refreshedTools
            }
          };
      }
      let toolUseContextWithQueryTracking = {
        ...updatedToolUseContext,
        queryTracking
      }, nextTurnCount = turnCount + 1;
      if (maxTurns && nextTurnCount > maxTurns)
        return yield createAttachmentMessage({
          type: "max_turns_reached",
          maxTurns,
          turnCount: nextTurnCount
        }), { reason: "max_turns", turnCount: nextTurnCount };
      queryCheckpoint("query_recursive_call"), state3 = {
        messages: [...messagesForQuery, ...assistantMessages, ...toolResults],
        toolUseContext: toolUseContextWithQueryTracking,
        autoCompactTracking: tracking,
        turnCount: nextTurnCount,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        pendingToolUseSummary: nextPendingToolUseSummary,
        maxOutputTokensOverride: void 0,
        stopHookActive,
        transition: { reason: "next_turn" }
      };
    }
  } catch (_catch3) {
    var _err = _catch3, _hasErr = 1;
  } finally {
    __callDispose(__stack, _err, _hasErr);
  }
}
var reactiveCompact = null, skillPrefetch = null, MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3;
var init_query = __esm(() => {
  init_withRetry();
  init_autoCompact();
  init_compact();
  init_imageValidation();
  init_imageResizer();
  init_Tool();
  init_log3();
  init_errors11();
  init_debug();
  init_messages3();
  init_toolUseSummaryGenerator();
  init_api4();
  init_attachments2();
  init_messageQueueManager();
  init_headlessProfiler();
  init_model();
  init_tokens();
  init_prompt9();
  init_postSamplingHooks();
  init_hooks5();
  init_dumpPrompts();
  init_StreamingToolExecutor();
  init_queryProfiler();
  init_toolOrchestration();
  init_toolResultStorage();
  init_sessionStorage();
  init_stopHooks();
  init_config12();
  init_deps();
  init_tokenBudget2();
});
