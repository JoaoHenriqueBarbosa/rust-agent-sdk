// var: require_lodash2
var require_lodash2 = __commonJS((exports, module) => {
  var boolTag5 = "[object Boolean]", objectProto17 = Object.prototype, objectToString4 = objectProto17.toString;
  function isBoolean2(value) {
    return value === !0 || value === !1 || isObjectLike2(value) && objectToString4.call(value) == boolTag5;
  }
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  module.exports = isBoolean2;
});
