// Original: src/utils/objectGroupBy.ts
function objectGroupBy(items, keySelector) {
  let result = Object.create(null), index = 0;
  for (let item of items) {
    let key2 = keySelector(item, index++);
    if (result[key2] === void 0)
      result[key2] = [];
    result[key2].push(item);
  }
  return result;
}
