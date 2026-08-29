// function: isWholeNumber
function isWholeNumber(v2) {
  let frac = v2 - Math.floor(v2);
  return frac < 0.0001 || frac > 0.9999;
}
