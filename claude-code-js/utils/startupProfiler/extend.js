// function: extend
function extend(schema, shape) {
  if (!isPlainObject(shape))
    throw Error("Invalid input to extend: expected a plain object");
  let def = {
    ...schema._zod.def,
    get shape() {
      let _shape = { ...schema._zod.def.shape, ...shape };
      return assignProp(this, "shape", _shape), _shape;
    },
    checks: []
  };
  return clone2(schema, def);
}
