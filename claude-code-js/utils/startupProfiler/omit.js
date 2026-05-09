// function: omit
function omit(schema, mask) {
  let newShape = { ...schema._zod.def.shape }, currDef = schema._zod.def;
  for (let key in mask) {
    if (!(key in currDef.shape))
      throw Error(`Unrecognized key: "${key}"`);
    if (!mask[key])
      continue;
    delete newShape[key];
  }
  return clone2(schema, {
    ...schema._zod.def,
    shape: newShape,
    checks: []
  });
}
