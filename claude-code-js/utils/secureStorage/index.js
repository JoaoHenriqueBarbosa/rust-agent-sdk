// Original: src/utils/secureStorage/index.ts
function getSecureStorage() {
  if (process.platform === "darwin")
    return createFallbackStorage(macOsKeychainStorage, plainTextStorage);
  return plainTextStorage;
}
var init_secureStorage = __esm(() => {
  init_macOsKeychainStorage();
  init_plainTextStorage();
});
