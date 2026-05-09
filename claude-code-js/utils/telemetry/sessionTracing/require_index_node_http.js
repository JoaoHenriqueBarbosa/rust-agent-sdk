// var: require_index_node_http
var require_index_node_http = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.convertLegacyHttpOptions = exports.getSharedConfigurationFromEnvironment = exports.createOtlpHttpExportDelegate = exports.httpAgentFactoryFromOptions = void 0;
  var otlp_node_http_configuration_1 = require_otlp_node_http_configuration();
  Object.defineProperty(exports, "httpAgentFactoryFromOptions", { enumerable: !0, get: function() {
    return otlp_node_http_configuration_1.httpAgentFactoryFromOptions;
  } });
  var otlp_http_export_delegate_1 = require_otlp_http_export_delegate();
  Object.defineProperty(exports, "createOtlpHttpExportDelegate", { enumerable: !0, get: function() {
    return otlp_http_export_delegate_1.createOtlpHttpExportDelegate;
  } });
  var shared_env_configuration_1 = require_shared_env_configuration();
  Object.defineProperty(exports, "getSharedConfigurationFromEnvironment", { enumerable: !0, get: function() {
    return shared_env_configuration_1.getSharedConfigurationFromEnvironment;
  } });
  var convert_legacy_node_http_options_1 = require_convert_legacy_node_http_options();
  Object.defineProperty(exports, "convertLegacyHttpOptions", { enumerable: !0, get: function() {
    return convert_legacy_node_http_options_1.convertLegacyHttpOptions;
  } });
});
