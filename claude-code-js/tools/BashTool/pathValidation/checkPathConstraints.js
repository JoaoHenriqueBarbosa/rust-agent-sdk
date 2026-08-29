// function: checkPathConstraints
function checkPathConstraints(input, cwd2, toolPermissionContext, compoundCommandHasCd, astRedirects, astCommands) {
  if (!astCommands && />>\s*>\s*\(|>\s*>\s*\(|<\s*\(/.test(input.command))
    return {
      behavior: "ask",
      message: "Process substitution (>(...) or <(...)) can execute arbitrary commands and requires manual approval",
      decisionReason: {
        type: "other",
        reason: "Process substitution requires manual approval"
      }
    };
  let { redirections, hasDangerousRedirection } = astRedirects ? astRedirectsToOutputRedirections(astRedirects) : extractOutputRedirections(input.command);
  if (hasDangerousRedirection)
    return {
      behavior: "ask",
      message: "Shell expansion syntax in paths requires manual approval",
      decisionReason: {
        type: "other",
        reason: "Shell expansion syntax in paths requires manual approval"
      }
    };
  let redirectionResult = validateOutputRedirections(redirections, cwd2, toolPermissionContext, compoundCommandHasCd);
  if (redirectionResult.behavior !== "passthrough")
    return redirectionResult;
  if (astCommands)
    for (let cmd of astCommands) {
      let result = validateSinglePathCommandArgv(cmd, cwd2, toolPermissionContext, compoundCommandHasCd);
      if (result.behavior === "ask" || result.behavior === "deny")
        return result;
    }
  else {
    let commands7 = splitCommand_DEPRECATED(input.command);
    for (let cmd of commands7) {
      let result = validateSinglePathCommand(cmd, cwd2, toolPermissionContext, compoundCommandHasCd);
      if (result.behavior === "ask" || result.behavior === "deny")
        return result;
    }
  }
  return {
    behavior: "passthrough",
    message: "All path commands validated successfully"
  };
}
