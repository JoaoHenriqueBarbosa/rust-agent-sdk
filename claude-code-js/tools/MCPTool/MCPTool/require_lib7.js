// var: require_lib7
var require_lib7 = __commonJS((exports, module) => {
  var DEFAULT = require_default(), FilterCSS = require_css2();
  function filterCSS(html2, options2) {
    var xss = new FilterCSS(options2);
    return xss.process(html2);
  }
  exports = module.exports = filterCSS;
  exports.FilterCSS = FilterCSS;
  for (i5 in DEFAULT)
    exports[i5] = DEFAULT[i5];
  var i5;
  if (typeof window < "u")
    window.filterCSS = module.exports;
});
