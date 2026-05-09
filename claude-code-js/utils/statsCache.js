// Original: src/utils/statsCache.ts
import { randomBytes as randomBytes18 } from "crypto";
import { open as open14 } from "fs/promises";
import { join as join130 } from "path";
async function withStatsCacheLock(fn) {
  while (statsCacheLockPromise)
    await statsCacheLockPromise;
  let releaseLock2;
  statsCacheLockPromise = new Promise((resolve44) => {
    releaseLock2 = resolve44;
  });
  try {
    return await fn();
  } finally {
    statsCacheLockPromise = null, releaseLock2?.();
  }
}
function getStatsCachePath() {
  return join130(getClaudeConfigHomeDir(), STATS_CACHE_FILENAME);
}
function getEmptyCache() {
  return {
    version: STATS_CACHE_VERSION,
    lastComputedDate: null,
    dailyActivity: [],
    dailyModelTokens: [],
    modelUsage: {},
    totalSessions: 0,
    totalMessages: 0,
    longestSession: null,
    firstSessionDate: null,
    hourCounts: {},
    totalSpeculationTimeSavedMs: 0,
    shotDistribution: {}
  };
}
function migrateStatsCache(parsed) {
  if (typeof parsed.version !== "number" || parsed.version < MIN_MIGRATABLE_VERSION || parsed.version > STATS_CACHE_VERSION)
    return null;
  if (!Array.isArray(parsed.dailyActivity) || !Array.isArray(parsed.dailyModelTokens) || typeof parsed.totalSessions !== "number" || typeof parsed.totalMessages !== "number")
    return null;
  return {
    version: STATS_CACHE_VERSION,
    lastComputedDate: parsed.lastComputedDate ?? null,
    dailyActivity: parsed.dailyActivity,
    dailyModelTokens: parsed.dailyModelTokens,
    modelUsage: parsed.modelUsage ?? {},
    totalSessions: parsed.totalSessions,
    totalMessages: parsed.totalMessages,
    longestSession: parsed.longestSession ?? null,
    firstSessionDate: parsed.firstSessionDate ?? null,
    hourCounts: parsed.hourCounts ?? {},
    totalSpeculationTimeSavedMs: parsed.totalSpeculationTimeSavedMs ?? 0,
    shotDistribution: parsed.shotDistribution
  };
}
async function loadStatsCache() {
  let fs18 = getFsImplementation(), cachePath = getStatsCachePath();
  try {
    let content = await fs18.readFile(cachePath, { encoding: "utf-8" }), parsed = jsonParse(content);
    if (parsed.version !== STATS_CACHE_VERSION) {
      let migrated = migrateStatsCache(parsed);
      if (!migrated)
        return logForDebugging(`Stats cache version ${parsed.version} not migratable (expected ${STATS_CACHE_VERSION}), returning empty cache`), getEmptyCache();
      return logForDebugging(`Migrated stats cache from v${parsed.version} to v${STATS_CACHE_VERSION}`), await saveStatsCache(migrated), migrated;
    }
    if (!Array.isArray(parsed.dailyActivity) || !Array.isArray(parsed.dailyModelTokens) || typeof parsed.totalSessions !== "number" || typeof parsed.totalMessages !== "number")
      return logForDebugging("Stats cache has invalid structure, returning empty cache"), getEmptyCache();
    return parsed;
  } catch (error44) {
    return logForDebugging(`Failed to load stats cache: ${errorMessage(error44)}`), getEmptyCache();
  }
}
async function saveStatsCache(cache7) {
  let fs18 = getFsImplementation(), cachePath = getStatsCachePath(), tempPath = `${cachePath}.${randomBytes18(8).toString("hex")}.tmp`;
  try {
    let configDir = getClaudeConfigHomeDir();
    try {
      await fs18.mkdir(configDir);
    } catch {}
    let content = jsonStringify(cache7, null, 2), handle = await open14(tempPath, "w", 384);
    try {
      await handle.writeFile(content, { encoding: "utf-8" }), await handle.sync();
    } finally {
      await handle.close();
    }
    await fs18.rename(tempPath, cachePath), logForDebugging(`Stats cache saved successfully (lastComputedDate: ${cache7.lastComputedDate})`);
  } catch (error44) {
    logError2(error44);
    try {
      await fs18.unlink(tempPath);
    } catch {}
  }
}
function mergeCacheWithNewStats(existingCache, newStats, newLastComputedDate) {
  let dailyActivityMap = /* @__PURE__ */ new Map;
  for (let day of existingCache.dailyActivity)
    dailyActivityMap.set(day.date, { ...day });
  for (let day of newStats.dailyActivity) {
    let existing = dailyActivityMap.get(day.date);
    if (existing)
      existing.messageCount += day.messageCount, existing.sessionCount += day.sessionCount, existing.toolCallCount += day.toolCallCount;
    else
      dailyActivityMap.set(day.date, { ...day });
  }
  let dailyModelTokensMap = /* @__PURE__ */ new Map;
  for (let day of existingCache.dailyModelTokens)
    dailyModelTokensMap.set(day.date, { ...day.tokensByModel });
  for (let day of newStats.dailyModelTokens) {
    let existing = dailyModelTokensMap.get(day.date);
    if (existing)
      for (let [model, tokens] of Object.entries(day.tokensByModel))
        existing[model] = (existing[model] || 0) + tokens;
    else
      dailyModelTokensMap.set(day.date, { ...day.tokensByModel });
  }
  let modelUsage = { ...existingCache.modelUsage };
  for (let [model, usage] of Object.entries(newStats.modelUsage))
    if (modelUsage[model])
      modelUsage[model] = {
        inputTokens: modelUsage[model].inputTokens + usage.inputTokens,
        outputTokens: modelUsage[model].outputTokens + usage.outputTokens,
        cacheReadInputTokens: modelUsage[model].cacheReadInputTokens + usage.cacheReadInputTokens,
        cacheCreationInputTokens: modelUsage[model].cacheCreationInputTokens + usage.cacheCreationInputTokens,
        webSearchRequests: modelUsage[model].webSearchRequests + usage.webSearchRequests,
        costUSD: modelUsage[model].costUSD + usage.costUSD,
        contextWindow: Math.max(modelUsage[model].contextWindow, usage.contextWindow),
        maxOutputTokens: Math.max(modelUsage[model].maxOutputTokens, usage.maxOutputTokens)
      };
    else
      modelUsage[model] = { ...usage };
  let hourCounts = { ...existingCache.hourCounts };
  for (let [hour, count4] of Object.entries(newStats.hourCounts)) {
    let hourNum = parseInt(hour, 10);
    hourCounts[hourNum] = (hourCounts[hourNum] || 0) + count4;
  }
  let totalSessions = existingCache.totalSessions + newStats.sessionStats.length, totalMessages = existingCache.totalMessages + newStats.sessionStats.reduce((sum, s2) => sum + s2.messageCount, 0), longestSession = existingCache.longestSession;
  for (let session2 of newStats.sessionStats)
    if (!longestSession || session2.duration > longestSession.duration)
      longestSession = session2;
  let firstSessionDate = existingCache.firstSessionDate;
  for (let session2 of newStats.sessionStats)
    if (!firstSessionDate || session2.timestamp < firstSessionDate)
      firstSessionDate = session2.timestamp;
  return {
    version: STATS_CACHE_VERSION,
    lastComputedDate: newLastComputedDate,
    dailyActivity: Array.from(dailyActivityMap.values()).sort((a2, b) => a2.date.localeCompare(b.date)),
    dailyModelTokens: Array.from(dailyModelTokensMap.entries()).map(([date6, tokensByModel]) => ({ date: date6, tokensByModel })).sort((a2, b) => a2.date.localeCompare(b.date)),
    modelUsage,
    totalSessions,
    totalMessages,
    longestSession,
    firstSessionDate,
    hourCounts,
    totalSpeculationTimeSavedMs: existingCache.totalSpeculationTimeSavedMs + newStats.totalSpeculationTimeSavedMs
  };
}
function toDateString(date6) {
  let dateStr = date6.toISOString().split("T")[0];
  if (!dateStr)
    throw Error("Invalid ISO date string");
  return dateStr;
}
function getTodayDateString() {
  return toDateString(/* @__PURE__ */ new Date);
}
function getYesterdayDateString() {
  let yesterday = /* @__PURE__ */ new Date;
  return yesterday.setDate(yesterday.getDate() - 1), toDateString(yesterday);
}
function isDateBefore(date1, date22) {
  return date1 < date22;
}
var STATS_CACHE_VERSION = 3, MIN_MIGRATABLE_VERSION = 1, STATS_CACHE_FILENAME = "stats-cache.json", statsCacheLockPromise = null;
var init_statsCache = __esm(() => {
  init_debug();
  init_envUtils();
  init_errors();
  init_fsOperations();
  init_log3();
  init_slowOperations();
});
