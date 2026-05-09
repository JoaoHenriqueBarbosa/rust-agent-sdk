// var: require_lodash6
var require_lodash6 = __commonJS((exports, module) => {
  var stringTag5 = "[object String]", objectProto17 = Object.prototype, objectToString4 = objectProto17.toString, isArray6 = Array.isArray;
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function isString2(value) {
    return typeof value == "string" || !isArray6(value) && isObjectLike2(value) && objectToString4.call(value) == stringTag5;
  }
  module.exports = isString2;
});
