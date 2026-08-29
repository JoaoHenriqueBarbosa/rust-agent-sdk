// var: require_get
var require_get = __commonJS((exports, module) => {
  var callBind = require_call_bind_apply_helpers(), gOPD = require_gopd(), hasProtoAccessor;
  try {
    hasProtoAccessor = [].__proto__ === Array.prototype;
  } catch (e) {
    if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS")
      throw e;
  }
  var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__"), $Object = Object, $getPrototypeOf = $Object.getPrototypeOf;
  module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function(value) {
    return $getPrototypeOf(value == null ? value : $Object(value));
  } : !1;
});
