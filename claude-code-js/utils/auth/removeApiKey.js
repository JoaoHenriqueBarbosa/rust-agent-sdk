// function: removeApiKey
async function removeApiKey() {
  await maybeRemoveApiKeyFromMacOSKeychain(), saveGlobalConfig((current) => ({
    ...current,
    primaryApiKey: void 0
  })), getApiKeyFromConfigOrMacOSKeychain.cache.clear?.(), clearLegacyApiKeyPrefetch();
}
