// var: init_OTLPLogExporter
var init_OTLPLogExporter = __esm(() => {
  init_esm22();
  import_otlp_exporter_base2 = __toESM(require_src12(), 1), import_node_http5 = __toESM(require_index_node_http(), 1);
  OTLPLogExporter = class OTLPLogExporter extends import_otlp_exporter_base2.OTLPExporterBase {
    constructor(config10 = {}) {
      super(import_node_http5.createOtlpHttpExportDelegate(import_node_http5.convertLegacyHttpOptions(config10, "LOGS", "v1/logs", {
        "Content-Type": "application/json"
      }), JsonLogsSerializer));
    }
  };
});
