// function: generateUsageReport
async function generateUsageReport(options2) {
  let remoteStats, allScannedSessions = await scanAllSessions(), totalSessionsScanned = allScannedSessions.length, META_BATCH_SIZE = 50, MAX_SESSIONS_TO_LOAD = 200, allMetas = [], uncachedSessions = [];
  for (let i5 = 0;i5 < allScannedSessions.length; i5 += 50) {
    let batch = allScannedSessions.slice(i5, i5 + 50), results = await Promise.all(batch.map(async (sessionInfo) => ({
      sessionInfo,
      cached: await loadCachedSessionMeta(sessionInfo.sessionId)
    })));
    for (let { sessionInfo, cached: cached3 } of results)
      if (cached3)
        allMetas.push(cached3);
      else if (uncachedSessions.length < 200)
        uncachedSessions.push(sessionInfo);
  }
  let logsForFacets = /* @__PURE__ */ new Map, isMetaSession = (log3) => {
    for (let msg of log3.messages.slice(0, 5))
      if (msg.type === "user" && msg.message) {
        let content = msg.message.content;
        if (typeof content === "string") {
          if (content.includes("RESPOND WITH ONLY A VALID JSON OBJECT") || content.includes("record_facets"))
            return !0;
        }
      }
    return !1;
  }, LOAD_BATCH_SIZE = 10;
  for (let i5 = 0;i5 < uncachedSessions.length; i5 += LOAD_BATCH_SIZE) {
    let batch = uncachedSessions.slice(i5, i5 + LOAD_BATCH_SIZE), batchResults = await Promise.all(batch.map(async (sessionInfo) => {
      try {
        return await loadAllLogsFromSessionFile(sessionInfo.path);
      } catch {
        return [];
      }
    })), metasToSave = [];
    for (let logs2 of batchResults)
      for (let log3 of logs2) {
        if (isMetaSession(log3) || !hasValidDates(log3))
          continue;
        let meta = logToSessionMeta(log3);
        allMetas.push(meta), metasToSave.push(meta), logsForFacets.set(meta.session_id, log3);
      }
    await Promise.all(metasToSave.map((meta) => saveSessionMeta(meta)));
  }
  let bestBySession = /* @__PURE__ */ new Map;
  for (let meta of allMetas) {
    let existing = bestBySession.get(meta.session_id);
    if (!existing || meta.user_message_count > existing.user_message_count || meta.user_message_count === existing.user_message_count && meta.duration_minutes > existing.duration_minutes)
      bestBySession.set(meta.session_id, meta);
  }
  let keptSessionIds = new Set(bestBySession.keys());
  allMetas = [...bestBySession.values()];
  for (let sessionId of logsForFacets.keys())
    if (!keptSessionIds.has(sessionId))
      logsForFacets.delete(sessionId);
  allMetas.sort((a2, b) => b.start_time.localeCompare(a2.start_time));
  let isSubstantiveSession = (meta) => {
    if (meta.user_message_count < 2)
      return !1;
    if (meta.duration_minutes < 1)
      return !1;
    return !0;
  }, substantiveMetas = allMetas.filter(isSubstantiveSession), facets = /* @__PURE__ */ new Map, toExtract = [], MAX_FACET_EXTRACTIONS = 50, cachedFacetResults = await Promise.all(substantiveMetas.map(async (meta) => ({
    sessionId: meta.session_id,
    cached: await loadCachedFacets(meta.session_id)
  })));
  for (let { sessionId, cached: cached3 } of cachedFacetResults)
    if (cached3)
      facets.set(sessionId, cached3);
    else {
      let log3 = logsForFacets.get(sessionId);
      if (log3 && toExtract.length < MAX_FACET_EXTRACTIONS)
        toExtract.push({ log: log3, sessionId });
    }
  let CONCURRENCY = 50;
  for (let i5 = 0;i5 < toExtract.length; i5 += CONCURRENCY) {
    let batch = toExtract.slice(i5, i5 + CONCURRENCY), results = await Promise.all(batch.map(async ({ log: log3, sessionId }) => {
      let newFacets = await extractFacetsFromAPI(log3, sessionId);
      return { sessionId, newFacets };
    })), facetsToSave = [];
    for (let { sessionId, newFacets } of results)
      if (newFacets)
        facets.set(sessionId, newFacets), facetsToSave.push(newFacets);
    await Promise.all(facetsToSave.map((f) => saveFacets(f)));
  }
  let isMinimalSession = (sessionId) => {
    let sessionFacets = facets.get(sessionId);
    if (!sessionFacets)
      return !1;
    let cats = sessionFacets.goal_categories, catKeys = safeKeys(cats).filter((k3) => (cats[k3] ?? 0) > 0);
    return catKeys.length === 1 && catKeys[0] === "warmup_minimal";
  }, substantiveSessions = substantiveMetas.filter((s2) => !isMinimalSession(s2.session_id)), substantiveFacets = /* @__PURE__ */ new Map;
  for (let [sessionId, f] of facets)
    if (!isMinimalSession(sessionId))
      substantiveFacets.set(sessionId, f);
  let aggregated = aggregateData(substantiveSessions, substantiveFacets);
  aggregated.total_sessions_scanned = totalSessionsScanned;
  let insights = await generateParallelInsights(aggregated, facets), htmlReport = generateHtmlReport(aggregated, insights);
  try {
    await mkdir36(getDataDir(), { recursive: !0 });
  } catch {}
  let htmlPath = join133(getDataDir(), "report.html");
  return await writeFile42(htmlPath, htmlReport, {
    encoding: "utf-8",
    mode: 384
  }), {
    insights,
    htmlPath,
    data: aggregated,
    remoteStats,
    facets: substantiveFacets
  };
}
