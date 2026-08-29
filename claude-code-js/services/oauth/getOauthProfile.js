// Original: src/services/oauth/getOauthProfile.ts
async function getOauthProfileFromApiKey() {
  let accountUuid = getGlobalConfig().oauthAccount?.accountUuid, apiKey = getAnthropicApiKey();
  if (!accountUuid || !apiKey)
    return;
  let endpoint4 = `${getOauthConfig().BASE_API_URL}/api/claude_cli_profile`;
  try {
    return (await axios_default.get(endpoint4, {
      headers: {
        "x-api-key": apiKey,
        "anthropic-beta": OAUTH_BETA_HEADER
      },
      params: {
        account_uuid: accountUuid
      },
      timeout: 1e4
    })).data;
  } catch (error41) {
    logError2(error41);
  }
}
async function getOauthProfileFromOauthToken(accessToken) {
  let endpoint4 = `${getOauthConfig().BASE_API_URL}/api/oauth/profile`;
  try {
    return (await axios_default.get(endpoint4, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      timeout: 1e4
    })).data;
  } catch (error41) {
    logError2(error41);
  }
}
var init_getOauthProfile = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_config4();
  init_log3();
});
