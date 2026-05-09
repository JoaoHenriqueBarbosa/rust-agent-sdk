// function: isBoolean2
function isBoolean2(value) {
  return value === !0 || value === !1 || isObjectLike2(value) && getTag2(value) == "[object Boolean]";
}
