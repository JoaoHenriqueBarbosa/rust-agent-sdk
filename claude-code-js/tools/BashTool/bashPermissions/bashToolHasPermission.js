// function: bashToolHasPermission
async function bashToolHasPermission(input, context6, getCommandSubcommandPrefixFn = getCommandSubcommandPrefix) {
  let appState = context6.getAppState(), astRoot = isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK) ? null : await parseCommandRaw(input.command), astResult = astRoot ? parseForSecurityFromAst(input.command, astRoot) : { kind: "parse-unavailable" }, astSubcommands = null, astRedirects, astCommands;
  if (astResult.kind === "too-complex") {
    let earlyExit = checkEarlyExitDeny(input, appState.toolPermissionContext);
    if (earlyExit !== null)
      return earlyExit;
    let decisionReason2 = {
      type: "other",
      reason: astResult.reason
    };
    return logEvent("tengu_bash_ast_too_complex", {
      nodeTypeId: nodeTypeId(astResult.nodeType)
    }), {
      behavior: "ask",
      decisionReason: decisionReason2,
      message: createPermissionRequestMessage2(BashTool.name, decisionReason2),
      suggestions: [],
      ...{}
    };
  }
  if (astResult.kind === "simple") {
    let sem = checkSemantics(astResult.commands);
    if (!sem.ok) {
      let earlyExit = checkSemanticsDeny(input, appState.toolPermissionContext, astResult.commands);
      if (earlyExit !== null)
        return earlyExit;
      let decisionReason2 = {
        type: "other",
        reason: sem.reason
      };
      return {
        behavior: "ask",
        decisionReason: decisionReason2,
        message: createPermissionRequestMessage2(BashTool.name, decisionReason2),
        suggestions: []
      };
    }
    astSubcommands = astResult.commands.map((c3) => c3.text), astRedirects = astResult.commands.flatMap((c3) => c3.redirects), astCommands = astResult.commands;
  }
  if (astResult.kind === "parse-unavailable") {
    logForDebugging("bashToolHasPermission: tree-sitter unavailable, using legacy shell-quote path");
    let parseResult = tryParseShellCommand(input.command);
    if (!parseResult.success) {
      let decisionReason2 = {
        type: "other",
        reason: `Command contains malformed syntax that cannot be parsed: ${parseResult.error}`
      };
      return {
        behavior: "ask",
        decisionReason: decisionReason2,
        message: createPermissionRequestMessage2(BashTool.name, decisionReason2)
      };
    }
  }
  if (SandboxManager2.isSandboxingEnabled() && SandboxManager2.isAutoAllowBashIfSandboxedEnabled() && shouldUseSandbox(input)) {
    let sandboxAutoAllowResult = checkSandboxAutoAllow(input, appState.toolPermissionContext);
    if (sandboxAutoAllowResult.behavior !== "passthrough")
      return sandboxAutoAllowResult;
  }
  let exactMatchResult = bashToolCheckExactMatchPermission(input, appState.toolPermissionContext);
  if (exactMatchResult.behavior === "deny")
    return exactMatchResult;
  if (isClassifierPermissionsEnabled()) {
    let denyDescriptions = getBashPromptDenyDescriptions(appState.toolPermissionContext), askDescriptions = getBashPromptAskDescriptions(appState.toolPermissionContext), hasDeny = denyDescriptions.length > 0, hasAsk = askDescriptions.length > 0;
    if (hasDeny || hasAsk) {
      let [denyResult, askResult] = await Promise.all([
        hasDeny ? classifyBashCommand(input.command, getCwd(), denyDescriptions, "deny", context6.abortController.signal, context6.options.isNonInteractiveSession) : null,
        hasAsk ? classifyBashCommand(input.command, getCwd(), askDescriptions, "ask", context6.abortController.signal, context6.options.isNonInteractiveSession) : null
      ]);
      if (context6.abortController.signal.aborted)
        throw new AbortError;
      if (denyResult)
        logClassifierResultForAnts(input.command, "deny", denyDescriptions, denyResult);
      if (askResult)
        logClassifierResultForAnts(input.command, "ask", askDescriptions, askResult);
      if (denyResult?.matches && denyResult.confidence === "high")
        return {
          behavior: "deny",
          message: `Denied by Bash prompt rule: "${denyResult.matchedDescription}"`,
          decisionReason: {
            type: "other",
            reason: `Denied by Bash prompt rule: "${denyResult.matchedDescription}"`
          }
        };
      if (askResult?.matches && askResult.confidence === "high") {
        let suggestions;
        if (getCommandSubcommandPrefixFn === getCommandSubcommandPrefix)
          suggestions = suggestionForExactCommand3(input.command);
        else {
          let commandPrefixResult = await getCommandSubcommandPrefixFn(input.command, context6.abortController.signal, context6.options.isNonInteractiveSession);
          if (context6.abortController.signal.aborted)
            throw new AbortError;
          suggestions = commandPrefixResult?.commandPrefix ? suggestionForPrefix2(commandPrefixResult.commandPrefix) : suggestionForExactCommand3(input.command);
        }
        return {
          behavior: "ask",
          message: createPermissionRequestMessage2(BashTool.name),
          decisionReason: {
            type: "other",
            reason: `Required by Bash prompt rule: "${askResult.matchedDescription}"`
          },
          suggestions,
          ...{}
        };
      }
    }
  }
  let commandOperatorResult = await checkCommandOperatorPermissions(input, (i5) => bashToolHasPermission(i5, context6, getCommandSubcommandPrefixFn), { isNormalizedCdCommand, isNormalizedGitCommand }, astRoot);
  if (commandOperatorResult.behavior !== "passthrough") {
    if (commandOperatorResult.behavior === "allow") {
      let safetyResult = astSubcommands === null ? await bashCommandIsSafeAsync(input.command) : null;
      if (safetyResult !== null && safetyResult.behavior !== "passthrough" && safetyResult.behavior !== "allow")
        return appState = context6.getAppState(), {
          behavior: "ask",
          message: createPermissionRequestMessage2(BashTool.name, {
            type: "other",
            reason: safetyResult.message ?? "Command contains patterns that require approval"
          }),
          decisionReason: {
            type: "other",
            reason: safetyResult.message ?? "Command contains patterns that require approval"
          },
          ...{}
        };
      appState = context6.getAppState();
      let pathResult2 = checkPathConstraints(input, getCwd(), appState.toolPermissionContext, commandHasAnyCd(input.command), astRedirects, astCommands);
      if (pathResult2.behavior !== "passthrough")
        return pathResult2;
    }
    if (commandOperatorResult.behavior === "ask")
      return appState = context6.getAppState(), {
        ...commandOperatorResult,
        ...{}
      };
    return commandOperatorResult;
  }
  if (astSubcommands === null && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
    let originalCommandSafetyResult = await bashCommandIsSafeAsync(input.command);
    if (originalCommandSafetyResult.behavior === "ask" && originalCommandSafetyResult.isBashSecurityCheckForMisparsing) {
      let remainder = stripSafeHeredocSubstitutions(input.command), remainderResult = remainder !== null ? await bashCommandIsSafeAsync(remainder) : null;
      if (remainder === null || remainderResult?.behavior === "ask" && remainderResult.isBashSecurityCheckForMisparsing) {
        appState = context6.getAppState();
        let exactMatchResult2 = bashToolCheckExactMatchPermission(input, appState.toolPermissionContext);
        if (exactMatchResult2.behavior === "allow")
          return exactMatchResult2;
        let decisionReason2 = {
          type: "other",
          reason: originalCommandSafetyResult.message
        };
        return {
          behavior: "ask",
          message: createPermissionRequestMessage2(BashTool.name, decisionReason2),
          decisionReason: decisionReason2,
          suggestions: [],
          ...{}
        };
      }
    }
  }
  let cwd2 = getCwd(), cwdMingw = getPlatform() === "windows" ? windowsPathToPosixPath(cwd2) : cwd2, rawSubcommands = astSubcommands ?? splitCommand(input.command), { subcommands, astCommandsByIdx } = filterCdCwdSubcommands(rawSubcommands, astCommands, cwd2, cwdMingw);
  if (astSubcommands === null && subcommands.length > MAX_SUBCOMMANDS_FOR_SECURITY_CHECK) {
    logForDebugging(`bashPermissions: ${subcommands.length} subcommands exceeds cap (${MAX_SUBCOMMANDS_FOR_SECURITY_CHECK}) \u2014 returning ask`, { level: "debug" });
    let decisionReason2 = {
      type: "other",
      reason: `Command splits into ${subcommands.length} subcommands, too many to safety-check individually`
    };
    return {
      behavior: "ask",
      message: createPermissionRequestMessage2(BashTool.name, decisionReason2),
      decisionReason: decisionReason2
    };
  }
  let cdCommands = subcommands.filter((subCommand) => isNormalizedCdCommand(subCommand));
  if (cdCommands.length > 1) {
    let decisionReason2 = {
      type: "other",
      reason: "Multiple directory changes in one command require approval for clarity"
    };
    return {
      behavior: "ask",
      decisionReason: decisionReason2,
      message: createPermissionRequestMessage2(BashTool.name, decisionReason2)
    };
  }
  let compoundCommandHasCd = cdCommands.length > 0;
  if (compoundCommandHasCd) {
    if (subcommands.some((cmd) => isNormalizedGitCommand(cmd.trim()))) {
      let decisionReason2 = {
        type: "other",
        reason: "Compound commands with cd and git require approval to prevent bare repository attacks"
      };
      return {
        behavior: "ask",
        decisionReason: decisionReason2,
        message: createPermissionRequestMessage2(BashTool.name, decisionReason2)
      };
    }
  }
  appState = context6.getAppState();
  let subcommandPermissionDecisions = subcommands.map((command12, i5) => bashToolCheckPermission({ command: command12 }, appState.toolPermissionContext, compoundCommandHasCd, astCommandsByIdx[i5]));
  if (subcommandPermissionDecisions.find((_) => _.behavior === "deny") !== void 0)
    return {
      behavior: "deny",
      message: `Permission to use ${BashTool.name} with command ${input.command} has been denied.`,
      decisionReason: {
        type: "subcommandResults",
        reasons: new Map(subcommandPermissionDecisions.map((result, i5) => [
          subcommands[i5],
          result
        ]))
      }
    };
  let pathResult = checkPathConstraints(input, getCwd(), appState.toolPermissionContext, compoundCommandHasCd, astRedirects, astCommands);
  if (pathResult.behavior === "deny")
    return pathResult;
  let askSubresult = subcommandPermissionDecisions.find((_) => _.behavior === "ask"), nonAllowCount = count2(subcommandPermissionDecisions, (_) => _.behavior !== "allow");
  if (pathResult.behavior === "ask" && askSubresult === void 0)
    return pathResult;
  if (askSubresult !== void 0 && nonAllowCount === 1)
    return {
      ...askSubresult,
      ...{}
    };
  if (exactMatchResult.behavior === "allow")
    return exactMatchResult;
  let hasPossibleCommandInjection = !1;
  if (astSubcommands === null && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK)) {
    let divergenceCount = 0, onDivergence = () => {
      divergenceCount++;
    };
    if (hasPossibleCommandInjection = (await Promise.all(subcommands.map((c3) => bashCommandIsSafeAsync(c3, onDivergence)))).some((r4) => r4.behavior !== "passthrough"), divergenceCount > 0)
      logEvent("tengu_tree_sitter_security_divergence", {
        quoteContextDivergence: !0,
        count: divergenceCount
      });
  }
  if (subcommandPermissionDecisions.every((_) => _.behavior === "allow") && !hasPossibleCommandInjection)
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "subcommandResults",
        reasons: new Map(subcommandPermissionDecisions.map((result, i5) => [
          subcommands[i5],
          result
        ]))
      }
    };
  let commandSubcommandPrefix = null;
  if (getCommandSubcommandPrefixFn !== getCommandSubcommandPrefix) {
    if (commandSubcommandPrefix = await getCommandSubcommandPrefixFn(input.command, context6.abortController.signal, context6.options.isNonInteractiveSession), context6.abortController.signal.aborted)
      throw new AbortError;
  }
  if (appState = context6.getAppState(), subcommands.length === 1) {
    let result = await checkCommandAndSuggestRules({ command: subcommands[0] }, appState.toolPermissionContext, commandSubcommandPrefix, compoundCommandHasCd, astSubcommands !== null);
    if (result.behavior === "ask" || result.behavior === "passthrough")
      return {
        ...result,
        ...{}
      };
    return result;
  }
  let subcommandResults = /* @__PURE__ */ new Map;
  for (let subcommand of subcommands)
    subcommandResults.set(subcommand, await checkCommandAndSuggestRules({
      ...input,
      command: subcommand
    }, appState.toolPermissionContext, commandSubcommandPrefix?.subcommandPrefixes.get(subcommand), compoundCommandHasCd, astSubcommands !== null));
  if (subcommands.every((subcommand) => {
    return subcommandResults.get(subcommand)?.behavior === "allow";
  }))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "subcommandResults",
        reasons: subcommandResults
      }
    };
  let collectedRules = /* @__PURE__ */ new Map;
  for (let [subcommand, permissionResult] of subcommandResults)
    if (permissionResult.behavior === "ask" || permissionResult.behavior === "passthrough") {
      let updates = "suggestions" in permissionResult ? permissionResult.suggestions : void 0, rules2 = extractRules(updates);
      for (let rule of rules2) {
        let ruleKey = permissionRuleValueToString(rule);
        collectedRules.set(ruleKey, rule);
      }
      if (permissionResult.behavior === "ask" && rules2.length === 0 && permissionResult.decisionReason?.type !== "rule")
        for (let rule of extractRules(suggestionForExactCommand3(subcommand))) {
          let ruleKey = permissionRuleValueToString(rule);
          collectedRules.set(ruleKey, rule);
        }
    }
  let decisionReason = {
    type: "subcommandResults",
    reasons: subcommandResults
  }, cappedRules = Array.from(collectedRules.values()).slice(0, MAX_SUGGESTED_RULES_FOR_COMPOUND), suggestedUpdates = cappedRules.length > 0 ? [
    {
      type: "addRules",
      rules: cappedRules,
      behavior: "allow",
      destination: "localSettings"
    }
  ] : void 0;
  return {
    behavior: askSubresult !== void 0 ? "ask" : "passthrough",
    message: createPermissionRequestMessage2(BashTool.name, decisionReason),
    decisionReason,
    suggestions: suggestedUpdates,
    ...{}
  };
}
