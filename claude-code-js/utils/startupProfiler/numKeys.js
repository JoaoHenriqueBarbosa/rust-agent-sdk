// function: numKeys
function numKeys(data) {
  let keyCount = 0;
  for (let key in data)
    if (Object.prototype.hasOwnProperty.call(data, key))
      keyCount++;
  return keyCount;
}
