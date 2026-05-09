// var: require_timespan
var require_timespan = __commonJS((exports, module) => {
  var ms = require_ms();
  module.exports = function(time3, iat) {
    var timestamp = iat || Math.floor(Date.now() / 1000);
    if (typeof time3 === "string") {
      var milliseconds = ms(time3);
      if (typeof milliseconds > "u")
        return;
      return Math.floor(timestamp + milliseconds / 1000);
    } else if (typeof time3 === "number")
      return timestamp + time3;
    else
      return;
  };
});
