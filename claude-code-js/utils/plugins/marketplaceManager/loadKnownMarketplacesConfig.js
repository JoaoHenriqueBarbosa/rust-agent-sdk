// function: loadKnownMarketplacesConfig
async function loadKnownMarketplacesConfig() {
  let fs17 = getFsImplementation(), configFile = getKnownMarketplacesFile();
  try {
    let content = await fs17.readFile(configFile, {
      encoding: "utf-8"
    }), data = jsonParse(content), parsed = KnownMarketplacesFileSchema().safeParse(data);
    if (!parsed.success) {
      let errorMsg = `Marketplace configuration file is corrupted: ${parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`;
      throw logForDebugging(errorMsg, {
        level: "error"
      }), new ConfigParseError(errorMsg, configFile, data);
    }
    return parsed.data;
  } catch (error44) {
    if (isENOENT(error44))
      return {};
    if (error44 instanceof ConfigParseError)
      throw error44;
    let errorMsg = `Failed to load marketplace configuration: ${errorMessage(error44)}`;
    throw logForDebugging(errorMsg, {
      level: "error"
    }), Error(errorMsg);
  }
}
