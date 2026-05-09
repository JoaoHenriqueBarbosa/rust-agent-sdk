// Original: src/utils/secureStorage/keychainPrefetch.ts
import { execFile as execFile7 } from "child_process";
function spawnSecurity(serviceName) {
  return new Promise((resolve9) => {
    execFile7("security", ["find-generic-password", "-a", getUsername(), "-w", "-s", serviceName], { encoding: "utf-8", timeout: KEYCHAIN_PREFETCH_TIMEOUT_MS }, (err, stdout) => {
      resolve9({
        stdout: err ? null : stdout?.trim() || null,
        timedOut: Boolean(err && "killed" in err && err.killed)
      });
    });
  });
}
function startKeychainPrefetch() {
  if (process.platform !== "darwin" || prefetchPromise || isBareMode())
    return;
  let oauthSpawn = spawnSecurity(getMacOsKeychainStorageServiceName(CREDENTIALS_SERVICE_SUFFIX)), legacySpawn = spawnSecurity(getMacOsKeychainStorageServiceName());
  prefetchPromise = Promise.all([oauthSpawn, legacySpawn]).then(([oauth, legacy]) => {
    if (!oauth.timedOut)
      primeKeychainCacheFromPrefetch(oauth.stdout);
    if (!legacy.timedOut)
      legacyApiKeyPrefetch = { stdout: legacy.stdout };
  });
}
async function ensureKeychainPrefetchCompleted() {
  if (prefetchPromise)
    await prefetchPromise;
}
function getLegacyApiKeyPrefetchResult() {
  return legacyApiKeyPrefetch;
}
function clearLegacyApiKeyPrefetch() {
  legacyApiKeyPrefetch = null;
}
var KEYCHAIN_PREFETCH_TIMEOUT_MS = 1e4, legacyApiKeyPrefetch = null, prefetchPromise = null;
var init_keychainPrefetch = __esm(() => {
  init_envUtils();
  init_macOsKeychainHelpers();
});
