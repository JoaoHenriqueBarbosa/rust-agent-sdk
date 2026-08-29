// function: getNextDateRange
function getNextDateRange(current) {
  let currentIndex = DATE_RANGE_ORDER.indexOf(current);
  return DATE_RANGE_ORDER[(currentIndex + 1) % DATE_RANGE_ORDER.length];
}
