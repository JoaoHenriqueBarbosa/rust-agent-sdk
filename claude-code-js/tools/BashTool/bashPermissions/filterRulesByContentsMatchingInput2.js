// function: filterRulesByContentsMatchingInput2
function filterRulesByContentsMatchingInput2(input, rules2, matchMode, {
  stripAllEnvVars = !1,
  skipCompoundCheck = !1
} = {}) {
  let command12 = input.command.trim(), commandWithoutRedirections = extractOutputRedirections(command12).commandWithoutRedirections, commandsToTry = (matchMode === "exact" ? [command12, commandWithoutRedirections] : [commandWithoutRedirections]).flatMap((cmd) => {
    let strippedCommand = stripSafeWrappers(cmd);
    return strippedCommand !== cmd ? [cmd, strippedCommand] : [cmd];
  });
  if (stripAllEnvVars) {
    let seen = new Set(commandsToTry), startIdx = 0;
    while (startIdx < commandsToTry.length) {
      let endIdx = commandsToTry.length;
      for (let i5 = startIdx;i5 < endIdx; i5++) {
        let cmd = commandsToTry[i5];
        if (!cmd)
          continue;
        let envStripped = stripAllLeadingEnvVars(cmd);
        if (!seen.has(envStripped))
          commandsToTry.push(envStripped), seen.add(envStripped);
        let wrapperStripped = stripSafeWrappers(cmd);
        if (!seen.has(wrapperStripped))
          commandsToTry.push(wrapperStripped), seen.add(wrapperStripped);
      }
      startIdx = endIdx;
    }
  }
  let isCompoundCommand = /* @__PURE__ */ new Map;
  if (matchMode === "prefix" && !skipCompoundCheck) {
    for (let cmd of commandsToTry)
      if (!isCompoundCommand.has(cmd))
        isCompoundCommand.set(cmd, splitCommand(cmd).length > 1);
  }
  return Array.from(rules2.entries()).filter(([ruleContent]) => {
    let bashRule = bashPermissionRule(ruleContent);
    return commandsToTry.some((cmdToMatch) => {
      switch (bashRule.type) {
        case "exact":
          return bashRule.command === cmdToMatch;
        case "prefix":
          switch (matchMode) {
            case "exact":
              return bashRule.prefix === cmdToMatch;
            case "prefix": {
              if (isCompoundCommand.get(cmdToMatch))
                return !1;
              if (cmdToMatch === bashRule.prefix)
                return !0;
              if (cmdToMatch.startsWith(bashRule.prefix + " "))
                return !0;
              let xargsPrefix = "xargs " + bashRule.prefix;
              if (cmdToMatch === xargsPrefix)
                return !0;
              return cmdToMatch.startsWith(xargsPrefix + " ");
            }
          }
          break;
        case "wildcard":
          if (matchMode === "exact")
            return !1;
          if (isCompoundCommand.get(cmdToMatch))
            return !1;
          return matchWildcardPattern2(bashRule.pattern, cmdToMatch);
      }
    });
  }).map(([, rule]) => rule);
}
