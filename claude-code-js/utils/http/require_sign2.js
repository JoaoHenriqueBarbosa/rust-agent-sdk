// var: require_sign2
var require_sign2 = __commonJS((exports, module) => {
  var timespan = require_timespan(), PS_SUPPORTED = require_psSupported(), validateAsymmetricKey = require_validateAsymmetricKey(), jws = require_jws(), includes = require_lodash(), isBoolean2 = require_lodash2(), isInteger = require_lodash3(), isNumber2 = require_lodash4(), isPlainObject5 = require_lodash5(), isString2 = require_lodash6(), once9 = require_lodash7(), { KeyObject, createSecretKey, createPrivateKey: createPrivateKey2 } = __require("crypto"), SUPPORTED_ALGS = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
  if (PS_SUPPORTED)
    SUPPORTED_ALGS.splice(3, 0, "PS256", "PS384", "PS512");
  var sign_options_schema = {
    expiresIn: { isValid: function(value) {
      return isInteger(value) || isString2(value) && value;
    }, message: '"expiresIn" should be a number of seconds or string representing a timespan' },
    notBefore: { isValid: function(value) {
      return isInteger(value) || isString2(value) && value;
    }, message: '"notBefore" should be a number of seconds or string representing a timespan' },
    audience: { isValid: function(value) {
      return isString2(value) || Array.isArray(value);
    }, message: '"audience" must be a string or array' },
    algorithm: { isValid: includes.bind(null, SUPPORTED_ALGS), message: '"algorithm" must be a valid string enum value' },
    header: { isValid: isPlainObject5, message: '"header" must be an object' },
    encoding: { isValid: isString2, message: '"encoding" must be a string' },
    issuer: { isValid: isString2, message: '"issuer" must be a string' },
    subject: { isValid: isString2, message: '"subject" must be a string' },
    jwtid: { isValid: isString2, message: '"jwtid" must be a string' },
    noTimestamp: { isValid: isBoolean2, message: '"noTimestamp" must be a boolean' },
    keyid: { isValid: isString2, message: '"keyid" must be a string' },
    mutatePayload: { isValid: isBoolean2, message: '"mutatePayload" must be a boolean' },
    allowInsecureKeySizes: { isValid: isBoolean2, message: '"allowInsecureKeySizes" must be a boolean' },
    allowInvalidAsymmetricKeyTypes: { isValid: isBoolean2, message: '"allowInvalidAsymmetricKeyTypes" must be a boolean' }
  }, registered_claims_schema = {
    iat: { isValid: isNumber2, message: '"iat" should be a number of seconds' },
    exp: { isValid: isNumber2, message: '"exp" should be a number of seconds' },
    nbf: { isValid: isNumber2, message: '"nbf" should be a number of seconds' }
  };
  function validate3(schema5, allowUnknown, object2, parameterName) {
    if (!isPlainObject5(object2))
      throw Error('Expected "' + parameterName + '" to be a plain object.');
    Object.keys(object2).forEach(function(key) {
      let validator = schema5[key];
      if (!validator) {
        if (!allowUnknown)
          throw Error('"' + key + '" is not allowed in "' + parameterName + '"');
        return;
      }
      if (!validator.isValid(object2[key]))
        throw Error(validator.message);
    });
  }
  function validateOptions(options) {
    return validate3(sign_options_schema, !1, options, "options");
  }
  function validatePayload(payload) {
    return validate3(registered_claims_schema, !0, payload, "payload");
  }
  var options_to_payload = {
    audience: "aud",
    issuer: "iss",
    subject: "sub",
    jwtid: "jti"
  }, options_for_objects = [
    "expiresIn",
    "notBefore",
    "noTimestamp",
    "audience",
    "issuer",
    "subject",
    "jwtid"
  ];
  module.exports = function(payload, secretOrPrivateKey, options, callback) {
    if (typeof options === "function")
      callback = options, options = {};
    else
      options = options || {};
    let isObjectPayload = typeof payload === "object" && !Buffer.isBuffer(payload), header = Object.assign({
      alg: options.algorithm || "HS256",
      typ: isObjectPayload ? "JWT" : void 0,
      kid: options.keyid
    }, options.header);
    function failure(err) {
      if (callback)
        return callback(err);
      throw err;
    }
    if (!secretOrPrivateKey && options.algorithm !== "none")
      return failure(Error("secretOrPrivateKey must have a value"));
    if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject))
      try {
        secretOrPrivateKey = createPrivateKey2(secretOrPrivateKey);
      } catch (_) {
        try {
          secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === "string" ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
        } catch (_2) {
          return failure(Error("secretOrPrivateKey is not valid key material"));
        }
      }
    if (header.alg.startsWith("HS") && secretOrPrivateKey.type !== "secret")
      return failure(Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
    else if (/^(?:RS|PS|ES)/.test(header.alg)) {
      if (secretOrPrivateKey.type !== "private")
        return failure(Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
      if (!options.allowInsecureKeySizes && !header.alg.startsWith("ES") && secretOrPrivateKey.asymmetricKeyDetails !== void 0 && secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048)
        return failure(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
    }
    if (typeof payload > "u")
      return failure(Error("payload is required"));
    else if (isObjectPayload) {
      try {
        validatePayload(payload);
      } catch (error43) {
        return failure(error43);
      }
      if (!options.mutatePayload)
        payload = Object.assign({}, payload);
    } else {
      let invalid_options = options_for_objects.filter(function(opt) {
        return typeof options[opt] < "u";
      });
      if (invalid_options.length > 0)
        return failure(Error("invalid " + invalid_options.join(",") + " option for " + typeof payload + " payload"));
    }
    if (typeof payload.exp < "u" && typeof options.expiresIn < "u")
      return failure(Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    if (typeof payload.nbf < "u" && typeof options.notBefore < "u")
      return failure(Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    try {
      validateOptions(options);
    } catch (error43) {
      return failure(error43);
    }
    if (!options.allowInvalidAsymmetricKeyTypes)
      try {
        validateAsymmetricKey(header.alg, secretOrPrivateKey);
      } catch (error43) {
        return failure(error43);
      }
    let timestamp = payload.iat || Math.floor(Date.now() / 1000);
    if (options.noTimestamp)
      delete payload.iat;
    else if (isObjectPayload)
      payload.iat = timestamp;
    if (typeof options.notBefore < "u") {
      try {
        payload.nbf = timespan(options.notBefore, timestamp);
      } catch (err) {
        return failure(err);
      }
      if (typeof payload.nbf > "u")
        return failure(Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
    }
    if (typeof options.expiresIn < "u" && typeof payload === "object") {
      try {
        payload.exp = timespan(options.expiresIn, timestamp);
      } catch (err) {
        return failure(err);
      }
      if (typeof payload.exp > "u")
        return failure(Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
    }
    Object.keys(options_to_payload).forEach(function(key) {
      let claim = options_to_payload[key];
      if (typeof options[key] < "u") {
        if (typeof payload[claim] < "u")
          return failure(Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
        payload[claim] = options[key];
      }
    });
    let encoding = options.encoding || "utf8";
    if (typeof callback === "function")
      callback = callback && once9(callback), jws.createSign({
        header,
        privateKey: secretOrPrivateKey,
        payload,
        encoding
      }).once("error", callback).once("done", function(signature7) {
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature7.length < 256)
          return callback(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        callback(null, signature7);
      });
    else {
      let signature7 = jws.sign({ header, payload, secret: secretOrPrivateKey, encoding });
      if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature7.length < 256)
        throw Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
      return signature7;
    }
  };
});
