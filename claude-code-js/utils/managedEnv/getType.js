// function: getType
function getType(v2) {
  if (v2 === null)
    return "null";
  if (Array.isArray(v2))
    return "array";
  let t2 = typeof v2;
  if (["string", "number", "boolean", "object", "undefined"].includes(t2))
    return t2;
  return "unknown";
}
