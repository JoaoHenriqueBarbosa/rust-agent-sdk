// function: checkWritePermissionForTool
function checkWritePermissionForTool(tool, input, toolPermissionContext, precomputedPathsToCheck) {
  if (typeof tool.getPath !== "function")
    return {
      behavior: "ask",
      message: `Claude requested permissions to use ${tool.name}, but you haven't granted it yet.`
    };
  let path25 = tool.getPath(input), pathsToCheck = precomputedPathsToCheck ?? getPathsForPermissionCheck(path25);
  for (let pathToCheck of pathsToCheck) {
    let denyRule = matchingRuleForInput(pathToCheck, toolPermissionContext, "edit", "deny");
    if (denyRule)
      return {
        behavior: "deny",
        message: `Permission to edit ${path25} has been denied.`,
        decisionReason: {
          type: "rule",
          rule: denyRule
        }
      };
  }
  let absolutePathForEdit = expandPath(path25), internalEditResult = checkEditableInternalPath(absolutePathForEdit, input);
  if (internalEditResult.behavior !== "passthrough")
    return internalEditResult;
  let claudeFolderAllowRule = matchingRuleForInput(path25, {
    ...toolPermissionContext,
    alwaysAllowRules: {
      session: toolPermissionContext.alwaysAllowRules.session ?? []
    }
  }, "edit", "allow");
  if (claudeFolderAllowRule) {
    let ruleContent = claudeFolderAllowRule.ruleValue.ruleContent;
    if (ruleContent && (ruleContent.startsWith(CLAUDE_FOLDER_PERMISSION_PATTERN.slice(0, -2)) || ruleContent.startsWith(GLOBAL_CLAUDE_FOLDER_PERMISSION_PATTERN.slice(0, -2))) && !ruleContent.includes("..") && ruleContent.endsWith("/**"))
      return {
        behavior: "allow",
        updatedInput: input,
        decisionReason: {
          type: "rule",
          rule: claudeFolderAllowRule
        }
      };
  }
  let safetyCheck = checkPathSafetyForAutoEdit(path25, pathsToCheck);
  if (!safetyCheck.safe) {
    let skillScope = getClaudeSkillScope(path25), safetySuggestions = skillScope ? [
      {
        type: "addRules",
        rules: [
          {
            toolName: FILE_EDIT_TOOL_NAME,
            ruleContent: skillScope.pattern
          }
        ],
        behavior: "allow",
        destination: "session"
      }
    ] : generateSuggestions(path25, "write", toolPermissionContext, pathsToCheck);
    return {
      behavior: "ask",
      message: safetyCheck.message,
      suggestions: safetySuggestions,
      decisionReason: {
        type: "safetyCheck",
        reason: safetyCheck.message,
        classifierApprovable: safetyCheck.classifierApprovable
      }
    };
  }
  for (let pathToCheck of pathsToCheck) {
    let askRule = matchingRuleForInput(pathToCheck, toolPermissionContext, "edit", "ask");
    if (askRule)
      return {
        behavior: "ask",
        message: `Claude requested permissions to write to ${path25}, but you haven't granted it yet.`,
        decisionReason: {
          type: "rule",
          rule: askRule
        }
      };
  }
  let isInWorkingDir = pathInAllowedWorkingPath(path25, toolPermissionContext, pathsToCheck);
  if (toolPermissionContext.mode === "acceptEdits" && isInWorkingDir)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "mode",
        mode: toolPermissionContext.mode
      }
    };
  let allowRule = matchingRuleForInput(path25, toolPermissionContext, "edit", "allow");
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
    message: `Claude requested permissions to write to ${path25}, but you haven't granted it yet.`,
    suggestions: generateSuggestions(path25, "write", toolPermissionContext, pathsToCheck),
    decisionReason: !isInWorkingDir ? {
      type: "workingDir",
      reason: "Path is outside allowed working directories"
    } : void 0
  };
}
