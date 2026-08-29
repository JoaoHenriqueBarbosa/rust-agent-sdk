// function: getReport
function getReport() {
  if (!DETAILED_PROFILING)
    return "Startup profiling not enabled";
  let marks = getPerformance().getEntriesByType("mark");
  if (marks.length === 0)
    return "No profiling checkpoints recorded";
  let lines = [];
  lines.push("=".repeat(80)), lines.push("STARTUP PROFILING REPORT"), lines.push("=".repeat(80)), lines.push("");
  let prevTime = 0;
  for (let [i, mark] of marks.entries())
    lines.push(formatTimelineLine(mark.startTime, mark.startTime - prevTime, mark.name, memorySnapshots[i], 8, 7)), prevTime = mark.startTime;
  let lastMark = marks[marks.length - 1];
  return lines.push(""), lines.push(`Total startup time: ${formatMs(lastMark?.startTime ?? 0)}ms`), lines.push("=".repeat(80)), lines.join(`
`);
}
