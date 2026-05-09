// Original: src/components/messages/RateLimitMessage.tsx
function getUpsellMessage({
  shouldShowUpsell,
  isMax20x,
  isExtraUsageCommandEnabled,
  shouldAutoOpenRateLimitOptionsMenu,
  isTeamOrEnterprise,
  hasBillingAccess
}) {
  if (!shouldShowUpsell)
    return null;
  if (isMax20x) {
    if (isExtraUsageCommandEnabled)
      return "/extra-usage to finish what you\u2019re working on.";
    return "/login to switch to an API usage-billed account.";
  }
  if (shouldAutoOpenRateLimitOptionsMenu)
    return "Opening your options\u2026";
  if (!isTeamOrEnterprise && !isExtraUsageCommandEnabled)
    return "/upgrade to increase your usage limit.";
  if (isTeamOrEnterprise) {
    if (!isExtraUsageCommandEnabled)
      return null;
    if (hasBillingAccess)
      return "/extra-usage to finish what you\u2019re working on.";
    return "/extra-usage to request more usage from your admin.";
  }
  return "/upgrade or /extra-usage to finish what you\u2019re working on.";
}
function RateLimitMessage(t0) {
  let $3 = import_compiler_runtime64.c(16), {
    text: text2,
    onOpenRateLimitOptions
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getSubscriptionType(), $3[0] = t1;
  else
    t1 = $3[0];
  let subscriptionType = t1, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getRateLimitTier(), $3[1] = t2;
  else
    t2 = $3[1];
  let rateLimitTier = t2, isTeamOrEnterprise = subscriptionType === "team" || subscriptionType === "enterprise", isMax20x = rateLimitTier === "default_claude_max_20x", t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t3 = shouldProcessMockLimits() || isClaudeAISubscriber(), $3[2] = t3;
  else
    t3 = $3[2];
  let shouldShowUpsell = t3, canSeeRateLimitOptionsUpsell = shouldShowUpsell && !isMax20x, [hasOpenedInteractiveMenu, setHasOpenedInteractiveMenu] = import_react62.useState(!1), claudeAiLimits = useClaudeAiLimits(), isCurrentlyRateLimited = claudeAiLimits.status === "rejected" && claudeAiLimits.resetsAt !== void 0 && !claudeAiLimits.isUsingOverage, shouldAutoOpenRateLimitOptionsMenu = canSeeRateLimitOptionsUpsell && !hasOpenedInteractiveMenu && isCurrentlyRateLimited && onOpenRateLimitOptions, t4, t5;
  if ($3[3] !== onOpenRateLimitOptions || $3[4] !== shouldAutoOpenRateLimitOptionsMenu)
    t4 = () => {
      if (shouldAutoOpenRateLimitOptionsMenu)
        setHasOpenedInteractiveMenu(!0), onOpenRateLimitOptions();
    }, t5 = [shouldAutoOpenRateLimitOptionsMenu, onOpenRateLimitOptions], $3[3] = onOpenRateLimitOptions, $3[4] = shouldAutoOpenRateLimitOptionsMenu, $3[5] = t4, $3[6] = t5;
  else
    t4 = $3[5], t5 = $3[6];
  import_react62.useEffect(t4, t5);
  let t6;
  bb0: {
    let t72;
    if ($3[7] !== shouldAutoOpenRateLimitOptionsMenu)
      t72 = getUpsellMessage({
        shouldShowUpsell,
        isMax20x,
        isExtraUsageCommandEnabled: extraUsage.isEnabled(),
        shouldAutoOpenRateLimitOptionsMenu: !!shouldAutoOpenRateLimitOptionsMenu,
        isTeamOrEnterprise,
        hasBillingAccess: hasClaudeAiBillingAccess()
      }), $3[7] = shouldAutoOpenRateLimitOptionsMenu, $3[8] = t72;
    else
      t72 = $3[8];
    let message = t72;
    if (!message) {
      t6 = null;
      break bb0;
    }
    let t82;
    if ($3[9] !== message)
      t82 = /* @__PURE__ */ jsx_dev_runtime74.jsxDEV(ThemedText, {
        dimColor: !0,
        children: message
      }, void 0, !1, void 0, this), $3[9] = message, $3[10] = t82;
    else
      t82 = $3[10];
    t6 = t82;
  }
  let upsell = t6, t7;
  if ($3[11] !== text2)
    t7 = /* @__PURE__ */ jsx_dev_runtime74.jsxDEV(ThemedText, {
      color: "error",
      children: text2
    }, void 0, !1, void 0, this), $3[11] = text2, $3[12] = t7;
  else
    t7 = $3[12];
  let t8 = hasOpenedInteractiveMenu ? null : upsell, t9;
  if ($3[13] !== t7 || $3[14] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime74.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime74.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t7,
          t8
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = t7, $3[14] = t8, $3[15] = t9;
  else
    t9 = $3[15];
  return t9;
}
var import_compiler_runtime64, import_react62, jsx_dev_runtime74;
var init_RateLimitMessage = __esm(() => {
  init_extra_usage2();
  init_ink2();
  init_claudeAiLimitsHook();
  init_rateLimitMocking();
  init_auth14();
  init_billing();
  init_MessageResponse();
  import_compiler_runtime64 = __toESM(require_react_compiler_runtime_development(), 1), import_react62 = __toESM(require_react_development(), 1), jsx_dev_runtime74 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
