// function: hasValidDates
function hasValidDates(log3) {
  return !Number.isNaN(log3.created.getTime()) && !Number.isNaN(log3.modified.getTime());
}
