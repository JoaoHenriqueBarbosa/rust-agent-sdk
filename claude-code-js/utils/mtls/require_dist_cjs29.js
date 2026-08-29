// var: require_dist_cjs29
var require_dist_cjs29 = __commonJS((exports) => {
  exports.HttpAuthLocation = void 0;
  (function(HttpAuthLocation2) {
    HttpAuthLocation2.HEADER = "header", HttpAuthLocation2.QUERY = "query";
  })(exports.HttpAuthLocation || (exports.HttpAuthLocation = {}));
  exports.HttpApiKeyAuthLocation = void 0;
  (function(HttpApiKeyAuthLocation2) {
    HttpApiKeyAuthLocation2.HEADER = "header", HttpApiKeyAuthLocation2.QUERY = "query";
  })(exports.HttpApiKeyAuthLocation || (exports.HttpApiKeyAuthLocation = {}));
  exports.EndpointURLScheme = void 0;
  (function(EndpointURLScheme2) {
    EndpointURLScheme2.HTTP = "http", EndpointURLScheme2.HTTPS = "https";
  })(exports.EndpointURLScheme || (exports.EndpointURLScheme = {}));
  exports.AlgorithmId = void 0;
  (function(AlgorithmId2) {
    AlgorithmId2.MD5 = "md5", AlgorithmId2.CRC32 = "crc32", AlgorithmId2.CRC32C = "crc32c", AlgorithmId2.SHA1 = "sha1", AlgorithmId2.SHA256 = "sha256";
  })(exports.AlgorithmId || (exports.AlgorithmId = {}));
  var getChecksumConfiguration = (runtimeConfig) => {
    let checksumAlgorithms = [];
    if (runtimeConfig.sha256 !== void 0)
      checksumAlgorithms.push({
        algorithmId: () => exports.AlgorithmId.SHA256,
        checksumConstructor: () => runtimeConfig.sha256
      });
    if (runtimeConfig.md5 != null)
      checksumAlgorithms.push({
        algorithmId: () => exports.AlgorithmId.MD5,
        checksumConstructor: () => runtimeConfig.md5
      });
    return {
      addChecksumAlgorithm(algo) {
        checksumAlgorithms.push(algo);
      },
      checksumAlgorithms() {
        return checksumAlgorithms;
      }
    };
  }, resolveChecksumRuntimeConfig = (clientConfig) => {
    let runtimeConfig = {};
    return clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
      runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
    }), runtimeConfig;
  }, getDefaultClientConfiguration = (runtimeConfig) => {
    return getChecksumConfiguration(runtimeConfig);
  }, resolveDefaultRuntimeConfig = (config3) => {
    return resolveChecksumRuntimeConfig(config3);
  };
  exports.FieldPosition = void 0;
  (function(FieldPosition2) {
    FieldPosition2[FieldPosition2.HEADER = 0] = "HEADER", FieldPosition2[FieldPosition2.TRAILER = 1] = "TRAILER";
  })(exports.FieldPosition || (exports.FieldPosition = {}));
  var SMITHY_CONTEXT_KEY2 = "__smithy_context";
  exports.IniSectionType = void 0;
  (function(IniSectionType2) {
    IniSectionType2.PROFILE = "profile", IniSectionType2.SSO_SESSION = "sso-session", IniSectionType2.SERVICES = "services";
  })(exports.IniSectionType || (exports.IniSectionType = {}));
  exports.RequestHandlerProtocol = void 0;
  (function(RequestHandlerProtocol2) {
    RequestHandlerProtocol2.HTTP_0_9 = "http/0.9", RequestHandlerProtocol2.HTTP_1_0 = "http/1.0", RequestHandlerProtocol2.TDS_8_0 = "tds/8.0";
  })(exports.RequestHandlerProtocol || (exports.RequestHandlerProtocol = {}));
  exports.SMITHY_CONTEXT_KEY = SMITHY_CONTEXT_KEY2;
  exports.getDefaultClientConfiguration = getDefaultClientConfiguration;
  exports.resolveDefaultRuntimeConfig = resolveDefaultRuntimeConfig;
});
