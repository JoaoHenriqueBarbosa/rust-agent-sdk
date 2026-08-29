// Original: src/components/permissions/utils.ts
function logUnaryPermissionEvent(completion_type, {
  assistantMessage: {
    message: { id: message_id }
  }
}, event, hasFeedback) {
  logUnaryEvent({
    completion_type,
    event,
    metadata: {
      language_name: "none",
      message_id,
      platform: getHostPlatformForAnalytics(),
      hasFeedback: hasFeedback ?? !1
    }
  });
}
var init_utils18 = __esm(() => {
  init_env();
  init_unaryLogging();
});
