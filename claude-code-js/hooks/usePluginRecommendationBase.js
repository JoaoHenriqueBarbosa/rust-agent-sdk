// Original: src/hooks/usePluginRecommendationBase.tsx
function usePluginRecommendationBase() {
  let $3 = import_compiler_runtime347.c(6), [recommendation, setRecommendation] = React142.useState(null), isCheckingRef = React142.useRef(!1), t0;
  if ($3[0] !== recommendation)
    t0 = (resolve46) => {
      if (getIsRemoteMode())
        return;
      if (recommendation)
        return;
      if (isCheckingRef.current)
        return;
      isCheckingRef.current = !0, resolve46().then((rec) => {
        if (rec)
          setRecommendation(rec);
      }).catch(logError2).finally(() => {
        isCheckingRef.current = !1;
      });
    }, $3[0] = recommendation, $3[1] = t0;
  else
    t0 = $3[1];
  let tryResolve = t0, t1;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => setRecommendation(null), $3[2] = t1;
  else
    t1 = $3[2];
  let clearRecommendation = t1, t2;
  if ($3[3] !== recommendation || $3[4] !== tryResolve)
    t2 = {
      recommendation,
      clearRecommendation,
      tryResolve
    }, $3[3] = recommendation, $3[4] = tryResolve, $3[5] = t2;
  else
    t2 = $3[5];
  return t2;
}
async function installPluginAndNotify(pluginId, pluginName, keyPrefix, addNotification, install) {
  try {
    let pluginData = await getPluginById(pluginId);
    if (!pluginData)
      throw Error(`Plugin ${pluginId} not found in marketplace`);
    await install(pluginData), addNotification({
      key: `${keyPrefix}-installed`,
      jsx: /* @__PURE__ */ jsx_dev_runtime446.jsxDEV(ThemedText, {
        color: "success",
        children: [
          figures_default.tick,
          " ",
          pluginName,
          " installed \xB7 restart to apply"
        ]
      }, void 0, !0, void 0, this),
      priority: "immediate",
      timeoutMs: 5000
    });
  } catch (error44) {
    logError2(error44), addNotification({
      key: `${keyPrefix}-install-failed`,
      jsx: /* @__PURE__ */ jsx_dev_runtime446.jsxDEV(ThemedText, {
        color: "error",
        children: [
          "Failed to install ",
          pluginName
        ]
      }, void 0, !0, void 0, this),
      priority: "immediate",
      timeoutMs: 5000
    });
  }
}
var import_compiler_runtime347, React142, jsx_dev_runtime446;
var init_usePluginRecommendationBase = __esm(() => {
  init_figures();
  init_state();
  init_ink2();
  init_log3();
  init_marketplaceManager();
  import_compiler_runtime347 = __toESM(require_react_compiler_runtime_development(), 1), React142 = __toESM(require_react_development(), 1), jsx_dev_runtime446 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
