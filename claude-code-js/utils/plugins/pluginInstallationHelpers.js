// Original: src/utils/plugins/pluginInstallationHelpers.ts
import { randomBytes as randomBytes13 } from "crypto";
import { rename as rename5, rm as rm10 } from "fs/promises";
import { dirname as dirname45, join as join99, resolve as resolve38, sep as sep22 } from "path";
function getCurrentTimestamp() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function validatePathWithinBase(basePath, relativePath) {
  let resolvedPath5 = resolve38(basePath, relativePath), normalizedBase = resolve38(basePath) + sep22;
  if (!resolvedPath5.startsWith(normalizedBase) && resolvedPath5 !== resolve38(basePath))
    throw Error(`Path traversal detected: "${relativePath}" would escape the base directory`);
  return resolvedPath5;
}
async function cacheAndRegisterPlugin(pluginId, entry, scope = "user", projectPath, localSourcePath) {
  let source = typeof entry.source === "string" && localSourcePath ? localSourcePath : entry.source, cacheResult = await cachePlugin(source, {
    manifest: entry
  }), pathForGitSha = localSourcePath || cacheResult.path, gitCommitSha = cacheResult.gitCommitSha ?? await getGitCommitSha(pathForGitSha), now2 = getCurrentTimestamp(), version5 = await calculatePluginVersion(pluginId, entry.source, cacheResult.manifest, pathForGitSha, entry.version, cacheResult.gitCommitSha), versionedPath = getVersionedCachePath(pluginId, version5), finalPath = cacheResult.path;
  if (cacheResult.path !== versionedPath) {
    await getFsImplementation().mkdir(dirname45(versionedPath)), await rm10(versionedPath, { recursive: !0, force: !0 });
    let normalizedCachePath = cacheResult.path.endsWith(sep22) ? cacheResult.path : cacheResult.path + sep22;
    if (versionedPath.startsWith(normalizedCachePath)) {
      let tempPath = join99(dirname45(cacheResult.path), `.claude-plugin-temp-${Date.now()}-${randomBytes13(4).toString("hex")}`);
      await rename5(cacheResult.path, tempPath), await getFsImplementation().mkdir(dirname45(versionedPath)), await rename5(tempPath, versionedPath);
    } else
      await rename5(cacheResult.path, versionedPath);
    finalPath = versionedPath;
  }
  if (isPluginZipCacheEnabled()) {
    let zipPath = getVersionedZipCachePath(pluginId, version5);
    await convertDirectoryToZipInPlace(finalPath, zipPath), finalPath = zipPath;
  }
  return addInstalledPlugin(pluginId, {
    version: version5,
    installedAt: now2,
    lastUpdated: now2,
    installPath: finalPath,
    gitCommitSha
  }, scope, projectPath), finalPath;
}
function registerPluginInstallation(info, scope = "user", projectPath) {
  let now2 = getCurrentTimestamp();
  addInstalledPlugin(info.pluginId, {
    version: info.version || "unknown",
    installedAt: now2,
    lastUpdated: now2,
    installPath: info.installPath
  }, scope, projectPath);
}
function formatResolutionError(r4) {
  switch (r4.reason) {
    case "cycle":
      return `Dependency cycle: ${r4.chain.join(" \u2192 ")}`;
    case "cross-marketplace": {
      let depMkt = parsePluginIdentifier(r4.dependency).marketplace, where = depMkt ? `marketplace "${depMkt}"` : "a different marketplace", hint = depMkt ? ` Add "${depMkt}" to allowCrossMarketplaceDependenciesOn in the ROOT marketplace's marketplace.json (the marketplace of the plugin you're installing \u2014 only its allowlist applies; no transitive trust).` : "";
      return `Dependency "${r4.dependency}" (required by ${r4.requiredBy}) is in ${where}, which is not in the allowlist \u2014 cross-marketplace dependencies are blocked by default. Install it manually first.${hint}`;
    }
    case "not-found": {
      let { marketplace: depMkt } = parsePluginIdentifier(r4.missing);
      return depMkt ? `Dependency "${r4.missing}" (required by ${r4.requiredBy}) not found. Is the "${depMkt}" marketplace added?` : `Dependency "${r4.missing}" (required by ${r4.requiredBy}) not found in any configured marketplace`;
    }
  }
}
async function installResolvedPlugin({
  pluginId,
  entry,
  scope,
  marketplaceInstallLocation
}) {
  let settingSource = scopeToSettingSource(scope);
  if (isPluginBlockedByPolicy(pluginId))
    return { ok: !1, reason: "blocked-by-policy", pluginName: entry.name };
  let depInfo = /* @__PURE__ */ new Map;
  if (isLocalPluginSource(entry.source) && !marketplaceInstallLocation)
    return {
      ok: !1,
      reason: "local-source-no-location",
      pluginName: entry.name
    };
  if (marketplaceInstallLocation)
    depInfo.set(pluginId, { entry, marketplaceInstallLocation });
  let rootMarketplace = parsePluginIdentifier(pluginId).marketplace, allowedCrossMarketplaces = new Set((rootMarketplace ? (await getMarketplaceCacheOnly(rootMarketplace))?.allowCrossMarketplaceDependenciesOn : void 0) ?? []), resolution = await resolveDependencyClosure(pluginId, async (id) => {
    if (depInfo.has(id))
      return depInfo.get(id).entry;
    if (id === pluginId)
      return entry;
    let info = await getPluginById(id);
    if (info)
      depInfo.set(id, info);
    return info?.entry ?? null;
  }, getEnabledPluginIdsForScope(settingSource), allowedCrossMarketplaces);
  if (!resolution.ok)
    return { ok: !1, reason: "resolution-failed", resolution };
  for (let id of resolution.closure)
    if (id !== pluginId && isPluginBlockedByPolicy(id))
      return {
        ok: !1,
        reason: "dependency-blocked-by-policy",
        pluginName: entry.name,
        blockedDependency: id
      };
  let closureEnabled = {};
  for (let id of resolution.closure)
    closureEnabled[id] = !0;
  let { error: error44 } = updateSettingsForSource(settingSource, {
    enabledPlugins: {
      ...getSettingsForSource(settingSource)?.enabledPlugins,
      ...closureEnabled
    }
  });
  if (error44)
    return {
      ok: !1,
      reason: "settings-write-failed",
      message: error44.message
    };
  let projectPath = scope !== "user" ? getCwd() : void 0;
  for (let id of resolution.closure) {
    let info = depInfo.get(id);
    if (!info && id === pluginId) {
      let mktLocation = (await getPluginById(id))?.marketplaceInstallLocation;
      if (mktLocation)
        info = { entry, marketplaceInstallLocation: mktLocation };
    }
    if (!info)
      continue;
    let localSourcePath, { source } = info.entry;
    if (isLocalPluginSource(source))
      localSourcePath = validatePathWithinBase(info.marketplaceInstallLocation, source);
    await cacheAndRegisterPlugin(id, info.entry, scope, projectPath, localSourcePath);
  }
  clearAllCaches();
  let depNote = formatDependencyCountSuffix(resolution.closure.filter((id) => id !== pluginId));
  return { ok: !0, closure: resolution.closure, depNote };
}
async function installPluginFromMarketplace({
  pluginId,
  entry,
  marketplaceName,
  scope = "user",
  trigger = "user"
}) {
  try {
    let marketplaceInstallLocation = (await getPluginById(pluginId))?.marketplaceInstallLocation, result = await installResolvedPlugin({
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
            error: `Cannot install local plugin "${result.pluginName}" without marketplace install location`
          };
        case "settings-write-failed":
          return {
            success: !1,
            error: `Failed to update settings: ${result.message}`
          };
        case "resolution-failed":
          return {
            success: !1,
            error: formatResolutionError(result.resolution)
          };
        case "blocked-by-policy":
          return {
            success: !1,
            error: `Plugin "${result.pluginName}" is blocked by your organization's policy and cannot be installed`
          };
        case "dependency-blocked-by-policy":
          return {
            success: !1,
            error: `Cannot install "${result.pluginName}": dependency "${result.blockedDependency}" is blocked by your organization's policy`
          };
      }
    return logEvent("tengu_plugin_installed", {
      _PROTO_plugin_name: entry.name,
      _PROTO_marketplace_name: marketplaceName,
      plugin_id: isOfficialMarketplaceName(marketplaceName) ? pluginId : "third-party",
      trigger,
      install_source: trigger === "hint" ? "ui-suggestion" : "ui-discover",
      ...buildPluginTelemetryFields(entry.name, marketplaceName, getManagedPluginNames()),
      ...entry.version && {
        version: entry.version
      }
    }), {
      success: !0,
      message: `\u2713 Installed ${entry.name}${result.depNote}. Run /reload-plugins to activate.`
    };
  } catch (err2) {
    let errorMessage3 = err2 instanceof Error ? err2.message : String(err2);
    return logError2(toError(err2)), { success: !1, error: `Failed to install: ${errorMessage3}` };
  }
}
var init_pluginInstallationHelpers = __esm(() => {
  init_cwd2();
  init_errors();
  init_fsOperations();
  init_log3();
  init_settings2();
  init_pluginTelemetry();
  init_cacheUtils();
  init_dependencyResolver();
  init_installedPluginsManager();
  init_managedPlugins();
  init_marketplaceManager();
  init_pluginIdentifier();
  init_pluginLoader();
  init_pluginPolicy();
  init_pluginVersioning();
  init_schemas3();
  init_zipCache();
});
