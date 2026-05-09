// function: isSystemLocalCommandMessage
function isSystemLocalCommandMessage(message) {
  return message.type === "system" && message.subtype === "local_command";
}
