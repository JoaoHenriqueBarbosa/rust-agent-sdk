// function: getSessionLogsViaOAuth
async function getSessionLogsViaOAuth(sessionId, accessToken, orgUUID) {
  let url3 = `${getOauthConfig().BASE_API_URL}/v1/session_ingress/session/${sessionId}`;
  logForDebugging(`[session-ingress] Fetching session logs from: ${url3}`);
  let headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  };
  return await fetchSessionLogsFromUrl(sessionId, url3, headers);
}
