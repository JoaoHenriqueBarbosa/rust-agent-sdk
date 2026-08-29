// function: installFromNpm
async function installFromNpm(packageName, targetPath, options2 = {}) {
  let npmCachePath = join100(getPluginsDirectory(), "npm-cache");
  await getFsImplementation().mkdir(npmCachePath);
  let packageSpec = options2.version ? `${packageName}@${options2.version}` : packageName, packagePath = join100(npmCachePath, "node_modules", packageName);
  if (!await pathExists(packagePath)) {
    logForDebugging(`Installing npm package ${packageSpec} to cache`);
    let args = ["install", packageSpec, "--prefix", npmCachePath];
    if (options2.registry)
      args.push("--registry", options2.registry);
    let result = await execFileNoThrow("npm", args, { useCwd: !1 });
    if (result.code !== 0)
      throw Error(`Failed to install npm package: ${result.stderr}`);
  }
  await copyDir(packagePath, targetPath), logForDebugging(`Copied npm package ${packageName} from cache to ${targetPath}`);
}
