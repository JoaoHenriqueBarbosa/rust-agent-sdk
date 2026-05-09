// var: require_dist_cjs10
var require_dist_cjs10 = __commonJS((exports) => {
  function parseQueryString(querystring) {
    let query = {};
    if (querystring = querystring.replace(/^\?/, ""), querystring)
      for (let pair of querystring.split("&")) {
        let [key, value = null] = pair.split("=");
        if (key = decodeURIComponent(key), value)
          value = decodeURIComponent(value);
        if (!(key in query))
          query[key] = value;
        else if (Array.isArray(query[key]))
          query[key].push(value);
        else
          query[key] = [query[key], value];
      }
    return query;
  }
  exports.parseQueryString = parseQueryString;
});
