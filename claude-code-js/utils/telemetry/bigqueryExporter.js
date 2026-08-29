// Original: src/utils/telemetry/bigqueryExporter.ts
class BigQueryMetricsExporter {
  selectAggregationTemporality() {
    return import_sdk_metrics.AggregationTemporality.CUMULATIVE;
  }
  async export(_metrics, resultCallback) {
    resultCallback({ code: import_core57.ExportResultCode.SUCCESS });
  }
  async shutdown() {}
  async forceFlush() {}
}
var import_core57, import_sdk_metrics;
var init_bigqueryExporter = __esm(() => {
  import_core57 = __toESM(require_src9(), 1), import_sdk_metrics = __toESM(require_src11(), 1);
});
