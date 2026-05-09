// function: isFlatArray
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
