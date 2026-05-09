// function: wrapCommandWithSandboxMacOS
function wrapCommandWithSandboxMacOS(params) {
  let { command: command12, needsNetworkRestriction, httpProxyPort, socksProxyPort, allowUnixSockets, allowAllUnixSockets, allowLocalBinding, allowMachLookup, readConfig, writeConfig, allowPty, allowGitConfig = !1, enableWeakerNetworkIsolation = !1, binShell } = params, hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0;
  if (!needsNetworkRestriction && !hasReadRestrictions && writeConfig === void 0)
    return command12;
  let logTag = generateLogTag(command12), profile7 = generateSandboxProfile({
    readConfig,
    writeConfig,
    httpProxyPort,
    socksProxyPort,
    needsNetworkRestriction,
    allowUnixSockets,
    allowAllUnixSockets,
    allowLocalBinding,
    allowMachLookup,
    allowPty,
    allowGitConfig,
    enableWeakerNetworkIsolation,
    logTag
  }), proxyEnvArgs = generateProxyEnvVars(httpProxyPort, socksProxyPort), shellName = binShell || "bash", shell = whichSync2(shellName);
  if (!shell)
    throw Error(`Shell '${shellName}' not found in PATH`);
  let wrappedCommand = import_shell_quote2.default.quote([
    "env",
    ...proxyEnvArgs,
    "sandbox-exec",
    "-p",
    profile7,
    shell,
    "-c",
    command12
  ]);
  return logForDebugging2(`[Sandbox macOS] Applied restrictions - network: ${!!(httpProxyPort || socksProxyPort)}, read: ${readConfig ? "allowAllExcept" in readConfig ? "allowAllExcept" : "denyAllExcept" : "none"}, write: ${writeConfig ? "allowAllExcept" in writeConfig ? "allowAllExcept" : "denyAllExcept" : "none"}`), wrappedCommand;
}
