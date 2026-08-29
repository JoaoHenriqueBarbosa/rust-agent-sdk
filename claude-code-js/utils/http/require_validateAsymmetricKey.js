// var: require_validateAsymmetricKey
var require_validateAsymmetricKey = __commonJS((exports, module) => {
  var ASYMMETRIC_KEY_DETAILS_SUPPORTED = require_asymmetricKeyDetailsSupported(), RSA_PSS_KEY_DETAILS_SUPPORTED = require_rsaPssKeyDetailsSupported(), allowedAlgorithmsForKeys = {
    ec: ["ES256", "ES384", "ES512"],
    rsa: ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
    "rsa-pss": ["PS256", "PS384", "PS512"]
  }, allowedCurves = {
    ES256: "prime256v1",
    ES384: "secp384r1",
    ES512: "secp521r1"
  };
  module.exports = function(algorithm, key) {
    if (!algorithm || !key)
      return;
    let keyType = key.asymmetricKeyType;
    if (!keyType)
      return;
    let allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
    if (!allowedAlgorithms)
      throw Error(`Unknown key type "${keyType}".`);
    if (!allowedAlgorithms.includes(algorithm))
      throw Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(", ")}.`);
    if (ASYMMETRIC_KEY_DETAILS_SUPPORTED)
      switch (keyType) {
        case "ec":
          let keyCurve = key.asymmetricKeyDetails.namedCurve, allowedCurve = allowedCurves[algorithm];
          if (keyCurve !== allowedCurve)
            throw Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
          break;
        case "rsa-pss":
          if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
            let length = parseInt(algorithm.slice(-3), 10), { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
            if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm)
              throw Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
            if (saltLength !== void 0 && saltLength > length >> 3)
              throw Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
          }
          break;
      }
  };
});
