// var: init_BedrockRuntimeClient
var init_BedrockRuntimeClient = __esm(() => {
  init_dist_es23();
  init_dist_es29();
  init_dist_es30();
  init_dist_es32();
  init_httpAuthSchemeProvider2();
  init_EndpointParameters2();
  init_runtimeConfig2();
  init_runtimeExtensions2();
  import_middleware_host_header2 = __toESM(require_dist_cjs44(), 1), import_middleware_logger2 = __toESM(require_dist_cjs45(), 1), import_middleware_recursion_detection2 = __toESM(require_dist_cjs48(), 1), import_middleware_user_agent2 = __toESM(require_dist_cjs56(), 1), import_config_resolver4 = __toESM(require_dist_cjs58(), 1), import_core33 = __toESM(require_dist_cjs37(), 1), import_schema7 = __toESM(require_schema(), 1), import_middleware_content_length2 = __toESM(require_dist_cjs61(), 1), import_middleware_endpoint103 = __toESM(require_dist_cjs65(), 1), import_middleware_retry4 = __toESM(require_dist_cjs69(), 1);
  BedrockRuntimeClient = class BedrockRuntimeClient extends Client3 {
    config;
    constructor(...[configuration]) {
      let _config_0 = getRuntimeConfig4(configuration || {});
      super(_config_0);
      this.initConfig = _config_0;
      let _config_1 = resolveClientEndpointParameters2(_config_0), _config_2 = import_middleware_user_agent2.resolveUserAgentConfig(_config_1), _config_3 = import_middleware_retry4.resolveRetryConfig(_config_2), _config_4 = import_config_resolver4.resolveRegionConfig(_config_3), _config_5 = import_middleware_host_header2.resolveHostHeaderConfig(_config_4), _config_6 = import_middleware_endpoint103.resolveEndpointConfig(_config_5), _config_7 = resolveEventStreamSerdeConfig(_config_6), _config_8 = resolveHttpAuthSchemeConfig2(_config_7), _config_9 = resolveEventStreamConfig(_config_8), _config_10 = resolveWebSocketConfig(_config_9), _config_11 = resolveRuntimeExtensions2(_config_10, configuration?.extensions || []);
      this.config = _config_11, this.middlewareStack.use(import_schema7.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(import_middleware_user_agent2.getUserAgentPlugin(this.config)), this.middlewareStack.use(import_middleware_retry4.getRetryPlugin(this.config)), this.middlewareStack.use(import_middleware_content_length2.getContentLengthPlugin(this.config)), this.middlewareStack.use(import_middleware_host_header2.getHostHeaderPlugin(this.config)), this.middlewareStack.use(import_middleware_logger2.getLoggerPlugin(this.config)), this.middlewareStack.use(import_middleware_recursion_detection2.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(import_core33.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: defaultBedrockRuntimeHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (config5) => new import_core33.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config5.credentials,
          "smithy.api#httpBearerAuth": config5.token
        })
      })), this.middlewareStack.use(import_core33.getHttpSigningPlugin(this.config));
    }
    destroy() {
      super.destroy();
    }
  };
});
