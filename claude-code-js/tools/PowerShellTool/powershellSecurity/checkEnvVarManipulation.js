// function: checkEnvVarManipulation
function checkEnvVarManipulation(parsed) {
  let envVars = getVariablesByScope(parsed, "env");
  if (envVars.length === 0)
    return { behavior: "passthrough" };
  for (let cmd of getAllCommands2(parsed))
    if (ENV_WRITE_CMDLETS.has(cmd.name.toLowerCase()))
      return {
        behavior: "ask",
        message: "Command modifies environment variables"
      };
  if (deriveSecurityFlags(parsed).hasAssignments && envVars.length > 0)
    return {
      behavior: "ask",
      message: "Command modifies environment variables"
    };
  return { behavior: "passthrough" };
}
