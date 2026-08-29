// var: require_JsonWebTokenError
var require_JsonWebTokenError = __commonJS((exports, module) => {
  var JsonWebTokenError = function(message, error43) {
    if (Error.call(this, message), Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);
    if (this.name = "JsonWebTokenError", this.message = message, error43)
      this.inner = error43;
  };
  JsonWebTokenError.prototype = Object.create(Error.prototype);
  JsonWebTokenError.prototype.constructor = JsonWebTokenError;
  module.exports = JsonWebTokenError;
});
