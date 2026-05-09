// function: runMigrations
function runMigrations() {
  if (getGlobalConfig().migrationVersion !== CURRENT_MIGRATION_VERSION)
    migrateAutoUpdatesToSettings(), migrateBypassPermissionsAcceptedToSettings(), migrateEnableAllProjectMcpServersToSettings(), resetProToOpusDefault(), migrateSonnet1mToSonnet45(), migrateLegacyOpusToCurrent(), migrateSonnet45ToSonnet46(), migrateOpusToOpus1m(), migrateReplBridgeEnabledToRemoteControlAtStartup(), saveGlobalConfig((prev) => prev.migrationVersion === CURRENT_MIGRATION_VERSION ? prev : {
      ...prev,
      migrationVersion: CURRENT_MIGRATION_VERSION
    });
  migrateChangelogFromConfig().catch(() => {});
}
