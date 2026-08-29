// Original: src/utils/hooks/execPromptHook.ts
import { randomUUID as randomUUID27 } from "crypto";
async function execPromptHook(hook, hookName, hookEvent, jsonInput, signal, toolUseContext, messages, toolUseID) {
  let effectiveToolUseID = toolUseID || `hook-${randomUUID27()}`;
  try {
    let processedPrompt = addArgumentsToPrompt(hook.prompt, jsonInput);
    logForDebugging(`Hooks: Processing prompt hook with prompt: ${processedPrompt}`);
    let userMessage = createUserMessage({ content: processedPrompt }), messagesToQuery = messages && messages.length > 0 ? [...messages, userMessage] : [userMessage];
    logForDebugging(`Hooks: Querying model with ${messagesToQuery.length} messages`);
    let hookTimeoutMs = hook.timeout ? hook.timeout * 1000 : 30000, { signal: combinedSignal, cleanup: cleanupSignal } = createCombinedAbortSignal(signal, { timeoutMs: hookTimeoutMs });
    try {
      let response7 = await queryModelWithoutStreaming({
        messages: messagesToQuery,
        systemPrompt: asSystemPrompt([
          `You are evaluating a hook in Claude Code.

Your response must be a JSON object matching one of the following schemas:
1. If the condition is met, return: {"ok": true}
2. If the condition is not met, return: {"ok": false, "reason": "Reason for why it is not met"}`
        ]),
        thinkingConfig: { type: "disabled" },
        tools: toolUseContext.options.tools,
        signal: combinedSignal,
        options: {
          async getToolPermissionContext() {
            return toolUseContext.getAppState().toolPermissionContext;
          },
          model: hook.model ?? getSmallFastModel(),
          toolChoice: void 0,
          isNonInteractiveSession: !0,
          hasAppendSystemPrompt: !1,
          agents: [],
          querySource: "hook_prompt",
          mcpTools: [],
          agentId: toolUseContext.agentId,
          outputFormat: {
            type: "json_schema",
            schema: {
              type: "object",
              properties: {
                ok: { type: "boolean" },
                reason: { type: "string" }
              },
              required: ["ok"],
              additionalProperties: !1
            }
          }
        }
      });
      cleanupSignal();
      let content = extractTextContent(response7.message.content);
      toolUseContext.setResponseLength((length) => length + content.length);
      let fullResponse = content.trim();
      logForDebugging(`Hooks: Model response: ${fullResponse}`);
      let json2 = safeParseJSON(fullResponse);
      if (!json2)
        return logForDebugging(`Hooks: error parsing response as JSON: ${fullResponse}`), {
          hook,
          outcome: "non_blocking_error",
          message: createAttachmentMessage({
            type: "hook_non_blocking_error",
            hookName,
            toolUseID: effectiveToolUseID,
            hookEvent,
            stderr: "JSON validation failed",
            stdout: fullResponse,
            exitCode: 1
          })
        };
      let parsed = hookResponseSchema().safeParse(json2);
      if (!parsed.success)
        return logForDebugging(`Hooks: model response does not conform to expected schema: ${parsed.error.message}`), {
          hook,
          outcome: "non_blocking_error",
          message: createAttachmentMessage({
            type: "hook_non_blocking_error",
            hookName,
            toolUseID: effectiveToolUseID,
            hookEvent,
            stderr: `Schema validation failed: ${parsed.error.message}`,
            stdout: fullResponse,
            exitCode: 1
          })
        };
      if (!parsed.data.ok)
        return logForDebugging(`Hooks: Prompt hook condition was not met: ${parsed.data.reason}`), {
          hook,
          outcome: "blocking",
          blockingError: {
            blockingError: `Prompt hook condition was not met: ${parsed.data.reason}`,
            command: hook.prompt
          },
          preventContinuation: !0,
          stopReason: parsed.data.reason
        };
      return logForDebugging("Hooks: Prompt hook condition was met"), {
        hook,
        outcome: "success",
        message: createAttachmentMessage({
          type: "hook_success",
          hookName,
          toolUseID: effectiveToolUseID,
          hookEvent,
          content: ""
        })
      };
    } catch (error44) {
      if (cleanupSignal(), combinedSignal.aborted)
        return {
          hook,
          outcome: "cancelled"
        };
      throw error44;
    }
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    return logForDebugging(`Hooks: Prompt hook error: ${errorMsg}`), {
      hook,
      outcome: "non_blocking_error",
      message: createAttachmentMessage({
        type: "hook_non_blocking_error",
        hookName,
        toolUseID: effectiveToolUseID,
        hookEvent,
        stderr: `Error executing prompt hook: ${errorMsg}`,
        stdout: "",
        exitCode: 1
      })
    };
  }
}
var init_execPromptHook = __esm(() => {
  init_claude();
  init_attachments2();
  init_combinedAbortSignal();
  init_debug();
  init_errors();
  init_json();
  init_messages3();
  init_model();
  init_hookHelpers();
});
