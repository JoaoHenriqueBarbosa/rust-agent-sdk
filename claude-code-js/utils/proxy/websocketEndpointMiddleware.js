// var: websocketEndpointMiddleware
var websocketEndpointMiddleware = (config4, options) => (next) => (args) => {
  let { request: request2 } = args;
  if (HttpRequest4.isInstance(request2) && config4.requestHandler.metadata?.handlerProtocol?.toLowerCase().includes("websocket")) {
    request2.protocol = "wss:", request2.method = "GET", request2.path = `${request2.path}-websocket`;
    let { headers } = request2;
    delete headers["content-type"], delete headers["x-amz-content-sha256"];
    for (let name of Object.keys(headers))
      if (name.indexOf(options.headerPrefix) === 0) {
        let chunkedName = name.replace(options.headerPrefix, "");
        request2.query[chunkedName] = headers[name];
      }
    if (headers["x-amz-user-agent"])
      request2.query["user-agent"] = headers["x-amz-user-agent"];
    request2.headers = { host: headers.host ?? request2.hostname };
  }
  return next(args);
}, websocketEndpointMiddlewareOptions;
