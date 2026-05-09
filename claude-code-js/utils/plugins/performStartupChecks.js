// Original: src/utils/plugins/performStartupChecks.tsx
async function performStartupChecks(setAppState) {
  if (logForDebugging("performStartupChecks called"), !checkHasTrustDialogAccepted()) {
    logForDebugging("Trust not accepted for current directory - skipping plugin installations");
    return;
  }
  try {
    if (logForDebugging("Starting background plugin installations"), await registerSeedMarketplaces())
      clearMarketplacesCache(), clearPluginCache("performStartupChecks: seed marketplaces changed"), setAppState((prev) => {
        if (prev.plugins.needsRefresh)
          return prev;
        return {
          ...prev,
          plugins: {
            ...prev.plugins,
            needsRefresh: !0
          }
        };
      });
    await performBackgroundPluginInstallations(setAppState);
  } catch (error44) {
    logForDebugging(`Error initiating background plugin installations: ${error44}`);
  }
}
var init_performStartupChecks = __esm(() => {
  init_PluginInstallationManager();
  init_config4();
  init_debug();
  init_marketplaceManager();
  init_pluginLoader();
});
