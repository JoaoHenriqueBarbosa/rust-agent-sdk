// var: require_otlp_node_http_env_configuration
var require_otlp_node_http_env_configuration = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getNodeHttpConfigurationFromEnvironment = void 0;
  var fs16 = __require("fs"), path16 = __require("path"), core_1 = require_src9(), api_1 = require_src7(), shared_env_configuration_1 = require_shared_env_configuration(), shared_configuration_1 = require_shared_configuration(), otlp_node_http_configuration_1 = require_otlp_node_http_configuration();
  function getStaticHeadersFromEnv(signalIdentifier) {
    let signalSpecificRawHeaders = (0, core_1.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${signalIdentifier}_HEADERS`), nonSignalSpecificRawHeaders = (0, core_1.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS"), signalSpecificHeaders = (0, core_1.parseKeyPairsIntoRecord)(signalSpecificRawHeaders), nonSignalSpecificHeaders = (0, core_1.parseKeyPairsIntoRecord)(nonSignalSpecificRawHeaders);
    if (Object.keys(signalSpecificHeaders).length === 0 && Object.keys(nonSignalSpecificHeaders).length === 0)
      return;
    return Object.assign({}, (0, core_1.parseKeyPairsIntoRecord)(nonSignalSpecificRawHeaders), (0, core_1.parseKeyPairsIntoRecord)(signalSpecificRawHeaders));
  }
  function appendRootPathToUrlIfNeeded(url3) {
    try {
      return new URL(url3).toString();
    } catch {
      api_1.diag.warn(`Configuration: Could not parse environment-provided export URL: '${url3}', falling back to undefined`);
      return;
    }
  }
  function appendResourcePathToUrl(url3, path17) {
    try {
      new URL(url3);
    } catch {
      api_1.diag.warn(`Configuration: Could not parse environment-provided export URL: '${url3}', falling back to undefined`);
      return;
    }
    if (!url3.endsWith("/"))
      url3 = url3 + "/";
    url3 += path17;
    try {
      new URL(url3);
    } catch {
      api_1.diag.warn(`Configuration: Provided URL appended with '${path17}' is not a valid URL, using 'undefined' instead of '${url3}'`);
      return;
    }
    return url3;
  }
  function getNonSpecificUrlFromEnv(signalResourcePath) {
    let envUrl = (0, core_1.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
    if (envUrl === void 0)
      return;
    return appendResourcePathToUrl(envUrl, signalResourcePath);
  }
  function getSpecificUrlFromEnv(signalIdentifier) {
    let envUrl = (0, core_1.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${signalIdentifier}_ENDPOINT`);
    if (envUrl === void 0)
      return;
    return appendRootPathToUrlIfNeeded(envUrl);
  }
  function readFileFromEnv(signalSpecificEnvVar, nonSignalSpecificEnvVar, warningMessage) {
    let signalSpecificPath = (0, core_1.getStringFromEnv)(signalSpecificEnvVar), nonSignalSpecificPath = (0, core_1.getStringFromEnv)(nonSignalSpecificEnvVar), filePath = signalSpecificPath ?? nonSignalSpecificPath;
    if (filePath != null)
      try {
        return fs16.readFileSync(path16.resolve(process.cwd(), filePath));
      } catch {
        api_1.diag.warn(warningMessage);
        return;
      }
    else
      return;
  }
  function getClientCertificateFromEnv(signalIdentifier) {
    return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file");
  }
  function getClientKeyFromEnv(signalIdentifier) {
    return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file");
  }
  function getRootCertificateFromEnv(signalIdentifier) {
    return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file");
  }
  function getNodeHttpConfigurationFromEnvironment(signalIdentifier, signalResourcePath) {
    return {
      ...(0, shared_env_configuration_1.getSharedConfigurationFromEnvironment)(signalIdentifier),
      url: getSpecificUrlFromEnv(signalIdentifier) ?? getNonSpecificUrlFromEnv(signalResourcePath),
      headers: (0, shared_configuration_1.wrapStaticHeadersInFunction)(getStaticHeadersFromEnv(signalIdentifier)),
      agentFactory: (0, otlp_node_http_configuration_1.httpAgentFactoryFromOptions)({
        keepAlive: !0,
        ca: getRootCertificateFromEnv(signalIdentifier),
        cert: getClientCertificateFromEnv(signalIdentifier),
        key: getClientKeyFromEnv(signalIdentifier)
      })
    };
  }
  exports.getNodeHttpConfigurationFromEnvironment = getNodeHttpConfigurationFromEnvironment;
});
