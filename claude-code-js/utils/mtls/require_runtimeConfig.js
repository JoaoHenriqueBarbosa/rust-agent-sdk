// var: require_runtimeConfig
var require_runtimeConfig = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRuntimeConfig = void 0;
  var tslib_1 = require_tslib(), package_json_1 = tslib_1.__importDefault(require_package()), client_1 = require_client(), httpAuthSchemes_1 = require_httpAuthSchemes(), util_user_agent_node_1 = require_dist_cjs72(), config_resolver_1 = require_dist_cjs58(), hash_node_1 = require_dist_cjs75(), middleware_retry_1 = require_dist_cjs69(), node_config_provider_1 = require_dist_cjs9(), node_http_handler_1 = require_dist_cjs5(), smithy_client_1 = require_dist_cjs71(), util_body_length_node_1 = require_dist_cjs76(), util_defaults_mode_node_1 = require_dist_cjs77(), util_retry_1 = require_dist_cjs55(), runtimeConfig_shared_1 = require_runtimeConfig_shared(), getRuntimeConfig = (config3) => {
    (0, smithy_client_1.emitWarningIfUnsupportedVersion)(process.version);
    let defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config3), defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode), clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config3);
    (0, client_1.emitWarningIfUnsupportedVersion)(process.version);
    let loaderConfig = {
      profile: config3?.profile,
      logger: clientSharedValues.logger
    };
    return {
      ...clientSharedValues,
      ...config3,
      runtime: "node",
      defaultsMode,
      authSchemePreference: config3?.authSchemePreference ?? (0, node_config_provider_1.loadConfig)(httpAuthSchemes_1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
      bodyLengthChecker: config3?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
      defaultUserAgentProvider: config3?.defaultUserAgentProvider ?? (0, util_user_agent_node_1.createDefaultUserAgentProvider)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
      maxAttempts: config3?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config3),
      region: config3?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, { ...config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
      requestHandler: node_http_handler_1.NodeHttpHandler.create(config3?.requestHandler ?? defaultConfigProvider),
      retryMode: config3?.retryMode ?? (0, node_config_provider_1.loadConfig)({
        ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
        default: async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE
      }, config3),
      sha256: config3?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
      streamCollector: config3?.streamCollector ?? node_http_handler_1.streamCollector,
      useDualstackEndpoint: config3?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
      useFipsEndpoint: config3?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
      userAgentAppId: config3?.userAgentAppId ?? (0, node_config_provider_1.loadConfig)(util_user_agent_node_1.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
    };
  };
  exports.getRuntimeConfig = getRuntimeConfig;
});
