// function: isLogAttributeValueInternal
function isLogAttributeValueInternal(val, visited) {
  if (val == null)
    return !0;
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean")
    return !0;
  if (val instanceof Uint8Array)
    return !0;
  if (typeof val === "object") {
    if (visited.has(val))
      return !1;
    if (visited.add(val), Array.isArray(val))
      return val.every((item) => isLogAttributeValueInternal(item, visited));
    let obj = val;
    if (obj.constructor !== Object && obj.constructor !== void 0)
      return !1;
    return Object.values(obj).every((item) => isLogAttributeValueInternal(item, visited));
  }
  return !1;
}
