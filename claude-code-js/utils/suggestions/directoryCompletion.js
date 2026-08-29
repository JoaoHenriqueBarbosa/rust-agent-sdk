// Original: src/utils/suggestions/directoryCompletion.ts
import { basename as basename34, dirname as dirname49, join as join107, sep as sep24 } from "path";
function parsePartialPath(partialPath, basePath) {
  if (!partialPath)
    return { directory: basePath || getCwd(), prefix: "" };
  let resolved = expandPath(partialPath, basePath);
  if (partialPath.endsWith("/") || partialPath.endsWith(sep24))
    return { directory: resolved, prefix: "" };
  let directory = dirname49(resolved), prefix = basename34(partialPath);
  return { directory, prefix };
}
async function scanDirectory(dirPath) {
  let cached3 = directoryCache.get(dirPath);
  if (cached3)
    return cached3;
  try {
    let directories = (await getFsImplementation().readdir(dirPath)).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).map((entry) => ({
      name: entry.name,
      path: join107(dirPath, entry.name),
      type: "directory"
    })).slice(0, 100);
    return directoryCache.set(dirPath, directories), directories;
  } catch (error44) {
    return logError2(error44), [];
  }
}
async function getDirectoryCompletions(partialPath, options2 = {}) {
  let { basePath = getCwd(), maxResults = 10 } = options2, { directory, prefix } = parsePartialPath(partialPath, basePath), entries2 = await scanDirectory(directory), prefixLower = prefix.toLowerCase();
  return entries2.filter((entry) => entry.name.toLowerCase().startsWith(prefixLower)).slice(0, maxResults).map((entry) => ({
    id: entry.path,
    displayText: entry.name + "/",
    description: "directory",
    metadata: { type: "directory" }
  }));
}
function isPathLikeToken(token) {
  return token.startsWith("~/") || token.startsWith("/") || token.startsWith("./") || token.startsWith("../") || token === "~" || token === "." || token === "..";
}
async function scanDirectoryForPaths(dirPath, includeHidden = !1) {
  let cacheKey = `${dirPath}:${includeHidden}`, cached3 = pathCache.get(cacheKey);
  if (cached3)
    return cached3;
  try {
    let paths2 = (await getFsImplementation().readdir(dirPath)).filter((entry) => includeHidden || !entry.name.startsWith(".")).map((entry) => ({
      name: entry.name,
      path: join107(dirPath, entry.name),
      type: entry.isDirectory() ? "directory" : "file"
    })).sort((a2, b) => {
      if (a2.type === "directory" && b.type !== "directory")
        return -1;
      if (a2.type !== "directory" && b.type === "directory")
        return 1;
      return a2.name.localeCompare(b.name);
    }).slice(0, 100);
    return pathCache.set(cacheKey, paths2), paths2;
  } catch (error44) {
    return logError2(error44), [];
  }
}
async function getPathCompletions(partialPath, options2 = {}) {
  let {
    basePath = getCwd(),
    maxResults = 10,
    includeFiles = !0,
    includeHidden = !1
  } = options2, { directory, prefix } = parsePartialPath(partialPath, basePath), entries2 = await scanDirectoryForPaths(directory, includeHidden), prefixLower = prefix.toLowerCase(), matches2 = entries2.filter((entry) => {
    if (!includeFiles && entry.type === "file")
      return !1;
    return entry.name.toLowerCase().startsWith(prefixLower);
  }).slice(0, maxResults), hasSeparator = partialPath.includes("/") || partialPath.includes(sep24), dirPortion = "";
  if (hasSeparator) {
    let lastSlash = partialPath.lastIndexOf("/"), lastSep = partialPath.lastIndexOf(sep24), lastSeparatorPos = Math.max(lastSlash, lastSep);
    dirPortion = partialPath.substring(0, lastSeparatorPos + 1);
  }
  if (dirPortion.startsWith("./") || dirPortion.startsWith("." + sep24))
    dirPortion = dirPortion.slice(2);
  return matches2.map((entry) => {
    let fullPath = dirPortion + entry.name;
    return {
      id: fullPath,
      displayText: entry.type === "directory" ? fullPath + "/" : fullPath,
      metadata: { type: entry.type }
    };
  });
}
var CACHE_SIZE = 500, CACHE_TTL = 300000, directoryCache, pathCache;
var init_directoryCompletion = __esm(() => {
  init_index_min();
  init_cwd2();
  init_fsOperations();
  init_log3();
  init_path2();
  directoryCache = new L({
    max: CACHE_SIZE,
    ttl: CACHE_TTL
  }), pathCache = new L({
    max: CACHE_SIZE,
    ttl: CACHE_TTL
  });
});
