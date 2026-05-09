// Original: src/utils/collapseHookSummaries.ts
function isLabeledHookSummary(msg) {
  return msg.type === "system" && msg.subtype === "stop_hook_summary" && msg.hookLabel !== void 0;
}
function collapseHookSummaries(messages) {
  let result = [], i5 = 0;
  while (i5 < messages.length) {
    let msg = messages[i5];
    if (isLabeledHookSummary(msg)) {
      let label = msg.hookLabel, group = [];
      while (i5 < messages.length) {
        let next2 = messages[i5];
        if (!isLabeledHookSummary(next2) || next2.hookLabel !== label)
          break;
        group.push(next2), i5++;
      }
      if (group.length === 1)
        result.push(msg);
      else
        result.push({
          ...msg,
          hookCount: group.reduce((sum, m4) => sum + m4.hookCount, 0),
          hookInfos: group.flatMap((m4) => m4.hookInfos),
          hookErrors: group.flatMap((m4) => m4.hookErrors),
          preventedContinuation: group.some((m4) => m4.preventedContinuation),
          hasOutput: group.some((m4) => m4.hasOutput),
          totalDurationMs: Math.max(...group.map((m4) => m4.totalDurationMs ?? 0))
        });
    } else
      result.push(msg), i5++;
  }
  return result;
}
