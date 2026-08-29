// Original: src/components/PackageManagerAutoUpdater.tsx
function PackageManagerAutoUpdater(t0) {
  let $3 = import_compiler_runtime314.c(10), {
    verbose
  } = t0, [updateAvailable, setUpdateAvailable] = import_react228.useState(!1), [packageManager, setPackageManager] = import_react228.useState("unknown"), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = async () => {
      if (isAutoUpdaterDisabled())
        return;
      let [channel, pm] = await Promise.all([Promise.resolve(getInitialSettings()?.autoUpdatesChannel ?? "latest"), getPackageManager()]);
      setPackageManager(pm);
      let latest = await getLatestVersionFromGcs(channel), maxVersion = await getMaxVersion();
      if (maxVersion && latest && gt(latest, maxVersion)) {
        if (logForDebugging(`PackageManagerAutoUpdater: maxVersion ${maxVersion} is set, capping update from ${latest} to ${maxVersion}`), gte("2.1.90", maxVersion)) {
          logForDebugging(`PackageManagerAutoUpdater: current version 2.1.90 is already at or above maxVersion ${maxVersion}, skipping update`), setUpdateAvailable(!1);
          return;
        }
        latest = maxVersion;
      }
      let hasUpdate = latest && !gte("2.1.90", latest) && !shouldSkipVersion(latest);
      if (setUpdateAvailable(!!hasUpdate), hasUpdate)
        logForDebugging(`PackageManagerAutoUpdater: Update available 2.1.90 -> ${latest}`);
    }, $3[0] = t1;
  else
    t1 = $3[0];
  let checkForUpdates = t1, t2, t3;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => {
      checkForUpdates();
    }, t3 = [checkForUpdates], $3[1] = t2, $3[2] = t3;
  else
    t2 = $3[1], t3 = $3[2];
  if (React129.useEffect(t2, t3), useInterval(checkForUpdates, 1800000), !updateAvailable)
    return null;
  let updateCommand = packageManager === "homebrew" ? "brew upgrade claude-code" : packageManager === "winget" ? "winget upgrade Anthropic.ClaudeCode" : packageManager === "apk" ? "apk upgrade claude-code" : "your package manager update command", t4;
  if ($3[3] !== verbose)
    t4 = verbose && /* @__PURE__ */ jsx_dev_runtime405.jsxDEV(ThemedText, {
      dimColor: !0,
      wrap: "truncate",
      children: [
        "currentVersion: ",
        "2.1.90"
      ]
    }, void 0, !0, void 0, this), $3[3] = verbose, $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] !== updateCommand)
    t5 = /* @__PURE__ */ jsx_dev_runtime405.jsxDEV(ThemedText, {
      color: "warning",
      wrap: "truncate",
      children: [
        "Update available! Run: ",
        /* @__PURE__ */ jsx_dev_runtime405.jsxDEV(ThemedText, {
          bold: !0,
          children: updateCommand
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[5] = updateCommand, $3[6] = t5;
  else
    t5 = $3[6];
  let t6;
  if ($3[7] !== t4 || $3[8] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime405.jsxDEV(jsx_dev_runtime405.Fragment, {
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[7] = t4, $3[8] = t5, $3[9] = t6;
  else
    t6 = $3[9];
  return t6;
}
var import_compiler_runtime314, React129, import_react228, jsx_dev_runtime405;
var init_PackageManagerAutoUpdater = __esm(() => {
  init_dist4();
  init_ink2();
  init_autoUpdater();
  init_config4();
  init_debug();
  init_packageManagers();
  init_settings2();
  import_compiler_runtime314 = __toESM(require_react_compiler_runtime_development(), 1), React129 = __toESM(require_react_development(), 1), import_react228 = __toESM(require_react_development(), 1), jsx_dev_runtime405 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
