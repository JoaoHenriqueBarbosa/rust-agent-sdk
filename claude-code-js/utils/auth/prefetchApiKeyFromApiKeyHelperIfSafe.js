// function: prefetchApiKeyFromApiKeyHelperIfSafe
function prefetchApiKeyFromApiKeyHelperIfSafe(isNonInteractiveSession) {
  if (isApiKeyHelperFromProjectOrLocalSettings() && !checkHasTrustDialogAccepted())
    return;
  getApiKeyFromApiKeyHelper(isNonInteractiveSession);
}
