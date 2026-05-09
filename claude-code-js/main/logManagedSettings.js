// function: logManagedSettings
function logManagedSettings() {
  try {
    let policySettings = getSettingsForSource("policySettings");
    if (policySettings) {
      let allKeys = getManagedSettingsKeysForLogging(policySettings);
      logEvent("tengu_managed_settings_loaded", {
        keyCount: allKeys.length,
        keys: allKeys.join(",")
      });
    }
  } catch {}
}
