// function: loggerFor2
function loggerFor2(client12) {
  let logger8 = client12.logger, logLevel = client12.logLevel ?? "off";
  if (!logger8)
    return noopLogger2;
  let cachedLogger = cachedLoggers2.get(logger8);
  if (cachedLogger && cachedLogger[0] === logLevel)
    return cachedLogger[1];
  let levelLogger = {
    error: makeLogFn2("error", logger8, logLevel),
    warn: makeLogFn2("warn", logger8, logLevel),
    info: makeLogFn2("info", logger8, logLevel),
    debug: makeLogFn2("debug", logger8, logLevel)
  };
  return cachedLoggers2.set(logger8, [logLevel, levelLogger]), levelLogger;
}
