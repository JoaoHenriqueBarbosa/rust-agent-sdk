// Original: src/components/permissions/hooks.ts
function usePermissionRequestLogging(toolUseConfirm, unaryEvent) {
  let setAppState = useSetAppState(), loggedToolUseID = import_react207.useRef(null);
  import_react207.useEffect(() => {
    if (loggedToolUseID.current === toolUseConfirm.toolUseID)
      return;
    loggedToolUseID.current = toolUseConfirm.toolUseID, setAppState((prev) => ({
      ...prev,
      attribution: {
        ...prev.attribution,
        permissionPromptCount: prev.attribution.permissionPromptCount + 1
      }
    })), logEvent("tengu_tool_use_show_permission_request", {
      messageID: toolUseConfirm.assistantMessage.message.id,
      toolName: sanitizeToolNameForAnalytics(toolUseConfirm.tool.name),
      isMcp: toolUseConfirm.tool.isMcp ?? !1,
      decisionReasonType: toolUseConfirm.permissionResult.decisionReason?.type,
      sandboxEnabled: SandboxManager2.isSandboxingEnabled()
    }), logUnaryEvent({
      completion_type: unaryEvent.completion_type,
      event: "response",
      metadata: {
        language_name: unaryEvent.language_name,
        message_id: toolUseConfirm.assistantMessage.message.id,
        platform: env3.platform
      }
    });
  }, [toolUseConfirm, unaryEvent, setAppState]);
}
var import_react207;
var init_hooks6 = __esm(() => {
  init_metadata();
  init_PermissionUpdate();
  init_permissionRuleParser();
  init_sandbox_adapter();
  init_AppState();
  init_env();
  init_slowOperations();
  init_unaryLogging();
  import_react207 = __toESM(require_react_development(), 1);
});
