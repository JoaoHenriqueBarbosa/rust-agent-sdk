// function: isPlainObject
function isPlainObject(o) {
  if (isObject2(o) === !1)
    return !1;
  let ctor = o.constructor;
  if (ctor === void 0)
    return !0;
  let prot = ctor.prototype;
  if (isObject2(prot) === !1)
    return !1;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === !1)
    return !1;
  return !0;
}
