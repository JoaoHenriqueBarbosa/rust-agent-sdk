// Original: src/migrations/resetProToOpusDefault.ts
function resetProToOpusDefault() {
  if (getGlobalConfig().opusProMigrationComplete)
    return;
  if (getAPIProvider() !== "firstParty" || !isProSubscriber()) {
    saveGlobalConfig((current) => ({
      ...current,
      opusProMigrationComplete: !0
    })), logEvent("tengu_reset_pro_to_opus_default", { skipped: !0 });
    return;
  }
  if (getSettings_DEPRECATED()?.model === void 0) {
    let opusProMigrationTimestamp = Date.now();
    saveGlobalConfig((current) => ({
      ...current,
      opusProMigrationComplete: !0,
      opusProMigrationTimestamp
    })), logEvent("tengu_reset_pro_to_opus_default", {
      skipped: !1,
      had_custom_model: !1
    });
  } else
    saveGlobalConfig((current) => ({
      ...current,
      opusProMigrationComplete: !0
    })), logEvent("tengu_reset_pro_to_opus_default", {
      skipped: !1,
      had_custom_model: !0
    });
}
var init_resetProToOpusDefault = __esm(() => {
  init_auth14();
  init_config4();
  init_providers();
  init_settings2();
});
