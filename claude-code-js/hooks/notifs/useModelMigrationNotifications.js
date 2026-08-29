// Original: src/hooks/notifs/useModelMigrationNotifications.tsx
function useModelMigrationNotifications() {
  useStartupNotification(_temp293);
}
function _temp293() {
  let config11 = getGlobalConfig(), notifs = [];
  for (let migration of MIGRATIONS) {
    let notif = migration(config11);
    if (notif)
      notifs.push(notif);
  }
  return notifs.length > 0 ? notifs : null;
}
function recent(ts) {
  return ts !== void 0 && Date.now() - ts < 3000;
}
var MIGRATIONS;
var init_useModelMigrationNotifications = __esm(() => {
  init_config4();
  init_useStartupNotification();
  MIGRATIONS = [
    (c3) => {
      if (!recent(c3.sonnet45To46MigrationTimestamp))
        return;
      return {
        key: "sonnet-46-update",
        text: "Model updated to Sonnet 4.6",
        color: "suggestion",
        priority: "high",
        timeoutMs: 3000
      };
    },
    (c3) => {
      let isLegacyRemap = Boolean(c3.legacyOpusMigrationTimestamp), ts = c3.legacyOpusMigrationTimestamp ?? c3.opusProMigrationTimestamp;
      if (!recent(ts))
        return;
      return {
        key: "opus-pro-update",
        text: isLegacyRemap ? "Model updated to Opus 4.6 \xB7 Set CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP=1 to opt out" : "Model updated to Opus 4.6",
        color: "suggestion",
        priority: "high",
        timeoutMs: isLegacyRemap ? 8000 : 3000
      };
    }
  ];
});
