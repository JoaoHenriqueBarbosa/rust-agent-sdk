// Original: src/utils/sessionTitle.ts
function extractConversationText(messages) {
  let parts = [];
  for (let msg of messages) {
    if (msg.type !== "user" && msg.type !== "assistant")
      continue;
    if ("isMeta" in msg && msg.isMeta)
      continue;
    if ("origin" in msg && msg.origin && msg.origin.kind !== "human")
      continue;
    let content = msg.message.content;
    if (typeof content === "string")
      parts.push(content);
    else if (Array.isArray(content)) {
      for (let block2 of content)
        if ("type" in block2 && block2.type === "text" && "text" in block2)
          parts.push(block2.text);
    }
  }
  let text2 = parts.join(`
`);
  return text2.length > MAX_CONVERSATION_TEXT ? text2.slice(-MAX_CONVERSATION_TEXT) : text2;
}
async function generateSessionTitle(description, signal) {
  let trimmed = description.trim();
  if (!trimmed)
    return null;
  try {
    let result = await queryHaiku({
      systemPrompt: asSystemPrompt([SESSION_TITLE_PROMPT]),
      userPrompt: trimmed,
      outputFormat: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            title: { type: "string" }
          },
          required: ["title"],
          additionalProperties: !1
        }
      },
      signal,
      options: {
        querySource: "generate_session_title",
        agents: [],
        isNonInteractiveSession: getIsNonInteractiveSession(),
        hasAppendSystemPrompt: !1,
        mcpTools: []
      }
    }), text2 = extractTextContent(result.message.content), parsed = titleSchema().safeParse(safeParseJSON(text2)), title = parsed.success ? parsed.data.title.trim() || null : null;
    return logEvent("tengu_session_title_generated", { success: title !== null }), title;
  } catch (error44) {
    return logForDebugging(`generateSessionTitle failed: ${error44}`, {
      level: "error"
    }), logEvent("tengu_session_title_generated", { success: !1 }), null;
  }
}
var MAX_CONVERSATION_TEXT = 1000, SESSION_TITLE_PROMPT = `Generate a concise, sentence-case title (3-7 words) that captures the main topic or goal of this coding session. The title should be clear enough that the user recognizes the session in a list. Use sentence case: capitalize only the first word and proper nouns.

Return JSON with a single "title" field.

Good examples:
{"title": "Fix login button on mobile"}
{"title": "Add OAuth authentication"}
{"title": "Debug failing CI tests"}
{"title": "Refactor API client error handling"}

Bad (too vague): {"title": "Code changes"}
Bad (too long): {"title": "Investigate and fix the issue where the login button does not respond on mobile devices"}
Bad (wrong case): {"title": "Fix Login Button On Mobile"}`, titleSchema;
var init_sessionTitle = __esm(() => {
  init_v4();
  init_state();
  init_claude();
  init_debug();
  init_json();
  init_messages3();
  titleSchema = lazySchema(() => exports_external.object({ title: exports_external.string() }));
});
