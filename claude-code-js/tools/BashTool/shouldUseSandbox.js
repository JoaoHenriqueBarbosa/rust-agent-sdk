// Original: src/tools/BashTool/shouldUseSandbox.ts
function containsExcludedCommand(command12) {
  let userExcludedCommands = getSettings_DEPRECATED().sandbox?.excludedCommands ?? [];
  if (userExcludedCommands.length === 0)
    return !1;
  let subcommands;
  try {
    subcommands = splitCommand_DEPRECATED(command12);
  } catch {
    subcommands = [command12];
  }
  for (let subcommand of subcommands) {
    let candidates = [subcommand.trim()], seen = new Set(candidates), startIdx = 0;
    while (startIdx < candidates.length) {
      let endIdx = candidates.length;
      for (let i5 = startIdx;i5 < endIdx; i5++) {
        let cmd = candidates[i5], envStripped = stripAllLeadingEnvVars(cmd, BINARY_HIJACK_VARS);
        if (!seen.has(envStripped))
          candidates.push(envStripped), seen.add(envStripped);
        let wrapperStripped = stripSafeWrappers(cmd);
        if (!seen.has(wrapperStripped))
          candidates.push(wrapperStripped), seen.add(wrapperStripped);
      }
      startIdx = endIdx;
    }
    for (let pattern of userExcludedCommands) {
      let rule = bashPermissionRule(pattern);
      for (let cand of candidates)
        switch (rule.type) {
          case "prefix":
            if (cand === rule.prefix || cand.startsWith(rule.prefix + " "))
              return !0;
            break;
          case "exact":
            if (cand === rule.command)
              return !0;
            break;
          case "wildcard":
            if (matchWildcardPattern2(rule.pattern, cand))
              return !0;
            break;
        }
    }
  }
  return !1;
}
function shouldUseSandbox(input) {
  if (!SandboxManager2.isSandboxingEnabled())
    return !1;
  if (input.dangerouslyDisableSandbox && SandboxManager2.areUnsandboxedCommandsAllowed())
    return !1;
  if (!input.command)
    return !1;
  if (containsExcludedCommand(input.command))
    return !1;
  return !0;
}
var init_shouldUseSandbox = __esm(() => {
  init_commands4();
  init_sandbox_adapter();
  init_settings2();
  init_bashPermissions();
});