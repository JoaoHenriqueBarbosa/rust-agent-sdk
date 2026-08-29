// function: stripSafeWrappers
function stripSafeWrappers(command12) {
  let SAFE_WRAPPER_PATTERNS = [
    /^timeout[ \t]+(?:(?:--(?:foreground|preserve-status|verbose)|--(?:kill-after|signal)=[A-Za-z0-9_.+-]+|--(?:kill-after|signal)[ \t]+[A-Za-z0-9_.+-]+|-v|-[ks][ \t]+[A-Za-z0-9_.+-]+|-[ks][A-Za-z0-9_.+-]+)[ \t]+)*(?:--[ \t]+)?\d+(?:\.\d+)?[smhd]?[ \t]+/,
    /^time[ \t]+(?:--[ \t]+)?/,
    /^nice(?:[ \t]+-n[ \t]+-?\d+|[ \t]+-\d+)?[ \t]+(?:--[ \t]+)?/,
    /^stdbuf(?:[ \t]+-[ioe][LN0-9]+)+[ \t]+(?:--[ \t]+)?/,
    /^nohup[ \t]+(?:--[ \t]+)?/
  ], ENV_VAR_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*)=([A-Za-z0-9_./:-]+)[ \t]+/, stripped = command12, previousStripped = "";
  while (stripped !== previousStripped) {
    previousStripped = stripped, stripped = stripCommentLines(stripped);
    let envVarMatch = stripped.match(ENV_VAR_PATTERN);
    if (envVarMatch) {
      let varName = envVarMatch[1], isAntOnlySafe = !1;
      if (SAFE_ENV_VARS3.has(varName))
        stripped = stripped.replace(ENV_VAR_PATTERN, "");
    }
  }
  previousStripped = "";
  while (stripped !== previousStripped) {
    previousStripped = stripped, stripped = stripCommentLines(stripped);
    for (let pattern of SAFE_WRAPPER_PATTERNS)
      stripped = stripped.replace(pattern, "");
  }
  return stripped.trim();
}
