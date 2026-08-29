// Original: src/utils/background/remote/preconditions.ts
async function checkNeedsClaudeAiLogin() {
  if (!isClaudeAISubscriber())
    return !1;
  return checkAndRefreshOAuthTokenIfNeeded();
}
async function checkIsGitClean() {
  return await getIsClean({ ignoreUntracked: !0 });
}
async function checkHasRemoteEnvironment() {
  try {
    return (await fetchEnvironments()).length > 0;
  } catch (error44) {
    return logForDebugging(`checkHasRemoteEnvironment failed: ${errorMessage(error44)}`), !1;
  }
}
function checkIsInGitRepo() {
  return findGitRoot(getCwd()) !== null;
}
async function checkGithubAppInstalled(owner, repo, signal) {
  try {
    let accessToken = getClaudeAIOAuthTokens()?.accessToken;
    if (!accessToken)
      return logForDebugging("checkGithubAppInstalled: No access token found, assuming app not installed"), !1;
    let orgUUID = await getOrganizationUUID();
    if (!orgUUID)
      return logForDebugging("checkGithubAppInstalled: No org UUID found, assuming app not installed"), !1;
    let url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/code/repos/${owner}/${repo}`, headers = {
      ...getOAuthHeaders(accessToken),
      "x-organization-uuid": orgUUID
    };
    logForDebugging(`Checking GitHub app installation for ${owner}/${repo}`);
    let response7 = await axios_default.get(url3, {
      headers,
      timeout: 15000,
      signal
    });
    if (response7.status === 200) {
      if (response7.data.status) {
        let installed = response7.data.status.app_installed;
        return logForDebugging(`GitHub app ${installed ? "is" : "is not"} installed on ${owner}/${repo}`), installed;
      }
      return logForDebugging(`GitHub app is not installed on ${owner}/${repo} (status is null)`), !1;
    }
    return logForDebugging(`checkGithubAppInstalled: Unexpected response status ${response7.status}`), !1;
  } catch (error44) {
    if (axios_default.isAxiosError(error44)) {
      let status = error44.response?.status;
      if (status && status >= 400 && status < 500)
        return logForDebugging(`checkGithubAppInstalled: Got ${status} error, app likely not installed on ${owner}/${repo}`), !1;
    }
    return logForDebugging(`checkGithubAppInstalled error: ${errorMessage(error44)}`), !1;
  }
}
var init_preconditions = __esm(() => {
  init_axios2();
  init_oauth();
  init_client8();
  init_auth14();
  init_cwd2();
  init_debug();
  init_detectRepository();
  init_errors();
  init_git();
  init_api2();
  init_environments();
});
