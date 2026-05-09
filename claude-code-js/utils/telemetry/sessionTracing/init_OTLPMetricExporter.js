// var: init_OTLPMetricExporter
var init_OTLPMetricExporter = __esm(() => {
  init_OTLPMetricExporterBase();
  init_esm22();
  import_node_http4 = __toESM(require_index_node_http(), 1);
  OTLPMetricExporter = class OTLPMetricExporter extends OTLPMetricExporterBase {
    constructor(config10) {
      super(import_node_http4.createOtlpHttpExportDelegate(import_node_http4.convertLegacyHttpOptions(config10 ?? {}, "METRICS", "v1/metrics", {
        "Content-Type": "application/json"
      }), JsonMetricsSerializer), config10);
    }
  };
});
