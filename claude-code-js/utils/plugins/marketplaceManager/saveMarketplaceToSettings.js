// function: saveMarketplaceToSettings
function saveMarketplaceToSettings(name3, entry, settingSource = "userSettings") {
  let current = { ...(getSettingsForSource(settingSource) ?? {}).extraKnownMarketplaces };
  current[name3] = entry, updateSettingsForSource(settingSource, { extraKnownMarketplaces: current });
}
