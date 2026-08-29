// function: getVersionedCachePath
function getVersionedCachePath(pluginId, version5) {
  return getVersionedCachePathIn(getPluginsDirectory(), pluginId, version5);
}
