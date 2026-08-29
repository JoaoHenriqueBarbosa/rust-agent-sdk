// function: getDeclaredMarketplaces
function getDeclaredMarketplaces() {
  let implicit = {}, enabledPlugins = {
    ...getAddDirEnabledPlugins(),
    ...getInitialSettings().enabledPlugins ?? {}
  };
  for (let [pluginId, value] of Object.entries(enabledPlugins))
    if (value && parsePluginIdentifier(pluginId).marketplace === OFFICIAL_MARKETPLACE_NAME) {
      implicit[OFFICIAL_MARKETPLACE_NAME] = {
        source: OFFICIAL_MARKETPLACE_SOURCE,
        sourceIsFallback: !0
      };
      break;
    }
  return {
    ...implicit,
    ...getAddDirExtraMarketplaces(),
    ...getInitialSettings().extraKnownMarketplaces ?? {}
  };
}
