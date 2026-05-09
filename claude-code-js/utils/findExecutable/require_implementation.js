// var: require_implementation
var require_implementation = __commonJS((exports, module) => {
  var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ", toStr = Object.prototype.toString, max = Math.max, funcType = "[object Function]", concatty = function(a2, b) {
    var arr = [];
    for (var i2 = 0;i2 < a2.length; i2 += 1)
      arr[i2] = a2[i2];
    for (var j2 = 0;j2 < b.length; j2 += 1)
      arr[j2 + a2.length] = b[j2];
    return arr;
  }, slicy = function(arrLike, offset) {
    var arr = [];
    for (var i2 = offset || 0, j2 = 0;i2 < arrLike.length; i2 += 1, j2 += 1)
      arr[j2] = arrLike[i2];
    return arr;
  }, joiny = function(arr, joiner) {
    var str = "";
    for (var i2 = 0;i2 < arr.length; i2 += 1)
      if (str += arr[i2], i2 + 1 < arr.length)
        str += joiner;
    return str;
  };
  module.exports = function(that) {
    var target = this;
    if (typeof target !== "function" || toStr.apply(target) !== funcType)
      throw TypeError(ERROR_MESSAGE + target);
    var args = slicy(arguments, 1), bound, binder = function() {
      if (this instanceof bound) {
        var result = target.apply(this, concatty(args, arguments));
        if (Object(result) === result)
          return result;
        return this;
      }
      return target.apply(that, concatty(args, arguments));
    }, boundLength = max(0, target.length - args.length), boundArgs = [];
    for (var i2 = 0;i2 < boundLength; i2++)
      boundArgs[i2] = "$" + i2;
    if (bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder), target.prototype) {
      var Empty = function() {};
      Empty.prototype = target.prototype, bound.prototype = new Empty, Empty.prototype = null;
    }
    return bound;
  };
});
