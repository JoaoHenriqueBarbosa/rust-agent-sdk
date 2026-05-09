// function: renderStatsToAnsi
function renderStatsToAnsi(stats, activeTab) {
  let lines2 = [];
  if (activeTab === "Overview")
    lines2.push(...renderOverviewToAnsi(stats));
  else
    lines2.push(...renderModelsToAnsi(stats));
  while (lines2.length > 0 && stripAnsi(lines2[lines2.length - 1]).trim() === "")
    lines2.pop();
  if (lines2.length > 0) {
    let lastLine2 = lines2[lines2.length - 1], lastLineLen = stringWidth(lastLine2), contentWidth = activeTab === "Overview" ? 70 : 80, statsLabel = "/stats", padding = Math.max(2, contentWidth - lastLineLen - 6);
    lines2[lines2.length - 1] = lastLine2 + " ".repeat(padding) + source_default.gray("/stats");
  }
  return lines2.join(`
`);
}
