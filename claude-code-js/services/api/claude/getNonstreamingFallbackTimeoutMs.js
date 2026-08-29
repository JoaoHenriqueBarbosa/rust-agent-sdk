// function: getNonstreamingFallbackTimeoutMs
function getNonstreamingFallbackTimeoutMs() {
  let override = parseInt(process.env.API_TIMEOUT_MS || "", 10);
  if (override)
    return override;
  return isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) ? 120000 : 300000;
}
