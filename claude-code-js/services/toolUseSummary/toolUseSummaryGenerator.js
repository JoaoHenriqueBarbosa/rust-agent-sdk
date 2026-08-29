// Original: src/services/toolUseSummary/toolUseSummaryGenerator.ts
async function generateToolUseSummary({
  tools,
  signal,
  isNonInteractiveSession,
  lastAssistantText
}) {
  if (tools.length === 0)
    return null;
  try {
    let toolSummaries = tools.map((tool) => {
      let inputStr = truncateJson(tool.input, 300), outputStr = truncateJson(tool.output, 300);
      return `Tool: ${tool.name}
Input: ${inputStr}
Output: ${outputStr}`;
    }).join(`

`), contextPrefix = lastAssistantText ? `User's intent (from assistant's last message): ${lastAssistantText.slice(0, 200)}

` : "";
    return (await queryHaiku({
      systemPrompt: asSystemPrompt([TOOL_USE_SUMMARY_SYSTEM_PROMPT]),
      userPrompt: `${contextPrefix}Tools completed:

${toolSummaries}

Label:`,
      signal,
      options: {
        querySource: "tool_use_summary_generation",
        enablePromptCaching: !0,
        agents: [],
        isNonInteractiveSession,
        hasAppendSystemPrompt: !1,
        mcpTools: []
      }
    })).message.content.filter((block2) => block2.type === "text").map((block2) => block2.type === "text" ? block2.text : "").join("").trim() || null;
  } catch (error44) {
    let err2 = toError(error44);
    return err2.cause = { errorId: E_TOOL_USE_SUMMARY_GENERATION_FAILED }, logError2(err2), null;
  }
}
function truncateJson(value, maxLength) {
  try {
    let str = jsonStringify(value);
    if (str.length <= maxLength)
      return str;
    return str.slice(0, maxLength - 3) + "...";
  } catch {
    return "[unable to serialize]";
  }
}
var TOOL_USE_SUMMARY_SYSTEM_PROMPT = `Write a short summary label describing what these tool calls accomplished. It appears as a single-line row in a mobile app and truncates around 30 characters, so think git-commit-subject, not sentence.

Keep the verb in past tense and the most distinctive noun. Drop articles, connectors, and long location context first.

Examples:
- Searched in auth/
- Fixed NPE in UserService
- Created signup endpoint
- Read config.json
- Ran failing tests`;
var init_toolUseSummaryGenerator = __esm(() => {
  init_errors();
  init_log3();
  init_slowOperations();
  init_claude();
});
