// function: getVersionedCachePathIn
function getVersionedCachePathIn(baseDir, pluginId, version5) {
  let { name: pluginName, marketplace } = parsePluginIdentifier(pluginId), sanitizedMarketplace = (marketplace || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"), sanitizedPlugin = (pluginName || pluginId).replace(/[^a-zA-Z0-9\-_]/g, "-"), sanitizedVersion = version5.replace(/[^a-zA-Z0-9\-_.]/g, "-");
  return join100(baseDir, "cache", sanitizedMarketplace, sanitizedPlugin, sanitizedVersion);
}
