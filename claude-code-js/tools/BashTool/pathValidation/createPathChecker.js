// function: createPathChecker
function createPathChecker(command12, operationTypeOverride) {
  return (args, cwd2, context3, compoundCommandHasCd) => {
    let result = validateCommandPaths(command12, args, cwd2, context3, compoundCommandHasCd, operationTypeOverride);
    if (result.behavior === "deny")
      return result;
    if (command12 === "rm" || command12 === "rmdir") {
      let dangerousPathResult = checkDangerousRemovalPaths(command12, args, cwd2);
      if (dangerousPathResult.behavior !== "passthrough")
        return dangerousPathResult;
    }
    if (result.behavior === "passthrough")
      return result;
    if (result.behavior === "ask") {
      let operationType = operationTypeOverride ?? COMMAND_OPERATION_TYPE[command12], suggestions = [];
      if (result.blockedPath)
        if (operationType === "read") {
          let dirPath = getDirectoryForPath(result.blockedPath), suggestion = createReadRuleSuggestion(dirPath, "session");
          if (suggestion)
            suggestions.push(suggestion);
        } else
          suggestions.push({
            type: "addDirectories",
            directories: [getDirectoryForPath(result.blockedPath)],
            destination: "session"
          });
      if (operationType === "write" || operationType === "create")
        suggestions.push({
          type: "setMode",
          mode: "acceptEdits",
          destination: "session"
        });
      result.suggestions = suggestions;
    }
    return result;
  };
}
