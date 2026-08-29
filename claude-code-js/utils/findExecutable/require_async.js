// var: require_async
var require_async = __commonJS((exports, module) => {
  var defer = require_defer();
  module.exports = async;
  function async(callback) {
    var isAsync = !1;
    return defer(function() {
      isAsync = !0;
    }), function(err, result) {
      if (isAsync)
        callback(err, result);
      else
        defer(function() {
          callback(err, result);
        });
    };
  }
});
