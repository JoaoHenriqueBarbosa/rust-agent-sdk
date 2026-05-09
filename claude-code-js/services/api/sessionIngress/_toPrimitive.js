// function: _toPrimitive
function _toPrimitive(t2, r4) {
  if (typeof t2 != "object" || !t2)
    return t2;
  var e = t2[Symbol.toPrimitive];
  if (e !== void 0) {
    var i5 = e.call(t2, r4 || "default");
    if (typeof i5 != "object")
      return i5;
    throw TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r4 === "string" ? String : Number)(t2);
}
