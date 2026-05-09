// var: init_eventStreamHandlingMiddleware
var init_eventStreamHandlingMiddleware = __esm(() => {
  init_dist_es22();
  eventStreamHandlingMiddlewareOptions = {
    tags: ["EVENT_STREAM", "SIGNATURE", "HANDLE"],
    name: "eventStreamHandlingMiddleware",
    relation: "after",
    toMiddleware: "awsAuthMiddleware",
    override: !0
  };
});
