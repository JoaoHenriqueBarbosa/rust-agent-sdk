// var: require_endpoints
var require_endpoints = __commonJS((exports) => {
  var urlParser = require_dist_cjs11(), toEndpointV1 = (endpoint2) => {
    if (typeof endpoint2 === "object") {
      if ("url" in endpoint2) {
        let v1Endpoint = urlParser.parseUrl(endpoint2.url);
        if (endpoint2.headers) {
          v1Endpoint.headers = {};
          for (let [name, values] of Object.entries(endpoint2.headers))
            v1Endpoint.headers[name.toLowerCase()] = values.join(", ");
        }
        return v1Endpoint;
      }
      return endpoint2;
    }
    return urlParser.parseUrl(endpoint2);
  };
  exports.toEndpointV1 = toEndpointV1;
});
