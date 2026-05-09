// Original: src/migrations/migrateSonnet1mToSonnet45.ts
function migrateSonnet1mToSonnet45() {
  if (getGlobalConfig().sonnet1m45MigrationComplete)
    return;
  if (getSettingsForSource("userSettings")?.model === "sonnet[1m]")
    updateSettingsForSource("userSettings", {
      model: "sonnet-4-5-20250929[1m]"
    });
  if (getMainLoopModelOverride() === "sonnet[1m]")
    setMainLoopModelOverride("sonnet-4-5-20250929[1m]");
  saveGlobalConfig((current) => ({
    ...current,
    sonnet1m45MigrationComplete: !0
  }));
}
var init_migrateSonnet1mToSonnet45 = __esm(() => {
  init_state();
  init_config4();
  init_settings2();
});
