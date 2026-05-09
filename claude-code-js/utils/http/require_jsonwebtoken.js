// var: require_jsonwebtoken
var require_jsonwebtoken = __commonJS((exports, module) => {
  module.exports = {
    decode: require_decode(),
    verify: require_verify(),
    sign: require_sign2(),
    JsonWebTokenError: require_JsonWebTokenError(),
    NotBeforeError: require_NotBeforeError(),
    TokenExpiredError: require_TokenExpiredError()
  };
});
