// Original: src/ink/components/ClockContext.tsx
function createClock(tickIntervalMs) {
  let subscribers2 = /* @__PURE__ */ new Map, interval = null, currentTickIntervalMs = tickIntervalMs, startTime = 0, tickTime = 0;
  function tick() {
    tickTime = Date.now() - startTime;
    for (let onChange of subscribers2.keys())
      onChange();
  }
  function updateInterval() {
    if ([...subscribers2.values()].some(Boolean)) {
      if (interval)
        clearInterval(interval), interval = null;
      if (startTime === 0)
        startTime = Date.now();
      interval = setInterval(tick, currentTickIntervalMs);
    } else if (interval)
      clearInterval(interval), interval = null;
  }
  return {
    subscribe(onChange, keepAlive) {
      return subscribers2.set(onChange, keepAlive), updateInterval(), () => {
        subscribers2.delete(onChange), updateInterval();
      };
    },
    now() {
      if (startTime === 0)
        startTime = Date.now();
      if (interval && tickTime)
        return tickTime;
      return Date.now() - startTime;
    },
    setTickInterval(ms) {
      if (ms === currentTickIntervalMs)
        return;
      currentTickIntervalMs = ms, updateInterval();
    }
  };
}
function ClockProvider(t0) {
  let $3 = import_compiler_runtime3.c(7), {
    children
  } = t0, [clock] = import_react7.useState(_temp), focused = useTerminalFocus(), t1, t2;
  if ($3[0] !== clock || $3[1] !== focused)
    t1 = () => {
      clock.setTickInterval(focused ? FRAME_INTERVAL_MS : BLURRED_TICK_INTERVAL_MS);
    }, t2 = [clock, focused], $3[0] = clock, $3[1] = focused, $3[2] = t1, $3[3] = t2;
  else
    t1 = $3[2], t2 = $3[3];
  import_react7.useEffect(t1, t2);
  let t3;
  if ($3[4] !== children || $3[5] !== clock)
    t3 = /* @__PURE__ */ jsx_dev_runtime3.jsxDEV(ClockContext.Provider, {
      value: clock,
      children
    }, void 0, !1, void 0, this), $3[4] = children, $3[5] = clock, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
function _temp() {
  return createClock(FRAME_INTERVAL_MS);
}
var import_compiler_runtime3, import_react7, jsx_dev_runtime3, ClockContext, BLURRED_TICK_INTERVAL_MS;
var init_ClockContext = __esm(() => {
  init_use_terminal_focus();
  import_compiler_runtime3 = __toESM(require_react_compiler_runtime_development(), 1), import_react7 = __toESM(require_react_development(), 1), jsx_dev_runtime3 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  ClockContext = import_react7.createContext(null), BLURRED_TICK_INTERVAL_MS = FRAME_INTERVAL_MS * 2;
});
