// function: extractPrefixBeforeHeredoc
function extractPrefixBeforeHeredoc(command12) {
  if (!command12.includes("<<"))
    return null;
  let idx = command12.indexOf("<<");
  if (idx <= 0)
    return null;
  let before2 = command12.substring(0, idx).trim();
  if (!before2)
    return null;
  let prefix = getSimpleCommandPrefix(before2);
  if (prefix)
    return prefix;
  let tokens = before2.split(/\s+/).filter(Boolean), i5 = 0;
  while (i5 < tokens.length && ENV_VAR_ASSIGN_RE.test(tokens[i5])) {
    let varName = tokens[i5].split("=")[0], isAntOnlySafe = !1;
    if (!SAFE_ENV_VARS3.has(varName))
      return null;
    i5++;
  }
  if (i5 >= tokens.length)
    return null;
  return tokens.slice(i5, i5 + 2).join(" ") || null;
}
