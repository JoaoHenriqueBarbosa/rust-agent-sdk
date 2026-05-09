// function: removeExtraMarketplace
function removeExtraMarketplace(name3, sources) {
  for (let {
    source
  } of sources) {
    let settings = getSettingsForSource(source);
    if (!settings)
      continue;
    let updates = {};
    if (settings.extraKnownMarketplaces?.[name3])
      updates.extraKnownMarketplaces = {
        ...settings.extraKnownMarketplaces,
        [name3]: void 0
      };
    if (settings.enabledPlugins) {
      let suffix = `@${name3}`, removedPlugins = !1, updatedPlugins = {
        ...settings.enabledPlugins
      };
      for (let pluginId in updatedPlugins)
        if (pluginId.endsWith(suffix))
          updatedPlugins[pluginId] = void 0, removedPlugins = !0;
      if (removedPlugins)
        updates.enabledPlugins = updatedPlugins;
    }
    if (Object.keys(updates).length > 0)
      updateSettingsForSource(source, updates);
  }
}
