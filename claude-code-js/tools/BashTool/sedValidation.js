// Original: src/tools/BashTool/sedValidation.ts
function validateFlagsAgainstAllowlist(flags, allowedFlags) {
  for (let flag of flags)
    if (flag.startsWith("-") && !flag.startsWith("--") && flag.length > 2)
      for (let i5 = 1;i5 < flag.length; i5++) {
        let singleFlag = "-" + flag[i5];
        if (!allowedFlags.includes(singleFlag))
          return !1;
      }
    else if (!allowedFlags.includes(flag))
      return !1;
  return !0;
}
function isLinePrintingCommand(command12, expressions) {
  let sedMatch = command12.match(/^\s*sed\s+/);
  if (!sedMatch)
    return !1;
  let withoutSed = command12.slice(sedMatch[0].length), parseResult = tryParseShellCommand(withoutSed);
  if (!parseResult.success)
    return !1;
  let parsed = parseResult.tokens, flags = [];
  for (let arg of parsed)
    if (typeof arg === "string" && arg.startsWith("-") && arg !== "--")
      flags.push(arg);
  if (!validateFlagsAgainstAllowlist(flags, [
    "-n",
    "--quiet",
    "--silent",
    "-E",
    "--regexp-extended",
    "-r",
    "-z",
    "--zero-terminated",
    "--posix"
  ]))
    return !1;
  let hasNFlag = !1;
  for (let flag of flags) {
    if (flag === "-n" || flag === "--quiet" || flag === "--silent") {
      hasNFlag = !0;
      break;
    }
    if (flag.startsWith("-") && !flag.startsWith("--") && flag.includes("n")) {
      hasNFlag = !0;
      break;
    }
  }
  if (!hasNFlag)
    return !1;
  if (expressions.length === 0)
    return !1;
  for (let expr of expressions) {
    let commands7 = expr.split(";");
    for (let cmd of commands7)
      if (!isPrintCommand(cmd.trim()))
        return !1;
  }
  return !0;
}
function isPrintCommand(cmd) {
  if (!cmd)
    return !1;
  return /^(?:\d+|\d+,\d+)?p$/.test(cmd);
}
function isSubstitutionCommand(command12, expressions, hasFileArguments, options2) {
  let allowFileWrites = options2?.allowFileWrites ?? !1;
  if (!allowFileWrites && hasFileArguments)
    return !1;
  let sedMatch = command12.match(/^\s*sed\s+/);
  if (!sedMatch)
    return !1;
  let withoutSed = command12.slice(sedMatch[0].length), parseResult = tryParseShellCommand(withoutSed);
  if (!parseResult.success)
    return !1;
  let parsed = parseResult.tokens, flags = [];
  for (let arg of parsed)
    if (typeof arg === "string" && arg.startsWith("-") && arg !== "--")
      flags.push(arg);
  let allowedFlags = ["-E", "--regexp-extended", "-r", "--posix"];
  if (allowFileWrites)
    allowedFlags.push("-i", "--in-place");
  if (!validateFlagsAgainstAllowlist(flags, allowedFlags))
    return !1;
  if (expressions.length !== 1)
    return !1;
  let expr = expressions[0].trim();
  if (!expr.startsWith("s"))
    return !1;
  let substitutionMatch = expr.match(/^s\/(.*?)$/);
  if (!substitutionMatch)
    return !1;
  let rest = substitutionMatch[1], delimiterCount = 0, lastDelimiterPos = -1, i5 = 0;
  while (i5 < rest.length) {
    if (rest[i5] === "\\") {
      i5 += 2;
      continue;
    }
    if (rest[i5] === "/")
      delimiterCount++, lastDelimiterPos = i5;
    i5++;
  }
  if (delimiterCount !== 2)
    return !1;
  let exprFlags = rest.slice(lastDelimiterPos + 1);
  if (!/^[gpimIM]*[1-9]?[gpimIM]*$/.test(exprFlags))
    return !1;
  return !0;
}
function sedCommandIsAllowedByAllowlist(command12, options2) {
  let allowFileWrites = options2?.allowFileWrites ?? !1, expressions;
  try {
    expressions = extractSedExpressions(command12);
  } catch (_error) {
    return !1;
  }
  let hasFileArguments = hasFileArgs(command12), isPattern1 = !1, isPattern2 = !1;
  if (allowFileWrites)
    isPattern2 = isSubstitutionCommand(command12, expressions, hasFileArguments, {
      allowFileWrites: !0
    });
  else
    isPattern1 = isLinePrintingCommand(command12, expressions), isPattern2 = isSubstitutionCommand(command12, expressions, hasFileArguments);
  if (!isPattern1 && !isPattern2)
    return !1;
  for (let expr of expressions)
    if (isPattern2 && expr.includes(";"))
      return !1;
  for (let expr of expressions)
    if (containsDangerousOperations(expr))
      return !1;
  return !0;
}
function hasFileArgs(command12) {
  let sedMatch = command12.match(/^\s*sed\s+/);
  if (!sedMatch)
    return !1;
  let withoutSed = command12.slice(sedMatch[0].length), parseResult = tryParseShellCommand(withoutSed);
  if (!parseResult.success)
    return !0;
  let parsed = parseResult.tokens;
  try {
    let argCount = 0, hasEFlag = !1;
    for (let i5 = 0;i5 < parsed.length; i5++) {
      let arg = parsed[i5];
      if (typeof arg !== "string" && typeof arg !== "object")
        continue;
      if (typeof arg === "object" && arg !== null && "op" in arg && arg.op === "glob")
        return !0;
      if (typeof arg !== "string")
        continue;
      if ((arg === "-e" || arg === "--expression") && i5 + 1 < parsed.length) {
        hasEFlag = !0, i5++;
        continue;
      }
      if (arg.startsWith("--expression=")) {
        hasEFlag = !0;
        continue;
      }
      if (arg.startsWith("-e=")) {
        hasEFlag = !0;
        continue;
      }
      if (arg.startsWith("-"))
        continue;
      if (argCount++, hasEFlag)
        return !0;
      if (argCount > 1)
        return !0;
    }
    return !1;
  } catch (_error) {
    return !0;
  }
}
function extractSedExpressions(command12) {
  let expressions = [], sedMatch = command12.match(/^\s*sed\s+/);
  if (!sedMatch)
    return expressions;
  let withoutSed = command12.slice(sedMatch[0].length);
  if (/-e[wWe]/.test(withoutSed) || /-w[eE]/.test(withoutSed))
    throw Error("Dangerous flag combination detected");
  let parseResult = tryParseShellCommand(withoutSed);
  if (!parseResult.success)
    throw Error(`Malformed shell syntax: ${parseResult.error}`);
  let parsed = parseResult.tokens;
  try {
    let foundEFlag = !1, foundExpression = !1;
    for (let i5 = 0;i5 < parsed.length; i5++) {
      let arg = parsed[i5];
      if (typeof arg !== "string")
        continue;
      if ((arg === "-e" || arg === "--expression") && i5 + 1 < parsed.length) {
        foundEFlag = !0;
        let nextArg = parsed[i5 + 1];
        if (typeof nextArg === "string")
          expressions.push(nextArg), i5++;
        continue;
      }
      if (arg.startsWith("--expression=")) {
        foundEFlag = !0, expressions.push(arg.slice(13));
        continue;
      }
      if (arg.startsWith("-e=")) {
        foundEFlag = !0, expressions.push(arg.slice(3));
        continue;
      }
      if (arg.startsWith("-"))
        continue;
      if (!foundEFlag && !foundExpression) {
        expressions.push(arg), foundExpression = !0;
        continue;
      }
      break;
    }
  } catch (error44) {
    throw Error(`Failed to parse sed command: ${error44 instanceof Error ? error44.message : "Unknown error"}`);
  }
  return expressions;
}
function containsDangerousOperations(expression) {
  let cmd = expression.trim();
  if (!cmd)
    return !1;
  if (/[^\x01-\x7F]/.test(cmd))
    return !0;
  if (cmd.includes("{") || cmd.includes("}"))
    return !0;
  if (cmd.includes(`
`))
    return !0;
  let hashIndex = cmd.indexOf("#");
  if (hashIndex !== -1 && !(hashIndex > 0 && cmd[hashIndex - 1] === "s"))
    return !0;
  if (/^!/.test(cmd) || /[/\d$]!/.test(cmd))
    return !0;
  if (/\d\s*~\s*\d|,\s*~\s*\d|\$\s*~\s*\d/.test(cmd))
    return !0;
  if (/^,/.test(cmd))
    return !0;
  if (/,\s*[+-]/.test(cmd))
    return !0;
  if (/s\\/.test(cmd) || /\\[|#%@]/.test(cmd))
    return !0;
  if (/\\\/.*[wW]/.test(cmd))
    return !0;
  if (/\/[^/]*\s+[wWeE]/.test(cmd))
    return !0;
  if (/^s\//.test(cmd) && !/^s\/[^/]*\/[^/]*\/[^/]*$/.test(cmd))
    return !0;
  if (/^s./.test(cmd) && /[wWeE]$/.test(cmd)) {
    if (!/^s([^\\\n]).*?\1.*?\1[^wWeE]*$/.test(cmd))
      return !0;
  }
  if (/^[wW]\s*\S+/.test(cmd) || /^\d+\s*[wW]\s*\S+/.test(cmd) || /^\$\s*[wW]\s*\S+/.test(cmd) || /^\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(cmd) || /^\d+,\d+\s*[wW]\s*\S+/.test(cmd) || /^\d+,\$\s*[wW]\s*\S+/.test(cmd) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*[wW]\s*\S+/.test(cmd))
    return !0;
  if (/^e/.test(cmd) || /^\d+\s*e/.test(cmd) || /^\$\s*e/.test(cmd) || /^\/[^/]*\/[IMim]*\s*e/.test(cmd) || /^\d+,\d+\s*e/.test(cmd) || /^\d+,\$\s*e/.test(cmd) || /^\/[^/]*\/[IMim]*,\/[^/]*\/[IMim]*\s*e/.test(cmd))
    return !0;
  let substitutionMatch = cmd.match(/s([^\\\n]).*?\1.*?\1(.*?)$/);
  if (substitutionMatch) {
    let flags = substitutionMatch[2] || "";
    if (flags.includes("w") || flags.includes("W"))
      return !0;
    if (flags.includes("e") || flags.includes("E"))
      return !0;
  }
  if (cmd.match(/y([^\\\n])/)) {
    if (/[wWeE]/.test(cmd))
      return !0;
  }
  return !1;
}
function checkSedConstraints(input, toolPermissionContext) {
  let commands7 = splitCommand_DEPRECATED(input.command);
  for (let cmd of commands7) {
    let trimmed = cmd.trim();
    if (trimmed.split(/\s+/)[0] !== "sed")
      continue;
    let allowFileWrites = toolPermissionContext.mode === "acceptEdits";
    if (!sedCommandIsAllowedByAllowlist(trimmed, {
      allowFileWrites
    }))
      return {
        behavior: "ask",
        message: "sed command requires approval (contains potentially dangerous operations)",
        decisionReason: {
          type: "other",
          reason: "sed command contains operations that require explicit approval (e.g., write commands, execute commands)"
        }
      };
  }
  return {
    behavior: "passthrough",
    message: "No dangerous sed operations detected"
  };
}
var init_sedValidation = __esm(() => {
  init_commands4();
  init_shellQuote();
});
