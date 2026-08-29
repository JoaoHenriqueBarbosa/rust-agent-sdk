// Original: src/utils/settings/settingsCache.ts
function getSessionSettingsCache() {
  return sessionSettingsCache;
}
function setSessionSettingsCache(value) {
  sessionSettingsCache = value;
}
function getCachedSettingsForSource(source) {
  return perSourceCache.has(source) ? perSourceCache.get(source) : void 0;
}
function setCachedSettingsForSource(source, value) {
  perSourceCache.set(source, value);
}
function getCachedParsedFile(path) {
  return parseFileCache.get(path);
}
function setCachedParsedFile(path, value) {
  parseFileCache.set(path, value);
}
function resetSettingsCache() {
  sessionSettingsCache = null, perSourceCache.clear(), parseFileCache.clear();
}
function getPluginSettingsBase() {
  return pluginSettingsBase;
}
function setPluginSettingsBase(settings) {
  pluginSettingsBase = settings;
}
function clearPluginSettingsBase() {
  pluginSettingsBase = void 0;
}
var sessionSettingsCache = null, perSourceCache, parseFileCache, pluginSettingsBase;
var init_settingsCache = __esm(() => {
  perSourceCache = /* @__PURE__ */ new Map;
  parseFileCache = /* @__PURE__ */ new Map;
});
