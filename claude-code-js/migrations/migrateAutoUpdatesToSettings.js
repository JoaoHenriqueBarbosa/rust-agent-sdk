// Original: src/migrations/migrateAutoUpdatesToSettings.ts
function migrateAutoUpdatesToSettings() {
  let globalConfig2 = getGlobalConfig();
  if (globalConfig2.autoUpdates !== !1 || globalConfig2.autoUpdatesProtectedForNative === !0)
    return;
  try {
    let userSettings = getSettingsForSource("userSettings") || {};
    updateSettingsForSource("userSettings", {
      ...userSettings,
      env: {
        ...userSettings.env,
        DISABLE_AUTOUPDATER: "1"
      }
    }), logEvent("tengu_migrate_autoupdates_to_settings", {
      was_user_preference: !0,
      already_had_env_var: !!userSettings.env?.DISABLE_AUTOUPDATER
    }), process.env.DISABLE_AUTOUPDATER = "1", saveGlobalConfig((current) => {
      let {
        autoUpdates: _,
        autoUpdatesProtectedForNative: __,
        ...updatedConfig
      } = current;
      return updatedConfig;
    });
  } catch (error44) {
    logError2(Error(`Failed to migrate auto-updates: ${error44}`)), logEvent("tengu_migrate_autoupdates_error", {
      has_error: !0
    });
  }
}
var init_migrateAutoUpdatesToSettings = __esm(() => {
  init_config4();
  init_log3();
  init_settings2();
});
