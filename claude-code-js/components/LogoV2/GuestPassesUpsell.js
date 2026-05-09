// Original: src/components/LogoV2/GuestPassesUpsell.tsx
function resetIfPassesRefreshed() {
  let remaining = getCachedRemainingPasses();
  if (remaining == null || remaining <= 0)
    return;
  let lastSeen = getGlobalConfig().passesLastSeenRemaining ?? 0;
  if (remaining > lastSeen)
    saveGlobalConfig((prev) => ({
      ...prev,
      passesUpsellSeenCount: 0,
      hasVisitedPasses: !1,
      passesLastSeenRemaining: remaining
    }));
}
function shouldShowGuestPassesUpsell() {
  let {
    eligible: eligible2,
    hasCache
  } = checkCachedPassesEligibility();
  if (!eligible2 || !hasCache)
    return !1;
  resetIfPassesRefreshed();
  let config11 = getGlobalConfig();
  if ((config11.passesUpsellSeenCount ?? 0) >= 3)
    return !1;
  if (config11.hasVisitedPasses)
    return !1;
  return !0;
}
function useShowGuestPassesUpsell() {
  let [show] = import_react143.useState(_temp118);
  return show;
}
function _temp118() {
  return shouldShowGuestPassesUpsell();
}
function incrementGuestPassesSeenCount() {
  let newCount = 0;
  saveGlobalConfig((prev) => {
    return newCount = (prev.passesUpsellSeenCount ?? 0) + 1, {
      ...prev,
      passesUpsellSeenCount: newCount
    };
  }), logEvent("tengu_guest_passes_upsell_shown", {
    seen_count: newCount
  });
}
function GuestPassesUpsell() {
  let $3 = import_compiler_runtime200.c(1), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel")) {
    let reward = getCachedReferrerReward();
    t0 = /* @__PURE__ */ jsx_dev_runtime252.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        /* @__PURE__ */ jsx_dev_runtime252.jsxDEV(ThemedText, {
          color: "claude",
          children: "[\u273B]"
        }, void 0, !1, void 0, this),
        " ",
        /* @__PURE__ */ jsx_dev_runtime252.jsxDEV(ThemedText, {
          color: "claude",
          children: "[\u273B]"
        }, void 0, !1, void 0, this),
        " ",
        /* @__PURE__ */ jsx_dev_runtime252.jsxDEV(ThemedText, {
          color: "claude",
          children: "[\u273B]"
        }, void 0, !1, void 0, this),
        " \xB7",
        " ",
        reward ? `Share Claude Code and earn ${formatCreditAmount(reward)} of extra usage \xB7 /passes` : "3 guest passes at /passes"
      ]
    }, void 0, !0, void 0, this), $3[0] = t0;
  } else
    t0 = $3[0];
  return t0;
}
var import_compiler_runtime200, import_react143, jsx_dev_runtime252;
var init_GuestPassesUpsell = __esm(() => {
  init_ink2();
  init_referral();
  init_config4();
  import_compiler_runtime200 = __toESM(require_react_compiler_runtime_development(), 1), import_react143 = __toESM(require_react_development(), 1), jsx_dev_runtime252 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
