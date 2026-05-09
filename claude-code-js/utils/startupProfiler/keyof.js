// function: keyof
function keyof(schema) {
  let shape = schema._zod.def.shape;
  return literal(Object.keys(shape));
}
