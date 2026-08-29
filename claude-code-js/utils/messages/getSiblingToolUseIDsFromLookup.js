// function: getSiblingToolUseIDsFromLookup
function getSiblingToolUseIDsFromLookup(message, lookups) {
  let toolUseID = getToolUseID(message);
  if (!toolUseID)
    return EMPTY_STRING_SET;
  return lookups.siblingToolUseIDs.get(toolUseID) ?? EMPTY_STRING_SET;
}
