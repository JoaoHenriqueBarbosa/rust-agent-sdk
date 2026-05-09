// var: require_tostring
var require_tostring = __commonJS((exports, module) => {
  var Buffer13 = __require("buffer").Buffer;
  module.exports = function(obj) {
    if (typeof obj === "string")
      return obj;
    if (typeof obj === "number" || Buffer13.isBuffer(obj))
      return obj.toString();
    return JSON.stringify(obj);
  };
});
