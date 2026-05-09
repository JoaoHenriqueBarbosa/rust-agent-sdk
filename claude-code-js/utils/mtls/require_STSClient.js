// var: require_STSClient
var require_STSClient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.STSClient = exports.__Client = void 0;
  var middleware_host_header_1 = require_dist_cjs44(), middleware_logger_1 = require_dist_cjs45(), middleware_recursion_detection_1 = require_dist_cjs48(), middleware_user_agent_1 = require_dist_cjs56(), config_resolver_1 = require_dist_cjs58(), core_1 = require_dist_cjs37(), schema_1 = require_schema(), middleware_content_length_1 = require_dist_cjs61(), middleware_endpoint_1 = require_dist_cjs65(), middleware_retry_1 = require_dist_cjs69(), smithy_client_1 = require_dist_cjs71();
  Object.defineProperty(exports, "__Client", { enumerable: !0, get: function() {
    return smithy_client_1.Client;
  } });
  var httpAuthSchemeProvider_1 = require_httpAuthSchemeProvider3(), EndpointParameters_1 = require_EndpointParameters(), runtimeConfig_1 = require_runtimeConfig3(), runtimeExtensions_1 = require_runtimeExtensions();

  class STSClient extends smithy_client_1.Client {
    config;
    constructor(...[configuration]) {
      let _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration || {});
      super(_config_0);
      this.initConfig = _config_0;
      let _config_1 = (0, EndpointParameters_1.resolveClientEndpointParameters)(_config_0), _config_2 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_1), _config_3 = (0, middleware_retry_1.resolveRetryConfig)(_config_2), _config_4 = (0, config_resolver_1.resolveRegionConfig)(_config_3), _config_5 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_4), _config_6 = (0, middleware_endpoint_1.resolveEndpointConfig)(_config_5), _config_7 = (0, httpAuthSchemeProvider_1.resolveHttpAuthSchemeConfig)(_config_6), _config_8 = (0, runtimeExtensions_1.resolveRuntimeExtensions)(_config_7, configuration?.extensions || []);
      this.config = _config_8, this.middlewareStack.use((0, schema_1.getSchemaSerdePlugin)(this.config)), this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config)), this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, core_1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: httpAuthSchemeProvider_1.defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (config3) => new core_1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config3.credentials
        })
      })), this.middlewareStack.use((0, core_1.getHttpSigningPlugin)(this.config));
    }
    destroy() {
      super.destroy();
    }
  }
  exports.STSClient = STSClient;
});
