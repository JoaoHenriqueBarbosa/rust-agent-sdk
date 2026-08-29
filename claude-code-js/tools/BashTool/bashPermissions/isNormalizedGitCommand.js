// function: isNormalizedGitCommand
function isNormalizedGitCommand(command12) {
  if (command12.startsWith("git ") || command12 === "git")
    return !0;
  let stripped = stripSafeWrappers(command12), parsed = tryParseShellCommand(stripped);
  if (parsed.success && parsed.tokens.length > 0) {
    if (parsed.tokens[0] === "git")
      return !0;
    if (parsed.tokens[0] === "xargs" && parsed.tokens.includes("git"))
      return !0;
    return !1;
  }
  return /^git(?:\s|$)/.test(stripped);
}
