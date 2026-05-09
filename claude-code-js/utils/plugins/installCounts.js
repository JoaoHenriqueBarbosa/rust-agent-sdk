// Original: src/utils/plugins/installCounts.ts
import { randomBytes as randomBytes16 } from "crypto";
import { readFile as readFile40, rename as rename7, unlink as unlink14, writeFile as writeFile34 } from "fs/promises";
import { join as join116 } from "path";
function getInstallCountsCachePath() {
  return join116(getPluginsDirectory(), INSTALL_COUNTS_CACHE_FILENAME);
}
async function loadInstallCountsCache() {
  let cachePath = getInstallCountsCachePath();
  try {
    let content = await readFile40(cachePath, { encoding: "utf-8" }), parsed = jsonParse(content);
    if (typeof parsed !== "object" || parsed === null || !("version" in parsed) || !("fetchedAt" in parsed) || !("counts" in parsed))
      return logForDebugging("Install counts cache has invalid structure"), null;
    let cache6 = parsed;
    if (cache6.version !== INSTALL_COUNTS_CACHE_VERSION)
      return logForDebugging(`Install counts cache version mismatch (got ${cache6.version}, expected ${INSTALL_COUNTS_CACHE_VERSION})`), null;
    if (typeof cache6.fetchedAt !== "string" || !Array.isArray(cache6.counts))
      return logForDebugging("Install counts cache has invalid structure"), null;
    let fetchedAt = new Date(cache6.fetchedAt).getTime();
    if (Number.isNaN(fetchedAt))
      return logForDebugging("Install counts cache has invalid fetchedAt timestamp"), null;
    if (!cache6.counts.every((entry) => typeof entry === "object" && entry !== null && typeof entry.plugin === "string" && typeof entry.unique_installs === "number"))
      return logForDebugging("Install counts cache has malformed entries"), null;
    if (Date.now() - fetchedAt > CACHE_TTL_MS3)
      return logForDebugging("Install counts cache is stale (>24h old)"), null;
    return {
      version: cache6.version,
      fetchedAt: cache6.fetchedAt,
      counts: cache6.counts
    };
  } catch (error44) {
    if (getErrnoCode(error44) !== "ENOENT")
      logForDebugging(`Failed to load install counts cache: ${errorMessage(error44)}`);
    return null;
  }
}
async function saveInstallCountsCache(cache6) {
  let cachePath = getInstallCountsCachePath(), tempPath = `${cachePath}.${randomBytes16(8).toString("hex")}.tmp`;
  try {
    let pluginsDir = getPluginsDirectory();
    await getFsImplementation().mkdir(pluginsDir);
    let content = jsonStringify(cache6, null, 2);
    await writeFile34(tempPath, content, {
      encoding: "utf-8",
      mode: 384
    }), await rename7(tempPath, cachePath), logForDebugging("Install counts cache saved successfully");
  } catch (error44) {
    logError2(error44);
    try {
      await unlink14(tempPath);
    } catch {}
  }
}
async function fetchInstallCountsFromGitHub() {
  logForDebugging(`Fetching install counts from ${INSTALL_COUNTS_URL}`);
  let started = performance.now();
  try {
    let response7 = await axios_default.get(INSTALL_COUNTS_URL, {
      timeout: 1e4
    });
    if (!response7.data?.plugins || !Array.isArray(response7.data.plugins))
      throw Error("Invalid response format from install counts API");
    return logPluginFetch("install_counts", INSTALL_COUNTS_URL, "success", performance.now() - started), response7.data.plugins;
  } catch (error44) {
    throw logPluginFetch("install_counts", INSTALL_COUNTS_URL, "failure", performance.now() - started, classifyFetchError(error44)), error44;
  }
}
async function getInstallCounts() {
  let cache6 = await loadInstallCountsCache();
  if (cache6) {
    logForDebugging("Using cached install counts"), logPluginFetch("install_counts", INSTALL_COUNTS_URL, "cache_hit", 0);
    let map8 = /* @__PURE__ */ new Map;
    for (let entry of cache6.counts)
      map8.set(entry.plugin, entry.unique_installs);
    return map8;
  }
  try {
    let counts = await fetchInstallCountsFromGitHub(), newCache = {
      version: INSTALL_COUNTS_CACHE_VERSION,
      fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
      counts
    };
    await saveInstallCountsCache(newCache);
    let map8 = /* @__PURE__ */ new Map;
    for (let entry of counts)
      map8.set(entry.plugin, entry.unique_installs);
    return map8;
  } catch (error44) {
    return logError2(error44), logForDebugging(`Failed to fetch install counts: ${errorMessage(error44)}`), null;
  }
}
function formatInstallCount(count4) {
  if (count4 < 1000)
    return String(count4);
  if (count4 < 1e6) {
    let formatted2 = (count4 / 1000).toFixed(1);
    return formatted2.endsWith(".0") ? `${formatted2.slice(0, -2)}K` : `${formatted2}K`;
  }
  let formatted = (count4 / 1e6).toFixed(1);
  return formatted.endsWith(".0") ? `${formatted.slice(0, -2)}M` : `${formatted}M`;
}
var INSTALL_COUNTS_CACHE_VERSION = 1, INSTALL_COUNTS_CACHE_FILENAME = "install-counts-cache.json", INSTALL_COUNTS_URL = "https://raw.githubusercontent.com/anthropics/claude-plugins-official/refs/heads/stats/stats/plugin-installs.json", CACHE_TTL_MS3 = 86400000;
var init_installCounts = __esm(() => {
  init_axios2();
  init_debug();
  init_errors();
  init_fsOperations();
  init_log3();
  init_slowOperations();
  init_fetchTelemetry();
  init_pluginDirectories();
});
