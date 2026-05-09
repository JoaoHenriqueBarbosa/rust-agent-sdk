// var: require_defer
var require_defer = __commonJS((exports, module) => {
  module.exports = defer;
  function defer(fn) {
    var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
    if (nextTick)
      nextTick(fn);
    else
      setTimeout(fn, 0);
  }
});
