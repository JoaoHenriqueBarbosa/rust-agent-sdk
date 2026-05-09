// var: require_otlp_node_http_configuration
var require_otlp_node_http_configuration = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getNodeHttpConfigurationDefaults = exports.mergeOtlpNodeHttpConfigurationWithDefaults = exports.httpAgentFactoryFromOptions = void 0;
  var otlp_http_configuration_1 = require_otlp_http_configuration();
  function httpAgentFactoryFromOptions(options2) {
    return async (protocol) => {
      let isInsecure = protocol === "http:", module2 = isInsecure ? import("http") : import("https"), { Agent: Agent2 } = await module2;
      if (isInsecure) {
        let { ca, cert, key: key2, ...insecureOptions } = options2;
        return new Agent2(insecureOptions);
      }
      return new Agent2(options2);
    };
  }
  exports.httpAgentFactoryFromOptions = httpAgentFactoryFromOptions;
  function mergeOtlpNodeHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    return {
      ...(0, otlp_http_configuration_1.mergeOtlpHttpConfigurationWithDefaults)(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
      agentFactory: userProvidedConfiguration.agentFactory ?? fallbackConfiguration.agentFactory ?? defaultConfiguration.agentFactory,
      userAgent: userProvidedConfiguration.userAgent
    };
  }
  exports.mergeOtlpNodeHttpConfigurationWithDefaults = mergeOtlpNodeHttpConfigurationWithDefaults;
  function getNodeHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
    return {
      ...(0, otlp_http_configuration_1.getHttpConfigurationDefaults)(requiredHeaders, signalResourcePath),
      agentFactory: httpAgentFactoryFromOptions({ keepAlive: !0 })
    };
  }
  exports.getNodeHttpConfigurationDefaults = getNodeHttpConfigurationDefaults;
});
