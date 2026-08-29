// Original: src/utils/plugins/installedPluginsManager.ts
import { dirname as dirname44, join as join98 } from "path";
function getInstalledPluginsFilePath() {
  return join98(getPluginsDirectory(), "installed_plugins.json");
}
function getInstalledPluginsV2FilePath() {
  return join98(getPluginsDirectory(), "installed_plugins_v2.json");
}
function migrateToSinglePluginFile() {
  if (migrationCompleted)
    return;
  let fs17 = getFsImplementation(), mainFilePath = getInstalledPluginsFilePath(), v2FilePath = getInstalledPluginsV2FilePath();
  try {
    try {
      fs17.renameSync(v2FilePath, mainFilePath), logForDebugging("Renamed installed_plugins_v2.json to installed_plugins.json");
      let v2Data = loadInstalledPluginsV2();
      cleanupLegacyCache(v2Data), migrationCompleted = !0;
      return;
    } catch (e) {
      if (!isENOENT(e))
        throw e;
    }
    let mainContent;
    try {
      mainContent = fs17.readFileSync(mainFilePath, { encoding: "utf-8" });
    } catch (e) {
      if (!isENOENT(e))
        throw e;
      migrationCompleted = !0;
      return;
    }
    let mainData = jsonParse(mainContent);
    if ((typeof mainData?.version === "number" ? mainData.version : 1) === 1) {
      let v1Data = InstalledPluginsFileSchemaV1().parse(mainData), v2Data = migrateV1ToV2(v1Data);
      writeFileSync_DEPRECATED(mainFilePath, jsonStringify(v2Data, null, 2), {
        encoding: "utf-8",
        flush: !0
      }), logForDebugging(`Converted installed_plugins.json from V1 to V2 format (${Object.keys(v1Data.plugins).length} plugins)`), cleanupLegacyCache(v2Data);
    }
    migrationCompleted = !0;
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    logForDebugging(`Failed to migrate plugin files: ${errorMsg}`, {
      level: "error"
    }), logError2(toError(error44)), migrationCompleted = !0;
  }
}
function cleanupLegacyCache(v2Data) {
  let fs17 = getFsImplementation(), cachePath = getPluginCachePath();
  try {
    let referencedPaths = /* @__PURE__ */ new Set;
    for (let installations of Object.values(v2Data.plugins))
      for (let entry of installations)
        referencedPaths.add(entry.installPath);
    let entries2 = fs17.readdirSync(cachePath);
    for (let dirent of entries2) {
      if (!dirent.isDirectory())
        continue;
      let entry = dirent.name, entryPath = join98(cachePath, entry);
      if (fs17.readdirSync(entryPath).some((subDirent) => {
        if (!subDirent.isDirectory())
          return !1;
        let subPath = join98(entryPath, subDirent.name);
        return fs17.readdirSync(subPath).some((vDirent) => vDirent.isDirectory());
      }))
        continue;
      if (!referencedPaths.has(entryPath))
        fs17.rmSync(entryPath, { recursive: !0, force: !0 }), logForDebugging(`Cleaned up legacy cache directory: ${entry}`);
    }
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    logForDebugging(`Failed to clean up legacy cache: ${errorMsg}`, {
      level: "warn"
    });
  }
}
function readInstalledPluginsFileRaw() {
  let fs17 = getFsImplementation(), filePath = getInstalledPluginsFilePath(), fileContent;
  try {
    fileContent = fs17.readFileSync(filePath, { encoding: "utf-8" });
  } catch (e) {
    if (isENOENT(e))
      return null;
    throw e;
  }
  let data = jsonParse(fileContent);
  return { version: typeof data?.version === "number" ? data.version : 1, data };
}
function migrateV1ToV2(v1Data) {
  let v2Plugins = {};
  for (let [pluginId, plugin] of Object.entries(v1Data.plugins)) {
    let versionedCachePath = getVersionedCachePath(pluginId, plugin.version);
    v2Plugins[pluginId] = [
      {
        scope: "user",
        installPath: versionedCachePath,
        version: plugin.version,
        installedAt: plugin.installedAt,
        lastUpdated: plugin.lastUpdated,
        gitCommitSha: plugin.gitCommitSha
      }
    ];
  }
  return { version: 2, plugins: v2Plugins };
}
function loadInstalledPluginsV2() {
  if (installedPluginsCacheV2 !== null)
    return installedPluginsCacheV2;
  let filePath = getInstalledPluginsFilePath();
  try {
    let rawData = readInstalledPluginsFileRaw();
    if (rawData) {
      if (rawData.version === 2) {
        let validated = InstalledPluginsFileSchemaV2().parse(rawData.data);
        return installedPluginsCacheV2 = validated, logForDebugging(`Loaded ${Object.keys(validated.plugins).length} installed plugins from ${filePath}`), validated;
      }
      let v1Validated = InstalledPluginsFileSchemaV1().parse(rawData.data), v2Data = migrateV1ToV2(v1Validated);
      return installedPluginsCacheV2 = v2Data, logForDebugging(`Loaded and converted ${Object.keys(v1Validated.plugins).length} plugins from V1 format`), v2Data;
    }
    return logForDebugging("installed_plugins.json doesn't exist, returning empty V2 object"), installedPluginsCacheV2 = { version: 2, plugins: {} }, installedPluginsCacheV2;
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    return logForDebugging(`Failed to load installed_plugins.json: ${errorMsg}. Starting with empty state.`, { level: "error" }), logError2(toError(error44)), installedPluginsCacheV2 = { version: 2, plugins: {} }, installedPluginsCacheV2;
  }
}
function saveInstalledPluginsV2(data) {
  let fs17 = getFsImplementation(), filePath = getInstalledPluginsFilePath();
  try {
    fs17.mkdirSync(getPluginsDirectory());
    let jsonContent = jsonStringify(data, null, 2);
    writeFileSync_DEPRECATED(filePath, jsonContent, {
      encoding: "utf-8",
      flush: !0
    }), installedPluginsCacheV2 = data, logForDebugging(`Saved ${Object.keys(data.plugins).length} installed plugins to ${filePath}`);
  } catch (error44) {
    let _errorMsg = errorMessage(error44);
    throw logError2(toError(error44)), error44;
  }
}
function removePluginInstallation(pluginId, scope, projectPath) {
  let data = loadInstalledPluginsFromDisk(), installations = data.plugins[pluginId];
  if (!installations)
    return;
  if (data.plugins[pluginId] = installations.filter((entry) => !(entry.scope === scope && entry.projectPath === projectPath)), data.plugins[pluginId].length === 0)
    delete data.plugins[pluginId];
  saveInstalledPluginsV2(data), logForDebugging(`Removed installation for ${pluginId} at scope ${scope}`);
}
function getInMemoryInstalledPlugins() {
  if (inMemoryInstalledPlugins === null)
    inMemoryInstalledPlugins = loadInstalledPluginsV2();
  return inMemoryInstalledPlugins;
}
function loadInstalledPluginsFromDisk() {
  try {
    let rawData = readInstalledPluginsFileRaw();
    if (rawData) {
      if (rawData.version === 2)
        return InstalledPluginsFileSchemaV2().parse(rawData.data);
      let v1Data = InstalledPluginsFileSchemaV1().parse(rawData.data);
      return migrateV1ToV2(v1Data);
    }
    return { version: 2, plugins: {} };
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    return logForDebugging(`Failed to load installed plugins from disk: ${errorMsg}`, {
      level: "error"
    }), { version: 2, plugins: {} };
  }
}
function updateInstallationPathOnDisk(pluginId, scope, projectPath, newPath, newVersion, gitCommitSha) {
  let diskData = loadInstalledPluginsFromDisk(), installations = diskData.plugins[pluginId];
  if (!installations) {
    logForDebugging(`Cannot update ${pluginId} on disk: plugin not found in installed plugins`);
    return;
  }
  let entry = installations.find((e) => e.scope === scope && e.projectPath === projectPath);
  if (entry) {
    if (entry.installPath = newPath, entry.version = newVersion, entry.lastUpdated = (/* @__PURE__ */ new Date()).toISOString(), gitCommitSha !== void 0)
      entry.gitCommitSha = gitCommitSha;
    let filePath = getInstalledPluginsFilePath();
    writeFileSync_DEPRECATED(filePath, jsonStringify(diskData, null, 2), {
      encoding: "utf-8",
      flush: !0
    }), installedPluginsCacheV2 = null, logForDebugging(`Updated ${pluginId} on disk to version ${newVersion} at ${newPath}`);
  } else
    logForDebugging(`Cannot update ${pluginId} on disk: no installation for scope ${scope}`);
}
async function initializeVersionedPlugins() {
  migrateToSinglePluginFile();
  try {
    await migrateFromEnabledPlugins();
  } catch (error44) {
    logError2(error44);
  }
  let data = getInMemoryInstalledPlugins();
  logForDebugging(`Initialized versioned plugins system with ${Object.keys(data.plugins).length} plugins`);
}
function removeAllPluginsForMarketplace(marketplaceName) {
  if (!marketplaceName)
    return { orphanedPaths: [], removedPluginIds: [] };
  let data = loadInstalledPluginsFromDisk(), suffix = `@${marketplaceName}`, orphanedPaths = /* @__PURE__ */ new Set, removedPluginIds = [];
  for (let pluginId of Object.keys(data.plugins)) {
    if (!pluginId.endsWith(suffix))
      continue;
    for (let entry of data.plugins[pluginId] ?? [])
      if (entry.installPath)
        orphanedPaths.add(entry.installPath);
    delete data.plugins[pluginId], removedPluginIds.push(pluginId), logForDebugging(`Removed installed plugin for marketplace removal: ${pluginId}`);
  }
  if (removedPluginIds.length > 0)
    saveInstalledPluginsV2(data);
  return { orphanedPaths: Array.from(orphanedPaths), removedPluginIds };
}
function isInstallationRelevantToCurrentProject(inst) {
  return inst.scope === "user" || inst.scope === "managed" || inst.projectPath === getOriginalCwd();
}
function isPluginInstalled(pluginId) {
  let installations = loadInstalledPluginsV2().plugins[pluginId];
  if (!installations || installations.length === 0)
    return !1;
  if (!installations.some(isInstallationRelevantToCurrentProject))
    return !1;
  return getSettings_DEPRECATED().enabledPlugins?.[pluginId] !== void 0;
}
function isPluginGloballyInstalled(pluginId) {
  let installations = loadInstalledPluginsV2().plugins[pluginId];
  if (!installations || installations.length === 0)
    return !1;
  if (!installations.some((entry) => entry.scope === "user" || entry.scope === "managed"))
    return !1;
  return getSettings_DEPRECATED().enabledPlugins?.[pluginId] !== void 0;
}
function addInstalledPlugin(pluginId, metadata, scope = "user", projectPath) {
  let v2Data = loadInstalledPluginsFromDisk(), v2Entry = {
    scope,
    installPath: metadata.installPath,
    version: metadata.version,
    installedAt: metadata.installedAt,
    lastUpdated: metadata.lastUpdated,
    gitCommitSha: metadata.gitCommitSha,
    ...projectPath && { projectPath }
  }, installations = v2Data.plugins[pluginId] || [], existingIndex = installations.findIndex((entry) => entry.scope === scope && entry.projectPath === projectPath), isUpdate = existingIndex >= 0;
  if (isUpdate)
    installations[existingIndex] = v2Entry;
  else
    installations.push(v2Entry);
  v2Data.plugins[pluginId] = installations, saveInstalledPluginsV2(v2Data), logForDebugging(`${isUpdate ? "Updated" : "Added"} installed plugin: ${pluginId} (scope: ${scope})`);
}
async function getGitCommitSha(dirPath) {
  return await getHeadForDir(dirPath) ?? void 0;
}
function getPluginVersionFromManifest(pluginCachePath, pluginId) {
  let fs17 = getFsImplementation(), manifestPath = join98(pluginCachePath, ".claude-plugin", "plugin.json");
  try {
    let manifestContent = fs17.readFileSync(manifestPath, { encoding: "utf-8" });
    return jsonParse(manifestContent).version || "unknown";
  } catch {
    return logForDebugging(`Could not read version from manifest for ${pluginId}`), "unknown";
  }
}
async function migrateFromEnabledPlugins() {
  let enabledPlugins = getSettings_DEPRECATED().enabledPlugins || {};
  if (Object.keys(enabledPlugins).length === 0)
    return;
  let rawFileData = readInstalledPluginsFileRaw(), fileExists = rawFileData !== null;
  if (fileExists && rawFileData?.version === 2 && rawFileData) {
    let existingData = InstalledPluginsFileSchemaV2().safeParse(rawFileData.data);
    if (existingData?.success) {
      let plugins = existingData.data.plugins;
      if (Object.keys(enabledPlugins).filter((id) => id.includes("@")).every((id) => {
        let installations = plugins[id];
        return installations && installations.length > 0;
      })) {
        logForDebugging("All plugins already exist, skipping migration");
        return;
      }
    }
  }
  logForDebugging(fileExists ? "Syncing installed_plugins.json with enabledPlugins from all settings.json files" : "Creating installed_plugins.json from settings.json files");
  let now2 = (/* @__PURE__ */ new Date()).toISOString(), projectPath = getCwd(), pluginScopeFromSettings = /* @__PURE__ */ new Map, settingSources = [
    "userSettings",
    "projectSettings",
    "localSettings"
  ];
  for (let source of settingSources) {
    let sourceEnabledPlugins = getSettingsForSource(source)?.enabledPlugins || {};
    for (let pluginId of Object.keys(sourceEnabledPlugins)) {
      if (!pluginId.includes("@"))
        continue;
      let scope = settingSourceToScope(source);
      pluginScopeFromSettings.set(pluginId, {
        scope,
        projectPath: scope === "user" ? void 0 : projectPath
      });
    }
  }
  let v2Plugins = {};
  if (fileExists)
    v2Plugins = { ...loadInstalledPluginsV2().plugins };
  let updatedCount = 0, addedCount = 0;
  for (let [pluginId, scopeInfo] of pluginScopeFromSettings) {
    let existingInstallations = v2Plugins[pluginId];
    if (existingInstallations && existingInstallations.length > 0) {
      let existingEntry = existingInstallations[0];
      if (existingEntry && (existingEntry.scope !== scopeInfo.scope || existingEntry.projectPath !== scopeInfo.projectPath)) {
        if (existingEntry.scope = scopeInfo.scope, scopeInfo.projectPath)
          existingEntry.projectPath = scopeInfo.projectPath;
        else
          delete existingEntry.projectPath;
        existingEntry.lastUpdated = now2, updatedCount++, logForDebugging(`Updated ${pluginId} scope to ${scopeInfo.scope} (settings.json is source of truth)`);
      }
    } else {
      let { name: pluginName, marketplace } = parsePluginIdentifier(pluginId);
      if (!pluginName || !marketplace)
        continue;
      try {
        logForDebugging(`Looking up plugin ${pluginId} in marketplace ${marketplace}`);
        let pluginInfo = await getPluginById(pluginId);
        if (!pluginInfo) {
          logForDebugging(`Plugin ${pluginId} not found in any marketplace, skipping`);
          continue;
        }
        let { entry, marketplaceInstallLocation } = pluginInfo, installPath, version5 = "unknown", gitCommitSha = void 0;
        if (typeof entry.source === "string")
          installPath = join98(marketplaceInstallLocation, entry.source), version5 = getPluginVersionFromManifest(installPath, pluginId), gitCommitSha = await getGitCommitSha(installPath);
        else {
          let cachePath = getPluginCachePath(), sanitizedName = pluginName.replace(/[^a-zA-Z0-9-_]/g, "-"), pluginCachePath = join98(cachePath, sanitizedName), dirEntries;
          try {
            dirEntries = (await getFsImplementation().readdir(pluginCachePath)).map((e) => typeof e === "string" ? e : e.name);
          } catch (e) {
            if (!isENOENT(e))
              throw e;
            logForDebugging(`External plugin ${pluginId} not in cache, skipping`);
            continue;
          }
          if (installPath = pluginCachePath, dirEntries.includes(".claude-plugin"))
            version5 = getPluginVersionFromManifest(pluginCachePath, pluginId);
          gitCommitSha = await getGitCommitSha(pluginCachePath);
        }
        if (version5 === "unknown" && entry.version)
          version5 = entry.version;
        if (version5 === "unknown" && gitCommitSha)
          version5 = gitCommitSha.substring(0, 12);
        v2Plugins[pluginId] = [
          {
            scope: scopeInfo.scope,
            installPath: getVersionedCachePath(pluginId, version5),
            version: version5,
            installedAt: now2,
            lastUpdated: now2,
            gitCommitSha,
            ...scopeInfo.projectPath && {
              projectPath: scopeInfo.projectPath
            }
          }
        ], addedCount++, logForDebugging(`Added ${pluginId} with scope ${scopeInfo.scope}`);
      } catch (error44) {
        logForDebugging(`Failed to add plugin ${pluginId}: ${error44}`);
      }
    }
  }
  if (!fileExists || updatedCount > 0 || addedCount > 0)
    saveInstalledPluginsV2({ version: 2, plugins: v2Plugins }), logForDebugging(`Sync completed: ${addedCount} added, ${updatedCount} updated in installed_plugins.json`);
}
var migrationCompleted = !1, installedPluginsCacheV2 = null, inMemoryInstalledPlugins = null;
var init_installedPluginsManager = __esm(() => {
  init_debug();
  init_errors();
  init_fsOperations();
  init_log3();
  init_slowOperations();
  init_pluginDirectories();
  init_schemas3();
  init_state();
  init_cwd2();
  init_gitFilesystem();
  init_settings2();
  init_marketplaceManager();
  init_pluginIdentifier();
  init_pluginLoader();
});
