// function: arrayToObject
function arrayToObject(arr) {
  let obj = {}, keys2 = Object.keys(arr), i2, len = keys2.length, key;
  for (i2 = 0;i2 < len; i2++)
    key = keys2[i2], obj[key] = arr[key];
  return obj;
}
