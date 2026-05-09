// function: maybeRemoveApiKeyFromMacOSKeychain
async function maybeRemoveApiKeyFromMacOSKeychain() {
  try {
    await maybeRemoveApiKeyFromMacOSKeychainThrows();
  } catch (e) {
    logError2(e);
  }
}
