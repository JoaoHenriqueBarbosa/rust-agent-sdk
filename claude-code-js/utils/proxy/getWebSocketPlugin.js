// var: getWebSocketPlugin
var getWebSocketPlugin = (config4, options) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(websocketEndpointMiddleware(config4, options), websocketEndpointMiddlewareOptions), clientStack.add(injectSessionIdMiddleware(), injectSessionIdMiddlewareOptions);
  }
});
