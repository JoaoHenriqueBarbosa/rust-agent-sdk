// Original: src/context/fpsMetrics.tsx
function FpsMetricsProvider(t0) {
  let $3 = import_compiler_runtime280.c(3), {
    getFpsMetrics,
    children
  } = t0, t1;
  if ($3[0] !== children || $3[1] !== getFpsMetrics)
    t1 = /* @__PURE__ */ jsx_dev_runtime363.jsxDEV(FpsMetricsContext.Provider, {
      value: getFpsMetrics,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = getFpsMetrics, $3[2] = t1;
  else
    t1 = $3[2];
  return t1;
}
function useFpsMetrics() {
  return import_react195.useContext(FpsMetricsContext);
}
var import_compiler_runtime280, import_react195, jsx_dev_runtime363, FpsMetricsContext;
var init_fpsMetrics = __esm(() => {
  import_compiler_runtime280 = __toESM(require_react_compiler_runtime_development(), 1), import_react195 = __toESM(require_react_development(), 1), jsx_dev_runtime363 = __toESM(require_react_jsx_dev_runtime_development(), 1), FpsMetricsContext = import_react195.createContext(void 0);
});
