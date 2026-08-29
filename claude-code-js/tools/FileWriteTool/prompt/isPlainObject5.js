// function: isPlainObject5
function isPlainObject5(value) {
  if (typeof value !== "object" || value === null)
    return !1;
  let proto2 = value;
  while (Object.getPrototypeOf(proto2) !== null)
    proto2 = Object.getPrototypeOf(proto2);
  return Object.getPrototypeOf(value) === proto2;
}
