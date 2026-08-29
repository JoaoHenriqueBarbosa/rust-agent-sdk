// function: validateCommandPaths
function validateCommandPaths(command12, args, cwd2, toolPermissionContext, compoundCommandHasCd, operationTypeOverride) {
  let extractor = PATH_EXTRACTORS[command12], paths2 = extractor(args), operationType = operationTypeOverride ?? COMMAND_OPERATION_TYPE[command12], validator = COMMAND_VALIDATOR[command12];
  if (validator && !validator(args))
    return {
      behavior: "ask",
      message: `${command12} with flags requires manual approval to ensure path safety. For security, Claude Code cannot automatically validate ${command12} commands that use flags, as some flags like --target-directory=PATH can bypass path validation.`,
      decisionReason: {
        type: "other",
        reason: `${command12} command with flags requires manual approval`
      }
    };
  if (compoundCommandHasCd && operationType !== "read")
    return {
      behavior: "ask",
      message: "Commands that change directories and perform write operations require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
      decisionReason: {
        type: "other",
        reason: "Compound command contains cd with write operation - manual approval required to prevent path resolution bypass"
      }
    };
  for (let path16 of paths2) {
    let { allowed, resolvedPath: resolvedPath5, decisionReason } = validatePath(path16, cwd2, toolPermissionContext, operationType);
    if (!allowed) {
      let workingDirs = Array.from(allWorkingDirectories(toolPermissionContext)), dirListStr = formatDirectoryList(workingDirs), message = decisionReason?.type === "other" || decisionReason?.type === "safetyCheck" ? decisionReason.reason : `${command12} in '${resolvedPath5}' was blocked. For security, Claude Code may only ${ACTION_VERBS[command12]} the allowed working directories for this session: ${dirListStr}.`;
      if (decisionReason?.type === "rule")
        return {
          behavior: "deny",
          message,
          decisionReason
        };
      return {
        behavior: "ask",
        message,
        blockedPath: resolvedPath5,
        decisionReason
      };
    }
  }
  return {
    behavior: "passthrough",
    message: `Path validation passed for ${command12} command`
  };
}
