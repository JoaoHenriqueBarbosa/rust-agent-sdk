// var: eventStreamHandlingMiddleware
var eventStreamHandlingMiddleware = (options) => (next, context) => async (args) => {
  let { request: request2 } = args;
  if (!HttpRequest3.isInstance(request2))
    return next(args);
  return options.eventStreamPayloadHandler.handle(next, args, context);
}, eventStreamHandlingMiddlewareOptions;
