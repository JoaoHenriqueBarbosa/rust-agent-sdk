// var: require_runtimeConfig5
var require_runtimeConfig5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRuntimeConfig = void 0;
  var tslib_1 = require_tslib(), package_json_1 = tslib_1.__importDefault(require_package()), client_1 = require_client(), httpAuthSchemes_1 = require_httpAuthSchemes(), util_user_agent_node_1 = require_dist_cjs72(), config_resolver_1 = require_dist_cjs58(), hash_node_1 = require_dist_cjs75(), middleware_retry_1 = require_dist_cjs69(), node_config_provider_1 = require_dist_cjs9(), node_http_handler_1 = require_dist_cjs5(), smithy_client_1 = require_dist_cjs71(), util_body_length_node_1 = require_dist_cjs76(), util_defaults_mode_node_1 = require_dist_cjs77(), util_retry_1 = require_dist_cjs55(), runtimeConfig_shared_1 = require_runtimeConfig_shared5(), getRuntimeConfig7 = (config6) => {
    (0, smithy_client_1.emitWarningIfUnsupportedVersion)(process.version);
    let defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config6), defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode), clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config6);
    (0, client_1.emitWarningIfUnsupportedVersion)(process.version);
    let loaderConfig = {
      profile: config6?.profile,
      logger: clientSharedValues.logger
    };
    return {
      ...clientSharedValues,
      ...config6,
      runtime: "node",
      defaultsMode,
      authSchemePreference: config6?.authSchemePreference ?? (0, node_config_provider_1.loadConfig)(httpAuthSchemes_1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
      bodyLengthChecker: config6?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
      defaultUserAgentProvider: config6?.defaultUserAgentProvider ?? (0, util_user_agent_node_1.createDefaultUserAgentProvider)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
      maxAttempts: config6?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config6),
      region: config6?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, { ...config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
      requestHandler: node_http_handler_1.NodeHttpHandler.create(config6?.requestHandler ?? defaultConfigProvider),
      retryMode: config6?.retryMode ?? (0, node_config_provider_1.loadConfig)({
        ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
        default: async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE
      }, config6),
      sha256: config6?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
      streamCollector: config6?.streamCollector ?? node_http_handler_1.streamCollector,
      useDualstackEndpoint: config6?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
      useFipsEndpoint: config6?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
      userAgentAppId: config6?.userAgentAppId ?? (0, node_config_provider_1.loadConfig)(util_user_agent_node_1.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
    };
  };
  exports.getRuntimeConfig = getRuntimeConfig7;
});
