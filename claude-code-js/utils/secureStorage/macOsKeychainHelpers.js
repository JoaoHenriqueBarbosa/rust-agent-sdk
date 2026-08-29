// Original: src/utils/secureStorage/macOsKeychainHelpers.ts
import { createHash as createHash2 } from "crypto";
import { userInfo as userInfo2 } from "os";
function getMacOsKeychainStorageServiceName(serviceSuffix = "") {
  let configDir = getClaudeConfigHomeDir(), dirHash = !process.env.CLAUDE_CONFIG_DIR ? "" : `-${createHash2("sha256").update(configDir).digest("hex").substring(0, 8)}`;
  return `Claude Code${getOauthConfig().OAUTH_FILE_SUFFIX}${serviceSuffix}${dirHash}`;
}
function getUsername() {
  try {
    return process.env.USER || userInfo2().username;
  } catch {
    return "claude-code-user";
  }
}
function clearKeychainCache() {
  keychainCacheState.cache = { data: null, cachedAt: 0 }, keychainCacheState.generation++, keychainCacheState.readInFlight = null;
}
function primeKeychainCacheFromPrefetch(stdout) {
  if (keychainCacheState.cache.cachedAt !== 0)
    return;
  let data = null;
  if (stdout)
    try {
      data = JSON.parse(stdout);
    } catch {
      return;
    }
  keychainCacheState.cache = { data, cachedAt: Date.now() };
}
var CREDENTIALS_SERVICE_SUFFIX = "-credentials", KEYCHAIN_CACHE_TTL_MS = 30000, keychainCacheState;
var init_macOsKeychainHelpers = __esm(() => {
  init_oauth();
  init_envUtils();
  keychainCacheState = {
    cache: { data: null, cachedAt: 0 },
    generation: 0,
    readInFlight: null
  };
});
