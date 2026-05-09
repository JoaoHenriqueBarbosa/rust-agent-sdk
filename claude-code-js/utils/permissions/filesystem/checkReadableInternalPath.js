// function: checkReadableInternalPath
function checkReadableInternalPath(absolutePath, input) {
  let normalizedPath = normalize15(absolutePath);
  if (isSessionMemoryPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Session memory files are allowed for reading"
      }
    };
  if (isProjectDirPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Project directory files are allowed for reading"
      }
    };
  if (isSessionPlanFile(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Plan files for current session are allowed for reading"
      }
    };
  let toolResultsDir = getToolResultsDir(), toolResultsDirWithSep = toolResultsDir.endsWith(sep32) ? toolResultsDir : toolResultsDir + sep32;
  if (normalizedPath === toolResultsDir || normalizedPath.startsWith(toolResultsDirWithSep))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Tool result files are allowed for reading"
      }
    };
  if (isScratchpadPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Scratchpad files for current session are allowed for reading"
      }
    };
  let projectTempDir = getProjectTempDir();
  if (normalizedPath.startsWith(projectTempDir))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Project temp directory files are allowed for reading"
      }
    };
  if (isAgentMemoryPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Agent memory files are allowed for reading"
      }
    };
  if (isAutoMemPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "auto memory files are allowed for reading"
      }
    };
  let tasksDir = join136(getClaudeConfigHomeDir(), "tasks") + sep32;
  if (normalizedPath === tasksDir.slice(0, -1) || normalizedPath.startsWith(tasksDir))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Task files are allowed for reading"
      }
    };
  let teamsReadDir = join136(getClaudeConfigHomeDir(), "teams") + sep32;
  if (normalizedPath === teamsReadDir.slice(0, -1) || normalizedPath.startsWith(teamsReadDir))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Team files are allowed for reading"
      }
    };
  let bundledSkillsRoot = getBundledSkillsRoot() + sep32;
  if (normalizedPath.startsWith(bundledSkillsRoot))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Bundled skill reference files are allowed for reading"
      }
    };
  return { behavior: "passthrough", message: "" };
}
