// function: generateTimeOfDayChart
function generateTimeOfDayChart(messageHours) {
  if (messageHours.length === 0)
    return '<p class="empty">No time data</p>';
  let periods = [
    { label: "Morning (6-12)", range: [6, 7, 8, 9, 10, 11] },
    { label: "Afternoon (12-18)", range: [12, 13, 14, 15, 16, 17] },
    { label: "Evening (18-24)", range: [18, 19, 20, 21, 22, 23] },
    { label: "Night (0-6)", range: [0, 1, 2, 3, 4, 5] }
  ], hourCounts = {};
  for (let h4 of messageHours)
    hourCounts[h4] = (hourCounts[h4] || 0) + 1;
  let periodCounts = periods.map((p4) => ({
    label: p4.label,
    count: p4.range.reduce((sum, h4) => sum + (hourCounts[h4] || 0), 0)
  })), maxVal = Math.max(...periodCounts.map((p4) => p4.count)) || 1;
  return `<div id="hour-histogram">${periodCounts.map((p4) => `
      <div class="bar-row">
        <div class="bar-label">${p4.label}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${p4.count / maxVal * 100}%;background:#8b5cf6"></div></div>
        <div class="bar-value">${p4.count}</div>
      </div>`).join(`
`)}</div>`;
}
