// function: initialize2
async function initialize2(runtimeConfig, sandboxAskCallback, enableLogMonitor = !1) {
  if (initializationPromise) {
    await initializationPromise;
    return;
  }
  if (config8 = runtimeConfig, parentProxy = resolveParentProxy(runtimeConfig.network.parentProxy), parentProxy)
    logForDebugging2(`Parent proxy configured: http=${redactUrl(parentProxy.httpUrl)} https=${redactUrl(parentProxy.httpsUrl)}`);
  let deps = checkDependencies();
  if (deps.errors.length > 0)
    throw Error(`Sandbox dependencies not available: ${deps.errors.join(", ")}`);
  if (enableLogMonitor && getPlatform2() === "macos")
    logMonitorShutdown = startMacOSSandboxLogMonitor(sandboxViolationStore.addViolation.bind(sandboxViolationStore), config8.ignoreViolations), logForDebugging2("Started macOS sandbox log monitor");
  registerCleanup2(), initializationPromise = (async () => {
    try {
      let httpProxyPort;
      if (config8.network.httpProxyPort !== void 0)
        httpProxyPort = config8.network.httpProxyPort, logForDebugging2(`Using external HTTP proxy on port ${httpProxyPort}`);
      else
        httpProxyPort = await startHttpProxyServer(sandboxAskCallback);
      let socksProxyPort;
      if (config8.network.socksProxyPort !== void 0)
        socksProxyPort = config8.network.socksProxyPort, logForDebugging2(`Using external SOCKS proxy on port ${socksProxyPort}`);
      else
        socksProxyPort = await startSocksProxyServer(sandboxAskCallback);
      let linuxBridge;
      if (getPlatform2() === "linux")
        linuxBridge = await initializeLinuxNetworkBridge(httpProxyPort, socksProxyPort);
      let context3 = {
        httpProxyPort,
        socksProxyPort,
        linuxBridge
      };
      return managerContext = context3, logForDebugging2("Network infrastructure initialized"), context3;
    } catch (error44) {
      throw initializationPromise = void 0, managerContext = void 0, reset2().catch((e) => {
        logForDebugging2(`Cleanup failed in initializationPromise ${e}`, {
          level: "error"
        });
      }), error44;
    }
  })(), await initializationPromise;
}
