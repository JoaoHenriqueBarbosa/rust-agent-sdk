// var: require_paeth_predictor
var require_paeth_predictor = __commonJS((exports, module) => {
  module.exports = function(left, above, upLeft) {
    let paeth = left + above - upLeft, pLeft = Math.abs(paeth - left), pAbove = Math.abs(paeth - above), pUpLeft = Math.abs(paeth - upLeft);
    if (pLeft <= pAbove && pLeft <= pUpLeft)
      return left;
    if (pAbove <= pUpLeft)
      return above;
    return upLeft;
  };
});
