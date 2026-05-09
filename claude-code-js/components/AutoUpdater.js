// Original: src/components/AutoUpdater.tsx
function AutoUpdater({
  isUpdating,
  onChangeIsUpdating,
  onAutoUpdaterResult,
  autoUpdaterResult,
  showSuccessMessage,
  verbose
}) {
  let [versions2, setVersions] = import_react226.useState({}), [hasLocalInstall, setHasLocalInstall] = import_react226.useState(!1), updateSemver = useUpdateNotification(autoUpdaterResult?.version);
  import_react226.useEffect(() => {
    localInstallationExists().then(setHasLocalInstall);
  }, []);
  let isUpdatingRef = import_react226.useRef(isUpdating);
  isUpdatingRef.current = isUpdating;
  let checkForUpdates = React127.useCallback(async () => {
    if (isUpdatingRef.current)
      return;
    let currentVersion = "2.1.90", channel = getInitialSettings()?.autoUpdatesChannel ?? "latest", latestVersion = await getLatestVersion(channel), isDisabled = isAutoUpdaterDisabled(), maxVersion = await getMaxVersion();
    if (maxVersion && latestVersion && gt(latestVersion, maxVersion)) {
      if (logForDebugging(`AutoUpdater: maxVersion ${maxVersion} is set, capping update from ${latestVersion} to ${maxVersion}`), gte(currentVersion, maxVersion)) {
        logForDebugging(`AutoUpdater: current version ${currentVersion} is already at or above maxVersion ${maxVersion}, skipping update`), setVersions({
          global: currentVersion,
          latest: latestVersion
        });
        return;
      }
      latestVersion = maxVersion;
    }
    if (setVersions({
      global: currentVersion,
      latest: latestVersion
    }), !isDisabled && currentVersion && latestVersion && !gte(currentVersion, latestVersion) && !shouldSkipVersion(latestVersion)) {
      let startTime = Date.now();
      onChangeIsUpdating(!0);
      let config11 = getGlobalConfig();
      if (config11.installMethod !== "native")
        await removeInstalledSymlink();
      let installationType = await getCurrentInstallationType();
      if (logForDebugging(`AutoUpdater: Detected installation type: ${installationType}`), installationType === "development") {
        logForDebugging("AutoUpdater: Cannot auto-update development build"), onChangeIsUpdating(!1);
        return;
      }
      let installStatus, updateMethod;
      if (installationType === "npm-local")
        logForDebugging("AutoUpdater: Using local update method"), updateMethod = "local", installStatus = await installOrUpdateClaudePackage(channel);
      else if (installationType === "npm-global")
        logForDebugging("AutoUpdater: Using global update method"), updateMethod = "global", installStatus = await installGlobalPackage();
      else if (installationType === "native") {
        logForDebugging("AutoUpdater: Unexpected native installation in non-native updater"), onChangeIsUpdating(!1);
        return;
      } else {
        logForDebugging("AutoUpdater: Unknown installation type, falling back to config");
        let isMigrated = config11.installMethod === "local";
        if (updateMethod = isMigrated ? "local" : "global", isMigrated)
          installStatus = await installOrUpdateClaudePackage(channel);
        else
          installStatus = await installGlobalPackage();
      }
      if (onChangeIsUpdating(!1), installStatus === "success")
        logEvent("tengu_auto_updater_success", {
          fromVersion: currentVersion,
          toVersion: latestVersion,
          durationMs: Date.now() - startTime,
          wasMigrated: updateMethod === "local",
          installationType
        });
      else
        logEvent("tengu_auto_updater_fail", {
          fromVersion: currentVersion,
          attemptedVersion: latestVersion,
          status: installStatus,
          durationMs: Date.now() - startTime,
          wasMigrated: updateMethod === "local",
          installationType
        });
      onAutoUpdaterResult({
        version: latestVersion,
        status: installStatus
      });
    }
  }, [onAutoUpdaterResult]);
  if (import_react226.useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]), useInterval(checkForUpdates, 1800000), !autoUpdaterResult?.version && (!versions2.global || !versions2.latest))
    return null;
  if (!autoUpdaterResult?.version && !isUpdating)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    gap: 1,
    children: [
      verbose && /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedText, {
        dimColor: !0,
        wrap: "truncate",
        children: [
          "globalVersion: ",
          versions2.global,
          " \xB7 latestVersion:",
          " ",
          versions2.latest
        ]
      }, void 0, !0, void 0, this),
      isUpdating ? /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(jsx_dev_runtime403.Fragment, {
        children: /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedText, {
            color: "text",
            dimColor: !0,
            wrap: "truncate",
            children: "Auto-updating\u2026"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : autoUpdaterResult?.status === "success" && showSuccessMessage && updateSemver && /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedText, {
        color: "success",
        wrap: "truncate",
        children: "\u2713 Update installed \xB7 Restart to apply"
      }, void 0, !1, void 0, this),
      (autoUpdaterResult?.status === "install_failed" || autoUpdaterResult?.status === "no_permissions") && /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedText, {
        color: "error",
        wrap: "truncate",
        children: [
          "\u2717 Auto-update failed \xB7 Try ",
          /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedText, {
            bold: !0,
            children: "claude doctor"
          }, void 0, !1, void 0, this),
          " or",
          " ",
          /* @__PURE__ */ jsx_dev_runtime403.jsxDEV(ThemedText, {
            bold: !0,
            children: hasLocalInstall ? "cd ~/.claude/local && npm update @anthropic-ai/claude-code" : "npm i -g @anthropic-ai/claude-code"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var React127, import_react226, jsx_dev_runtime403;
var init_AutoUpdater = __esm(() => {
  init_dist4();
  init_useUpdateNotification();
  init_ink2();
  init_autoUpdater();
  init_config4();
  init_debug();
  init_doctorDiagnostic();
  init_localInstaller();
  init_nativeInstaller();
  init_settings2();
  React127 = __toESM(require_react_development(), 1), import_react226 = __toESM(require_react_development(), 1), jsx_dev_runtime403 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
