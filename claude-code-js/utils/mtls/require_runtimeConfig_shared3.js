// var: require_runtimeConfig_shared3
var require_runtimeConfig_shared3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRuntimeConfig = void 0;
  var httpAuthSchemes_1 = require_httpAuthSchemes(), protocols_1 = require_protocols2(), core_1 = require_dist_cjs37(), smithy_client_1 = require_dist_cjs71(), url_parser_1 = require_dist_cjs11(), util_base64_1 = require_dist_cjs86(), util_utf8_1 = require_dist_cjs17(), httpAuthSchemeProvider_1 = require_httpAuthSchemeProvider3(), endpointResolver_1 = require_endpointResolver3(), schemas_0_1 = require_schemas_03(), getRuntimeConfig = (config3) => {
    return {
      apiVersion: "2011-06-15",
      base64Decoder: config3?.base64Decoder ?? util_base64_1.fromBase64,
      base64Encoder: config3?.base64Encoder ?? util_base64_1.toBase64,
      disableHostPrefix: config3?.disableHostPrefix ?? !1,
      endpointProvider: config3?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
      extensions: config3?.extensions ?? [],
      httpAuthSchemeProvider: config3?.httpAuthSchemeProvider ?? httpAuthSchemeProvider_1.defaultSTSHttpAuthSchemeProvider,
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
      protocol: config3?.protocol ?? protocols_1.AwsQueryProtocol,
      protocolSettings: config3?.protocolSettings ?? {
        defaultNamespace: "com.amazonaws.sts",
        errorTypeRegistries: schemas_0_1.errorTypeRegistries,
        xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
        version: "2011-06-15",
        serviceTarget: "AWSSecurityTokenServiceV20110615"
      },
      serviceId: config3?.serviceId ?? "STS",
      urlParser: config3?.urlParser ?? url_parser_1.parseUrl,
      utf8Decoder: config3?.utf8Decoder ?? util_utf8_1.fromUtf8,
      utf8Encoder: config3?.utf8Encoder ?? util_utf8_1.toUtf8
    };
  };
  exports.getRuntimeConfig = getRuntimeConfig;
});
