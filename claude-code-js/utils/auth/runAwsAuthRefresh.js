// function: runAwsAuthRefresh
async function runAwsAuthRefresh() {
  let awsAuthRefresh = getConfiguredAwsAuthRefresh();
  if (!awsAuthRefresh)
    return !1;
  if (isAwsAuthRefreshFromProjectSettings()) {
    if (!checkHasTrustDialogAccepted() && !getIsNonInteractiveSession()) {
      let error44 = Error("Security: awsAuthRefresh executed before workspace trust is confirmed. If you see this message, post in https://github.com/anthropics/claude-code/issues.");
      return logAntError("awsAuthRefresh invoked before trust check", error44), logEvent("tengu_awsAuthRefresh_missing_trust", {}), !1;
    }
  }
  try {
    return logForDebugging("Fetching AWS caller identity for AWS auth refresh command"), await checkStsCallerIdentity(), logForDebugging("Fetched AWS caller identity, skipping AWS auth refresh command"), !1;
  } catch {
    return refreshAwsAuth(awsAuthRefresh);
  }
}
