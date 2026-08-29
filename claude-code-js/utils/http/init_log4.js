// var: init_log4
var init_log4 = __esm(() => {
  init_values3();
  levelNumbers2 = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500
  };
  noopLogger2 = {
    error: noop6,
    warn: noop6,
    info: noop6,
    debug: noop6
  }, cachedLoggers2 = /* @__PURE__ */ new WeakMap;
});
