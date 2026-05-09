// function: buildManagedIdentityConfiguration
function buildManagedIdentityConfiguration({ clientCapabilities, managedIdentityIdParams, system }) {
  let managedIdentityId = new ManagedIdentityId(managedIdentityIdParams), loggerOptions = system?.loggerOptions || DEFAULT_LOGGER_OPTIONS, networkClient;
  if (system?.networkClient)
    networkClient = system.networkClient;
  else
    networkClient = new HttpClient;
  return {
    clientCapabilities: clientCapabilities || [],
    managedIdentityId,
    system: {
      loggerOptions,
      networkClient
    },
    disableInternalRetries: system?.disableInternalRetries || !1
  };
}
