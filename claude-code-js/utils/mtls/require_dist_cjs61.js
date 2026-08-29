// var: require_dist_cjs61
var require_dist_cjs61 = __commonJS((exports) => {
  var protocolHttp = require_dist_cjs60(), CONTENT_LENGTH_HEADER = "content-length";
  function contentLengthMiddleware(bodyLengthChecker) {
    return (next) => async (args) => {
      let request2 = args.request;
      if (protocolHttp.HttpRequest.isInstance(request2)) {
        let { body, headers } = request2;
        if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1)
          try {
            let length = bodyLengthChecker(body);
            request2.headers = {
              ...request2.headers,
              [CONTENT_LENGTH_HEADER]: String(length)
            };
          } catch (error41) {}
      }
      return next({
        ...args,
        request: request2
      });
    };
  }
  var contentLengthMiddlewareOptions = {
    step: "build",
    tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
    name: "contentLengthMiddleware",
    override: !0
  }, getContentLengthPlugin = (options) => ({
    applyToStack: (clientStack) => {
      clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
    }
  });
  exports.contentLengthMiddleware = contentLengthMiddleware;
  exports.contentLengthMiddlewareOptions = contentLengthMiddlewareOptions;
  exports.getContentLengthPlugin = getContentLengthPlugin;
});
