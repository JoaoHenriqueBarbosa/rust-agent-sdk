// Original: src/migrations/migrateOpusToOpus1m.ts
function migrateOpusToOpus1m() {
  if (!isOpus1mMergeEnabled())
    return;
  if (getSettingsForSource("userSettings")?.model !== "opus")
    return;
  let migrated = "opus[1m]", modelToSet = parseUserSpecifiedModel(migrated) === parseUserSpecifiedModel(getDefaultMainLoopModelSetting()) ? void 0 : migrated;
  updateSettingsForSource("userSettings", { model: modelToSet }), logEvent("tengu_opus_to_opus1m_migration", {});
}
var init_migrateOpusToOpus1m = __esm(() => {
  init_model();
  init_settings2();
});
