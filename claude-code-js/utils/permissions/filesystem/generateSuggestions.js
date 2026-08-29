// function: generateSuggestions
function generateSuggestions(filePath, operationType, toolPermissionContext, precomputedPathsToCheck) {
  let isOutsideWorkingDir = !pathInAllowedWorkingPath(filePath, toolPermissionContext, precomputedPathsToCheck);
  if (operationType === "read" && isOutsideWorkingDir) {
    let dirPath = getDirectoryForPath(filePath);
    return getPathsForPermissionCheck(dirPath).map((dir) => createReadRuleSuggestion(dir, "session")).filter((s2) => s2 !== void 0);
  }
  let shouldSuggestAcceptEdits = toolPermissionContext.mode === "default" || toolPermissionContext.mode === "plan";
  if (operationType === "write" || operationType === "create") {
    let updates = shouldSuggestAcceptEdits ? [{ type: "setMode", mode: "acceptEdits", destination: "session" }] : [];
    if (isOutsideWorkingDir) {
      let dirPath = getDirectoryForPath(filePath), dirsToAdd = getPathsForPermissionCheck(dirPath);
      updates.push({
        type: "addDirectories",
        directories: dirsToAdd,
        destination: "session"
      });
    }
    return updates;
  }
  return shouldSuggestAcceptEdits ? [{ type: "setMode", mode: "acceptEdits", destination: "session" }] : [];
}
