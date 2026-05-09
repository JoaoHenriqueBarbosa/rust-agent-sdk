// var: require_dist_cjs44
var require_dist_cjs44 = __commonJS((exports) => {
  var protocolHttp = require_dist_cjs43();
  function resolveHostHeaderConfig(input) {
    return input;
  }
  var hostHeaderMiddleware = (options) => (next) => async (args) => {
    if (!protocolHttp.HttpRequest.isInstance(args.request))
      return next(args);
    let { request: request2 } = args, { handlerProtocol = "" } = options.requestHandler.metadata || {};
    if (handlerProtocol.indexOf("h2") >= 0 && !request2.headers[":authority"])
      delete request2.headers.host, request2.headers[":authority"] = request2.hostname + (request2.port ? ":" + request2.port : "");
    else if (!request2.headers.host) {
      let host = request2.hostname;
      if (request2.port != null)
        host += `:${request2.port}`;
      request2.headers.host = host;
    }
    return next(args);
  }, hostHeaderMiddlewareOptions = {
    name: "hostHeaderMiddleware",
    step: "build",
    priority: "low",
    tags: ["HOST"],
    override: !0
  }, getHostHeaderPlugin = (options) => ({
    applyToStack: (clientStack) => {
      clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
    }
  });
  exports.getHostHeaderPlugin = getHostHeaderPlugin;
  exports.hostHeaderMiddleware = hostHeaderMiddleware;
  exports.hostHeaderMiddlewareOptions = hostHeaderMiddlewareOptions;
  exports.resolveHostHeaderConfig = resolveHostHeaderConfig;
});
