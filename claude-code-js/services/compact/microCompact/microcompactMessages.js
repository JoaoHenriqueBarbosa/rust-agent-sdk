// function: microcompactMessages
async function microcompactMessages(messages, toolUseContext, querySource) {
  clearCompactWarningSuppression();
  let timeBasedResult = maybeTimeBasedMicrocompact(messages, querySource);
  if (timeBasedResult)
    return timeBasedResult;
  return { messages };
}
