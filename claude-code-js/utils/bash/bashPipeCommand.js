// Original: src/utils/bash/bashPipeCommand.ts
function rearrangePipeCommand(command12) {
  if (command12.includes("`"))
    return quoteWithEvalStdinRedirect(command12);
  if (command12.includes("$("))
    return quoteWithEvalStdinRedirect(command12);
  if (/\$[A-Za-z_{]/.test(command12))
    return quoteWithEvalStdinRedirect(command12);
  if (containsControlStructure(command12))
    return quoteWithEvalStdinRedirect(command12);
  let joined = joinContinuationLines(command12);
  if (joined.includes(`
`))
    return quoteWithEvalStdinRedirect(command12);
  if (hasShellQuoteSingleQuoteBug(joined))
    return quoteWithEvalStdinRedirect(command12);
  let parseResult = tryParseShellCommand(joined);
  if (!parseResult.success)
    return quoteWithEvalStdinRedirect(command12);
  let parsed = parseResult.tokens;
  if (hasMalformedTokens(joined, parsed))
    return quoteWithEvalStdinRedirect(command12);
  let firstPipeIndex = findFirstPipeOperator(parsed);
  if (firstPipeIndex <= 0)
    return quoteWithEvalStdinRedirect(command12);
  let parts = [
    ...buildCommandParts(parsed, 0, firstPipeIndex),
    "< /dev/null",
    ...buildCommandParts(parsed, firstPipeIndex, parsed.length)
  ];
  return singleQuoteForEval(parts.join(" "));
}
function findFirstPipeOperator(parsed) {
  for (let i5 = 0;i5 < parsed.length; i5++) {
    let entry = parsed[i5];
    if (isOperator(entry, "|"))
      return i5;
  }
  return -1;
}
function buildCommandParts(parsed, start, end) {
  let parts = [], seenNonEnvVar = !1;
  for (let i5 = start;i5 < end; i5++) {
    let entry = parsed[i5];
    if (typeof entry === "string" && /^[012]$/.test(entry) && i5 + 2 < end && isOperator(parsed[i5 + 1])) {
      let op = parsed[i5 + 1], target = parsed[i5 + 2];
      if (op.op === ">&" && typeof target === "string" && /^[012]$/.test(target)) {
        parts.push(`${entry}>&${target}`), i5 += 2;
        continue;
      }
      if (op.op === ">" && target === "/dev/null") {
        parts.push(`${entry}>/dev/null`), i5 += 2;
        continue;
      }
      if (op.op === ">" && typeof target === "string" && target.startsWith("&")) {
        let fd2 = target.slice(1);
        if (/^[012]$/.test(fd2)) {
          parts.push(`${entry}>&${fd2}`), i5 += 2;
          continue;
        }
      }
    }
    if (typeof entry === "string")
      if (!seenNonEnvVar && isEnvironmentVariableAssignment(entry)) {
        let eqIndex = entry.indexOf("="), name3 = entry.slice(0, eqIndex), value = entry.slice(eqIndex + 1), quotedValue = quote([value]);
        parts.push(`${name3}=${quotedValue}`);
      } else
        seenNonEnvVar = !0, parts.push(quote([entry]));
    else if (isOperator(entry)) {
      if (entry.op === "glob" && "pattern" in entry)
        parts.push(entry.pattern);
      else if (parts.push(entry.op), isCommandSeparator(entry.op))
        seenNonEnvVar = !1;
    }
  }
  return parts;
}
function isEnvironmentVariableAssignment(str2) {
  return /^[A-Za-z_][A-Za-z0-9_]*=/.test(str2);
}
function isCommandSeparator(op) {
  return op === "&&" || op === "||" || op === ";";
}
function isOperator(entry, op) {
  if (!entry || typeof entry !== "object" || !("op" in entry))
    return !1;
  return op ? entry.op === op : !0;
}
function containsControlStructure(command12) {
  return /\b(for|while|until|if|case|select)\s/.test(command12);
}
function quoteWithEvalStdinRedirect(command12) {
  return singleQuoteForEval(command12) + " < /dev/null";
}
function singleQuoteForEval(s2) {
  return "'" + s2.replace(/'/g, `'"'"'`) + "'";
}
function joinContinuationLines(command12) {
  return command12.replace(/\\+\n/g, (match) => {
    let backslashCount = match.length - 1;
    if (backslashCount % 2 === 1)
      return "\\".repeat(backslashCount - 1);
    else
      return match;
  });
}
var init_bashPipeCommand = __esm(() => {
  init_shellQuote();
});
