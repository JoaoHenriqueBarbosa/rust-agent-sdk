// Original: src/utils/background/remote/remoteSession.ts
async function checkBackgroundRemoteSessionEligibility({
  skipBundle = !1
} = {}) {
  let errors8 = [];
  if (!isPolicyAllowed("allow_remote_sessions"))
    return errors8.push({ type: "policy_blocked" }), errors8;
  let [needsLogin, hasRemoteEnv, repository] = await Promise.all([
    checkNeedsClaudeAiLogin(),
    checkHasRemoteEnvironment(),
    detectCurrentRepositoryWithHost()
  ]);
  if (needsLogin)
    errors8.push({ type: "not_logged_in" });
  if (!hasRemoteEnv)
    errors8.push({ type: "no_remote_environment" });
  let bundleSeedGateOn = !skipBundle && (isEnvTruthy(process.env.CCR_FORCE_BUNDLE) || isEnvTruthy(process.env.CCR_ENABLE_BUNDLE));
  if (!checkIsInGitRepo())
    errors8.push({ type: "not_in_git_repo" });
  else if (bundleSeedGateOn)
    ;
  else if (repository === null)
    errors8.push({ type: "no_git_remote" });
  else if (repository.host === "github.com") {
    if (!await checkGithubAppInstalled(repository.owner, repository.name))
      errors8.push({ type: "github_app_not_installed" });
  }
  return errors8;
}
var init_remoteSession = __esm(() => {
  init_policyLimits();
  init_detectRepository();
  init_envUtils();
  init_preconditions();
});
