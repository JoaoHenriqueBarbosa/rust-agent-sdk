// function: makeLogFn2
function makeLogFn2(fnLevel, logger8, logLevel) {
  if (!logger8 || levelNumbers2[fnLevel] > levelNumbers2[logLevel])
    return noop6;
  else
    return logger8[fnLevel].bind(logger8);
}
