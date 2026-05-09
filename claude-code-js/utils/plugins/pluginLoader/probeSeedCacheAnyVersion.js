// function: probeSeedCacheAnyVersion
async function probeSeedCacheAnyVersion(pluginId) {
  for (let seedDir of getPluginSeedDirs()) {
    let pluginDir = dirname46(getVersionedCachePathIn(seedDir, pluginId, "_"));
    try {
      let versions2 = await readdir18(pluginDir);
      if (versions2.length !== 1)
        continue;
      let versionDir = join100(pluginDir, versions2[0]);
      if ((await readdir18(versionDir)).length > 0)
        return versionDir;
    } catch {}
  }
  return null;
}
