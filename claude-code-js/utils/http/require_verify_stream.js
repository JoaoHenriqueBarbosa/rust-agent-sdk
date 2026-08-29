// var: require_verify_stream
var require_verify_stream = __commonJS((exports, module) => {
  var Buffer13 = require_safe_buffer().Buffer, DataStream = require_data_stream(), jwa = require_jwa(), Stream3 = __require("stream"), toString5 = require_tostring(), util10 = __require("util"), JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
  function isObject5(thing) {
    return Object.prototype.toString.call(thing) === "[object Object]";
  }
  function safeJsonParse(thing) {
    if (isObject5(thing))
      return thing;
    try {
      return JSON.parse(thing);
    } catch (e) {
      return;
    }
  }
  function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split(".", 1)[0];
    return safeJsonParse(Buffer13.from(encodedHeader, "base64").toString("binary"));
  }
  function securedInputFromJWS(jwsSig) {
    return jwsSig.split(".", 2).join(".");
  }
  function signatureFromJWS(jwsSig) {
    return jwsSig.split(".")[2];
  }
  function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || "utf8";
    var payload = jwsSig.split(".")[1];
    return Buffer13.from(payload, "base64").toString(encoding);
  }
  function isValidJws(string4) {
    return JWS_REGEX.test(string4) && !!headerFromJWS(string4);
  }
  function jwsVerify(jwsSig, algorithm, secretOrKey) {
    if (!algorithm) {
      var err = Error("Missing algorithm parameter for jws.verify");
      throw err.code = "MISSING_ALGORITHM", err;
    }
    jwsSig = toString5(jwsSig);
    var signature7 = signatureFromJWS(jwsSig), securedInput = securedInputFromJWS(jwsSig), algo = jwa(algorithm);
    return algo.verify(securedInput, signature7, secretOrKey);
  }
  function jwsDecode(jwsSig, opts) {
    if (opts = opts || {}, jwsSig = toString5(jwsSig), !isValidJws(jwsSig))
      return null;
    var header = headerFromJWS(jwsSig);
    if (!header)
      return null;
    var payload = payloadFromJWS(jwsSig);
    if (header.typ === "JWT" || opts.json)
      payload = JSON.parse(payload, opts.encoding);
    return {
      header,
      payload,
      signature: signatureFromJWS(jwsSig)
    };
  }
  function VerifyStream(opts) {
    opts = opts || {};
    var secretOrKey = opts.secret;
    if (secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey, secretOrKey = secretOrKey == null ? opts.key : secretOrKey, /^hs/i.test(opts.algorithm) === !0 && secretOrKey == null)
      throw TypeError("secret must be a string or buffer or a KeyObject");
    var secretStream = new DataStream(secretOrKey);
    this.readable = !0, this.algorithm = opts.algorithm, this.encoding = opts.encoding, this.secret = this.publicKey = this.key = secretStream, this.signature = new DataStream(opts.signature), this.secret.once("close", function() {
      if (!this.signature.writable && this.readable)
        this.verify();
    }.bind(this)), this.signature.once("close", function() {
      if (!this.secret.writable && this.readable)
        this.verify();
    }.bind(this));
  }
  util10.inherits(VerifyStream, Stream3);
  VerifyStream.prototype.verify = function() {
    try {
      var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer), obj = jwsDecode(this.signature.buffer, this.encoding);
      return this.emit("done", valid, obj), this.emit("data", valid), this.emit("end"), this.readable = !1, valid;
    } catch (e) {
      this.readable = !1, this.emit("error", e), this.emit("close");
    }
  };
  VerifyStream.decode = jwsDecode;
  VerifyStream.isValid = isValidJws;
  VerifyStream.verify = jwsVerify;
  module.exports = VerifyStream;
});
