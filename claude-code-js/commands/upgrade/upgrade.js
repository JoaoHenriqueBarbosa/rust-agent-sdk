// Original: src/commands/upgrade/upgrade.tsx
var exports_upgrade = {};
__export(exports_upgrade, {
  call: () => call64
});
async function call64(onDone, context7) {
  try {
    if (isClaudeAISubscriber()) {
      let tokens = getClaudeAIOAuthTokens(), isMax20x = !1;
      if (tokens?.subscriptionType && tokens?.rateLimitTier)
        isMax20x = tokens.subscriptionType === "max" && tokens.rateLimitTier === "default_claude_max_20x";
      else if (tokens?.accessToken) {
        let profile7 = await getOauthProfileFromOauthToken(tokens.accessToken);
        isMax20x = profile7?.organization?.organization_type === "claude_max" && profile7?.organization?.rate_limit_tier === "default_claude_max_20x";
      }
      if (isMax20x)
        return setTimeout(onDone, 0, "You are already on the highest Max subscription plan. For additional usage, run /login to switch to an API usage-billed account."), null;
    }
    return await openBrowser("https://claude.ai/upgrade/max"), /* @__PURE__ */ jsx_dev_runtime356.jsxDEV(Login, {
      startingMessage: "Starting new login following /upgrade. Exit with Ctrl-C to use existing account.",
      onDone: (success2) => {
        context7.onChangeAPIKey(), onDone(success2 ? "Login successful" : "Login interrupted");
      }
    }, void 0, !1, void 0, this);
  } catch (error44) {
    logError2(error44), setTimeout(onDone, 0, "Failed to open browser. Please visit https://claude.ai/upgrade/max to upgrade.");
  }
  return null;
}
var jsx_dev_runtime356;
var init_upgrade = __esm(() => {
  init_getOauthProfile();
  init_auth14();
  init_browser();
  init_log3();
  init_login();
  jsx_dev_runtime356 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
