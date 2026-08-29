// function: AnimatedTerminalTitle
function AnimatedTerminalTitle(t0) {
  let $3 = import_compiler_runtime360.c(6), {
    isAnimating,
    title,
    disabled,
    noPrefix
  } = t0, terminalFocused = useTerminalFocus(), [frame, setFrame] = import_react303.useState(0), t1, t2;
  if ($3[0] !== disabled || $3[1] !== isAnimating || $3[2] !== noPrefix || $3[3] !== terminalFocused)
    t1 = () => {
      if (disabled || noPrefix || !isAnimating || !terminalFocused)
        return;
      let interval = setInterval(_temp298, TITLE_ANIMATION_INTERVAL_MS, setFrame);
      return () => clearInterval(interval);
    }, t2 = [disabled, noPrefix, isAnimating, terminalFocused], $3[0] = disabled, $3[1] = isAnimating, $3[2] = noPrefix, $3[3] = terminalFocused, $3[4] = t1, $3[5] = t2;
  else
    t1 = $3[4], t2 = $3[5];
  import_react303.useEffect(t1, t2);
  let prefix = isAnimating ? TITLE_ANIMATION_FRAMES[frame] ?? TITLE_STATIC_PREFIX : TITLE_STATIC_PREFIX;
  return useTerminalTitle(disabled ? null : noPrefix ? title : `${prefix} ${title}`), null;
}
