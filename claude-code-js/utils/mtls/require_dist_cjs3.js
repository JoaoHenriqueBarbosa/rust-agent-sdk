// var: require_dist_cjs3
var require_dist_cjs3 = __commonJS((exports) => {
  var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode), hexEncode = (c3) => `%${c3.charCodeAt(0).toString(16).toUpperCase()}`, escapeUriPath = (uri) => uri.split("/").map(escapeUri).join("/");
  exports.escapeUri = escapeUri;
  exports.escapeUriPath = escapeUriPath;
});
