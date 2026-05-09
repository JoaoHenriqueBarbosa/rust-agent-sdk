// Shared module state and imports
// Original: src/tools/BashTool/bashPermissions.ts
var bashCommandIsSafeAsync, splitCommand, ENV_VAR_ASSIGN_RE, MAX_SUBCOMMANDS_FOR_SECURITY_CHECK = 50, MAX_SUGGESTED_RULES_FOR_COMPOUND = 5, BARE_SHELL_PREFIXES, permissionRuleExtractPrefix3, bashPermissionRule, SAFE_ENV_VARS3, BINARY_HIJACK_VARS, bashToolCheckExactMatchPermission = (input, toolPermissionContext) => {
  let command12 = input.command.trim(), { matchingDenyRules, matchingAskRules, matchingAllowRules } = matchingRulesForInput2(input, toolPermissionContext, "exact");
  if (matchingDenyRules[0] !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${BashTool.name} with command ${command12} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: matchingDenyRules[0]
      }
    };
  if (matchingAskRules[0] !== void 0)
    return {
      behavior: "ask",
      message: createPermissionRequestMessage2(BashTool.name),
      decisionReason: {
        type: "rule",
        rule: matchingAskRules[0]
      }
    };
  if (matchingAllowRules[0] !== void 0)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "rule",
        rule: matchingAllowRules[0]
      }
    };
  let decisionReason = {
    type: "other",
    reason: "This command requires approval"
  };
  return {
    behavior: "passthrough",
    message: createPermissionRequestMessage2(BashTool.name, decisionReason),
    decisionReason,
    suggestions: suggestionForExactCommand3(command12)
  };
}, bashToolCheckPermission = (input, toolPermissionContext, compoundCommandHasCd, astCommand) => {
  let command12 = input.command.trim(), exactMatchResult = bashToolCheckExactMatchPermission(input, toolPermissionContext);
  if (exactMatchResult.behavior === "deny" || exactMatchResult.behavior === "ask")
    return exactMatchResult;
  let { matchingDenyRules, matchingAskRules, matchingAllowRules } = matchingRulesForInput2(input, toolPermissionContext, "prefix", {
    skipCompoundCheck: astCommand !== void 0
  });
  if (matchingDenyRules[0] !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${BashTool.name} with command ${command12} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: matchingDenyRules[0]
      }
    };
  if (matchingAskRules[0] !== void 0)
    return {
      behavior: "ask",
      message: createPermissionRequestMessage2(BashTool.name),
      decisionReason: {
        type: "rule",
        rule: matchingAskRules[0]
      }
    };
  let pathResult = checkPathConstraints(input, getCwd(), toolPermissionContext, compoundCommandHasCd, astCommand?.redirects, astCommand ? [astCommand] : void 0);
  if (pathResult.behavior !== "passthrough")
    return pathResult;
  if (exactMatchResult.behavior === "allow")
    return exactMatchResult;
  if (matchingAllowRules[0] !== void 0)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "rule",
        rule: matchingAllowRules[0]
      }
    };
  let sedConstraintResult = checkSedConstraints(input, toolPermissionContext);
  if (sedConstraintResult.behavior !== "passthrough")
    return sedConstraintResult;
  let modeResult = checkPermissionMode2(input, toolPermissionContext);
  if (modeResult.behavior !== "passthrough")
    return modeResult;
  if (BashTool.isReadOnly(input))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Read-only command is allowed"
      }
    };
  let decisionReason = {
    type: "other",
    reason: "This command requires approval"
  };
  return {
    behavior: "passthrough",
    message: createPermissionRequestMessage2(BashTool.name, decisionReason),
    decisionReason,
    suggestions: suggestionForExactCommand3(command12)
  };
}, speculativeChecks;

