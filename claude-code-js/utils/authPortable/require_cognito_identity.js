// var: require_cognito_identity
var require_cognito_identity = __commonJS((exports) => {
  var middlewareHostHeader = require_dist_cjs44(), middlewareLogger = require_dist_cjs45(), middlewareRecursionDetection = require_dist_cjs48(), middlewareUserAgent = require_dist_cjs56(), configResolver = require_dist_cjs58(), core2 = require_dist_cjs37(), schema5 = require_schema(), middlewareContentLength = require_dist_cjs61(), middlewareEndpoint = require_dist_cjs65(), middlewareRetry = require_dist_cjs69(), smithyClient = require_dist_cjs71(), httpAuthSchemeProvider = require_httpAuthSchemeProvider5(), runtimeConfig = require_runtimeConfig5(), regionConfigResolver = require_dist_cjs87(), protocolHttp = require_dist_cjs88(), schemas_04 = require_schemas_05(), errors6 = require_errors5(), CognitoIdentityServiceException = require_CognitoIdentityServiceException(), resolveClientEndpointParameters4 = (options) => {
    return Object.assign(options, {
      useDualstackEndpoint: options.useDualstackEndpoint ?? !1,
      useFipsEndpoint: options.useFipsEndpoint ?? !1,
      defaultSigningName: "cognito-identity"
    });
  }, commonParams4 = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
  }, getHttpAuthExtensionConfiguration4 = (runtimeConfig2) => {
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
  }, resolveHttpAuthRuntimeConfig4 = (config6) => {
    return {
      httpAuthSchemes: config6.httpAuthSchemes(),
      httpAuthSchemeProvider: config6.httpAuthSchemeProvider(),
      credentials: config6.credentials()
    };
  }, resolveRuntimeExtensions4 = (runtimeConfig2, extensions16) => {
    let extensionConfiguration = Object.assign(regionConfigResolver.getAwsRegionExtensionConfiguration(runtimeConfig2), smithyClient.getDefaultExtensionConfiguration(runtimeConfig2), protocolHttp.getHttpHandlerExtensionConfiguration(runtimeConfig2), getHttpAuthExtensionConfiguration4(runtimeConfig2));
    return extensions16.forEach((extension) => extension.configure(extensionConfiguration)), Object.assign(runtimeConfig2, regionConfigResolver.resolveAwsRegionExtensionConfiguration(extensionConfiguration), smithyClient.resolveDefaultRuntimeConfig(extensionConfiguration), protocolHttp.resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig4(extensionConfiguration));
  };

  class CognitoIdentityClient extends smithyClient.Client {
    config;
    constructor(...[configuration]) {
      let _config_0 = runtimeConfig.getRuntimeConfig(configuration || {});
      super(_config_0);
      this.initConfig = _config_0;
      let _config_1 = resolveClientEndpointParameters4(_config_0), _config_2 = middlewareUserAgent.resolveUserAgentConfig(_config_1), _config_3 = middlewareRetry.resolveRetryConfig(_config_2), _config_4 = configResolver.resolveRegionConfig(_config_3), _config_5 = middlewareHostHeader.resolveHostHeaderConfig(_config_4), _config_6 = middlewareEndpoint.resolveEndpointConfig(_config_5), _config_7 = httpAuthSchemeProvider.resolveHttpAuthSchemeConfig(_config_6), _config_8 = resolveRuntimeExtensions4(_config_7, configuration?.extensions || []);
      this.config = _config_8, this.middlewareStack.use(schema5.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(middlewareUserAgent.getUserAgentPlugin(this.config)), this.middlewareStack.use(middlewareRetry.getRetryPlugin(this.config)), this.middlewareStack.use(middlewareContentLength.getContentLengthPlugin(this.config)), this.middlewareStack.use(middlewareHostHeader.getHostHeaderPlugin(this.config)), this.middlewareStack.use(middlewareLogger.getLoggerPlugin(this.config)), this.middlewareStack.use(middlewareRecursionDetection.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(core2.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: httpAuthSchemeProvider.defaultCognitoIdentityHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (config6) => new core2.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config6.credentials
        })
      })), this.middlewareStack.use(core2.getHttpSigningPlugin(this.config));
    }
    destroy() {
      super.destroy();
    }
  }

  class GetCredentialsForIdentityCommand extends smithyClient.Command.classBuilder().ep(commonParams4).m(function(Command5, cs, config6, o5) {
    return [middlewareEndpoint.getEndpointPlugin(config6, Command5.getEndpointParameterInstructions())];
  }).s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {}).n("CognitoIdentityClient", "GetCredentialsForIdentityCommand").sc(schemas_04.GetCredentialsForIdentity$).build() {
  }

  class GetIdCommand extends smithyClient.Command.classBuilder().ep(commonParams4).m(function(Command5, cs, config6, o5) {
    return [middlewareEndpoint.getEndpointPlugin(config6, Command5.getEndpointParameterInstructions())];
  }).s("AWSCognitoIdentityService", "GetId", {}).n("CognitoIdentityClient", "GetIdCommand").sc(schemas_04.GetId$).build() {
  }
  var commands7 = {
    GetCredentialsForIdentityCommand,
    GetIdCommand
  };

  class CognitoIdentity extends CognitoIdentityClient {
  }
  smithyClient.createAggregatedClient(commands7, CognitoIdentity);
  exports.$Command = smithyClient.Command;
  exports.__Client = smithyClient.Client;
  exports.CognitoIdentityServiceException = CognitoIdentityServiceException.CognitoIdentityServiceException;
  exports.CognitoIdentity = CognitoIdentity;
  exports.CognitoIdentityClient = CognitoIdentityClient;
  exports.GetCredentialsForIdentityCommand = GetCredentialsForIdentityCommand;
  exports.GetIdCommand = GetIdCommand;
  Object.prototype.hasOwnProperty.call(schemas_04, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: schemas_04.__proto__
  });
  Object.keys(schemas_04).forEach(function(k3) {
    if (k3 !== "default" && !Object.prototype.hasOwnProperty.call(exports, k3))
      exports[k3] = schemas_04[k3];
  });
  Object.prototype.hasOwnProperty.call(errors6, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: errors6.__proto__
  });
  Object.keys(errors6).forEach(function(k3) {
    if (k3 !== "default" && !Object.prototype.hasOwnProperty.call(exports, k3))
      exports[k3] = errors6[k3];
  });
});
