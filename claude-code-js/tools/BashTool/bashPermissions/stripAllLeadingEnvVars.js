// function: stripAllLeadingEnvVars
function stripAllLeadingEnvVars(command12, blocklist) {
  let ENV_VAR_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*(?:\[[^\]]*\])?)\+?=(?:'[^'\n\r]*'|"(?:\\.|[^"$`\\\n\r])*"|\\.|[^ \t\n\r$`;|&()<>\\\\'"])*[ \t]+/, stripped = command12, previousStripped = "";
  while (stripped !== previousStripped) {
    previousStripped = stripped, stripped = stripCommentLines(stripped);
    let m4 = stripped.match(ENV_VAR_PATTERN);
    if (!m4)
      continue;
    if (blocklist?.test(m4[1]))
      break;
    stripped = stripped.slice(m4[0].length);
  }
  return stripped.trim();
}
