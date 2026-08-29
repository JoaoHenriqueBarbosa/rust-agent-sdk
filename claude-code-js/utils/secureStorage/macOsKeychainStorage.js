// Original: src/utils/secureStorage/macOsKeychainStorage.ts
async function doReadAsync() {
  try {
    let storageServiceName = getMacOsKeychainStorageServiceName(CREDENTIALS_SERVICE_SUFFIX), username = getUsername(), { stdout, code } = await execFileNoThrow("security", ["find-generic-password", "-a", username, "-w", "-s", storageServiceName], { useCwd: !1, preserveOutputOnError: !1 });
    if (code === 0 && stdout)
      return jsonParse(stdout.trim());
  } catch (_e) {}
  return null;
}
function isMacOsKeychainLocked() {
  if (keychainLockedCache !== void 0)
    return keychainLockedCache;
  if (process.platform !== "darwin")
    return keychainLockedCache = !1, !1;
  try {
    keychainLockedCache = execaSync("security", ["show-keychain-info"], {
      reject: !1,
      stdio: ["ignore", "pipe", "pipe"]
    }).exitCode === 36;
  } catch {
    keychainLockedCache = !1;
  }
  return keychainLockedCache;
}
var SECURITY_STDIN_LINE_LIMIT = 4032, macOsKeychainStorage, keychainLockedCache;
var init_macOsKeychainStorage = __esm(() => {
  init_execa();
  init_debug();
  init_execFileNoThrow();
  init_execFileNoThrowPortable();
  init_slowOperations();
  init_macOsKeychainHelpers();
  macOsKeychainStorage = {
    name: "keychain",
    read() {
      let prev = keychainCacheState.cache;
      if (Date.now() - prev.cachedAt < KEYCHAIN_CACHE_TTL_MS)
        return prev.data;
      try {
        let storageServiceName = getMacOsKeychainStorageServiceName(CREDENTIALS_SERVICE_SUFFIX), username = getUsername(), result = execSyncWithDefaults_DEPRECATED(`security find-generic-password -a "${username}" -w -s "${storageServiceName}"`);
        if (result) {
          let data = jsonParse(result);
          return keychainCacheState.cache = { data, cachedAt: Date.now() }, data;
        }
      } catch (_e) {}
      if (prev.data !== null)
        return logForDebugging("[keychain] read failed; serving stale cache", {
          level: "warn"
        }), keychainCacheState.cache = { data: prev.data, cachedAt: Date.now() }, prev.data;
      return keychainCacheState.cache = { data: null, cachedAt: Date.now() }, null;
    },
    async readAsync() {
      let prev = keychainCacheState.cache;
      if (Date.now() - prev.cachedAt < KEYCHAIN_CACHE_TTL_MS)
        return prev.data;
      if (keychainCacheState.readInFlight)
        return keychainCacheState.readInFlight;
      let gen = keychainCacheState.generation, promise2 = doReadAsync().then((data) => {
        if (gen === keychainCacheState.generation) {
          if (data === null && prev.data !== null)
            logForDebugging("[keychain] readAsync failed; serving stale cache", {
              level: "warn"
            });
          let next = data ?? prev.data;
          return keychainCacheState.cache = { data: next, cachedAt: Date.now() }, keychainCacheState.readInFlight = null, next;
        }
        return data;
      });
      return keychainCacheState.readInFlight = promise2, promise2;
    },
    update(data) {
      clearKeychainCache();
      try {
        let storageServiceName = getMacOsKeychainStorageServiceName(CREDENTIALS_SERVICE_SUFFIX), username = getUsername(), jsonString = jsonStringify(data), hexValue = Buffer.from(jsonString, "utf-8").toString("hex"), command12 = `add-generic-password -U -a "${username}" -s "${storageServiceName}" -X "${hexValue}"
`, result;
        if (command12.length <= SECURITY_STDIN_LINE_LIMIT)
          result = execaSync("security", ["-i"], {
            input: command12,
            stdio: ["pipe", "pipe", "pipe"],
            reject: !1
          });
        else
          logForDebugging(`Keychain payload (${jsonString.length}B JSON) exceeds security -i stdin limit; using argv`, { level: "warn" }), result = execaSync("security", [
            "add-generic-password",
            "-U",
            "-a",
            username,
            "-s",
            storageServiceName,
            "-X",
            hexValue
          ], { stdio: ["ignore", "pipe", "pipe"], reject: !1 });
        if (result.exitCode !== 0)
          return { success: !1 };
        return keychainCacheState.cache = { data, cachedAt: Date.now() }, { success: !0 };
      } catch (_e) {
        return { success: !1 };
      }
    },
    delete() {
      clearKeychainCache();
      try {
        let storageServiceName = getMacOsKeychainStorageServiceName(CREDENTIALS_SERVICE_SUFFIX), username = getUsername();
        return execSyncWithDefaults_DEPRECATED(`security delete-generic-password -a "${username}" -s "${storageServiceName}"`), !0;
      } catch (_e) {
        return !1;
      }
    }
  };
});
