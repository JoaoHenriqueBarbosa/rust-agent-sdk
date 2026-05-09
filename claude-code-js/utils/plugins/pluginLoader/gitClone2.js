// function: gitClone2
async function gitClone2(gitUrl, targetPath, ref, sha) {
  let args = [
    "clone",
    "--depth",
    "1",
    "--recurse-submodules",
    "--shallow-submodules"
  ];
  if (ref)
    args.push("--branch", ref);
  if (sha)
    args.push("--no-checkout");
  args.push(gitUrl, targetPath);
  let cloneStarted = performance.now(), cloneResult = await execFileNoThrow(gitExe(), args);
  if (cloneResult.code !== 0)
    throw logPluginFetch("plugin_clone", gitUrl, "failure", performance.now() - cloneStarted, classifyFetchError(cloneResult.stderr)), Error(`Failed to clone repository: ${cloneResult.stderr}`);
  if (sha) {
    if ((await execFileNoThrowWithCwd(gitExe(), ["fetch", "--depth", "1", "origin", sha], { cwd: targetPath })).code !== 0) {
      logForDebugging(`Shallow fetch of SHA ${sha} failed, falling back to unshallow fetch`);
      let unshallowResult = await execFileNoThrowWithCwd(gitExe(), ["fetch", "--unshallow"], { cwd: targetPath });
      if (unshallowResult.code !== 0)
        throw logPluginFetch("plugin_clone", gitUrl, "failure", performance.now() - cloneStarted, classifyFetchError(unshallowResult.stderr)), Error(`Failed to fetch commit ${sha}: ${unshallowResult.stderr}`);
    }
    let checkoutResult = await execFileNoThrowWithCwd(gitExe(), ["checkout", sha], { cwd: targetPath });
    if (checkoutResult.code !== 0)
      throw logPluginFetch("plugin_clone", gitUrl, "failure", performance.now() - cloneStarted, classifyFetchError(checkoutResult.stderr)), Error(`Failed to checkout commit ${sha}: ${checkoutResult.stderr}`);
  }
  logPluginFetch("plugin_clone", gitUrl, "success", performance.now() - cloneStarted);
}
