// Original: src/migrations/migrateSonnet45ToSonnet46.ts
function migrateSonnet45ToSonnet46() {
  if (getAPIProvider() !== "firstParty")
    return;
  if (!isProSubscriber() && !isMaxSubscriber() && !isTeamPremiumSubscriber())
    return;
  let model = getSettingsForSource("userSettings")?.model;
  if (model !== "claude-sonnet-4-5-20250929" && model !== "claude-sonnet-4-5-20250929[1m]" && model !== "sonnet-4-5-20250929" && model !== "sonnet-4-5-20250929[1m]")
    return;
  let has1m = model.endsWith("[1m]");
  if (updateSettingsForSource("userSettings", {
    model: has1m ? "sonnet[1m]" : "sonnet"
  }), getGlobalConfig().numStartups > 1)
    saveGlobalConfig((current) => ({
      ...current,
      sonnet45To46MigrationTimestamp: Date.now()
    }));
  logEvent("tengu_sonnet45_to_46_migration", {
    from_model: model,
    has_1m: has1m
  });
}
var init_migrateSonnet45ToSonnet46 = __esm(() => {
  init_auth14();
  init_config4();
  init_providers();
  init_settings2();
});
