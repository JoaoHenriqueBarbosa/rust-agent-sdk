// function: partialCompactConversation
async function partialCompactConversation(allMessages, pivotIndex, context6, cacheSafeParams, userFeedback, direction = "from") {
  try {
    let messagesToSummarize = direction === "up_to" ? allMessages.slice(0, pivotIndex) : allMessages.slice(pivotIndex), messagesToKeep = direction === "up_to" ? allMessages.slice(pivotIndex).filter((m4) => m4.type !== "progress" && !isCompactBoundaryMessage(m4) && !(m4.type === "user" && m4.isCompactSummary)) : allMessages.slice(0, pivotIndex).filter((m4) => m4.type !== "progress");
    if (messagesToSummarize.length === 0)
      throw Error(direction === "up_to" ? "Nothing to summarize before the selected message." : "Nothing to summarize after the selected message.");
    let preCompactTokenCount = tokenCountWithEstimation(allMessages);
    context6.onCompactProgress?.({
      type: "hooks_start",
      hookType: "pre_compact"
    }), context6.setSDKStatus?.("compacting");
    let hookResult = await executePreCompactHooks({
      trigger: "manual",
      customInstructions: null
    }, context6.abortController.signal), customInstructions;
    if (hookResult.newCustomInstructions && userFeedback)
      customInstructions = `${hookResult.newCustomInstructions}

User context: ${userFeedback}`;
    else if (hookResult.newCustomInstructions)
      customInstructions = hookResult.newCustomInstructions;
    else if (userFeedback)
      customInstructions = `User context: ${userFeedback}`;
    context6.setStreamMode?.("requesting"), context6.setResponseLength?.(() => 0), context6.onCompactProgress?.({ type: "compact_start" });
    let compactPrompt = getPartialCompactPrompt(customInstructions, direction), summaryRequest = createUserMessage({
      content: compactPrompt
    }), failureMetadata = {
      preCompactTokenCount,
      direction,
      messagesSummarized: messagesToSummarize.length
    }, apiMessages = direction === "up_to" ? messagesToSummarize : allMessages, retryCacheSafeParams = direction === "up_to" ? { ...cacheSafeParams, forkContextMessages: messagesToSummarize } : cacheSafeParams, summaryResponse, summary, ptlAttempts = 0;
    for (;; ) {
      if (summaryResponse = await streamCompactSummary({
        messages: apiMessages,
        summaryRequest,
        appState: context6.getAppState(),
        context: context6,
        preCompactTokenCount,
        cacheSafeParams: retryCacheSafeParams
      }), summary = getAssistantMessageText(summaryResponse), !summary?.startsWith(PROMPT_TOO_LONG_ERROR_MESSAGE))
        break;
      ptlAttempts++;
      let truncated = ptlAttempts <= MAX_PTL_RETRIES ? truncateHeadForPTLRetry(apiMessages, summaryResponse) : null;
      if (!truncated)
        throw logEvent("tengu_partial_compact_failed", {
          reason: "prompt_too_long",
          ...failureMetadata,
          ptlAttempts
        }), Error(ERROR_MESSAGE_PROMPT_TOO_LONG);
      logEvent("tengu_compact_ptl_retry", {
        attempt: ptlAttempts,
        droppedMessages: apiMessages.length - truncated.length,
        remainingMessages: truncated.length,
        path: "partial"
      }), apiMessages = truncated, retryCacheSafeParams = {
        ...retryCacheSafeParams,
        forkContextMessages: truncated
      };
    }
    if (!summary)
      throw logEvent("tengu_partial_compact_failed", {
        reason: "no_summary",
        ...failureMetadata
      }), Error("Failed to generate conversation summary - response did not contain valid text content");
    else if (startsWithApiErrorPrefix(summary))
      throw logEvent("tengu_partial_compact_failed", {
        reason: "api_error",
        ...failureMetadata
      }), Error(summary);
    let preCompactReadFileState = cacheToObject(context6.readFileState);
    context6.readFileState.clear(), context6.loadedNestedMemoryPaths?.clear();
    let [fileAttachments, asyncAgentAttachments] = await Promise.all([
      createPostCompactFileAttachments(preCompactReadFileState, context6, POST_COMPACT_MAX_FILES_TO_RESTORE, messagesToKeep),
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
    for (let att of getDeferredToolsDeltaAttachment(context6.options.tools, context6.options.mainLoopModel, messagesToKeep, { callSite: "compact_partial" }))
      postCompactFileAttachments.push(createAttachmentMessage(att));
    for (let att of getAgentListingDeltaAttachment(context6, messagesToKeep))
      postCompactFileAttachments.push(createAttachmentMessage(att));
    for (let att of getMcpInstructionsDeltaAttachment(context6.options.mcpClients, context6.options.tools, context6.options.mainLoopModel, messagesToKeep))
      postCompactFileAttachments.push(createAttachmentMessage(att));
    context6.onCompactProgress?.({
      type: "hooks_start",
      hookType: "session_start"
    });
    let hookMessages = await processSessionStartHooks("compact", {
      model: context6.options.mainLoopModel
    }), postCompactTokenCount = tokenCountFromLastAPIResponse([
      summaryResponse
    ]), compactionUsage = getTokenUsage(summaryResponse);
    logEvent("tengu_partial_compact", {
      preCompactTokenCount,
      postCompactTokenCount,
      messagesKept: messagesToKeep.length,
      messagesSummarized: messagesToSummarize.length,
      direction,
      hasUserFeedback: !!userFeedback,
      trigger: "message_selector",
      compactionInputTokens: compactionUsage?.input_tokens,
      compactionOutputTokens: compactionUsage?.output_tokens,
      compactionCacheReadTokens: compactionUsage?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: compactionUsage?.cache_creation_input_tokens ?? 0
    });
    let lastPreCompactUuid = direction === "up_to" ? allMessages.slice(0, pivotIndex).findLast((m4) => m4.type !== "progress")?.uuid : messagesToKeep.at(-1)?.uuid, boundaryMarker = createCompactBoundaryMessage("manual", preCompactTokenCount ?? 0, lastPreCompactUuid, userFeedback, messagesToSummarize.length), preCompactDiscovered = extractDiscoveredToolNames(allMessages);
    if (preCompactDiscovered.size > 0)
      boundaryMarker.compactMetadata.preCompactDiscoveredTools = [
        ...preCompactDiscovered
      ].sort();
    let transcriptPath = getTranscriptPath(), summaryMessages = [
      createUserMessage({
        content: getCompactUserSummaryMessage(summary, !1, transcriptPath),
        isCompactSummary: !0,
        ...messagesToKeep.length > 0 ? {
          summarizeMetadata: {
            messagesSummarized: messagesToSummarize.length,
            userContext: userFeedback,
            direction
          }
        } : { isVisibleInTranscriptOnly: !0 }
      })
    ];
    markPostCompaction(), reAppendSessionMetadata(), context6.onCompactProgress?.({
      type: "hooks_start",
      hookType: "post_compact"
    });
    let postCompactHookResult = await executePostCompactHooks({
      trigger: "manual",
      compactSummary: summary
    }, context6.abortController.signal), anchorUuid = direction === "up_to" ? summaryMessages.at(-1)?.uuid ?? boundaryMarker.uuid : boundaryMarker.uuid;
    return {
      boundaryMarker: annotateBoundaryWithPreservedSegment(boundaryMarker, anchorUuid, messagesToKeep),
      summaryMessages,
      messagesToKeep,
      attachments: postCompactFileAttachments,
      hookResults: hookMessages,
      userDisplayMessage: postCompactHookResult.userDisplayMessage,
      preCompactTokenCount,
      postCompactTokenCount,
      compactionUsage
    };
  } catch (error44) {
    throw addErrorNotificationIfNeeded(error44, context6), error44;
  } finally {
    context6.setStreamMode?.("requesting"), context6.setResponseLength?.(() => 0), context6.onCompactProgress?.({ type: "compact_end" }), context6.setSDKStatus?.(null);
  }
}
