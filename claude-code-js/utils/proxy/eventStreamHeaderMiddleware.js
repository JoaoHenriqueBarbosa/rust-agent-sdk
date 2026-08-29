// var: eventStreamHeaderMiddleware
var eventStreamHeaderMiddleware = (next) => async (args) => {
  let { request: request2 } = args;
  if (!HttpRequest3.isInstance(request2))
    return next(args);
  return request2.headers = {
    ...request2.headers,
    "content-type": "application/vnd.amazon.eventstream",
    "x-amz-content-sha256": "STREAMING-AWS4-HMAC-SHA256-EVENTS"
  }, next({
    ...args,
    request: request2
  });
}, eventStreamHeaderMiddlewareOptions;
