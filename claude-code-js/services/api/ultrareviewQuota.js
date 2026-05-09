// Original: src/services/api/ultrareviewQuota.ts
async function fetchUltrareviewQuota() {
  if (!isClaudeAISubscriber())
    return null;
  try {
    let { accessToken, orgUUID } = await prepareApiRequest();
    return (await axios_default.get(`${getOauthConfig().BASE_API_URL}/v1/ultrareview/quota`, {
      headers: {
        ...getOAuthHeaders(accessToken),
        "x-organization-uuid": orgUUID
      },
      timeout: 5000
    })).data;
  } catch (error44) {
    return logForDebugging(`fetchUltrareviewQuota failed: ${error44}`), null;
  }
}
var init_ultrareviewQuota = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_debug();
  init_api2();
});
