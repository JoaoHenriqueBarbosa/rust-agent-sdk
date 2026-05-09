// var: callbackify5
var callbackify5 = (fn, reducer) => {
  return utils_default.isAsyncFn(fn) ? function(...args) {
    let cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
}, callbackify_default;
