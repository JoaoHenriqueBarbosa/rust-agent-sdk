// function: loadAndCacheMarketplace
async function loadAndCacheMarketplace(source, onProgress) {
  let fs17 = getFsImplementation(), cacheDir = getMarketplacesCacheDir();
  await fs17.mkdir(cacheDir);
  let temporaryCachePath, marketplacePath, cleanupNeeded = !1, tempName = getCachePathForSource(source);
  try {
    switch (source.source) {
      case "url": {
        temporaryCachePath = join97(cacheDir, `${tempName}.json`), cleanupNeeded = !0, await cacheMarketplaceFromUrl(source.url, temporaryCachePath, source.headers, onProgress), marketplacePath = temporaryCachePath;
        break;
      }
      case "github": {
        let sshUrl = `git@github.com:${source.repo}.git`, httpsUrl = `https://github.com/${source.repo}.git`;
        temporaryCachePath = join97(cacheDir, tempName), cleanupNeeded = !0;
        let lastError = null;
        if (await isGitHubSshLikelyConfigured()) {
          safeCallProgress(onProgress, `Cloning via SSH: ${sshUrl}`);
          try {
            await cacheMarketplaceFromGit(sshUrl, temporaryCachePath, source.ref, source.sparsePaths, onProgress);
          } catch (err2) {
            lastError = toError(err2), logError2(lastError), safeCallProgress(onProgress, `SSH clone failed, retrying with HTTPS: ${httpsUrl}`), logForDebugging(`SSH clone failed for ${source.repo} despite SSH being configured, falling back to HTTPS`, { level: "info" }), await fs17.rm(temporaryCachePath, { recursive: !0, force: !0 });
            try {
              await cacheMarketplaceFromGit(httpsUrl, temporaryCachePath, source.ref, source.sparsePaths, onProgress), lastError = null;
            } catch (httpsErr) {
              lastError = toError(httpsErr), logError2(lastError);
            }
          }
        } else {
          safeCallProgress(onProgress, `SSH not configured, cloning via HTTPS: ${httpsUrl}`), logForDebugging(`SSH not configured for GitHub, using HTTPS for ${source.repo}`, { level: "info" });
          try {
            await cacheMarketplaceFromGit(httpsUrl, temporaryCachePath, source.ref, source.sparsePaths, onProgress);
          } catch (err2) {
            lastError = toError(err2), logError2(lastError), safeCallProgress(onProgress, `HTTPS clone failed, retrying with SSH: ${sshUrl}`), logForDebugging(`HTTPS clone failed for ${source.repo} (${lastError.message}), falling back to SSH`, { level: "info" }), await fs17.rm(temporaryCachePath, { recursive: !0, force: !0 });
            try {
              await cacheMarketplaceFromGit(sshUrl, temporaryCachePath, source.ref, source.sparsePaths, onProgress), lastError = null;
            } catch (sshErr) {
              lastError = toError(sshErr), logError2(lastError);
            }
          }
        }
        if (lastError)
          throw lastError;
        marketplacePath = join97(temporaryCachePath, source.path || ".claude-plugin/marketplace.json");
        break;
      }
      case "git": {
        temporaryCachePath = join97(cacheDir, tempName), cleanupNeeded = !0, await cacheMarketplaceFromGit(source.url, temporaryCachePath, source.ref, source.sparsePaths, onProgress), marketplacePath = join97(temporaryCachePath, source.path || ".claude-plugin/marketplace.json");
        break;
      }
      case "npm":
        throw Error("NPM marketplace sources not yet implemented");
      case "file": {
        let absPath = resolve37(source.path);
        marketplacePath = absPath, temporaryCachePath = dirname43(dirname43(absPath)), cleanupNeeded = !1;
        break;
      }
      case "directory": {
        let absPath = resolve37(source.path);
        marketplacePath = join97(absPath, ".claude-plugin", "marketplace.json"), temporaryCachePath = absPath, cleanupNeeded = !1;
        break;
      }
      case "settings": {
        temporaryCachePath = join97(cacheDir, source.name), marketplacePath = join97(temporaryCachePath, ".claude-plugin", "marketplace.json"), cleanupNeeded = !1, await fs17.mkdir(dirname43(marketplacePath)), await writeFile27(marketplacePath, jsonStringify({
          name: source.name,
          owner: source.owner ?? { name: "settings" },
          plugins: source.plugins
        }, null, 2));
        break;
      }
      default:
        throw Error("Unsupported marketplace source type");
    }
    logForDebugging(`Reading marketplace from ${marketplacePath}`);
    let marketplace;
    try {
      marketplace = await parseFileWithSchema(marketplacePath, PluginMarketplaceSchema());
    } catch (e) {
      if (isENOENT(e))
        throw Error(`Marketplace file not found at ${marketplacePath}`);
      throw Error(`Failed to parse marketplace file at ${marketplacePath}: ${errorMessage(e)}`);
    }
    let finalCachePath = join97(cacheDir, marketplace.name), resolvedFinal = resolve37(finalCachePath), resolvedCacheDir = resolve37(cacheDir);
    if (!resolvedFinal.startsWith(resolvedCacheDir + sep21))
      throw Error(`Marketplace name '${marketplace.name}' resolves to a path outside the cache directory`);
    if (temporaryCachePath !== finalCachePath && !isLocalMarketplaceSource(source))
      try {
        try {
          onProgress?.("Cleaning up old marketplace cache\u2026");
        } catch (callbackError) {
          logForDebugging(`Progress callback error: ${errorMessage(callbackError)}`, { level: "warn" });
        }
        await fs17.rm(finalCachePath, { recursive: !0, force: !0 }), await fs17.rename(temporaryCachePath, finalCachePath), temporaryCachePath = finalCachePath, cleanupNeeded = !1;
      } catch (error44) {
        let errorMsg = errorMessage(error44);
        throw Error(`Failed to finalize marketplace cache. Please manually delete the directory at ${finalCachePath} if it exists and try again.

Technical details: ${errorMsg}`);
      }
    return { marketplace, cachePath: temporaryCachePath };
  } catch (error44) {
    if (cleanupNeeded && temporaryCachePath && !isLocalMarketplaceSource(source))
      try {
        await fs17.rm(temporaryCachePath, { recursive: !0, force: !0 });
      } catch (cleanupError) {
        logForDebugging(`Warning: Failed to clean up temporary marketplace cache at ${temporaryCachePath}: ${errorMessage(cleanupError)}`, { level: "warn" });
      }
    throw error44;
  }
}
