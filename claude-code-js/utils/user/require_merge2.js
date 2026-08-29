// var: require_merge2
var require_merge2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.merge = void 0;
  var lodash_merge_1 = require_lodash_merge(), MAX_LEVEL = 20;
  function merge3(...args) {
    let result = args.shift(), objects = /* @__PURE__ */ new WeakMap;
    while (args.length > 0)
      result = mergeTwoObjects(result, args.shift(), 0, objects);
    return result;
  }
  exports.merge = merge3;
  function takeValue(value) {
    if (isArray7(value))
      return value.slice();
    return value;
  }
  function mergeTwoObjects(one, two, level = 0, objects) {
    let result;
    if (level > MAX_LEVEL)
      return;
    if (level++, isPrimitive(one) || isPrimitive(two) || isFunction4(two))
      result = takeValue(two);
    else if (isArray7(one)) {
      if (result = one.slice(), isArray7(two))
        for (let i5 = 0, j4 = two.length;i5 < j4; i5++)
          result.push(takeValue(two[i5]));
      else if (isObject6(two)) {
        let keys2 = Object.keys(two);
        for (let i5 = 0, j4 = keys2.length;i5 < j4; i5++) {
          let key2 = keys2[i5];
          result[key2] = takeValue(two[key2]);
        }
      }
    } else if (isObject6(one))
      if (isObject6(two)) {
        if (!shouldMerge(one, two))
          return two;
        result = Object.assign({}, one);
        let keys2 = Object.keys(two);
        for (let i5 = 0, j4 = keys2.length;i5 < j4; i5++) {
          let key2 = keys2[i5], twoValue = two[key2];
          if (isPrimitive(twoValue))
            if (typeof twoValue > "u")
              delete result[key2];
            else
              result[key2] = twoValue;
          else {
            let obj1 = result[key2], obj2 = twoValue;
            if (wasObjectReferenced(one, key2, objects) || wasObjectReferenced(two, key2, objects))
              delete result[key2];
            else {
              if (isObject6(obj1) && isObject6(obj2)) {
                let arr1 = objects.get(obj1) || [], arr2 = objects.get(obj2) || [];
                arr1.push({ obj: one, key: key2 }), arr2.push({ obj: two, key: key2 }), objects.set(obj1, arr1), objects.set(obj2, arr2);
              }
              result[key2] = mergeTwoObjects(result[key2], twoValue, level, objects);
            }
          }
        }
      } else
        result = two;
    return result;
  }
  function wasObjectReferenced(obj, key2, objects) {
    let arr = objects.get(obj[key2]) || [];
    for (let i5 = 0, j4 = arr.length;i5 < j4; i5++) {
      let info = arr[i5];
      if (info.key === key2 && info.obj === obj)
        return !0;
    }
    return !1;
  }
  function isArray7(value) {
    return Array.isArray(value);
  }
  function isFunction4(value) {
    return typeof value === "function";
  }
  function isObject6(value) {
    return !isPrimitive(value) && !isArray7(value) && !isFunction4(value) && typeof value === "object";
  }
  function isPrimitive(value) {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value > "u" || value instanceof Date || value instanceof RegExp || value === null;
  }
  function shouldMerge(one, two) {
    if (!(0, lodash_merge_1.isPlainObject)(one) || !(0, lodash_merge_1.isPlainObject)(two))
      return !1;
    return !0;
  }
});
