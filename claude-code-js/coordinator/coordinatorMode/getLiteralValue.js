// function: getLiteralValue
function getLiteralValue(schema5) {
  if (isZ4Schema(schema5)) {
    let def3 = schema5._zod?.def;
    if (def3) {
      if (def3.value !== void 0)
        return def3.value;
      if (Array.isArray(def3.values) && def3.values.length > 0)
        return def3.values[0];
    }
  }
  let def2 = schema5._def;
  if (def2) {
    if (def2.value !== void 0)
      return def2.value;
    if (Array.isArray(def2.values) && def2.values.length > 0)
      return def2.values[0];
  }
  let directValue = schema5.value;
  if (directValue !== void 0)
    return directValue;
  return;
}
