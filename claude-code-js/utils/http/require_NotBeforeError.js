// var: require_NotBeforeError
var require_NotBeforeError = __commonJS((exports, module) => {
  var JsonWebTokenError = require_JsonWebTokenError(), NotBeforeError = function(message, date5) {
    JsonWebTokenError.call(this, message), this.name = "NotBeforeError", this.date = date5;
  };
  NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
  NotBeforeError.prototype.constructor = NotBeforeError;
  module.exports = NotBeforeError;
});
