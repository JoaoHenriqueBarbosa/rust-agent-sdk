// Original: src/utils/sideQuestion.ts
function findBtwTriggerPositions(text2) {
  let positions = [], matches2 = text2.matchAll(BTW_PATTERN);
  for (let match of matches2)
    if (match.index !== void 0)
      positions.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
  return positions;
}
async function runSideQuestion({
  question,
  cacheSafeParams
}) {
  let wrappedQuestion = `<system-reminder>This is a side question from the user. You must answer this question directly in a single response.

IMPORTANT CONTEXT:
- You are a separate, lightweight agent spawned to answer this one question
- The main agent is NOT interrupted - it continues working independently in the background
- You share the conversation context but are a completely separate instance
- Do NOT reference being interrupted or what you were "previously doing" - that framing is incorrect

CRITICAL CONSTRAINTS:
- You have NO tools available - you cannot read files, run commands, search, or take any actions
- This is a one-off response - there will be no follow-up turns
- You can ONLY provide information based on what you already know from the conversation context
- NEVER say things like "Let me try...", "I'll now...", "Let me check...", or promise to take any action
- If you don't know the answer, say so - do not offer to look it up or investigate

Simply answer the question with the information you have.</system-reminder>

${question}`, agentResult = await runForkedAgent({
    promptMessages: [createUserMessage({ content: wrappedQuestion })],
    cacheSafeParams,
    canUseTool: async () => ({
      behavior: "deny",
      message: "Side questions cannot use tools",
      decisionReason: { type: "other", reason: "side_question" }
    }),
    querySource: "side_question",
    forkLabel: "side_question",
    maxTurns: 1,
    skipCacheWrite: !0
  });
  return {
    response: extractSideQuestionResponse(agentResult.messages),
    usage: agentResult.totalUsage
  };
}
function extractSideQuestionResponse(messages) {
  let assistantBlocks = messages.flatMap((m4) => m4.type === "assistant" ? m4.message.content : []);
  if (assistantBlocks.length > 0) {
    let text2 = extractTextContent(assistantBlocks, `

`).trim();
    if (text2)
      return text2;
    let toolUse = assistantBlocks.find((b) => b.type === "tool_use");
    if (toolUse)
      return `(The model tried to call ${"name" in toolUse ? toolUse.name : "a tool"} instead of answering directly. Try rephrasing or ask in the main conversation.)`;
  }
  let apiErr = messages.find((m4) => m4.type === "system" && ("subtype" in m4) && m4.subtype === "api_error");
  if (apiErr)
    return `(API error: ${formatAPIError(apiErr.error)})`;
  return null;
}
var BTW_PATTERN;
var init_sideQuestion = __esm(() => {
  init_errorUtils();
  init_forkedAgent();
  init_messages3();
  BTW_PATTERN = /^\/btw\b/gi;
});
