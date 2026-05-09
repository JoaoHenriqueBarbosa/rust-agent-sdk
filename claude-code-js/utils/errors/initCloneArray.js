// function: initCloneArray
function initCloneArray(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty12.call(array, "index"))
    result.index = array.index, result.input = array.input;
  return result;
}
