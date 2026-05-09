// Original: src/tools/BashTool/bashCommandHelpers.ts
async function segmentedCommandPermissionResult(input, segments, bashToolHasPermissionFn, checkers) {
  if (segments.filter((segment) => {
    let trimmed = segment.trim();
    return checkers.isNormalizedCdCommand(trimmed);
  }).length > 1) {
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
  {
    let hasCd = !1, hasGit = !1;
    for (let segment of segments) {
      let subcommands = splitCommand_DEPRECATED(segment);
      for (let sub of subcommands) {
        let trimmed = sub.trim();
        if (checkers.isNormalizedCdCommand(trimmed))
          hasCd = !0;
        if (checkers.isNormalizedGitCommand(trimmed))
          hasGit = !0;
      }
    }
    if (hasCd && hasGit) {
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
  let segmentResults = /* @__PURE__ */ new Map;
  for (let segment of segments) {
    let trimmedSegment = segment.trim();
    if (!trimmedSegment)
      continue;
    let segmentResult = await bashToolHasPermissionFn({
      ...input,
      command: trimmedSegment
    });
    segmentResults.set(trimmedSegment, segmentResult);
  }
  let deniedSegment = Array.from(segmentResults.entries()).find(([, result]) => result.behavior === "deny");
  if (deniedSegment) {
    let [segmentCommand, segmentResult] = deniedSegment;
    return {
      behavior: "deny",
      message: segmentResult.behavior === "deny" ? segmentResult.message : `Permission denied for: ${segmentCommand}`,
      decisionReason: {
        type: "subcommandResults",
        reasons: segmentResults
      }
    };
  }
  if (Array.from(segmentResults.values()).every((result) => result.behavior === "allow"))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "subcommandResults",
        reasons: segmentResults
      }
    };
  let suggestions = [];
  for (let [, result] of segmentResults)
    if (result.behavior !== "allow" && "suggestions" in result && result.suggestions)
      suggestions.push(...result.suggestions);
  let decisionReason = {
    type: "subcommandResults",
    reasons: segmentResults
  };
  return {
    behavior: "ask",
    message: createPermissionRequestMessage2(BashTool.name, decisionReason),
    decisionReason,
    suggestions: suggestions.length > 0 ? suggestions : void 0
  };
}
async function buildSegmentWithoutRedirections(segmentCommand) {
  if (!segmentCommand.includes(">"))
    return segmentCommand;
  return (await ParsedCommand.parse(segmentCommand))?.withoutOutputRedirections() ?? segmentCommand;
}
async function checkCommandOperatorPermissions(input, bashToolHasPermissionFn, checkers, astRoot) {
  let parsed = astRoot && astRoot !== PARSE_ABORTED ? buildParsedCommandFromRoot(input.command, astRoot) : await ParsedCommand.parse(input.command);
  if (!parsed)
    return { behavior: "passthrough", message: "Failed to parse command" };
  return bashToolCheckCommandOperatorPermissions(input, bashToolHasPermissionFn, checkers, parsed);
}
async function bashToolCheckCommandOperatorPermissions(input, bashToolHasPermissionFn, checkers, parsed) {
  let tsAnalysis = parsed.getTreeSitterAnalysis();
  if (tsAnalysis ? tsAnalysis.compoundStructure.hasSubshell || tsAnalysis.compoundStructure.hasCommandGroup : isUnsafeCompoundCommand_DEPRECATED(input.command)) {
    let safetyResult = await bashCommandIsSafeAsync_DEPRECATED(input.command), decisionReason = {
      type: "other",
      reason: safetyResult.behavior === "ask" && safetyResult.message ? safetyResult.message : "This command uses shell operators that require approval for safety"
    };
    return {
      behavior: "ask",
      message: createPermissionRequestMessage2(BashTool.name, decisionReason),
      decisionReason
    };
  }
  let pipeSegments = parsed.getPipeSegments();
  if (pipeSegments.length <= 1)
    return {
      behavior: "passthrough",
      message: "No pipes found in command"
    };
  let segments = await Promise.all(pipeSegments.map((segment) => buildSegmentWithoutRedirections(segment)));
  return segmentedCommandPermissionResult(input, segments, bashToolHasPermissionFn, checkers);
}
var init_bashCommandHelpers = __esm(() => {
  init_commands4();
  init_ParsedCommand();
  init_parser4();
  init_permissions2();
  init_BashTool();
  init_bashSecurity();
});
