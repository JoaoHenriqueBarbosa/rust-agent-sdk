// function: validateSinglePathCommand
function validateSinglePathCommand(cmd, cwd2, toolPermissionContext, compoundCommandHasCd) {
  let strippedCmd = stripSafeWrappers(cmd), extractedArgs = parseCommandArguments(strippedCmd);
  if (extractedArgs.length === 0)
    return {
      behavior: "passthrough",
      message: "Empty command - no paths to validate"
    };
  let [baseCmd, ...args] = extractedArgs;
  if (!baseCmd || !SUPPORTED_PATH_COMMANDS.includes(baseCmd))
    return {
      behavior: "passthrough",
      message: `Command '${baseCmd}' is not a path-restricted command`
    };
  let operationTypeOverride = baseCmd === "sed" && sedCommandIsAllowedByAllowlist(strippedCmd) ? "read" : void 0;
  return createPathChecker(baseCmd, operationTypeOverride)(args, cwd2, toolPermissionContext, compoundCommandHasCd);
}
