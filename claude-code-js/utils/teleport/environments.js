// Original: src/utils/teleport/environments.ts
async function fetchEnvironments() {
  let accessToken = getClaudeAIOAuthTokens()?.accessToken;
  if (!accessToken)
    throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
  let orgUUID = await getOrganizationUUID();
  if (!orgUUID)
    throw Error("Unable to get organization UUID");
  let url3 = `${getOauthConfig().BASE_API_URL}/v1/environment_providers`;
  try {
    let headers = {
      ...getOAuthHeaders(accessToken),
      "x-organization-uuid": orgUUID
    }, response7 = await axios_default.get(url3, {
      headers,
      timeout: 15000
    });
    if (response7.status !== 200)
      throw Error(`Failed to fetch environments: ${response7.status} ${response7.statusText}`);
    return response7.data.environments;
  } catch (error44) {
    let err2 = toError(error44);
    throw logError2(err2), Error(`Failed to fetch environments: ${err2.message}`);
  }
}
var init_environments = __esm(() => {
  init_axios2();
  init_oauth();
  init_client8();
  init_auth14();
  init_errors();
  init_log3();
  init_api2();
});
