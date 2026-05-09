// function: createUserInterruptionMessage
function createUserInterruptionMessage({
  toolUse = !1
}) {
  return createUserMessage({
    content: [
      {
        type: "text",
        text: toolUse ? INTERRUPT_MESSAGE_FOR_TOOL_USE : INTERRUPT_MESSAGE
      }
    ]
  });
}
