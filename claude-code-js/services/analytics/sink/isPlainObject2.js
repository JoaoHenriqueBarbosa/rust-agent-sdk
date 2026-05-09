// function: isPlainObject2
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null)
    return !1;
  let prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
