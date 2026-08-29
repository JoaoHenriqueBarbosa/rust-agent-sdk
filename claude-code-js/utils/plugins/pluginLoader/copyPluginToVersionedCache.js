// function: copyPluginToVersionedCache
async function copyPluginToVersionedCache(sourcePath, pluginId, version5, entry, marketplaceDir) {
  let zipCacheMode = isPluginZipCacheEnabled(), cachePath = getVersionedCachePath(pluginId, version5), zipPath = getVersionedZipCachePath(pluginId, version5);
  if (zipCacheMode) {
    if (await pathExists(zipPath))
      return logForDebugging(`Plugin ${pluginId} version ${version5} already cached at ${zipPath}`), zipPath;
  } else if (await pathExists(cachePath)) {
    if ((await readdir18(cachePath)).length > 0)
      return logForDebugging(`Plugin ${pluginId} version ${version5} already cached at ${cachePath}`), cachePath;
    logForDebugging(`Removing empty cache directory for ${pluginId} at ${cachePath}`), await rmdir2(cachePath);
  }
  let seedPath = await probeSeedCache(pluginId, version5);
  if (seedPath)
    return logForDebugging(`Using seed cache for ${pluginId}@${version5} at ${seedPath}`), seedPath;
  if (await getFsImplementation().mkdir(dirname46(cachePath)), entry && typeof entry.source === "string" && marketplaceDir) {
    let sourceDir = validatePathWithinBase(marketplaceDir, entry.source);
    logForDebugging(`Copying source directory ${entry.source} for plugin ${pluginId}`);
    try {
      await copyDir(sourceDir, cachePath);
    } catch (e) {
      if (isENOENT(e) && getErrnoPath(e) === sourceDir)
        throw Error(`Plugin source directory not found: ${sourceDir} (from entry.source: ${entry.source})`);
      throw e;
    }
  } else
    logForDebugging(`Copying plugin ${pluginId} to versioned cache (fallback to full copy)`), await copyDir(sourcePath, cachePath);
  let gitPath = join100(cachePath, ".git");
  if (await rm11(gitPath, { recursive: !0, force: !0 }), (await readdir18(cachePath)).length === 0)
    throw Error(`Failed to copy plugin ${pluginId} to versioned cache: destination is empty after copy`);
  if (zipCacheMode)
    return await convertDirectoryToZipInPlace(cachePath, zipPath), logForDebugging(`Successfully cached plugin ${pluginId} as ZIP at ${zipPath}`), zipPath;
  return logForDebugging(`Successfully cached plugin ${pluginId} at ${cachePath}`), cachePath;
}
