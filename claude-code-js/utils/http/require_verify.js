// var: require_verify
var require_verify = __commonJS((exports, module) => {
  var JsonWebTokenError = require_JsonWebTokenError(), NotBeforeError = require_NotBeforeError(), TokenExpiredError = require_TokenExpiredError(), decode = require_decode(), timespan = require_timespan(), validateAsymmetricKey = require_validateAsymmetricKey(), PS_SUPPORTED = require_psSupported(), jws = require_jws(), { KeyObject, createSecretKey, createPublicKey: createPublicKey2 } = __require("crypto"), PUB_KEY_ALGS = ["RS256", "RS384", "RS512"], EC_KEY_ALGS = ["ES256", "ES384", "ES512"], RSA_KEY_ALGS = ["RS256", "RS384", "RS512"], HS_ALGS = ["HS256", "HS384", "HS512"];
  if (PS_SUPPORTED)
    PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, "PS256", "PS384", "PS512"), RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
  module.exports = function(jwtString, secretOrPublicKey, options, callback) {
    if (typeof options === "function" && !callback)
      callback = options, options = {};
    if (!options)
      options = {};
    options = Object.assign({}, options);
    let done;
    if (callback)
      done = callback;
    else
      done = function(err, data) {
        if (err)
          throw err;
        return data;
      };
    if (options.clockTimestamp && typeof options.clockTimestamp !== "number")
      return done(new JsonWebTokenError("clockTimestamp must be a number"));
    if (options.nonce !== void 0 && (typeof options.nonce !== "string" || options.nonce.trim() === ""))
      return done(new JsonWebTokenError("nonce must be a non-empty string"));
    if (options.allowInvalidAsymmetricKeyTypes !== void 0 && typeof options.allowInvalidAsymmetricKeyTypes !== "boolean")
      return done(new JsonWebTokenError("allowInvalidAsymmetricKeyTypes must be a boolean"));
    let clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!jwtString)
      return done(new JsonWebTokenError("jwt must be provided"));
    if (typeof jwtString !== "string")
      return done(new JsonWebTokenError("jwt must be a string"));
    let parts = jwtString.split(".");
    if (parts.length !== 3)
      return done(new JsonWebTokenError("jwt malformed"));
    let decodedToken;
    try {
      decodedToken = decode(jwtString, { complete: !0 });
    } catch (err) {
      return done(err);
    }
    if (!decodedToken)
      return done(new JsonWebTokenError("invalid token"));
    let header = decodedToken.header, getSecret;
    if (typeof secretOrPublicKey === "function") {
      if (!callback)
        return done(new JsonWebTokenError("verify must be called asynchronous if secret or public key is provided as a callback"));
      getSecret = secretOrPublicKey;
    } else
      getSecret = function(header2, secretCallback) {
        return secretCallback(null, secretOrPublicKey);
      };
    return getSecret(header, function(err, secretOrPublicKey2) {
      if (err)
        return done(new JsonWebTokenError("error in secret or public key callback: " + err.message));
      let hasSignature = parts[2].trim() !== "";
      if (!hasSignature && secretOrPublicKey2)
        return done(new JsonWebTokenError("jwt signature is required"));
      if (hasSignature && !secretOrPublicKey2)
        return done(new JsonWebTokenError("secret or public key must be provided"));
      if (!hasSignature && !options.algorithms)
        return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
      if (secretOrPublicKey2 != null && !(secretOrPublicKey2 instanceof KeyObject))
        try {
          secretOrPublicKey2 = createPublicKey2(secretOrPublicKey2);
        } catch (_) {
          try {
            secretOrPublicKey2 = createSecretKey(typeof secretOrPublicKey2 === "string" ? Buffer.from(secretOrPublicKey2) : secretOrPublicKey2);
          } catch (_2) {
            return done(new JsonWebTokenError("secretOrPublicKey is not valid key material"));
          }
        }
      if (!options.algorithms)
        if (secretOrPublicKey2.type === "secret")
          options.algorithms = HS_ALGS;
        else if (["rsa", "rsa-pss"].includes(secretOrPublicKey2.asymmetricKeyType))
          options.algorithms = RSA_KEY_ALGS;
        else if (secretOrPublicKey2.asymmetricKeyType === "ec")
          options.algorithms = EC_KEY_ALGS;
        else
          options.algorithms = PUB_KEY_ALGS;
      if (options.algorithms.indexOf(decodedToken.header.alg) === -1)
        return done(new JsonWebTokenError("invalid algorithm"));
      if (header.alg.startsWith("HS") && secretOrPublicKey2.type !== "secret")
        return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
      else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey2.type !== "public")
        return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
      if (!options.allowInvalidAsymmetricKeyTypes)
        try {
          validateAsymmetricKey(header.alg, secretOrPublicKey2);
        } catch (e) {
          return done(e);
        }
      let valid;
      try {
        valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey2);
      } catch (e) {
        return done(e);
      }
      if (!valid)
        return done(new JsonWebTokenError("invalid signature"));
      let payload = decodedToken.payload;
      if (typeof payload.nbf < "u" && !options.ignoreNotBefore) {
        if (typeof payload.nbf !== "number")
          return done(new JsonWebTokenError("invalid nbf value"));
        if (payload.nbf > clockTimestamp + (options.clockTolerance || 0))
          return done(new NotBeforeError("jwt not active", new Date(payload.nbf * 1000)));
      }
      if (typeof payload.exp < "u" && !options.ignoreExpiration) {
        if (typeof payload.exp !== "number")
          return done(new JsonWebTokenError("invalid exp value"));
        if (clockTimestamp >= payload.exp + (options.clockTolerance || 0))
          return done(new TokenExpiredError("jwt expired", new Date(payload.exp * 1000)));
      }
      if (options.audience) {
        let audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
        if (!(Array.isArray(payload.aud) ? payload.aud : [payload.aud]).some(function(targetAudience) {
          return audiences.some(function(audience) {
            return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
          });
        }))
          return done(new JsonWebTokenError("jwt audience invalid. expected: " + audiences.join(" or ")));
      }
      if (options.issuer) {
        if (typeof options.issuer === "string" && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1)
          return done(new JsonWebTokenError("jwt issuer invalid. expected: " + options.issuer));
      }
      if (options.subject) {
        if (payload.sub !== options.subject)
          return done(new JsonWebTokenError("jwt subject invalid. expected: " + options.subject));
      }
      if (options.jwtid) {
        if (payload.jti !== options.jwtid)
          return done(new JsonWebTokenError("jwt jwtid invalid. expected: " + options.jwtid));
      }
      if (options.nonce) {
        if (payload.nonce !== options.nonce)
          return done(new JsonWebTokenError("jwt nonce invalid. expected: " + options.nonce));
      }
      if (options.maxAge) {
        if (typeof payload.iat !== "number")
          return done(new JsonWebTokenError("iat required when maxAge is specified"));
        let maxAgeTimestamp = timespan(options.maxAge, payload.iat);
        if (typeof maxAgeTimestamp > "u")
          return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0))
          return done(new TokenExpiredError("maxAge exceeded", new Date(maxAgeTimestamp * 1000)));
      }
      if (options.complete === !0) {
        let signature7 = decodedToken.signature;
        return done(null, {
          header,
          payload,
          signature: signature7
        });
      }
      return done(null, payload);
    });
  };
});
