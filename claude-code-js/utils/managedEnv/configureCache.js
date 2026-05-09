// function: configureCache
function configureCache(overrides) {
  if (Object.assign(cacheSettings, overrides), !cacheSettings.backgroundSync)
    clearAutoRefresh();
}
