// Original: src/services/SessionMemory/sessionMemoryUtils.ts
function getLastSummarizedMessageId() {
  return lastSummarizedMessageId;
}
function setLastSummarizedMessageId(messageId) {
  lastSummarizedMessageId = messageId;
}
function markExtractionStarted() {
  extractionStartedAt = Date.now();
}
function markExtractionCompleted() {
  extractionStartedAt = void 0;
}
async function waitForSessionMemoryExtraction() {
  let startTime = Date.now();
  while (extractionStartedAt) {
    if (Date.now() - extractionStartedAt > EXTRACTION_STALE_THRESHOLD_MS)
      return;
    if (Date.now() - startTime > EXTRACTION_WAIT_TIMEOUT_MS)
      return;
    await sleep3(1000);
  }
}
async function getSessionMemoryContent() {
  let fs15 = getFsImplementation(), memoryPath = getSessionMemoryPath();
  try {
    let content = await fs15.readFile(memoryPath, { encoding: "utf-8" });
    return logEvent("tengu_session_memory_loaded", {
      content_length: content.length
    }), content;
  } catch (e) {
    if (isFsInaccessible(e))
      return null;
    throw e;
  }
}
function setSessionMemoryConfig(config10) {
  sessionMemoryConfig = {
    ...sessionMemoryConfig,
    ...config10
  };
}
function getSessionMemoryConfig() {
  return { ...sessionMemoryConfig };
}
function recordExtractionTokenCount(currentTokenCount) {
  tokensAtLastExtraction = currentTokenCount;
}
function isSessionMemoryInitialized() {
  return sessionMemoryInitialized;
}
function markSessionMemoryInitialized() {
  sessionMemoryInitialized = !0;
}
function hasMetInitializationThreshold(currentTokenCount) {
  return currentTokenCount >= sessionMemoryConfig.minimumMessageTokensToInit;
}
function hasMetUpdateThreshold(currentTokenCount) {
  return currentTokenCount - tokensAtLastExtraction >= sessionMemoryConfig.minimumTokensBetweenUpdate;
}
function getToolCallsBetweenUpdates() {
  return sessionMemoryConfig.toolCallsBetweenUpdates;
}
var EXTRACTION_WAIT_TIMEOUT_MS = 15000, EXTRACTION_STALE_THRESHOLD_MS = 60000, DEFAULT_SESSION_MEMORY_CONFIG, sessionMemoryConfig, lastSummarizedMessageId, extractionStartedAt, tokensAtLastExtraction = 0, sessionMemoryInitialized = !1;
var init_sessionMemoryUtils = __esm(() => {
  init_errors();
  init_fsOperations();
  init_filesystem();
  DEFAULT_SESSION_MEMORY_CONFIG = {
    minimumMessageTokensToInit: 1e4,
    minimumTokensBetweenUpdate: 5000,
    toolCallsBetweenUpdates: 3
  }, sessionMemoryConfig = {
    ...DEFAULT_SESSION_MEMORY_CONFIG
  };
});
