// Original: src/commands/rename/generateSessionName.ts
async function generateSessionName(messages, signal) {
  let conversationText = extractConversationText(messages);
  if (!conversationText)
    return null;
  try {
    let result = await queryHaiku({
      systemPrompt: asSystemPrompt([
        'Generate a short kebab-case name (2-4 words) that captures the main topic of this conversation. Use lowercase words separated by hyphens. Examples: "fix-login-bug", "add-auth-feature", "refactor-api-client", "debug-test-failures". Return JSON with a "name" field.'
      ]),
      userPrompt: conversationText,
      outputFormat: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            name: { type: "string" }
          },
          required: ["name"],
          additionalProperties: !1
        }
      },
      signal,
      options: {
        querySource: "rename_generate_name",
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        mcpTools: []
      }
    }), content = extractTextContent(result.message.content), response7 = safeParseJSON(content);
    if (response7 && typeof response7 === "object" && "name" in response7 && typeof response7.name === "string")
      return response7.name;
    return null;
  } catch (error44) {
    return logForDebugging(`generateSessionName failed: ${errorMessage(error44)}`, {
      level: "error"
    }), null;
  }
}
var init_generateSessionName = __esm(() => {
  init_claude();
  init_debug();
  init_errors();
  init_json();
  init_messages3();
  init_sessionTitle();
});
