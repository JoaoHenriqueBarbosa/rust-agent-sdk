// function: buildAppConfiguration
function buildAppConfiguration({ auth: auth13, broker, cache: cache4, system, telemetry }) {
  let systemOptions = {
    ...DEFAULT_SYSTEM_OPTIONS2,
    networkClient: new HttpClient,
    loggerOptions: system?.loggerOptions || DEFAULT_LOGGER_OPTIONS,
    disableInternalRetries: system?.disableInternalRetries || !1
  };
  if (!!auth13.clientCertificate && !auth13.clientCertificate.thumbprint && !auth13.clientCertificate.thumbprintSha256)
    throw NodeAuthError.createStateNotFoundError();
  return {
    auth: { ...DEFAULT_AUTH_OPTIONS, ...auth13 },
    broker: { ...broker },
    cache: { ...cache4 },
    system: { ...systemOptions, ...system },
    telemetry: { ...DEFAULT_TELEMETRY_OPTIONS2, ...telemetry }
  };
}
