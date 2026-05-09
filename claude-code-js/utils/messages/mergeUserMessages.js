// function: mergeUserMessages
function mergeUserMessages(a2, b) {
  let lastContent = normalizeUserTextContent(a2.message.content), currentContent = normalizeUserTextContent(b.message.content);
  return {
    ...a2,
    uuid: a2.isMeta ? b.uuid : a2.uuid,
    message: {
      ...a2.message,
      content: hoistToolResults(joinTextAtSeam(lastContent, currentContent))
    }
  };
}
