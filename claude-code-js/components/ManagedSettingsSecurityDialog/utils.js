// Original: src/components/ManagedSettingsSecurityDialog/utils.ts
function extractDangerousSettings(settings) {
  if (!settings)
    return {
      shellSettings: {},
      envVars: {},
      hasHooks: !1
    };
  let shellSettings = {};
  for (let key2 of DANGEROUS_SHELL_SETTINGS) {
    let value = settings[key2];
    if (typeof value === "string" && value.length > 0)
      shellSettings[key2] = value;
  }
  let envVars = {};
  if (settings.env && typeof settings.env === "object") {
    for (let [key2, value] of Object.entries(settings.env))
      if (typeof value === "string" && value.length > 0) {
        if (!SAFE_ENV_VARS2.has(key2.toUpperCase()))
          envVars[key2] = value;
      }
  }
  let hasHooks = settings.hooks !== void 0 && settings.hooks !== null && typeof settings.hooks === "object" && Object.keys(settings.hooks).length > 0;
  return {
    shellSettings,
    envVars,
    hasHooks,
    hooks: hasHooks ? settings.hooks : void 0
  };
}
function hasDangerousSettings(dangerous) {
  return Object.keys(dangerous.shellSettings).length > 0 || Object.keys(dangerous.envVars).length > 0 || dangerous.hasHooks;
}
function hasDangerousSettingsChanged(oldSettings, newSettings) {
  let oldDangerous = extractDangerousSettings(oldSettings), newDangerous = extractDangerousSettings(newSettings);
  if (!hasDangerousSettings(newDangerous))
    return !1;
  if (!hasDangerousSettings(oldDangerous))
    return !0;
  let oldJson = jsonStringify({
    shellSettings: oldDangerous.shellSettings,
    envVars: oldDangerous.envVars,
    hooks: oldDangerous.hooks
  }), newJson = jsonStringify({
    shellSettings: newDangerous.shellSettings,
    envVars: newDangerous.envVars,
    hooks: newDangerous.hooks
  });
  return oldJson !== newJson;
}
function formatDangerousSettingsList(dangerous) {
  let items = [];
  for (let key2 of Object.keys(dangerous.shellSettings))
    items.push(key2);
  for (let key2 of Object.keys(dangerous.envVars))
    items.push(key2);
  if (dangerous.hasHooks)
    items.push("hooks");
  return items;
}
var init_utils8 = __esm(() => {
  init_managedEnvConstants();
  init_slowOperations();
});
