// function: refreshMarketplace
async function refreshMarketplace(name3, onProgress, options2) {
  let config10 = await loadKnownMarketplacesConfig(), entry = config10[name3];
  if (!entry)
    throw Error(`Marketplace '${name3}' not found. Available marketplaces: ${Object.keys(config10).join(", ")}`);
  if (getMarketplace.cache?.delete?.(name3), entry.source.source === "settings") {
    logForDebugging(`Skipping refresh for settings-sourced marketplace '${name3}' \u2014 no upstream`);
    return;
  }
  try {
    let { installLocation, source } = entry, seedDir = seedDirFor(installLocation);
    if (seedDir)
      throw Error(`Marketplace '${name3}' is seed-managed (${seedDir}) and its content is controlled by the seed image. To update: ask your admin to update the seed.`);
    if (!isLocalMarketplaceSource(source)) {
      let cacheDir = resolve37(getMarketplacesCacheDir()), resolvedLoc = resolve37(installLocation);
      if (resolvedLoc !== cacheDir && !resolvedLoc.startsWith(cacheDir + sep21))
        throw Error(`Marketplace '${name3}' has a corrupted installLocation (${installLocation}) \u2014 expected a path inside ${cacheDir}. This can happen after cross-platform path writes or manual edits to known_marketplaces.json. Run: claude plugin marketplace remove "${name3}" and re-add it.`);
    }
    if (name3 === OFFICIAL_MARKETPLACE_NAME) {
      if (await fetchOfficialMarketplaceFromGcs(installLocation, getMarketplacesCacheDir()) !== null) {
        config10[name3] = { ...entry, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() }, await saveKnownMarketplacesConfig(config10);
        return;
      }
      logForDebugging("Official marketplace GCS failed; falling back to git", {
        level: "warn"
      });
    }
    if (source.source === "github" || source.source === "git") {
      if (source.source === "github") {
        let sshUrl = `git@github.com:${source.repo}.git`, httpsUrl = `https://github.com/${source.repo}.git`;
        if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE))
          await cacheMarketplaceFromGit(httpsUrl, installLocation, source.ref, source.sparsePaths, onProgress, options2);
        else {
          let sshConfigured = await isGitHubSshLikelyConfigured(), primaryUrl = sshConfigured ? sshUrl : httpsUrl, fallbackUrl = sshConfigured ? httpsUrl : sshUrl;
          try {
            await cacheMarketplaceFromGit(primaryUrl, installLocation, source.ref, source.sparsePaths, onProgress, options2);
          } catch {
            logForDebugging(`Marketplace refresh failed with ${sshConfigured ? "SSH" : "HTTPS"} for ${source.repo}, falling back to ${sshConfigured ? "HTTPS" : "SSH"}`, { level: "info" }), await cacheMarketplaceFromGit(fallbackUrl, installLocation, source.ref, source.sparsePaths, onProgress, options2);
          }
        }
      } else
        await cacheMarketplaceFromGit(source.url, installLocation, source.ref, source.sparsePaths, onProgress, options2);
      try {
        await readCachedMarketplace(installLocation);
      } catch {
        let sourceDisplay = source.source === "github" ? source.repo : redactUrlCredentials(source.url);
        throw Error(`The marketplace.json file is no longer present in this repository.

${name3 === "claude-code-plugins" ? `We've deprecated "claude-code-plugins" in favor of "claude-plugins-official".` : "This marketplace may have been deprecated or moved to a new location."}
Source: ${sourceDisplay}

You can remove this marketplace with: claude plugin marketplace remove "${name3}"`);
      }
    } else if (source.source === "url")
      await cacheMarketplaceFromUrl(source.url, installLocation, source.headers, onProgress);
    else if (isLocalMarketplaceSource(source))
      safeCallProgress(onProgress, "Validating local marketplace"), await readCachedMarketplace(installLocation);
    else
      throw Error("Unsupported marketplace source type for refresh");
    config10[name3].lastUpdated = (/* @__PURE__ */ new Date()).toISOString(), await saveKnownMarketplacesConfig(config10), logForDebugging(`Successfully refreshed marketplace: ${name3}`);
  } catch (error44) {
    let errorMessage3 = error44 instanceof Error ? error44.message : String(error44);
    throw logForDebugging(`Failed to refresh marketplace ${name3}: ${errorMessage3}`, {
      level: "error"
    }), Error(`Failed to refresh marketplace '${name3}': ${errorMessage3}`);
  }
}
