// function: loadPluginFromMarketplaceEntryCacheOnly
async function loadPluginFromMarketplaceEntryCacheOnly(entry, marketplaceInstallLocation, pluginId, enabled2, errorsOut, installPath) {
  let pluginPath;
  if (typeof entry.source === "string") {
    let marketplaceDir;
    try {
      marketplaceDir = (await stat32(marketplaceInstallLocation)).isDirectory() ? marketplaceInstallLocation : join100(marketplaceInstallLocation, "..");
    } catch {
      return errorsOut.push({
        type: "plugin-cache-miss",
        source: pluginId,
        plugin: entry.name,
        installPath: marketplaceInstallLocation
      }), null;
    }
    pluginPath = join100(marketplaceDir, entry.source);
  } else {
    if (!installPath || !await pathExists(installPath))
      return errorsOut.push({
        type: "plugin-cache-miss",
        source: pluginId,
        plugin: entry.name,
        installPath: installPath ?? "(not recorded)"
      }), null;
    pluginPath = installPath;
  }
  if (isPluginZipCacheEnabled() && pluginPath.endsWith(".zip")) {
    let sessionDir = await getSessionPluginCachePath(), extractDir = join100(sessionDir, pluginId.replace(/[^a-zA-Z0-9@\-_]/g, "-"));
    try {
      await extractZipToDirectory(pluginPath, extractDir), pluginPath = extractDir;
    } catch (error44) {
      return logForDebugging(`Failed to extract plugin ZIP ${pluginPath}: ${error44}`, {
        level: "error"
      }), errorsOut.push({
        type: "plugin-cache-miss",
        source: pluginId,
        plugin: entry.name,
        installPath: pluginPath
      }), null;
    }
  }
  return finishLoadingPluginFromPath(entry, pluginId, enabled2, errorsOut, pluginPath);
}
