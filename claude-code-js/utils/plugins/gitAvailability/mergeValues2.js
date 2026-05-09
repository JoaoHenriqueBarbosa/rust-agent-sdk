// function: mergeValues2
function mergeValues2(a2, b) {
  let aType = getParsedType2(a2), bType = getParsedType2(b);
  if (a2 === b)
    return { valid: !0, data: a2 };
  else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    let bKeys = util10.objectKeys(b), sharedKeys = util10.objectKeys(a2).filter((key) => bKeys.indexOf(key) !== -1), newObj = { ...a2, ...b };
    for (let key of sharedKeys) {
      let sharedValue = mergeValues2(a2[key], b[key]);
      if (!sharedValue.valid)
        return { valid: !1 };
      newObj[key] = sharedValue.data;
    }
    return { valid: !0, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a2.length !== b.length)
      return { valid: !1 };
    let newArray = [];
    for (let index = 0;index < a2.length; index++) {
      let itemA = a2[index], itemB = b[index], sharedValue = mergeValues2(itemA, itemB);
      if (!sharedValue.valid)
        return { valid: !1 };
      newArray.push(sharedValue.data);
    }
    return { valid: !0, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a2 === +b)
    return { valid: !0, data: a2 };
  else
    return { valid: !1 };
}
