// function: createTokenCycler
function createTokenCycler(credential, tokenCyclerOptions) {
  let refreshWorker = null, token = null, tenantId, options = {
    ...DEFAULT_CYCLER_OPTIONS,
    ...tokenCyclerOptions
  }, cycler = {
    get isRefreshing() {
      return refreshWorker !== null;
    },
    get shouldRefresh() {
      if (cycler.isRefreshing)
        return !1;
      if (token?.refreshAfterTimestamp && token.refreshAfterTimestamp < Date.now())
        return !0;
      return (token?.expiresOnTimestamp ?? 0) - options.refreshWindowInMs < Date.now();
    },
    get mustRefresh() {
      return token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now();
    }
  };
  function refresh(scopes, getTokenOptions) {
    if (!cycler.isRefreshing)
      refreshWorker = beginRefresh(() => credential.getToken(scopes, getTokenOptions), options.retryIntervalInMs, token?.expiresOnTimestamp ?? Date.now()).then((_token) => {
        return refreshWorker = null, token = _token, tenantId = getTokenOptions.tenantId, token;
      }).catch((reason) => {
        throw refreshWorker = null, token = null, tenantId = void 0, reason;
      });
    return refreshWorker;
  }
  return async (scopes, tokenOptions) => {
    let hasClaimChallenge = Boolean(tokenOptions.claims), tenantIdChanged = tenantId !== tokenOptions.tenantId;
    if (hasClaimChallenge)
      token = null;
    if (tenantIdChanged || hasClaimChallenge || cycler.mustRefresh)
      return refresh(scopes, tokenOptions);
    if (cycler.shouldRefresh)
      refresh(scopes, tokenOptions);
    return token;
  };
}
