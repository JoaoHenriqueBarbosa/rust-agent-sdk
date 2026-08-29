// function: required
function required(Class, schema, mask) {
  let oldShape = schema._zod.def.shape, shape = { ...oldShape };
  if (mask)
    for (let key in mask) {
      if (!(key in shape))
        throw Error(`Unrecognized key: "${key}"`);
      if (!mask[key])
        continue;
      shape[key] = new Class({
        type: "nonoptional",
        innerType: oldShape[key]
      });
    }
  else
    for (let key in oldShape)
      shape[key] = new Class({
        type: "nonoptional",
        innerType: oldShape[key]
      });
  return clone2(schema, {
    ...schema._zod.def,
    shape,
    checks: []
  });
}
