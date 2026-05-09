// Original: src/commands/compact/compact.ts
var exports_compact = {};
__export(exports_compact, {
  call: () => call13
});
async function compactViaReactive(messages, context6, customInstructions, reactive2) {
  context6.onCompactProgress?.({
    type: "hooks_start",
    hookType: "pre_compact"
  }), context6.setSDKStatus?.("compacting");
  try {
    let [hookResult, cacheSafeParams] = await Promise.all([
      executePreCompactHooks({ trigger: "manual", customInstructions: customInstructions || null }, context6.abortController.signal),
      getCacheSharingParams(context6, messages)
    ]), mergedInstructions = mergeHookInstructions(customInstructions, hookResult.newCustomInstructions);
    context6.setStreamMode?.("requesting"), context6.setResponseLength?.(() => 0), context6.onCompactProgress?.({ type: "compact_start" });
    let outcome = await reactive2.reactiveCompactOnPromptTooLong(messages, cacheSafeParams, { customInstructions: mergedInstructions, trigger: "manual" });
    if (!outcome.ok)
      switch (outcome.reason) {
        case "too_few_groups":
          throw Error(ERROR_MESSAGE_NOT_ENOUGH_MESSAGES);
        case "aborted":
          throw Error(ERROR_MESSAGE_USER_ABORT);
        case "exhausted":
        case "error":
        case "media_unstrippable":
          throw Error(ERROR_MESSAGE_INCOMPLETE_RESPONSE);
      }
    setLastSummarizedMessageId(void 0), runPostCompactCleanup(), suppressCompactWarning(), getUserContext.cache.clear?.();
    let combinedMessage = [hookResult.userDisplayMessage, outcome.result.userDisplayMessage].filter(Boolean).join(`
`) || void 0;
    return {
      type: "compact",
      compactionResult: {
        ...outcome.result,
        userDisplayMessage: combinedMessage
      },
      displayText: buildDisplayText(context6, combinedMessage)
    };
  } finally {
    context6.setStreamMode?.("requesting"), context6.setResponseLength?.(() => 0), context6.onCompactProgress?.({ type: "compact_end" }), context6.setSDKStatus?.(null);
  }
}
function buildDisplayText(context6, userDisplayMessage) {
  let upgradeMessage = getUpgradeMessage("tip"), expandShortcut = getShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o"), dimmed = [
    ...context6.options.verbose ? [] : [`(${expandShortcut} to see full summary)`],
    ...userDisplayMessage ? [userDisplayMessage] : [],
    ...upgradeMessage ? [upgradeMessage] : []
  ];
  return source_default.dim("Compacted " + dimmed.join(`
`));
}
async function getCacheSharingParams(context6, forkContextMessages) {
  let appState = context6.getAppState(), defaultSysPrompt = await getSystemPrompt(context6.options.tools, context6.options.mainLoopModel, Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()), context6.options.mcpClients), systemPrompt = buildEffectiveSystemPrompt({
    mainThreadAgentDefinition: void 0,
    toolUseContext: context6,
    customSystemPrompt: context6.options.customSystemPrompt,
    defaultSystemPrompt: defaultSysPrompt,
    appendSystemPrompt: context6.options.appendSystemPrompt
  }), [userContext, systemContext] = await Promise.all([
    getUserContext(),
    getSystemContext()
  ]);
  return {
    systemPrompt,
    userContext,
    systemContext,
    toolUseContext: context6,
    forkContextMessages
  };
}
var reactiveCompact2 = null, call13 = async (args, context6) => {
  let { abortController } = context6, { messages } = context6;
  if (messages = getMessagesAfterCompactBoundary(messages), messages.length === 0)
    throw Error("No messages to compact");
  let customInstructions = args.trim();
  try {
    if (!customInstructions) {
      let sessionMemoryResult = await trySessionMemoryCompaction(messages, context6.agentId);
      if (sessionMemoryResult)
        return getUserContext.cache.clear?.(), runPostCompactCleanup(), markPostCompaction(), suppressCompactWarning(), {
          type: "compact",
          compactionResult: sessionMemoryResult,
          displayText: buildDisplayText(context6)
        };
    }
    if (reactiveCompact2?.isReactiveOnlyMode())
      return await compactViaReactive(messages, context6, customInstructions, reactiveCompact2);
    let messagesForCompact = (await microcompactMessages(messages, context6)).messages, result = await compactConversation(messagesForCompact, context6, await getCacheSharingParams(context6, messagesForCompact), !1, customInstructions, !1);
    return setLastSummarizedMessageId(void 0), suppressCompactWarning(), getUserContext.cache.clear?.(), runPostCompactCleanup(), {
      type: "compact",
      compactionResult: result,
      displayText: buildDisplayText(context6, result.userDisplayMessage)
    };
  } catch (error44) {
    if (abortController.signal.aborted)
      throw Error("Compaction canceled.");
    else if (hasExactErrorMessage(error44, ERROR_MESSAGE_NOT_ENOUGH_MESSAGES))
      throw Error(ERROR_MESSAGE_NOT_ENOUGH_MESSAGES);
    else if (hasExactErrorMessage(error44, ERROR_MESSAGE_INCOMPLETE_RESPONSE))
      throw Error(ERROR_MESSAGE_INCOMPLETE_RESPONSE);
    else
      throw logError2(error44), Error(`Error during compaction: ${error44}`);
  }
};
var init_compact2 = __esm(() => {
  init_source();
  init_state();
  init_prompts4();
  init_context2();
  init_shortcutFormat();
  init_promptCacheBreakDetection();
  init_compact();
  init_compactWarningState();
  init_microCompact();
  init_postCompactCleanup();
  init_sessionMemoryCompact();
  init_sessionMemoryUtils();
  init_errors();
  init_hooks5();
  init_log3();
  init_messages3();
  init_contextWindowUpgradeCheck();
  init_systemPrompt();
});
