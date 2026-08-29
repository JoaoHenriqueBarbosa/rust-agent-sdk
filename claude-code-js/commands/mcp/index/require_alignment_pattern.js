// var: require_alignment_pattern
var require_alignment_pattern = __commonJS((exports) => {
  var getSymbolSize = require_utils13().getSymbolSize;
  exports.getRowColCoords = function(version5) {
    if (version5 === 1)
      return [];
    let posCount = Math.floor(version5 / 7) + 2, size = getSymbolSize(version5), intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2, positions = [size - 7];
    for (let i5 = 1;i5 < posCount - 1; i5++)
      positions[i5] = positions[i5 - 1] - intervals;
    return positions.push(6), positions.reverse();
  };
  exports.getPositions = function(version5) {
    let coords = [], pos = exports.getRowColCoords(version5), posLength = pos.length;
    for (let i5 = 0;i5 < posLength; i5++)
      for (let j4 = 0;j4 < posLength; j4++) {
        if (i5 === 0 && j4 === 0 || i5 === 0 && j4 === posLength - 1 || i5 === posLength - 1 && j4 === 0)
          continue;
        coords.push([pos[i5], pos[j4]]);
      }
    return coords;
  };
});
