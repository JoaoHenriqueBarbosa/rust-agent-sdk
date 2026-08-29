// var: require_TokenExpiredError
var require_TokenExpiredError = __commonJS((exports, module) => {
  var JsonWebTokenError = require_JsonWebTokenError(), TokenExpiredError = function(message, expiredAt) {
    JsonWebTokenError.call(this, message), this.name = "TokenExpiredError", this.expiredAt = expiredAt;
  };
  TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
  TokenExpiredError.prototype.constructor = TokenExpiredError;
  module.exports = TokenExpiredError;
});
