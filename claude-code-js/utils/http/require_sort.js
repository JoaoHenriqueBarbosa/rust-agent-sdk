// var: require_sort
var require_sort = __commonJS((exports, module) => {
  var compareBuild = require_compare_build(), sort = (list, loose) => list.sort((a2, b) => compareBuild(a2, b, loose));
  module.exports = sort;
});
