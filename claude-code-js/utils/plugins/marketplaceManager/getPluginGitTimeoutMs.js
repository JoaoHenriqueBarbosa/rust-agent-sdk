// function: getPluginGitTimeoutMs
function getPluginGitTimeoutMs() {
  let envValue = process.env.CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS;
  if (envValue) {
    let parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0)
      return parsed;
  }
  return DEFAULT_PLUGIN_GIT_TIMEOUT_MS;
}
