// function: isNormalizedCdCommand
function isNormalizedCdCommand(command12) {
  let stripped = stripSafeWrappers(command12), parsed = tryParseShellCommand(stripped);
  if (parsed.success && parsed.tokens.length > 0) {
    let cmd = parsed.tokens[0];
    return cmd === "cd" || cmd === "pushd" || cmd === "popd";
  }
  return /^(?:cd|pushd|popd)(?:\s|$)/.test(stripped);
}
