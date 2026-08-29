// Original: src/components/permissions/FilePermissionDialog/usePermissionHandler.ts
function logPermissionEvent(event, completionType, languageName, messageId, hasFeedback) {
  logUnaryEvent({
    completion_type: completionType,
    event,
    metadata: {
      language_name: languageName,
      message_id: messageId,
      platform: env3.platform,
      hasFeedback: hasFeedback ?? !1
    }
  });
}
function handleAcceptOnce(params, options2) {
  let { messageId, toolUseConfirm, onDone, completionType, languageName } = params;
  logPermissionEvent("accept", completionType, languageName, messageId), logEvent("tengu_accept_submitted", {
    toolName: sanitizeToolNameForAnalytics(toolUseConfirm.tool.name),
    isMcp: toolUseConfirm.tool.isMcp ?? !1,
    has_instructions: !!options2?.feedback,
    instructions_length: options2?.feedback?.length ?? 0,
    entered_feedback_mode: options2?.enteredFeedbackMode ?? !1
  }), onDone(), toolUseConfirm.onAllow(toolUseConfirm.input, [], options2?.feedback);
}
function handleAcceptSession(params, options2) {
  let {
    messageId,
    path: path26,
    toolUseConfirm,
    toolPermissionContext,
    onDone,
    completionType,
    languageName,
    operationType
  } = params;
  if (logPermissionEvent("accept", completionType, languageName, messageId), options2?.scope === "claude-folder" || options2?.scope === "global-claude-folder") {
    let pattern = options2.scope === "global-claude-folder" ? GLOBAL_CLAUDE_FOLDER_PERMISSION_PATTERN : CLAUDE_FOLDER_PERMISSION_PATTERN, suggestions2 = [
      {
        type: "addRules",
        rules: [
          {
            toolName: FILE_EDIT_TOOL_NAME,
            ruleContent: pattern
          }
        ],
        behavior: "allow",
        destination: "session"
      }
    ];
    onDone(), toolUseConfirm.onAllow(toolUseConfirm.input, suggestions2);
    return;
  }
  let suggestions = path26 ? generateSuggestions(path26, operationType, toolPermissionContext) : [];
  onDone(), toolUseConfirm.onAllow(toolUseConfirm.input, suggestions);
}
function handleReject(params, options2) {
  let {
    messageId,
    toolUseConfirm,
    onDone,
    onReject,
    completionType,
    languageName
  } = params;
  logPermissionEvent("reject", completionType, languageName, messageId, options2?.hasFeedback), logEvent("tengu_reject_submitted", {
    toolName: sanitizeToolNameForAnalytics(toolUseConfirm.tool.name),
    isMcp: toolUseConfirm.tool.isMcp ?? !1,
    has_instructions: !!options2?.feedback,
    instructions_length: options2?.feedback?.length ?? 0,
    entered_feedback_mode: options2?.enteredFeedbackMode ?? !1
  }), onDone(), onReject(), toolUseConfirm.onReject(options2?.feedback);
}
var PERMISSION_HANDLERS;
var init_usePermissionHandler = __esm(() => {
  init_metadata();
  init_env();
  init_filesystem();
  init_unaryLogging();
  PERMISSION_HANDLERS = {
    "accept-once": handleAcceptOnce,
    "accept-session": handleAcceptSession,
    reject: handleReject
  };
});
