// function: loadPluginFromMarketplaceEntry
async function loadPluginFromMarketplaceEntry(entry, marketplaceInstallLocation, pluginId, enabled2, errorsOut, installedVersion) {
  logForDebugging(`Loading plugin ${entry.name} from source: ${jsonStringify(entry.source)}`);
  let pluginPath;
  if (typeof entry.source === "string") {
    let marketplaceDir = (await stat32(marketplaceInstallLocation)).isDirectory() ? marketplaceInstallLocation : join100(marketplaceInstallLocation, ".."), sourcePluginPath = join100(marketplaceDir, entry.source);
    if (!await pathExists(sourcePluginPath)) {
      let error44 = Error(`Plugin path not found: ${sourcePluginPath}`);
      return logForDebugging(`Plugin path not found: ${sourcePluginPath}`, {
        level: "error"
      }), logError2(error44), errorsOut.push({
        type: "generic-error",
        source: pluginId,
        error: `Plugin directory not found at path: ${sourcePluginPath}. Check that the marketplace entry has the correct path.`
      }), null;
    }
    try {
      let manifestPath = join100(sourcePluginPath, ".claude-plugin", "plugin.json"), pluginManifest;
      try {
        pluginManifest = await loadPluginManifest(manifestPath, entry.name, entry.source);
      } catch {}
      let version5 = await calculatePluginVersion(pluginId, entry.source, pluginManifest, marketplaceDir, entry.version);
      pluginPath = await copyPluginToVersionedCache(sourcePluginPath, pluginId, version5, entry, marketplaceDir), logForDebugging(`Resolved local plugin ${entry.name} to versioned cache: ${pluginPath}`);
    } catch (error44) {
      let errorMsg = errorMessage(error44);
      logForDebugging(`Failed to copy plugin ${entry.name} to versioned cache: ${errorMsg}. Using marketplace path.`, { level: "warn" }), pluginPath = sourcePluginPath;
    }
  } else
    try {
      let version5 = await calculatePluginVersion(pluginId, entry.source, void 0, void 0, installedVersion ?? entry.version, "sha" in entry.source ? entry.source.sha : void 0), versionedPath = getVersionedCachePath(pluginId, version5), zipPath = getVersionedZipCachePath(pluginId, version5);
      if (isPluginZipCacheEnabled() && await pathExists(zipPath))
        logForDebugging(`Using versioned cached plugin ZIP ${entry.name} from ${zipPath}`), pluginPath = zipPath;
      else if (await pathExists(versionedPath))
        logForDebugging(`Using versioned cached plugin ${entry.name} from ${versionedPath}`), pluginPath = versionedPath;
      else {
        let seedPath = await probeSeedCache(pluginId, version5) ?? (version5 === "unknown" ? await probeSeedCacheAnyVersion(pluginId) : null);
        if (seedPath)
          pluginPath = seedPath, logForDebugging(`Using seed cache for external plugin ${entry.name} at ${seedPath}`);
        else {
          let cached3 = await cachePlugin(entry.source, {
            manifest: { name: entry.name }
          }), actualVersion = version5 !== "unknown" ? version5 : await calculatePluginVersion(pluginId, entry.source, cached3.manifest, cached3.path, installedVersion ?? entry.version, cached3.gitCommitSha);
          if (pluginPath = await copyPluginToVersionedCache(cached3.path, pluginId, actualVersion, entry, void 0), cached3.path !== pluginPath)
            await rm11(cached3.path, { recursive: !0, force: !0 });
        }
      }
    } catch (error44) {
      let errorMsg = errorMessage(error44);
      return logForDebugging(`Failed to cache plugin ${entry.name}: ${errorMsg}`, {
        level: "error"
      }), logError2(toError(error44)), errorsOut.push({
        type: "generic-error",
        source: pluginId,
        error: `Failed to download/cache plugin ${entry.name}: ${errorMsg}`
      }), null;
    }
  if (isPluginZipCacheEnabled() && pluginPath.endsWith(".zip")) {
    let sessionDir = await getSessionPluginCachePath(), extractDir = join100(sessionDir, pluginId.replace(/[^a-zA-Z0-9@\-_]/g, "-"));
    try {
      await extractZipToDirectory(pluginPath, extractDir), logForDebugging(`Extracted plugin ZIP to session dir: ${extractDir}`), pluginPath = extractDir;
    } catch (error44) {
      throw logForDebugging(`Failed to extract plugin ZIP ${pluginPath}, deleting corrupt file: ${error44}`), await rm11(pluginPath, { force: !0 }).catch(() => {}), error44;
    }
  }
  return finishLoadingPluginFromPath(entry, pluginId, enabled2, errorsOut, pluginPath);
}
