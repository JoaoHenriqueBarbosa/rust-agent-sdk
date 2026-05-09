// function: runGcpAuthRefresh
async function runGcpAuthRefresh() {
  let gcpAuthRefresh = getConfiguredGcpAuthRefresh();
  if (!gcpAuthRefresh)
    return !1;
  if (isGcpAuthRefreshFromProjectSettings()) {
    if (!checkHasTrustDialogAccepted() && !getIsNonInteractiveSession()) {
      let error44 = Error("Security: gcpAuthRefresh executed before workspace trust is confirmed. If you see this message, post in https://github.com/anthropics/claude-code/issues.");
      return logAntError("gcpAuthRefresh invoked before trust check", error44), logEvent("tengu_gcpAuthRefresh_missing_trust", {}), !1;
    }
  }
  try {
    if (logForDebugging("Checking GCP credentials validity for auth refresh"), await checkGcpCredentialsValid())
      return logForDebugging("GCP credentials are valid, skipping auth refresh command"), !1;
  } catch {}
  return refreshGcpAuth(gcpAuthRefresh);
}
