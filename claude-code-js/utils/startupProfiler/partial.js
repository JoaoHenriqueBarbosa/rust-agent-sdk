// function: partial
function partial(Class, schema, mask) {
  let oldShape = schema._zod.def.shape, shape = { ...oldShape };
  if (mask)
    for (let key in mask) {
      if (!(key in oldShape))
        throw Error(`Unrecognized key: "${key}"`);
      if (!mask[key])
        continue;
      shape[key] = Class ? new Class({
        type: "optional",
        innerType: oldShape[key]
      }) : oldShape[key];
    }
  else
    for (let key in oldShape)
      shape[key] = Class ? new Class({
        type: "optional",
        innerType: oldShape[key]
      }) : oldShape[key];
  return clone2(schema, {
    ...schema._zod.def,
    shape,
    checks: []
  });
}
