// Original: src/migrations/migrateReplBridgeEnabledToRemoteControlAtStartup.ts
function migrateReplBridgeEnabledToRemoteControlAtStartup() {
  saveGlobalConfig((prev) => {
    let oldValue = prev.replBridgeEnabled;
    if (oldValue === void 0)
      return prev;
    if (prev.remoteControlAtStartup !== void 0)
      return prev;
    let next2 = { ...prev, remoteControlAtStartup: Boolean(oldValue) };
    return delete next2.replBridgeEnabled, next2;
  });
}
var init_migrateReplBridgeEnabledToRemoteControlAtStartup = __esm(() => {
  init_config4();
});
