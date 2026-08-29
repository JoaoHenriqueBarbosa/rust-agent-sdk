// function: wrapWithSandbox
async function wrapWithSandbox(command12, binShell, customConfig, abortSignal) {
  let platform3 = getPlatform2(), stripWriteGlobs = (paths2) => paths2.map((p4) => removeTrailingGlobSuffix(p4)).filter((p4) => {
    if (getPlatform2() === "linux" && containsGlobChars(p4))
      return logForDebugging2(`[Sandbox] Skipping glob write pattern on Linux: ${p4}`), !1;
    return !0;
  }), userAllowWrite = stripWriteGlobs(customConfig?.filesystem?.allowWrite ?? config8?.filesystem.allowWrite ?? []), writeConfig = {
    allowOnly: [...getDefaultWritePaths(), ...userAllowWrite],
    denyWithinAllow: stripWriteGlobs(customConfig?.filesystem?.denyWrite ?? config8?.filesystem.denyWrite ?? [])
  }, rawDenyRead = customConfig?.filesystem?.denyRead ?? config8?.filesystem.denyRead ?? [], expandedDenyRead = [];
  for (let p4 of rawDenyRead) {
    let stripped = removeTrailingGlobSuffix(p4);
    if (getPlatform2() === "linux" && containsGlobChars(stripped))
      expandedDenyRead.push(...expandGlobPattern(p4));
    else
      expandedDenyRead.push(stripped);
  }
  let rawAllowRead = customConfig?.filesystem?.allowRead ?? config8?.filesystem.allowRead ?? [], expandedAllowRead = [];
  for (let p4 of rawAllowRead) {
    let stripped = removeTrailingGlobSuffix(p4);
    if (getPlatform2() === "linux" && containsGlobChars(stripped))
      expandedAllowRead.push(...expandGlobPattern(p4));
    else
      expandedAllowRead.push(stripped);
  }
  let readConfig = {
    denyOnly: expandedDenyRead,
    allowWithinDeny: expandedAllowRead
  }, hasNetworkConfig = customConfig?.network?.allowedDomains !== void 0 || config8?.network?.allowedDomains !== void 0, needsNetworkRestriction = hasNetworkConfig, needsNetworkProxy = hasNetworkConfig;
  if (needsNetworkProxy)
    await waitForNetworkInitialization();
  let allowPty = customConfig?.allowPty ?? config8?.allowPty;
  switch (platform3) {
    case "macos":
      return wrapCommandWithSandboxMacOS({
        command: command12,
        needsNetworkRestriction,
        httpProxyPort: needsNetworkProxy ? getProxyPort() : void 0,
        socksProxyPort: needsNetworkProxy ? getSocksProxyPort() : void 0,
        readConfig,
        writeConfig,
        allowUnixSockets: getAllowUnixSockets(),
        allowAllUnixSockets: getAllowAllUnixSockets(),
        allowLocalBinding: getAllowLocalBinding(),
        allowMachLookup: getAllowMachLookup(),
        ignoreViolations: getIgnoreViolations(),
        allowPty,
        allowGitConfig: getAllowGitConfig(),
        enableWeakerNetworkIsolation: getEnableWeakerNetworkIsolation(),
        binShell
      });
    case "linux":
      return wrapCommandWithSandboxLinux({
        command: command12,
        needsNetworkRestriction,
        httpSocketPath: needsNetworkProxy ? getLinuxHttpSocketPath() : void 0,
        socksSocketPath: needsNetworkProxy ? getLinuxSocksSocketPath() : void 0,
        httpProxyPort: needsNetworkProxy ? managerContext?.httpProxyPort : void 0,
        socksProxyPort: needsNetworkProxy ? managerContext?.socksProxyPort : void 0,
        readConfig,
        writeConfig,
        enableWeakerNestedSandbox: getEnableWeakerNestedSandbox(),
        allowAllUnixSockets: getAllowAllUnixSockets(),
        binShell,
        ripgrepConfig: getRipgrepConfig2(),
        mandatoryDenySearchDepth: getMandatoryDenySearchDepth(),
        allowGitConfig: getAllowGitConfig(),
        seccompConfig: getSeccompConfig(),
        abortSignal
      });
    default:
      throw Error(`Sandbox configuration is not supported on platform: ${platform3}`);
  }
}
