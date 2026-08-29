// Original: src/services/SessionMemory/sessionMemory.ts
import { writeFile as writeFile47 } from "fs/promises";
function isSessionMemoryGateEnabled() {
  return !0;
}
function getSessionMemoryRemoteConfig() {
  return {};
}
function countToolCallsSince(messages, sinceUuid) {
  let toolCallCount = 0, foundStart = sinceUuid === null || sinceUuid === void 0;
  for (let message of messages) {
    if (!foundStart) {
      if (message.uuid === sinceUuid)
        foundStart = !0;
      continue;
    }
    if (message.type === "assistant") {
      let content = message.message.content;
      if (Array.isArray(content))
        toolCallCount += count2(content, (block2) => block2.type === "tool_use");
    }
  }
  return toolCallCount;
}
function shouldExtractMemory(messages) {
  let currentTokenCount = tokenCountWithEstimation(messages);
  if (!isSessionMemoryInitialized()) {
    if (!hasMetInitializationThreshold(currentTokenCount))
      return !1;
    markSessionMemoryInitialized();
  }
  let hasMetTokenThreshold = hasMetUpdateThreshold(currentTokenCount), hasMetToolCallThreshold = countToolCallsSince(messages, lastMemoryMessageUuid) >= getToolCallsBetweenUpdates(), hasToolCallsInLastTurn = hasToolCallsInLastAssistantTurn(messages);
  if (hasMetTokenThreshold && hasMetToolCallThreshold || hasMetTokenThreshold && !hasToolCallsInLastTurn) {
    let lastMessage = messages[messages.length - 1];
    if (lastMessage?.uuid)
      lastMemoryMessageUuid = lastMessage.uuid;
    return !0;
  }
  return !1;
}
async function setupSessionMemoryFile(toolUseContext) {
  let fs18 = getFsImplementation(), sessionMemoryDir = getSessionMemoryDir();
  await fs18.mkdir(sessionMemoryDir, { mode: 448 });
  let memoryPath = getSessionMemoryPath();
  try {
    await writeFile47(memoryPath, "", {
      encoding: "utf-8",
      mode: 384,
      flag: "wx"
    });
    let template = await loadSessionMemoryTemplate();
    await writeFile47(memoryPath, template, {
      encoding: "utf-8",
      mode: 384
    });
  } catch (e) {
    if (getErrnoCode(e) !== "EEXIST")
      throw e;
  }
  toolUseContext.readFileState.delete(memoryPath);
  let result = await FileReadTool.call({ file_path: memoryPath }, toolUseContext), currentMemory = "", output = result.data;
  if (output.type === "text")
    currentMemory = output.file.content;
  return logEvent("tengu_session_memory_file_read", {
    content_length: currentMemory.length
  }), { memoryPath, currentMemory };
}
function initSessionMemory() {
  if (getIsRemoteMode())
    return;
  if (!isAutoCompactEnabled())
    return;
  registerPostSamplingHook(extractSessionMemory);
}
function createMemoryFileCanUseTool(memoryPath) {
  return async (tool, input) => {
    if (tool.name === FILE_EDIT_TOOL_NAME && typeof input === "object" && input !== null && "file_path" in input) {
      let filePath = input.file_path;
      if (typeof filePath === "string" && filePath === memoryPath)
        return { behavior: "allow", updatedInput: input };
    }
    return {
      behavior: "deny",
      message: `only ${FILE_EDIT_TOOL_NAME} on ${memoryPath} is allowed`,
      decisionReason: {
        type: "other",
        reason: `only ${FILE_EDIT_TOOL_NAME} on ${memoryPath} is allowed`
      }
    };
  };
}
function updateLastSummarizedMessageIdIfSafe(messages) {
  if (!hasToolCallsInLastAssistantTurn(messages)) {
    let lastMessage = messages[messages.length - 1];
    if (lastMessage?.uuid)
      setLastSummarizedMessageId(lastMessage.uuid);
  }
}
var lastMemoryMessageUuid, initSessionMemoryConfigIfNeeded, extractSessionMemory;
var init_sessionMemory = __esm(() => {
  init_memoize();
  init_state();
  init_prompts4();
  init_context2();
  init_FileReadTool();
  init_forkedAgent();
  init_fsOperations();
  init_postSamplingHooks();
  init_messages3();
  init_filesystem();
  init_tokens();
  init_autoCompact();
  init_prompts2();
  init_sessionMemoryUtils();
  init_errors();
  initSessionMemoryConfigIfNeeded = memoize_default(() => {
    let remoteConfig = getSessionMemoryRemoteConfig(), config11 = {
      minimumMessageTokensToInit: remoteConfig.minimumMessageTokensToInit && remoteConfig.minimumMessageTokensToInit > 0 ? remoteConfig.minimumMessageTokensToInit : DEFAULT_SESSION_MEMORY_CONFIG.minimumMessageTokensToInit,
      minimumTokensBetweenUpdate: remoteConfig.minimumTokensBetweenUpdate && remoteConfig.minimumTokensBetweenUpdate > 0 ? remoteConfig.minimumTokensBetweenUpdate : DEFAULT_SESSION_MEMORY_CONFIG.minimumTokensBetweenUpdate,
      toolCallsBetweenUpdates: remoteConfig.toolCallsBetweenUpdates && remoteConfig.toolCallsBetweenUpdates > 0 ? remoteConfig.toolCallsBetweenUpdates : DEFAULT_SESSION_MEMORY_CONFIG.toolCallsBetweenUpdates
    };
    setSessionMemoryConfig(config11);
  }), extractSessionMemory = sequential(async function(context7) {
    let { messages, toolUseContext, querySource } = context7;
    if (querySource !== "repl_main_thread")
      return;
    if (!isSessionMemoryGateEnabled())
      return;
    if (initSessionMemoryConfigIfNeeded(), !shouldExtractMemory(messages))
      return;
    markExtractionStarted();
    let setupContext = createSubagentContext(toolUseContext), { memoryPath, currentMemory } = await setupSessionMemoryFile(setupContext), userPrompt = await buildSessionMemoryUpdatePrompt(currentMemory, memoryPath);
    await runForkedAgent({
      promptMessages: [createUserMessage({ content: userPrompt })],
      cacheSafeParams: createCacheSafeParams(context7),
      canUseTool: createMemoryFileCanUseTool(memoryPath),
      querySource: "session_memory",
      forkLabel: "session_memory",
      overrides: { readFileState: setupContext.readFileState }
    });
    let lastMessage = messages[messages.length - 1], usage = lastMessage ? getTokenUsage(lastMessage) : void 0, config11 = getSessionMemoryConfig();
    logEvent("tengu_session_memory_extraction", {
      input_tokens: usage?.input_tokens,
      output_tokens: usage?.output_tokens,
      cache_read_input_tokens: usage?.cache_read_input_tokens ?? void 0,
      cache_creation_input_tokens: usage?.cache_creation_input_tokens ?? void 0,
      config_min_message_tokens_to_init: config11.minimumMessageTokensToInit,
      config_min_tokens_between_update: config11.minimumTokensBetweenUpdate,
      config_tool_calls_between_updates: config11.toolCallsBetweenUpdates
    }), recordExtractionTokenCount(tokenCountWithEstimation(messages)), updateLastSummarizedMessageIdIfSafe(messages), markExtractionCompleted();
  });
});
