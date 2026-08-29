// function: getProgressMessagesFromLookup
function getProgressMessagesFromLookup(message, lookups) {
  let toolUseID = getToolUseID(message);
  if (!toolUseID)
    return [];
  return lookups.progressMessagesByToolUseID.get(toolUseID) ?? [];
}
