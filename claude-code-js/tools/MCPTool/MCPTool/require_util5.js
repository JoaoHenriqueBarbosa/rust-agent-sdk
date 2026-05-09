// var: require_util5
var require_util5 = __commonJS((exports, module) => {
  module.exports = {
    indexOf: function(arr, item) {
      var i5, j4;
      if (Array.prototype.indexOf)
        return arr.indexOf(item);
      for (i5 = 0, j4 = arr.length;i5 < j4; i5++)
        if (arr[i5] === item)
          return i5;
      return -1;
    },
    forEach: function(arr, fn, scope) {
      var i5, j4;
      if (Array.prototype.forEach)
        return arr.forEach(fn, scope);
      for (i5 = 0, j4 = arr.length;i5 < j4; i5++)
        fn.call(scope, arr[i5], i5, arr);
    },
    trim: function(str2) {
      if (String.prototype.trim)
        return str2.trim();
      return str2.replace(/(^\s*)|(\s*$)/g, "");
    },
    trimRight: function(str2) {
      if (String.prototype.trimRight)
        return str2.trimRight();
      return str2.replace(/(\s*$)/g, "");
    }
  };
});
