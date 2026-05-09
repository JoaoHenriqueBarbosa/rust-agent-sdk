// var: require_get_proto
var require_get_proto = __commonJS((exports, module) => {
  var reflectGetProto = require_Reflect_getPrototypeOf(), originalGetProto = require_Object_getPrototypeOf(), getDunderProto = require_get();
  module.exports = reflectGetProto ? function(O2) {
    return reflectGetProto(O2);
  } : originalGetProto ? function(O2) {
    if (!O2 || typeof O2 !== "object" && typeof O2 !== "function")
      throw TypeError("getProto: not an object");
    return originalGetProto(O2);
  } : getDunderProto ? function(O2) {
    return getDunderProto(O2);
  } : null;
});
