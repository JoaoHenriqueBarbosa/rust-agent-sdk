// var: init_sandbox_manager
var init_sandbox_manager = __esm(() => {
  init_http_proxy();
  init_socks_proxy();
  init_which2();
  init_platform3();
  init_linux_sandbox_utils();
  init_macos_sandbox_utils();
  init_sandbox_utils();
  init_sandbox_violation_store();
  init_parent_proxy();
  sandboxViolationStore = new SandboxViolationStore;
  SandboxManager = {
    initialize: initialize2,
    isSupportedPlatform,
    isSandboxingEnabled,
    checkDependencies,
    getFsReadConfig,
    getFsWriteConfig,
    getNetworkRestrictionConfig,
    getAllowUnixSockets,
    getAllowLocalBinding,
    getAllowMachLookup,
    getIgnoreViolations,
    getEnableWeakerNestedSandbox,
    getProxyPort,
    getSocksProxyPort,
    getLinuxHttpSocketPath,
    getLinuxSocksSocketPath,
    waitForNetworkInitialization,
    wrapWithSandbox,
    cleanupAfterCommand,
    reset: reset2,
    getSandboxViolationStore,
    annotateStderrWithSandboxFailures,
    getLinuxGlobPatternWarnings,
    getConfig: getConfig2,
    updateConfig
  };
});
