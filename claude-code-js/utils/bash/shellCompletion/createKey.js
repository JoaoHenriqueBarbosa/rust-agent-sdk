// function: createKey
function createKey(key3) {
  let path26 = null, id = null, src = null, weight = 1, getFn = null;
  if (isString2(key3) || isArray8(key3))
    src = key3, path26 = createKeyPath(key3), id = createKeyId(key3);
  else {
    if (!hasOwn4.call(key3, "name"))
      throw Error(MISSING_KEY_PROPERTY("name"));
    let name3 = key3.name;
    if (src = name3, hasOwn4.call(key3, "weight")) {
      if (weight = key3.weight, weight <= 0)
        throw Error(INVALID_KEY_WEIGHT_VALUE(name3));
    }
    path26 = createKeyPath(name3), id = createKeyId(name3), getFn = key3.getFn;
  }
  return {
    path: path26,
    id,
    weight,
    src,
    getFn
  };
}
