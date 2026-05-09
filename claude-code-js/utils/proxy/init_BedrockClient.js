// var: init_BedrockClient
var init_BedrockClient = __esm(() => {
  init_dist_es16();
  init_httpAuthSchemeProvider();
  init_EndpointParameters();
  init_runtimeConfig();
  init_runtimeExtensions();
  import_middleware_host_header = __toESM(require_dist_cjs44(), 1), import_middleware_logger = __toESM(require_dist_cjs45(), 1), import_middleware_recursion_detection = __toESM(require_dist_cjs48(), 1), import_middleware_user_agent = __toESM(require_dist_cjs56(), 1), import_config_resolver2 = __toESM(require_dist_cjs58(), 1), import_core11 = __toESM(require_dist_cjs37(), 1), import_schema4 = __toESM(require_schema(), 1), import_middleware_content_length = __toESM(require_dist_cjs61(), 1), import_middleware_endpoint = __toESM(require_dist_cjs65(), 1), import_middleware_retry2 = __toESM(require_dist_cjs69(), 1);
  BedrockClient = class BedrockClient extends Client2 {
    config;
    constructor(...[configuration]) {
      let _config_0 = getRuntimeConfig2(configuration || {});
      super(_config_0);
      this.initConfig = _config_0;
      let _config_1 = resolveClientEndpointParameters(_config_0), _config_2 = import_middleware_user_agent.resolveUserAgentConfig(_config_1), _config_3 = import_middleware_retry2.resolveRetryConfig(_config_2), _config_4 = import_config_resolver2.resolveRegionConfig(_config_3), _config_5 = import_middleware_host_header.resolveHostHeaderConfig(_config_4), _config_6 = import_middleware_endpoint.resolveEndpointConfig(_config_5), _config_7 = resolveHttpAuthSchemeConfig(_config_6), _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
      this.config = _config_8, this.middlewareStack.use(import_schema4.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(import_middleware_user_agent.getUserAgentPlugin(this.config)), this.middlewareStack.use(import_middleware_retry2.getRetryPlugin(this.config)), this.middlewareStack.use(import_middleware_content_length.getContentLengthPlugin(this.config)), this.middlewareStack.use(import_middleware_host_header.getHostHeaderPlugin(this.config)), this.middlewareStack.use(import_middleware_logger.getLoggerPlugin(this.config)), this.middlewareStack.use(import_middleware_recursion_detection.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(import_core11.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: defaultBedrockHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (config4) => new import_core11.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config4.credentials,
          "smithy.api#httpBearerAuth": config4.token
        })
      })), this.middlewareStack.use(import_core11.getHttpSigningPlugin(this.config));
    }
    destroy() {
      super.destroy();
    }
  };
});
