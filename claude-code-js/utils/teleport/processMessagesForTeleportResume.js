// function: processMessagesForTeleportResume
function processMessagesForTeleportResume(messages, error44) {
  return [...deserializeMessages(messages), createTeleportResumeUserMessage(), createTeleportResumeSystemMessage(error44)];
}
