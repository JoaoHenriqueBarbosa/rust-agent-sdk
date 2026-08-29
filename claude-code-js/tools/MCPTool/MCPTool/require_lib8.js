// var: require_lib8
var require_lib8 = __commonJS((exports, module) => {
  var DEFAULT = require_default2(), parser2 = require_parser4(), FilterXSS = require_xss();
  function filterXSS(html2, options2) {
    var xss = new FilterXSS(options2);
    return xss.process(html2);
  }
  exports = module.exports = filterXSS;
  exports.filterXSS = filterXSS;
  exports.FilterXSS = FilterXSS;
  (function() {
    for (var i5 in DEFAULT)
      exports[i5] = DEFAULT[i5];
    for (var j4 in parser2)
      exports[j4] = parser2[j4];
  })();
  if (typeof window < "u")
    window.filterXSS = module.exports;
  function isWorkerEnv() {
    return typeof self < "u" && typeof DedicatedWorkerGlobalScope < "u" && self instanceof DedicatedWorkerGlobalScope;
  }
  if (isWorkerEnv())
    self.filterXSS = module.exports;
});
