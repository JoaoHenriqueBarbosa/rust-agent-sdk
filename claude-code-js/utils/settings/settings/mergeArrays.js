// function: mergeArrays
function mergeArrays(targetArray, sourceArray) {
  return uniq([...targetArray, ...sourceArray]);
}
