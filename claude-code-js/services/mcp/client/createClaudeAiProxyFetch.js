// function: createClaudeAiProxyFetch
function createClaudeAiProxyFetch(innerFetch) {
  return async (url3, init2) => {
    let doRequest = async () => {
      await checkAndRefreshOAuthTokenIfNeeded();
      let currentTokens = getClaudeAIOAuthTokens();
      if (!currentTokens)
        throw Error("No claude.ai OAuth token available");
      let headers = new Headers(init2?.headers);
      return headers.set("Authorization", `Bearer ${currentTokens.accessToken}`), { response: await innerFetch(url3, { ...init2, headers }), sentToken: currentTokens.accessToken };
    }, { response: response7, sentToken } = await doRequest();
    if (response7.status !== 401)
      return response7;
    let tokenChanged = await handleOAuth401Error(sentToken).catch(() => !1);
    if (logEvent("tengu_mcp_claudeai_proxy_401", {
      tokenChanged
    }), !tokenChanged) {
      let now2 = getClaudeAIOAuthTokens()?.accessToken;
      if (!now2 || now2 === sentToken)
        return response7;
    }
    try {
      return (await doRequest()).response;
    } catch {
      return response7;
    }
  };
}
