// function: checkScriptBlockInjection
function checkScriptBlockInjection(parsed) {
  if (!deriveSecurityFlags(parsed).hasScriptBlocks)
    return { behavior: "passthrough" };
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if (DANGEROUS_SCRIPT_BLOCK_CMDLETS.has(lower))
      return {
        behavior: "ask",
        message: "Command contains script block with dangerous cmdlet that may execute arbitrary code"
      };
  }
  if (getAllCommands2(parsed).every((cmd) => {
    let lower = cmd.name.toLowerCase();
    if (SAFE_SCRIPT_BLOCK_CMDLETS.has(lower))
      return !0;
    let alias = COMMON_ALIASES[lower];
    if (alias && SAFE_SCRIPT_BLOCK_CMDLETS.has(alias.toLowerCase()))
      return !0;
    return !1;
  }))
    return { behavior: "passthrough" };
  return {
    behavior: "ask",
    message: "Command contains script block that may execute arbitrary code"
  };
}
