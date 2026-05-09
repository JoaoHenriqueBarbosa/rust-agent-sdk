// var: require_universalify
var require_universalify = __commonJS((exports) => {
  exports.fromCallback = function(fn) {
    return Object.defineProperty(function(...args) {
      if (typeof args[args.length - 1] === "function")
        fn.apply(this, args);
      else
        return new Promise((resolve20, reject2) => {
          args.push((err2, res) => err2 != null ? reject2(err2) : resolve20(res)), fn.apply(this, args);
        });
    }, "name", { value: fn.name });
  };
  exports.fromPromise = function(fn) {
    return Object.defineProperty(function(...args) {
      let cb = args[args.length - 1];
      if (typeof cb !== "function")
        return fn.apply(this, args);
      else
        args.pop(), fn.apply(this, args).then((r4) => cb(null, r4), cb);
    }, "name", { value: fn.name });
  };
});
