// var: require_runtimeConfig_shared2
var require_runtimeConfig_shared2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRuntimeConfig = void 0;
  var httpAuthSchemes_1 = require_httpAuthSchemes(), protocols_1 = require_protocols2(), core_1 = require_dist_cjs37(), smithy_client_1 = require_dist_cjs71(), url_parser_1 = require_dist_cjs11(), util_base64_1 = require_dist_cjs86(), util_utf8_1 = require_dist_cjs17(), httpAuthSchemeProvider_1 = require_httpAuthSchemeProvider2(), endpointResolver_1 = require_endpointResolver2(), schemas_0_1 = require_schemas_02(), getRuntimeConfig = (config3) => {
    return {
      apiVersion: "2019-06-10",
      base64Decoder: config3?.base64Decoder ?? util_base64_1.fromBase64,
      base64Encoder: config3?.base64Encoder ?? util_base64_1.toBase64,
      disableHostPrefix: config3?.disableHostPrefix ?? !1,
      endpointProvider: config3?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
      extensions: config3?.extensions ?? [],
      httpAuthSchemeProvider: config3?.httpAuthSchemeProvider ?? httpAuthSchemeProvider_1.defaultSSOHttpAuthSchemeProvider,
      httpAuthSchemes: config3?.httpAuthSchemes ?? [
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
      logger: config3?.logger ?? new smithy_client_1.NoOpLogger,
      protocol: config3?.protocol ?? protocols_1.AwsRestJsonProtocol,
      protocolSettings: config3?.protocolSettings ?? {
        defaultNamespace: "com.amazonaws.sso",
        errorTypeRegistries: schemas_0_1.errorTypeRegistries,
        version: "2019-06-10",
        serviceTarget: "SWBPortalService"
      },
      serviceId: config3?.serviceId ?? "SSO",
      urlParser: config3?.urlParser ?? url_parser_1.parseUrl,
      utf8Decoder: config3?.utf8Decoder ?? util_utf8_1.fromUtf8,
      utf8Encoder: config3?.utf8Encoder ?? util_utf8_1.toUtf8
    };
  };
  exports.getRuntimeConfig = getRuntimeConfig;
});
