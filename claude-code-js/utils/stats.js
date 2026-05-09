// Original: src/utils/stats.ts
import { open as open15 } from "fs/promises";
import { basename as basename38, join as join132, sep as sep30 } from "path";
async function processSessionFiles(sessionFiles, options2 = {}) {
  let { fromDate, toDate: toDate2 } = options2, fs18 = getFsImplementation(), dailyActivityMap = /* @__PURE__ */ new Map, dailyModelTokensMap = /* @__PURE__ */ new Map, sessions = [], hourCounts = /* @__PURE__ */ new Map, totalMessages = 0, totalSpeculationTimeSavedMs = 0, modelUsageAgg = {}, shotDistributionMap = void 0, sessionsWithShotCount = /* @__PURE__ */ new Set, BATCH_SIZE = 20;
  for (let i5 = 0;i5 < sessionFiles.length; i5 += BATCH_SIZE) {
    let batch = sessionFiles.slice(i5, i5 + BATCH_SIZE), results = await Promise.all(batch.map(async (sessionFile) => {
      try {
        if (fromDate) {
          let fileSize = 0;
          try {
            let fileStat = await fs18.stat(sessionFile), fileModifiedDate = toDateString(fileStat.mtime);
            if (isDateBefore(fileModifiedDate, fromDate))
              return {
                sessionFile,
                entries: null,
                error: null,
                skipped: !0
              };
            fileSize = fileStat.size;
          } catch {}
          if (fileSize > 65536) {
            let startDate = await readSessionStartDate(sessionFile);
            if (startDate && isDateBefore(startDate, fromDate))
              return {
                sessionFile,
                entries: null,
                error: null,
                skipped: !0
              };
          }
        }
        let entries2 = await readJSONLFile(sessionFile);
        return { sessionFile, entries: entries2, error: null, skipped: !1 };
      } catch (error44) {
        return { sessionFile, entries: null, error: error44, skipped: !1 };
      }
    }));
    for (let { sessionFile, entries: entries2, error: error44, skipped } of results) {
      if (skipped)
        continue;
      if (error44 || !entries2) {
        logForDebugging(`Failed to read session file ${sessionFile}: ${errorMessage(error44)}`);
        continue;
      }
      let sessionId = basename38(sessionFile, ".jsonl"), messages = [];
      for (let entry of entries2)
        if (isTranscriptMessage(entry))
          messages.push(entry);
        else if (entry.type === "speculation-accept")
          totalSpeculationTimeSavedMs += entry.timeSavedMs;
      if (messages.length === 0)
        continue;
      let isSubagentFile = sessionFile.includes(`${sep30}subagents${sep30}`), mainMessages = isSubagentFile ? messages : messages.filter((m4) => !m4.isSidechain);
      if (mainMessages.length === 0)
        continue;
      let firstMessage = mainMessages[0], lastMessage = mainMessages.at(-1), firstTimestamp = new Date(firstMessage.timestamp), lastTimestamp = new Date(lastMessage.timestamp);
      if (isNaN(firstTimestamp.getTime()) || isNaN(lastTimestamp.getTime())) {
        logForDebugging(`Skipping session with invalid timestamp: ${sessionFile}`);
        continue;
      }
      let dateKey = toDateString(firstTimestamp);
      if (fromDate && isDateBefore(dateKey, fromDate))
        continue;
      if (toDate2 && isDateBefore(toDate2, dateKey))
        continue;
      let existing = dailyActivityMap.get(dateKey) || {
        date: dateKey,
        messageCount: 0,
        sessionCount: 0,
        toolCallCount: 0
      };
      if (!isSubagentFile) {
        let duration3 = lastTimestamp.getTime() - firstTimestamp.getTime();
        sessions.push({
          sessionId,
          duration: duration3,
          messageCount: mainMessages.length,
          timestamp: firstMessage.timestamp
        }), totalMessages += mainMessages.length, existing.sessionCount++, existing.messageCount += mainMessages.length;
        let hour = firstTimestamp.getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      }
      if (!isSubagentFile || dailyActivityMap.has(dateKey))
        dailyActivityMap.set(dateKey, existing);
      for (let message of mainMessages)
        if (message.type === "assistant") {
          let content = message.message?.content;
          if (Array.isArray(content)) {
            for (let block2 of content)
              if (block2.type === "tool_use") {
                let activity = dailyActivityMap.get(dateKey);
                if (activity)
                  activity.toolCallCount++;
              }
          }
          if (message.message?.usage) {
            let usage = message.message.usage, model = message.message.model || "unknown";
            if (model === SYNTHETIC_MODEL)
              continue;
            if (!modelUsageAgg[model])
              modelUsageAgg[model] = {
                inputTokens: 0,
                outputTokens: 0,
                cacheReadInputTokens: 0,
                cacheCreationInputTokens: 0,
                webSearchRequests: 0,
                costUSD: 0,
                contextWindow: 0,
                maxOutputTokens: 0
              };
            modelUsageAgg[model].inputTokens += usage.input_tokens || 0, modelUsageAgg[model].outputTokens += usage.output_tokens || 0, modelUsageAgg[model].cacheReadInputTokens += usage.cache_read_input_tokens || 0, modelUsageAgg[model].cacheCreationInputTokens += usage.cache_creation_input_tokens || 0;
            let totalTokens = (usage.input_tokens || 0) + (usage.output_tokens || 0);
            if (totalTokens > 0) {
              let dayTokens = dailyModelTokensMap.get(dateKey) || {};
              dayTokens[model] = (dayTokens[model] || 0) + totalTokens, dailyModelTokensMap.set(dateKey, dayTokens);
            }
          }
        }
    }
  }
  return {
    dailyActivity: Array.from(dailyActivityMap.values()).sort((a2, b) => a2.date.localeCompare(b.date)),
    dailyModelTokens: Array.from(dailyModelTokensMap.entries()).map(([date6, tokensByModel]) => ({ date: date6, tokensByModel })).sort((a2, b) => a2.date.localeCompare(b.date)),
    modelUsage: modelUsageAgg,
    sessionStats: sessions,
    hourCounts: Object.fromEntries(hourCounts),
    totalMessages,
    totalSpeculationTimeSavedMs,
    ...{}
  };
}
async function getAllSessionFiles() {
  let projectsDir = getProjectsDir2(), fs18 = getFsImplementation(), allEntries;
  try {
    allEntries = await fs18.readdir(projectsDir);
  } catch (e) {
    if (isENOENT(e))
      return [];
    throw e;
  }
  let projectDirs = allEntries.filter((dirent) => dirent.isDirectory()).map((dirent) => join132(projectsDir, dirent.name));
  return (await Promise.all(projectDirs.map(async (projectDir) => {
    try {
      let entries2 = await fs18.readdir(projectDir), mainFiles = entries2.filter((dirent) => dirent.isFile() && dirent.name.endsWith(".jsonl")).map((dirent) => join132(projectDir, dirent.name)), sessionDirs = entries2.filter((dirent) => dirent.isDirectory()), subagentResults = await Promise.all(sessionDirs.map(async (sessionDir) => {
        let subagentsDir = join132(projectDir, sessionDir.name, "subagents");
        try {
          return (await fs18.readdir(subagentsDir)).filter((dirent) => dirent.isFile() && dirent.name.endsWith(".jsonl") && dirent.name.startsWith("agent-")).map((dirent) => join132(subagentsDir, dirent.name));
        } catch {
          return [];
        }
      }));
      return [...mainFiles, ...subagentResults.flat()];
    } catch (error44) {
      return logForDebugging(`Failed to read project directory ${projectDir}: ${errorMessage(error44)}`), [];
    }
  }))).flat();
}
function cacheToStats(cache7, todayStats) {
  let dailyActivityMap = /* @__PURE__ */ new Map;
  for (let day of cache7.dailyActivity)
    dailyActivityMap.set(day.date, { ...day });
  if (todayStats)
    for (let day of todayStats.dailyActivity) {
      let existing = dailyActivityMap.get(day.date);
      if (existing)
        existing.messageCount += day.messageCount, existing.sessionCount += day.sessionCount, existing.toolCallCount += day.toolCallCount;
      else
        dailyActivityMap.set(day.date, { ...day });
    }
  let dailyModelTokensMap = /* @__PURE__ */ new Map;
  for (let day of cache7.dailyModelTokens)
    dailyModelTokensMap.set(day.date, { ...day.tokensByModel });
  if (todayStats)
    for (let day of todayStats.dailyModelTokens) {
      let existing = dailyModelTokensMap.get(day.date);
      if (existing)
        for (let [model, tokens] of Object.entries(day.tokensByModel))
          existing[model] = (existing[model] || 0) + tokens;
      else
        dailyModelTokensMap.set(day.date, { ...day.tokensByModel });
    }
  let modelUsage = { ...cache7.modelUsage };
  if (todayStats)
    for (let [model, usage] of Object.entries(todayStats.modelUsage))
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
  let hourCountsMap = /* @__PURE__ */ new Map;
  for (let [hour, count4] of Object.entries(cache7.hourCounts))
    hourCountsMap.set(parseInt(hour, 10), count4);
  if (todayStats)
    for (let [hour, count4] of Object.entries(todayStats.hourCounts)) {
      let hourNum = parseInt(hour, 10);
      hourCountsMap.set(hourNum, (hourCountsMap.get(hourNum) || 0) + count4);
    }
  let dailyActivityArray = Array.from(dailyActivityMap.values()).sort((a2, b) => a2.date.localeCompare(b.date)), streaks = calculateStreaks(dailyActivityArray), dailyModelTokens = Array.from(dailyModelTokensMap.entries()).map(([date6, tokensByModel]) => ({ date: date6, tokensByModel })).sort((a2, b) => a2.date.localeCompare(b.date)), totalSessions = cache7.totalSessions + (todayStats?.sessionStats.length || 0), totalMessages = cache7.totalMessages + (todayStats?.totalMessages || 0), longestSession = cache7.longestSession;
  if (todayStats) {
    for (let session2 of todayStats.sessionStats)
      if (!longestSession || session2.duration > longestSession.duration)
        longestSession = session2;
  }
  let firstSessionDate = cache7.firstSessionDate, lastSessionDate = null;
  if (todayStats)
    for (let session2 of todayStats.sessionStats) {
      if (!firstSessionDate || session2.timestamp < firstSessionDate)
        firstSessionDate = session2.timestamp;
      if (!lastSessionDate || session2.timestamp > lastSessionDate)
        lastSessionDate = session2.timestamp;
    }
  if (!lastSessionDate && dailyActivityArray.length > 0)
    lastSessionDate = dailyActivityArray.at(-1).date;
  let peakActivityDay = dailyActivityArray.length > 0 ? dailyActivityArray.reduce((max2, d) => d.messageCount > max2.messageCount ? d : max2).date : null, peakActivityHour = hourCountsMap.size > 0 ? Array.from(hourCountsMap.entries()).reduce((max2, [hour, count4]) => count4 > max2[1] ? [hour, count4] : max2)[0] : null, totalDays = firstSessionDate && lastSessionDate ? Math.ceil((new Date(lastSessionDate).getTime() - new Date(firstSessionDate).getTime()) / 86400000) + 1 : 0, totalSpeculationTimeSavedMs = cache7.totalSpeculationTimeSavedMs + (todayStats?.totalSpeculationTimeSavedMs || 0);
  return {
    totalSessions,
    totalMessages,
    totalDays,
    activeDays: dailyActivityMap.size,
    streaks,
    dailyActivity: dailyActivityArray,
    dailyModelTokens,
    longestSession,
    modelUsage,
    firstSessionDate,
    lastSessionDate,
    peakActivityDay,
    peakActivityHour,
    totalSpeculationTimeSavedMs
  };
}
async function aggregateClaudeCodeStats() {
  let allSessionFiles = await getAllSessionFiles();
  if (allSessionFiles.length === 0)
    return getEmptyStats();
  let updatedCache = await withStatsCacheLock(async () => {
    let cache7 = await loadStatsCache(), yesterday = getYesterdayDateString(), result = cache7;
    if (!cache7.lastComputedDate) {
      logForDebugging("Stats cache empty, processing all historical data");
      let historicalStats = await processSessionFiles(allSessionFiles, {
        toDate: yesterday
      });
      if (historicalStats.sessionStats.length > 0 || historicalStats.dailyActivity.length > 0)
        result = mergeCacheWithNewStats(cache7, historicalStats, yesterday), await saveStatsCache(result);
    } else if (isDateBefore(cache7.lastComputedDate, yesterday)) {
      let nextDay = getNextDay(cache7.lastComputedDate);
      logForDebugging(`Stats cache stale (${cache7.lastComputedDate}), processing ${nextDay} to ${yesterday}`);
      let newStats = await processSessionFiles(allSessionFiles, {
        fromDate: nextDay,
        toDate: yesterday
      });
      if (newStats.sessionStats.length > 0 || newStats.dailyActivity.length > 0)
        result = mergeCacheWithNewStats(cache7, newStats, yesterday), await saveStatsCache(result);
      else
        result = { ...cache7, lastComputedDate: yesterday }, await saveStatsCache(result);
    }
    return result;
  }), today = getTodayDateString(), todayStats = await processSessionFiles(allSessionFiles, {
    fromDate: today,
    toDate: today
  });
  return cacheToStats(updatedCache, todayStats);
}
async function aggregateClaudeCodeStatsForRange(range) {
  if (range === "all")
    return aggregateClaudeCodeStats();
  let allSessionFiles = await getAllSessionFiles();
  if (allSessionFiles.length === 0)
    return getEmptyStats();
  let today = /* @__PURE__ */ new Date, daysBack = range === "7d" ? 7 : 30, fromDate = new Date(today);
  fromDate.setDate(today.getDate() - daysBack + 1);
  let fromDateStr = toDateString(fromDate), stats = await processSessionFiles(allSessionFiles, {
    fromDate: fromDateStr
  });
  return processedStatsToClaudeCodeStats(stats);
}
function processedStatsToClaudeCodeStats(stats) {
  let dailyActivitySorted = stats.dailyActivity.slice().sort((a2, b) => a2.date.localeCompare(b.date)), dailyModelTokensSorted = stats.dailyModelTokens.slice().sort((a2, b) => a2.date.localeCompare(b.date)), streaks = calculateStreaks(dailyActivitySorted), longestSession = null;
  for (let session2 of stats.sessionStats)
    if (!longestSession || session2.duration > longestSession.duration)
      longestSession = session2;
  let firstSessionDate = null, lastSessionDate = null;
  for (let session2 of stats.sessionStats) {
    if (!firstSessionDate || session2.timestamp < firstSessionDate)
      firstSessionDate = session2.timestamp;
    if (!lastSessionDate || session2.timestamp > lastSessionDate)
      lastSessionDate = session2.timestamp;
  }
  let peakActivityDay = dailyActivitySorted.length > 0 ? dailyActivitySorted.reduce((max2, d) => d.messageCount > max2.messageCount ? d : max2).date : null, hourEntries = Object.entries(stats.hourCounts), peakActivityHour = hourEntries.length > 0 ? parseInt(hourEntries.reduce((max2, [hour, count4]) => count4 > parseInt(max2[1].toString()) ? [hour, count4] : max2)[0], 10) : null, totalDays = firstSessionDate && lastSessionDate ? Math.ceil((new Date(lastSessionDate).getTime() - new Date(firstSessionDate).getTime()) / 86400000) + 1 : 0;
  return {
    totalSessions: stats.sessionStats.length,
    totalMessages: stats.totalMessages,
    totalDays,
    activeDays: stats.dailyActivity.length,
    streaks,
    dailyActivity: dailyActivitySorted,
    dailyModelTokens: dailyModelTokensSorted,
    longestSession,
    modelUsage: stats.modelUsage,
    firstSessionDate,
    lastSessionDate,
    peakActivityDay,
    peakActivityHour,
    totalSpeculationTimeSavedMs: stats.totalSpeculationTimeSavedMs
  };
}
function getNextDay(dateStr) {
  let date6 = new Date(dateStr);
  return date6.setDate(date6.getDate() + 1), toDateString(date6);
}
function calculateStreaks(dailyActivity) {
  if (dailyActivity.length === 0)
    return {
      currentStreak: 0,
      longestStreak: 0,
      currentStreakStart: null,
      longestStreakStart: null,
      longestStreakEnd: null
    };
  let today = /* @__PURE__ */ new Date;
  today.setHours(0, 0, 0, 0);
  let currentStreak = 0, currentStreakStart = null, checkDate = new Date(today), activeDates = new Set(dailyActivity.map((d) => d.date));
  while (!0) {
    let dateStr = toDateString(checkDate);
    if (!activeDates.has(dateStr))
      break;
    currentStreak++, currentStreakStart = dateStr, checkDate.setDate(checkDate.getDate() - 1);
  }
  let longestStreak = 0, longestStreakStart = null, longestStreakEnd = null;
  if (dailyActivity.length > 0) {
    let sortedDates = Array.from(activeDates).sort(), tempStreak = 1, tempStart = sortedDates[0];
    for (let i5 = 1;i5 < sortedDates.length; i5++) {
      let prevDate = new Date(sortedDates[i5 - 1]), currDate = new Date(sortedDates[i5]);
      if (Math.round((currDate.getTime() - prevDate.getTime()) / 86400000) === 1)
        tempStreak++;
      else {
        if (tempStreak > longestStreak)
          longestStreak = tempStreak, longestStreakStart = tempStart, longestStreakEnd = sortedDates[i5 - 1];
        tempStreak = 1, tempStart = sortedDates[i5];
      }
    }
    if (tempStreak > longestStreak)
      longestStreak = tempStreak, longestStreakStart = tempStart, longestStreakEnd = sortedDates.at(-1);
  }
  return {
    currentStreak,
    longestStreak,
    currentStreakStart,
    longestStreakStart,
    longestStreakEnd
  };
}
async function readSessionStartDate(filePath) {
  try {
    let fd2 = await open15(filePath, "r");
    try {
      let buf = Buffer.allocUnsafe(4096), { bytesRead } = await fd2.read(buf, 0, buf.length, 0);
      if (bytesRead === 0)
        return null;
      let head = buf.toString("utf8", 0, bytesRead), lastNewline = head.lastIndexOf(`
`);
      if (lastNewline < 0)
        return null;
      for (let line of head.slice(0, lastNewline).split(`
`)) {
        if (!line)
          continue;
        let entry;
        try {
          entry = jsonParse(line);
        } catch {
          continue;
        }
        if (typeof entry.type !== "string")
          continue;
        if (!TRANSCRIPT_MESSAGE_TYPES.has(entry.type))
          continue;
        if (entry.isSidechain === !0)
          continue;
        if (typeof entry.timestamp !== "string")
          return null;
        let date6 = new Date(entry.timestamp);
        if (Number.isNaN(date6.getTime()))
          return null;
        return toDateString(date6);
      }
      return null;
    } finally {
      await fd2.close();
    }
  } catch {
    return null;
  }
}
function getEmptyStats() {
  return {
    totalSessions: 0,
    totalMessages: 0,
    totalDays: 0,
    activeDays: 0,
    streaks: {
      currentStreak: 0,
      longestStreak: 0,
      currentStreakStart: null,
      longestStreakStart: null,
      longestStreakEnd: null
    },
    dailyActivity: [],
    dailyModelTokens: [],
    longestSession: null,
    modelUsage: {},
    firstSessionDate: null,
    lastSessionDate: null,
    peakActivityDay: null,
    peakActivityHour: null,
    totalSpeculationTimeSavedMs: 0
  };
}
var TRANSCRIPT_MESSAGE_TYPES;
var init_stats = __esm(() => {
  init_debug();
  init_errors();
  init_fsOperations();
  init_json();
  init_messages3();
  init_sessionStorage();
  init_shellToolUtils();
  init_slowOperations();
  init_statsCache();
  TRANSCRIPT_MESSAGE_TYPES = /* @__PURE__ */ new Set([
    "user",
    "assistant",
    "attachment",
    "system",
    "progress"
  ]);
});
