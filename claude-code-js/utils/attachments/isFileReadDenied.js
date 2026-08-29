// function: isFileReadDenied
function isFileReadDenied(filePath, toolPermissionContext) {
  return matchingRuleForInput(filePath, toolPermissionContext, "read", "deny") !== null;
}
