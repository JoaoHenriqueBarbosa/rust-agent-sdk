// function: getFirstWordPrefix
function getFirstWordPrefix(command12) {
  let tokens = command12.trim().split(/\s+/).filter(Boolean), i5 = 0;
  while (i5 < tokens.length && ENV_VAR_ASSIGN_RE.test(tokens[i5])) {
    let varName = tokens[i5].split("=")[0], isAntOnlySafe = !1;
    if (!SAFE_ENV_VARS3.has(varName))
      return null;
    i5++;
  }
  let cmd = tokens[i5];
  if (!cmd)
    return null;
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(cmd))
    return null;
  if (BARE_SHELL_PREFIXES.has(cmd))
    return null;
  return cmd;
}
