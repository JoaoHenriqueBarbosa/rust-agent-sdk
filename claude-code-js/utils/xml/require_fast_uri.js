// var: require_fast_uri
var require_fast_uri = __commonJS((exports, module) => {
  var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizeComponentEncoding, isIPv4, nonSimpleDomain } = require_utils4(), { SCHEMES, getSchemeHandler } = require_schemes();
  function normalize10(uri7, options2) {
    if (typeof uri7 === "string")
      uri7 = serialize2(parse11(uri7, options2), options2);
    else if (typeof uri7 === "object")
      uri7 = parse11(serialize2(uri7, options2), options2);
    return uri7;
  }
  function resolve24(baseURI, relativeURI, options2) {
    let schemelessOptions = options2 ? Object.assign({ scheme: "null" }, options2) : { scheme: "null" }, resolved = resolveComponent(parse11(baseURI, schemelessOptions), parse11(relativeURI, schemelessOptions), schemelessOptions, !0);
    return schemelessOptions.skipEscape = !0, serialize2(resolved, schemelessOptions);
  }
  function resolveComponent(base2, relative9, options2, skipNormalization) {
    let target = {};
    if (!skipNormalization)
      base2 = parse11(serialize2(base2, options2), options2), relative9 = parse11(serialize2(relative9, options2), options2);
    if (options2 = options2 || {}, !options2.tolerant && relative9.scheme)
      target.scheme = relative9.scheme, target.userinfo = relative9.userinfo, target.host = relative9.host, target.port = relative9.port, target.path = removeDotSegments(relative9.path || ""), target.query = relative9.query;
    else {
      if (relative9.userinfo !== void 0 || relative9.host !== void 0 || relative9.port !== void 0)
        target.userinfo = relative9.userinfo, target.host = relative9.host, target.port = relative9.port, target.path = removeDotSegments(relative9.path || ""), target.query = relative9.query;
      else {
        if (!relative9.path)
          if (target.path = base2.path, relative9.query !== void 0)
            target.query = relative9.query;
          else
            target.query = base2.query;
        else {
          if (relative9.path[0] === "/")
            target.path = removeDotSegments(relative9.path);
          else {
            if ((base2.userinfo !== void 0 || base2.host !== void 0 || base2.port !== void 0) && !base2.path)
              target.path = "/" + relative9.path;
            else if (!base2.path)
              target.path = relative9.path;
            else
              target.path = base2.path.slice(0, base2.path.lastIndexOf("/") + 1) + relative9.path;
            target.path = removeDotSegments(target.path);
          }
          target.query = relative9.query;
        }
        target.userinfo = base2.userinfo, target.host = base2.host, target.port = base2.port;
      }
      target.scheme = base2.scheme;
    }
    return target.fragment = relative9.fragment, target;
  }
  function equal(uriA, uriB, options2) {
    if (typeof uriA === "string")
      uriA = unescape(uriA), uriA = serialize2(normalizeComponentEncoding(parse11(uriA, options2), !0), { ...options2, skipEscape: !0 });
    else if (typeof uriA === "object")
      uriA = serialize2(normalizeComponentEncoding(uriA, !0), { ...options2, skipEscape: !0 });
    if (typeof uriB === "string")
      uriB = unescape(uriB), uriB = serialize2(normalizeComponentEncoding(parse11(uriB, options2), !0), { ...options2, skipEscape: !0 });
    else if (typeof uriB === "object")
      uriB = serialize2(normalizeComponentEncoding(uriB, !0), { ...options2, skipEscape: !0 });
    return uriA.toLowerCase() === uriB.toLowerCase();
  }
  function serialize2(cmpts, opts) {
    let component = {
      host: cmpts.host,
      scheme: cmpts.scheme,
      userinfo: cmpts.userinfo,
      port: cmpts.port,
      path: cmpts.path,
      query: cmpts.query,
      nid: cmpts.nid,
      nss: cmpts.nss,
      uuid: cmpts.uuid,
      fragment: cmpts.fragment,
      reference: cmpts.reference,
      resourceName: cmpts.resourceName,
      secure: cmpts.secure,
      error: ""
    }, options2 = Object.assign({}, opts), uriTokens = [], schemeHandler = getSchemeHandler(options2.scheme || component.scheme);
    if (schemeHandler && schemeHandler.serialize)
      schemeHandler.serialize(component, options2);
    if (component.path !== void 0)
      if (!options2.skipEscape) {
        if (component.path = escape(component.path), component.scheme !== void 0)
          component.path = component.path.split("%3A").join(":");
      } else
        component.path = unescape(component.path);
    if (options2.reference !== "suffix" && component.scheme)
      uriTokens.push(component.scheme, ":");
    let authority = recomposeAuthority(component);
    if (authority !== void 0) {
      if (options2.reference !== "suffix")
        uriTokens.push("//");
      if (uriTokens.push(authority), component.path && component.path[0] !== "/")
        uriTokens.push("/");
    }
    if (component.path !== void 0) {
      let s2 = component.path;
      if (!options2.absolutePath && (!schemeHandler || !schemeHandler.absolutePath))
        s2 = removeDotSegments(s2);
      if (authority === void 0 && s2[0] === "/" && s2[1] === "/")
        s2 = "/%2F" + s2.slice(2);
      uriTokens.push(s2);
    }
    if (component.query !== void 0)
      uriTokens.push("?", component.query);
    if (component.fragment !== void 0)
      uriTokens.push("#", component.fragment);
    return uriTokens.join("");
  }
  var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function parse11(uri7, opts) {
    let options2 = Object.assign({}, opts), parsed = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, isIP3 = !1;
    if (options2.reference === "suffix")
      if (options2.scheme)
        uri7 = options2.scheme + ":" + uri7;
      else
        uri7 = "//" + uri7;
    let matches = uri7.match(URI_PARSE);
    if (matches) {
      if (parsed.scheme = matches[1], parsed.userinfo = matches[3], parsed.host = matches[4], parsed.port = parseInt(matches[5], 10), parsed.path = matches[6] || "", parsed.query = matches[7], parsed.fragment = matches[8], isNaN(parsed.port))
        parsed.port = matches[5];
      if (parsed.host)
        if (isIPv4(parsed.host) === !1) {
          let ipv6result = normalizeIPv6(parsed.host);
          parsed.host = ipv6result.host.toLowerCase(), isIP3 = ipv6result.isIPV6;
        } else
          isIP3 = !0;
      if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path)
        parsed.reference = "same-document";
      else if (parsed.scheme === void 0)
        parsed.reference = "relative";
      else if (parsed.fragment === void 0)
        parsed.reference = "absolute";
      else
        parsed.reference = "uri";
      if (options2.reference && options2.reference !== "suffix" && options2.reference !== parsed.reference)
        parsed.error = parsed.error || "URI is not a " + options2.reference + " reference.";
      let schemeHandler = getSchemeHandler(options2.scheme || parsed.scheme);
      if (!options2.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
        if (parsed.host && (options2.domainHost || schemeHandler && schemeHandler.domainHost) && isIP3 === !1 && nonSimpleDomain(parsed.host))
          try {
            parsed.host = URL.domainToASCII(parsed.host.toLowerCase());
          } catch (e) {
            parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          }
      }
      if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
        if (uri7.indexOf("%") !== -1) {
          if (parsed.scheme !== void 0)
            parsed.scheme = unescape(parsed.scheme);
          if (parsed.host !== void 0)
            parsed.host = unescape(parsed.host);
        }
        if (parsed.path)
          parsed.path = escape(unescape(parsed.path));
        if (parsed.fragment)
          parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
      }
      if (schemeHandler && schemeHandler.parse)
        schemeHandler.parse(parsed, options2);
    } else
      parsed.error = parsed.error || "URI can not be parsed.";
    return parsed;
  }
  var fastUri = {
    SCHEMES,
    normalize: normalize10,
    resolve: resolve24,
    resolveComponent,
    equal,
    serialize: serialize2,
    parse: parse11
  };
  module.exports = fastUri;
  module.exports.default = fastUri;
  module.exports.fastUri = fastUri;
});
