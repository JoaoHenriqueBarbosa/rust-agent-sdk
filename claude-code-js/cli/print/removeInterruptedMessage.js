// function: removeInterruptedMessage
function removeInterruptedMessage(messages, interruptedUserMessage) {
  let idx = messages.findIndex((m4) => m4.uuid === interruptedUserMessage.uuid);
  if (idx !== -1)
    messages.splice(idx, 2);
}
