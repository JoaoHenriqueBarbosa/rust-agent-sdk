// function: checkSemanticsDeny
function checkSemanticsDeny(input, toolPermissionContext, commands7) {
  let fullCmd = checkEarlyExitDeny(input, toolPermissionContext);
  if (fullCmd !== null)
    return fullCmd;
  for (let cmd of commands7) {
    let subDeny = matchingRulesForInput2({ ...input, command: cmd.text }, toolPermissionContext, "prefix").matchingDenyRules[0];
    if (subDeny !== void 0)
      return {
        behavior: "deny",
        message: `Permission to use ${BashTool.name} with command ${input.command} has been denied.`,
        decisionReason: { type: "rule", rule: subDeny }
      };
  }
  return null;
}
