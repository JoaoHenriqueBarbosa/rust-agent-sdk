// var: init_sessionTracing
var init_sessionTracing = __esm(() => {
  init_envUtils();
  init_telemetryAttributes();
  init_betaSessionTracing();
  init_perfettoTracing();
  import_api10 = __toESM(require_src7(), 1), interactionContext = new AsyncLocalStorage5, toolContext = new AsyncLocalStorage5, activeSpans = /* @__PURE__ */ new Map, strongSpans = /* @__PURE__ */ new Map;
});
