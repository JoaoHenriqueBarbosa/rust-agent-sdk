// Original: src/utils/permissions/permissionExplainer.ts
function formatToolInput(input) {
  if (typeof input === "string")
    return input;
  try {
    return jsonStringify(input, null, 2);
  } catch {
    return String(input);
  }
}
function extractConversationContext(messages, maxChars = 1000) {
  let assistantMessages = messages.filter((m4) => m4.type === "assistant").slice(-3), contextParts = [], totalChars = 0;
  for (let msg of assistantMessages.reverse()) {
    let textBlocks = msg.message.content.filter((c3) => c3.type === "text").map((c3) => ("text" in c3) ? c3.text : "").join(" ");
    if (textBlocks && totalChars < maxChars) {
      let remaining = maxChars - totalChars, truncated = textBlocks.length > remaining ? textBlocks.slice(0, remaining) + "..." : textBlocks;
      contextParts.unshift(truncated), totalChars += truncated.length;
    }
  }
  return contextParts.join(`

`);
}
function isPermissionExplainerEnabled() {
  return getGlobalConfig().permissionExplainerEnabled !== !1;
}
async function generatePermissionExplanation({
  toolName,
  toolInput,
  toolDescription,
  messages,
  signal
}) {
  if (!isPermissionExplainerEnabled())
    return null;
  let startTime = Date.now();
  try {
    let formattedInput = formatToolInput(toolInput), conversationContext = messages?.length ? extractConversationContext(messages) : "", userPrompt = `Tool: ${toolName}
${toolDescription ? `Description: ${toolDescription}
` : ""}
Input:
${formattedInput}
${conversationContext ? `
Recent conversation context:
${conversationContext}` : ""}

Explain this command in context.`, model = getMainLoopModel(), response7 = await sideQuery({
      model,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
      tools: [EXPLAIN_COMMAND_TOOL],
      tool_choice: { type: "tool", name: "explain_command" },
      signal,
      querySource: "permission_explainer"
    }), latencyMs = Date.now() - startTime;
    logForDebugging(`Permission explainer: API returned in ${latencyMs}ms, stop_reason=${response7.stop_reason}`);
    let toolUseBlock = response7.content.find((c3) => c3.type === "tool_use");
    if (toolUseBlock && toolUseBlock.type === "tool_use") {
      logForDebugging(`Permission explainer: tool input: ${jsonStringify(toolUseBlock.input).slice(0, 500)}`);
      let result = RiskAssessmentSchema().safeParse(toolUseBlock.input);
      if (result.success) {
        let explanation = {
          riskLevel: result.data.riskLevel,
          explanation: result.data.explanation,
          reasoning: result.data.reasoning,
          risk: result.data.risk
        };
        return logEvent("tengu_permission_explainer_generated", {
          tool_name: sanitizeToolNameForAnalytics(toolName),
          risk_level: RISK_LEVEL_NUMERIC[explanation.riskLevel],
          latency_ms: latencyMs
        }), logForDebugging(`Permission explainer: ${explanation.riskLevel} risk for ${toolName} (${latencyMs}ms)`), explanation;
      }
    }
    return logEvent("tengu_permission_explainer_error", {
      tool_name: sanitizeToolNameForAnalytics(toolName),
      error_type: ERROR_TYPE_PARSE,
      latency_ms: latencyMs
    }), logForDebugging("Permission explainer: no parsed output in response"), null;
  } catch (error44) {
    let latencyMs = Date.now() - startTime;
    if (signal.aborted)
      return logForDebugging(`Permission explainer: request aborted for ${toolName}`), null;
    return logForDebugging(`Permission explainer error: ${errorMessage(error44)}`), logError2(error44), logEvent("tengu_permission_explainer_error", {
      tool_name: sanitizeToolNameForAnalytics(toolName),
      error_type: error44 instanceof Error && error44.name === "AbortError" ? ERROR_TYPE_NETWORK : ERROR_TYPE_UNKNOWN2,
      latency_ms: latencyMs
    }), null;
  }
}
var RISK_LEVEL_NUMERIC, ERROR_TYPE_PARSE = 1, ERROR_TYPE_NETWORK = 2, ERROR_TYPE_UNKNOWN2 = 3, SYSTEM_PROMPT = "Analyze shell commands and explain what they do, why you're running them, and potential risks.", EXPLAIN_COMMAND_TOOL, RiskAssessmentSchema;
var init_permissionExplainer = __esm(() => {
  init_v4();
  init_metadata();
  init_config4();
  init_debug();
  init_errors();
  init_log3();
  init_model();
  init_sideQuery();
  init_slowOperations();
  RISK_LEVEL_NUMERIC = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
  }, EXPLAIN_COMMAND_TOOL = {
    name: "explain_command",
    description: "Provide an explanation of a shell command",
    input_schema: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "What this command does (1-2 sentences)"
        },
        reasoning: {
          type: "string",
          description: 'Why YOU are running this command. Start with "I" - e.g. "I need to check the file contents"'
        },
        risk: {
          type: "string",
          description: "What could go wrong, under 15 words"
        },
        riskLevel: {
          type: "string",
          enum: ["LOW", "MEDIUM", "HIGH"],
          description: "LOW (safe dev workflows), MEDIUM (recoverable changes), HIGH (dangerous/irreversible)"
        }
      },
      required: ["explanation", "reasoning", "risk", "riskLevel"]
    }
  }, RiskAssessmentSchema = lazySchema(() => exports_external.object({
    riskLevel: exports_external.enum(["LOW", "MEDIUM", "HIGH"]),
    explanation: exports_external.string(),
    reasoning: exports_external.string(),
    risk: exports_external.string()
  }));
});
