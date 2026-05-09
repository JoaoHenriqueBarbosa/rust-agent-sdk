// function: probeSeedCache
async function probeSeedCache(pluginId, version5) {
  for (let seedDir of getPluginSeedDirs()) {
    let seedPath = getVersionedCachePathIn(seedDir, pluginId, version5);
    try {
      if ((await readdir18(seedPath)).length > 0)
        return seedPath;
    } catch {}
  }
  return null;
}
