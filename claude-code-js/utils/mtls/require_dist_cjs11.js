// var: require_dist_cjs11
var require_dist_cjs11 = __commonJS((exports) => {
  var querystringParser = require_dist_cjs10(), parseUrl2 = (url3) => {
    if (typeof url3 === "string")
      return parseUrl2(new URL(url3));
    let { hostname: hostname2, pathname, port, protocol, search } = url3, query;
    if (search)
      query = querystringParser.parseQueryString(search);
    return {
      hostname: hostname2,
      port: port ? parseInt(port) : void 0,
      protocol,
      path: pathname,
      query
    };
  };
  exports.parseUrl = parseUrl2;
});
