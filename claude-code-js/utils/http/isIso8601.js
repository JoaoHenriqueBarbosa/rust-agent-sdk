// function: isIso8601
function isIso8601(dateString) {
  if (typeof dateString !== "string")
    return !1;
  let date5 = new Date(dateString);
  return !isNaN(date5.getTime()) && date5.toISOString() === dateString;
}
