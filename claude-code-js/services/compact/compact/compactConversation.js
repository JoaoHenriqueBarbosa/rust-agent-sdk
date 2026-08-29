// function: compactConversation
async function compactConversation(messages, context6, cacheSafeParams, suppressFollowUpQuestions, customInstructions, isAutoCompact = !1, recompactionInfo) {
  try {
    if (messages.length === 0)
      throw Error(ERROR_MESSAGE_NOT_ENOUGH_MESSAGES);
    let preCompactTokenCount = tokenCountWithEstimation(messages), appState = context6.getAppState();
    logPermissionContextForAnts(appState.toolPermissionContext, "summary"), context6.onCompactProgress?.({
      type: "hooks_start",
      hookType: "pre_compact"
    }), context6.setSDKStatus?.("compacting");
    let hookResult = await executePreCompactHooks({
      trigger: isAutoCompact ? "auto" : "manual",
      customInstructions: customInstructions ?? null
    }, context6.abortController.signal);
    customInstructions = mergeHookInstructions(customInstructions, hookResult.newCustomInstructions);
    let userDisplayMessage = hookResult.userDisplayMessage;
    context6.setStreamMode?.("requesting"), context6.setResponseLength?.(() => 0), context6.onCompactProgress?.({ type: "compact_start" });
    let promptCacheSharingEnabled = !0, compactPrompt = getCompactPrompt(customInstructions), summaryRequest = createUserMessage({
      content: compactPrompt
    }), messagesToSummarize = messages, retryCacheSafeParams = cacheSafeParams, summaryResponse, summary, ptlAttempts = 0;
    for (;; ) {
      if (summaryResponse = await streamCompactSummary({
        messages: messagesToSummarize,
        summaryRequest,
        appState,
        context: context6,
        preCompactTokenCount,
        cacheSafeParams: retryCacheSafeParams
      }), summary = getAssistantMessageText(summaryResponse), !summary?.startsWith(PROMPT_TOO_LONG_ERROR_MESSAGE))
        break;
      ptlAttempts++;
      let truncated = ptlAttempts <= MAX_PTL_RETRIES ? truncateHeadForPTLRetry(messagesToSummarize, summaryResponse) : null;
      if (!truncated)
        throw logEvent("tengu_compact_failed", {
          reason: "prompt_too_long",
          preCompactTokenCount,
          promptCacheSharingEnabled,
          ptlAttempts
        }), Error(ERROR_MESSAGE_PROMPT_TOO_LONG);
      logEvent("tengu_compact_ptl_retry", {
        attempt: ptlAttempts,
        droppedMessages: messagesToSummarize.length - truncated.length,
        remainingMessages: truncated.length
      }), messagesToSummarize = truncated, retryCacheSafeParams = {
        ...retryCacheSafeParams,
        forkContextMessages: truncated
      };
    }
    if (!summary)
      throw logForDebugging(`Compact failed: no summary text in response. Response: ${jsonStringify(summaryResponse)}`, { level: "error" }), logEvent("tengu_compact_failed", {
        reason: "no_summary",
        preCompactTokenCount,
        promptCacheSharingEnabled
      }), Error("Failed to generate conversation summary - response did not contain valid text content");
    else if (startsWithApiErrorPrefix(summary))
      throw logEvent("tengu_compact_failed", {
        reason: "api_error",
        preCompactTokenCount,
        promptCacheSharingEnabled
      }), Error(summary);
    let preCompactReadFileState = cacheToObject(context6.readFileState);
    context6.readFileState.clear(), context6.loadedNestedMemoryPaths?.clear();
    let [fileAttachments, asyncAgentAttachments] = await Promise.all([
      createPostCompactFileAttachments(preCompactReadFileState, context6, POST_COMPACT_MAX_FILES_TO_RESTORE),
      createAsyncAgentAttachmentsIfNeeded(context6)
    ]), postCompactFileAttachments = [
      ...fileAttachments,
      ...asyncAgentAttachments
    ], planAttachment = createPlanAttachmentIfNeeded(context6.agentId);
    if (planAttachment)
      postCompactFileAttachments.push(planAttachment);
    let planModeAttachment = await createPlanModeAttachmentIfNeeded(context6);
    if (planModeAttachment)
      postCompactFileAttachments.push(planModeAttachment);
    let skillAttachment = createSkillAttachmentIfNeeded(context6.agentId);
    if (skillAttachment)
      postCompactFileAttachments.push(skillAttachment);
    for (let att of getDeferredToolsDeltaAttachment(context6.options.tools, context6.options.mainLoopModel, [], { callSite: "compact_full" }))
      postCompactFileAttachments.push(createAttachmentMessage(att));
    for (let att of getAgentListingDeltaAttachment(context6, []))
      postCompactFileAttachments.push(createAttachmentMessage(att));
    for (let att of getMcpInstructionsDeltaAttachment(context6.options.mcpClients, context6.options.tools, context6.options.mainLoopModel, []))
      postCompactFileAttachments.push(createAttachmentMessage(att));
    context6.onCompactProgress?.({
      type: "hooks_start",
      hookType: "session_start"
    });
    let hookMessages = await processSessionStartHooks("compact", {
      model: context6.options.mainLoopModel
    }), boundaryMarker = createCompactBoundaryMessage(isAutoCompact ? "auto" : "manual", preCompactTokenCount ?? 0, messages.at(-1)?.uuid), preCompactDiscovered = extractDiscoveredToolNames(messages);
    if (preCompactDiscovered.size > 0)
      boundaryMarker.compactMetadata.preCompactDiscoveredTools = [
        ...preCompactDiscovered
      ].sort();
    let transcriptPath = getTranscriptPath(), summaryMessages = [
      createUserMessage({
        content: getCompactUserSummaryMessage(summary, suppressFollowUpQuestions, transcriptPath),
        isCompactSummary: !0,
        isVisibleInTranscriptOnly: !0
      })
    ], compactionCallTotalTokens = tokenCountFromLastAPIResponse([
      summaryResponse
    ]), truePostCompactTokenCount = roughTokenCountEstimationForMessages([
      boundaryMarker,
      ...summaryMessages,
      ...postCompactFileAttachments,
      ...hookMessages
    ]), compactionUsage = getTokenUsage(summaryResponse), querySourceForEvent = recompactionInfo?.querySource ?? context6.options.querySource ?? "unknown";
    logEvent("tengu_compact", {
      preCompactTokenCount,
      postCompactTokenCount: compactionCallTotalTokens,
      truePostCompactTokenCount,
      autoCompactThreshold: recompactionInfo?.autoCompactThreshold ?? -1,
      willRetriggerNextTurn: recompactionInfo !== void 0 && truePostCompactTokenCount >= recompactionInfo.autoCompactThreshold,
      isAutoCompact,
      querySource: querySourceForEvent,
      queryChainId: context6.queryTracking?.chainId ?? "",
      queryDepth: context6.queryTracking?.depth ?? -1,
      isRecompactionInChain: recompactionInfo?.isRecompactionInChain ?? !1,
      turnsSincePreviousCompact: recompactionInfo?.turnsSincePreviousCompact ?? -1,
      previousCompactTurnId: recompactionInfo?.previousCompactTurnId ?? "",
      compactionInputTokens: compactionUsage?.input_tokens,
      compactionOutputTokens: compactionUsage?.output_tokens,
      compactionCacheReadTokens: compactionUsage?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: compactionUsage?.cache_creation_input_tokens ?? 0,
      compactionTotalTokens: compactionUsage ? compactionUsage.input_tokens + (compactionUsage.cache_creation_input_tokens ?? 0) + (compactionUsage.cache_read_input_tokens ?? 0) + compactionUsage.output_tokens : 0,
      promptCacheSharingEnabled,
      ...(() => {
        try {
          return tokenStatsToStatsigMetrics(analyzeContext(messages));
        } catch (error44) {
          return logError2(error44), {};
        }
      })()
    }), markPostCompaction(), reAppendSessionMetadata(), context6.onCompactProgress?.({
      type: "hooks_start",
      hookType: "post_compact"
    });
    let postCompactHookResult = await executePostCompactHooks({
      trigger: isAutoCompact ? "auto" : "manual",
      compactSummary: summary
    }, context6.abortController.signal), combinedUserDisplayMessage = [
      userDisplayMessage,
      postCompactHookResult.userDisplayMessage
    ].filter(Boolean).join(`
`);
    return {
      boundaryMarker,
      summaryMessages,
      attachments: postCompactFileAttachments,
      hookResults: hookMessages,
      userDisplayMessage: combinedUserDisplayMessage || void 0,
      preCompactTokenCount,
      postCompactTokenCount: compactionCallTotalTokens,
      truePostCompactTokenCount,
      compactionUsage
    };
  } catch (error44) {
    if (!isAutoCompact)
      addErrorNotificationIfNeeded(error44, context6);
    throw error44;
  } finally {
    context6.setStreamMode?.("requesting"), context6.setResponseLength?.(() => 0), context6.onCompactProgress?.({ type: "compact_end" }), context6.setSDKStatus?.(null);
  }
}
