// function: setMarketplaceAutoUpdate
async function setMarketplaceAutoUpdate(name3, autoUpdate) {
  let config10 = await loadKnownMarketplacesConfig(), entry = config10[name3];
  if (!entry)
    throw Error(`Marketplace '${name3}' not found. Available marketplaces: ${Object.keys(config10).join(", ")}`);
  let seedDir = seedDirFor(entry.installLocation);
  if (seedDir)
    throw Error(`Marketplace '${name3}' is seed-managed (${seedDir}) and auto-update is always disabled for seed content. To update: ask your admin to update the seed.`);
  if (entry.autoUpdate === autoUpdate)
    return;
  config10[name3] = {
    ...entry,
    autoUpdate
  }, await saveKnownMarketplacesConfig(config10);
  let declaringSource = getMarketplaceDeclaringSource(name3);
  if (declaringSource) {
    let declared = getSettingsForSource(declaringSource)?.extraKnownMarketplaces?.[name3];
    if (declared)
      saveMarketplaceToSettings(name3, { source: declared.source, autoUpdate }, declaringSource);
  }
  logForDebugging(`Set autoUpdate=${autoUpdate} for marketplace: ${name3}`);
}
