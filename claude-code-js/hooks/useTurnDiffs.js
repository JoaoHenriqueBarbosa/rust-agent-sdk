// Original: src/hooks/useTurnDiffs.ts
function isFileEditResult(result) {
  if (!result || typeof result !== "object")
    return !1;
  let r4 = result, hasFilePath = typeof r4.filePath === "string", hasStructuredPatch = Array.isArray(r4.structuredPatch) && r4.structuredPatch.length > 0, isNewFile = r4.type === "create" && typeof r4.content === "string";
  return hasFilePath && (hasStructuredPatch || isNewFile);
}
function isFileWriteOutput(result) {
  return "type" in result && (result.type === "create" || result.type === "update");
}
function countHunkLines(hunks) {
  let added = 0, removed = 0;
  for (let hunk of hunks)
    for (let line of hunk.lines)
      if (line.startsWith("+"))
        added++;
      else if (line.startsWith("-"))
        removed++;
  return { added, removed };
}
function getUserPromptPreview(message) {
  if (message.type !== "user")
    return "";
  let content = message.message.content, text2 = typeof content === "string" ? content : "";
  if (text2.length <= 30)
    return text2;
  return text2.slice(0, 29) + "\u2026";
}
function computeTurnStats(turn) {
  let totalAdded = 0, totalRemoved = 0;
  for (let file2 of turn.files.values())
    totalAdded += file2.linesAdded, totalRemoved += file2.linesRemoved;
  turn.stats = {
    filesChanged: turn.files.size,
    linesAdded: totalAdded,
    linesRemoved: totalRemoved
  };
}
function useTurnDiffs(messages) {
  let cache6 = import_react110.useRef({
    completedTurns: [],
    currentTurn: null,
    lastProcessedIndex: 0,
    lastTurnIndex: 0
  });
  return import_react110.useMemo(() => {
    let c3 = cache6.current;
    if (messages.length < c3.lastProcessedIndex)
      c3.completedTurns = [], c3.currentTurn = null, c3.lastProcessedIndex = 0, c3.lastTurnIndex = 0;
    for (let i5 = c3.lastProcessedIndex;i5 < messages.length; i5++) {
      let message = messages[i5];
      if (!message || message.type !== "user")
        continue;
      if (!(message.toolUseResult || Array.isArray(message.message.content) && message.message.content[0]?.type === "tool_result") && !message.isMeta) {
        if (c3.currentTurn && c3.currentTurn.files.size > 0)
          computeTurnStats(c3.currentTurn), c3.completedTurns.push(c3.currentTurn);
        c3.lastTurnIndex++, c3.currentTurn = {
          turnIndex: c3.lastTurnIndex,
          userPromptPreview: getUserPromptPreview(message),
          timestamp: message.timestamp,
          files: /* @__PURE__ */ new Map,
          stats: { filesChanged: 0, linesAdded: 0, linesRemoved: 0 }
        };
      } else if (c3.currentTurn && message.toolUseResult) {
        let result2 = message.toolUseResult;
        if (isFileEditResult(result2)) {
          let { filePath, structuredPatch: structuredPatch2 } = result2, isNewFile = "type" in result2 && result2.type === "create", fileEntry = c3.currentTurn.files.get(filePath);
          if (!fileEntry)
            fileEntry = {
              filePath,
              hunks: [],
              isNewFile,
              linesAdded: 0,
              linesRemoved: 0
            }, c3.currentTurn.files.set(filePath, fileEntry);
          if (isNewFile && structuredPatch2.length === 0 && isFileWriteOutput(result2)) {
            let lines2 = result2.content.split(`
`), syntheticHunk = {
              oldStart: 0,
              oldLines: 0,
              newStart: 1,
              newLines: lines2.length,
              lines: lines2.map((l3) => "+" + l3)
            };
            fileEntry.hunks.push(syntheticHunk), fileEntry.linesAdded += lines2.length;
          } else {
            fileEntry.hunks.push(...structuredPatch2);
            let { added, removed } = countHunkLines(structuredPatch2);
            fileEntry.linesAdded += added, fileEntry.linesRemoved += removed;
          }
          if (isNewFile)
            fileEntry.isNewFile = !0;
        }
      }
    }
    c3.lastProcessedIndex = messages.length;
    let result = [...c3.completedTurns];
    if (c3.currentTurn && c3.currentTurn.files.size > 0)
      computeTurnStats(c3.currentTurn), result.push(c3.currentTurn);
    return result.reverse();
  }, [messages]);
}
var import_react110;
var init_useTurnDiffs = __esm(() => {
  import_react110 = __toESM(require_react_development(), 1);
});
