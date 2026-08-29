// function: isTranscriptMessage
function isTranscriptMessage(entry) {
  return entry.type === "user" || entry.type === "assistant" || entry.type === "attachment" || entry.type === "system";
}
