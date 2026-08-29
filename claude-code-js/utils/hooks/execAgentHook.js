// Original: src/utils/hooks/execAgentHook.ts
import { randomUUID as randomUUID28 } from "crypto";
async function execAgentHook(hook, hookName, hookEvent, jsonInput, signal, toolUseContext, toolUseID, _messages, agentName) {
  let effectiveToolUseID = toolUseID || `hook-${randomUUID28()}`, transcriptPath = toolUseContext.agentId ? getAgentTranscriptPath(toolUseContext.agentId) : getTranscriptPath(), hookStartTime = Date.now();
  try {
    let processedPrompt = addArgumentsToPrompt(hook.prompt, jsonInput);
    logForDebugging(`Hooks: Processing agent hook with prompt: ${processedPrompt}`);
    let agentMessages = [createUserMessage({ content: processedPrompt })];
    logForDebugging(`Hooks: Starting agent query with ${agentMessages.length} messages`);
    let hookTimeoutMs = hook.timeout ? hook.timeout * 1000 : 60000, hookAbortController = createAbortController(), { signal: parentTimeoutSignal, cleanup: cleanupCombinedSignal } = createCombinedAbortSignal(signal, { timeoutMs: hookTimeoutMs }), onParentTimeout = () => hookAbortController.abort();
    parentTimeoutSignal.addEventListener("abort", onParentTimeout);
    let combinedSignal = hookAbortController.signal;
    try {
      let structuredOutputTool = createStructuredOutputTool(), tools = [
        ...toolUseContext.options.tools.filter((tool) => !toolMatchesName(tool, SYNTHETIC_OUTPUT_TOOL_NAME)).filter((tool) => !ALL_AGENT_DISALLOWED_TOOLS.has(tool.name)),
        structuredOutputTool
      ], systemPrompt = asSystemPrompt([
        `You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan. The conversation transcript is available at: ${transcriptPath}
You can read this file to analyze the conversation history if needed.

Use the available tools to inspect the codebase and verify the condition.
Use as few steps as possible - be efficient and direct.

When done, return your result using the ${SYNTHETIC_OUTPUT_TOOL_NAME} tool with:
- ok: true if the condition is met
- ok: false with reason if the condition is not met`
      ]), model = hook.model ?? getSmallFastModel(), MAX_AGENT_TURNS = 50, hookAgentId = asAgentId(`hook-agent-${randomUUID28()}`), agentToolUseContext = {
        ...toolUseContext,
        agentId: hookAgentId,
        abortController: hookAbortController,
        options: {
          ...toolUseContext.options,
          tools,
          mainLoopModel: model,
          isNonInteractiveSession: !0,
          thinkingConfig: { type: "disabled" }
        },
        setInProgressToolUseIDs: () => {},
        getAppState() {
          let appState = toolUseContext.getAppState(), existingSessionRules = appState.toolPermissionContext.alwaysAllowRules.session ?? [];
          return {
            ...appState,
            toolPermissionContext: {
              ...appState.toolPermissionContext,
              mode: "dontAsk",
              alwaysAllowRules: {
                ...appState.toolPermissionContext.alwaysAllowRules,
                session: [...existingSessionRules, `Read(/${transcriptPath})`]
              }
            }
          };
        }
      };
      registerStructuredOutputEnforcement(toolUseContext.setAppState, hookAgentId);
      let structuredOutputResult = null, turnCount = 0, hitMaxTurns = !1;
      for await (let message of query({
        messages: agentMessages,
        systemPrompt,
        userContext: {},
        systemContext: {},
        canUseTool: hasPermissionsToUseTool,
        toolUseContext: agentToolUseContext,
        querySource: "hook_agent"
      })) {
        if (handleMessageFromStream(message, () => {}, (newContent) => toolUseContext.setResponseLength((length) => length + newContent.length), toolUseContext.setStreamMode ?? (() => {}), () => {}), message.type === "stream_event" || message.type === "stream_request_start")
          continue;
        if (message.type === "assistant") {
          if (turnCount++, turnCount >= 50) {
            hitMaxTurns = !0, logForDebugging(`Hooks: Agent turn ${turnCount} hit max turns, aborting`), hookAbortController.abort();
            break;
          }
        }
        if (message.type === "attachment" && message.attachment.type === "structured_output") {
          let parsed = hookResponseSchema().safeParse(message.attachment.data);
          if (parsed.success) {
            structuredOutputResult = parsed.data, logForDebugging(`Hooks: Got structured output: ${jsonStringify(structuredOutputResult)}`), hookAbortController.abort();
            break;
          }
        }
      }
      if (parentTimeoutSignal.removeEventListener("abort", onParentTimeout), cleanupCombinedSignal(), clearSessionHooks(toolUseContext.setAppState, hookAgentId), !structuredOutputResult) {
        if (hitMaxTurns)
          return logForDebugging("Hooks: Agent hook did not complete within 50 turns"), logEvent("tengu_agent_stop_hook_max_turns", {
            durationMs: Date.now() - hookStartTime,
            turnCount,
            agentName
          }), {
            hook,
            outcome: "cancelled"
          };
        return logForDebugging("Hooks: Agent hook did not return structured output"), logEvent("tengu_agent_stop_hook_error", {
          durationMs: Date.now() - hookStartTime,
          turnCount,
          errorType: 1,
          agentName
        }), {
          hook,
          outcome: "cancelled"
        };
      }
      if (!structuredOutputResult.ok)
        return logForDebugging(`Hooks: Agent hook condition was not met: ${structuredOutputResult.reason}`), {
          hook,
          outcome: "blocking",
          blockingError: {
            blockingError: `Agent hook condition was not met: ${structuredOutputResult.reason}`,
            command: hook.prompt
          }
        };
      return logForDebugging("Hooks: Agent hook condition was met"), logEvent("tengu_agent_stop_hook_success", {
        durationMs: Date.now() - hookStartTime,
        turnCount,
        agentName
      }), {
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
      if (parentTimeoutSignal.removeEventListener("abort", onParentTimeout), cleanupCombinedSignal(), combinedSignal.aborted)
        return {
          hook,
          outcome: "cancelled"
        };
      throw error44;
    }
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    return logForDebugging(`Hooks: Agent hook error: ${errorMsg}`), logEvent("tengu_agent_stop_hook_error", {
      durationMs: Date.now() - hookStartTime,
      errorType: 2,
      agentName
    }), {
      hook,
      outcome: "non_blocking_error",
      message: createAttachmentMessage({
        type: "hook_non_blocking_error",
        hookName,
        toolUseID: effectiveToolUseID,
        hookEvent,
        stderr: `Error executing agent hook: ${errorMsg}`,
        stdout: "",
        exitCode: 1
      })
    };
  }
}
var init_execAgentHook = __esm(() => {
  init_query();
  init_Tool();
  init_SyntheticOutputTool();
  init_tools2();
  init_ids();
  init_abortController();
  init_attachments2();
  init_combinedAbortSignal();
  init_debug();
  init_errors();
  init_messages3();
  init_model();
  init_permissions2();
  init_sessionStorage();
  init_slowOperations();
  init_hookHelpers();
  init_sessionHooks();
});
