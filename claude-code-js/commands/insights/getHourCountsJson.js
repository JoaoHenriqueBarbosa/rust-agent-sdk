// function: getHourCountsJson
function getHourCountsJson(messageHours) {
  let hourCounts = {};
  for (let h4 of messageHours)
    hourCounts[h4] = (hourCounts[h4] || 0) + 1;
  return jsonStringify(hourCounts);
}
