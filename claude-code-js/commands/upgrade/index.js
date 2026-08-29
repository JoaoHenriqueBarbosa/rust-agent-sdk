// Original: src/commands/upgrade/index.ts
var upgrade, upgrade_default;
var init_upgrade2 = __esm(() => {
  init_auth14();
  init_envUtils();
  upgrade = {
    type: "local-jsx",
    name: "upgrade",
    description: "Upgrade to Max for higher rate limits and more Opus",
    availability: ["claude-ai"],
    isEnabled: () => !isEnvTruthy(process.env.DISABLE_UPGRADE_COMMAND) && getSubscriptionType() !== "enterprise",
    load: () => Promise.resolve().then(() => (init_upgrade(), exports_upgrade))
  }, upgrade_default = upgrade;
});
