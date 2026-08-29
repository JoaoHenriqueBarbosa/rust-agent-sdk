// function: getVersionedZipCachePath
function getVersionedZipCachePath(pluginId, version5) {
  return `${getVersionedCachePath(pluginId, version5)}.zip`;
}
