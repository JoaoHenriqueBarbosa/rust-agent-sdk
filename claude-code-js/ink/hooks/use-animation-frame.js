// Original: src/ink/hooks/use-animation-frame.ts
function useAnimationFrame(intervalMs = 16) {
  let clock = import_react16.useContext(ClockContext), [viewportRef, { isVisible }] = useTerminalViewport(), [time3, setTime] = import_react16.useState(() => clock?.now() ?? 0), active = isVisible && intervalMs !== null;
  return import_react16.useEffect(() => {
    if (!clock || !active)
      return;
    let lastUpdate = clock.now(), onChange = () => {
      let now2 = clock.now();
      if (now2 - lastUpdate >= intervalMs)
        lastUpdate = now2, setTime(now2);
    };
    return clock.subscribe(onChange, !0);
  }, [clock, intervalMs, active]), [viewportRef, time3];
}
var import_react16;
var init_use_animation_frame = __esm(() => {
  init_ClockContext();
  init_use_terminal_viewport();
  import_react16 = __toESM(require_react_development(), 1);
});
