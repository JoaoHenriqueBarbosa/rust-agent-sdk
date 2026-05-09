// Original: src/services/api/firstTokenDate.ts
async function fetchAndStoreClaudeCodeFirstTokenDate() {
  try {
    if (getGlobalConfig().claudeCodeFirstTokenDate !== void 0)
      return;
    let authHeaders = getAuthHeaders();
    if (authHeaders.error) {
      logError2(Error(`Failed to get auth headers: ${authHeaders.error}`));
      return;
    }
    let url3 = `${getOauthConfig().BASE_API_URL}/api/organization/claude_code_first_token_date`, firstTokenDate = (await axios_default.get(url3, {
      headers: {
        ...authHeaders.headers,
        "User-Agent": getClaudeCodeUserAgent()
      },
      timeout: 1e4
    })).data?.first_token_date ?? null;
    if (firstTokenDate !== null) {
      let dateTime = new Date(firstTokenDate).getTime();
      if (isNaN(dateTime)) {
        logError2(Error(`Received invalid first_token_date from API: ${firstTokenDate}`));
        return;
      }
    }
    saveGlobalConfig((current) => ({
      ...current,
      claudeCodeFirstTokenDate: firstTokenDate
    }));
  } catch (error44) {
    logError2(error44);
  }
}
var init_firstTokenDate = __esm(() => {
  init_axios2();
  init_oauth();
  init_config4();
  init_http6();
  init_log3();
});
