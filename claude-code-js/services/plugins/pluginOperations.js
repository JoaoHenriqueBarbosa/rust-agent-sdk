// Original: src/services/plugins/pluginOperations.ts
import { dirname as dirname53, join as join117 } from "path";
function assertInstallableScope(scope) {
  if (!VALID_INSTALLABLE_SCOPES.includes(scope))
    throw Error(`Invalid scope "${scope}". Must be one of: ${VALID_INSTALLABLE_SCOPES.join(", ")}`);
}
function isInstallableScope(scope) {
  return VALID_INSTALLABLE_SCOPES.includes(scope);
}
function getProjectPathForScope(scope) {
  return scope === "project" || scope === "local" ? getOriginalCwd() : void 0;
}
function isPluginEnabledAtProjectScope(pluginId) {
  return getSettingsForSource("projectSettings")?.enabledPlugins?.[pluginId] === !0;
}
function findPluginInSettings(plugin) {
  let hasMarketplace = plugin.includes("@"), searchOrder = ["local", "project", "user"];
  for (let scope of searchOrder) {
    let enabledPlugins = getSettingsForSource(scopeToSettingSource(scope))?.enabledPlugins;
    if (!enabledPlugins)
      continue;
    for (let key3 of Object.keys(enabledPlugins))
      if (hasMarketplace ? key3 === plugin : key3.startsWith(`${plugin}@`))
        return { pluginId: key3, scope };
  }
  return null;
}
function findPluginByIdentifier(plugin, plugins) {
  let { name: name3, marketplace } = parsePluginIdentifier(plugin);
  return plugins.find((p4) => {
    if (p4.name === plugin || p4.name === name3)
      return !0;
    if (marketplace && p4.source)
      return p4.name === name3 && p4.source.includes(`@${marketplace}`);
    return !1;
  });
}
function resolveDelistedPluginId(plugin) {
  let { name: name3 } = parsePluginIdentifier(plugin), installedData = loadInstalledPluginsV2();
  if (installedData.plugins[plugin]?.length)
    return { pluginId: plugin, pluginName: name3 };
  let matchingKey = Object.keys(installedData.plugins).find((key3) => {
    let { name: keyName2 } = parsePluginIdentifier(key3);
    return keyName2 === name3 && (installedData.plugins[key3]?.length ?? 0) > 0;
  });
  if (matchingKey)
    return { pluginId: matchingKey, pluginName: name3 };
  return null;
}
function getPluginInstallationFromV2(pluginId) {
  let installations = loadInstalledPluginsV2().plugins[pluginId];
  if (!installations || installations.length === 0)
    return { scope: "user" };
  let currentProjectPath = getOriginalCwd(), localInstall = installations.find((inst) => inst.scope === "local" && inst.projectPath === currentProjectPath);
  if (localInstall)
    return { scope: localInstall.scope, projectPath: localInstall.projectPath };
  let projectInstall = installations.find((inst) => inst.scope === "project" && inst.projectPath === currentProjectPath);
  if (projectInstall)
    return {
      scope: projectInstall.scope,
      projectPath: projectInstall.projectPath
    };
  let userInstall = installations.find((inst) => inst.scope === "user");
  if (userInstall)
    return { scope: userInstall.scope };
  return {
    scope: installations[0].scope,
    projectPath: installations[0].projectPath
  };
}
async function installPluginOp(plugin, scope = "user") {
  assertInstallableScope(scope);
  let { name: pluginName, marketplace: marketplaceName } = parsePluginIdentifier(plugin), foundPlugin, foundMarketplace, marketplaceInstallLocation;
  if (marketplaceName) {
    let pluginInfo = await getPluginById(plugin);
    if (pluginInfo)
      foundPlugin = pluginInfo.entry, foundMarketplace = marketplaceName, marketplaceInstallLocation = pluginInfo.marketplaceInstallLocation;
  } else {
    let marketplaces = await loadKnownMarketplacesConfig();
    for (let [mktName, mktConfig] of Object.entries(marketplaces))
      try {
        let pluginEntry = (await getMarketplace(mktName)).plugins.find((p4) => p4.name === pluginName);
        if (pluginEntry) {
          foundPlugin = pluginEntry, foundMarketplace = mktName, marketplaceInstallLocation = mktConfig.installLocation;
          break;
        }
      } catch (error44) {
        logError2(toError(error44));
        continue;
      }
  }
  if (!foundPlugin || !foundMarketplace) {
    let location = marketplaceName ? `marketplace "${marketplaceName}"` : "any configured marketplace";
    return {
      success: !1,
      message: `Plugin "${pluginName}" not found in ${location}`
    };
  }
  let entry = foundPlugin, pluginId = `${entry.name}@${foundMarketplace}`, result = await installResolvedPlugin({
    pluginId,
    entry,
    scope,
    marketplaceInstallLocation
  });
  if (!result.ok)
    switch (result.reason) {
      case "local-source-no-location":
        return {
          success: !1,
          message: `Cannot install local plugin "${result.pluginName}" without marketplace install location`
        };
      case "settings-write-failed":
        return {
          success: !1,
          message: `Failed to update settings: ${result.message}`
        };
      case "resolution-failed":
        return {
          success: !1,
          message: formatResolutionError(result.resolution)
        };
      case "blocked-by-policy":
        return {
          success: !1,
          message: `Plugin "${result.pluginName}" is blocked by your organization's policy and cannot be installed`
        };
      case "dependency-blocked-by-policy":
        return {
          success: !1,
          message: `Plugin "${result.pluginName}" depends on "${result.blockedDependency}", which is blocked by your organization's policy`
        };
    }
  return {
    success: !0,
    message: `Successfully installed plugin: ${pluginId} (scope: ${scope})${result.depNote}`,
    pluginId,
    pluginName: entry.name,
    scope
  };
}
async function uninstallPluginOp(plugin, scope = "user", deleteDataDir = !0) {
  assertInstallableScope(scope);
  let { enabled: enabled2, disabled } = await loadAllPlugins(), allPlugins = [...enabled2, ...disabled], foundPlugin = findPluginByIdentifier(plugin, allPlugins), settingSource = scopeToSettingSource(scope), settings = getSettingsForSource(settingSource), pluginId, pluginName;
  if (foundPlugin)
    pluginId = Object.keys(settings?.enabledPlugins ?? {}).find((k3) => k3 === plugin || k3 === foundPlugin.name || k3.startsWith(`${foundPlugin.name}@`)) ?? (plugin.includes("@") ? plugin : foundPlugin.name), pluginName = foundPlugin.name;
  else {
    let resolved = resolveDelistedPluginId(plugin);
    if (!resolved)
      return {
        success: !1,
        message: `Plugin "${plugin}" not found in installed plugins`
      };
    pluginId = resolved.pluginId, pluginName = resolved.pluginName;
  }
  let projectPath = getProjectPathForScope(scope), installations = loadInstalledPluginsV2().plugins[pluginId], scopeInstallation = installations?.find((i5) => i5.scope === scope && i5.projectPath === projectPath);
  if (!scopeInstallation) {
    let { scope: actualScope } = getPluginInstallationFromV2(pluginId);
    if (actualScope !== scope && installations && installations.length > 0) {
      if (actualScope === "project")
        return {
          success: !1,
          message: `Plugin "${plugin}" is enabled at project scope (.claude/settings.json, shared with your team). To disable just for you: claude plugin disable ${plugin} --scope local`
        };
      return {
        success: !1,
        message: `Plugin "${plugin}" is installed in ${actualScope} scope, not ${scope}. Use --scope ${actualScope} to uninstall.`
      };
    }
    return {
      success: !1,
      message: `Plugin "${plugin}" is not installed in ${scope} scope. Use --scope to specify the correct scope.`
    };
  }
  let installPath = scopeInstallation.installPath, newEnabledPlugins = {
    ...settings?.enabledPlugins
  };
  newEnabledPlugins[pluginId] = void 0, updateSettingsForSource(settingSource, {
    enabledPlugins: newEnabledPlugins
  }), clearAllCaches(), removePluginInstallation(pluginId, scope, projectPath);
  let remainingInstallations = loadInstalledPluginsV2().plugins[pluginId], isLastScope = !remainingInstallations || remainingInstallations.length === 0;
  if (isLastScope && installPath)
    await markPluginVersionOrphaned(installPath);
  if (isLastScope) {
    if (deletePluginOptions(pluginId), deleteDataDir)
      await deletePluginDataDir(pluginId);
  }
  let reverseDependents = findReverseDependents(pluginId, allPlugins), depWarn = formatReverseDependentsSuffix(reverseDependents);
  return {
    success: !0,
    message: `Successfully uninstalled plugin: ${pluginName} (scope: ${scope})${depWarn}`,
    pluginId,
    pluginName,
    scope,
    reverseDependents: reverseDependents.length > 0 ? reverseDependents : void 0
  };
}
async function setPluginEnabledOp(plugin, enabled2, scope) {
  let operation = enabled2 ? "enable" : "disable";
  if (isBuiltinPluginId(plugin)) {
    let { error: error45 } = updateSettingsForSource("userSettings", {
      enabledPlugins: {
        ...getSettingsForSource("userSettings")?.enabledPlugins,
        [plugin]: enabled2
      }
    });
    if (error45)
      return {
        success: !1,
        message: `Failed to ${operation} built-in plugin: ${error45.message}`
      };
    clearAllCaches();
    let { name: pluginName2 } = parsePluginIdentifier(plugin);
    return {
      success: !0,
      message: `Successfully ${operation}d built-in plugin: ${pluginName2}`,
      pluginId: plugin,
      pluginName: pluginName2,
      scope: "user"
    };
  }
  if (scope)
    assertInstallableScope(scope);
  let pluginId, resolvedScope, found = findPluginInSettings(plugin);
  if (scope)
    if (resolvedScope = scope, found)
      pluginId = found.pluginId;
    else if (plugin.includes("@"))
      pluginId = plugin;
    else
      return {
        success: !1,
        message: `Plugin "${plugin}" not found in settings. Use plugin@marketplace format.`
      };
  else if (found)
    pluginId = found.pluginId, resolvedScope = found.scope;
  else if (plugin.includes("@"))
    pluginId = plugin, resolvedScope = "user";
  else
    return {
      success: !1,
      message: `Plugin "${plugin}" not found in any editable settings scope. Use plugin@marketplace format.`
    };
  if (enabled2 && isPluginBlockedByPolicy(pluginId))
    return {
      success: !1,
      message: `Plugin "${pluginId}" is blocked by your organization's policy and cannot be enabled`
    };
  let settingSource = scopeToSettingSource(resolvedScope), scopeSettingsValue = getSettingsForSource(settingSource)?.enabledPlugins?.[pluginId], SCOPE_PRECEDENCE = {
    user: 0,
    project: 1,
    local: 2
  }, isOverride = scope && found && SCOPE_PRECEDENCE[scope] > SCOPE_PRECEDENCE[found.scope];
  if (scope && scopeSettingsValue === void 0 && found && found.scope !== scope && !isOverride)
    return {
      success: !1,
      message: `Plugin "${plugin}" is installed at ${found.scope} scope, not ${scope}. Use --scope ${found.scope} or omit --scope to auto-detect.`
    };
  let isCurrentlyEnabled = scope && !isOverride ? scopeSettingsValue === !0 : getPluginEditableScopes().has(pluginId);
  if (enabled2 === isCurrentlyEnabled)
    return {
      success: !1,
      message: `Plugin "${plugin}" is already ${enabled2 ? "enabled" : "disabled"}${scope ? ` at ${scope} scope` : ""}`
    };
  let reverseDependents;
  if (!enabled2) {
    let { enabled: loadedEnabled, disabled } = await loadAllPlugins(), rdeps = findReverseDependents(pluginId, [
      ...loadedEnabled,
      ...disabled
    ]);
    if (rdeps.length > 0)
      reverseDependents = rdeps;
  }
  let { error: error44 } = updateSettingsForSource(settingSource, {
    enabledPlugins: {
      ...getSettingsForSource(settingSource)?.enabledPlugins,
      [pluginId]: enabled2
    }
  });
  if (error44)
    return {
      success: !1,
      message: `Failed to ${operation} plugin: ${error44.message}`
    };
  clearAllCaches();
  let { name: pluginName } = parsePluginIdentifier(pluginId), depWarn = formatReverseDependentsSuffix(reverseDependents);
  return {
    success: !0,
    message: `Successfully ${operation}d plugin: ${pluginName} (scope: ${resolvedScope})${depWarn}`,
    pluginId,
    pluginName,
    scope: resolvedScope,
    reverseDependents
  };
}
async function enablePluginOp(plugin, scope) {
  return setPluginEnabledOp(plugin, !0, scope);
}
async function disablePluginOp(plugin, scope) {
  return setPluginEnabledOp(plugin, !1, scope);
}
async function disableAllPluginsOp() {
  let enabledPlugins = getPluginEditableScopes();
  if (enabledPlugins.size === 0)
    return { success: !0, message: "No enabled plugins to disable" };
  let disabled = [], errors8 = [];
  for (let [pluginId] of enabledPlugins) {
    let result = await setPluginEnabledOp(pluginId, !1);
    if (result.success)
      disabled.push(pluginId);
    else
      errors8.push(`${pluginId}: ${result.message}`);
  }
  if (errors8.length > 0)
    return {
      success: !1,
      message: `Disabled ${disabled.length} ${plural(disabled.length, "plugin")}, ${errors8.length} failed:
${errors8.join(`
`)}`
    };
  return {
    success: !0,
    message: `Disabled ${disabled.length} ${plural(disabled.length, "plugin")}`
  };
}
async function updatePluginOp(plugin, scope) {
  let { name: pluginName, marketplace: marketplaceName } = parsePluginIdentifier(plugin), pluginId = marketplaceName ? `${pluginName}@${marketplaceName}` : plugin, pluginInfo = await getPluginById(plugin);
  if (!pluginInfo)
    return {
      success: !1,
      message: `Plugin "${pluginName}" not found`,
      pluginId,
      scope
    };
  let { entry, marketplaceInstallLocation } = pluginInfo, installations = loadInstalledPluginsFromDisk().plugins[pluginId];
  if (!installations || installations.length === 0)
    return {
      success: !1,
      message: `Plugin "${pluginName}" is not installed`,
      pluginId,
      scope
    };
  let projectPath = getProjectPathForScope(scope), installation = installations.find((inst) => inst.scope === scope && inst.projectPath === projectPath);
  if (!installation) {
    let scopeDesc = projectPath ? `${scope} (${projectPath})` : scope;
    return {
      success: !1,
      message: `Plugin "${pluginName}" is not installed at scope ${scopeDesc}`,
      pluginId,
      scope
    };
  }
  return performPluginUpdate({
    pluginId,
    pluginName,
    entry,
    marketplaceInstallLocation,
    installation,
    scope,
    projectPath
  });
}
async function performPluginUpdate({
  pluginId,
  pluginName,
  entry,
  marketplaceInstallLocation,
  installation,
  scope,
  projectPath
}) {
  let fs17 = getFsImplementation(), oldVersion = installation.version, sourcePath, newVersion, shouldCleanupSource = !1, gitCommitSha;
  if (typeof entry.source !== "string") {
    let cacheResult = await cachePlugin(entry.source, {
      manifest: { name: entry.name }
    });
    sourcePath = cacheResult.path, shouldCleanupSource = !0, gitCommitSha = cacheResult.gitCommitSha, newVersion = await calculatePluginVersion(pluginId, entry.source, cacheResult.manifest, cacheResult.path, entry.version, cacheResult.gitCommitSha);
  } else {
    let marketplaceStats;
    try {
      marketplaceStats = await fs17.stat(marketplaceInstallLocation);
    } catch (e) {
      if (isENOENT(e))
        return {
          success: !1,
          message: `Marketplace directory not found at ${marketplaceInstallLocation}`,
          pluginId,
          scope
        };
      throw e;
    }
    let marketplaceDir = marketplaceStats.isDirectory() ? marketplaceInstallLocation : dirname53(marketplaceInstallLocation);
    sourcePath = join117(marketplaceDir, entry.source);
    try {
      await fs17.stat(sourcePath);
    } catch (e) {
      if (isENOENT(e))
        return {
          success: !1,
          message: `Plugin source not found at ${sourcePath}`,
          pluginId,
          scope
        };
      throw e;
    }
    let pluginManifest, manifestPath = join117(sourcePath, ".claude-plugin", "plugin.json");
    try {
      pluginManifest = await loadPluginManifest(manifestPath, entry.name, entry.source);
    } catch {}
    newVersion = await calculatePluginVersion(pluginId, entry.source, pluginManifest, sourcePath, entry.version);
  }
  try {
    let versionedPath = getVersionedCachePath(pluginId, newVersion), zipPath = getVersionedZipCachePath(pluginId, newVersion);
    if (installation.version === newVersion || installation.installPath === versionedPath || installation.installPath === zipPath)
      return {
        success: !0,
        message: `${pluginName} is already at the latest version (${newVersion}).`,
        pluginId,
        newVersion,
        oldVersion,
        alreadyUpToDate: !0,
        scope
      };
    versionedPath = await copyPluginToVersionedCache(sourcePath, pluginId, newVersion, entry);
    let oldVersionPath = installation.installPath;
    if (updateInstallationPathOnDisk(pluginId, scope, projectPath, versionedPath, newVersion, gitCommitSha), oldVersionPath && oldVersionPath !== versionedPath) {
      let updatedDiskData = loadInstalledPluginsFromDisk();
      if (!Object.values(updatedDiskData.plugins).some((pluginInstallations) => pluginInstallations.some((inst) => inst.installPath === oldVersionPath)))
        await markPluginVersionOrphaned(oldVersionPath);
    }
    let scopeDesc = projectPath ? `${scope} (${projectPath})` : scope;
    return {
      success: !0,
      message: `Plugin "${pluginName}" updated from ${oldVersion || "unknown"} to ${newVersion} for scope ${scopeDesc}. Restart to apply changes.`,
      pluginId,
      newVersion,
      oldVersion,
      scope
    };
  } finally {
    if (shouldCleanupSource && sourcePath !== getVersionedCachePath(pluginId, newVersion))
      await fs17.rm(sourcePath, { recursive: !0, force: !0 });
  }
}
var VALID_INSTALLABLE_SCOPES, VALID_UPDATE_SCOPES;
var init_pluginOperations = __esm(() => {
  init_state();
  init_builtinPlugins();
  init_errors();
  init_fsOperations();
  init_log3();
  init_cacheUtils();
  init_dependencyResolver();
  init_installedPluginsManager();
  init_marketplaceManager();
  init_pluginDirectories();
  init_pluginIdentifier();
  init_pluginInstallationHelpers();
  init_pluginLoader();
  init_pluginOptionsStorage();
  init_pluginPolicy();
  init_pluginStartupCheck();
  init_pluginVersioning();
  init_settings2();
  VALID_INSTALLABLE_SCOPES = ["user", "project", "local"], VALID_UPDATE_SCOPES = [
    "user",
    "project",
    "local",
    "managed"
  ];
});
