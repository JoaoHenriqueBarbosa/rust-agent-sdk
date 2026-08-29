// var: require_sso_oidc
var require_sso_oidc = __commonJS((exports) => {
  var middlewareHostHeader = require_dist_cjs44(), middlewareLogger = require_dist_cjs45(), middlewareRecursionDetection = require_dist_cjs48(), middlewareUserAgent = require_dist_cjs56(), configResolver = require_dist_cjs58(), core2 = require_dist_cjs37(), schema2 = require_schema(), middlewareContentLength = require_dist_cjs61(), middlewareEndpoint = require_dist_cjs65(), middlewareRetry = require_dist_cjs69(), smithyClient = require_dist_cjs71(), httpAuthSchemeProvider = require_httpAuthSchemeProvider(), runtimeConfig = require_runtimeConfig(), regionConfigResolver = require_dist_cjs87(), protocolHttp = require_dist_cjs88(), schemas_0 = require_schemas_0(), errors3 = require_errors(), SSOOIDCServiceException = require_SSOOIDCServiceException(), resolveClientEndpointParameters = (options) => {
    return Object.assign(options, {
      useDualstackEndpoint: options.useDualstackEndpoint ?? !1,
      useFipsEndpoint: options.useFipsEndpoint ?? !1,
      defaultSigningName: "sso-oauth"
    });
  }, commonParams = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
  }, getHttpAuthExtensionConfiguration = (runtimeConfig2) => {
    let { httpAuthSchemes: _httpAuthSchemes, httpAuthSchemeProvider: _httpAuthSchemeProvider, credentials: _credentials } = runtimeConfig2;
    return {
      setHttpAuthScheme(httpAuthScheme) {
        let index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
        if (index === -1)
          _httpAuthSchemes.push(httpAuthScheme);
        else
          _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      },
      httpAuthSchemes() {
        return _httpAuthSchemes;
      },
      setHttpAuthSchemeProvider(httpAuthSchemeProvider2) {
        _httpAuthSchemeProvider = httpAuthSchemeProvider2;
      },
      httpAuthSchemeProvider() {
        return _httpAuthSchemeProvider;
      },
      setCredentials(credentials) {
        _credentials = credentials;
      },
      credentials() {
        return _credentials;
      }
    };
  }, resolveHttpAuthRuntimeConfig = (config3) => {
    return {
      httpAuthSchemes: config3.httpAuthSchemes(),
      httpAuthSchemeProvider: config3.httpAuthSchemeProvider(),
      credentials: config3.credentials()
    };
  }, resolveRuntimeExtensions = (runtimeConfig2, extensions4) => {
    let extensionConfiguration = Object.assign(regionConfigResolver.getAwsRegionExtensionConfiguration(runtimeConfig2), smithyClient.getDefaultExtensionConfiguration(runtimeConfig2), protocolHttp.getHttpHandlerExtensionConfiguration(runtimeConfig2), getHttpAuthExtensionConfiguration(runtimeConfig2));
    return extensions4.forEach((extension) => extension.configure(extensionConfiguration)), Object.assign(runtimeConfig2, regionConfigResolver.resolveAwsRegionExtensionConfiguration(extensionConfiguration), smithyClient.resolveDefaultRuntimeConfig(extensionConfiguration), protocolHttp.resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
  };

  class SSOOIDCClient extends smithyClient.Client {
    config;
    constructor(...[configuration]) {
      let _config_0 = runtimeConfig.getRuntimeConfig(configuration || {});
      super(_config_0);
      this.initConfig = _config_0;
      let _config_1 = resolveClientEndpointParameters(_config_0), _config_2 = middlewareUserAgent.resolveUserAgentConfig(_config_1), _config_3 = middlewareRetry.resolveRetryConfig(_config_2), _config_4 = configResolver.resolveRegionConfig(_config_3), _config_5 = middlewareHostHeader.resolveHostHeaderConfig(_config_4), _config_6 = middlewareEndpoint.resolveEndpointConfig(_config_5), _config_7 = httpAuthSchemeProvider.resolveHttpAuthSchemeConfig(_config_6), _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
      this.config = _config_8, this.middlewareStack.use(schema2.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(middlewareUserAgent.getUserAgentPlugin(this.config)), this.middlewareStack.use(middlewareRetry.getRetryPlugin(this.config)), this.middlewareStack.use(middlewareContentLength.getContentLengthPlugin(this.config)), this.middlewareStack.use(middlewareHostHeader.getHostHeaderPlugin(this.config)), this.middlewareStack.use(middlewareLogger.getLoggerPlugin(this.config)), this.middlewareStack.use(middlewareRecursionDetection.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(core2.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: httpAuthSchemeProvider.defaultSSOOIDCHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (config3) => new core2.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config3.credentials
        })
      })), this.middlewareStack.use(core2.getHttpSigningPlugin(this.config));
    }
    destroy() {
      super.destroy();
    }
  }

  class CreateTokenCommand extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command2, cs, config3, o2) {
    return [middlewareEndpoint.getEndpointPlugin(config3, Command2.getEndpointParameterInstructions())];
  }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").sc(schemas_0.CreateToken$).build() {
  }
  var commands = {
    CreateTokenCommand
  };

  class SSOOIDC extends SSOOIDCClient {
  }
  smithyClient.createAggregatedClient(commands, SSOOIDC);
  var AccessDeniedExceptionReason = {
    KMS_ACCESS_DENIED: "KMS_AccessDeniedException"
  }, InvalidRequestExceptionReason = {
    KMS_DISABLED_KEY: "KMS_DisabledException",
    KMS_INVALID_KEY_USAGE: "KMS_InvalidKeyUsageException",
    KMS_INVALID_STATE: "KMS_InvalidStateException",
    KMS_KEY_NOT_FOUND: "KMS_NotFoundException"
  };
  exports.$Command = smithyClient.Command;
  exports.__Client = smithyClient.Client;
  exports.SSOOIDCServiceException = SSOOIDCServiceException.SSOOIDCServiceException;
  exports.AccessDeniedExceptionReason = AccessDeniedExceptionReason;
  exports.CreateTokenCommand = CreateTokenCommand;
  exports.InvalidRequestExceptionReason = InvalidRequestExceptionReason;
  exports.SSOOIDC = SSOOIDC;
  exports.SSOOIDCClient = SSOOIDCClient;
  Object.prototype.hasOwnProperty.call(schemas_0, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: schemas_0.__proto__
  });
  Object.keys(schemas_0).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = schemas_0[k];
  });
  Object.prototype.hasOwnProperty.call(errors3, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: errors3.__proto__
  });
  Object.keys(errors3).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = errors3[k];
  });
});
