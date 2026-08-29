// Original: src/hooks/toolPermission/permissionLogging.ts
function isCodeEditingTool(toolName) {
  return CODE_EDITING_TOOLS.includes(toolName);
}
async function buildCodeEditToolAttributes(tool, input, decision, source) {
  let language;
  if (tool.getPath && input) {
    let parseResult = tool.inputSchema.safeParse(input);
    if (parseResult.success) {
      let filePath = tool.getPath(parseResult.data);
      if (filePath)
        language = await getLanguageName(filePath);
    }
  }
  return {
    decision,
    source,
    tool_name: tool.name,
    ...language && { language }
  };
}
function sourceToString(source) {
  if (source.type === "classifier")
    return "classifier";
  switch (source.type) {
    case "hook":
      return "hook";
    case "user":
      return source.permanent ? "user_permanent" : "user_temporary";
    case "user_abort":
      return "user_abort";
    case "user_reject":
      return "user_reject";
    default:
      return "unknown";
  }
}
function baseMetadata(messageId, toolName, waitMs) {
  return {
    messageID: messageId,
    toolName: sanitizeToolNameForAnalytics(toolName),
    sandboxEnabled: SandboxManager2.isSandboxingEnabled(),
    ...waitMs !== void 0 && { waiting_for_user_permission_ms: waitMs }
  };
}
function logApprovalEvent(tool, messageId, source, waitMs) {
  if (source === "config") {
    logEvent("tengu_tool_use_granted_in_config", baseMetadata(messageId, tool.name, void 0));
    return;
  }
  if (source.type === "classifier") {
    logEvent("tengu_tool_use_granted_by_classifier", baseMetadata(messageId, tool.name, waitMs));
    return;
  }
  switch (source.type) {
    case "user":
      logEvent(source.permanent ? "tengu_tool_use_granted_in_prompt_permanent" : "tengu_tool_use_granted_in_prompt_temporary", baseMetadata(messageId, tool.name, waitMs));
      break;
    case "hook":
      logEvent("tengu_tool_use_granted_by_permission_hook", {
        ...baseMetadata(messageId, tool.name, waitMs),
        permanent: source.permanent ?? !1
      });
      break;
    default:
      break;
  }
}
function logRejectionEvent(tool, messageId, source, waitMs) {
  if (source === "config") {
    logEvent("tengu_tool_use_denied_in_config", baseMetadata(messageId, tool.name, void 0));
    return;
  }
  logEvent("tengu_tool_use_rejected_in_prompt", {
    ...baseMetadata(messageId, tool.name, waitMs),
    ...source.type === "hook" ? { isHook: !0 } : {
      hasFeedback: source.type === "user_reject" ? source.hasFeedback : !1
    }
  });
}
function logPermissionDecision(ctx, args, permissionPromptStartTimeMs) {
  let { tool, input, toolUseContext, messageId, toolUseID } = ctx, { decision, source } = args, waiting_for_user_permission_ms = permissionPromptStartTimeMs !== void 0 ? Date.now() - permissionPromptStartTimeMs : void 0;
  if (args.decision === "accept")
    logApprovalEvent(tool, messageId, args.source, waiting_for_user_permission_ms);
  else
    logRejectionEvent(tool, messageId, args.source, waiting_for_user_permission_ms);
  let sourceString = source === "config" ? "config" : sourceToString(source);
  if (isCodeEditingTool(tool.name))
    buildCodeEditToolAttributes(tool, input, decision, sourceString).then((attributes) => getCodeEditToolDecisionCounter()?.add(1, attributes));
  if (!toolUseContext.toolDecisions)
    toolUseContext.toolDecisions = /* @__PURE__ */ new Map;
  toolUseContext.toolDecisions.set(toolUseID, {
    source: sourceString,
    decision,
    timestamp: Date.now()
  }), logOTelEvent("tool_decision", {
    decision,
    source: sourceString,
    tool_name: sanitizeToolNameForAnalytics(tool.name)
  });
}
var CODE_EDITING_TOOLS;
var init_permissionLogging = __esm(() => {
  init_metadata();
  init_state();
  init_cliHighlight();
  init_sandbox_adapter();
  init_events();
  CODE_EDITING_TOOLS = ["Edit", "Write", "NotebookEdit"];
});
