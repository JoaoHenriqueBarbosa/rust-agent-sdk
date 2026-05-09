// var: require_lodash4
var require_lodash4 = __commonJS((exports, module) => {
  var numberTag5 = "[object Number]", objectProto17 = Object.prototype, objectToString4 = objectProto17.toString;
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function isNumber2(value) {
    return typeof value == "number" || isObjectLike2(value) && objectToString4.call(value) == numberTag5;
  }
  module.exports = isNumber2;
});
