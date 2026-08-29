// function: pick
function pick(schema, mask) {
  let newShape = {}, currDef = schema._zod.def;
  for (let key in mask) {
    if (!(key in currDef.shape))
      throw Error(`Unrecognized key: "${key}"`);
    if (!mask[key])
      continue;
    newShape[key] = currDef.shape[key];
  }
  return clone2(schema, {
    ...schema._zod.def,
    shape: newShape,
    checks: []
  });
}
