// var: require_follow_redirects
var require_follow_redirects = __commonJS((exports, module) => {
  var url3 = __require("url"), URL2 = url3.URL, http = __require("http"), https = __require("https"), Writable4 = __require("stream").Writable, assert2 = __require("assert"), debug = require_debug();
  (function() {
    var looksLikeNode = typeof process < "u", looksLikeBrowser = typeof window < "u" && typeof document < "u", looksLikeV8 = isFunction3(Error.captureStackTrace);
    if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8))
      console.warn("The follow-redirects package should be excluded from browser builds.");
  })();
  var useNativeURL = !1;
  try {
    assert2(new URL2(""));
  } catch (error41) {
    useNativeURL = error41.code === "ERR_INVALID_URL";
  }
  var preservedUrlFields = [
    "auth",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "hash"
  ], events = ["abort", "aborted", "connect", "error", "socket", "timeout"], eventHandlers = Object.create(null);
  events.forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });
  var InvalidUrlError = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError), RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed"), TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded", RedirectionError), MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit"), WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end"), destroy = Writable4.prototype.destroy || noop6;
  function RedirectableRequest(options, responseCallback) {
    if (Writable4.call(this), this._sanitizeOptions(options), this._options = options, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], responseCallback)
      this.on("response", responseCallback);
    var self2 = this;
    this._onNativeResponse = function(response) {
      try {
        self2._processResponse(response);
      } catch (cause) {
        self2.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
      }
    }, this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable4.prototype);
  RedirectableRequest.prototype.abort = function() {
    destroyRequest(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
  };
  RedirectableRequest.prototype.destroy = function(error41) {
    return destroyRequest(this._currentRequest, error41), destroy.call(this, error41), this;
  };
  RedirectableRequest.prototype.write = function(data, encoding, callback) {
    if (this._ending)
      throw new WriteAfterEndError;
    if (!isString2(data) && !isBuffer3(data))
      throw TypeError("data should be a string, Buffer or Uint8Array");
    if (isFunction3(encoding))
      callback = encoding, encoding = null;
    if (data.length === 0) {
      if (callback)
        callback();
      return;
    }
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength)
      this._requestBodyLength += data.length, this._requestBodyBuffers.push({ data, encoding }), this._currentRequest.write(data, encoding, callback);
    else
      this.emit("error", new MaxBodyLengthExceededError), this.abort();
  };
  RedirectableRequest.prototype.end = function(data, encoding, callback) {
    if (isFunction3(data))
      callback = data, data = encoding = null;
    else if (isFunction3(encoding))
      callback = encoding, encoding = null;
    if (!data)
      this._ended = this._ending = !0, this._currentRequest.end(null, null, callback);
    else {
      var self2 = this, currentRequest = this._currentRequest;
      this.write(data, encoding, function() {
        self2._ended = !0, currentRequest.end(null, null, callback);
      }), this._ending = !0;
    }
  };
  RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value, this._currentRequest.setHeader(name, value);
  };
  RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name], this._currentRequest.removeHeader(name);
  };
  RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    var self2 = this;
    function destroyOnTimeout(socket) {
      socket.setTimeout(msecs), socket.removeListener("timeout", socket.destroy), socket.addListener("timeout", socket.destroy);
    }
    function startTimer(socket) {
      if (self2._timeout)
        clearTimeout(self2._timeout);
      self2._timeout = setTimeout(function() {
        self2.emit("timeout"), clearTimer();
      }, msecs), destroyOnTimeout(socket);
    }
    function clearTimer() {
      if (self2._timeout)
        clearTimeout(self2._timeout), self2._timeout = null;
      if (self2.removeListener("abort", clearTimer), self2.removeListener("error", clearTimer), self2.removeListener("response", clearTimer), self2.removeListener("close", clearTimer), callback)
        self2.removeListener("timeout", callback);
      if (!self2.socket)
        self2._currentRequest.removeListener("socket", startTimer);
    }
    if (callback)
      this.on("timeout", callback);
    if (this.socket)
      startTimer(this.socket);
    else
      this._currentRequest.once("socket", startTimer);
    return this.on("socket", destroyOnTimeout), this.on("abort", clearTimer), this.on("error", clearTimer), this.on("response", clearTimer), this.on("close", clearTimer), this;
  };
  [
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
  ].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a2, b) {
      return this._currentRequest[method](a2, b);
    };
  });
  ["aborted", "connection", "socket"].forEach(function(property2) {
    Object.defineProperty(RedirectableRequest.prototype, property2, {
      get: function() {
        return this._currentRequest[property2];
      }
    });
  });
  RedirectableRequest.prototype._sanitizeOptions = function(options) {
    if (!options.headers)
      options.headers = {};
    if (options.host) {
      if (!options.hostname)
        options.hostname = options.host;
      delete options.host;
    }
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0)
        options.pathname = options.path;
      else
        options.pathname = options.path.substring(0, searchPos), options.search = options.path.substring(searchPos);
    }
  };
  RedirectableRequest.prototype._performRequest = function() {
    var protocol = this._options.protocol, nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol)
      throw TypeError("Unsupported protocol " + protocol);
    if (this._options.agents) {
      var scheme = protocol.slice(0, -1);
      this._options.agent = this._options.agents[scheme];
    }
    var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events)
      request.on(event, eventHandlers[event]);
    if (this._currentUrl = /^\//.test(this._options.path) ? url3.format(this._options) : this._options.path, this._isRedirect) {
      var i2 = 0, self2 = this, buffers = this._requestBodyBuffers;
      (function writeNext(error41) {
        if (request === self2._currentRequest) {
          if (error41)
            self2.emit("error", error41);
          else if (i2 < buffers.length) {
            var buffer = buffers[i2++];
            if (!request.finished)
              request.write(buffer.data, buffer.encoding, writeNext);
          } else if (self2._ended)
            request.end();
        }
      })();
    }
  };
  RedirectableRequest.prototype._processResponse = function(response) {
    var statusCode = response.statusCode;
    if (this._options.trackRedirects)
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode
      });
    var location = response.headers.location;
    if (!location || this._options.followRedirects === !1 || statusCode < 300 || statusCode >= 400) {
      response.responseUrl = this._currentUrl, response.redirects = this._redirects, this.emit("response", response), this._requestBodyBuffers = [];
      return;
    }
    if (destroyRequest(this._currentRequest), response.destroy(), ++this._redirectCount > this._options.maxRedirects)
      throw new TooManyRedirectsError;
    var requestHeaders, beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect)
      requestHeaders = Object.assign({
        Host: response.req.getHeader("host")
      }, this._options.headers);
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method))
      this._options.method = "GET", this._requestBodyBuffers = [], removeMatchingHeaders(/^content-/i, this._options.headers);
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers), currentUrlParts = parseUrl2(this._currentUrl), currentHost = currentHostHeader || currentUrlParts.host, currentUrl = /^\w+:/.test(location) ? this._currentUrl : url3.format(Object.assign(currentUrlParts, { host: currentHost })), redirectUrl = resolveUrl(location, currentUrl);
    if (debug("redirecting to", redirectUrl.href), this._isRedirect = !0, spreadUrlObject(redirectUrl, this._options), redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost))
      removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
    if (isFunction3(beforeRedirect)) {
      var responseDetails = {
        headers: response.headers,
        statusCode
      }, requestDetails = {
        url: currentUrl,
        method,
        headers: requestHeaders
      };
      beforeRedirect(this._options, responseDetails, requestDetails), this._sanitizeOptions(this._options);
    }
    this._performRequest();
  };
  function wrap(protocols) {
    var exports2 = {
      maxRedirects: 21,
      maxBodyLength: 10485760
    }, nativeProtocols = {};
    return Object.keys(protocols).forEach(function(scheme) {
      var protocol = scheme + ":", nativeProtocol = nativeProtocols[protocol] = protocols[scheme], wrappedProtocol = exports2[scheme] = Object.create(nativeProtocol);
      function request(input, options, callback) {
        if (isURL(input))
          input = spreadUrlObject(input);
        else if (isString2(input))
          input = spreadUrlObject(parseUrl2(input));
        else
          callback = options, options = validateUrl(input), input = { protocol };
        if (isFunction3(options))
          callback = options, options = null;
        if (options = Object.assign({
          maxRedirects: exports2.maxRedirects,
          maxBodyLength: exports2.maxBodyLength
        }, input, options), options.nativeProtocols = nativeProtocols, !isString2(options.host) && !isString2(options.hostname))
          options.hostname = "::1";
        return assert2.equal(options.protocol, protocol, "protocol mismatch"), debug("options", options), new RedirectableRequest(options, callback);
      }
      function get2(input, options, callback) {
        var wrappedRequest = wrappedProtocol.request(input, options, callback);
        return wrappedRequest.end(), wrappedRequest;
      }
      Object.defineProperties(wrappedProtocol, {
        request: { value: request, configurable: !0, enumerable: !0, writable: !0 },
        get: { value: get2, configurable: !0, enumerable: !0, writable: !0 }
      });
    }), exports2;
  }
  function noop6() {}
  function parseUrl2(input) {
    var parsed;
    if (useNativeURL)
      parsed = new URL2(input);
    else if (parsed = validateUrl(url3.parse(input)), !isString2(parsed.protocol))
      throw new InvalidUrlError({ input });
    return parsed;
  }
  function resolveUrl(relative3, base2) {
    return useNativeURL ? new URL2(relative3, base2) : parseUrl2(url3.resolve(base2, relative3));
  }
  function validateUrl(input) {
    if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname))
      throw new InvalidUrlError({ input: input.href || input });
    if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host))
      throw new InvalidUrlError({ input: input.href || input });
    return input;
  }
  function spreadUrlObject(urlObject, target) {
    var spread = target || {};
    for (var key of preservedUrlFields)
      spread[key] = urlObject[key];
    if (spread.hostname.startsWith("["))
      spread.hostname = spread.hostname.slice(1, -1);
    if (spread.port !== "")
      spread.port = Number(spread.port);
    return spread.path = spread.search ? spread.pathname + spread.search : spread.pathname, spread;
  }
  function removeMatchingHeaders(regex2, headers) {
    var lastValue;
    for (var header in headers)
      if (regex2.test(header))
        lastValue = headers[header], delete headers[header];
    return lastValue === null || typeof lastValue > "u" ? void 0 : String(lastValue).trim();
  }
  function createErrorType(code, message, baseClass) {
    function CustomError(properties) {
      if (isFunction3(Error.captureStackTrace))
        Error.captureStackTrace(this, this.constructor);
      Object.assign(this, properties || {}), this.code = code, this.message = this.cause ? message + ": " + this.cause.message : message;
    }
    return CustomError.prototype = new (baseClass || Error), Object.defineProperties(CustomError.prototype, {
      constructor: {
        value: CustomError,
        enumerable: !1
      },
      name: {
        value: "Error [" + code + "]",
        enumerable: !1
      }
    }), CustomError;
  }
  function destroyRequest(request, error41) {
    for (var event of events)
      request.removeListener(event, eventHandlers[event]);
    request.on("error", noop6), request.destroy(error41);
  }
  function isSubdomain(subdomain, domain2) {
    assert2(isString2(subdomain) && isString2(domain2));
    var dot = subdomain.length - domain2.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain2);
  }
  function isString2(value) {
    return typeof value === "string" || value instanceof String;
  }
  function isFunction3(value) {
    return typeof value === "function";
  }
  function isBuffer3(value) {
    return typeof value === "object" && "length" in value;
  }
  function isURL(value) {
    return URL2 && value instanceof URL2;
  }
  module.exports = wrap({ http, https });
  module.exports.wrap = wrap;
});
