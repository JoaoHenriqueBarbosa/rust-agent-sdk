// function: findKey
function findKey(obj, key) {
  if (isBuffer2(obj))
    return null;
  key = key.toLowerCase();
  let keys2 = Object.keys(obj), i2 = keys2.length, _key;
  while (i2-- > 0)
    if (_key = keys2[i2], key === _key.toLowerCase())
      return _key;
  return null;
}
