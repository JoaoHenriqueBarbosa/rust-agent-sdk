// var: require_jws
var require_jws = __commonJS((exports) => {
  var SignStream = require_sign_stream(), VerifyStream = require_verify_stream(), ALGORITHMS = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES384",
    "ES512"
  ];
  exports.ALGORITHMS = ALGORITHMS;
  exports.sign = SignStream.sign;
  exports.verify = VerifyStream.verify;
  exports.decode = VerifyStream.decode;
  exports.isValid = VerifyStream.isValid;
  exports.createSign = function(opts) {
    return new SignStream(opts);
  };
  exports.createVerify = function(opts) {
    return new VerifyStream(opts);
  };
});
