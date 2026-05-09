// function: generatePluginConfiguration
function generatePluginConfiguration(options) {
  let config8 = {
    cache: {},
    broker: {
      ...options.brokerOptions,
      isEnabled: options.brokerOptions?.enabled ?? !1,
      enableMsaPassthrough: options.brokerOptions?.legacyEnableMsaPassthrough ?? !1
    }
  };
  if (options.tokenCachePersistenceOptions?.enabled) {
    if (persistenceProvider === void 0)
      throw Error([
        "Persistent token caching was requested, but no persistence provider was configured.",
        "You must install the identity-cache-persistence plugin package (`npm install --save @azure/identity-cache-persistence`)",
        "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling",
        "`useIdentityPlugin(cachePersistencePlugin)` before using `tokenCachePersistenceOptions`."
      ].join(" "));
    let cacheBaseName = options.tokenCachePersistenceOptions.name || DEFAULT_TOKEN_CACHE_NAME;
    config8.cache.cachePlugin = persistenceProvider({
      name: `${cacheBaseName}.${CACHE_NON_CAE_SUFFIX}`,
      ...options.tokenCachePersistenceOptions
    }), config8.cache.cachePluginCae = persistenceProvider({
      name: `${cacheBaseName}.${CACHE_CAE_SUFFIX}`,
      ...options.tokenCachePersistenceOptions
    });
  }
  if (options.brokerOptions?.enabled)
    config8.broker.nativeBrokerPlugin = getBrokerPlugin(options.isVSCodeCredential || !1);
  return config8;
}
