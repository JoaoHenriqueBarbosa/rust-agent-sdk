// function: mergeCapabilities
function mergeCapabilities(base2, additional) {
  let result = { ...base2 };
  for (let key2 in additional) {
    let k3 = key2, addValue = additional[k3];
    if (addValue === void 0)
      continue;
    let baseValue = result[k3];
    if (isPlainObject6(baseValue) && isPlainObject6(addValue))
      result[k3] = { ...baseValue, ...addValue };
    else
      result[k3] = addValue;
  }
  return result;
}
