// function: merge2
function merge2() {
  let { caseless, skipUndefined } = isContextDefined(this) && this || {}, result = {}, assignValue2 = (val, key) => {
    if (key === "__proto__" || key === "constructor" || key === "prototype")
      return;
    let targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject4(result[targetKey]) && isPlainObject4(val))
      result[targetKey] = merge2(result[targetKey], val);
    else if (isPlainObject4(val))
      result[targetKey] = merge2({}, val);
    else if (isArray3(val))
      result[targetKey] = val.slice();
    else if (!skipUndefined || !isUndefined(val))
      result[targetKey] = val;
  };
  for (let i2 = 0, l = arguments.length;i2 < l; i2++)
    arguments[i2] && forEach(arguments[i2], assignValue2);
  return result;
}
