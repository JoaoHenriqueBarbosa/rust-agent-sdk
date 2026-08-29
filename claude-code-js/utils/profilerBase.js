// Original: src/utils/profilerBase.ts
function getPerformance() {
  if (!performance2)
    performance2 = __require("perf_hooks").performance;
  return performance2;
}
function formatMs(ms) {
  return ms.toFixed(3);
}
function formatTimelineLine(totalMs, deltaMs, name, memory, totalPad, deltaPad, extra = "") {
  let memInfo = memory ? ` | RSS: ${formatFileSize(memory.rss)}, Heap: ${formatFileSize(memory.heapUsed)}` : "";
  return `[+${formatMs(totalMs).padStart(totalPad)}ms] (+${formatMs(deltaMs).padStart(deltaPad)}ms) ${name}${extra}${memInfo}`;
}
var performance2 = null;
var init_profilerBase = __esm(() => {
  init_format();
});
