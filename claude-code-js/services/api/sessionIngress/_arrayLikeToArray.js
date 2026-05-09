// function: _arrayLikeToArray
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i5 = 0, arr2 = Array(len);i5 < len; i5++)
    arr2[i5] = arr[i5];
  return arr2;
}
