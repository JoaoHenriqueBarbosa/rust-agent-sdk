// Original: src/utils/contextSuggestions.ts
function generateContextSuggestions(data) {
  let suggestions = [];
  return checkNearCapacity(data, suggestions), checkLargeToolResults(data, suggestions), checkReadResultBloat(data, suggestions), checkMemoryBloat(data, suggestions), checkAutoCompactDisabled(data, suggestions), suggestions.sort((a2, b) => {
    if (a2.severity !== b.severity)
      return a2.severity === "warning" ? -1 : 1;
    return (b.savingsTokens ?? 0) - (a2.savingsTokens ?? 0);
  }), suggestions;
}
function checkNearCapacity(data, suggestions) {
  if (data.percentage >= NEAR_CAPACITY_PERCENT)
    suggestions.push({
      severity: "warning",
      title: `Context is ${data.percentage}% full`,
      detail: data.isAutoCompactEnabled ? "Autocompact will trigger soon, which discards older messages. Use /compact now to control what gets kept." : "Autocompact is disabled. Use /compact to free space, or enable autocompact in /config."
    });
}
function checkLargeToolResults(data, suggestions) {
  if (!data.messageBreakdown)
    return;
  for (let tool of data.messageBreakdown.toolCallsByType) {
    let totalToolTokens = tool.callTokens + tool.resultTokens, percent = totalToolTokens / data.rawMaxTokens * 100;
    if (percent < LARGE_TOOL_RESULT_PERCENT || totalToolTokens < LARGE_TOOL_RESULT_TOKENS)
      continue;
    let suggestion = getLargeToolSuggestion(tool.name, totalToolTokens, percent);
    if (suggestion)
      suggestions.push(suggestion);
  }
}
function getLargeToolSuggestion(toolName, tokens, percent) {
  let tokenStr = formatTokens(tokens);
  switch (toolName) {
    case BASH_TOOL_NAME:
      return {
        severity: "warning",
        title: `Bash results using ${tokenStr} tokens (${percent.toFixed(0)}%)`,
        detail: "Pipe output through head, tail, or grep to reduce result size. Avoid cat on large files \u2014 use Read with offset/limit instead.",
        savingsTokens: Math.floor(tokens * 0.5)
      };
    case FILE_READ_TOOL_NAME:
      return {
        severity: "info",
        title: `Read results using ${tokenStr} tokens (${percent.toFixed(0)}%)`,
        detail: "Use offset and limit parameters to read only the sections you need. Avoid re-reading entire files when you only need a few lines.",
        savingsTokens: Math.floor(tokens * 0.3)
      };
    case GREP_TOOL_NAME:
      return {
        severity: "info",
        title: `Grep results using ${tokenStr} tokens (${percent.toFixed(0)}%)`,
        detail: "Add more specific patterns or use the glob or type parameter to narrow file types. Consider Glob for file discovery instead of Grep.",
        savingsTokens: Math.floor(tokens * 0.3)
      };
    case WEB_FETCH_TOOL_NAME:
      return {
        severity: "info",
        title: `WebFetch results using ${tokenStr} tokens (${percent.toFixed(0)}%)`,
        detail: "Web page content can be very large. Consider extracting only the specific information needed.",
        savingsTokens: Math.floor(tokens * 0.4)
      };
    default:
      if (percent >= 20)
        return {
          severity: "info",
          title: `${toolName} using ${tokenStr} tokens (${percent.toFixed(0)}%)`,
          detail: "This tool is consuming a significant portion of context.",
          savingsTokens: Math.floor(tokens * 0.2)
        };
      return null;
  }
}
function checkReadResultBloat(data, suggestions) {
  if (!data.messageBreakdown)
    return;
  let readTool = data.messageBreakdown.toolCallsByType.find((t2) => t2.name === FILE_READ_TOOL_NAME);
  if (!readTool)
    return;
  let totalReadTokens = readTool.callTokens + readTool.resultTokens, totalReadPercent = totalReadTokens / data.rawMaxTokens * 100, readPercent = readTool.resultTokens / data.rawMaxTokens * 100;
  if (totalReadPercent >= LARGE_TOOL_RESULT_PERCENT && totalReadTokens >= LARGE_TOOL_RESULT_TOKENS)
    return;
  if (readPercent >= READ_BLOAT_PERCENT && readTool.resultTokens >= LARGE_TOOL_RESULT_TOKENS)
    suggestions.push({
      severity: "info",
      title: `File reads using ${formatTokens(readTool.resultTokens)} tokens (${readPercent.toFixed(0)}%)`,
      detail: "If you are re-reading files, consider referencing earlier reads. Use offset/limit for large files.",
      savingsTokens: Math.floor(readTool.resultTokens * 0.3)
    });
}
function checkMemoryBloat(data, suggestions) {
  let totalMemoryTokens = data.memoryFiles.reduce((sum, f) => sum + f.tokens, 0), memoryPercent = totalMemoryTokens / data.rawMaxTokens * 100;
  if (memoryPercent >= MEMORY_HIGH_PERCENT && totalMemoryTokens >= MEMORY_HIGH_TOKENS) {
    let largestFiles = [...data.memoryFiles].sort((a2, b) => b.tokens - a2.tokens).slice(0, 3).map((f) => {
      return `${getDisplayPath(f.path)} (${formatTokens(f.tokens)})`;
    }).join(", ");
    suggestions.push({
      severity: "info",
      title: `Memory files using ${formatTokens(totalMemoryTokens)} tokens (${memoryPercent.toFixed(0)}%)`,
      detail: `Largest: ${largestFiles}. Use /memory to review and prune stale entries.`,
      savingsTokens: Math.floor(totalMemoryTokens * 0.3)
    });
  }
}
function checkAutoCompactDisabled(data, suggestions) {
  if (!data.isAutoCompactEnabled && data.percentage >= 50 && data.percentage < NEAR_CAPACITY_PERCENT)
    suggestions.push({
      severity: "info",
      title: "Autocompact is disabled",
      detail: "Without autocompact, you will hit context limits and lose the conversation. Enable it in /config or use /compact manually."
    });
}
var LARGE_TOOL_RESULT_PERCENT = 15, LARGE_TOOL_RESULT_TOKENS = 1e4, READ_BLOAT_PERCENT = 5, NEAR_CAPACITY_PERCENT = 80, MEMORY_HIGH_PERCENT = 5, MEMORY_HIGH_TOKENS = 5000;
var init_contextSuggestions = __esm(() => {
  init_prompt2();
  init_prompt5();
  init_prompt3();
  init_file();
  init_format();
});
