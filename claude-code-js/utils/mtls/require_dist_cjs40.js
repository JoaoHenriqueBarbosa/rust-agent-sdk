// var: require_dist_cjs40
var require_dist_cjs40 = __commonJS((exports) => {
  var escapeUri = (uri2) => encodeURIComponent(uri2).replace(/[!'()*]/g, hexEncode), hexEncode = (c3) => `%${c3.charCodeAt(0).toString(16).toUpperCase()}`, escapeUriPath = (uri2) => uri2.split("/").map(escapeUri).join("/");
  exports.escapeUri = escapeUri;
  exports.escapeUriPath = escapeUriPath;
});
