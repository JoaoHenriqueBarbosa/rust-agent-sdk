// var: require_terminal2
var require_terminal2 = __commonJS((exports) => {
  var big = require_terminal(), small = require_terminal_small();
  exports.render = function(qrData, options2, cb) {
    if (options2 && options2.small)
      return small.render(qrData, options2, cb);
    return big.render(qrData, options2, cb);
  };
});
