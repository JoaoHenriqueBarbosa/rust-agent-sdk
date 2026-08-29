// Original: src/commands/passes/passes.tsx
var exports_passes = {};
__export(exports_passes, {
  call: () => call43
});
async function call43(onDone) {
  let isFirstVisit = !getGlobalConfig().hasVisitedPasses;
  if (isFirstVisit) {
    let remaining = getCachedRemainingPasses();
    saveGlobalConfig((current) => ({
      ...current,
      hasVisitedPasses: !0,
      passesLastSeenRemaining: remaining ?? current.passesLastSeenRemaining
    }));
  }
  return logEvent("tengu_guest_passes_visited", {
    is_first_visit: isFirstVisit
  }), /* @__PURE__ */ jsx_dev_runtime305.jsxDEV(Passes, {
    onDone
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime305;
var init_passes = __esm(() => {
  init_Passes();
  init_referral();
  init_config4();
  jsx_dev_runtime305 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
