// function: cacheMarketplaceFromGit
async function cacheMarketplaceFromGit(gitUrl, cachePath, ref, sparsePaths, onProgress, options2) {
  let fs17 = getFsImplementation(), timeoutSec = Math.round(getPluginGitTimeoutMs() / 1000);
  safeCallProgress(onProgress, `Refreshing marketplace cache (timeout: ${timeoutSec}s)\u2026`);
  let reconcileResult = await reconcileSparseCheckout(cachePath, sparsePaths);
  if (reconcileResult.code === 0) {
    let pullStarted = performance.now(), pullResult = await gitPull(cachePath, ref, {
      disableCredentialHelper: options2?.disableCredentialHelper,
      sparsePaths
    });
    if (logPluginFetch("marketplace_pull", gitUrl, pullResult.code === 0 ? "success" : "failure", performance.now() - pullStarted, pullResult.code === 0 ? void 0 : classifyFetchError(pullResult.stderr)), pullResult.code === 0)
      return;
    logForDebugging(`git pull failed, will re-clone: ${pullResult.stderr}`, {
      level: "warn"
    });
  } else
    logForDebugging(`sparse-checkout reconcile requires re-clone: ${reconcileResult.stderr}`);
  try {
    await fs17.rm(cachePath, { recursive: !0 }), logForDebugging(`Found stale marketplace directory at ${cachePath}, cleaning up to allow re-clone`, { level: "warn" }), safeCallProgress(onProgress, "Found stale directory, cleaning up and re-cloning\u2026");
  } catch (rmError) {
    if (!isENOENT(rmError)) {
      let rmErrorMsg = errorMessage(rmError);
      throw Error(`Failed to clean up existing marketplace directory. Please manually delete the directory at ${cachePath} and try again.

Technical details: ${rmErrorMsg}`);
    }
  }
  let refMessage = ref ? ` (ref: ${ref})` : "";
  safeCallProgress(onProgress, `Cloning repository (timeout: ${timeoutSec}s): ${redactUrlCredentials(gitUrl)}${refMessage}`);
  let cloneStarted = performance.now(), result = await gitClone(gitUrl, cachePath, ref, sparsePaths);
  if (logPluginFetch("marketplace_clone", gitUrl, result.code === 0 ? "success" : "failure", performance.now() - cloneStarted, result.code === 0 ? void 0 : classifyFetchError(result.stderr)), result.code !== 0) {
    try {
      await fs17.rm(cachePath, { recursive: !0, force: !0 });
    } catch {}
    throw Error(`Failed to clone marketplace repository: ${result.stderr}`);
  }
  safeCallProgress(onProgress, "Clone complete, validating marketplace\u2026");
}
