// function: saveKnownMarketplacesConfig
async function saveKnownMarketplacesConfig(config10) {
  let parsed = KnownMarketplacesFileSchema().safeParse(config10), configFile = getKnownMarketplacesFile();
  if (!parsed.success)
    throw new ConfigParseError(`Invalid marketplace config: ${parsed.error.message}`, configFile, config10);
  let fs17 = getFsImplementation(), dir = join97(configFile, "..");
  await fs17.mkdir(dir), writeFileSync_DEPRECATED(configFile, jsonStringify(parsed.data, null, 2), {
    encoding: "utf-8",
    flush: !0
  });
}
