// var: require_form_data
var require_form_data = __commonJS((exports, module) => {
  var CombinedStream = require_combined_stream(), util = __require("util"), path9 = __require("path"), http = __require("http"), https = __require("https"), parseUrl = __require("url").parse, fs2 = __require("fs"), Stream2 = __require("stream").Stream, crypto2 = __require("crypto"), mime = require_mime_types(), asynckit = require_asynckit(), setToStringTag = require_es_set_tostringtag(), hasOwn2 = require_hasown(), populate = require_populate();
  function FormData2(options) {
    if (!(this instanceof FormData2))
      return new FormData2(options);
    this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], CombinedStream.call(this), options = options || {};
    for (var option in options)
      this[option] = options[option];
  }
  util.inherits(FormData2, CombinedStream);
  FormData2.LINE_BREAK = `\r
`;
  FormData2.DEFAULT_CONTENT_TYPE = "application/octet-stream";
  FormData2.prototype.append = function(field, value, options) {
    if (options = options || {}, typeof options === "string")
      options = { filename: options };
    var append = CombinedStream.prototype.append.bind(this);
    if (typeof value === "number" || value == null)
      value = String(value);
    if (Array.isArray(value)) {
      this._error(Error("Arrays are not supported."));
      return;
    }
    var header = this._multiPartHeader(field, value, options), footer = this._multiPartFooter();
    append(header), append(value), append(footer), this._trackLength(header, value, options);
  };
  FormData2.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;
    if (options.knownLength != null)
      valueLength += Number(options.knownLength);
    else if (Buffer.isBuffer(value))
      valueLength = value.length;
    else if (typeof value === "string")
      valueLength = Buffer.byteLength(value);
    if (this._valueLength += valueLength, this._overheadLength += Buffer.byteLength(header) + FormData2.LINE_BREAK.length, !value || !value.path && !(value.readable && hasOwn2(value, "httpVersion")) && !(value instanceof Stream2))
      return;
    if (!options.knownLength)
      this._valuesToMeasure.push(value);
  };
  FormData2.prototype._lengthRetriever = function(value, callback) {
    if (hasOwn2(value, "fd"))
      if (value.end != null && value.end != 1 / 0 && value.start != null)
        callback(null, value.end + 1 - (value.start ? value.start : 0));
      else
        fs2.stat(value.path, function(err, stat5) {
          if (err) {
            callback(err);
            return;
          }
          var fileSize = stat5.size - (value.start ? value.start : 0);
          callback(null, fileSize);
        });
    else if (hasOwn2(value, "httpVersion"))
      callback(null, Number(value.headers["content-length"]));
    else if (hasOwn2(value, "httpModule"))
      value.on("response", function(response) {
        value.pause(), callback(null, Number(response.headers["content-length"]));
      }), value.resume();
    else
      callback("Unknown stream");
  };
  FormData2.prototype._multiPartHeader = function(field, value, options) {
    if (typeof options.header === "string")
      return options.header;
    var contentDisposition = this._getContentDisposition(value, options), contentType = this._getContentType(value, options), contents = "", headers = {
      "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
      "Content-Type": [].concat(contentType || [])
    };
    if (typeof options.header === "object")
      populate(headers, options.header);
    var header;
    for (var prop in headers)
      if (hasOwn2(headers, prop)) {
        if (header = headers[prop], header == null)
          continue;
        if (!Array.isArray(header))
          header = [header];
        if (header.length)
          contents += prop + ": " + header.join("; ") + FormData2.LINE_BREAK;
      }
    return "--" + this.getBoundary() + FormData2.LINE_BREAK + contents + FormData2.LINE_BREAK;
  };
  FormData2.prototype._getContentDisposition = function(value, options) {
    var filename;
    if (typeof options.filepath === "string")
      filename = path9.normalize(options.filepath).replace(/\\/g, "/");
    else if (options.filename || value && (value.name || value.path))
      filename = path9.basename(options.filename || value && (value.name || value.path));
    else if (value && value.readable && hasOwn2(value, "httpVersion"))
      filename = path9.basename(value.client._httpMessage.path || "");
    if (filename)
      return 'filename="' + filename + '"';
  };
  FormData2.prototype._getContentType = function(value, options) {
    var contentType = options.contentType;
    if (!contentType && value && value.name)
      contentType = mime.lookup(value.name);
    if (!contentType && value && value.path)
      contentType = mime.lookup(value.path);
    if (!contentType && value && value.readable && hasOwn2(value, "httpVersion"))
      contentType = value.headers["content-type"];
    if (!contentType && (options.filepath || options.filename))
      contentType = mime.lookup(options.filepath || options.filename);
    if (!contentType && value && typeof value === "object")
      contentType = FormData2.DEFAULT_CONTENT_TYPE;
    return contentType;
  };
  FormData2.prototype._multiPartFooter = function() {
    return function(next) {
      var footer = FormData2.LINE_BREAK, lastPart = this._streams.length === 0;
      if (lastPart)
        footer += this._lastBoundary();
      next(footer);
    }.bind(this);
  };
  FormData2.prototype._lastBoundary = function() {
    return "--" + this.getBoundary() + "--" + FormData2.LINE_BREAK;
  };
  FormData2.prototype.getHeaders = function(userHeaders) {
    var header, formHeaders = {
      "content-type": "multipart/form-data; boundary=" + this.getBoundary()
    };
    for (header in userHeaders)
      if (hasOwn2(userHeaders, header))
        formHeaders[header.toLowerCase()] = userHeaders[header];
    return formHeaders;
  };
  FormData2.prototype.setBoundary = function(boundary) {
    if (typeof boundary !== "string")
      throw TypeError("FormData boundary must be a string");
    this._boundary = boundary;
  };
  FormData2.prototype.getBoundary = function() {
    if (!this._boundary)
      this._generateBoundary();
    return this._boundary;
  };
  FormData2.prototype.getBuffer = function() {
    var dataBuffer = new Buffer.alloc(0), boundary = this.getBoundary();
    for (var i2 = 0, len = this._streams.length;i2 < len; i2++)
      if (typeof this._streams[i2] !== "function") {
        if (Buffer.isBuffer(this._streams[i2]))
          dataBuffer = Buffer.concat([dataBuffer, this._streams[i2]]);
        else
          dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i2])]);
        if (typeof this._streams[i2] !== "string" || this._streams[i2].substring(2, boundary.length + 2) !== boundary)
          dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData2.LINE_BREAK)]);
      }
    return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
  };
  FormData2.prototype._generateBoundary = function() {
    this._boundary = "--------------------------" + crypto2.randomBytes(12).toString("hex");
  };
  FormData2.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length)
      knownLength += this._lastBoundary().length;
    if (!this.hasKnownLength())
      this._error(Error("Cannot calculate proper length in synchronous way."));
    return knownLength;
  };
  FormData2.prototype.hasKnownLength = function() {
    var hasKnownLength = !0;
    if (this._valuesToMeasure.length)
      hasKnownLength = !1;
    return hasKnownLength;
  };
  FormData2.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length)
      knownLength += this._lastBoundary().length;
    if (!this._valuesToMeasure.length) {
      process.nextTick(cb.bind(this, null, knownLength));
      return;
    }
    asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
      if (err) {
        cb(err);
        return;
      }
      values.forEach(function(length) {
        knownLength += length;
      }), cb(null, knownLength);
    });
  };
  FormData2.prototype.submit = function(params, cb) {
    var request, options, defaults = { method: "post" };
    if (typeof params === "string")
      params = parseUrl(params), options = populate({
        port: params.port,
        path: params.pathname,
        host: params.hostname,
        protocol: params.protocol
      }, defaults);
    else if (options = populate(params, defaults), !options.port)
      options.port = options.protocol === "https:" ? 443 : 80;
    if (options.headers = this.getHeaders(params.headers), options.protocol === "https:")
      request = https.request(options);
    else
      request = http.request(options);
    return this.getLength(function(err, length) {
      if (err && err !== "Unknown stream") {
        this._error(err);
        return;
      }
      if (length)
        request.setHeader("Content-Length", length);
      if (this.pipe(request), cb) {
        var onResponse, callback = function(error41, responce) {
          return request.removeListener("error", callback), request.removeListener("response", onResponse), cb.call(this, error41, responce);
        };
        onResponse = callback.bind(this, null), request.on("error", callback), request.on("response", onResponse);
      }
    }.bind(this)), request;
  };
  FormData2.prototype._error = function(err) {
    if (!this.error)
      this.error = err, this.pause(), this.emit("error", err);
  };
  FormData2.prototype.toString = function() {
    return "[object FormData]";
  };
  setToStringTag(FormData2.prototype, "FormData");
  module.exports = FormData2;
});
