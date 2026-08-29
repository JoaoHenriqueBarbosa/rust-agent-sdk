// function: stripCallerFieldFromAssistantMessage
function stripCallerFieldFromAssistantMessage(message) {
  if (!message.message.content.some((block2) => block2.type === "tool_use" && ("caller" in block2) && block2.caller !== null))
    return message;
  return {
    ...message,
    message: {
      ...message.message,
      content: message.message.content.map((block2) => {
        if (block2.type !== "tool_use")
          return block2;
        return {
          type: "tool_use",
          id: block2.id,
          name: block2.name,
          input: block2.input
        };
      })
    }
  };
}
