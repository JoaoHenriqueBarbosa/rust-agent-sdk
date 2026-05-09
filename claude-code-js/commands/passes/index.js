// Original: src/commands/passes/index.ts
var passes_default;
var init_passes2 = __esm(() => {
  init_referral();
  passes_default = {
    type: "local-jsx",
    name: "passes",
    get description() {
      if (getCachedReferrerReward())
        return "Share a free week of Claude Code with friends and earn extra usage";
      return "Share a free week of Claude Code with friends";
    },
    get isHidden() {
      let { eligible: eligible2, hasCache } = checkCachedPassesEligibility();
      return !eligible2 || !hasCache;
    },
    load: () => Promise.resolve().then(() => (init_passes(), exports_passes))
  };
});
