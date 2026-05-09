// Original: src/hooks/notifs/usePluginInstallationStatus.tsx
function usePluginInstallationStatus() {
  let $3 = import_compiler_runtime350.c(20), {
    addNotification
  } = useNotifications(), installationStatus = useAppState(_temp244), t0;
  bb0: {
    if (!installationStatus) {
      let t13;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t13 = {
          totalFailed: 0,
          failedMarketplacesCount: 0,
          failedPluginsCount: 0
        }, $3[0] = t13;
      else
        t13 = $3[0];
      t0 = t13;
      break bb0;
    }
    let t12;
    if ($3[1] !== installationStatus.marketplaces)
      t12 = installationStatus.marketplaces.filter(_temp288), $3[1] = installationStatus.marketplaces, $3[2] = t12;
    else
      t12 = $3[2];
    let failedMarketplaces = t12, t22;
    if ($3[3] !== installationStatus.plugins)
      t22 = installationStatus.plugins.filter(_temp355), $3[3] = installationStatus.plugins, $3[4] = t22;
    else
      t22 = $3[4];
    let failedPlugins = t22, t3 = failedMarketplaces.length + failedPlugins.length, t4;
    if ($3[5] !== failedMarketplaces.length || $3[6] !== failedPlugins.length || $3[7] !== t3)
      t4 = {
        totalFailed: t3,
        failedMarketplacesCount: failedMarketplaces.length,
        failedPluginsCount: failedPlugins.length
      }, $3[5] = failedMarketplaces.length, $3[6] = failedPlugins.length, $3[7] = t3, $3[8] = t4;
    else
      t4 = $3[8];
    t0 = t4;
  }
  let {
    totalFailed,
    failedMarketplacesCount,
    failedPluginsCount
  } = t0, t1;
  if ($3[9] !== addNotification || $3[10] !== failedMarketplacesCount || $3[11] !== failedPluginsCount || $3[12] !== installationStatus || $3[13] !== totalFailed)
    t1 = () => {
      if (getIsRemoteMode())
        return;
      if (!installationStatus) {
        logForDebugging("No installation status to monitor");
        return;
      }
      if (totalFailed === 0)
        return;
      if (logForDebugging(`Plugin installation status: ${failedMarketplacesCount} failed marketplaces, ${failedPluginsCount} failed plugins`), totalFailed === 0)
        return;
      logForDebugging(`Adding notification for ${totalFailed} failed installations`), addNotification({
        key: "plugin-install-failed",
        jsx: /* @__PURE__ */ jsx_dev_runtime449.jsxDEV(jsx_dev_runtime449.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime449.jsxDEV(ThemedText, {
              color: "error",
              children: [
                totalFailed,
                " ",
                plural(totalFailed, "plugin"),
                " failed to install"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime449.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " \xB7 /plugin for details"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        priority: "medium"
      });
    }, $3[9] = addNotification, $3[10] = failedMarketplacesCount, $3[11] = failedPluginsCount, $3[12] = installationStatus, $3[13] = totalFailed, $3[14] = t1;
  else
    t1 = $3[14];
  let t2;
  if ($3[15] !== addNotification || $3[16] !== failedMarketplacesCount || $3[17] !== failedPluginsCount || $3[18] !== totalFailed)
    t2 = [addNotification, totalFailed, failedMarketplacesCount, failedPluginsCount], $3[15] = addNotification, $3[16] = failedMarketplacesCount, $3[17] = failedPluginsCount, $3[18] = totalFailed, $3[19] = t2;
  else
    t2 = $3[19];
  import_react288.useEffect(t1, t2);
}
function _temp355(p4) {
  return p4.status === "failed";
}
function _temp288(m4) {
  return m4.status === "failed";
}
function _temp244(s2) {
  return s2.plugins.installationStatus;
}
var import_compiler_runtime350, import_react288, jsx_dev_runtime449;
var init_usePluginInstallationStatus = __esm(() => {
  init_state();
  init_notifications();
  init_ink2();
  init_AppState();
  init_debug();
  import_compiler_runtime350 = __toESM(require_react_compiler_runtime_development(), 1), import_react288 = __toESM(require_react_development(), 1), jsx_dev_runtime449 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
