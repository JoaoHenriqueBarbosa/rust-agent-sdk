// var: require_decode
var require_decode = __commonJS((exports, module) => {
  var jws = require_jws();
  module.exports = function(jwt2, options) {
    options = options || {};
    var decoded = jws.decode(jwt2, options);
    if (!decoded)
      return null;
    var payload = decoded.payload;
    if (typeof payload === "string")
      try {
        var obj = JSON.parse(payload);
        if (obj !== null && typeof obj === "object")
          payload = obj;
      } catch (e) {}
    if (options.complete === !0)
      return {
        header: decoded.header,
        payload,
        signature: decoded.signature
      };
    return payload;
  };
});
