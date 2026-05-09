// var: require_shared_env_configuration
var require_shared_env_configuration = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getSharedConfigurationFromEnvironment = void 0;
  var core_1 = require_src9(), api_1 = require_src7();
  function parseAndValidateTimeoutFromEnv(timeoutEnvVar) {
    let envTimeout = (0, core_1.getNumberFromEnv)(timeoutEnvVar);
    if (envTimeout != null) {
      if (Number.isFinite(envTimeout) && envTimeout > 0)
        return envTimeout;
      api_1.diag.warn(`Configuration: ${timeoutEnvVar} is invalid, expected number greater than 0 (actual: ${envTimeout})`);
    }
    return;
  }
  function getTimeoutFromEnv(signalIdentifier) {
    let specificTimeout = parseAndValidateTimeoutFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_TIMEOUT`), nonSpecificTimeout = parseAndValidateTimeoutFromEnv("OTEL_EXPORTER_OTLP_TIMEOUT");
    return specificTimeout ?? nonSpecificTimeout;
  }
  function parseAndValidateCompressionFromEnv(compressionEnvVar) {
    let compression = (0, core_1.getStringFromEnv)(compressionEnvVar)?.trim();
    if (compression == null || compression === "none" || compression === "gzip")
      return compression;
    api_1.diag.warn(`Configuration: ${compressionEnvVar} is invalid, expected 'none' or 'gzip' (actual: '${compression}')`);
    return;
  }
  function getCompressionFromEnv(signalIdentifier) {
    let specificCompression = parseAndValidateCompressionFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_COMPRESSION`), nonSpecificCompression = parseAndValidateCompressionFromEnv("OTEL_EXPORTER_OTLP_COMPRESSION");
    return specificCompression ?? nonSpecificCompression;
  }
  function getSharedConfigurationFromEnvironment(signalIdentifier) {
    return {
      timeoutMillis: getTimeoutFromEnv(signalIdentifier),
      compression: getCompressionFromEnv(signalIdentifier)
    };
  }
  exports.getSharedConfigurationFromEnvironment = getSharedConfigurationFromEnvironment;
});
