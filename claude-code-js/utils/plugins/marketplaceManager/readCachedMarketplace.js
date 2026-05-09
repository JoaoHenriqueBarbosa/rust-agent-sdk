// function: readCachedMarketplace
async function readCachedMarketplace(installLocation) {
  let nestedPath = join97(installLocation, ".claude-plugin", "marketplace.json");
  try {
    return await parseFileWithSchema(nestedPath, PluginMarketplaceSchema());
  } catch (e) {
    if (e instanceof ConfigParseError)
      throw e;
    let code = getErrnoCode(e);
    if (code !== "ENOENT" && code !== "ENOTDIR")
      throw e;
  }
  return await parseFileWithSchema(installLocation, PluginMarketplaceSchema());
}
