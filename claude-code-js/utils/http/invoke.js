// var: invoke
var invoke = (callback, eventName, logger10, telemetryClient, correlationId) => {
  return (...args) => {
    logger10.trace(`Executing function '${eventName}'`, correlationId);
    let inProgressEvent = telemetryClient.startMeasurement(eventName, correlationId);
    if (correlationId)
      telemetryClient.incrementFields({ [`ext.${eventName}CallCount`]: 1 }, correlationId);
    try {
      let result = callback(...args);
      return inProgressEvent.end({
        success: !0
      }), logger10.trace(`Returning result from '${eventName}'`, correlationId), result;
    } catch (e) {
      logger10.trace(`Error occurred in '${eventName}'`, correlationId);
      try {
        logger10.trace(JSON.stringify(e), correlationId);
      } catch (e2) {
        logger10.trace("Unable to print error message.", correlationId);
      }
      throw inProgressEvent.end({
        success: !1
      }, e), e;
    }
  };
}, invokeAsync = (callback, eventName, logger10, telemetryClient, correlationId) => {
  return (...args) => {
    logger10.trace(`Executing function '${eventName}'`, correlationId);
    let inProgressEvent = telemetryClient.startMeasurement(eventName, correlationId);
    if (correlationId)
      telemetryClient.incrementFields({ [`ext.${eventName}CallCount`]: 1 }, correlationId);
    return callback(...args).then((response7) => {
      return logger10.trace(`Returning result from '${eventName}'`, correlationId), inProgressEvent.end({
        success: !0
      }), response7;
    }).catch((e) => {
      logger10.trace(`Error occurred in '${eventName}'`, correlationId);
      try {
        logger10.trace(JSON.stringify(e), correlationId);
      } catch (e2) {
        logger10.trace("Unable to print error message.", correlationId);
      }
      throw inProgressEvent.end({
        success: !1
      }, e), e;
    });
  };
};
