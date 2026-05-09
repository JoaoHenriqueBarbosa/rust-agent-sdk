// Original: src/hooks/notifs/useCanSwitchToExistingSubscription.tsx
function useCanSwitchToExistingSubscription() {
  useStartupNotification(_temp294);
}
async function _temp294() {
  if ((getGlobalConfig().subscriptionNoticeCount ?? 0) >= MAX_SHOW_COUNT2)
    return null;
  let subscriptionType = await getExistingClaudeSubscription();
  if (subscriptionType === null)
    return null;
  return saveGlobalConfig(_temp295), logEvent("tengu_switch_to_subscription_notice_shown", {}), {
    key: "switch-to-subscription",
    jsx: /* @__PURE__ */ jsx_dev_runtime454.jsxDEV(ThemedText, {
      color: "suggestion",
      children: [
        "Use your existing Claude ",
        subscriptionType,
        " plan with Claude Code",
        /* @__PURE__ */ jsx_dev_runtime454.jsxDEV(ThemedText, {
          color: "text",
          dimColor: !0,
          children: [
            " ",
            "\xB7 /login to activate"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this),
    priority: "low"
  };
}
function _temp295(current) {
  return {
    ...current,
    subscriptionNoticeCount: (current.subscriptionNoticeCount ?? 0) + 1
  };
}
async function getExistingClaudeSubscription() {
  if (isClaudeAISubscriber())
    return null;
  let profile7 = await getOauthProfileFromApiKey();
  if (!profile7)
    return null;
  if (profile7.account.has_claude_max)
    return "Max";
  if (profile7.account.has_claude_pro)
    return "Pro";
  return null;
}
var jsx_dev_runtime454, MAX_SHOW_COUNT2 = 3;
var init_useCanSwitchToExistingSubscription = __esm(() => {
  init_getOauthProfile();
  init_auth14();
  init_ink2();
  init_config4();
  init_useStartupNotification();
  jsx_dev_runtime454 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
