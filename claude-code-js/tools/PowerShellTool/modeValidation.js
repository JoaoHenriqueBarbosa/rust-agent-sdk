// Original: src/tools/PowerShellTool/modeValidation.ts
function isAcceptEditsAllowedCmdlet(name3) {
  let canonical = resolveToCanonical(name3);
  return ACCEPT_EDITS_ALLOWED_CMDLETS.has(canonical);
}
function isItemTypeParamAbbrev(p4) {
  return p4.length >= 3 && "-itemtype".startsWith(p4) || p4.length >= 3 && "-type".startsWith(p4);
}
function isSymlinkCreatingCommand(cmd) {
  if (resolveToCanonical(cmd.name) !== "new-item")
    return !1;
  for (let i5 = 0;i5 < cmd.args.length; i5++) {
    let raw = cmd.args[i5] ?? "";
    if (raw.length === 0)
      continue;
    let lower = (PS_TOKENIZER_DASH_CHARS.has(raw[0]) || raw[0] === "/" ? "-" + raw.slice(1) : raw).toLowerCase(), colonIdx = lower.indexOf(":", 1), param = (colonIdx > 0 ? lower.slice(0, colonIdx) : lower).replace(/`/g, "");
    if (!isItemTypeParamAbbrev(param))
      continue;
    let val = (colonIdx > 0 ? lower.slice(colonIdx + 1) : cmd.args[i5 + 1]?.toLowerCase() ?? "").replace(/`/g, "").replace(/^['"]|['"]$/g, "");
    if (LINK_ITEM_TYPES.has(val))
      return !0;
  }
  return !1;
}
function checkPermissionMode(input, parsed, toolPermissionContext) {
  if (toolPermissionContext.mode === "bypassPermissions" || toolPermissionContext.mode === "dontAsk")
    return {
      behavior: "passthrough",
      message: "Mode is handled in main permission flow"
    };
  if (toolPermissionContext.mode !== "acceptEdits")
    return {
      behavior: "passthrough",
      message: "No mode-specific validation required"
    };
  if (!parsed.valid)
    return {
      behavior: "passthrough",
      message: "Cannot validate mode for unparsed command"
    };
  let securityFlags = deriveSecurityFlags(parsed);
  if (securityFlags.hasSubExpressions || securityFlags.hasScriptBlocks || securityFlags.hasMemberInvocations || securityFlags.hasSplatting || securityFlags.hasAssignments || securityFlags.hasStopParsing || securityFlags.hasExpandableStrings)
    return {
      behavior: "passthrough",
      message: "Command contains subexpressions, script blocks, or member invocations that require approval"
    };
  let segments = getPipelineSegments(parsed);
  if (segments.length === 0)
    return {
      behavior: "passthrough",
      message: "No commands found to validate for acceptEdits mode"
    };
  if (segments.reduce((sum, seg) => sum + seg.commands.length, 0) > 1) {
    let hasCdCommand = !1, hasSymlinkCreate = !1, hasWriteCommand = !1;
    for (let seg of segments)
      for (let cmd of seg.commands) {
        if (cmd.elementType !== "CommandAst")
          continue;
        if (isCwdChangingCmdlet(cmd.name))
          hasCdCommand = !0;
        if (isSymlinkCreatingCommand(cmd))
          hasSymlinkCreate = !0;
        if (isAcceptEditsAllowedCmdlet(cmd.name))
          hasWriteCommand = !0;
      }
    if (hasCdCommand && hasWriteCommand)
      return {
        behavior: "passthrough",
        message: "Compound command contains a directory-changing command (Set-Location/Push-Location/Pop-Location) with a write operation \u2014 cannot auto-allow because path validation uses stale cwd"
      };
    if (hasSymlinkCreate)
      return {
        behavior: "passthrough",
        message: "Compound command creates a filesystem link (New-Item -ItemType SymbolicLink/Junction/HardLink) \u2014 cannot auto-allow because path validation cannot follow just-created links"
      };
  }
  for (let segment of segments) {
    for (let cmd of segment.commands) {
      if (cmd.elementType !== "CommandAst")
        return {
          behavior: "passthrough",
          message: `Pipeline contains expression source (${cmd.elementType}) that cannot be statically validated`
        };
      if (cmd.nameType === "application")
        return {
          behavior: "passthrough",
          message: `Command '${cmd.name}' resolved from a path-like name and requires approval`
        };
      if (cmd.elementTypes)
        for (let i5 = 1;i5 < cmd.elementTypes.length; i5++) {
          let t2 = cmd.elementTypes[i5];
          if (t2 !== "StringConstant" && t2 !== "Parameter")
            return {
              behavior: "passthrough",
              message: `Command argument has unvalidatable type (${t2}) \u2014 variable paths cannot be statically resolved`
            };
          if (t2 === "Parameter") {
            let arg = cmd.args[i5 - 1] ?? "", colonIdx = arg.indexOf(":");
            if (colonIdx > 0 && /[$(@{[]/.test(arg.slice(colonIdx + 1)))
              return {
                behavior: "passthrough",
                message: "Colon-bound parameter contains an expression that cannot be statically validated"
              };
          }
        }
      if (isSafeOutputCommand(cmd.name) || isAllowlistedPipelineTail(cmd, input.command))
        continue;
      if (!isAcceptEditsAllowedCmdlet(cmd.name))
        return {
          behavior: "passthrough",
          message: `No mode-specific handling for '${cmd.name}' in acceptEdits mode`
        };
      if (argLeaksValue(cmd.name, cmd))
        return {
          behavior: "passthrough",
          message: `Arguments in '${cmd.name}' cannot be statically validated in acceptEdits mode`
        };
    }
    if (segment.nestedCommands)
      for (let cmd of segment.nestedCommands) {
        if (cmd.elementType !== "CommandAst")
          return {
            behavior: "passthrough",
            message: `Nested expression element (${cmd.elementType}) cannot be statically validated`
          };
        if (cmd.nameType === "application")
          return {
            behavior: "passthrough",
            message: `Nested command '${cmd.name}' resolved from a path-like name and requires approval`
          };
        if (isSafeOutputCommand(cmd.name) || isAllowlistedPipelineTail(cmd, input.command))
          continue;
        if (!isAcceptEditsAllowedCmdlet(cmd.name))
          return {
            behavior: "passthrough",
            message: `No mode-specific handling for '${cmd.name}' in acceptEdits mode`
          };
        if (argLeaksValue(cmd.name, cmd))
          return {
            behavior: "passthrough",
            message: `Arguments in nested '${cmd.name}' cannot be statically validated in acceptEdits mode`
          };
      }
  }
  return {
    behavior: "allow",
    updatedInput: input,
    decisionReason: {
      type: "mode",
      mode: "acceptEdits"
    }
  };
}
var ACCEPT_EDITS_ALLOWED_CMDLETS, LINK_ITEM_TYPES;
var init_modeValidation = __esm(() => {
  init_parser5();
  init_readOnlyValidation2();
  ACCEPT_EDITS_ALLOWED_CMDLETS = /* @__PURE__ */ new Set([
    "set-content",
    "add-content",
    "remove-item",
    "clear-content"
  ]);
  LINK_ITEM_TYPES = /* @__PURE__ */ new Set(["symboliclink", "junction", "hardlink"]);
});
