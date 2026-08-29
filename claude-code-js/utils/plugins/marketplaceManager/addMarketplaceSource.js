// function: addMarketplaceSource
async function addMarketplaceSource(source, onProgress) {
  let resolvedSource = source;
  if (isLocalMarketplaceSource(source) && !isAbsolute24(source.path))
    resolvedSource = { ...source, path: resolve37(source.path) };
  if (!isSourceAllowedByPolicy(resolvedSource)) {
    if (isSourceInBlocklist(resolvedSource))
      throw Error(`Marketplace source '${formatSourceForDisplay(resolvedSource)}' is blocked by enterprise policy.`);
    let allowlist = getStrictKnownMarketplaces() || [], hostPatterns = getHostPatternsFromAllowlist(), sourceHost = extractHostFromSource(resolvedSource), errorMessage3 = `Marketplace source '${formatSourceForDisplay(resolvedSource)}'`;
    if (sourceHost)
      errorMessage3 += ` (${sourceHost})`;
    if (errorMessage3 += " is blocked by enterprise policy.", allowlist.length > 0)
      errorMessage3 += ` Allowed sources: ${allowlist.map((s2) => formatSourceForDisplay(s2)).join(", ")}`;
    else
      errorMessage3 += " No external marketplaces are allowed.";
    if (resolvedSource.source === "github" && hostPatterns.length > 0)
      errorMessage3 += `

Tip: The shorthand "${resolvedSource.repo}" assumes github.com. For internal GitHub Enterprise, use the full URL:
  git@your-github-host.com:${resolvedSource.repo}.git`;
    throw Error(errorMessage3);
  }
  let existingConfig = await loadKnownMarketplacesConfig();
  for (let [existingName, existingEntry] of Object.entries(existingConfig))
    if (isEqual_default(existingEntry.source, resolvedSource))
      return logForDebugging(`Source already materialized as '${existingName}', skipping clone`), { name: existingName, alreadyMaterialized: !0, resolvedSource };
  let { marketplace, cachePath } = await loadAndCacheMarketplace(resolvedSource, onProgress), sourceValidationError = validateOfficialNameSource(marketplace.name, resolvedSource);
  if (sourceValidationError)
    throw Error(sourceValidationError);
  let config10 = await loadKnownMarketplacesConfig(), oldEntry = config10[marketplace.name];
  if (oldEntry) {
    let seedDir = seedDirFor(oldEntry.installLocation);
    if (seedDir)
      throw Error(`Marketplace '${marketplace.name}' is seed-managed (${seedDir}). To use a different source, ask your admin to update the seed, or use a different marketplace name.`);
    if (logForDebugging(`Marketplace '${marketplace.name}' exists with different source \u2014 overwriting`), !isLocalMarketplaceSource(oldEntry.source)) {
      let cacheDir = resolve37(getMarketplacesCacheDir()), resolvedOld = resolve37(oldEntry.installLocation), resolvedNew = resolve37(cachePath);
      if (resolvedOld === resolvedNew)
        ;
      else if (resolvedOld === cacheDir || resolvedOld.startsWith(cacheDir + sep21))
        await getFsImplementation().rm(oldEntry.installLocation, { recursive: !0, force: !0 });
      else
        logForDebugging(`Skipping cleanup of old installLocation (${oldEntry.installLocation}) \u2014 ` + `outside ${cacheDir}. The path is corrupted; leaving it alone and overwriting the config entry.`, { level: "warn" });
    }
  }
  return config10[marketplace.name] = {
    source: resolvedSource,
    installLocation: cachePath,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  }, await saveKnownMarketplacesConfig(config10), logForDebugging(`Added marketplace source: ${marketplace.name}`), { name: marketplace.name, alreadyMaterialized: !1, resolvedSource };
}
