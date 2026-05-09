// var: init_OTLPTraceExporter
var init_OTLPTraceExporter = __esm(() => {
  init_esm22();
  import_otlp_exporter_base3 = __toESM(require_src12(), 1), import_node_http6 = __toESM(require_index_node_http(), 1);
  OTLPTraceExporter = class OTLPTraceExporter extends import_otlp_exporter_base3.OTLPExporterBase {
    constructor(config10 = {}) {
      super(import_node_http6.createOtlpHttpExportDelegate(import_node_http6.convertLegacyHttpOptions(config10, "TRACES", "v1/traces", {
        "Content-Type": "application/json"
      }), JsonTraceSerializer));
    }
  };
});
