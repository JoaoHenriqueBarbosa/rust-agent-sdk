// Original: src/utils/plugins/pluginStartupCheck.ts
var exports_pluginStartupCheck = {};
__export(exports_pluginStartupCheck, {
  settingSourceToScope: () => settingSourceToScope2,
  isPersistableScope: () => isPersistableScope,
  installSelectedPlugins: () => installSelectedPlugins,
  getPluginEditableScopes: () => getPluginEditableScopes,
  getInstalledPlugins: () => getInstalledPlugins,
  findMissingPlugins: () => findMissingPlugins,
  checkEnabledPlugins: () => checkEnabledPlugins
});
import { join as join115 } from "path";
async function checkEnabledPlugins() {
  let settings = getInitialSettings(), enabledPlugins = [], addDirPlugins = getAddDirEnabledPlugins();
  for (let [pluginId, value] of Object.entries(addDirPlugins))
    if (pluginId.includes("@") && value)
      enabledPlugins.push(pluginId);
  if (settings.enabledPlugins)
    for (let [pluginId, value] of Object.entries(settings.enabledPlugins)) {
      if (!pluginId.includes("@"))
        continue;
      let idx = enabledPlugins.indexOf(pluginId);
      if (value) {
        if (idx === -1)
          enabledPlugins.push(pluginId);
      } else if (idx !== -1)
        enabledPlugins.splice(idx, 1);
    }
  return enabledPlugins;
}
function getPluginEditableScopes() {
  let result = /* @__PURE__ */ new Map, addDirPlugins = getAddDirEnabledPlugins();
  for (let [pluginId, value] of Object.entries(addDirPlugins)) {
    if (!pluginId.includes("@"))
      continue;
    if (value === !0)
      result.set(pluginId, "flag");
    else if (value === !1)
      result.delete(pluginId);
  }
  let scopeSources = [
    { scope: "managed", source: "policySettings" },
    { scope: "user", source: "userSettings" },
    { scope: "project", source: "projectSettings" },
    { scope: "local", source: "localSettings" },
    { scope: "flag", source: "flagSettings" }
  ];
  for (let { scope, source } of scopeSources) {
    let settings = getSettingsForSource(source);
    if (!settings?.enabledPlugins)
      continue;
    for (let [pluginId, value] of Object.entries(settings.enabledPlugins)) {
      if (!pluginId.includes("@"))
        continue;
      if (pluginId in addDirPlugins && addDirPlugins[pluginId] !== value)
        logForDebugging(`Plugin ${pluginId} from --add-dir (${addDirPlugins[pluginId]}) overridden by ${source} (${value})`);
      if (value === !0)
        result.set(pluginId, scope);
      else if (value === !1)
        result.delete(pluginId);
    }
  }
  return logForDebugging(`Found ${result.size} enabled plugins with scopes: ${Array.from(result.entries()).map(([id, scope]) => `${id}(${scope})`).join(", ")}`), result;
}
function isPersistableScope(scope) {
  return scope !== "flag";
}
function settingSourceToScope2(source) {
  return SETTING_SOURCE_TO_SCOPE[source];
}
async function getInstalledPlugins() {
  migrateFromEnabledPlugins().catch((error44) => {
    logError2(error44);
  });
  let v2Data = getInMemoryInstalledPlugins(), installed = Object.keys(v2Data.plugins);
  return logForDebugging(`Found ${installed.length} installed plugins`), installed;
}
async function findMissingPlugins(enabledPlugins) {
  try {
    let installedPlugins = await getInstalledPlugins(), notInstalled = enabledPlugins.filter((id) => !installedPlugins.includes(id));
    return (await Promise.all(notInstalled.map(async (pluginId) => {
      try {
        let plugin = await getPluginById(pluginId);
        return { pluginId, found: plugin !== null && plugin !== void 0 };
      } catch (error44) {
        return logForDebugging(`Failed to check plugin ${pluginId} in marketplace: ${error44}`), { pluginId, found: !1 };
      }
    }))).filter(({ found }) => found).map(({ pluginId }) => pluginId);
  } catch (error44) {
    return logError2(error44), [];
  }
}
async function installSelectedPlugins(pluginsToInstall, onProgress, scope = "user") {
  let projectPath = scope !== "user" ? getCwd() : void 0, settingSource = scopeToSettingSource(scope), settings = getSettingsForSource(settingSource), updatedEnabledPlugins = { ...settings?.enabledPlugins }, installed = [], failed = [];
  for (let i5 = 0;i5 < pluginsToInstall.length; i5++) {
    let pluginId = pluginsToInstall[i5];
    if (!pluginId)
      continue;
    if (onProgress)
      onProgress(pluginId, i5 + 1, pluginsToInstall.length);
    try {
      let pluginInfo = await getPluginById(pluginId);
      if (!pluginInfo) {
        failed.push({
          name: pluginId,
          error: "Plugin not found in any marketplace"
        });
        continue;
      }
      let { entry, marketplaceInstallLocation } = pluginInfo;
      if (!isLocalPluginSource(entry.source))
        await cacheAndRegisterPlugin(pluginId, entry, scope, projectPath);
      else
        registerPluginInstallation({
          pluginId,
          installPath: join115(marketplaceInstallLocation, entry.source),
          version: entry.version
        }, scope, projectPath);
      updatedEnabledPlugins[pluginId] = !0, installed.push(pluginId);
    } catch (error44) {
      let errorMessage3 = error44 instanceof Error ? error44.message : String(error44);
      failed.push({ name: pluginId, error: errorMessage3 }), logError2(error44);
    }
  }
  return updateSettingsForSource(settingSource, {
    ...settings,
    enabledPlugins: updatedEnabledPlugins
  }), { installed, failed };
}
var init_pluginStartupCheck = __esm(() => {
  init_cwd2();
  init_debug();
  init_log3();
  init_settings2();
  init_addDirPluginSettings();
  init_installedPluginsManager();
  init_marketplaceManager();
  init_pluginIdentifier();
  init_pluginInstallationHelpers();
  init_schemas3();
});
