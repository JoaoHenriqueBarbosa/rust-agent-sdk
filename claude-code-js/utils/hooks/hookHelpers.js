// Original: src/utils/hooks/hookHelpers.ts
function addArgumentsToPrompt(prompt, jsonInput) {
  return substituteArguments(prompt, jsonInput);
}
function createStructuredOutputTool() {
  return {
    ...SyntheticOutputTool,
    inputSchema: hookResponseSchema(),
    inputJSONSchema: {
      type: "object",
      properties: {
        ok: {
          type: "boolean",
          description: "Whether the condition was met"
        },
        reason: {
          type: "string",
          description: "Reason, if the condition was not met"
        }
      },
      required: ["ok"],
      additionalProperties: !1
    },
    async prompt() {
      return "Use this tool to return your verification result. You MUST call this tool exactly once at the end of your response.";
    }
  };
}
function registerStructuredOutputEnforcement(setAppState, sessionId) {
  addFunctionHook(setAppState, sessionId, "Stop", "", (messages) => hasSuccessfulToolCall(messages, SYNTHETIC_OUTPUT_TOOL_NAME), `You MUST call the ${SYNTHETIC_OUTPUT_TOOL_NAME} tool to complete this request. Call this tool now.`, { timeout: 5000 });
}
var hookResponseSchema;
var init_hookHelpers = __esm(() => {
  init_v4();
  init_SyntheticOutputTool();
  init_argumentSubstitution();
  init_messages3();
  init_sessionHooks();
  hookResponseSchema = lazySchema(() => exports_external.object({
    ok: exports_external.boolean().describe("Whether the condition was met"),
    reason: exports_external.string().describe("Reason, if the condition was not met").optional()
  }));
});
