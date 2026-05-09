// function: saveApiKey
async function saveApiKey(apiKey) {
  if (!isValidApiKey(apiKey))
    throw Error("Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.");
  await maybeRemoveApiKeyFromMacOSKeychain();
  let savedToKeychain = !1;
  if (process.platform === "darwin")
    try {
      let storageServiceName = getMacOsKeychainStorageServiceName(), username = getUsername(), hexValue = Buffer.from(apiKey, "utf-8").toString("hex"), command12 = `add-generic-password -U -a "${username}" -s "${storageServiceName}" -X "${hexValue}"
`;
      await execa("security", ["-i"], {
        input: command12,
        reject: !1
      }), logEvent("tengu_api_key_saved_to_keychain", {}), savedToKeychain = !0;
    } catch (e) {
      logError2(e), logEvent("tengu_api_key_keychain_error", {
        error: errorMessage(e)
      }), logEvent("tengu_api_key_saved_to_config", {});
    }
  else
    logEvent("tengu_api_key_saved_to_config", {});
  let normalizedKey = normalizeApiKeyForConfig(apiKey);
  saveGlobalConfig((current) => {
    let approved = current.customApiKeyResponses?.approved ?? [];
    return {
      ...current,
      primaryApiKey: savedToKeychain ? current.primaryApiKey : apiKey,
      customApiKeyResponses: {
        ...current.customApiKeyResponses,
        approved: approved.includes(normalizedKey) ? approved : [...approved, normalizedKey],
        rejected: current.customApiKeyResponses?.rejected ?? []
      }
    };
  }), getApiKeyFromConfigOrMacOSKeychain.cache.clear?.(), clearLegacyApiKeyPrefetch();
}
