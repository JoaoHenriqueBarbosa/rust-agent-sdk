// Original: src/utils/sinks.ts
var exports_sinks = {};
__export(exports_sinks, {
  initSinks: () => initSinks
});
function initSinks() {
  initializeErrorLogSink(), initializeAnalyticsSink();
}
var init_sinks = __esm(() => {
  init_errorLogSink();
});
