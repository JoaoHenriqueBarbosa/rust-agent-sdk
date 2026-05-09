// Original: src/services/tools/toolHooks.ts
async function* runPostToolUseHooks(toolUseContext, tool, toolUseID, messageId, toolInput, toolResponse, requestId, mcpServerType, mcpServerBaseUrl) {
  let postToolStartTime = Date.now();
  try {
    let permissionMode = toolUseContext.getAppState().toolPermissionContext.mode, toolOutput = toolResponse;
    for await (let result of executePostToolHooks(tool.name, toolUseID, toolInput, toolOutput, toolUseContext, permissionMode, toolUseContext.abortController.signal))
      try {
        if (result.message?.type === "attachment" && result.message.attachment.type === "hook_cancelled") {
          logEvent("tengu_post_tool_hooks_cancelled", {
            toolName: sanitizeToolNameForAnalytics(tool.name),
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth
          }), yield {
            message: createAttachmentMessage({
              type: "hook_cancelled",
              hookName: `PostToolUse:${tool.name}`,
              toolUseID,
              hookEvent: "PostToolUse"
            })
          };
          continue;
        }
        if (result.message && !(result.message.type === "attachment" && result.message.attachment.type === "hook_blocking_error"))
          yield { message: result.message };
        if (result.blockingError)
          yield {
            message: createAttachmentMessage({
              type: "hook_blocking_error",
              hookName: `PostToolUse:${tool.name}`,
              toolUseID,
              hookEvent: "PostToolUse",
              blockingError: result.blockingError
            })
          };
        if (result.preventContinuation) {
          yield {
            message: createAttachmentMessage({
              type: "hook_stopped_continuation",
              message: result.stopReason || "Execution stopped by PostToolUse hook",
              hookName: `PostToolUse:${tool.name}`,
              toolUseID,
              hookEvent: "PostToolUse"
            })
          };
          return;
        }
        if (result.additionalContexts && result.additionalContexts.length > 0)
          yield {
            message: createAttachmentMessage({
              type: "hook_additional_context",
              content: result.additionalContexts,
              hookName: `PostToolUse:${tool.name}`,
              toolUseID,
              hookEvent: "PostToolUse"
            })
          };
        if (result.updatedMCPToolOutput && isMcpTool(tool))
          toolOutput = result.updatedMCPToolOutput, yield {
            updatedMCPToolOutput: toolOutput
          };
      } catch (error44) {
        let postToolDurationMs = Date.now() - postToolStartTime;
        logEvent("tengu_post_tool_hook_error", {
          messageID: messageId,
          toolName: sanitizeToolNameForAnalytics(tool.name),
          isMcp: tool.isMcp ?? !1,
          duration: postToolDurationMs,
          queryChainId: toolUseContext.queryTracking?.chainId,
          queryDepth: toolUseContext.queryTracking?.depth,
          ...mcpServerType ? {
            mcpServerType
          } : {},
          ...requestId ? {
            requestId
          } : {}
        }), yield {
          message: createAttachmentMessage({
            type: "hook_error_during_execution",
            content: formatError3(error44),
            hookName: `PostToolUse:${tool.name}`,
            toolUseID,
            hookEvent: "PostToolUse"
          })
        };
      }
  } catch (error44) {
    logError2(error44);
  }
}
async function* runPostToolUseFailureHooks(toolUseContext, tool, toolUseID, messageId, processedInput, error44, isInterrupt, requestId, mcpServerType, mcpServerBaseUrl) {
  let postToolStartTime = Date.now();
  try {
    let permissionMode = toolUseContext.getAppState().toolPermissionContext.mode;
    for await (let result of executePostToolUseFailureHooks(tool.name, toolUseID, processedInput, error44, toolUseContext, isInterrupt, permissionMode, toolUseContext.abortController.signal))
      try {
        if (result.message?.type === "attachment" && result.message.attachment.type === "hook_cancelled") {
          logEvent("tengu_post_tool_failure_hooks_cancelled", {
            toolName: sanitizeToolNameForAnalytics(tool.name),
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth
          }), yield {
            message: createAttachmentMessage({
              type: "hook_cancelled",
              hookName: `PostToolUseFailure:${tool.name}`,
              toolUseID,
              hookEvent: "PostToolUseFailure"
            })
          };
          continue;
        }
        if (result.message && !(result.message.type === "attachment" && result.message.attachment.type === "hook_blocking_error"))
          yield { message: result.message };
        if (result.blockingError)
          yield {
            message: createAttachmentMessage({
              type: "hook_blocking_error",
              hookName: `PostToolUseFailure:${tool.name}`,
              toolUseID,
              hookEvent: "PostToolUseFailure",
              blockingError: result.blockingError
            })
          };
        if (result.additionalContexts && result.additionalContexts.length > 0)
          yield {
            message: createAttachmentMessage({
              type: "hook_additional_context",
              content: result.additionalContexts,
              hookName: `PostToolUseFailure:${tool.name}`,
              toolUseID,
              hookEvent: "PostToolUseFailure"
            })
          };
      } catch (hookError) {
        let postToolDurationMs = Date.now() - postToolStartTime;
        logEvent("tengu_post_tool_failure_hook_error", {
          messageID: messageId,
          toolName: sanitizeToolNameForAnalytics(tool.name),
          isMcp: tool.isMcp ?? !1,
          duration: postToolDurationMs,
          queryChainId: toolUseContext.queryTracking?.chainId,
          queryDepth: toolUseContext.queryTracking?.depth,
          ...mcpServerType ? {
            mcpServerType
          } : {},
          ...requestId ? {
            requestId
          } : {}
        }), yield {
          message: createAttachmentMessage({
            type: "hook_error_during_execution",
            content: formatError3(hookError),
            hookName: `PostToolUseFailure:${tool.name}`,
            toolUseID,
            hookEvent: "PostToolUseFailure"
          })
        };
      }
  } catch (outerError) {
    logError2(outerError);
  }
}
async function resolveHookPermissionDecision(hookPermissionResult, tool, input, toolUseContext, canUseTool, assistantMessage, toolUseID) {
  let requiresInteraction = tool.requiresUserInteraction?.(), requireCanUseTool = toolUseContext.requireCanUseTool;
  if (hookPermissionResult?.behavior === "allow") {
    let hookInput = hookPermissionResult.updatedInput ?? input, interactionSatisfied = requiresInteraction && hookPermissionResult.updatedInput !== void 0;
    if (requiresInteraction && !interactionSatisfied || requireCanUseTool)
      return logForDebugging(`Hook approved tool use for ${tool.name}, but canUseTool is required`), {
        decision: await canUseTool(tool, hookInput, toolUseContext, assistantMessage, toolUseID),
        input: hookInput
      };
    let ruleCheck = await checkRuleBasedPermissions(tool, hookInput, toolUseContext);
    if (ruleCheck === null)
      return logForDebugging(interactionSatisfied ? `Hook satisfied user interaction for ${tool.name} via updatedInput` : `Hook approved tool use for ${tool.name}, bypassing permission prompt`), { decision: hookPermissionResult, input: hookInput };
    if (ruleCheck.behavior === "deny")
      return logForDebugging(`Hook approved tool use for ${tool.name}, but deny rule overrides: ${ruleCheck.message}`), { decision: ruleCheck, input: hookInput };
    return logForDebugging(`Hook approved tool use for ${tool.name}, but ask rule requires prompt`), {
      decision: await canUseTool(tool, hookInput, toolUseContext, assistantMessage, toolUseID),
      input: hookInput
    };
  }
  if (hookPermissionResult?.behavior === "deny")
    return logForDebugging(`Hook denied tool use for ${tool.name}`), { decision: hookPermissionResult, input };
  let forceDecision = hookPermissionResult?.behavior === "ask" ? hookPermissionResult : void 0, askInput = hookPermissionResult?.behavior === "ask" && hookPermissionResult.updatedInput ? hookPermissionResult.updatedInput : input;
  return {
    decision: await canUseTool(tool, askInput, toolUseContext, assistantMessage, toolUseID, forceDecision),
    input: askInput
  };
}
async function* runPreToolUseHooks(toolUseContext, tool, processedInput, toolUseID, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
  let hookStartTime = Date.now();
  try {
    let appState = toolUseContext.getAppState();
    for await (let result of executePreToolHooks(tool.name, toolUseID, processedInput, toolUseContext, appState.toolPermissionContext.mode, toolUseContext.abortController.signal, void 0, toolUseContext.requestPrompt, tool.getToolUseSummary?.(processedInput)))
      try {
        if (result.message)
          yield { type: "message", message: { message: result.message } };
        if (result.blockingError) {
          let denialMessage = getPreToolHookBlockingMessage(`PreToolUse:${tool.name}`, result.blockingError);
          yield {
            type: "hookPermissionResult",
            hookPermissionResult: {
              behavior: "deny",
              message: denialMessage,
              decisionReason: {
                type: "hook",
                hookName: `PreToolUse:${tool.name}`,
                reason: denialMessage
              }
            }
          };
        }
        if (result.preventContinuation) {
          if (yield {
            type: "preventContinuation",
            shouldPreventContinuation: !0
          }, result.stopReason)
            yield { type: "stopReason", stopReason: result.stopReason };
        }
        if (result.permissionBehavior !== void 0) {
          logForDebugging(`Hook result has permissionBehavior=${result.permissionBehavior}`);
          let decisionReason = {
            type: "hook",
            hookName: `PreToolUse:${tool.name}`,
            hookSource: result.hookSource,
            reason: result.hookPermissionDecisionReason
          };
          if (result.permissionBehavior === "allow")
            yield {
              type: "hookPermissionResult",
              hookPermissionResult: {
                behavior: "allow",
                updatedInput: result.updatedInput,
                decisionReason
              }
            };
          else if (result.permissionBehavior === "ask")
            yield {
              type: "hookPermissionResult",
              hookPermissionResult: {
                behavior: "ask",
                updatedInput: result.updatedInput,
                message: result.hookPermissionDecisionReason || `Hook PreToolUse:${tool.name} ${getRuleBehaviorDescription(result.permissionBehavior)} this tool`,
                decisionReason
              }
            };
          else
            yield {
              type: "hookPermissionResult",
              hookPermissionResult: {
                behavior: result.permissionBehavior,
                message: result.hookPermissionDecisionReason || `Hook PreToolUse:${tool.name} ${getRuleBehaviorDescription(result.permissionBehavior)} this tool`,
                decisionReason
              }
            };
        }
        if (result.updatedInput && result.permissionBehavior === void 0)
          yield {
            type: "hookUpdatedInput",
            updatedInput: result.updatedInput
          };
        if (result.additionalContexts && result.additionalContexts.length > 0)
          yield {
            type: "additionalContext",
            message: {
              message: createAttachmentMessage({
                type: "hook_additional_context",
                content: result.additionalContexts,
                hookName: `PreToolUse:${tool.name}`,
                toolUseID,
                hookEvent: "PreToolUse"
              })
            }
          };
        if (toolUseContext.abortController.signal.aborted) {
          logEvent("tengu_pre_tool_hooks_cancelled", {
            toolName: sanitizeToolNameForAnalytics(tool.name),
            queryChainId: toolUseContext.queryTracking?.chainId,
            queryDepth: toolUseContext.queryTracking?.depth
          }), yield {
            type: "message",
            message: {
              message: createAttachmentMessage({
                type: "hook_cancelled",
                hookName: `PreToolUse:${tool.name}`,
                toolUseID,
                hookEvent: "PreToolUse"
              })
            }
          }, yield { type: "stop" };
          return;
        }
      } catch (error44) {
        logError2(error44);
        let durationMs = Date.now() - hookStartTime;
        logEvent("tengu_pre_tool_hook_error", {
          messageID: messageId,
          toolName: sanitizeToolNameForAnalytics(tool.name),
          isMcp: tool.isMcp ?? !1,
          duration: durationMs,
          queryChainId: toolUseContext.queryTracking?.chainId,
          queryDepth: toolUseContext.queryTracking?.depth,
          ...mcpServerType ? {
            mcpServerType
          } : {},
          ...requestId ? {
            requestId
          } : {}
        }), yield {
          type: "message",
          message: {
            message: createAttachmentMessage({
              type: "hook_error_during_execution",
              content: formatError3(error44),
              hookName: `PreToolUse:${tool.name}`,
              toolUseID,
              hookEvent: "PreToolUse"
            })
          }
        }, yield { type: "stop" };
      }
  } catch (error44) {
    logError2(error44), yield { type: "stop" };
    return;
  }
}
var init_toolHooks = __esm(() => {
  init_metadata();
  init_attachments2();
  init_debug();
  init_hooks5();
  init_log3();
  init_permissions2();
  init_toolErrors();
  init_utils7();
});
