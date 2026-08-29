// var: getEventStreamPlugin
var getEventStreamPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(eventStreamHandlingMiddleware(options), eventStreamHandlingMiddlewareOptions), clientStack.add(eventStreamHeaderMiddleware, eventStreamHeaderMiddlewareOptions);
  }
});
