// Original: src/migrations/migrateLegacyOpusToCurrent.ts
function migrateLegacyOpusToCurrent() {
  if (getAPIProvider() !== "firstParty")
    return;
  if (!isLegacyModelRemapEnabled())
    return;
  let model = getSettingsForSource("userSettings")?.model;
  if (model !== "claude-opus-4-20250514" && model !== "claude-opus-4-1-20250805" && model !== "claude-opus-4-0" && model !== "claude-opus-4-1")
    return;
  updateSettingsForSource("userSettings", { model: "opus" }), saveGlobalConfig((current) => ({
    ...current,
    legacyOpusMigrationTimestamp: Date.now()
  })), logEvent("tengu_legacy_opus_migration", {
    from_model: model
  });
}
var init_migrateLegacyOpusToCurrent = __esm(() => {
  init_config4();
  init_model();
  init_providers();
  init_settings2();
});
