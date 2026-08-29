// var: require_gopd
var require_gopd = __commonJS((exports, module) => {
  var $gOPD = require_gOPD();
  if ($gOPD)
    try {
      $gOPD([], "length");
    } catch (e) {
      $gOPD = null;
    }
  module.exports = $gOPD;
});
