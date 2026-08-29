// function: buildResumeInputFromSuggestion
function buildResumeInputFromSuggestion(suggestion) {
  let metadata = suggestion.metadata;
  return metadata?.sessionId ? `/resume ${metadata.sessionId}` : `/resume ${suggestion.displayText}`;
}
