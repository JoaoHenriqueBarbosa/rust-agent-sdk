// Original: src/ink/hooks/use-interval.ts
function useAnimationTimer(intervalMs) {
  let clock = import_react20.useContext(ClockContext), [time3, setTime] = import_react20.useState(() => clock?.now() ?? 0);
  return import_react20.useEffect(() => {
    if (!clock)
      return;
    let lastUpdate = clock.now(), onChange = () => {
      let now2 = clock.now();
      if (now2 - lastUpdate >= intervalMs)
        lastUpdate = now2, setTime(now2);
    };
    return clock.subscribe(onChange, !1);
  }, [clock, intervalMs]), time3;
}
function useInterval2(callback, intervalMs) {
  let callbackRef = import_react20.useRef(callback);
  callbackRef.current = callback;
  let clock = import_react20.useContext(ClockContext);
  import_react20.useEffect(() => {
    if (!clock || intervalMs === null)
      return;
    let lastUpdate = clock.now(), onChange = () => {
      let now2 = clock.now();
      if (now2 - lastUpdate >= intervalMs)
        lastUpdate = now2, callbackRef.current();
    };
    return clock.subscribe(onChange, !1);
  }, [clock, intervalMs]);
}
var import_react20;
var init_use_interval = __esm(() => {
  init_ClockContext();
  import_react20 = __toESM(require_react_development(), 1);
});
