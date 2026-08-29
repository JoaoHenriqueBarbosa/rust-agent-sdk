// Original: src/components/NativeAutoUpdater.tsx
function getErrorType(errorMessage4) {
  if (errorMessage4.includes("timeout"))
    return "timeout";
  if (errorMessage4.includes("Checksum mismatch"))
    return "checksum_mismatch";
  if (errorMessage4.includes("ENOENT") || errorMessage4.includes("not found"))
    return "not_found";
  if (errorMessage4.includes("EACCES") || errorMessage4.includes("permission"))
    return "permission_denied";
  if (errorMessage4.includes("ENOSPC"))
    return "disk_full";
  if (errorMessage4.includes("npm"))
    return "npm_error";
  if (errorMessage4.includes("network") || errorMessage4.includes("ECONNREFUSED") || errorMessage4.includes("ENOTFOUND"))
    return "network_error";
  return "unknown";
}
function NativeAutoUpdater({
  isUpdating,
  onChangeIsUpdating,
  onAutoUpdaterResult,
  autoUpdaterResult,
  showSuccessMessage,
  verbose
}) {
  let [versions2, setVersions] = import_react227.useState({}), [maxVersionIssue, setMaxVersionIssue] = import_react227.useState(null), updateSemver = useUpdateNotification(autoUpdaterResult?.version), channel = getInitialSettings()?.autoUpdatesChannel ?? "latest", isUpdatingRef = import_react227.useRef(isUpdating);
  isUpdatingRef.current = isUpdating;
  let checkForUpdates = React128.useCallback(async () => {
    if (isUpdatingRef.current)
      return;
    if (isAutoUpdaterDisabled())
      return;
    onChangeIsUpdating(!0);
    let startTime = Date.now();
    logEvent("tengu_native_auto_updater_start", {});
    try {
      let maxVersion = await getMaxVersion();
      if (maxVersion && gt("2.1.90", maxVersion)) {
        let msg = await getMaxVersionMessage();
        setMaxVersionIssue(msg ?? "affects your version");
      }
      let result = await installLatest(channel), currentVersion = "2.1.90", latencyMs = Date.now() - startTime;
      if (result.lockFailed) {
        logEvent("tengu_native_auto_updater_lock_contention", {
          latency_ms: latencyMs
        });
        return;
      }
      if (setVersions({
        current: currentVersion,
        latest: result.latestVersion
      }), result.wasUpdated)
        logEvent("tengu_native_auto_updater_success", {
          latency_ms: latencyMs
        }), onAutoUpdaterResult({
          version: result.latestVersion,
          status: "success"
        });
      else
        logEvent("tengu_native_auto_updater_up_to_date", {
          latency_ms: latencyMs
        });
    } catch (error44) {
      let latencyMs = Date.now() - startTime, errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
      logError2(error44);
      let errorType = getErrorType(errorMessage4);
      logEvent("tengu_native_auto_updater_fail", {
        latency_ms: latencyMs,
        error_timeout: errorType === "timeout",
        error_checksum: errorType === "checksum_mismatch",
        error_not_found: errorType === "not_found",
        error_permission: errorType === "permission_denied",
        error_disk_full: errorType === "disk_full",
        error_npm: errorType === "npm_error",
        error_network: errorType === "network_error"
      }), onAutoUpdaterResult({
        version: null,
        status: "install_failed"
      });
    } finally {
      onChangeIsUpdating(!1);
    }
  }, [onAutoUpdaterResult, channel]);
  import_react227.useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]), useInterval(checkForUpdates, 1800000);
  let hasUpdateResult = !!autoUpdaterResult?.version, hasVersionInfo = !!versions2.current && !!versions2.latest;
  if (!(!!maxVersionIssue || hasUpdateResult || isUpdating && hasVersionInfo))
    return null;
  return /* @__PURE__ */ jsx_dev_runtime404.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    gap: 1,
    children: [
      verbose && /* @__PURE__ */ jsx_dev_runtime404.jsxDEV(ThemedText, {
        dimColor: !0,
        wrap: "truncate",
        children: [
          "current: ",
          versions2.current,
          " \xB7 ",
          channel,
          ": ",
          versions2.latest
        ]
      }, void 0, !0, void 0, this),
      isUpdating ? /* @__PURE__ */ jsx_dev_runtime404.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime404.jsxDEV(ThemedText, {
          dimColor: !0,
          wrap: "truncate",
          children: "Checking for updates"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : autoUpdaterResult?.status === "success" && showSuccessMessage && updateSemver && /* @__PURE__ */ jsx_dev_runtime404.jsxDEV(ThemedText, {
        color: "success",
        wrap: "truncate",
        children: "\u2713 Update installed \xB7 Restart to update"
      }, void 0, !1, void 0, this),
      autoUpdaterResult?.status === "install_failed" && /* @__PURE__ */ jsx_dev_runtime404.jsxDEV(ThemedText, {
        color: "error",
        wrap: "truncate",
        children: [
          "\u2717 Auto-update failed \xB7 Try ",
          /* @__PURE__ */ jsx_dev_runtime404.jsxDEV(ThemedText, {
            bold: !0,
            children: "/status"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      maxVersionIssue && !1
    ]
  }, void 0, !0, void 0, this);
}
var React128, import_react227, jsx_dev_runtime404;
var init_NativeAutoUpdater = __esm(() => {
  init_debug();
  init_log3();
  init_dist4();
  init_useUpdateNotification();
  init_ink2();
  init_autoUpdater();
  init_config4();
  init_nativeInstaller();
  init_settings2();
  React128 = __toESM(require_react_development(), 1), import_react227 = __toESM(require_react_development(), 1), jsx_dev_runtime404 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
