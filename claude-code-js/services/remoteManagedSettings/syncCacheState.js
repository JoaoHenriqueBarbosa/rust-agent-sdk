// Original: src/services/remoteManagedSettings/syncCacheState.ts
import { join as join6 } from "path";
function setSessionCache(value) {
  sessionCache = value;
}
function resetSyncCache() {
  sessionCache = null, eligible = void 0;
}
function setEligibility(v) {
  return eligible = v, v;
}
function getSettingsPath() {
  return join6(getClaudeConfigHomeDir(), SETTINGS_FILENAME);
}
function loadSettings() {
  try {
    let content = readFileSync4(getSettingsPath()), data = jsonParse(stripBOM(content));
    if (!data || typeof data !== "object" || Array.isArray(data))
      return null;
    return data;
  } catch {
    return null;
  }
}
function getRemoteManagedSettingsSyncFromCache() {
  if (eligible !== !0)
    return null;
  if (sessionCache)
    return sessionCache;
  let cachedSettings = loadSettings();
  if (cachedSettings)
    return sessionCache = cachedSettings, resetSettingsCache(), cachedSettings;
  return null;
}
var SETTINGS_FILENAME = "remote-settings.json", sessionCache = null, eligible;
var init_syncCacheState = __esm(() => {
  init_envUtils();
  init_fileRead();
  init_settingsCache();
  init_slowOperations();
});
