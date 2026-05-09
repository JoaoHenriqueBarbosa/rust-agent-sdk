// var: require_serial
var require_serial = __commonJS((exports, module) => {
  var serialOrdered = require_serialOrdered();
  module.exports = serial;
  function serial(list, iterator2, callback) {
    return serialOrdered(list, iterator2, null, callback);
  }
});
