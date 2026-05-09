// var: require_src12
var require_src12 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createOtlpNetworkExportDelegate = exports.CompressionAlgorithm = exports.getSharedConfigurationDefaults = exports.mergeOtlpSharedConfigurationWithDefaults = exports.OTLPExporterError = exports.OTLPExporterBase = void 0;
  var OTLPExporterBase_1 = require_OTLPExporterBase();
  Object.defineProperty(exports, "OTLPExporterBase", { enumerable: !0, get: function() {
    return OTLPExporterBase_1.OTLPExporterBase;
  } });
  var types_1 = require_types5();
  Object.defineProperty(exports, "OTLPExporterError", { enumerable: !0, get: function() {
    return types_1.OTLPExporterError;
  } });
  var shared_configuration_1 = require_shared_configuration();
  Object.defineProperty(exports, "mergeOtlpSharedConfigurationWithDefaults", { enumerable: !0, get: function() {
    return shared_configuration_1.mergeOtlpSharedConfigurationWithDefaults;
  } });
  Object.defineProperty(exports, "getSharedConfigurationDefaults", { enumerable: !0, get: function() {
    return shared_configuration_1.getSharedConfigurationDefaults;
  } });
  var legacy_node_configuration_1 = require_legacy_node_configuration();
  Object.defineProperty(exports, "CompressionAlgorithm", { enumerable: !0, get: function() {
    return legacy_node_configuration_1.CompressionAlgorithm;
  } });
  var otlp_network_export_delegate_1 = require_otlp_network_export_delegate();
  Object.defineProperty(exports, "createOtlpNetworkExportDelegate", { enumerable: !0, get: function() {
    return otlp_network_export_delegate_1.createOtlpNetworkExportDelegate;
  } });
});
