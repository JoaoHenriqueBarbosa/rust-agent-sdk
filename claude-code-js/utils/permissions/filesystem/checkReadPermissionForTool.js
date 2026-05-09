// function: checkReadPermissionForTool
function checkReadPermissionForTool(tool, input, toolPermissionContext) {
  if (typeof tool.getPath !== "function")
    return {
      behavior: "ask",
      message: `Claude requested permissions to use ${tool.name}, but you haven't granted it yet.`
    };
  let path25 = tool.getPath(input), pathsToCheck = getPathsForPermissionCheck(path25);
  for (let pathToCheck of pathsToCheck)
    if (pathToCheck.startsWith("\\\\") || pathToCheck.startsWith("//"))
      return {
        behavior: "ask",
        message: `Claude requested permissions to read from ${path25}, which appears to be a UNC path that could access network resources.`,
        decisionReason: {
          type: "other",
          reason: "UNC path detected (defense-in-depth check)"
        }
      };
  for (let pathToCheck of pathsToCheck)
    if (hasSuspiciousWindowsPathPattern(pathToCheck))
      return {
        behavior: "ask",
        message: `Claude requested permissions to read from ${path25}, which contains a suspicious Windows path pattern that requires manual approval.`,
        decisionReason: {
          type: "other",
          reason: "Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"
        }
      };
  for (let pathToCheck of pathsToCheck) {
    let denyRule = matchingRuleForInput(pathToCheck, toolPermissionContext, "read", "deny");
    if (denyRule)
      return {
        behavior: "deny",
        message: `Permission to read ${path25} has been denied.`,
        decisionReason: {
          type: "rule",
          rule: denyRule
        }
      };
  }
  for (let pathToCheck of pathsToCheck) {
    let askRule = matchingRuleForInput(pathToCheck, toolPermissionContext, "read", "ask");
    if (askRule)
      return {
        behavior: "ask",
        message: `Claude requested permissions to read from ${path25}, but you haven't granted it yet.`,
        decisionReason: {
          type: "rule",
          rule: askRule
        }
      };
  }
  let editResult = checkWritePermissionForTool(tool, input, toolPermissionContext, pathsToCheck);
  if (editResult.behavior === "allow")
    return editResult;
  if (pathInAllowedWorkingPath(path25, toolPermissionContext, pathsToCheck))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "mode",
        mode: "default"
      }
    };
  let absolutePath = expandPath(path25), internalReadResult = checkReadableInternalPath(absolutePath, input);
  if (internalReadResult.behavior !== "passthrough")
    return internalReadResult;
  let allowRule = matchingRuleForInput(path25, toolPermissionContext, "read", "allow");
  if (allowRule)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "rule",
        rule: allowRule
      }
    };
  return {
    behavior: "ask",
    message: `Claude requested permissions to read from ${path25}, but you haven't granted it yet.`,
    suggestions: generateSuggestions(path25, "read", toolPermissionContext, pathsToCheck),
    decisionReason: {
      type: "workingDir",
      reason: "Path is outside allowed working directories"
    }
  };
}
