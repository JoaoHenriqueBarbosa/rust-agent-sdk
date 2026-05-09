// function: wasClockTurnedBack
function wasClockTurnedBack(cachedAt) {
  return Number(cachedAt) > nowSeconds();
}
