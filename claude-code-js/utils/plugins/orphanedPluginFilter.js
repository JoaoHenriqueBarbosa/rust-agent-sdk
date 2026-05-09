// Original: src/utils/plugins/orphanedPluginFilter.ts
import { dirname as dirname36, isAbsolute as isAbsolute21, join as join83, normalize as normalize12, relative as relative16, sep as sep18 } from "path";
async function getGlobExclusionsForPluginCache(searchPath) {
  let cachePath = normalize12(join83(getPluginsDirectory(), "cache"));
  if (searchPath && !pathsOverlap(searchPath, cachePath))
    return [];
  if (cachedExclusions !== null)
    return cachedExclusions;
  try {
    return cachedExclusions = (await ripGrep([
      "--files",
      "--hidden",
      "--no-ignore",
      "--max-depth",
      "4",
      "--glob",
      ORPHANED_AT_FILENAME
    ], cachePath, new AbortController().signal)).map((markerPath) => {
      let versionDir = dirname36(markerPath);
      return `!**/${(isAbsolute21(versionDir) ? relative16(cachePath, versionDir) : versionDir).replace(/\\/g, "/")}/**`;
    }), cachedExclusions;
  } catch {
    return cachedExclusions = [], cachedExclusions;
  }
}
function clearPluginCacheExclusions() {
  cachedExclusions = null;
}
function pathsOverlap(a2, b) {
  let na = normalizeForCompare(a2), nb = normalizeForCompare(b);
  return na === nb || na === sep18 || nb === sep18 || na.startsWith(nb + sep18) || nb.startsWith(na + sep18);
}
function normalizeForCompare(p4) {
  let n5 = normalize12(p4);
  return process.platform === "win32" ? n5.toLowerCase() : n5;
}
var ORPHANED_AT_FILENAME = ".orphaned_at", cachedExclusions = null;
var init_orphanedPluginFilter = __esm(() => {
  init_ripgrep();
  init_pluginDirectories();
});
