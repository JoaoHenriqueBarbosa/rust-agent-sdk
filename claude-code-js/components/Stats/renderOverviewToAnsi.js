// function: renderOverviewToAnsi
function renderOverviewToAnsi(stats) {
  let lines2 = [], theme2 = getTheme(resolveThemeSetting(getGlobalConfig().theme)), h4 = (text2) => applyColor(text2, theme2.claude), COL1_LABEL_WIDTH = 18, COL2_START = 40, COL2_LABEL_WIDTH = 18, row = (l1, v12, l22, v2) => {
    let label1 = (l1 + ":").padEnd(18), col1PlainLen = label1.length + v12.length, spaceBetween = Math.max(2, 40 - col1PlainLen), label2 = (l22 + ":").padEnd(18);
    return label1 + h4(v12) + " ".repeat(spaceBetween) + label2 + h4(v2);
  };
  if (stats.dailyActivity.length > 0)
    lines2.push(generateHeatmap(stats.dailyActivity, {
      terminalWidth: 56
    })), lines2.push("");
  let modelEntries = Object.entries(stats.modelUsage).sort(([, a2], [, b]) => b.inputTokens + b.outputTokens - (a2.inputTokens + a2.outputTokens)), favoriteModel = modelEntries[0], totalTokens = modelEntries.reduce((sum, [, usage]) => sum + usage.inputTokens + usage.outputTokens, 0);
  if (favoriteModel)
    lines2.push(row("Favorite model", renderModelName(favoriteModel[0]), "Total tokens", formatNumber(totalTokens)));
  lines2.push(""), lines2.push(row("Sessions", formatNumber(stats.totalSessions), "Longest session", stats.longestSession ? formatDuration(stats.longestSession.duration) : "N/A"));
  let currentStreakVal = `${stats.streaks.currentStreak} ${stats.streaks.currentStreak === 1 ? "day" : "days"}`, longestStreakVal = `${stats.streaks.longestStreak} ${stats.streaks.longestStreak === 1 ? "day" : "days"}`;
  lines2.push(row("Current streak", currentStreakVal, "Longest streak", longestStreakVal));
  let activeDaysVal = `${stats.activeDays}/${stats.totalDays}`, peakHourVal = stats.peakActivityHour !== null ? `${stats.peakActivityHour}:00-${stats.peakActivityHour + 1}:00` : "N/A";
  lines2.push(row("Active days", activeDaysVal, "Peak hour", peakHourVal)), lines2.push("");
  let factoid = generateFunFactoid(stats, totalTokens);
  return lines2.push(h4(factoid)), lines2.push(source_default.gray(`Stats from the last ${stats.totalDays} days`)), lines2;
}
