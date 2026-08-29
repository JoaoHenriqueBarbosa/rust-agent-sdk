// function: getParseTimeoutMs
function getParseTimeoutMs() {
  let env5 = process.env.CLAUDE_CODE_PWSH_PARSE_TIMEOUT_MS;
  if (env5) {
    let parsed = parseInt(env5, 10);
    if (!isNaN(parsed) && parsed > 0)
      return parsed;
  }
  return DEFAULT_PARSE_TIMEOUT_MS;
}
