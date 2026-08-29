// Original: src/services/plugins/PluginInstallationManager.ts
function updateMarketplaceStatus(setAppState, name3, status2, error44) {
  setAppState((prevState) => ({
    ...prevState,
    plugins: {
      ...prevState.plugins,
      installationStatus: {
        ...prevState.plugins.installationStatus,
        marketplaces: prevState.plugins.installationStatus.marketplaces.map((m4) => m4.name === name3 ? { ...m4, status: status2, error: error44 } : m4)
      }
    }
  }));
}
async function performBackgroundPluginInstallations(setAppState) {
  logForDebugging("performBackgroundPluginInstallations called");
  try {
    let declared = getDeclaredMarketplaces(), materialized = await loadKnownMarketplacesConfig().catch(() => ({})), diff3 = diffMarketplaces(declared, materialized), pendingNames = [
      ...diff3.missing,
      ...diff3.sourceChanged.map((c3) => c3.name)
    ];
    if (setAppState((prev) => ({
      ...prev,
      plugins: {
        ...prev.plugins,
        installationStatus: {
          marketplaces: pendingNames.map((name3) => ({
            name: name3,
            status: "pending"
          })),
          plugins: []
        }
      }
    })), pendingNames.length === 0)
      return;
    logForDebugging(`Installing ${pendingNames.length} marketplace(s) in background`);
    let result = await reconcileMarketplaces({
      onProgress: (event) => {
        switch (event.type) {
          case "installing":
            updateMarketplaceStatus(setAppState, event.name, "installing");
            break;
          case "installed":
            updateMarketplaceStatus(setAppState, event.name, "installed");
            break;
          case "failed":
            updateMarketplaceStatus(setAppState, event.name, "failed", event.error);
            break;
        }
      }
    }), metrics = {
      installed_count: result.installed.length,
      updated_count: result.updated.length,
      failed_count: result.failed.length,
      up_to_date_count: result.upToDate.length
    };
    if (logEvent("tengu_marketplace_background_install", metrics), logForDiagnosticsNoPII("info", "tengu_marketplace_background_install", metrics), result.installed.length > 0) {
      clearMarketplacesCache(), logForDebugging(`Auto-refreshing plugins after ${result.installed.length} new marketplace(s) installed`);
      try {
        await refreshActivePlugins(setAppState);
      } catch (refreshError) {
        logError2(refreshError), logForDebugging(`Auto-refresh failed, falling back to needsRefresh: ${refreshError}`, { level: "warn" }), clearPluginCache("performBackgroundPluginInstallations: auto-refresh failed"), setAppState((prev) => {
          if (prev.plugins.needsRefresh)
            return prev;
          return {
            ...prev,
            plugins: { ...prev.plugins, needsRefresh: !0 }
          };
        });
      }
    } else if (result.updated.length > 0)
      clearMarketplacesCache(), clearPluginCache("performBackgroundPluginInstallations: marketplaces reconciled"), setAppState((prev) => {
        if (prev.plugins.needsRefresh)
          return prev;
        return {
          ...prev,
          plugins: { ...prev.plugins, needsRefresh: !0 }
        };
      });
  } catch (error44) {
    logError2(error44);
  }
}
var init_PluginInstallationManager = __esm(() => {
  init_debug();
  init_diagLogs();
  init_log3();
  init_marketplaceManager();
  init_pluginLoader();
  init_reconciler2();
  init_refresh();
});
