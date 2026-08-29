// function: validateOutputRedirections
function validateOutputRedirections(redirections, cwd2, toolPermissionContext, compoundCommandHasCd) {
  if (compoundCommandHasCd && redirections.length > 0)
    return {
      behavior: "ask",
      message: "Commands that change directories and write via output redirection require explicit approval to ensure paths are evaluated correctly. For security, Claude Code cannot automatically determine the final working directory when 'cd' is used in compound commands.",
      decisionReason: {
        type: "other",
        reason: "Compound command contains cd with output redirection - manual approval required to prevent path resolution bypass"
      }
    };
  for (let { target } of redirections) {
    if (target === "/dev/null")
      continue;
    let { allowed, resolvedPath: resolvedPath5, decisionReason } = validatePath(target, cwd2, toolPermissionContext, "create");
    if (!allowed) {
      let workingDirs = Array.from(allWorkingDirectories(toolPermissionContext)), dirListStr = formatDirectoryList(workingDirs), message = decisionReason?.type === "other" || decisionReason?.type === "safetyCheck" ? decisionReason.reason : decisionReason?.type === "rule" ? `Output redirection to '${resolvedPath5}' was blocked by a deny rule.` : `Output redirection to '${resolvedPath5}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${dirListStr}.`;
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
        decisionReason,
        suggestions: [
          {
            type: "addDirectories",
            directories: [getDirectoryForPath(resolvedPath5)],
            destination: "session"
          }
        ]
      };
    }
  }
  return {
    behavior: "passthrough",
    message: "No unsafe redirections found"
  };
}
