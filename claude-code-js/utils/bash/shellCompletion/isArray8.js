// function: isArray8
function isArray8(value) {
  return !Array.isArray ? getTag2(value) === "[object Array]" : Array.isArray(value);
}
