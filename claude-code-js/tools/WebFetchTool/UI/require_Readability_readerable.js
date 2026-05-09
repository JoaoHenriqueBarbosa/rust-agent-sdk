// var: require_Readability_readerable
var require_Readability_readerable = __commonJS((exports, module) => {
  var REGEXPS = {
    unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
    okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i
  };
  function isNodeVisible(node) {
    return (!node.style || node.style.display != "none") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.includes && node.className.includes("fallback-image"));
  }
  function isProbablyReaderable(doc2, options2 = {}) {
    if (typeof options2 == "function")
      options2 = { visibilityChecker: options2 };
    var defaultOptions2 = {
      minScore: 20,
      minContentLength: 140,
      visibilityChecker: isNodeVisible
    };
    options2 = Object.assign(defaultOptions2, options2);
    var nodes = doc2.querySelectorAll("p, pre, article"), brNodes = doc2.querySelectorAll("div > br");
    if (brNodes.length) {
      var set3 = new Set(nodes);
      [].forEach.call(brNodes, function(node) {
        set3.add(node.parentNode);
      }), nodes = Array.from(set3);
    }
    var score = 0;
    return [].some.call(nodes, function(node) {
      if (!options2.visibilityChecker(node))
        return !1;
      var matchString = node.className + " " + node.id;
      if (REGEXPS.unlikelyCandidates.test(matchString) && !REGEXPS.okMaybeItsACandidate.test(matchString))
        return !1;
      if (node.matches("li p"))
        return !1;
      var textContentLength = node.textContent.trim().length;
      if (textContentLength < options2.minContentLength)
        return !1;
      if (score += Math.sqrt(textContentLength - options2.minContentLength), score > options2.minScore)
        return !0;
      return !1;
    });
  }
  if (typeof module === "object")
    module.exports = isProbablyReaderable;
});
