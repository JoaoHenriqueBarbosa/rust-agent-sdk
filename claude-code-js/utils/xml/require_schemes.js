// var: require_schemes
var require_schemes = __commonJS((exports, module) => {
  var { isUUID } = require_utils4(), URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, supportedSchemeNames = [
    "http",
    "https",
    "ws",
    "wss",
    "urn",
    "urn:uuid"
  ];
  function isValidSchemeName(name3) {
    return supportedSchemeNames.indexOf(name3) !== -1;
  }
  function wsIsSecure(wsComponent) {
    if (wsComponent.secure === !0)
      return !0;
    else if (wsComponent.secure === !1)
      return !1;
    else if (wsComponent.scheme)
      return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
    else
      return !1;
  }
  function httpParse(component) {
    if (!component.host)
      component.error = component.error || "HTTP URIs must have a host.";
    return component;
  }
  function httpSerialize(component) {
    let secure = String(component.scheme).toLowerCase() === "https";
    if (component.port === (secure ? 443 : 80) || component.port === "")
      component.port = void 0;
    if (!component.path)
      component.path = "/";
    return component;
  }
  function wsParse(wsComponent) {
    return wsComponent.secure = wsIsSecure(wsComponent), wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : ""), wsComponent.path = void 0, wsComponent.query = void 0, wsComponent;
  }
  function wsSerialize(wsComponent) {
    if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "")
      wsComponent.port = void 0;
    if (typeof wsComponent.secure === "boolean")
      wsComponent.scheme = wsComponent.secure ? "wss" : "ws", wsComponent.secure = void 0;
    if (wsComponent.resourceName) {
      let [path16, query] = wsComponent.resourceName.split("?");
      wsComponent.path = path16 && path16 !== "/" ? path16 : void 0, wsComponent.query = query, wsComponent.resourceName = void 0;
    }
    return wsComponent.fragment = void 0, wsComponent;
  }
  function urnParse(urnComponent, options2) {
    if (!urnComponent.path)
      return urnComponent.error = "URN can not be parsed", urnComponent;
    let matches = urnComponent.path.match(URN_REG);
    if (matches) {
      let scheme = options2.scheme || urnComponent.scheme || "urn";
      urnComponent.nid = matches[1].toLowerCase(), urnComponent.nss = matches[2];
      let urnScheme = `${scheme}:${options2.nid || urnComponent.nid}`, schemeHandler = getSchemeHandler(urnScheme);
      if (urnComponent.path = void 0, schemeHandler)
        urnComponent = schemeHandler.parse(urnComponent, options2);
    } else
      urnComponent.error = urnComponent.error || "URN can not be parsed.";
    return urnComponent;
  }
  function urnSerialize(urnComponent, options2) {
    if (urnComponent.nid === void 0)
      throw Error("URN without nid cannot be serialized");
    let scheme = options2.scheme || urnComponent.scheme || "urn", nid = urnComponent.nid.toLowerCase(), urnScheme = `${scheme}:${options2.nid || nid}`, schemeHandler = getSchemeHandler(urnScheme);
    if (schemeHandler)
      urnComponent = schemeHandler.serialize(urnComponent, options2);
    let uriComponent = urnComponent, nss = urnComponent.nss;
    return uriComponent.path = `${nid || options2.nid}:${nss}`, options2.skipEscape = !0, uriComponent;
  }
  function urnuuidParse(urnComponent, options2) {
    let uuidComponent = urnComponent;
    if (uuidComponent.uuid = uuidComponent.nss, uuidComponent.nss = void 0, !options2.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid)))
      uuidComponent.error = uuidComponent.error || "UUID is not valid.";
    return uuidComponent;
  }
  function urnuuidSerialize(uuidComponent) {
    let urnComponent = uuidComponent;
    return urnComponent.nss = (uuidComponent.uuid || "").toLowerCase(), urnComponent;
  }
  var http4 = {
    scheme: "http",
    domainHost: !0,
    parse: httpParse,
    serialize: httpSerialize
  }, https3 = {
    scheme: "https",
    domainHost: http4.domainHost,
    parse: httpParse,
    serialize: httpSerialize
  }, ws = {
    scheme: "ws",
    domainHost: !0,
    parse: wsParse,
    serialize: wsSerialize
  }, wss = {
    scheme: "wss",
    domainHost: ws.domainHost,
    parse: ws.parse,
    serialize: ws.serialize
  }, urn = {
    scheme: "urn",
    parse: urnParse,
    serialize: urnSerialize,
    skipNormalize: !0
  }, urnuuid = {
    scheme: "urn:uuid",
    parse: urnuuidParse,
    serialize: urnuuidSerialize,
    skipNormalize: !0
  }, SCHEMES = {
    http: http4,
    https: https3,
    ws,
    wss,
    urn,
    "urn:uuid": urnuuid
  };
  Object.setPrototypeOf(SCHEMES, null);
  function getSchemeHandler(scheme) {
    return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
  }
  module.exports = {
    wsIsSecure,
    SCHEMES,
    isValidSchemeName,
    getSchemeHandler
  };
});
