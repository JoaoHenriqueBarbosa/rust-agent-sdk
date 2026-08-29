// function: startGlobalConfigFreshnessWatcher
function startGlobalConfigFreshnessWatcher() {
  if (freshnessWatcherStarted)
    return;
  freshnessWatcherStarted = !0;
  let file2 = getGlobalClaudeFile();
  watchFile2(file2, { interval: CONFIG_FRESHNESS_POLL_MS, persistent: !1 }, (curr) => {
    if (curr.mtimeMs <= globalConfigCache.mtime)
      return;
    getFsImplementation().readFile(file2, { encoding: "utf-8" }).then((content) => {
      if (curr.mtimeMs <= globalConfigCache.mtime)
        return;
      let parsed = safeParseJSON(stripBOM(content));
      if (parsed === null || typeof parsed !== "object")
        return;
      globalConfigCache = {
        config: migrateConfigFields({
          ...createDefaultGlobalConfig(),
          ...parsed
        }),
        mtime: curr.mtimeMs
      }, lastReadFileStats = { mtime: curr.mtimeMs, size: curr.size };
    }).catch(() => {});
  }), registerCleanup(async () => {
    unwatchFile2(file2), freshnessWatcherStarted = !1;
  });
}
