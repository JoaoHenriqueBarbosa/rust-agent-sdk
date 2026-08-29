// function: _executeApiKeyHelper
async function _executeApiKeyHelper(isNonInteractiveSession) {
  let apiKeyHelper = getConfiguredApiKeyHelper();
  if (!apiKeyHelper)
    return null;
  if (isApiKeyHelperFromProjectOrLocalSettings()) {
    if (!checkHasTrustDialogAccepted() && !isNonInteractiveSession) {
      let error44 = Error("Security: apiKeyHelper executed before workspace trust is confirmed. If you see this message, post in https://github.com/anthropics/claude-code/issues.");
      return logAntError("apiKeyHelper invoked before trust check", error44), logEvent("tengu_apiKeyHelper_missing_trust11", {}), null;
    }
  }
  let result = await execa(apiKeyHelper, {
    shell: !0,
    timeout: 600000,
    reject: !1
  });
  if (result.failed) {
    let why = result.timedOut ? "timed out" : `exited ${result.exitCode}`, stderr = result.stderr?.trim();
    throw Error(stderr ? `${why}: ${stderr}` : why);
  }
  let stdout = result.stdout?.trim();
  if (!stdout)
    throw Error("did not return a value");
  return stdout;
}
