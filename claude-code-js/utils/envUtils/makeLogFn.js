// function: makeLogFn
function makeLogFn(fnLevel, logger, logLevel) {
  if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel])
    return noop;
  else
    return logger[fnLevel].bind(logger);
}
