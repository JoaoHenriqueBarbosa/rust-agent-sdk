// function: checkAndRefreshOAuthTokenIfNeeded
function checkAndRefreshOAuthTokenIfNeeded(retryCount = 0, force = !1) {
  if (retryCount === 0 && !force) {
    if (pendingRefreshCheck)
      return pendingRefreshCheck;
    return pendingRefreshCheck = checkAndRefreshOAuthTokenIfNeededImpl(retryCount, force).finally(() => {
      pendingRefreshCheck = null;
    }), pendingRefreshCheck;
  }
  return checkAndRefreshOAuthTokenIfNeededImpl(retryCount, force);
}
