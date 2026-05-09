// function: validateSinglePathCommandArgv
function validateSinglePathCommandArgv(cmd, cwd2, toolPermissionContext, compoundCommandHasCd) {
  let argv = stripWrappersFromArgv(cmd.argv);
  if (argv.length === 0)
    return {
      behavior: "passthrough",
      message: "Empty command - no paths to validate"
    };
  let [baseCmd, ...args] = argv;
  if (!baseCmd || !SUPPORTED_PATH_COMMANDS.includes(baseCmd))
    return {
      behavior: "passthrough",
      message: `Command '${baseCmd}' is not a path-restricted command`
    };
  let operationTypeOverride = baseCmd === "sed" && sedCommandIsAllowedByAllowlist(stripSafeWrappers(cmd.text)) ? "read" : void 0;
  return createPathChecker(baseCmd, operationTypeOverride)(args, cwd2, toolPermissionContext, compoundCommandHasCd);
}
