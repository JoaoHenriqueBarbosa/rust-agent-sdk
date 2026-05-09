// function: getMarketplaceCacheOnly
async function getMarketplaceCacheOnly(name3) {
  let fs17 = getFsImplementation(), configFile = getKnownMarketplacesFile();
  try {
    let content = await fs17.readFile(configFile, { encoding: "utf-8" }), entry = jsonParse(content)[name3];
    if (!entry)
      return null;
    return await readCachedMarketplace(entry.installLocation);
  } catch (error44) {
    if (isENOENT(error44))
      return null;
    return logForDebugging(`Failed to read cached marketplace ${name3}: ${errorMessage(error44)}`, { level: "warn" }), null;
  }
}
