// var: require_httpAuthSchemeProvider4
var require_httpAuthSchemeProvider4 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.resolveHttpAuthSchemeConfig = exports.defaultSigninHttpAuthSchemeProvider = exports.defaultSigninHttpAuthSchemeParametersProvider = void 0;
  var httpAuthSchemes_1 = require_httpAuthSchemes(), util_middleware_1 = require_dist_cjs30(), defaultSigninHttpAuthSchemeParametersProvider = async (config3, context, input) => {
    return {
      operation: (0, util_middleware_1.getSmithyContext)(context).operation,
      region: await (0, util_middleware_1.normalizeProvider)(config3.region)() || (() => {
        throw Error("expected `region` to be configured for `aws.auth#sigv4`");
      })()
    };
  };
  exports.defaultSigninHttpAuthSchemeParametersProvider = defaultSigninHttpAuthSchemeParametersProvider;
  function createAwsAuthSigv4HttpAuthOption(authParameters) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "signin",
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
  var defaultSigninHttpAuthSchemeProvider = (authParameters) => {
    let options = [];
    switch (authParameters.operation) {
      case "CreateOAuth2Token": {
        options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
        break;
      }
      default:
        options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
    }
    return options;
  };
  exports.defaultSigninHttpAuthSchemeProvider = defaultSigninHttpAuthSchemeProvider;
  var resolveHttpAuthSchemeConfig = (config3) => {
    let config_0 = (0, httpAuthSchemes_1.resolveAwsSdkSigV4Config)(config3);
    return Object.assign(config_0, {
      authSchemePreference: (0, util_middleware_1.normalizeProvider)(config3.authSchemePreference ?? [])
    });
  };
  exports.resolveHttpAuthSchemeConfig = resolveHttpAuthSchemeConfig;
});
