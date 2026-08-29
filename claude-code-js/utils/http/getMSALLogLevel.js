// function: getMSALLogLevel
function getMSALLogLevel(logLevel) {
  switch (logLevel) {
    case "error":
      return exports_dist.LogLevel.Error;
    case "info":
      return exports_dist.LogLevel.Info;
    case "verbose":
      return exports_dist.LogLevel.Verbose;
    case "warning":
      return exports_dist.LogLevel.Warning;
    default:
      return exports_dist.LogLevel.Info;
  }
}
