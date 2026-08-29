// function: deriveSecurityFlags
function deriveSecurityFlags(parsed) {
  let flags = {
    hasSubExpressions: !1,
    hasScriptBlocks: !1,
    hasSplatting: !1,
    hasExpandableStrings: !1,
    hasMemberInvocations: !1,
    hasAssignments: !1,
    hasStopParsing: parsed.hasStopParsing
  };
  function checkElements(cmd) {
    if (!cmd.elementTypes)
      return;
    for (let et2 of cmd.elementTypes)
      switch (et2) {
        case "ScriptBlock":
          flags.hasScriptBlocks = !0;
          break;
        case "SubExpression":
          flags.hasSubExpressions = !0;
          break;
        case "ExpandableString":
          flags.hasExpandableStrings = !0;
          break;
        case "MemberInvocation":
          flags.hasMemberInvocations = !0;
          break;
      }
  }
  for (let stmt of parsed.statements) {
    if (stmt.statementType === "AssignmentStatementAst")
      flags.hasAssignments = !0;
    for (let cmd of stmt.commands)
      checkElements(cmd);
    if (stmt.nestedCommands)
      for (let cmd of stmt.nestedCommands)
        checkElements(cmd);
    if (stmt.securityPatterns) {
      if (stmt.securityPatterns.hasMemberInvocations)
        flags.hasMemberInvocations = !0;
      if (stmt.securityPatterns.hasSubExpressions)
        flags.hasSubExpressions = !0;
      if (stmt.securityPatterns.hasExpandableStrings)
        flags.hasExpandableStrings = !0;
      if (stmt.securityPatterns.hasScriptBlocks)
        flags.hasScriptBlocks = !0;
    }
  }
  for (let v2 of parsed.variables)
    if (v2.isSplatted) {
      flags.hasSplatting = !0;
      break;
    }
  return flags;
}
