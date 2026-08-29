// function: filterRulesByContentsMatchingInput
function filterRulesByContentsMatchingInput(input, rules, matchMode, behavior) {
  let command12 = input.command.trim();
  function strEquals(a2, b) {
    return a2.toLowerCase() === b.toLowerCase();
  }
  function strStartsWith(str2, prefix) {
    return str2.toLowerCase().startsWith(prefix.toLowerCase());
  }
  function stripModulePrefixForRule(name3) {
    if (behavior === "allow")
      return name3;
    return stripModulePrefix(name3);
  }
  let rawCmdName = command12.split(/\s+/)[0] ?? "", inputCmdName = stripModulePrefix(rawCmdName), inputCanonical = resolveToCanonical(inputCmdName), rest = command12.slice(rawCmdName.length).replace(/^\s+/, " "), canonicalCommand = inputCanonical + rest;
  return Array.from(rules.entries()).filter(([ruleContent]) => {
    let rule = powershellPermissionRule(ruleContent);
    function matchesCommand(cmd) {
      switch (rule.type) {
        case "exact":
          return strEquals(rule.command, cmd);
        case "prefix":
          switch (matchMode) {
            case "exact":
              return strEquals(rule.prefix, cmd);
            case "prefix": {
              if (strEquals(cmd, rule.prefix))
                return !0;
              return strStartsWith(cmd, rule.prefix + " ");
            }
          }
          break;
        case "wildcard":
          if (matchMode === "exact")
            return !1;
          return matchWildcardPattern(rule.pattern, cmd, !0);
      }
    }
    if (matchesCommand(command12))
      return !0;
    if (matchesCommand(canonicalCommand))
      return !0;
    if (rule.type === "exact") {
      let rawRuleCmdName = rule.command.split(/\s+/)[0] ?? "";
      if (resolveToCanonical(stripModulePrefixForRule(rawRuleCmdName)) === inputCanonical) {
        let ruleRest = rule.command.slice(rawRuleCmdName.length).replace(/^\s+/, " ");
        if (strEquals(ruleRest, rest))
          return !0;
      }
    } else if (rule.type === "prefix") {
      let rawRuleCmdName = rule.prefix.split(/\s+/)[0] ?? "";
      if (resolveToCanonical(stripModulePrefixForRule(rawRuleCmdName)) === inputCanonical) {
        let ruleRest = rule.prefix.slice(rawRuleCmdName.length).replace(/^\s+/, " "), canonicalPrefix = inputCanonical + ruleRest;
        if (matchMode === "exact") {
          if (strEquals(canonicalPrefix, canonicalCommand))
            return !0;
        } else if (strEquals(canonicalCommand, canonicalPrefix) || strStartsWith(canonicalCommand, canonicalPrefix + " "))
          return !0;
      }
    } else if (rule.type === "wildcard") {
      let rawRuleCmdName = rule.pattern.split(/\s+/)[0] ?? "";
      if (resolveToCanonical(stripModulePrefixForRule(rawRuleCmdName)) === inputCanonical && matchMode !== "exact") {
        let ruleRest = rule.pattern.slice(rawRuleCmdName.length).replace(/^\s+/, " "), canonicalPattern = inputCanonical + ruleRest;
        if (matchWildcardPattern(canonicalPattern, canonicalCommand, !0))
          return !0;
      }
    }
    return !1;
  }).map(([, rule]) => rule);
}
