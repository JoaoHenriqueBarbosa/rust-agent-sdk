// var: require_otlp_http_configuration
var require_otlp_http_configuration = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getHttpConfigurationDefaults = exports.mergeOtlpHttpConfigurationWithDefaults = void 0;
  var shared_configuration_1 = require_shared_configuration(), util_1 = require_util8();
  function mergeHeaders(userProvidedHeaders, fallbackHeaders, defaultHeaders) {
    return async () => {
      let requiredHeaders = {
        ...await defaultHeaders()
      }, headers = {};
      if (fallbackHeaders != null)
        Object.assign(headers, await fallbackHeaders());
      if (userProvidedHeaders != null)
        Object.assign(headers, (0, util_1.validateAndNormalizeHeaders)(await userProvidedHeaders()));
      return Object.assign(headers, requiredHeaders);
    };
  }
  function validateUserProvidedUrl(url3) {
    if (url3 == null)
      return;
    try {
      let base2 = globalThis.location?.href;
      return new URL(url3, base2).href;
    } catch {
      throw Error(`Configuration: Could not parse user-provided export URL: '${url3}'`);
    }
  }
  function mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    return {
      ...(0, shared_configuration_1.mergeOtlpSharedConfigurationWithDefaults)(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
      headers: mergeHeaders(userProvidedConfiguration.headers, fallbackConfiguration.headers, defaultConfiguration.headers),
      url: validateUserProvidedUrl(userProvidedConfiguration.url) ?? fallbackConfiguration.url ?? defaultConfiguration.url
    };
  }
  exports.mergeOtlpHttpConfigurationWithDefaults = mergeOtlpHttpConfigurationWithDefaults;
  function getHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
    return {
      ...(0, shared_configuration_1.getSharedConfigurationDefaults)(),
      headers: async () => requiredHeaders,
      url: "http://localhost:4318/" + signalResourcePath
    };
  }
  exports.getHttpConfigurationDefaults = getHttpConfigurationDefaults;
});
