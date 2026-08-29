// function: mergeUserMessagesAndToolResults
function mergeUserMessagesAndToolResults(a2, b) {
  let lastContent = normalizeUserTextContent(a2.message.content), currentContent = normalizeUserTextContent(b.message.content);
  return {
    ...a2,
    message: {
      ...a2.message,
      content: hoistToolResults(mergeUserContentBlocks(lastContent, currentContent))
    }
  };
}
