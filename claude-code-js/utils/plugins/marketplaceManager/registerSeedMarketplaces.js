// function: registerSeedMarketplaces
async function registerSeedMarketplaces() {
  let seedDirs = getPluginSeedDirs();
  if (seedDirs.length === 0)
    return !1;
  let primary = await loadKnownMarketplacesConfig(), claimed = /* @__PURE__ */ new Set, changed = 0;
  for (let seedDir of seedDirs) {
    let seedConfig = await readSeedKnownMarketplaces(seedDir);
    if (!seedConfig)
      continue;
    for (let [name3, seedEntry] of Object.entries(seedConfig)) {
      if (claimed.has(name3))
        continue;
      let resolvedLocation = await findSeedMarketplaceLocation(seedDir, name3);
      if (!resolvedLocation) {
        logForDebugging(`Seed marketplace '${name3}' not found under ${seedDir}/marketplaces/, skipping`, { level: "warn" });
        continue;
      }
      claimed.add(name3);
      let desired = {
        source: seedEntry.source,
        installLocation: resolvedLocation,
        lastUpdated: seedEntry.lastUpdated,
        autoUpdate: !1
      };
      if (isEqual_default(primary[name3], desired))
        continue;
      primary[name3] = desired, changed++;
    }
  }
  if (changed > 0)
    return await saveKnownMarketplacesConfig(primary), logForDebugging(`Synced ${changed} marketplace(s) from seed dir(s)`), !0;
  return !1;
}
