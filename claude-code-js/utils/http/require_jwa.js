// var: require_jwa
var require_jwa = __commonJS((exports, module) => {
  var Buffer13 = require_safe_buffer().Buffer, crypto11 = __require("crypto"), formatEcdsa = require_ecdsa_sig_formatter(), util10 = __require("util"), MSG_INVALID_ALGORITHM = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`, MSG_INVALID_SECRET = "secret must be a string or buffer", MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer", MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object", supportsKeyObjects = typeof crypto11.createPublicKey === "function";
  if (supportsKeyObjects)
    MSG_INVALID_VERIFIER_KEY += " or a KeyObject", MSG_INVALID_SECRET += "or a KeyObject";
  function checkIsPublicKey(key) {
    if (Buffer13.isBuffer(key))
      return;
    if (typeof key === "string")
      return;
    if (!supportsKeyObjects)
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    if (typeof key !== "object")
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    if (typeof key.type !== "string")
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    if (typeof key.asymmetricKeyType !== "string")
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    if (typeof key.export !== "function")
      throw typeError(MSG_INVALID_VERIFIER_KEY);
  }
  function checkIsPrivateKey(key) {
    if (Buffer13.isBuffer(key))
      return;
    if (typeof key === "string")
      return;
    if (typeof key === "object")
      return;
    throw typeError(MSG_INVALID_SIGNER_KEY);
  }
  function checkIsSecretKey(key) {
    if (Buffer13.isBuffer(key))
      return;
    if (typeof key === "string")
      return key;
    if (!supportsKeyObjects)
      throw typeError(MSG_INVALID_SECRET);
    if (typeof key !== "object")
      throw typeError(MSG_INVALID_SECRET);
    if (key.type !== "secret")
      throw typeError(MSG_INVALID_SECRET);
    if (typeof key.export !== "function")
      throw typeError(MSG_INVALID_SECRET);
  }
  function fromBase649(base644) {
    return base644.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function toBase649(base64url3) {
    base64url3 = base64url3.toString();
    var padding = 4 - base64url3.length % 4;
    if (padding !== 4)
      for (var i4 = 0;i4 < padding; ++i4)
        base64url3 += "=";
    return base64url3.replace(/\-/g, "+").replace(/_/g, "/");
  }
  function typeError(template) {
    var args = [].slice.call(arguments, 1), errMsg = util10.format.bind(util10, template).apply(null, args);
    return TypeError(errMsg);
  }
  function bufferOrString(obj) {
    return Buffer13.isBuffer(obj) || typeof obj === "string";
  }
  function normalizeInput(thing) {
    if (!bufferOrString(thing))
      thing = JSON.stringify(thing);
    return thing;
  }
  function createHmacSigner(bits) {
    return function(thing, secret) {
      checkIsSecretKey(secret), thing = normalizeInput(thing);
      var hmac2 = crypto11.createHmac("sha" + bits, secret), sig = (hmac2.update(thing), hmac2.digest("base64"));
      return fromBase649(sig);
    };
  }
  var bufferEqual, timingSafeEqual = "timingSafeEqual" in crypto11 ? function(a2, b) {
    if (a2.byteLength !== b.byteLength)
      return !1;
    return crypto11.timingSafeEqual(a2, b);
  } : function(a2, b) {
    if (!bufferEqual)
      bufferEqual = require_buffer_equal_constant_time();
    return bufferEqual(a2, b);
  };
  function createHmacVerifier(bits) {
    return function(thing, signature7, secret) {
      var computedSig = createHmacSigner(bits)(thing, secret);
      return timingSafeEqual(Buffer13.from(signature7), Buffer13.from(computedSig));
    };
  }
  function createKeySigner(bits) {
    return function(thing, privateKey) {
      checkIsPrivateKey(privateKey), thing = normalizeInput(thing);
      var signer = crypto11.createSign("RSA-SHA" + bits), sig = (signer.update(thing), signer.sign(privateKey, "base64"));
      return fromBase649(sig);
    };
  }
  function createKeyVerifier(bits) {
    return function(thing, signature7, publicKey) {
      checkIsPublicKey(publicKey), thing = normalizeInput(thing), signature7 = toBase649(signature7);
      var verifier = crypto11.createVerify("RSA-SHA" + bits);
      return verifier.update(thing), verifier.verify(publicKey, signature7, "base64");
    };
  }
  function createPSSKeySigner(bits) {
    return function(thing, privateKey) {
      checkIsPrivateKey(privateKey), thing = normalizeInput(thing);
      var signer = crypto11.createSign("RSA-SHA" + bits), sig = (signer.update(thing), signer.sign({
        key: privateKey,
        padding: crypto11.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto11.constants.RSA_PSS_SALTLEN_DIGEST
      }, "base64"));
      return fromBase649(sig);
    };
  }
  function createPSSKeyVerifier(bits) {
    return function(thing, signature7, publicKey) {
      checkIsPublicKey(publicKey), thing = normalizeInput(thing), signature7 = toBase649(signature7);
      var verifier = crypto11.createVerify("RSA-SHA" + bits);
      return verifier.update(thing), verifier.verify({
        key: publicKey,
        padding: crypto11.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto11.constants.RSA_PSS_SALTLEN_DIGEST
      }, signature7, "base64");
    };
  }
  function createECDSASigner(bits) {
    var inner = createKeySigner(bits);
    return function() {
      var signature7 = inner.apply(null, arguments);
      return signature7 = formatEcdsa.derToJose(signature7, "ES" + bits), signature7;
    };
  }
  function createECDSAVerifer(bits) {
    var inner = createKeyVerifier(bits);
    return function(thing, signature7, publicKey) {
      signature7 = formatEcdsa.joseToDer(signature7, "ES" + bits).toString("base64");
      var result = inner(thing, signature7, publicKey);
      return result;
    };
  }
  function createNoneSigner() {
    return function() {
      return "";
    };
  }
  function createNoneVerifier() {
    return function(thing, signature7) {
      return signature7 === "";
    };
  }
  module.exports = function(algorithm) {
    var signerFactories = {
      hs: createHmacSigner,
      rs: createKeySigner,
      ps: createPSSKeySigner,
      es: createECDSASigner,
      none: createNoneSigner
    }, verifierFactories = {
      hs: createHmacVerifier,
      rs: createKeyVerifier,
      ps: createPSSKeyVerifier,
      es: createECDSAVerifer,
      none: createNoneVerifier
    }, match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
    if (!match)
      throw typeError(MSG_INVALID_ALGORITHM, algorithm);
    var algo = (match[1] || match[3]).toLowerCase(), bits = match[2];
    return {
      sign: signerFactories[algo](bits),
      verify: verifierFactories[algo](bits)
    };
  };
});
