// function: generateBarChart
function generateBarChart(data, color3, maxItems = 6, fixedOrder) {
  let entries2;
  if (fixedOrder)
    entries2 = fixedOrder.filter((key3) => (key3 in data) && (data[key3] ?? 0) > 0).map((key3) => [key3, data[key3] ?? 0]);
  else
    entries2 = Object.entries(data).sort((a2, b) => b[1] - a2[1]).slice(0, maxItems);
  if (entries2.length === 0)
    return '<p class="empty">No data</p>';
  let maxVal = Math.max(...entries2.map((e) => e[1]));
  return entries2.map(([label, count4]) => {
    let pct = count4 / maxVal * 100, cleanLabel = LABEL_MAP[label] || label.replace(/_/g, " ").replace(/\b\w/g, (c3) => c3.toUpperCase());
    return `<div class="bar-row">
        <div class="bar-label">${escapeXmlAttr(cleanLabel)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color3}"></div></div>
        <div class="bar-value">${count4}</div>
      </div>`;
  }).join(`
`);
}
