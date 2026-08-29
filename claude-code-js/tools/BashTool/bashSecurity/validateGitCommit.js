// function: validateGitCommit
function validateGitCommit(context3) {
  let { originalCommand, baseCommand } = context3;
  if (baseCommand !== "git" || !/^git\s+commit\s+/.test(originalCommand))
    return { behavior: "passthrough", message: "Not a git commit" };
  if (originalCommand.includes("\\"))
    return {
      behavior: "passthrough",
      message: "Git commit contains backslash, needs full validation"
    };
  let messageMatch = originalCommand.match(/^git[ \t]+commit[ \t]+[^;&|`$<>()\n\r]*?-m[ \t]+(["'])([\s\S]*?)\1(.*)$/);
  if (messageMatch) {
    let [, quote2, messageContent, remainder] = messageMatch;
    if (quote2 === '"' && messageContent && /\$\(|`|\$\{/.test(messageContent))
      return logEvent("tengu_bash_security_check_triggered", {
        checkId: BASH_SECURITY_CHECK_IDS.GIT_COMMIT_SUBSTITUTION,
        subId: 1
      }), {
        behavior: "ask",
        message: "Git commit message contains command substitution patterns"
      };
    if (remainder && /[;|&()`]|\$\(|\$\{/.test(remainder))
      return {
        behavior: "passthrough",
        message: "Git commit remainder contains shell metacharacters"
      };
    if (remainder) {
      let unquoted = "", inSQ = !1, inDQ = !1;
      for (let i5 = 0;i5 < remainder.length; i5++) {
        let c3 = remainder[i5];
        if (c3 === "'" && !inDQ) {
          inSQ = !inSQ;
          continue;
        }
        if (c3 === '"' && !inSQ) {
          inDQ = !inDQ;
          continue;
        }
        if (!inSQ && !inDQ)
          unquoted += c3;
      }
      if (/[<>]/.test(unquoted))
        return {
          behavior: "passthrough",
          message: "Git commit remainder contains unquoted redirect operator"
        };
    }
    if (messageContent && messageContent.startsWith("-"))
      return logEvent("tengu_bash_security_check_triggered", {
        checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
        subId: 5
      }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
      };
    return {
      behavior: "allow",
      updatedInput: { command: originalCommand },
      decisionReason: {
        type: "other",
        reason: "Git commit with simple quoted message is allowed"
      }
    };
  }
  return { behavior: "passthrough", message: "Git commit needs validation" };
}
function validateJqCommand(context3) {
  let { originalCommand, baseCommand } = context3;
  if (baseCommand !== "jq")
    return { behavior: "passthrough", message: "Not jq" };
  if (/\bsystem\s*\(/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.JQ_SYSTEM_FUNCTION,
      subId: 1
    }), {
      behavior: "ask",
      message: "jq command contains system() function which executes arbitrary commands"
    };
  let afterJq = originalCommand.substring(3).trim();
  if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(afterJq))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.JQ_FILE_ARGUMENTS,
      subId: 1
    }), {
      behavior: "ask",
      message: "jq command contains dangerous flags that could execute code or read arbitrary files"
    };
  return { behavior: "passthrough", message: "jq command is safe" };
}
function validateShellMetacharacters(context3) {
  let { unquotedContent } = context3, message = "Command contains shell metacharacters (;, |, or &) in arguments";
  if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(unquotedContent))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.SHELL_METACHARACTERS,
      subId: 1
    }), { behavior: "ask", message: "Command contains shell metacharacters (;, |, or &) in arguments" };
  if ([
    /-name\s+["'][^"']*[;|&][^"']*["']/,
    /-path\s+["'][^"']*[;|&][^"']*["']/,
    /-iname\s+["'][^"']*[;|&][^"']*["']/
  ].some((p4) => p4.test(unquotedContent)))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.SHELL_METACHARACTERS,
      subId: 2
    }), { behavior: "ask", message: "Command contains shell metacharacters (;, |, or &) in arguments" };
  if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(unquotedContent))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.SHELL_METACHARACTERS,
      subId: 3
    }), { behavior: "ask", message: "Command contains shell metacharacters (;, |, or &) in arguments" };
  return { behavior: "passthrough", message: "No metacharacters" };
}
function validateDangerousVariables(context3) {
  let { fullyUnquotedContent } = context3;
  if (/[<>|]\s*\$[A-Za-z_]/.test(fullyUnquotedContent) || /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(fullyUnquotedContent))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.DANGEROUS_VARIABLES,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command contains variables in dangerous contexts (redirections or pipes)"
    };
  return { behavior: "passthrough", message: "No dangerous variables" };
}
function validateDangerousPatterns(context3) {
  let { unquotedContent } = context3;
  if (hasUnescapedChar(unquotedContent, "`"))
    return {
      behavior: "ask",
      message: "Command contains backticks (`) for command substitution"
    };
  for (let { pattern, message } of COMMAND_SUBSTITUTION_PATTERNS)
    if (pattern.test(unquotedContent))
      return logEvent("tengu_bash_security_check_triggered", {
        checkId: BASH_SECURITY_CHECK_IDS.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION,
        subId: 1
      }), { behavior: "ask", message: `Command contains ${message}` };
  return { behavior: "passthrough", message: "No dangerous patterns" };
}
function validateRedirections(context3) {
  let { fullyUnquotedContent } = context3;
  if (/</.test(fullyUnquotedContent))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.DANGEROUS_PATTERNS_INPUT_REDIRECTION,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command contains input redirection (<) which could read sensitive files"
    };
  if (/>/.test(fullyUnquotedContent))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command contains output redirection (>) which could write to arbitrary files"
    };
  return { behavior: "passthrough", message: "No redirections" };
}
function validateNewlines(context3) {
  let { fullyUnquotedPreStrip } = context3;
  if (!/[\n\r]/.test(fullyUnquotedPreStrip))
    return { behavior: "passthrough", message: "No newlines" };
  if (/(?<![\s]\\)[\n\r]\s*\S/.test(fullyUnquotedPreStrip))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.NEWLINES,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command contains newlines that could separate multiple commands"
    };
  return {
    behavior: "passthrough",
    message: "Newlines appear to be within data"
  };
}
function validateCarriageReturn(context3) {
  let { originalCommand } = context3;
  if (!originalCommand.includes("\r"))
    return { behavior: "passthrough", message: "No carriage return" };
  let inSingleQuote = !1, inDoubleQuote = !1, escaped = !1;
  for (let i5 = 0;i5 < originalCommand.length; i5++) {
    let c3 = originalCommand[i5];
    if (escaped) {
      escaped = !1;
      continue;
    }
    if (c3 === "\\" && !inSingleQuote) {
      escaped = !0;
      continue;
    }
    if (c3 === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (c3 === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (c3 === "\r" && !inDoubleQuote)
      return logEvent("tengu_bash_security_check_triggered", {
        checkId: BASH_SECURITY_CHECK_IDS.NEWLINES,
        subId: 2
      }), {
        behavior: "ask",
        message: "Command contains carriage return (\\r) which shell-quote and bash tokenize differently"
      };
  }
  return { behavior: "passthrough", message: "CR only inside double quotes" };
}
function validateIFSInjection(context3) {
  let { originalCommand } = context3;
  if (/\$IFS|\$\{[^}]*IFS/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.IFS_INJECTION,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command contains IFS variable usage which could bypass security validation"
    };
  return { behavior: "passthrough", message: "No IFS injection detected" };
}
function validateProcEnvironAccess(context3) {
  let { originalCommand } = context3;
  if (/\/proc\/.*\/environ/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.PROC_ENVIRON_ACCESS,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command accesses /proc/*/environ which could expose sensitive environment variables"
    };
  return {
    behavior: "passthrough",
    message: "No /proc/environ access detected"
  };
}
function validateMalformedTokenInjection(context3) {
  let { originalCommand } = context3, parseResult = tryParseShellCommand(originalCommand);
  if (!parseResult.success)
    return {
      behavior: "passthrough",
      message: "Parse failed, handled elsewhere"
    };
  let parsed = parseResult.tokens;
  if (!parsed.some((entry) => typeof entry === "object" && entry !== null && ("op" in entry) && (entry.op === ";" || entry.op === "&&" || entry.op === "||")))
    return { behavior: "passthrough", message: "No command separators" };
  if (hasMalformedTokens(originalCommand, parsed))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.MALFORMED_TOKEN_INJECTION,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command contains ambiguous syntax with command separators that could be misinterpreted"
    };
  return {
    behavior: "passthrough",
    message: "No malformed token injection detected"
  };
}
function validateObfuscatedFlags(context3) {
  let { originalCommand, baseCommand } = context3, hasShellOperators = /[|&;]/.test(originalCommand);
  if (baseCommand === "echo" && !hasShellOperators)
    return {
      behavior: "passthrough",
      message: "echo command is safe and has no dangerous flags"
    };
  if (/\$'[^']*'/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 5
    }), {
      behavior: "ask",
      message: "Command contains ANSI-C quoting which can hide characters"
    };
  if (/\$"[^"]*"/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 6
    }), {
      behavior: "ask",
      message: "Command contains locale quoting which can hide characters"
    };
  if (/\$['"]{2}\s*-/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 9
    }), {
      behavior: "ask",
      message: "Command contains empty special quotes before dash (potential bypass)"
    };
  if (/(?:^|\s)(?:''|"")+\s*-/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 7
    }), {
      behavior: "ask",
      message: "Command contains empty quotes before dash (potential bypass)"
    };
  if (/(?:""|'')+['"]-/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 10
    }), {
      behavior: "ask",
      message: "Command contains empty quote pair adjacent to quoted dash (potential flag obfuscation)"
    };
  if (/(?:^|\s)['"]{3,}/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 11
    }), {
      behavior: "ask",
      message: "Command contains consecutive quote characters at word start (potential obfuscation)"
    };
  let inSingleQuote = !1, inDoubleQuote = !1, escaped = !1;
  for (let i5 = 0;i5 < originalCommand.length - 1; i5++) {
    let currentChar = originalCommand[i5], nextChar = originalCommand[i5 + 1];
    if (escaped) {
      escaped = !1;
      continue;
    }
    if (currentChar === "\\" && !inSingleQuote) {
      escaped = !0;
      continue;
    }
    if (currentChar === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (currentChar === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (inSingleQuote || inDoubleQuote)
      continue;
    if (currentChar && nextChar && /\s/.test(currentChar) && /['"`]/.test(nextChar)) {
      let quoteChar = nextChar, j4 = i5 + 2, insideQuote = "";
      while (j4 < originalCommand.length && originalCommand[j4] !== quoteChar)
        insideQuote += originalCommand[j4], j4++;
      let charAfterQuote = originalCommand[j4 + 1], hasFlagCharsInside = /^-+[a-zA-Z0-9$`]/.test(insideQuote), FLAG_CONTINUATION_CHARS = /[a-zA-Z0-9\\${`-]/, hasFlagCharsContinuing = /^-+$/.test(insideQuote) && charAfterQuote !== void 0 && FLAG_CONTINUATION_CHARS.test(charAfterQuote), hasFlagCharsInNextQuote = (insideQuote === "" || /^-+$/.test(insideQuote)) && charAfterQuote !== void 0 && /['"`]/.test(charAfterQuote) && (() => {
        let pos = j4 + 1, combinedContent = insideQuote;
        while (pos < originalCommand.length && /['"`]/.test(originalCommand[pos])) {
          let segQuote = originalCommand[pos], end = pos + 1;
          while (end < originalCommand.length && originalCommand[end] !== segQuote)
            end++;
          let segment = originalCommand.slice(pos + 1, end);
          if (combinedContent += segment, /^-+[a-zA-Z0-9$`]/.test(combinedContent))
            return !0;
          let priorContent = segment.length > 0 ? combinedContent.slice(0, -segment.length) : combinedContent;
          if (/^-+$/.test(priorContent)) {
            if (/[a-zA-Z0-9$`]/.test(segment))
              return !0;
          }
          if (end >= originalCommand.length)
            break;
          pos = end + 1;
        }
        if (pos < originalCommand.length && FLAG_CONTINUATION_CHARS.test(originalCommand[pos])) {
          if (/^-+$/.test(combinedContent) || combinedContent === "") {
            let nextChar2 = originalCommand[pos];
            if (nextChar2 === "-")
              return !0;
            if (/[a-zA-Z0-9\\${`]/.test(nextChar2) && combinedContent !== "")
              return !0;
          }
          if (/^-/.test(combinedContent))
            return !0;
        }
        return !1;
      })();
      if (j4 < originalCommand.length && originalCommand[j4] === quoteChar && (hasFlagCharsInside || hasFlagCharsContinuing || hasFlagCharsInNextQuote))
        return logEvent("tengu_bash_security_check_triggered", {
          checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
          subId: 4
        }), {
          behavior: "ask",
          message: "Command contains quoted characters in flag names"
        };
    }
    if (currentChar && nextChar && /\s/.test(currentChar) && nextChar === "-") {
      let j4 = i5 + 1, flagContent = "";
      while (j4 < originalCommand.length) {
        let flagChar = originalCommand[j4];
        if (!flagChar)
          break;
        if (/[\s=]/.test(flagChar))
          break;
        if (/['"`]/.test(flagChar)) {
          if (baseCommand === "cut" && flagContent === "-d" && /['"`]/.test(flagChar))
            break;
          if (j4 + 1 < originalCommand.length) {
            let nextFlagChar = originalCommand[j4 + 1];
            if (nextFlagChar && !/[a-zA-Z0-9_'"-]/.test(nextFlagChar))
              break;
          }
        }
        flagContent += flagChar, j4++;
      }
      if (flagContent.includes('"') || flagContent.includes("'"))
        return logEvent("tengu_bash_security_check_triggered", {
          checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
          subId: 1
        }), {
          behavior: "ask",
          message: "Command contains quoted characters in flag names"
        };
    }
  }
  if (/\s['"`]-/.test(context3.fullyUnquotedContent))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 2
    }), {
      behavior: "ask",
      message: "Command contains quoted characters in flag names"
    };
  if (/['"`]{2}-/.test(context3.fullyUnquotedContent))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.OBFUSCATED_FLAGS,
      subId: 3
    }), {
      behavior: "ask",
      message: "Command contains quoted characters in flag names"
    };
  return { behavior: "passthrough", message: "No obfuscated flags detected" };
}
function hasBackslashEscapedWhitespace(command12) {
  let inSingleQuote = !1, inDoubleQuote = !1;
  for (let i5 = 0;i5 < command12.length; i5++) {
    let char = command12[i5];
    if (char === "\\" && !inSingleQuote) {
      if (!inDoubleQuote) {
        let nextChar = command12[i5 + 1];
        if (nextChar === " " || nextChar === "\t")
          return !0;
      }
      i5++;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
  }
  return !1;
}
function validateBackslashEscapedWhitespace(context3) {
  if (hasBackslashEscapedWhitespace(context3.originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.BACKSLASH_ESCAPED_WHITESPACE
    }), {
      behavior: "ask",
      message: "Command contains backslash-escaped whitespace that could alter command parsing"
    };
  return {
    behavior: "passthrough",
    message: "No backslash-escaped whitespace"
  };
}
function hasBackslashEscapedOperator(command12) {
  let inSingleQuote = !1, inDoubleQuote = !1;
  for (let i5 = 0;i5 < command12.length; i5++) {
    let char = command12[i5];
    if (char === "\\" && !inSingleQuote) {
      if (!inDoubleQuote) {
        let nextChar = command12[i5 + 1];
        if (nextChar && SHELL_OPERATORS.has(nextChar))
          return !0;
      }
      i5++;
      continue;
    }
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
  }
  return !1;
}
function validateBackslashEscapedOperators(context3) {
  if (context3.treeSitter && !context3.treeSitter.hasActualOperatorNodes)
    return { behavior: "passthrough", message: "No operator nodes in AST" };
  if (hasBackslashEscapedOperator(context3.originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.BACKSLASH_ESCAPED_OPERATORS
    }), {
      behavior: "ask",
      message: "Command contains a backslash before a shell operator (;, |, &, <, >) which can hide command structure"
    };
  return {
    behavior: "passthrough",
    message: "No backslash-escaped operators"
  };
}
function isEscapedAtPosition(content, pos) {
  let backslashCount = 0, i5 = pos - 1;
  while (i5 >= 0 && content[i5] === "\\")
    backslashCount++, i5--;
  return backslashCount % 2 === 1;
}
function validateBraceExpansion(context3) {
  let content = context3.fullyUnquotedPreStrip, unescapedOpenBraces = 0, unescapedCloseBraces = 0;
  for (let i5 = 0;i5 < content.length; i5++)
    if (content[i5] === "{" && !isEscapedAtPosition(content, i5))
      unescapedOpenBraces++;
    else if (content[i5] === "}" && !isEscapedAtPosition(content, i5))
      unescapedCloseBraces++;
  if (unescapedOpenBraces > 0 && unescapedCloseBraces > unescapedOpenBraces)
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.BRACE_EXPANSION,
      subId: 2
    }), {
      behavior: "ask",
      message: "Command has excess closing braces after quote stripping, indicating possible brace expansion obfuscation"
    };
  if (unescapedOpenBraces > 0) {
    let orig = context3.originalCommand;
    if (/['"][{}]['"]/.test(orig))
      return logEvent("tengu_bash_security_check_triggered", {
        checkId: BASH_SECURITY_CHECK_IDS.BRACE_EXPANSION,
        subId: 3
      }), {
        behavior: "ask",
        message: "Command contains quoted brace character inside brace context (potential brace expansion obfuscation)"
      };
  }
  for (let i5 = 0;i5 < content.length; i5++) {
    if (content[i5] !== "{")
      continue;
    if (isEscapedAtPosition(content, i5))
      continue;
    let depth = 1, matchingClose = -1;
    for (let j4 = i5 + 1;j4 < content.length; j4++) {
      let ch2 = content[j4];
      if (ch2 === "{" && !isEscapedAtPosition(content, j4))
        depth++;
      else if (ch2 === "}" && !isEscapedAtPosition(content, j4)) {
        if (depth--, depth === 0) {
          matchingClose = j4;
          break;
        }
      }
    }
    if (matchingClose === -1)
      continue;
    let innerDepth = 0;
    for (let k3 = i5 + 1;k3 < matchingClose; k3++) {
      let ch2 = content[k3];
      if (ch2 === "{" && !isEscapedAtPosition(content, k3))
        innerDepth++;
      else if (ch2 === "}" && !isEscapedAtPosition(content, k3))
        innerDepth--;
      else if (innerDepth === 0) {
        if (ch2 === "," || ch2 === "." && k3 + 1 < matchingClose && content[k3 + 1] === ".")
          return logEvent("tengu_bash_security_check_triggered", {
            checkId: BASH_SECURITY_CHECK_IDS.BRACE_EXPANSION,
            subId: 1
          }), {
            behavior: "ask",
            message: "Command contains brace expansion that could alter command parsing"
          };
      }
    }
  }
  return {
    behavior: "passthrough",
    message: "No brace expansion detected"
  };
}
function validateUnicodeWhitespace(context3) {
  let { originalCommand } = context3;
  if (UNICODE_WS_RE.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.UNICODE_WHITESPACE
    }), {
      behavior: "ask",
      message: "Command contains Unicode whitespace characters that could cause parsing inconsistencies"
    };
  return { behavior: "passthrough", message: "No Unicode whitespace" };
}
function validateMidWordHash(context3) {
  let { unquotedKeepQuoteChars } = context3, joined = unquotedKeepQuoteChars.replace(/\\+\n/g, (match) => {
    let backslashCount = match.length - 1;
    return backslashCount % 2 === 1 ? "\\".repeat(backslashCount - 1) : match;
  });
  if (/\S(?<!\$\{)#/.test(unquotedKeepQuoteChars) || /\S(?<!\$\{)#/.test(joined))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.MID_WORD_HASH
    }), {
      behavior: "ask",
      message: "Command contains mid-word # which is parsed differently by shell-quote vs bash"
    };
  return { behavior: "passthrough", message: "No mid-word hash" };
}
function validateCommentQuoteDesync(context3) {
  if (context3.treeSitter)
    return {
      behavior: "passthrough",
      message: "Tree-sitter quote context is authoritative"
    };
  let { originalCommand } = context3, inSingleQuote = !1, inDoubleQuote = !1, escaped = !1;
  for (let i5 = 0;i5 < originalCommand.length; i5++) {
    let char = originalCommand[i5];
    if (escaped) {
      escaped = !1;
      continue;
    }
    if (inSingleQuote) {
      if (char === "'")
        inSingleQuote = !1;
      continue;
    }
    if (char === "\\") {
      escaped = !0;
      continue;
    }
    if (inDoubleQuote) {
      if (char === '"')
        inDoubleQuote = !1;
      continue;
    }
    if (char === "'") {
      inSingleQuote = !0;
      continue;
    }
    if (char === '"') {
      inDoubleQuote = !0;
      continue;
    }
    if (char === "#") {
      let lineEnd = originalCommand.indexOf(`
`, i5), commentText = originalCommand.slice(i5 + 1, lineEnd === -1 ? originalCommand.length : lineEnd);
      if (/['"]/.test(commentText))
        return logEvent("tengu_bash_security_check_triggered", {
          checkId: BASH_SECURITY_CHECK_IDS.COMMENT_QUOTE_DESYNC
        }), {
          behavior: "ask",
          message: "Command contains quote characters inside a # comment which can desync quote tracking"
        };
      if (lineEnd === -1)
        break;
      i5 = lineEnd;
    }
  }
  return { behavior: "passthrough", message: "No comment quote desync" };
}
function validateQuotedNewline(context3) {
  let { originalCommand } = context3;
  if (!originalCommand.includes(`
`) || !originalCommand.includes("#"))
    return { behavior: "passthrough", message: "No newline or no hash" };
  let inSingleQuote = !1, inDoubleQuote = !1, escaped = !1;
  for (let i5 = 0;i5 < originalCommand.length; i5++) {
    let char = originalCommand[i5];
    if (escaped) {
      escaped = !1;
      continue;
    }
    if (char === "\\" && !inSingleQuote) {
      escaped = !0;
      continue;
    }
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (char === `
` && (inSingleQuote || inDoubleQuote)) {
      let lineStart = i5 + 1, nextNewline = originalCommand.indexOf(`
`, lineStart), lineEnd = nextNewline === -1 ? originalCommand.length : nextNewline;
      if (originalCommand.slice(lineStart, lineEnd).trim().startsWith("#"))
        return logEvent("tengu_bash_security_check_triggered", {
          checkId: BASH_SECURITY_CHECK_IDS.QUOTED_NEWLINE
        }), {
          behavior: "ask",
          message: "Command contains a quoted newline followed by a #-prefixed line, which can hide arguments from line-based permission checks"
        };
    }
  }
  return { behavior: "passthrough", message: "No quoted newline-hash pattern" };
}
function validateZshDangerousCommands(context3) {
  let { originalCommand } = context3, ZSH_PRECOMMAND_MODIFIERS = /* @__PURE__ */ new Set([
    "command",
    "builtin",
    "noglob",
    "nocorrect"
  ]), trimmed = originalCommand.trim(), tokens = trimmed.split(/\s+/), baseCmd = "";
  for (let token of tokens) {
    if (/^[A-Za-z_]\w*=/.test(token))
      continue;
    if (ZSH_PRECOMMAND_MODIFIERS.has(token))
      continue;
    baseCmd = token;
    break;
  }
  if (ZSH_DANGEROUS_COMMANDS.has(baseCmd))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.ZSH_DANGEROUS_COMMANDS,
      subId: 1
    }), {
      behavior: "ask",
      message: `Command uses Zsh-specific '${baseCmd}' which can bypass security checks`
    };
  if (baseCmd === "fc" && /\s-\S*e/.test(trimmed))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.ZSH_DANGEROUS_COMMANDS,
      subId: 2
    }), {
      behavior: "ask",
      message: "Command uses 'fc -e' which can execute arbitrary commands via editor"
    };
  return {
    behavior: "passthrough",
    message: "No Zsh dangerous commands"
  };
}
function bashCommandIsSafe_DEPRECATED(command12) {
  if (CONTROL_CHAR_RE2.test(command12))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.CONTROL_CHARACTERS
    }), {
      behavior: "ask",
      message: "Command contains non-printable control characters that could be used to bypass security checks",
      isBashSecurityCheckForMisparsing: !0
    };
  if (hasShellQuoteSingleQuoteBug(command12))
    return {
      behavior: "ask",
      message: "Command contains single-quoted backslash pattern that could bypass security checks",
      isBashSecurityCheckForMisparsing: !0
    };
  let { processedCommand } = extractHeredocs(command12, { quotedOnly: !0 }), baseCommand = command12.split(" ")[0] || "", { withDoubleQuotes, fullyUnquoted, unquotedKeepQuoteChars } = extractQuotedContent(processedCommand, baseCommand === "jq"), context3 = {
    originalCommand: command12,
    baseCommand,
    unquotedContent: withDoubleQuotes,
    fullyUnquotedContent: stripSafeRedirections(fullyUnquoted),
    fullyUnquotedPreStrip: fullyUnquoted,
    unquotedKeepQuoteChars
  }, earlyValidators = [
    validateEmpty,
    validateIncompleteCommands,
    validateSafeCommandSubstitution,
    validateGitCommit
  ];
  for (let validator of earlyValidators) {
    let result = validator(context3);
    if (result.behavior === "allow")
      return {
        behavior: "passthrough",
        message: result.decisionReason?.type === "other" || result.decisionReason?.type === "safetyCheck" ? result.decisionReason.reason : "Command allowed"
      };
    if (result.behavior !== "passthrough")
      return result.behavior === "ask" ? { ...result, isBashSecurityCheckForMisparsing: !0 } : result;
  }
  let nonMisparsingValidators = /* @__PURE__ */ new Set([
    validateNewlines,
    validateRedirections
  ]), validators3 = [
    validateJqCommand,
    validateObfuscatedFlags,
    validateShellMetacharacters,
    validateDangerousVariables,
    validateCommentQuoteDesync,
    validateQuotedNewline,
    validateCarriageReturn,
    validateNewlines,
    validateIFSInjection,
    validateProcEnvironAccess,
    validateDangerousPatterns,
    validateRedirections,
    validateBackslashEscapedWhitespace,
    validateBackslashEscapedOperators,
    validateUnicodeWhitespace,
    validateMidWordHash,
    validateBraceExpansion,
    validateZshDangerousCommands,
    validateMalformedTokenInjection
  ], deferredNonMisparsingResult = null;
  for (let validator of validators3) {
    let result = validator(context3);
    if (result.behavior === "ask") {
      if (nonMisparsingValidators.has(validator)) {
        if (deferredNonMisparsingResult === null)
          deferredNonMisparsingResult = result;
        continue;
      }
      return { ...result, isBashSecurityCheckForMisparsing: !0 };
    }
  }
  if (deferredNonMisparsingResult !== null)
    return deferredNonMisparsingResult;
  return {
    behavior: "passthrough",
    message: "Command passed all security checks"
  };
}
async function bashCommandIsSafeAsync_DEPRECATED(command12, onDivergence) {
  let tsAnalysis = (await ParsedCommand.parse(command12))?.getTreeSitterAnalysis() ?? null;
  if (!tsAnalysis)
    return bashCommandIsSafe_DEPRECATED(command12);
  if (CONTROL_CHAR_RE2.test(command12))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.CONTROL_CHARACTERS
    }), {
      behavior: "ask",
      message: "Command contains non-printable control characters that could be used to bypass security checks",
      isBashSecurityCheckForMisparsing: !0
    };
  if (hasShellQuoteSingleQuoteBug(command12))
    return {
      behavior: "ask",
      message: "Command contains single-quoted backslash pattern that could bypass security checks",
      isBashSecurityCheckForMisparsing: !0
    };
  let { processedCommand } = extractHeredocs(command12, { quotedOnly: !0 }), baseCommand = command12.split(" ")[0] || "", tsQuote = tsAnalysis.quoteContext, regexQuote = extractQuotedContent(processedCommand, baseCommand === "jq"), withDoubleQuotes = tsQuote.withDoubleQuotes, fullyUnquoted = tsQuote.fullyUnquoted, unquotedKeepQuoteChars = tsQuote.unquotedKeepQuoteChars, context3 = {
    originalCommand: command12,
    baseCommand,
    unquotedContent: withDoubleQuotes,
    fullyUnquotedContent: stripSafeRedirections(fullyUnquoted),
    fullyUnquotedPreStrip: fullyUnquoted,
    unquotedKeepQuoteChars,
    treeSitter: tsAnalysis
  };
  if (!tsAnalysis.dangerousPatterns.hasHeredoc) {
    if (tsQuote.fullyUnquoted !== regexQuote.fullyUnquoted || tsQuote.withDoubleQuotes !== regexQuote.withDoubleQuotes)
      if (onDivergence)
        onDivergence();
      else
        logEvent("tengu_tree_sitter_security_divergence", {
          quoteContextDivergence: !0
        });
  }
  let earlyValidators = [
    validateEmpty,
    validateIncompleteCommands,
    validateSafeCommandSubstitution,
    validateGitCommit
  ];
  for (let validator of earlyValidators) {
    let result = validator(context3);
    if (result.behavior === "allow")
      return {
        behavior: "passthrough",
        message: result.decisionReason?.type === "other" || result.decisionReason?.type === "safetyCheck" ? result.decisionReason.reason : "Command allowed"
      };
    if (result.behavior !== "passthrough")
      return result.behavior === "ask" ? { ...result, isBashSecurityCheckForMisparsing: !0 } : result;
  }
  let nonMisparsingValidators = /* @__PURE__ */ new Set([
    validateNewlines,
    validateRedirections
  ]), validators3 = [
    validateJqCommand,
    validateObfuscatedFlags,
    validateShellMetacharacters,
    validateDangerousVariables,
    validateCommentQuoteDesync,
    validateQuotedNewline,
    validateCarriageReturn,
    validateNewlines,
    validateIFSInjection,
    validateProcEnvironAccess,
    validateDangerousPatterns,
    validateRedirections,
    validateBackslashEscapedWhitespace,
    validateBackslashEscapedOperators,
    validateUnicodeWhitespace,
    validateMidWordHash,
    validateBraceExpansion,
    validateZshDangerousCommands,
    validateMalformedTokenInjection
  ], deferredNonMisparsingResult = null;
  for (let validator of validators3) {
    let result = validator(context3);
    if (result.behavior === "ask") {
      if (nonMisparsingValidators.has(validator)) {
        if (deferredNonMisparsingResult === null)
          deferredNonMisparsingResult = result;
        continue;
      }
      return { ...result, isBashSecurityCheckForMisparsing: !0 };
    }
  }
  if (deferredNonMisparsingResult !== null)
    return deferredNonMisparsingResult;
  return {
    behavior: "passthrough",
    message: "Command passed all security checks"
  };
}
var HEREDOC_IN_SUBSTITUTION, COMMAND_SUBSTITUTION_PATTERNS, ZSH_DANGEROUS_COMMANDS, BASH_SECURITY_CHECK_IDS, SHELL_OPERATORS, UNICODE_WS_RE, CONTROL_CHAR_RE2;
var init_bashSecurity = __esm(() => {
  init_heredoc();
  init_ParsedCommand();
  init_shellQuote();
  HEREDOC_IN_SUBSTITUTION = /\$\(.*<</, COMMAND_SUBSTITUTION_PATTERNS = [
    { pattern: /<\(/, message: "process substitution <()" },
    { pattern: />\(/, message: "process substitution >()" },
    { pattern: /=\(/, message: "Zsh process substitution =()" },
    {
      pattern: /(?:^|[\s;&|])=[a-zA-Z_]/,
      message: "Zsh equals expansion (=cmd)"
    },
    { pattern: /\$\(/, message: "$() command substitution" },
    { pattern: /\$\{/, message: "${} parameter substitution" },
    { pattern: /\$\[/, message: "$[] legacy arithmetic expansion" },
    { pattern: /~\[/, message: "Zsh-style parameter expansion" },
    { pattern: /\(e:/, message: "Zsh-style glob qualifiers" },
    { pattern: /\(\+/, message: "Zsh glob qualifier with command execution" },
    {
      pattern: /\}\s*always\s*\{/,
      message: "Zsh always block (try/always construct)"
    },
    { pattern: /<#/, message: "PowerShell comment syntax" }
  ], ZSH_DANGEROUS_COMMANDS = /* @__PURE__ */ new Set([
    "zmodload",
    "emulate",
    "sysopen",
    "sysread",
    "syswrite",
    "sysseek",
    "zpty",
    "ztcp",
    "zsocket",
    "mapfile",
    "zf_rm",
    "zf_mv",
    "zf_ln",
    "zf_chmod",
    "zf_chown",
    "zf_mkdir",
    "zf_rmdir",
    "zf_chgrp"
  ]), BASH_SECURITY_CHECK_IDS = {
    INCOMPLETE_COMMANDS: 1,
    JQ_SYSTEM_FUNCTION: 2,
    JQ_FILE_ARGUMENTS: 3,
    OBFUSCATED_FLAGS: 4,
    SHELL_METACHARACTERS: 5,
    DANGEROUS_VARIABLES: 6,
    NEWLINES: 7,
    DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,
    DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,
    DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,
    IFS_INJECTION: 11,
    GIT_COMMIT_SUBSTITUTION: 12,
    PROC_ENVIRON_ACCESS: 13,
    MALFORMED_TOKEN_INJECTION: 14,
    BACKSLASH_ESCAPED_WHITESPACE: 15,
    BRACE_EXPANSION: 16,
    CONTROL_CHARACTERS: 17,
    UNICODE_WHITESPACE: 18,
    MID_WORD_HASH: 19,
    ZSH_DANGEROUS_COMMANDS: 20,
    BACKSLASH_ESCAPED_OPERATORS: 21,
    COMMENT_QUOTE_DESYNC: 22,
    QUOTED_NEWLINE: 23
  };
  SHELL_OPERATORS = /* @__PURE__ */ new Set([";", "|", "&", "<", ">"]);
  UNICODE_WS_RE = /[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/;
  CONTROL_CHAR_RE2 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
});

