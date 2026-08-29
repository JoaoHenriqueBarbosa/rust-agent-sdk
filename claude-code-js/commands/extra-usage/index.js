// Original: src/commands/extra-usage/index.ts
function isExtraUsageAllowed() {
  if (isEnvTruthy(process.env.DISABLE_EXTRA_USAGE_COMMAND))
    return !1;
  return isOverageProvisioningAllowed();
}
var extraUsage, extraUsageNonInteractive;
var init_extra_usage2 = __esm(() => {
  init_state();
  init_auth14();
  init_envUtils();
  extraUsage = {
    type: "local-jsx",
    name: "extra-usage",
    description: "Configure extra usage to keep working when limits are hit",
    isEnabled: () => isExtraUsageAllowed() && !getIsNonInteractiveSession(),
    load: () => Promise.resolve().then(() => (init_extra_usage(), exports_extra_usage))
  }, extraUsageNonInteractive = {
    type: "local",
    name: "extra-usage",
    supportsNonInteractive: !0,
    description: "Configure extra usage to keep working when limits are hit",
    isEnabled: () => isExtraUsageAllowed() && getIsNonInteractiveSession(),
    get isHidden() {
      return !getIsNonInteractiveSession();
    },
    load: () => Promise.resolve().then(() => (init_extra_usage_noninteractive(), exports_extra_usage_noninteractive))
  };
});
