// function: generateMsalConfiguration
function generateMsalConfiguration(clientId, tenantId, msalClientOptions = {}) {
  let resolvedTenant = resolveTenantId(msalClientOptions.logger ?? msalLogger, tenantId, clientId), authority = getAuthority(resolvedTenant, getAuthorityHost(msalClientOptions)), httpClient = new IdentityClient({
    ...msalClientOptions.tokenCredentialOptions,
    authorityHost: authority,
    loggingOptions: msalClientOptions.loggingOptions
  });
  return {
    auth: {
      clientId,
      authority,
      knownAuthorities: getKnownAuthorities(resolvedTenant, authority, msalClientOptions.disableInstanceDiscovery)
    },
    system: {
      networkClient: httpClient,
      loggerOptions: {
        loggerCallback: defaultLoggerCallback(msalClientOptions.logger ?? msalLogger),
        logLevel: getMSALLogLevel(getLogLevel()),
        piiLoggingEnabled: msalClientOptions.loggingOptions?.enableUnsafeSupportLogging
      }
    }
  };
}
