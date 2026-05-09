// var: init_STSClient
var init_STSClient = __esm(() => {
  init_dist_es41();
  init_httpAuthSchemeProvider3();
  init_EndpointParameters3();
  init_runtimeConfig3();
  init_runtimeExtensions3();
  import_middleware_host_header3 = __toESM(require_dist_cjs44(), 1), import_middleware_logger3 = __toESM(require_dist_cjs45(), 1), import_middleware_recursion_detection3 = __toESM(require_dist_cjs48(), 1), import_middleware_user_agent3 = __toESM(require_dist_cjs56(), 1), import_config_resolver6 = __toESM(require_dist_cjs58(), 1), import_core37 = __toESM(require_dist_cjs37(), 1), import_schema10 = __toESM(require_schema(), 1), import_middleware_content_length3 = __toESM(require_dist_cjs61(), 1), import_middleware_endpoint114 = __toESM(require_dist_cjs65(), 1), import_middleware_retry6 = __toESM(require_dist_cjs69(), 1);
  STSClient = class STSClient extends Client4 {
    config;
    constructor(...[configuration]) {
      let _config_0 = getRuntimeConfig6(configuration || {});
      super(_config_0);
      this.initConfig = _config_0;
      let _config_1 = resolveClientEndpointParameters3(_config_0), _config_2 = import_middleware_user_agent3.resolveUserAgentConfig(_config_1), _config_3 = import_middleware_retry6.resolveRetryConfig(_config_2), _config_4 = import_config_resolver6.resolveRegionConfig(_config_3), _config_5 = import_middleware_host_header3.resolveHostHeaderConfig(_config_4), _config_6 = import_middleware_endpoint114.resolveEndpointConfig(_config_5), _config_7 = resolveHttpAuthSchemeConfig3(_config_6), _config_8 = resolveRuntimeExtensions3(_config_7, configuration?.extensions || []);
      this.config = _config_8, this.middlewareStack.use(import_schema10.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(import_middleware_user_agent3.getUserAgentPlugin(this.config)), this.middlewareStack.use(import_middleware_retry6.getRetryPlugin(this.config)), this.middlewareStack.use(import_middleware_content_length3.getContentLengthPlugin(this.config)), this.middlewareStack.use(import_middleware_host_header3.getHostHeaderPlugin(this.config)), this.middlewareStack.use(import_middleware_logger3.getLoggerPlugin(this.config)), this.middlewareStack.use(import_middleware_recursion_detection3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(import_core37.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: defaultSTSHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (config6) => new import_core37.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config6.credentials
        })
      })), this.middlewareStack.use(import_core37.getHttpSigningPlugin(this.config));
    }
    destroy() {
      super.destroy();
    }
  };
});
