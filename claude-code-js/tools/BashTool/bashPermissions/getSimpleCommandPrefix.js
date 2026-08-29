// function: getSimpleCommandPrefix
function getSimpleCommandPrefix(command12) {
  let tokens = command12.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0)
    return null;
  let i5 = 0;
  while (i5 < tokens.length && ENV_VAR_ASSIGN_RE.test(tokens[i5])) {
    let varName = tokens[i5].split("=")[0], isAntOnlySafe = !1;
    if (!SAFE_ENV_VARS3.has(varName))
      return null;
    i5++;
  }
  let remaining = tokens.slice(i5);
  if (remaining.length < 2)
    return null;
  let subcmd = remaining[1];
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(subcmd))
    return null;
  return remaining.slice(0, 2).join(" ");
}
