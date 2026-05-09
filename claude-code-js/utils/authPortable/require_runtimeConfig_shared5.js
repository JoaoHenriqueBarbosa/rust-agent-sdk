// var: require_runtimeConfig_shared5
var require_runtimeConfig_shared5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRuntimeConfig = void 0;
  var httpAuthSchemes_1 = require_httpAuthSchemes(), protocols_1 = require_protocols2(), core_1 = require_dist_cjs37(), smithy_client_1 = require_dist_cjs71(), url_parser_1 = require_dist_cjs11(), util_base64_1 = require_dist_cjs86(), util_utf8_1 = require_dist_cjs17(), httpAuthSchemeProvider_1 = require_httpAuthSchemeProvider5(), endpointResolver_1 = require_endpointResolver5(), schemas_0_1 = require_schemas_05(), getRuntimeConfig7 = (config6) => {
    return {
      apiVersion: "2014-06-30",
      base64Decoder: config6?.base64Decoder ?? util_base64_1.fromBase64,
      base64Encoder: config6?.base64Encoder ?? util_base64_1.toBase64,
      disableHostPrefix: config6?.disableHostPrefix ?? !1,
      endpointProvider: config6?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
      extensions: config6?.extensions ?? [],
      httpAuthSchemeProvider: config6?.httpAuthSchemeProvider ?? httpAuthSchemeProvider_1.defaultCognitoIdentityHttpAuthSchemeProvider,
      httpAuthSchemes: config6?.httpAuthSchemes ?? [
        {
          schemeId: "aws.auth#sigv4",
          identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
          signer: new httpAuthSchemes_1.AwsSdkSigV4Signer
        },
        {
          schemeId: "smithy.api#noAuth",
          identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new core_1.NoAuthSigner
        }
      ],
      logger: config6?.logger ?? new smithy_client_1.NoOpLogger,
      protocol: config6?.protocol ?? protocols_1.AwsJson1_1Protocol,
      protocolSettings: config6?.protocolSettings ?? {
        defaultNamespace: "com.amazonaws.cognitoidentity",
        errorTypeRegistries: schemas_0_1.errorTypeRegistries,
        xmlNamespace: "http://cognito-identity.amazonaws.com/doc/2014-06-30/",
        version: "2014-06-30",
        serviceTarget: "AWSCognitoIdentityService"
      },
      serviceId: config6?.serviceId ?? "Cognito Identity",
      urlParser: config6?.urlParser ?? url_parser_1.parseUrl,
      utf8Decoder: config6?.utf8Decoder ?? util_utf8_1.fromUtf8,
      utf8Encoder: config6?.utf8Encoder ?? util_utf8_1.toUtf8
    };
  };
  exports.getRuntimeConfig = getRuntimeConfig7;
});
