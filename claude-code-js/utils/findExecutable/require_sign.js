// var: require_sign
var require_sign = __commonJS((exports, module) => {
  var $isNaN = require_isNaN();
  module.exports = function(number4) {
    if ($isNaN(number4) || number4 === 0)
      return number4;
    return number4 < 0 ? -1 : 1;
  };
});
