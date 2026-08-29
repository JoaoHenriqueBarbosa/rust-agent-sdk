// Original: src/utils/queryProfiler.ts
function startQueryProfile() {
  if (!ENABLED)
    return;
  getPerformance().clearMarks(), memorySnapshots2.clear(), firstTokenTime = null, queryCount++, queryCheckpoint("query_user_input_received");
}
function queryCheckpoint(name3) {
  if (!ENABLED)
    return;
  let perf = getPerformance();
  if (perf.mark(name3), memorySnapshots2.set(name3, process.memoryUsage()), name3 === "query_first_chunk_received" && firstTokenTime === null) {
    let marks = perf.getEntriesByType("mark");
    if (marks.length > 0)
      firstTokenTime = marks[marks.length - 1]?.startTime ?? 0;
  }
}
function endQueryProfile() {
  if (!ENABLED)
    return;
  queryCheckpoint("query_profile_end");
}
function getSlowWarning(deltaMs, name3) {
  if (name3 === "query_user_input_received")
    return "";
  if (deltaMs > 1000)
    return " \u26A0\uFE0F  VERY SLOW";
  if (deltaMs > 100)
    return " \u26A0\uFE0F  SLOW";
  if (name3.includes("git_status") && deltaMs > 50)
    return " \u26A0\uFE0F  git status";
  if (name3.includes("tool_schema") && deltaMs > 50)
    return " \u26A0\uFE0F  tool schemas";
  if (name3.includes("client_creation") && deltaMs > 50)
    return " \u26A0\uFE0F  client creation";
  return "";
}
function getQueryProfileReport() {
  if (!ENABLED)
    return "Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)";
  let marks = getPerformance().getEntriesByType("mark");
  if (marks.length === 0)
    return "No query profiling checkpoints recorded";
  let lines2 = [];
  lines2.push("=".repeat(80)), lines2.push(`QUERY PROFILING REPORT - Query #${queryCount}`), lines2.push("=".repeat(80)), lines2.push("");
  let baselineTime = marks[0]?.startTime ?? 0, prevTime = baselineTime, apiRequestSentTime = 0, firstChunkTime = 0;
  for (let mark of marks) {
    let relativeTime = mark.startTime - baselineTime, deltaMs = mark.startTime - prevTime;
    if (lines2.push(formatTimelineLine(relativeTime, deltaMs, mark.name, memorySnapshots2.get(mark.name), 10, 9, getSlowWarning(deltaMs, mark.name))), mark.name === "query_api_request_sent")
      apiRequestSentTime = relativeTime;
    if (mark.name === "query_first_chunk_received")
      firstChunkTime = relativeTime;
    prevTime = mark.startTime;
  }
  let lastMark = marks[marks.length - 1], totalTime = lastMark ? lastMark.startTime - baselineTime : 0;
  if (lines2.push(""), lines2.push("-".repeat(80)), firstChunkTime > 0) {
    let preRequestOverhead = apiRequestSentTime, networkLatency = firstChunkTime - apiRequestSentTime, preRequestPercent = (preRequestOverhead / firstChunkTime * 100).toFixed(1), networkPercent = (networkLatency / firstChunkTime * 100).toFixed(1);
    lines2.push(`Total TTFT: ${formatMs(firstChunkTime)}ms`), lines2.push(`  - Pre-request overhead: ${formatMs(preRequestOverhead)}ms (${preRequestPercent}%)`), lines2.push(`  - Network latency: ${formatMs(networkLatency)}ms (${networkPercent}%)`);
  } else
    lines2.push(`Total time: ${formatMs(totalTime)}ms`);
  return lines2.push(getPhaseSummary(marks, baselineTime)), lines2.push("=".repeat(80)), lines2.join(`
`);
}
function getPhaseSummary(marks, baselineTime) {
  let phases = [
    {
      name: "Context loading",
      start: "query_context_loading_start",
      end: "query_context_loading_end"
    },
    {
      name: "Microcompact",
      start: "query_microcompact_start",
      end: "query_microcompact_end"
    },
    {
      name: "Autocompact",
      start: "query_autocompact_start",
      end: "query_autocompact_end"
    },
    { name: "Query setup", start: "query_setup_start", end: "query_setup_end" },
    {
      name: "Tool schemas",
      start: "query_tool_schema_build_start",
      end: "query_tool_schema_build_end"
    },
    {
      name: "Message normalization",
      start: "query_message_normalization_start",
      end: "query_message_normalization_end"
    },
    {
      name: "Client creation",
      start: "query_client_creation_start",
      end: "query_client_creation_end"
    },
    {
      name: "Network TTFB",
      start: "query_api_request_sent",
      end: "query_first_chunk_received"
    },
    {
      name: "Tool execution",
      start: "query_tool_execution_start",
      end: "query_tool_execution_end"
    }
  ], markMap = new Map(marks.map((m4) => [m4.name, m4.startTime - baselineTime])), lines2 = [];
  lines2.push(""), lines2.push("PHASE BREAKDOWN:");
  for (let phase of phases) {
    let startTime = markMap.get(phase.start), endTime = markMap.get(phase.end);
    if (startTime !== void 0 && endTime !== void 0) {
      let duration3 = endTime - startTime, bar = "\u2588".repeat(Math.min(Math.ceil(duration3 / 10), 50));
      lines2.push(`  ${phase.name.padEnd(22)} ${formatMs(duration3).padStart(10)}ms ${bar}`);
    }
  }
  let apiRequestSent = markMap.get("query_api_request_sent");
  if (apiRequestSent !== void 0)
    lines2.push(""), lines2.push(`  ${"Total pre-API overhead".padEnd(22)} ${formatMs(apiRequestSent).padStart(10)}ms`);
  return lines2.join(`
`);
}
function logQueryProfileReport() {
  if (!ENABLED)
    return;
  logForDebugging(getQueryProfileReport());
}
var ENABLED, memorySnapshots2, queryCount = 0, firstTokenTime = null;
var init_queryProfiler = __esm(() => {
  init_debug();
  init_envUtils();
  init_profilerBase();
  ENABLED = isEnvTruthy(process.env.CLAUDE_CODE_PROFILE_QUERY), memorySnapshots2 = /* @__PURE__ */ new Map;
});
