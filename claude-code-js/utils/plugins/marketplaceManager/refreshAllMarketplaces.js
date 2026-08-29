// function: refreshAllMarketplaces
async function refreshAllMarketplaces() {
  let config10 = await loadKnownMarketplacesConfig();
  for (let [name3, entry] of Object.entries(config10)) {
    if (seedDirFor(entry.installLocation)) {
      logForDebugging(`Skipping seed-managed marketplace '${name3}' in bulk refresh`);
      continue;
    }
    if (entry.source.source === "settings")
      continue;
    if (name3 === OFFICIAL_MARKETPLACE_NAME) {
      if (await fetchOfficialMarketplaceFromGcs(entry.installLocation, getMarketplacesCacheDir()) !== null) {
        config10[name3].lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
        continue;
      }
    }
    try {
      let { cachePath } = await loadAndCacheMarketplace(entry.source);
      config10[name3].lastUpdated = (/* @__PURE__ */ new Date()).toISOString(), config10[name3].installLocation = cachePath;
    } catch (error44) {
      logForDebugging(`Failed to refresh marketplace ${name3}: ${errorMessage(error44)}`, {
        level: "error"
      });
    }
  }
  await saveKnownMarketplacesConfig(config10);
}
