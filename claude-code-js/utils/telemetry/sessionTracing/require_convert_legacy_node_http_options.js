// var: require_convert_legacy_node_http_options
var require_convert_legacy_node_http_options = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.convertLegacyHttpOptions = void 0;
  var api_1 = require_src7(), otlp_node_http_configuration_1 = require_otlp_node_http_configuration(), index_node_http_1 = require_index_node_http(), otlp_node_http_env_configuration_1 = require_otlp_node_http_env_configuration(), convert_legacy_http_options_1 = require_convert_legacy_http_options();
  function convertLegacyAgentOptions(config10) {
    if (typeof config10.httpAgentOptions === "function")
      return config10.httpAgentOptions;
    let legacy = config10.httpAgentOptions;
    if (config10.keepAlive != null)
      legacy = { keepAlive: config10.keepAlive, ...legacy };
    if (legacy != null)
      return (0, index_node_http_1.httpAgentFactoryFromOptions)(legacy);
    else
      return;
  }
  function convertLegacyHttpOptions(config10, signalIdentifier, signalResourcePath, requiredHeaders) {
    if (config10.metadata)
      api_1.diag.warn("Metadata cannot be set when using http");
    return (0, otlp_node_http_configuration_1.mergeOtlpNodeHttpConfigurationWithDefaults)({
      url: config10.url,
      headers: (0, convert_legacy_http_options_1.convertLegacyHeaders)(config10),
      concurrencyLimit: config10.concurrencyLimit,
      timeoutMillis: config10.timeoutMillis,
      compression: config10.compression,
      agentFactory: convertLegacyAgentOptions(config10),
      userAgent: config10.userAgent
    }, (0, otlp_node_http_env_configuration_1.getNodeHttpConfigurationFromEnvironment)(signalIdentifier, signalResourcePath), (0, otlp_node_http_configuration_1.getNodeHttpConfigurationDefaults)(requiredHeaders, signalResourcePath));
  }
  exports.convertLegacyHttpOptions = convertLegacyHttpOptions;
});
