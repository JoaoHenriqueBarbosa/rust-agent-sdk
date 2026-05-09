// Original: src/utils/plugins/pluginOptionsStorage.ts
function getPluginStorageId(plugin) {
  return plugin.source;
}
function clearPluginOptionsCache() {
  loadPluginOptions.cache?.clear?.();
}
function savePluginOptions(pluginId, values3, schema5) {
  let nonSensitive = {}, sensitive = {};
  for (let [key2, value] of Object.entries(values3))
    if (schema5[key2]?.sensitive === !0)
      sensitive[key2] = String(value);
    else
      nonSensitive[key2] = value;
  let sensitiveKeysInThisSave = new Set(Object.keys(sensitive)), nonSensitiveKeysInThisSave = new Set(Object.keys(nonSensitive)), storage = getSecureStorage(), existingInSecureStorage = storage.read()?.pluginSecrets?.[pluginId] ?? void 0, secureScrubbed = existingInSecureStorage ? Object.fromEntries(Object.entries(existingInSecureStorage).filter(([k3]) => !nonSensitiveKeysInThisSave.has(k3))) : void 0, needSecureScrub = secureScrubbed && existingInSecureStorage && Object.keys(secureScrubbed).length !== Object.keys(existingInSecureStorage).length;
  if (Object.keys(sensitive).length > 0 || needSecureScrub) {
    let existing = storage.read() ?? {};
    if (!existing.pluginSecrets)
      existing.pluginSecrets = {};
    existing.pluginSecrets[pluginId] = {
      ...secureScrubbed,
      ...sensitive
    };
    let result = storage.update(existing);
    if (!result.success) {
      let err2 = Error(`Failed to save sensitive plugin options for ${pluginId} to secure storage`);
      throw logError2(err2), err2;
    }
    if (result.warning)
      logForDebugging(`Plugin secrets save warning: ${result.warning}`, {
        level: "warn"
      });
  }
  let settings = getSettings_DEPRECATED(), existingInSettings = settings.pluginConfigs?.[pluginId]?.options ?? {}, keysToScrubFromSettings = Object.keys(existingInSettings).filter((k3) => sensitiveKeysInThisSave.has(k3));
  if (Object.keys(nonSensitive).length > 0 || keysToScrubFromSettings.length > 0) {
    if (!settings.pluginConfigs)
      settings.pluginConfigs = {};
    if (!settings.pluginConfigs[pluginId])
      settings.pluginConfigs[pluginId] = {};
    let scrubbed = Object.fromEntries(keysToScrubFromSettings.map((k3) => [k3, void 0]));
    settings.pluginConfigs[pluginId].options = {
      ...nonSensitive,
      ...scrubbed
    };
    let result = updateSettingsForSource("userSettings", settings);
    if (result.error)
      throw logError2(result.error), Error(`Failed to save plugin options for ${pluginId}: ${result.error.message}`);
  }
  clearPluginOptionsCache();
}
function deletePluginOptions(pluginId) {
  if (getSettings_DEPRECATED().pluginConfigs?.[pluginId]) {
    let pluginConfigs = { [pluginId]: void 0 }, { error: error44 } = updateSettingsForSource("userSettings", {
      pluginConfigs
    });
    if (error44)
      logForDebugging(`deletePluginOptions: failed to clear settings.pluginConfigs[${pluginId}]: ${error44.message}`, { level: "warn" });
  }
  let storage = getSecureStorage(), existing = storage.read();
  if (existing?.pluginSecrets) {
    let prefix = `${pluginId}/`, survivingEntries = Object.entries(existing.pluginSecrets).filter(([k3]) => k3 !== pluginId && !k3.startsWith(prefix));
    if (survivingEntries.length !== Object.keys(existing.pluginSecrets).length) {
      if (!storage.update({
        ...existing,
        pluginSecrets: survivingEntries.length > 0 ? Object.fromEntries(survivingEntries) : void 0
      }).success)
        logForDebugging(`deletePluginOptions: failed to clear pluginSecrets for ${pluginId} from keychain`, { level: "warn" });
    }
  }
  clearPluginOptionsCache();
}
function getUnconfiguredOptions(plugin) {
  let manifestSchema = plugin.manifest.userConfig;
  if (!manifestSchema || Object.keys(manifestSchema).length === 0)
    return {};
  let saved = loadPluginOptions(getPluginStorageId(plugin));
  if (validateUserConfig(saved, manifestSchema).valid)
    return {};
  let unconfigured = {};
  for (let [key2, fieldSchema] of Object.entries(manifestSchema))
    if (!validateUserConfig({ [key2]: saved[key2] }, { [key2]: fieldSchema }).valid)
      unconfigured[key2] = fieldSchema;
  return unconfigured;
}
function substitutePluginVariables(value, plugin) {
  let normalize9 = (p4) => process.platform === "win32" ? p4.replace(/\\/g, "/") : p4, out = value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, () => normalize9(plugin.path));
  if (plugin.source) {
    let source = plugin.source;
    out = out.replace(/\$\{CLAUDE_PLUGIN_DATA\}/g, () => normalize9(getPluginDataDir(source)));
  }
  return out;
}
function substituteUserConfigVariables(value, userConfig) {
  return value.replace(/\$\{user_config\.([^}]+)\}/g, (_match, key2) => {
    let configValue = userConfig[key2];
    if (configValue === void 0)
      throw Error(`Missing required user configuration value: ${key2}. This should have been validated before variable substitution.`);
    return String(configValue);
  });
}
function substituteUserConfigInContent(content, options, schema5) {
  return content.replace(/\$\{user_config\.([^}]+)\}/g, (match, key2) => {
    if (schema5[key2]?.sensitive === !0)
      return `[sensitive option '${key2}' not available in skill content]`;
    let value = options[key2];
    if (value === void 0)
      return match;
    return String(value);
  });
}
var loadPluginOptions;
var init_pluginOptionsStorage = __esm(() => {
  init_memoize();
  init_debug();
  init_log3();
  init_secureStorage();
  init_settings2();
  init_mcpbHandler();
  init_pluginDirectories();
  loadPluginOptions = memoize_default((pluginId) => {
    let nonSensitive = getSettings_DEPRECATED().pluginConfigs?.[pluginId]?.options ?? {}, sensitive = getSecureStorage().read()?.pluginSecrets?.[pluginId] ?? {};
    return { ...nonSensitive, ...sensitive };
  });
});
