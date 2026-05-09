// function: readSeedKnownMarketplaces
async function readSeedKnownMarketplaces(seedDir) {
  let seedJsonPath = join97(seedDir, "known_marketplaces.json");
  try {
    let content = await getFsImplementation().readFile(seedJsonPath, {
      encoding: "utf-8"
    }), parsed = KnownMarketplacesFileSchema().safeParse(jsonParse(content));
    if (!parsed.success)
      return logForDebugging(`Seed known_marketplaces.json invalid at ${seedDir}: ${parsed.error.message}`, { level: "warn" }), null;
    return parsed.data;
  } catch (e) {
    if (!isENOENT(e))
      logForDebugging(`Failed to read seed known_marketplaces.json at ${seedDir}: ${e}`, { level: "warn" });
    return null;
  }
}
