// var: require_mime_types
var require_mime_types = __commonJS((exports) => {
  /*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   */
  var db = require_mime_db(), extname2 = __require("path").extname, EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/, TEXT_TYPE_REGEXP = /^text\//i;
  exports.charset = charset;
  exports.charsets = { lookup: charset };
  exports.contentType = contentType;
  exports.extension = extension;
  exports.extensions = Object.create(null);
  exports.lookup = lookup;
  exports.types = Object.create(null);
  populateMaps(exports.extensions, exports.types);
  function charset(type) {
    if (!type || typeof type !== "string")
      return !1;
    var match = EXTRACT_TYPE_REGEXP.exec(type), mime = match && db[match[1].toLowerCase()];
    if (mime && mime.charset)
      return mime.charset;
    if (match && TEXT_TYPE_REGEXP.test(match[1]))
      return "UTF-8";
    return !1;
  }
  function contentType(str) {
    if (!str || typeof str !== "string")
      return !1;
    var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
    if (!mime)
      return !1;
    if (mime.indexOf("charset") === -1) {
      var charset2 = exports.charset(mime);
      if (charset2)
        mime += "; charset=" + charset2.toLowerCase();
    }
    return mime;
  }
  function extension(type) {
    if (!type || typeof type !== "string")
      return !1;
    var match = EXTRACT_TYPE_REGEXP.exec(type), exts = match && exports.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length)
      return !1;
    return exts[0];
  }
  function lookup(path9) {
    if (!path9 || typeof path9 !== "string")
      return !1;
    var extension2 = extname2("x." + path9).toLowerCase().substr(1);
    if (!extension2)
      return !1;
    return exports.types[extension2] || !1;
  }
  function populateMaps(extensions, types) {
    var preference = ["nginx", "apache", void 0, "iana"];
    Object.keys(db).forEach(function(type) {
      var mime = db[type], exts = mime.extensions;
      if (!exts || !exts.length)
        return;
      extensions[type] = exts;
      for (var i2 = 0;i2 < exts.length; i2++) {
        var extension2 = exts[i2];
        if (types[extension2]) {
          var from = preference.indexOf(db[types[extension2]].source), to = preference.indexOf(mime.source);
          if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/"))
            continue;
        }
        types[extension2] = type;
      }
    });
  }
});
