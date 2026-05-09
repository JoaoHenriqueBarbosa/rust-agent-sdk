// function: buildPostCompactMessages
function buildPostCompactMessages(result) {
  return [
    result.boundaryMarker,
    ...result.summaryMessages,
    ...result.messagesToKeep ?? [],
    ...result.attachments,
    ...result.hookResults
  ];
}
