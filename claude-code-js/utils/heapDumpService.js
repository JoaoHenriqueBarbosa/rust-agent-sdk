// Original: src/utils/heapDumpService.ts
import { createWriteStream as createWriteStream3, writeFileSync as writeFileSync8 } from "fs";
import { readdir as readdir23, readFile as readFile46, writeFile as writeFile38 } from "fs/promises";
import { join as join123 } from "path";
import { pipeline as pipeline3 } from "stream/promises";
import {
  getHeapSnapshot,
  getHeapSpaceStatistics,
  getHeapStatistics
} from "v8";
async function captureMemoryDiagnostics(trigger, dumpNumber = 0) {
  let usage = process.memoryUsage(), heapStats = getHeapStatistics(), resourceUsage = process.resourceUsage(), uptimeSeconds = process.uptime(), heapSpaceStats;
  try {
    heapSpaceStats = getHeapSpaceStatistics();
  } catch {}
  let activeHandles = process._getActiveHandles().length, activeRequests = process._getActiveRequests().length, openFileDescriptors;
  try {
    openFileDescriptors = (await readdir23("/proc/self/fd")).length;
  } catch {}
  let smapsRollup;
  try {
    smapsRollup = await readFile46("/proc/self/smaps_rollup", "utf8");
  } catch {}
  let nativeMemory = usage.rss - usage.heapUsed, bytesPerSecond = uptimeSeconds > 0 ? usage.rss / uptimeSeconds : 0, mbPerHour = bytesPerSecond * 3600 / 1048576, potentialLeaks = [];
  if (heapStats.number_of_detached_contexts > 0)
    potentialLeaks.push(`${heapStats.number_of_detached_contexts} detached context(s) - possible iframe/context leak`);
  if (activeHandles > 100)
    potentialLeaks.push(`${activeHandles} active handles - possible timer/socket leak`);
  if (nativeMemory > usage.heapUsed)
    potentialLeaks.push("Native memory > heap - leak may be in native addons (node-pty, sharp, etc.)");
  if (mbPerHour > 100)
    potentialLeaks.push(`High memory growth rate: ${mbPerHour.toFixed(1)} MB/hour`);
  if (openFileDescriptors && openFileDescriptors > 500)
    potentialLeaks.push(`${openFileDescriptors} open file descriptors - possible file/socket leak`);
  return {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    sessionId: getSessionId(),
    trigger,
    dumpNumber,
    uptimeSeconds,
    memoryUsage: {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers,
      rss: usage.rss
    },
    memoryGrowthRate: {
      bytesPerSecond,
      mbPerHour
    },
    v8HeapStats: {
      heapSizeLimit: heapStats.heap_size_limit,
      mallocedMemory: heapStats.malloced_memory,
      peakMallocedMemory: heapStats.peak_malloced_memory,
      detachedContexts: heapStats.number_of_detached_contexts,
      nativeContexts: heapStats.number_of_native_contexts
    },
    v8HeapSpaces: heapSpaceStats?.map((space) => ({
      name: space.space_name,
      size: space.space_size,
      used: space.space_used_size,
      available: space.space_available_size
    })),
    resourceUsage: {
      maxRSS: resourceUsage.maxRSS * 1024,
      userCPUTime: resourceUsage.userCPUTime,
      systemCPUTime: resourceUsage.systemCPUTime
    },
    activeHandles,
    activeRequests,
    openFileDescriptors,
    analysis: {
      potentialLeaks,
      recommendation: potentialLeaks.length > 0 ? `WARNING: ${potentialLeaks.length} potential leak indicator(s) found. See potentialLeaks array.` : "No obvious leak indicators. Check heap snapshot for retained objects."
    },
    smapsRollup,
    platform: process.platform,
    nodeVersion: process.version,
    ccVersion: "2.1.90"
  };
}
async function performHeapDump(trigger = "manual", dumpNumber = 0) {
  try {
    let sessionId = getSessionId(), diagnostics = await captureMemoryDiagnostics(trigger, dumpNumber), toGB = (bytes) => (bytes / 1024 / 1024 / 1024).toFixed(3);
    logForDebugging(`[HeapDump] Memory state:
  heapUsed: ${toGB(diagnostics.memoryUsage.heapUsed)} GB (in snapshot)
  external: ${toGB(diagnostics.memoryUsage.external)} GB (NOT in snapshot)
  rss: ${toGB(diagnostics.memoryUsage.rss)} GB (total process)
  ${diagnostics.analysis.recommendation}`);
    let dumpDir = getDesktopPath();
    await getFsImplementation().mkdir(dumpDir);
    let suffix = dumpNumber > 0 ? `-dump${dumpNumber}` : "", heapFilename = `${sessionId}${suffix}.heapsnapshot`, diagFilename = `${sessionId}${suffix}-diagnostics.json`, heapPath = join123(dumpDir, heapFilename), diagPath = join123(dumpDir, diagFilename);
    return await writeFile38(diagPath, jsonStringify(diagnostics, null, 2), {
      mode: 384
    }), logForDebugging(`[HeapDump] Diagnostics written to ${diagPath}`), await writeHeapSnapshot(heapPath), logForDebugging(`[HeapDump] Heap dump written to ${heapPath}`), logEvent("tengu_heap_dump", {
      triggerManual: trigger === "manual",
      triggerAuto15GB: trigger === "auto-1.5GB",
      dumpNumber,
      success: !0
    }), { success: !0, heapPath, diagPath };
  } catch (err2) {
    let error44 = toError(err2);
    return logError2(error44), logEvent("tengu_heap_dump", {
      triggerManual: trigger === "manual",
      triggerAuto15GB: trigger === "auto-1.5GB",
      dumpNumber,
      success: !1
    }), { success: !1, error: error44.message };
  }
}
async function writeHeapSnapshot(filepath) {
  if (typeof Bun < "u") {
    writeFileSync8(filepath, Bun.generateHeapSnapshot("v8", "arraybuffer"), {
      mode: 384
    }), Bun.gc(!0);
    return;
  }
  let writeStream = createWriteStream3(filepath, { mode: 384 }), heapSnapshotStream = getHeapSnapshot();
  await pipeline3(heapSnapshotStream, writeStream);
}
var init_heapDumpService = __esm(() => {
  init_state();
  init_debug();
  init_errors();
  init_file();
  init_fsOperations();
  init_log3();
  init_slowOperations();
});
