// var: require_httpAuthSchemeProvider3
var require_httpAuthSchemeProvider3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.resolveHttpAuthSchemeConfig = exports.resolveStsAuthConfig = exports.defaultSTSHttpAuthSchemeProvider = exports.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var httpAuthSchemes_1 = require_httpAuthSchemes(), util_middleware_1 = require_dist_cjs30(), STSClient_1 = require_STSClient(), defaultSTSHttpAuthSchemeParametersProvider = async (config3, context, input) => {
    return {
      operation: (0, util_middleware_1.getSmithyContext)(context).operation,
      region: await (0, util_middleware_1.normalizeProvider)(config3.region)() || (() => {
        throw Error("expected `region` to be configured for `aws.auth#sigv4`");
      })()
    };
  };
  exports.defaultSTSHttpAuthSchemeParametersProvider = defaultSTSHttpAuthSchemeParametersProvider;
  function createAwsAuthSigv4HttpAuthOption(authParameters) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "sts",
        region: authParameters.region
      },
      propertiesExtractor: (config3, context) => ({
        signingProperties: {
          config: config3,
          context
        }
      })
    };
  }
  function createSmithyApiNoAuthHttpAuthOption(authParameters) {
    return {
      schemeId: "smithy.api#noAuth"
    };
  }
  var defaultSTSHttpAuthSchemeProvider = (authParameters) => {
    let options = [];
    switch (authParameters.operation) {
      case "AssumeRoleWithWebIdentity": {
        options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
        break;
      }
      default:
        options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
    }
    return options;
  };
  exports.defaultSTSHttpAuthSchemeProvider = defaultSTSHttpAuthSchemeProvider;
  var resolveStsAuthConfig = (input) => Object.assign(input, {
    stsClientCtor: STSClient_1.STSClient
  });
  exports.resolveStsAuthConfig = resolveStsAuthConfig;
  var resolveHttpAuthSchemeConfig = (config3) => {
    let config_0 = exports.resolveStsAuthConfig(config3), config_1 = (0, httpAuthSchemes_1.resolveAwsSdkSigV4Config)(config_0);
    return Object.assign(config_1, {
      authSchemePreference: (0, util_middleware_1.normalizeProvider)(config3.authSchemePreference ?? [])
    });
  };
  exports.resolveHttpAuthSchemeConfig = resolveHttpAuthSchemeConfig;
});
