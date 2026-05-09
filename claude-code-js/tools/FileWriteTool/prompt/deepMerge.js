// function: deepMerge
function deepMerge(...objects) {
  let output = {};
  for (let obj of objects)
    for (let [key, value] of Object.entries(obj)) {
      let prevValue = output[key];
      output[key] = isPlainObject5(prevValue) && isPlainObject5(value) ? deepMerge(prevValue, value) : value;
    }
  return output;
}
