// Original: src/services/compact/timeBasedMCConfig.ts
function getTimeBasedMCConfig() {
  return TIME_BASED_MC_CONFIG_DEFAULTS;
}
var TIME_BASED_MC_CONFIG_DEFAULTS;
var init_timeBasedMCConfig = __esm(() => {
  TIME_BASED_MC_CONFIG_DEFAULTS = {
    enabled: !0,
    gapThresholdMinutes: 60,
    keepRecent: 5
  };
});
