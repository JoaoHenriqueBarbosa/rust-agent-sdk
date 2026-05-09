// function: getGlobalConfig
function getGlobalConfig() {
  if (globalConfigCache.config)
    return configCacheHits++, globalConfigCache.config;
  configCacheMisses++;
  try {
    let stats = null;
    try {
      stats = getFsImplementation().statSync(getGlobalClaudeFile());
    } catch {}
    let config5 = migrateConfigFields(getConfig(getGlobalClaudeFile(), createDefaultGlobalConfig));
    return globalConfigCache = {
      config: config5,
      mtime: stats?.mtimeMs ?? Date.now()
    }, lastReadFileStats = stats ? { mtime: stats.mtimeMs, size: stats.size } : null, startGlobalConfigFreshnessWatcher(), config5;
  } catch {
    return migrateConfigFields(getConfig(getGlobalClaudeFile(), createDefaultGlobalConfig));
  }
}
