// function: calculateApiKeyHelperTTL
function calculateApiKeyHelperTTL() {
  let envTtl = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
  if (envTtl) {
    let parsed = parseInt(envTtl, 10);
    if (!Number.isNaN(parsed) && parsed >= 0)
      return parsed;
    logForDebugging(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${envTtl}`, { level: "error" });
  }
  return DEFAULT_API_KEY_HELPER_TTL;
}
