// Original: src/history.ts
import { appendFile as appendFile4, writeFile as writeFile30 } from "fs/promises";
import { join as join106 } from "path";
function getPastedTextRefNumLines(text2) {
  return (text2.match(/\r\n|\r|\n/g) || []).length;
}
function formatPastedTextRef(id, numLines) {
  if (numLines === 0)
    return `[Pasted text #${id}]`;
  return `[Pasted text #${id} +${numLines} lines]`;
}
function formatImageRef(id) {
  return `[Image #${id}]`;
}
function parseReferences(input) {
  let referencePattern = /\[(Pasted text|Image|\.\.\.Truncated text) #(\d+)(?: \+\d+ lines)?(\.)*\]/g;
  return [...input.matchAll(referencePattern)].map((match) => ({
    id: parseInt(match[2] || "0"),
    match: match[0],
    index: match.index
  })).filter((match) => match.id > 0);
}
function expandPastedTextRefs(input, pastedContents) {
  let refs3 = parseReferences(input), expanded = input;
  for (let i5 = refs3.length - 1;i5 >= 0; i5--) {
    let ref = refs3[i5], content = pastedContents[ref.id];
    if (content?.type !== "text")
      continue;
    expanded = expanded.slice(0, ref.index) + content.content + expanded.slice(ref.index + ref.match.length);
  }
  return expanded;
}
function deserializeLogEntry(line) {
  return jsonParse(line);
}
async function* makeLogEntryReader() {
  let currentSession = getSessionId();
  for (let i5 = pendingEntries.length - 1;i5 >= 0; i5--)
    yield pendingEntries[i5];
  let historyPath = join106(getClaudeConfigHomeDir(), "history.jsonl");
  try {
    for await (let line of readLinesReverse(historyPath))
      try {
        let entry = deserializeLogEntry(line);
        if (entry.sessionId === currentSession && skippedTimestamps.has(entry.timestamp))
          continue;
        yield entry;
      } catch (error44) {
        logForDebugging(`Failed to parse history line: ${error44}`);
      }
  } catch (e) {
    if (getErrnoCode(e) === "ENOENT")
      return;
    throw e;
  }
}
async function* makeHistoryReader() {
  for await (let entry of makeLogEntryReader())
    yield await logEntryToHistoryEntry(entry);
}
async function* getHistory() {
  let currentProject = getProjectRoot(), currentSession = getSessionId(), otherSessionEntries = [], yielded = 0;
  for await (let entry of makeLogEntryReader()) {
    if (!entry || typeof entry.project !== "string")
      continue;
    if (entry.project !== currentProject)
      continue;
    if (entry.sessionId === currentSession)
      yield await logEntryToHistoryEntry(entry), yielded++;
    else
      otherSessionEntries.push(entry);
    if (yielded + otherSessionEntries.length >= MAX_HISTORY_ITEMS)
      break;
  }
  for (let entry of otherSessionEntries) {
    if (yielded >= MAX_HISTORY_ITEMS)
      return;
    yield await logEntryToHistoryEntry(entry), yielded++;
  }
}
async function resolveStoredPastedContent(stored) {
  if (stored.content)
    return {
      id: stored.id,
      type: stored.type,
      content: stored.content,
      mediaType: stored.mediaType,
      filename: stored.filename
    };
  if (stored.contentHash) {
    let content = await retrievePastedText(stored.contentHash);
    if (content)
      return {
        id: stored.id,
        type: stored.type,
        content,
        mediaType: stored.mediaType,
        filename: stored.filename
      };
  }
  return null;
}
async function logEntryToHistoryEntry(entry) {
  let pastedContents = {};
  for (let [id, stored] of Object.entries(entry.pastedContents || {})) {
    let resolved = await resolveStoredPastedContent(stored);
    if (resolved)
      pastedContents[Number(id)] = resolved;
  }
  return {
    display: entry.display,
    pastedContents
  };
}
async function immediateFlushHistory() {
  if (pendingEntries.length === 0)
    return;
  let release;
  try {
    let historyPath = join106(getClaudeConfigHomeDir(), "history.jsonl");
    await writeFile30(historyPath, "", {
      encoding: "utf8",
      mode: 384,
      flag: "a"
    }), release = await lock(historyPath, {
      stale: 1e4,
      retries: {
        retries: 3,
        minTimeout: 50
      }
    });
    let jsonLines = pendingEntries.map((entry) => jsonStringify(entry) + `
`);
    pendingEntries = [], await appendFile4(historyPath, jsonLines.join(""), { mode: 384 });
  } catch (error44) {
    logForDebugging(`Failed to write prompt history: ${error44}`);
  } finally {
    if (release)
      await release();
  }
}
async function flushPromptHistory(retries) {
  if (isWriting || pendingEntries.length === 0)
    return;
  if (retries > 5)
    return;
  isWriting = !0;
  try {
    await immediateFlushHistory();
  } finally {
    if (isWriting = !1, pendingEntries.length > 0)
      await sleep3(500), flushPromptHistory(retries + 1);
  }
}
async function addToPromptHistory(command12) {
  let entry = typeof command12 === "string" ? { display: command12, pastedContents: {} } : command12, storedPastedContents = {};
  if (entry.pastedContents)
    for (let [id, content] of Object.entries(entry.pastedContents)) {
      if (content.type === "image")
        continue;
      if (content.content.length <= MAX_PASTED_CONTENT_LENGTH)
        storedPastedContents[Number(id)] = {
          id: content.id,
          type: content.type,
          content: content.content,
          mediaType: content.mediaType,
          filename: content.filename
        };
      else {
        let hash = hashPastedText(content.content);
        storedPastedContents[Number(id)] = {
          id: content.id,
          type: content.type,
          contentHash: hash,
          mediaType: content.mediaType,
          filename: content.filename
        }, storePastedText(hash, content.content);
      }
    }
  let logEntry = {
    ...entry,
    pastedContents: storedPastedContents,
    timestamp: Date.now(),
    project: getProjectRoot(),
    sessionId: getSessionId()
  };
  pendingEntries.push(logEntry), lastAddedEntry = logEntry, currentFlushPromise = flushPromptHistory(0);
}
function addToHistory(command12) {
  if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY))
    return;
  if (!cleanupRegistered4)
    cleanupRegistered4 = !0, registerCleanup(async () => {
      if (currentFlushPromise)
        await currentFlushPromise;
      if (pendingEntries.length > 0)
        await immediateFlushHistory();
    });
  addToPromptHistory(command12);
}
function removeLastFromHistory() {
  if (!lastAddedEntry)
    return;
  let entry = lastAddedEntry;
  lastAddedEntry = null;
  let idx = pendingEntries.lastIndexOf(entry);
  if (idx !== -1)
    pendingEntries.splice(idx, 1);
  else
    skippedTimestamps.add(entry.timestamp);
}
var MAX_HISTORY_ITEMS = 100, MAX_PASTED_CONTENT_LENGTH = 1024, pendingEntries, isWriting = !1, currentFlushPromise = null, cleanupRegistered4 = !1, lastAddedEntry = null, skippedTimestamps;
var init_history = __esm(() => {
  init_state();
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_errors();
  init_fsOperations();
  init_pasteStore();
  init_slowOperations();
  pendingEntries = [], skippedTimestamps = /* @__PURE__ */ new Set;
});
