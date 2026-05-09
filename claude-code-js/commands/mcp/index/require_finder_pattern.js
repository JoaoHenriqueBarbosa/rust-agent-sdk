// var: require_finder_pattern
var require_finder_pattern = __commonJS((exports) => {
  var getSymbolSize = require_utils13().getSymbolSize;
  exports.getPositions = function(version5) {
    let size = getSymbolSize(version5);
    return [
      [0, 0],
      [size - 7, 0],
      [0, size - 7]
    ];
  };
});
