// function: generateResponseTimeHistogram
function generateResponseTimeHistogram(times) {
  if (times.length === 0)
    return '<p class="empty">No response time data</p>';
  let buckets = {
    "2-10s": 0,
    "10-30s": 0,
    "30s-1m": 0,
    "1-2m": 0,
    "2-5m": 0,
    "5-15m": 0,
    ">15m": 0
  };
  for (let t2 of times)
    if (t2 < 10)
      buckets["2-10s"] = (buckets["2-10s"] ?? 0) + 1;
    else if (t2 < 30)
      buckets["10-30s"] = (buckets["10-30s"] ?? 0) + 1;
    else if (t2 < 60)
      buckets["30s-1m"] = (buckets["30s-1m"] ?? 0) + 1;
    else if (t2 < 120)
      buckets["1-2m"] = (buckets["1-2m"] ?? 0) + 1;
    else if (t2 < 300)
      buckets["2-5m"] = (buckets["2-5m"] ?? 0) + 1;
    else if (t2 < 900)
      buckets["5-15m"] = (buckets["5-15m"] ?? 0) + 1;
    else
      buckets[">15m"] = (buckets[">15m"] ?? 0) + 1;
  let maxVal = Math.max(...Object.values(buckets));
  if (maxVal === 0)
    return '<p class="empty">No response time data</p>';
  return Object.entries(buckets).map(([label, count4]) => {
    let pct = count4 / maxVal * 100;
    return `<div class="bar-row">
        <div class="bar-label">${label}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:#6366f1"></div></div>
        <div class="bar-value">${count4}</div>
      </div>`;
  }).join(`
`);
}
