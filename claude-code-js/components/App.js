// Original: src/components/App.tsx
var exports_App = {};
__export(exports_App, {
  App: () => App2
});
function App2(t0) {
  let $3 = import_compiler_runtime282.c(9), {
    getFpsMetrics,
    stats: stats2,
    initialState,
    children
  } = t0, t1;
  if ($3[0] !== children || $3[1] !== initialState)
    t1 = /* @__PURE__ */ jsx_dev_runtime365.jsxDEV(AppStateProvider, {
      initialState,
      onChangeAppState,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = initialState, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== stats2 || $3[4] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime365.jsxDEV(StatsProvider, {
      store: stats2,
      children: t1
    }, void 0, !1, void 0, this), $3[3] = stats2, $3[4] = t1, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== getFpsMetrics || $3[7] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime365.jsxDEV(FpsMetricsProvider, {
      getFpsMetrics,
      children: t2
    }, void 0, !1, void 0, this), $3[6] = getFpsMetrics, $3[7] = t2, $3[8] = t3;
  else
    t3 = $3[8];
  return t3;
}
var import_compiler_runtime282, jsx_dev_runtime365;
var init_App2 = __esm(() => {
  init_fpsMetrics();
  init_stats4();
  init_AppState();
  init_onChangeAppState();
  import_compiler_runtime282 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime365 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
