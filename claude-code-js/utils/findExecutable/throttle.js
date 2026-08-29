// function: throttle
function throttle(fn, freq) {
  let timestamp = 0, threshold = 1000 / freq, lastArgs, timer, invoke = (args, now = Date.now()) => {
    if (timestamp = now, lastArgs = null, timer)
      clearTimeout(timer), timer = null;
    fn(...args);
  };
  return [(...args) => {
    let now = Date.now(), passed = now - timestamp;
    if (passed >= threshold)
      invoke(args, now);
    else if (lastArgs = args, !timer)
      timer = setTimeout(() => {
        timer = null, invoke(lastArgs);
      }, threshold - passed);
  }, () => lastArgs && invoke(lastArgs)];
}
