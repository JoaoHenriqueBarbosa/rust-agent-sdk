// function: powershellToolHasPermission
async function powershellToolHasPermission(input, context6) {
  let toolPermissionContext = context6.getAppState().toolPermissionContext, command12 = input.command.trim();
  if (!command12)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Empty command is safe"
      }
    };
  let parsed = await parsePowerShellCommandCached(command12), exactMatchResult = powershellToolCheckExactMatchPermission(input, toolPermissionContext);
  if (exactMatchResult.behavior === "deny")
    return exactMatchResult;
  let { matchingDenyRules, matchingAskRules } = matchingRulesForInput(input, toolPermissionContext, "prefix");
  if (matchingDenyRules[0] !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${POWERSHELL_TOOL_NAME} with command ${command12} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: matchingDenyRules[0]
      }
    };
  let preParseAskDecision = null;
  if (matchingAskRules[0] !== void 0)
    preParseAskDecision = {
      behavior: "ask",
      message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME),
      decisionReason: {
        type: "rule",
        rule: matchingAskRules[0]
      }
    };
  if (preParseAskDecision === null && containsVulnerableUncPath(command12))
    preParseAskDecision = {
      behavior: "ask",
      message: "Command contains a UNC path that could trigger network requests"
    };
  if (exactMatchResult.behavior === "allow" && !parsed.valid && preParseAskDecision === null && classifyCommandName(command12.split(/\s+/)[0] ?? "") !== "application")
    return exactMatchResult;
  if (!parsed.valid) {
    let backtickStripped = command12.replace(/`[\r\n]+\s*/g, "").replace(/`/g, "");
    for (let fragment of backtickStripped.split(/[;|\n\r{}()&]+/)) {
      let trimmedFrag = fragment.trim();
      if (!trimmedFrag)
        continue;
      if (trimmedFrag === command12 && !/^\$[\w:]/.test(trimmedFrag) && !/^[&.]\s/.test(trimmedFrag))
        continue;
      let normalized = trimmedFrag, m4;
      while (m4 = normalized.match(PS_ASSIGN_PREFIX_RE))
        normalized = normalized.slice(m4[0].length);
      normalized = normalized.replace(/^[&.]\s+/, "");
      let rawFirst = normalized.split(/\s+/)[0] ?? "", firstTok = rawFirst.replace(/^['"]|['"]$/g, ""), normalizedFrag = firstTok + normalized.slice(rawFirst.length);
      if (resolveToCanonical(firstTok) === "remove-item")
        for (let arg of normalized.split(/\s+/).slice(1)) {
          if (PS_TOKENIZER_DASH_CHARS.has(arg[0] ?? ""))
            continue;
          if (isDangerousRemovalRawPath(arg))
            return dangerousRemovalDeny(arg);
        }
      let { matchingDenyRules: fragDenyRules } = matchingRulesForInput({ command: normalizedFrag }, toolPermissionContext, "prefix");
      if (fragDenyRules[0] !== void 0)
        return {
          behavior: "deny",
          message: `Permission to use ${POWERSHELL_TOOL_NAME} with command ${command12} has been denied.`,
          decisionReason: { type: "rule", rule: fragDenyRules[0] }
        };
    }
    if (preParseAskDecision !== null)
      return preParseAskDecision;
    let decisionReason2 = {
      type: "other",
      reason: `Command contains malformed syntax that cannot be parsed: ${parsed.errors[0]?.message ?? "unknown error"}`
    };
    return {
      behavior: "ask",
      decisionReason: decisionReason2,
      message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME, decisionReason2)
    };
  }
  let allSubCommands = await getSubCommandsForPermissionCheck(parsed, command12), decisions = [];
  if (preParseAskDecision !== null)
    decisions.push(preParseAskDecision);
  let safetyResult = powershellCommandIsSafe(command12, parsed);
  if (safetyResult.behavior !== "passthrough") {
    let decisionReason2 = {
      type: "other",
      reason: safetyResult.behavior === "ask" && safetyResult.message ? safetyResult.message : "This command contains patterns that could pose security risks and requires approval"
    };
    decisions.push({
      behavior: "ask",
      message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME, decisionReason2),
      decisionReason: decisionReason2,
      suggestions: suggestionForExactCommand2(command12)
    });
  }
  if (parsed.hasUsingStatements) {
    let decisionReason2 = {
      type: "other",
      reason: "Command contains a `using` statement that may load external code (module or assembly)"
    };
    decisions.push({
      behavior: "ask",
      message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME, decisionReason2),
      decisionReason: decisionReason2,
      suggestions: suggestionForExactCommand2(command12)
    });
  }
  if (parsed.hasScriptRequirements) {
    let decisionReason2 = {
      type: "other",
      reason: "Command contains a `#Requires` directive that may trigger module loading"
    };
    decisions.push({
      behavior: "ask",
      message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME, decisionReason2),
      decisionReason: decisionReason2,
      suggestions: suggestionForExactCommand2(command12)
    });
  }
  let NON_FS_PROVIDER_PATTERN = /^(?:[\w.]+\\)?(env|hklm|hkcu|function|alias|variable|cert|wsman|registry)::?/i;
  function extractProviderPathFromArg(arg) {
    let s2 = arg;
    if (s2.length > 0 && PS_TOKENIZER_DASH_CHARS.has(s2[0])) {
      let colonIdx = s2.indexOf(":", 1);
      if (colonIdx > 0)
        s2 = s2.substring(colonIdx + 1);
    }
    return s2.replace(/`/g, "");
  }
  function providerOrUncDecisionForArg(arg) {
    let value = extractProviderPathFromArg(arg);
    if (NON_FS_PROVIDER_PATTERN.test(value))
      return {
        behavior: "ask",
        message: `Command argument '${arg}' uses a non-filesystem provider path and requires approval`
      };
    if (containsVulnerableUncPath(value))
      return {
        behavior: "ask",
        message: `Command argument '${arg}' contains a UNC path that could trigger network requests`
      };
    return null;
  }
  providerScan:
    for (let statement of parsed.statements) {
      for (let cmd of statement.commands) {
        if (cmd.elementType !== "CommandAst")
          continue;
        for (let arg of cmd.args) {
          let decision = providerOrUncDecisionForArg(arg);
          if (decision !== null) {
            decisions.push(decision);
            break providerScan;
          }
        }
      }
      if (statement.nestedCommands)
        for (let cmd of statement.nestedCommands)
          for (let arg of cmd.args) {
            let decision = providerOrUncDecisionForArg(arg);
            if (decision !== null) {
              decisions.push(decision);
              break providerScan;
            }
          }
    }
  for (let { text: subCmd, element } of allSubCommands) {
    let canonicalSubCmd = element.name !== "" ? [element.name, ...element.args].join(" ") : null, subInput = { command: subCmd }, { matchingDenyRules: subDenyRules, matchingAskRules: subAskRules } = matchingRulesForInput(subInput, toolPermissionContext, "prefix"), matchedDenyRule = subDenyRules[0], matchedAskRule = subAskRules[0];
    if (matchedDenyRule === void 0 && canonicalSubCmd !== null) {
      let {
        matchingDenyRules: canonicalDenyRules,
        matchingAskRules: canonicalAskRules
      } = matchingRulesForInput({ command: canonicalSubCmd }, toolPermissionContext, "prefix");
      if (matchedDenyRule = canonicalDenyRules[0], matchedAskRule === void 0)
        matchedAskRule = canonicalAskRules[0];
    }
    if (matchedDenyRule !== void 0)
      decisions.push({
        behavior: "deny",
        message: `Permission to use ${POWERSHELL_TOOL_NAME} with command ${command12} has been denied.`,
        decisionReason: {
          type: "rule",
          rule: matchedDenyRule
        }
      });
    else if (matchedAskRule !== void 0)
      decisions.push({
        behavior: "ask",
        message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME),
        decisionReason: {
          type: "rule",
          rule: matchedAskRule
        }
      });
  }
  let hasCdSubCommand = allSubCommands.length > 1 && allSubCommands.some(({ element }) => isCwdChangingCmdlet(element.name)), hasSymlinkCreate = allSubCommands.length > 1 && allSubCommands.some(({ element }) => isSymlinkCreatingCommand(element)), hasGitSubCommand = allSubCommands.some(({ element }) => resolveToCanonical(element.name) === "git");
  if (hasCdSubCommand && hasGitSubCommand)
    decisions.push({
      behavior: "ask",
      message: "Compound commands with cd/Set-Location and git require approval to prevent bare repository attacks"
    });
  if (hasGitSubCommand && isCurrentDirectoryBareGitRepo())
    decisions.push({
      behavior: "ask",
      message: "Git command in a directory with bare-repository indicators (HEAD, objects/, refs/ in cwd without .git/HEAD). Git may execute hooks from cwd."
    });
  if (hasGitSubCommand) {
    let writesToGitInternal = allSubCommands.some(({ element, statement }) => {
      for (let r4 of element.redirections ?? [])
        if (isGitInternalPathPS(r4.target))
          return !0;
      let canonical = resolveToCanonical(element.name);
      if (!GIT_SAFETY_WRITE_CMDLETS.has(canonical))
        return !1;
      if (element.args.flatMap((a2) => a2.split(",")).some((a2) => isGitInternalPathPS(a2)))
        return !0;
      if (statement !== null)
        for (let c3 of statement.commands) {
          if (c3.elementType === "CommandAst")
            continue;
          if (isGitInternalPathPS(c3.text))
            return !0;
        }
      return !1;
    }), redirWritesToGitInternal = getFileRedirections(parsed).some((r4) => isGitInternalPathPS(r4.target));
    if (writesToGitInternal || redirWritesToGitInternal)
      decisions.push({
        behavior: "ask",
        message: "Command writes to a git-internal path (HEAD, objects/, refs/, hooks/, .git/) and runs git. This could plant a malicious hook that git then executes."
      });
    if (allSubCommands.some(({ element }) => GIT_SAFETY_ARCHIVE_EXTRACTORS.has(element.name.toLowerCase())))
      decisions.push({
        behavior: "ask",
        message: "Compound command extracts an archive and runs git. Archive contents may plant bare-repository indicators (HEAD, hooks/, refs/) that git then treats as the repository root."
      });
  }
  if (allSubCommands.some(({ element }) => {
    for (let r4 of element.redirections ?? [])
      if (isDotGitPathPS(r4.target))
        return !0;
    let canonical = resolveToCanonical(element.name);
    if (!GIT_SAFETY_WRITE_CMDLETS.has(canonical))
      return !1;
    return element.args.flatMap((a2) => a2.split(",")).some(isDotGitPathPS);
  }) || getFileRedirections(parsed).some((r4) => isDotGitPathPS(r4.target)))
    decisions.push({
      behavior: "ask",
      message: "Command writes to .git/ \u2014 hooks or config planted there execute on the next git operation."
    });
  let pathResult = checkPathConstraints2(input, parsed, toolPermissionContext, hasCdSubCommand);
  if (pathResult.behavior !== "passthrough")
    decisions.push(pathResult);
  if (exactMatchResult.behavior === "allow" && allSubCommands[0] !== void 0 && allSubCommands.every((sc) => sc.element.nameType !== "application" && !argLeaksValue(sc.text, sc.element)))
    decisions.push(exactMatchResult);
  if (isReadOnlyCommand(command12, parsed))
    decisions.push({
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Command is read-only and safe to execute"
      }
    });
  if (getFileRedirections(parsed).length > 0)
    decisions.push({
      behavior: "ask",
      message: "Command contains file redirections that could write to arbitrary paths",
      suggestions: suggestionForExactCommand2(command12)
    });
  let modeResult = checkPermissionMode(input, parsed, toolPermissionContext);
  if (modeResult.behavior !== "passthrough")
    decisions.push(modeResult);
  let deniedDecision = decisions.find((d) => d.behavior === "deny");
  if (deniedDecision !== void 0)
    return deniedDecision;
  let askDecision = decisions.find((d) => d.behavior === "ask");
  if (askDecision !== void 0)
    return askDecision;
  let allowDecision = decisions.find((d) => d.behavior === "allow");
  if (allowDecision !== void 0)
    return allowDecision;
  let subCommands = allSubCommands.filter(({ element, isSafeOutput }) => {
    if (isSafeOutput)
      return !1;
    if (element.nameType === "application")
      return !0;
    if (resolveToCanonical(element.name) === "set-location" && element.args.length > 0) {
      let target = element.args.find((a2) => a2.length === 0 || !PS_TOKENIZER_DASH_CHARS.has(a2[0]));
      if (target && resolve32(getCwd(), target) === getCwd())
        return !1;
    }
    return !0;
  }), subCommandsNeedingApproval = [], statementsSeenInLoop = /* @__PURE__ */ new Set;
  for (let { text: subCmd, element, statement } of subCommands) {
    let subResult = powershellToolCheckPermission({ command: subCmd }, toolPermissionContext);
    if (subResult.behavior === "deny")
      return {
        behavior: "deny",
        message: `Permission to use ${POWERSHELL_TOOL_NAME} with command ${command12} has been denied.`,
        decisionReason: subResult.decisionReason
      };
    if (subResult.behavior === "ask") {
      if (statement !== null)
        statementsSeenInLoop.add(statement);
      subCommandsNeedingApproval.push(subCmd);
      continue;
    }
    if (subResult.behavior === "allow" && element.nameType !== "application" && !hasSymlinkCreate) {
      if (argLeaksValue(subCmd, element)) {
        if (statement !== null)
          statementsSeenInLoop.add(statement);
        subCommandsNeedingApproval.push(subCmd);
        continue;
      }
      continue;
    }
    if (subResult.behavior === "allow") {
      if (statement !== null)
        statementsSeenInLoop.add(statement);
      subCommandsNeedingApproval.push(subCmd);
      continue;
    }
    if (statement !== null && !hasCdSubCommand && !hasSymlinkCreate && isProvablySafeStatement(statement) && isAllowlistedCommand(element, subCmd))
      continue;
    if (statement !== null && !hasCdSubCommand && !hasSymlinkCreate) {
      if (checkPermissionMode({ command: subCmd }, {
        valid: !0,
        errors: [],
        variables: parsed.variables,
        hasStopParsing: parsed.hasStopParsing,
        originalCommand: subCmd,
        statements: [statement]
      }, toolPermissionContext).behavior === "allow")
        continue;
    }
    if (statement !== null)
      statementsSeenInLoop.add(statement);
    subCommandsNeedingApproval.push(subCmd);
  }
  for (let stmt of parsed.statements)
    if (!isProvablySafeStatement(stmt) && !statementsSeenInLoop.has(stmt))
      subCommandsNeedingApproval.push(stmt.text);
  if (subCommandsNeedingApproval.length === 0) {
    if (deriveSecurityFlags(parsed).hasScriptBlocks)
      return {
        behavior: "ask",
        message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME),
        decisionReason: {
          type: "other",
          reason: "Pipeline consists of output-formatting cmdlets with script blocks \u2014 block content cannot be verified"
        }
      };
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "All pipeline commands are individually allowed"
      }
    };
  }
  let decisionReason = {
    type: "other",
    reason: "This command requires approval"
  }, pendingSuggestions = [];
  for (let subCmd of subCommandsNeedingApproval)
    pendingSuggestions.push(...suggestionForExactCommand2(subCmd));
  return {
    behavior: "passthrough",
    message: createPermissionRequestMessage2(POWERSHELL_TOOL_NAME, decisionReason),
    decisionReason,
    suggestions: pendingSuggestions
  };
}
