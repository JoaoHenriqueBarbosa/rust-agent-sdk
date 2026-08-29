// Original: src/utils/toolResultStorage.ts
import { mkdir as mkdir7, writeFile as writeFile8 } from "fs/promises";
import { join as join54 } from "path";
function getPersistenceThreshold(toolName, declaredMaxResultSizeChars) {
  if (!Number.isFinite(declaredMaxResultSizeChars))
    return declaredMaxResultSizeChars;
  return Math.min(declaredMaxResultSizeChars, DEFAULT_MAX_RESULT_SIZE_CHARS);
}
function getSessionDir() {
  return join54(getProjectDir2(getOriginalCwd()), getSessionId());
}
function getToolResultsDir() {
  return join54(getSessionDir(), TOOL_RESULTS_SUBDIR);
}
function getToolResultPath(id, isJson) {
  let ext = isJson ? "json" : "txt";
  return join54(getToolResultsDir(), `${id}.${ext}`);
}
async function ensureToolResultsDir() {
  try {
    await mkdir7(getToolResultsDir(), { recursive: !0 });
  } catch {}
}
async function persistToolResult(content, toolUseId) {
  let isJson = Array.isArray(content);
  if (isJson) {
    if (content.some((block2) => block2.type !== "text"))
      return {
        error: "Cannot persist tool results containing non-text content"
      };
  }
  await ensureToolResultsDir();
  let filepath = getToolResultPath(toolUseId, isJson), contentStr = isJson ? jsonStringify(content, null, 2) : content;
  try {
    await writeFile8(filepath, contentStr, { encoding: "utf-8", flag: "wx" }), logForDebugging(`Persisted tool result to ${filepath} (${formatFileSize(contentStr.length)})`);
  } catch (error44) {
    if (getErrnoCode(error44) !== "EEXIST")
      return logError2(toError(error44)), { error: getFileSystemErrorMessage(toError(error44)) };
  }
  let { preview, hasMore } = generatePreview(contentStr, PREVIEW_SIZE_BYTES);
  return {
    filepath,
    originalSize: contentStr.length,
    isJson,
    preview,
    hasMore
  };
}
function buildLargeToolResultMessage(result) {
  let message = `${PERSISTED_OUTPUT_TAG}
`;
  return message += `Output too large (${formatFileSize(result.originalSize)}). Full output saved to: ${result.filepath}

`, message += `Preview (first ${formatFileSize(PREVIEW_SIZE_BYTES)}):
`, message += result.preview, message += result.hasMore ? `
...
` : `
`, message += PERSISTED_OUTPUT_CLOSING_TAG, message;
}
async function processToolResultBlock(tool, toolUseResult, toolUseID) {
  let toolResultBlock = tool.mapToolResultToToolResultBlockParam(toolUseResult, toolUseID);
  return maybePersistLargeToolResult(toolResultBlock, tool.name, getPersistenceThreshold(tool.name, tool.maxResultSizeChars));
}
async function processPreMappedToolResultBlock(toolResultBlock, toolName, maxResultSizeChars) {
  return maybePersistLargeToolResult(toolResultBlock, toolName, getPersistenceThreshold(toolName, maxResultSizeChars));
}
function isToolResultContentEmpty(content) {
  if (!content)
    return !0;
  if (typeof content === "string")
    return content.trim() === "";
  if (!Array.isArray(content))
    return !1;
  if (content.length === 0)
    return !0;
  return content.every((block2) => typeof block2 === "object" && ("type" in block2) && block2.type === "text" && ("text" in block2) && (typeof block2.text !== "string" || block2.text.trim() === ""));
}
async function maybePersistLargeToolResult(toolResultBlock, toolName, persistenceThreshold) {
  let content = toolResultBlock.content;
  if (isToolResultContentEmpty(content))
    return logEvent("tengu_tool_empty_result", {
      toolName: sanitizeToolNameForAnalytics(toolName)
    }), {
      ...toolResultBlock,
      content: `(${toolName} completed with no output)`
    };
  if (!content)
    return toolResultBlock;
  if (hasImageBlock(content))
    return toolResultBlock;
  let size = contentSize(content), threshold = persistenceThreshold ?? MAX_TOOL_RESULT_BYTES;
  if (size <= threshold)
    return toolResultBlock;
  let result = await persistToolResult(content, toolResultBlock.tool_use_id);
  if (isPersistError(result))
    return toolResultBlock;
  let message = buildLargeToolResultMessage(result);
  return logEvent("tengu_tool_result_persisted", {
    toolName: sanitizeToolNameForAnalytics(toolName),
    originalSizeBytes: result.originalSize,
    persistedSizeBytes: message.length,
    estimatedOriginalTokens: Math.ceil(result.originalSize / BYTES_PER_TOKEN),
    estimatedPersistedTokens: Math.ceil(message.length / BYTES_PER_TOKEN),
    thresholdUsed: threshold
  }), { ...toolResultBlock, content: message };
}
function generatePreview(content, maxBytes) {
  if (content.length <= maxBytes)
    return { preview: content, hasMore: !1 };
  let lastNewline = content.slice(0, maxBytes).lastIndexOf(`
`), cutPoint = lastNewline > maxBytes * 0.5 ? lastNewline : maxBytes;
  return { preview: content.slice(0, cutPoint), hasMore: !0 };
}
function isPersistError(result) {
  return "error" in result;
}
function createContentReplacementState() {
  return { seenIds: /* @__PURE__ */ new Set, replacements: /* @__PURE__ */ new Map };
}
function cloneContentReplacementState(source) {
  return {
    seenIds: new Set(source.seenIds),
    replacements: new Map(source.replacements)
  };
}
function getPerMessageBudgetLimit() {
  return MAX_TOOL_RESULTS_PER_MESSAGE_CHARS;
}
function provisionContentReplacementState(initialMessages, initialContentReplacements) {
  return;
}
function isContentAlreadyCompacted(content) {
  return typeof content === "string" && content.startsWith(PERSISTED_OUTPUT_TAG);
}
function hasImageBlock(content) {
  return Array.isArray(content) && content.some((b) => typeof b === "object" && ("type" in b) && b.type === "image");
}
function contentSize(content) {
  if (typeof content === "string")
    return content.length;
  return content.reduce((sum, b) => sum + (b.type === "text" ? b.text.length : 0), 0);
}
function buildToolNameMap(messages) {
  let map8 = /* @__PURE__ */ new Map;
  for (let message of messages) {
    if (message.type !== "assistant")
      continue;
    let content = message.message.content;
    if (!Array.isArray(content))
      continue;
    for (let block2 of content)
      if (block2.type === "tool_use")
        map8.set(block2.id, block2.name);
  }
  return map8;
}
function collectCandidatesFromMessage(message) {
  if (message.type !== "user" || !Array.isArray(message.message.content))
    return [];
  return message.message.content.flatMap((block2) => {
    if (block2.type !== "tool_result" || !block2.content)
      return [];
    if (isContentAlreadyCompacted(block2.content))
      return [];
    if (hasImageBlock(block2.content))
      return [];
    return [
      {
        toolUseId: block2.tool_use_id,
        content: block2.content,
        size: contentSize(block2.content)
      }
    ];
  });
}
function collectCandidatesByMessage(messages) {
  let groups = [], current = [], flush = () => {
    if (current.length > 0)
      groups.push(current);
    current = [];
  }, seenAsstIds = /* @__PURE__ */ new Set;
  for (let message of messages)
    if (message.type === "user")
      current.push(...collectCandidatesFromMessage(message));
    else if (message.type === "assistant") {
      if (!seenAsstIds.has(message.message.id))
        flush(), seenAsstIds.add(message.message.id);
    }
  return flush(), groups;
}
function partitionByPriorDecision(candidates, state3) {
  return candidates.reduce((acc, c3) => {
    let replacement = state3.replacements.get(c3.toolUseId);
    if (replacement !== void 0)
      acc.mustReapply.push({ ...c3, replacement });
    else if (state3.seenIds.has(c3.toolUseId))
      acc.frozen.push(c3);
    else
      acc.fresh.push(c3);
    return acc;
  }, { mustReapply: [], frozen: [], fresh: [] });
}
function selectFreshToReplace(fresh, frozenSize, limit) {
  let sorted = [...fresh].sort((a2, b) => b.size - a2.size), selected = [], remaining = frozenSize + fresh.reduce((sum, c3) => sum + c3.size, 0);
  for (let c3 of sorted) {
    if (remaining <= limit)
      break;
    selected.push(c3), remaining -= c3.size;
  }
  return selected;
}
function replaceToolResultContents(messages, replacementMap) {
  return messages.map((message) => {
    if (message.type !== "user" || !Array.isArray(message.message.content))
      return message;
    let content = message.message.content;
    if (!content.some((b) => b.type === "tool_result" && replacementMap.has(b.tool_use_id)))
      return message;
    return {
      ...message,
      message: {
        ...message.message,
        content: content.map((block2) => {
          if (block2.type !== "tool_result")
            return block2;
          let replacement = replacementMap.get(block2.tool_use_id);
          return replacement === void 0 ? block2 : { ...block2, content: replacement };
        })
      }
    };
  });
}
async function buildReplacement(candidate) {
  let result = await persistToolResult(candidate.content, candidate.toolUseId);
  if (isPersistError(result))
    return null;
  return {
    content: buildLargeToolResultMessage(result),
    originalSize: result.originalSize
  };
}
async function enforceToolResultBudget(messages, state3, skipToolNames = /* @__PURE__ */ new Set) {
  let candidatesByMessage = collectCandidatesByMessage(messages), nameByToolUseId = skipToolNames.size > 0 ? buildToolNameMap(messages) : void 0, shouldSkip = (id) => nameByToolUseId !== void 0 && skipToolNames.has(nameByToolUseId.get(id) ?? ""), limit = getPerMessageBudgetLimit(), replacementMap = /* @__PURE__ */ new Map, toPersist = [], reappliedCount = 0, messagesOverBudget = 0;
  for (let candidates of candidatesByMessage) {
    let { mustReapply, frozen, fresh } = partitionByPriorDecision(candidates, state3);
    if (mustReapply.forEach((c3) => replacementMap.set(c3.toolUseId, c3.replacement)), reappliedCount += mustReapply.length, fresh.length === 0) {
      candidates.forEach((c3) => state3.seenIds.add(c3.toolUseId));
      continue;
    }
    fresh.filter((c3) => shouldSkip(c3.toolUseId)).forEach((c3) => state3.seenIds.add(c3.toolUseId));
    let eligible2 = fresh.filter((c3) => !shouldSkip(c3.toolUseId)), frozenSize = frozen.reduce((sum, c3) => sum + c3.size, 0), freshSize = eligible2.reduce((sum, c3) => sum + c3.size, 0), selected = frozenSize + freshSize > limit ? selectFreshToReplace(eligible2, frozenSize, limit) : [], selectedIds = new Set(selected.map((c3) => c3.toolUseId));
    if (candidates.filter((c3) => !selectedIds.has(c3.toolUseId)).forEach((c3) => state3.seenIds.add(c3.toolUseId)), selected.length === 0)
      continue;
    messagesOverBudget++, toPersist.push(...selected);
  }
  if (replacementMap.size === 0 && toPersist.length === 0)
    return { messages, newlyReplaced: [] };
  let freshReplacements = await Promise.all(toPersist.map(async (c3) => [c3, await buildReplacement(c3)])), newlyReplaced = [], replacedSize = 0;
  for (let [candidate, replacement] of freshReplacements) {
    if (state3.seenIds.add(candidate.toolUseId), replacement === null)
      continue;
    replacedSize += candidate.size, replacementMap.set(candidate.toolUseId, replacement.content), state3.replacements.set(candidate.toolUseId, replacement.content), newlyReplaced.push({
      kind: "tool-result",
      toolUseId: candidate.toolUseId,
      replacement: replacement.content
    }), logEvent("tengu_tool_result_persisted_message_budget", {
      originalSizeBytes: replacement.originalSize,
      persistedSizeBytes: replacement.content.length,
      estimatedOriginalTokens: Math.ceil(replacement.originalSize / BYTES_PER_TOKEN),
      estimatedPersistedTokens: Math.ceil(replacement.content.length / BYTES_PER_TOKEN)
    });
  }
  if (replacementMap.size === 0)
    return { messages, newlyReplaced: [] };
  if (newlyReplaced.length > 0)
    logForDebugging(`Per-message budget: persisted ${newlyReplaced.length} tool results across ${messagesOverBudget} over-budget message(s), shed ~${formatFileSize(replacedSize)}, ${reappliedCount} re-applied`), logEvent("tengu_message_level_tool_result_budget_enforced", {
      resultsPersisted: newlyReplaced.length,
      messagesOverBudget,
      replacedSizeBytes: replacedSize,
      reapplied: reappliedCount
    });
  return {
    messages: replaceToolResultContents(messages, replacementMap),
    newlyReplaced
  };
}
async function applyToolResultBudget(messages, state3, writeToTranscript, skipToolNames) {
  if (!state3)
    return messages;
  let result = await enforceToolResultBudget(messages, state3, skipToolNames);
  if (result.newlyReplaced.length > 0)
    writeToTranscript?.(result.newlyReplaced);
  return result.messages;
}
function reconstructContentReplacementState(messages, records, inheritedReplacements) {
  let state3 = createContentReplacementState(), candidateIds = new Set(collectCandidatesByMessage(messages).flat().map((c3) => c3.toolUseId));
  for (let id of candidateIds)
    state3.seenIds.add(id);
  for (let r4 of records)
    if (r4.kind === "tool-result" && candidateIds.has(r4.toolUseId))
      state3.replacements.set(r4.toolUseId, r4.replacement);
  if (inheritedReplacements) {
    for (let [id, replacement] of inheritedReplacements)
      if (candidateIds.has(id) && !state3.replacements.has(id))
        state3.replacements.set(id, replacement);
  }
  return state3;
}
function reconstructForSubagentResume(parentState, resumedMessages, sidechainRecords) {
  if (!parentState)
    return;
  return reconstructContentReplacementState(resumedMessages, sidechainRecords, parentState.replacements);
}
function getFileSystemErrorMessage(error44) {
  let nodeError = error44;
  if (nodeError.code)
    switch (nodeError.code) {
      case "ENOENT":
        return `Directory not found: ${nodeError.path ?? "unknown path"}`;
      case "EACCES":
        return `Permission denied: ${nodeError.path ?? "unknown path"}`;
      case "ENOSPC":
        return "No space left on device";
      case "EROFS":
        return "Read-only file system";
      case "EMFILE":
        return "Too many open files";
      case "EEXIST":
        return `File already exists: ${nodeError.path ?? "unknown path"}`;
      default:
        return `${nodeError.code}: ${nodeError.message}`;
    }
  return error44.message;
}
var TOOL_RESULTS_SUBDIR = "tool-results", PERSISTED_OUTPUT_TAG = "<persisted-output>", PERSISTED_OUTPUT_CLOSING_TAG = "</persisted-output>", PREVIEW_SIZE_BYTES = 2000;
var init_toolResultStorage = __esm(() => {
  init_state();
  init_metadata();
  init_debug();
  init_errors();
  init_format();
  init_log3();
  init_sessionStorage();
  init_slowOperations();
});
