// Original: src/hooks/useLspPluginRecommendation.tsx
import { extname as extname14, join as join146 } from "path";
function useLspPluginRecommendation() {
  let $3 = import_compiler_runtime348.c(12), trackedFiles = useAppState(_temp234), {
    addNotification
  } = useNotifications(), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ new Set, $3[0] = t0;
  else
    t0 = $3[0];
  let checkedFilesRef = React143.useRef(t0), {
    recommendation,
    clearRecommendation,
    tryResolve
  } = usePluginRecommendationBase(), t1, t2;
  if ($3[1] !== trackedFiles || $3[2] !== tryResolve)
    t1 = () => {
      tryResolve(async () => {
        if (hasShownLspRecommendationThisSession())
          return null;
        let newFiles = [];
        for (let file2 of trackedFiles)
          if (!checkedFilesRef.current.has(file2))
            checkedFilesRef.current.add(file2), newFiles.push(file2);
        for (let filePath of newFiles)
          try {
            let match = (await getMatchingLspPlugins(filePath))[0];
            if (match)
              return logForDebugging(`[useLspPluginRecommendation] Found match: ${match.pluginName} for ${filePath}`), setLspRecommendationShownThisSession(!0), {
                pluginId: match.pluginId,
                pluginName: match.pluginName,
                pluginDescription: match.description,
                fileExtension: extname14(filePath),
                shownAt: Date.now()
              };
          } catch (t32) {
            logError2(t32);
          }
        return null;
      });
    }, t2 = [trackedFiles, tryResolve], $3[1] = trackedFiles, $3[2] = tryResolve, $3[3] = t1, $3[4] = t2;
  else
    t1 = $3[3], t2 = $3[4];
  React143.useEffect(t1, t2);
  let t3;
  if ($3[5] !== addNotification || $3[6] !== clearRecommendation || $3[7] !== recommendation)
    t3 = (response7) => {
      if (!recommendation)
        return;
      let {
        pluginId,
        pluginName,
        shownAt
      } = recommendation;
      logForDebugging(`[useLspPluginRecommendation] User response: ${response7} for ${pluginName}`);
      bb60:
        switch (response7) {
          case "yes": {
            installPluginAndNotify(pluginId, pluginName, "lsp-plugin", addNotification, async (pluginData) => {
              logForDebugging(`[useLspPluginRecommendation] Installing plugin: ${pluginId}`);
              let localSourcePath = typeof pluginData.entry.source === "string" ? join146(pluginData.marketplaceInstallLocation, pluginData.entry.source) : void 0;
              await cacheAndRegisterPlugin(pluginId, pluginData.entry, "user", void 0, localSourcePath);
              let settings = getSettingsForSource("userSettings");
              updateSettingsForSource("userSettings", {
                enabledPlugins: {
                  ...settings?.enabledPlugins,
                  [pluginId]: !0
                }
              }), logForDebugging(`[useLspPluginRecommendation] Plugin installed: ${pluginId}`);
            });
            break bb60;
          }
          case "no": {
            let elapsed = Date.now() - shownAt;
            if (elapsed >= TIMEOUT_THRESHOLD_MS)
              logForDebugging(`[useLspPluginRecommendation] Timeout detected (${elapsed}ms), incrementing ignored count`), incrementIgnoredCount();
            break bb60;
          }
          case "never": {
            addToNeverSuggest(pluginId);
            break bb60;
          }
          case "disable":
            saveGlobalConfig(_temp287);
        }
      clearRecommendation();
    }, $3[5] = addNotification, $3[6] = clearRecommendation, $3[7] = recommendation, $3[8] = t3;
  else
    t3 = $3[8];
  let handleResponse = t3, t4;
  if ($3[9] !== handleResponse || $3[10] !== recommendation)
    t4 = {
      recommendation,
      handleResponse
    }, $3[9] = handleResponse, $3[10] = recommendation, $3[11] = t4;
  else
    t4 = $3[11];
  return t4;
}
function _temp287(current) {
  if (current.lspRecommendationDisabled)
    return current;
  return {
    ...current,
    lspRecommendationDisabled: !0
  };
}
function _temp234(s2) {
  return s2.fileHistory.trackedFiles;
}
var import_compiler_runtime348, React143, TIMEOUT_THRESHOLD_MS = 28000;
var init_useLspPluginRecommendation = __esm(() => {
  init_state();
  init_notifications();
  init_AppState();
  init_config4();
  init_debug();
  init_log3();
  init_lspRecommendation();
  init_pluginInstallationHelpers();
  init_settings2();
  init_usePluginRecommendationBase();
  import_compiler_runtime348 = __toESM(require_react_compiler_runtime_development(), 1), React143 = __toESM(require_react_development(), 1);
});
