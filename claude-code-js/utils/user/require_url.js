// var: require_url
var require_url = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isUrlIgnored = exports.urlMatches = void 0;
  function urlMatches(url3, urlToMatch) {
    if (typeof urlToMatch === "string")
      return url3 === urlToMatch;
    else
      return !!url3.match(urlToMatch);
  }
  exports.urlMatches = urlMatches;
  function isUrlIgnored(url3, ignoredUrls) {
    if (!ignoredUrls)
      return !1;
    for (let ignoreUrl of ignoredUrls)
      if (urlMatches(url3, ignoreUrl))
        return !0;
    return !1;
  }
  exports.isUrlIgnored = isUrlIgnored;
});
