// var: require_rsort
var require_rsort = __commonJS((exports, module) => {
  var compareBuild = require_compare_build(), rsort = (list, loose) => list.sort((a2, b) => compareBuild(b, a2, loose));
  module.exports = rsort;
});
