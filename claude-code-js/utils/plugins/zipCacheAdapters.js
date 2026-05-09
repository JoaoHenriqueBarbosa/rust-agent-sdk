// Original: src/utils/plugins/zipCacheAdapters.ts
import { readFile as readFile54 } from "fs/promises";
import { join as join150 } from "path";
async function readZipCacheKnownMarketplaces() {
  try {
    let content = await readFile54(getZipCacheKnownMarketplacesPath(), "utf-8"), parsed = KnownMarketplacesFileSchema().safeParse(jsonParse(content));
    if (!parsed.success)
      return logForDebugging(`Invalid known_marketplaces.json in zip cache: ${parsed.error.message}`, { level: "error" }), {};
    return parsed.data;
  } catch {
    return {};
  }
}
async function writeZipCacheKnownMarketplaces(data) {
  await atomicWriteToZipCache(getZipCacheKnownMarketplacesPath(), jsonStringify(data, null, 2));
}
async function saveMarketplaceJsonToZipCache(marketplaceName, installLocation) {
  let zipCachePath = getPluginZipCachePath();
  if (!zipCachePath)
    return;
  let content = await readMarketplaceJsonContent(installLocation);
  if (content !== null) {
    let relPath = getMarketplaceJsonRelativePath(marketplaceName);
    await atomicWriteToZipCache(join150(zipCachePath, relPath), content);
  }
}
async function readMarketplaceJsonContent(dir) {
  let candidates = [
    join150(dir, ".claude-plugin", "marketplace.json"),
    join150(dir, "marketplace.json"),
    dir
  ];
  for (let candidate of candidates)
    try {
      return await readFile54(candidate, "utf-8");
    } catch {}
  return null;
}
async function syncMarketplacesToZipCache() {
  let knownMarketplaces = await loadKnownMarketplacesConfigSafe();
  for (let [name3, entry] of Object.entries(knownMarketplaces)) {
    if (!entry.installLocation)
      continue;
    try {
      await saveMarketplaceJsonToZipCache(name3, entry.installLocation);
    } catch (error44) {
      logForDebugging(`Failed to save marketplace JSON for ${name3}: ${error44}`);
    }
  }
  let mergedKnownMarketplaces = {
    ...await readZipCacheKnownMarketplaces(),
    ...knownMarketplaces
  };
  await writeZipCacheKnownMarketplaces(mergedKnownMarketplaces);
}
var init_zipCacheAdapters = __esm(() => {
  init_debug();
  init_slowOperations();
  init_marketplaceManager();
  init_schemas3();
  init_zipCache();
});
