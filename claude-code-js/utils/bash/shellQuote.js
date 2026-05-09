// Original: src/utils/bash/shellQuote.ts
function tryParseShellCommand(cmd, env5) {
  try {
    return { success: !0, tokens: typeof env5 === "function" ? import_shell_quote3.parse(cmd, env5) : import_shell_quote3.parse(cmd, env5) };
  } catch (error44) {
    if (error44 instanceof Error)
      logError2(error44);
    return {
      success: !1,
      error: error44 instanceof Error ? error44.message : "Unknown parse error"
    };
  }
}
function tryQuoteShellArgs(args) {
  try {
    let validated = args.map((arg, index) => {
      if (arg === null || arg === void 0)
        return String(arg);
      let type = typeof arg;
      if (type === "string")
        return arg;
      if (type === "number" || type === "boolean")
        return String(arg);
      if (type === "object")
        throw Error(`Cannot quote argument at index ${index}: object values are not supported`);
      if (type === "symbol")
        throw Error(`Cannot quote argument at index ${index}: symbol values are not supported`);
      if (type === "function")
        throw Error(`Cannot quote argument at index ${index}: function values are not supported`);
      throw Error(`Cannot quote argument at index ${index}: unsupported type ${type}`);
    });
    return { success: !0, quoted: import_shell_quote3.quote(validated) };
  } catch (error44) {
    if (error44 instanceof Error)
      logError2(error44);
    return {
      success: !1,
      error: error44 instanceof Error ? error44.message : "Unknown quote error"
    };
  }
}
function hasMalformedTokens(command12, parsed) {
  let inSingle = !1, inDouble = !1, doubleCount = 0, singleCount = 0;
  for (let i5 = 0;i5 < command12.length; i5++) {
    let c3 = command12[i5];
    if (c3 === "\\" && !inSingle) {
      i5++;
      continue;
    }
    if (c3 === '"' && !inSingle)
      doubleCount++, inDouble = !inDouble;
    else if (c3 === "'" && !inDouble)
      singleCount++, inSingle = !inSingle;
  }
  if (doubleCount % 2 !== 0 || singleCount % 2 !== 0)
    return !0;
  for (let entry of parsed) {
    if (typeof entry !== "string")
      continue;
    let openBraces = (entry.match(/{/g) || []).length, closeBraces = (entry.match(/}/g) || []).length;
    if (openBraces !== closeBraces)
      return !0;
    let openParens = (entry.match(/\(/g) || []).length, closeParens = (entry.match(/\)/g) || []).length;
    if (openParens !== closeParens)
      return !0;
    let openBrackets = (entry.match(/\[/g) || []).length, closeBrackets = (entry.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets)
      return !0;
    if ((entry.match(/(?<!\\)"/g) || []).length % 2 !== 0)
      return !0;
    if ((entry.match(/(?<!\\)'/g) || []).length % 2 !== 0)
      return !0;
  }
  return !1;
}
function hasShellQuoteSingleQuoteBug(command12) {
  let inSingleQuote = !1, inDoubleQuote = !1;
  for (let i5 = 0;i5 < command12.length; i5++) {
    let char = command12[i5];
    if (char === "\\" && !inSingleQuote) {
      i5++;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (char === "'" && !inDoubleQuote) {
      if (inSingleQuote = !inSingleQuote, !inSingleQuote) {
        let backslashCount = 0, j4 = i5 - 1;
        while (j4 >= 0 && command12[j4] === "\\")
          backslashCount++, j4--;
        if (backslashCount > 0 && backslashCount % 2 === 1)
          return !0;
        if (backslashCount > 0 && backslashCount % 2 === 0 && command12.indexOf("'", i5 + 1) !== -1)
          return !0;
      }
      continue;
    }
  }
  return !1;
}
function quote(args) {
  let result = tryQuoteShellArgs([...args]);
  if (result.success)
    return result.quoted;
  try {
    let stringArgs = args.map((arg) => {
      if (arg === null || arg === void 0)
        return String(arg);
      let type = typeof arg;
      if (type === "string" || type === "number" || type === "boolean")
        return String(arg);
      return jsonStringify(arg);
    });
    return import_shell_quote3.quote(stringArgs);
  } catch (error44) {
    if (error44 instanceof Error)
      logError2(error44);
    throw Error("Failed to quote shell arguments safely");
  }
}
var import_shell_quote3;
var init_shellQuote = __esm(() => {
  init_log3();
  init_slowOperations();
  import_shell_quote3 = __toESM(require_shell_quote(), 1);
});
