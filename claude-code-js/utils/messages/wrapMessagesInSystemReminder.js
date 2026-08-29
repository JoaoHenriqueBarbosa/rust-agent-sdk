// function: wrapMessagesInSystemReminder
function wrapMessagesInSystemReminder(messages) {
  return messages.map((msg) => {
    if (typeof msg.message.content === "string")
      return {
        ...msg,
        message: {
          ...msg.message,
          content: wrapInSystemReminder(msg.message.content)
        }
      };
    else if (Array.isArray(msg.message.content)) {
      let wrappedContent = msg.message.content.map((block2) => {
        if (block2.type === "text")
          return {
            ...block2,
            text: wrapInSystemReminder(block2.text)
          };
        return block2;
      });
      return {
        ...msg,
        message: {
          ...msg.message,
          content: wrappedContent
        }
      };
    }
    return msg;
  });
}
