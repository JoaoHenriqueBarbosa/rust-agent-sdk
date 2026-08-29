// function: get2
function get2(obj, path26) {
  let list2 = [], arr = !1, deepGet = (obj2, path27, index2, arrayIndex) => {
    if (!isDefined2(obj2))
      return;
    if (!path27[index2])
      list2.push(arrayIndex !== void 0 ? {
        v: obj2,
        i: arrayIndex
      } : obj2);
    else {
      let key3 = path27[index2], value = obj2[key3];
      if (!isDefined2(value))
        return;
      if (index2 === path27.length - 1 && (isString2(value) || isNumber3(value) || isBoolean2(value) || typeof value === "bigint"))
        list2.push(arrayIndex !== void 0 ? {
          v: toString8(value),
          i: arrayIndex
        } : toString8(value));
      else if (isArray8(value)) {
        arr = !0;
        for (let i5 = 0, len = value.length;i5 < len; i5 += 1)
          deepGet(value[i5], path27, index2 + 1, i5);
      } else if (path27.length)
        deepGet(value, path27, index2 + 1, arrayIndex);
    }
  };
  return deepGet(obj, isString2(path26) ? path26.split(".") : path26, 0), arr ? list2 : list2[0];
}
