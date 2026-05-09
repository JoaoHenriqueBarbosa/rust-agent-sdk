// function: isSyntheticApiErrorMessage
function isSyntheticApiErrorMessage(message) {
  return message.type === "assistant" && message.isApiErrorMessage === !0 && message.message.model === SYNTHETIC_MODEL;
}
