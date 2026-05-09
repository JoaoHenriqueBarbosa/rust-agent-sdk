// function: loggerFor
function loggerFor(client) {
  let logger = client.logger, logLevel = client.logLevel ?? "off";
  if (!logger)
    return noopLogger;
  let cachedLogger = cachedLoggers.get(logger);
  if (cachedLogger && cachedLogger[0] === logLevel)
    return cachedLogger[1];
  let levelLogger = {
    error: makeLogFn("error", logger, logLevel),
    warn: makeLogFn("warn", logger, logLevel),
    info: makeLogFn("info", logger, logLevel),
    debug: makeLogFn("debug", logger, logLevel)
  };
  return cachedLoggers.set(logger, [logLevel, levelLogger]), levelLogger;
}
