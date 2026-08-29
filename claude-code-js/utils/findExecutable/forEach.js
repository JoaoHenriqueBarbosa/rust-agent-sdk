// function: forEach
function forEach(obj, fn, { allOwnKeys = !1 } = {}) {
  if (obj === null || typeof obj > "u")
    return;
  let i2, l;
  if (typeof obj !== "object")
    obj = [obj];
  if (isArray3(obj))
    for (i2 = 0, l = obj.length;i2 < l; i2++)
      fn.call(null, obj[i2], i2, obj);
  else {
    if (isBuffer2(obj))
      return;
    let keys2 = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj), len = keys2.length, key;
    for (i2 = 0;i2 < len; i2++)
      key = keys2[i2], fn.call(null, obj[key], key, obj);
  }
}
