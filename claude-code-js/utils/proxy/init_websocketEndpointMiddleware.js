// var: init_websocketEndpointMiddleware
var init_websocketEndpointMiddleware = __esm(() => {
  init_dist_es28();
  websocketEndpointMiddlewareOptions = {
    name: "websocketEndpointMiddleware",
    tags: ["WEBSOCKET", "EVENT_STREAM"],
    relation: "after",
    toMiddleware: "eventStreamHeaderMiddleware",
    override: !0
  };
});
