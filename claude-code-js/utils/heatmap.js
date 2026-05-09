// Original: src/utils/heatmap.ts
function calculatePercentiles(dailyActivity) {
  let counts = dailyActivity.map((a2) => a2.messageCount).filter((c3) => c3 > 0).sort((a2, b) => a2 - b);
  if (counts.length === 0)
    return null;
  return {
    p25: counts[Math.floor(counts.length * 0.25)],
    p50: counts[Math.floor(counts.length * 0.5)],
    p75: counts[Math.floor(counts.length * 0.75)]
  };
}
function generateHeatmap(dailyActivity, options2 = {}) {
  let { terminalWidth = 80, showMonthLabels = !0 } = options2, dayLabelWidth = 4, availableWidth = terminalWidth - 4, width = Math.min(52, Math.max(10, availableWidth)), activityMap = /* @__PURE__ */ new Map;
  for (let activity of dailyActivity)
    activityMap.set(activity.date, activity);
  let percentiles = calculatePercentiles(dailyActivity), today = /* @__PURE__ */ new Date;
  today.setHours(0, 0, 0, 0);
  let currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  let startDate = new Date(currentWeekStart);
  startDate.setDate(startDate.getDate() - (width - 1) * 7);
  let grid = Array.from({ length: 7 }, () => Array(width).fill("")), monthStarts = [], lastMonth = -1, currentDate = new Date(startDate);
  for (let week = 0;week < width; week++)
    for (let day = 0;day < 7; day++) {
      if (currentDate > today) {
        grid[day][week] = " ", currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      let dateStr = toDateString(currentDate), activity = activityMap.get(dateStr);
      if (day === 0) {
        let month = currentDate.getMonth();
        if (month !== lastMonth)
          monthStarts.push({ month, week }), lastMonth = month;
      }
      let intensity = getIntensity(activity?.messageCount || 0, percentiles);
      grid[day][week] = getHeatmapChar(intensity), currentDate.setDate(currentDate.getDate() + 1);
    }
  let lines2 = [];
  if (showMonthLabels) {
    let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ], uniqueMonths = monthStarts.map((m4) => m4.month), labelWidth = Math.floor(width / Math.max(uniqueMonths.length, 1)), monthLabels = uniqueMonths.map((month) => monthNames[month].padEnd(labelWidth)).join("");
    lines2.push("    " + monthLabels);
  }
  let dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let day = 0;day < 7; day++) {
    let row = ([1, 3, 5].includes(day) ? dayLabels[day].padEnd(3) : "   ") + " " + grid[day].join("");
    lines2.push(row);
  }
  return lines2.push(""), lines2.push("    Less " + [
    claudeOrange("\u2591"),
    claudeOrange("\u2592"),
    claudeOrange("\u2593"),
    claudeOrange("\u2588")
  ].join(" ") + " More"), lines2.join(`
`);
}
function getIntensity(messageCount, percentiles) {
  if (messageCount === 0 || !percentiles)
    return 0;
  if (messageCount >= percentiles.p75)
    return 4;
  if (messageCount >= percentiles.p50)
    return 3;
  if (messageCount >= percentiles.p25)
    return 2;
  return 1;
}
function getHeatmapChar(intensity) {
  switch (intensity) {
    case 0:
      return source_default.gray("\xB7");
    case 1:
      return claudeOrange("\u2591");
    case 2:
      return claudeOrange("\u2592");
    case 3:
      return claudeOrange("\u2593");
    case 4:
      return claudeOrange("\u2588");
    default:
      return source_default.gray("\xB7");
  }
}
var claudeOrange;
var init_heatmap = __esm(() => {
  init_source();
  init_statsCache();
  claudeOrange = source_default.hex("#da7756");
});
