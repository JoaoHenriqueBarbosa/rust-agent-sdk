// Original: src/migrations/migrateBypassPermissionsAcceptedToSettings.ts
function migrateBypassPermissionsAcceptedToSettings() {
  if (!getGlobalConfig().bypassPermissionsModeAccepted)
    return;
  try {
    if (!hasSkipDangerousModePermissionPrompt())
      updateSettingsForSource("userSettings", {
        skipDangerousModePermissionPrompt: !0
      });
    logEvent("tengu_migrate_bypass_permissions_accepted", {}), saveGlobalConfig((current) => {
      if (!("bypassPermissionsModeAccepted" in current))
        return current;
      let { bypassPermissionsModeAccepted: _, ...updatedConfig } = current;
      return updatedConfig;
    });
  } catch (error44) {
    logError2(Error(`Failed to migrate bypass permissions accepted: ${error44}`));
  }
}
var init_migrateBypassPermissionsAcceptedToSettings = __esm(() => {
  init_config4();
  init_log3();
  init_settings2();
});
