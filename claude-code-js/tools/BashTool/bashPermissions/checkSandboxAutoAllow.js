// function: checkSandboxAutoAllow
function checkSandboxAutoAllow(input, toolPermissionContext) {
  let command12 = input.command.trim(), { matchingDenyRules, matchingAskRules } = matchingRulesForInput2(input, toolPermissionContext, "prefix");
  if (matchingDenyRules[0] !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${BashTool.name} with command ${command12} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: matchingDenyRules[0]
      }
    };
  let subcommands = splitCommand(command12);
  if (subcommands.length > 1) {
    let firstAskRule;
    for (let sub of subcommands) {
      let subResult = matchingRulesForInput2({ command: sub }, toolPermissionContext, "prefix");
      if (subResult.matchingDenyRules[0] !== void 0)
        return {
          behavior: "deny",
          message: `Permission to use ${BashTool.name} with command ${command12} has been denied.`,
          decisionReason: {
            type: "rule",
            rule: subResult.matchingDenyRules[0]
          }
        };
      firstAskRule ??= subResult.matchingAskRules[0];
    }
    if (firstAskRule)
      return {
        behavior: "ask",
        message: createPermissionRequestMessage2(BashTool.name),
        decisionReason: {
          type: "rule",
          rule: firstAskRule
        }
      };
  }
  if (matchingAskRules[0] !== void 0)
    return {
      behavior: "ask",
      message: createPermissionRequestMessage2(BashTool.name),
      decisionReason: {
        type: "rule",
        rule: matchingAskRules[0]
      }
    };
  return {
    behavior: "allow",
    updatedInput: input,
    decisionReason: {
      type: "other",
      reason: "Auto-allowed with sandbox (autoAllowBashIfSandboxed enabled)"
    }
  };
}
