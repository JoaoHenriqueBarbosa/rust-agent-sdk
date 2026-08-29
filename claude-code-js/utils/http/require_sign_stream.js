// var: require_sign_stream
var require_sign_stream = __commonJS((exports, module) => {
  var Buffer13 = require_safe_buffer().Buffer, DataStream = require_data_stream(), jwa = require_jwa(), Stream3 = __require("stream"), toString5 = require_tostring(), util10 = __require("util");
  function base64url3(string4, encoding) {
    return Buffer13.from(string4, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function jwsSecuredInput(header, payload, encoding) {
    encoding = encoding || "utf8";
    var encodedHeader = base64url3(toString5(header), "binary"), encodedPayload = base64url3(toString5(payload), encoding);
    return util10.format("%s.%s", encodedHeader, encodedPayload);
  }
  function jwsSign(opts) {
    var { header, payload } = opts, secretOrKey = opts.secret || opts.privateKey, encoding = opts.encoding, algo = jwa(header.alg), securedInput = jwsSecuredInput(header, payload, encoding), signature7 = algo.sign(securedInput, secretOrKey);
    return util10.format("%s.%s", securedInput, signature7);
  }
  function SignStream(opts) {
    var secret = opts.secret;
    if (secret = secret == null ? opts.privateKey : secret, secret = secret == null ? opts.key : secret, /^hs/i.test(opts.header.alg) === !0 && secret == null)
      throw TypeError("secret must be a string or buffer or a KeyObject");
    var secretStream = new DataStream(secret);
    this.readable = !0, this.header = opts.header, this.encoding = opts.encoding, this.secret = this.privateKey = this.key = secretStream, this.payload = new DataStream(opts.payload), this.secret.once("close", function() {
      if (!this.payload.writable && this.readable)
        this.sign();
    }.bind(this)), this.payload.once("close", function() {
      if (!this.secret.writable && this.readable)
        this.sign();
    }.bind(this));
  }
  util10.inherits(SignStream, Stream3);
  SignStream.prototype.sign = function() {
    try {
      var signature7 = jwsSign({
        header: this.header,
        payload: this.payload.buffer,
        secret: this.secret.buffer,
        encoding: this.encoding
      });
      return this.emit("done", signature7), this.emit("data", signature7), this.emit("end"), this.readable = !1, signature7;
    } catch (e) {
      this.readable = !1, this.emit("error", e), this.emit("close");
    }
  };
  SignStream.sign = jwsSign;
  module.exports = SignStream;
});
