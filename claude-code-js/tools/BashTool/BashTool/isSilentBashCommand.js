// function: isSilentBashCommand
function isSilentBashCommand(command12) {
  let partsWithOperators;
  try {
    partsWithOperators = splitCommandWithOperators(command12);
  } catch {
    return !1;
  }
  if (partsWithOperators.length === 0)
    return !1;
  let hasNonFallbackCommand = !1, lastOperator = null, skipNextAsRedirectTarget = !1;
  for (let part of partsWithOperators) {
    if (skipNextAsRedirectTarget) {
      skipNextAsRedirectTarget = !1;
      continue;
    }
    if (part === ">" || part === ">>" || part === ">&") {
      skipNextAsRedirectTarget = !0;
      continue;
    }
    if (part === "||" || part === "&&" || part === "|" || part === ";") {
      lastOperator = part;
      continue;
    }
    let baseCommand = part.trim().split(/\s+/)[0];
    if (!baseCommand)
      continue;
    if (lastOperator === "||" && BASH_SEMANTIC_NEUTRAL_COMMANDS.has(baseCommand))
      continue;
    if (hasNonFallbackCommand = !0, !BASH_SILENT_COMMANDS.has(baseCommand))
      return !1;
  }
  return hasNonFallbackCommand;
}
