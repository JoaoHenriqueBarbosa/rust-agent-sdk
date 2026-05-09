// var: require_picomatch2
var require_picomatch2 = __commonJS((exports, module) => {
  var pico = require_picomatch(), utils = require_utils3();
  function picomatch(glob, options2, returnState = !1) {
    if (options2 && (options2.windows === null || options2.windows === void 0))
      options2 = { ...options2, windows: utils.isWindows() };
    return pico(glob, options2, returnState);
  }
  Object.assign(picomatch, pico);
  module.exports = picomatch;
});
