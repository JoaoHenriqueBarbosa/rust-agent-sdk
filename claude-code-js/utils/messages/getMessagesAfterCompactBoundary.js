// function: getMessagesAfterCompactBoundary
function getMessagesAfterCompactBoundary(messages, options2) {
  let boundaryIndex = findLastCompactBoundaryIndex(messages);
  return boundaryIndex === -1 ? messages : messages.slice(boundaryIndex);
}
