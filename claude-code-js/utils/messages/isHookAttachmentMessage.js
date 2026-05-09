// function: isHookAttachmentMessage
function isHookAttachmentMessage(message) {
  return message.type === "attachment" && (message.attachment.type === "hook_blocking_error" || message.attachment.type === "hook_cancelled" || message.attachment.type === "hook_error_during_execution" || message.attachment.type === "hook_non_blocking_error" || message.attachment.type === "hook_success" || message.attachment.type === "hook_system_message" || message.attachment.type === "hook_additional_context" || message.attachment.type === "hook_stopped_continuation");
}
