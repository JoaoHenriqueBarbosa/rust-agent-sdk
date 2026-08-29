// var: require_timer_util
var require_timer_util = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.unrefTimer = void 0;
  function unrefTimer(timer) {
    if (typeof timer !== "number")
      timer.unref();
  }
  exports.unrefTimer = unrefTimer;
});
