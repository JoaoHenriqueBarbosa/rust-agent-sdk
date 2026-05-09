// var: require_param_bytes_for_alg
var require_param_bytes_for_alg = __commonJS((exports, module) => {
  function getParamSize(keySize) {
    var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
    return result;
  }
  var paramBytesForAlg = {
    ES256: getParamSize(256),
    ES384: getParamSize(384),
    ES512: getParamSize(521)
  };
  function getParamBytesForAlg(alg) {
    var paramBytes = paramBytesForAlg[alg];
    if (paramBytes)
      return paramBytes;
    throw Error('Unknown algorithm "' + alg + '"');
  }
  module.exports = getParamBytesForAlg;
});
