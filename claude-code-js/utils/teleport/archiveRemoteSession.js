// function: archiveRemoteSession
async function archiveRemoteSession(sessionId) {
  let accessToken = getClaudeAIOAuthTokens()?.accessToken;
  if (!accessToken)
    return;
  let orgUUID = await getOrganizationUUID();
  if (!orgUUID)
    return;
  let headers = {
    ...getOAuthHeaders(accessToken),
    "anthropic-beta": "ccr-byoc-2025-07-29",
    "x-organization-uuid": orgUUID
  }, url3 = `${getOauthConfig().BASE_API_URL}/v1/sessions/${sessionId}/archive`;
  try {
    let resp = await axios_default.post(url3, {}, {
      headers,
      timeout: 1e4,
      validateStatus: (s2) => s2 < 500
    });
    if (resp.status === 200 || resp.status === 409)
      logForDebugging(`[archiveRemoteSession] archived ${sessionId}`);
    else
      logForDebugging(`[archiveRemoteSession] ${sessionId} failed ${resp.status}: ${jsonStringify(resp.data)}`);
  } catch (err2) {
    logError2(err2);
  }
}
