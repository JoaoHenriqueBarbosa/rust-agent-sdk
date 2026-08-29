// var: require_httpAuthSchemeProvider5
var require_httpAuthSchemeProvider5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.resolveHttpAuthSchemeConfig = exports.defaultCognitoIdentityHttpAuthSchemeProvider = exports.defaultCognitoIdentityHttpAuthSchemeParametersProvider = void 0;
  var httpAuthSchemes_1 = require_httpAuthSchemes(), util_middleware_1 = require_dist_cjs30(), defaultCognitoIdentityHttpAuthSchemeParametersProvider = async (config6, context, input) => {
    return {
      operation: (0, util_middleware_1.getSmithyContext)(context).operation,
      region: await (0, util_middleware_1.normalizeProvider)(config6.region)() || (() => {
        throw Error("expected `region` to be configured for `aws.auth#sigv4`");
      })()
    };
  };
  exports.defaultCognitoIdentityHttpAuthSchemeParametersProvider = defaultCognitoIdentityHttpAuthSchemeParametersProvider;
  function createAwsAuthSigv4HttpAuthOption4(authParameters) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "cognito-identity",
        region: authParameters.region
      },
      propertiesExtractor: (config6, context) => ({
        signingProperties: {
          config: config6,
          context
        }
      })
    };
  }
  function createSmithyApiNoAuthHttpAuthOption2(authParameters) {
    return {
      schemeId: "smithy.api#noAuth"
    };
  }
  var defaultCognitoIdentityHttpAuthSchemeProvider = (authParameters) => {
    let options = [];
    switch (authParameters.operation) {
      case "GetCredentialsForIdentity": {
        options.push(createSmithyApiNoAuthHttpAuthOption2(authParameters));
        break;
      }
      case "GetId": {
        options.push(createSmithyApiNoAuthHttpAuthOption2(authParameters));
        break;
      }
      default:
        options.push(createAwsAuthSigv4HttpAuthOption4(authParameters));
    }
    return options;
  };
  exports.defaultCognitoIdentityHttpAuthSchemeProvider = defaultCognitoIdentityHttpAuthSchemeProvider;
  var resolveHttpAuthSchemeConfig4 = (config6) => {
    let config_0 = (0, httpAuthSchemes_1.resolveAwsSdkSigV4Config)(config6);
    return Object.assign(config_0, {
      authSchemePreference: (0, util_middleware_1.normalizeProvider)(config6.authSchemePreference ?? [])
    });
  };
  exports.resolveHttpAuthSchemeConfig = resolveHttpAuthSchemeConfig4;
});
