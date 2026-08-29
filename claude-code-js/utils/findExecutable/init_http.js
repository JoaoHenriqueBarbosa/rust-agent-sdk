// var: init_http
var init_http = __esm(() => {
  init_utils();
  init_settle();
  init_buildFullPath();
  init_buildURL();
  init_proxy_from_env();
  init_transitional();
  init_AxiosError();
  init_CanceledError();
  init_platform2();
  init_fromDataURI();
  init_AxiosHeaders();
  init_AxiosTransformStream();
  init_formDataToStream();
  init_readBlob();
  init_ZlibHeaderTransformStream();
  init_callbackify();
  init_progressEventReducer();
  import_follow_redirects = __toESM(require_follow_redirects(), 1), zlibOptions = {
    flush: zlib.constants.Z_SYNC_FLUSH,
    finishFlush: zlib.constants.Z_SYNC_FLUSH
  }, brotliOptions = {
    flush: zlib.constants.BROTLI_OPERATION_FLUSH,
    finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
  }, isBrotliSupported = utils_default.isFunction(zlib.createBrotliDecompress), { http: httpFollow, https: httpsFollow } = import_follow_redirects.default, isHttps = /https:?/, supportedProtocols = platform_default.protocols.map((protocol) => {
    return protocol + ":";
  });
  http2Sessions = new Http2Sessions;
  isHttpAdapterSupported = typeof process < "u" && utils_default.kindOf(process) === "process", http2Transport = {
    request(options, cb) {
      let authority = options.protocol + "//" + options.hostname + ":" + (options.port || (options.protocol === "https:" ? 443 : 80)), { http2Options, headers } = options, session = http2Sessions.getSession(authority, http2Options), { HTTP2_HEADER_SCHEME, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } = http2.constants, http2Headers = {
        [HTTP2_HEADER_SCHEME]: options.protocol.replace(":", ""),
        [HTTP2_HEADER_METHOD]: options.method,
        [HTTP2_HEADER_PATH]: options.path
      };
      utils_default.forEach(headers, (header, name) => {
        name.charAt(0) !== ":" && (http2Headers[name] = header);
      });
      let req = session.request(http2Headers);
      return req.once("response", (responseHeaders) => {
        let response = req;
        responseHeaders = Object.assign({}, responseHeaders);
        let status = responseHeaders[HTTP2_HEADER_STATUS];
        delete responseHeaders[HTTP2_HEADER_STATUS], response.headers = responseHeaders, response.statusCode = +status, cb(response);
      }), req;
    }
  }, http_default = isHttpAdapterSupported && function(config2) {
    return wrapAsync(async function(resolve7, reject, onDone) {
      let { data, lookup, family, httpVersion = 1, http2Options } = config2, { responseType, responseEncoding } = config2, method = config2.method.toUpperCase(), isDone, rejected = !1, req;
      if (httpVersion = +httpVersion, Number.isNaN(httpVersion))
        throw TypeError(`Invalid protocol version: '${config2.httpVersion}' is not a number`);
      if (httpVersion !== 1 && httpVersion !== 2)
        throw TypeError(`Unsupported protocol version '${httpVersion}'`);
      let isHttp2 = httpVersion === 2;
      if (lookup) {
        let _lookup = callbackify_default(lookup, (value) => utils_default.isArray(value) ? value : [value]);
        lookup = (hostname2, opt, cb) => {
          _lookup(hostname2, opt, (err, arg0, arg1) => {
            if (err)
              return cb(err);
            let addresses = utils_default.isArray(arg0) ? arg0.map((addr) => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];
            opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
          });
        };
      }
      let abortEmitter = new EventEmitter2;
      function abort(reason) {
        try {
          abortEmitter.emit("abort", !reason || reason.type ? new CanceledError_default(null, config2, req) : reason);
        } catch (err) {
          console.warn("emit error", err);
        }
      }
      abortEmitter.once("abort", reject);
      let onFinished = () => {
        if (config2.cancelToken)
          config2.cancelToken.unsubscribe(abort);
        if (config2.signal)
          config2.signal.removeEventListener("abort", abort);
        abortEmitter.removeAllListeners();
      };
      if (config2.cancelToken || config2.signal) {
        if (config2.cancelToken && config2.cancelToken.subscribe(abort), config2.signal)
          config2.signal.aborted ? abort() : config2.signal.addEventListener("abort", abort);
      }
      onDone((response, isRejected) => {
        if (isDone = !0, isRejected) {
          rejected = !0, onFinished();
          return;
        }
        let { data: data2 } = response;
        if (data2 instanceof stream3.Readable || data2 instanceof stream3.Duplex) {
          let offListeners = stream3.finished(data2, () => {
            offListeners(), onFinished();
          });
        } else
          onFinished();
      });
      let fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls), parsed = new URL(fullPath, platform_default.hasBrowserEnv ? platform_default.origin : void 0), protocol = parsed.protocol || supportedProtocols[0];
      if (protocol === "data:") {
        if (config2.maxContentLength > -1) {
          let dataUrl = String(config2.url || fullPath || "");
          if (estimateDataURLDecodedBytes(dataUrl) > config2.maxContentLength)
            return reject(new AxiosError_default("maxContentLength size of " + config2.maxContentLength + " exceeded", AxiosError_default.ERR_BAD_RESPONSE, config2));
        }
        let convertedData;
        if (method !== "GET")
          return settle(resolve7, reject, {
            status: 405,
            statusText: "method not allowed",
            headers: {},
            config: config2
          });
        try {
          convertedData = fromDataURI(config2.url, responseType === "blob", {
            Blob: config2.env && config2.env.Blob
          });
        } catch (err) {
          throw AxiosError_default.from(err, AxiosError_default.ERR_BAD_REQUEST, config2);
        }
        if (responseType === "text") {
          if (convertedData = convertedData.toString(responseEncoding), !responseEncoding || responseEncoding === "utf8")
            convertedData = utils_default.stripBOM(convertedData);
        } else if (responseType === "stream")
          convertedData = stream3.Readable.from(convertedData);
        return settle(resolve7, reject, {
          data: convertedData,
          status: 200,
          statusText: "OK",
          headers: new AxiosHeaders_default,
          config: config2
        });
      }
      if (supportedProtocols.indexOf(protocol) === -1)
        return reject(new AxiosError_default("Unsupported protocol " + protocol, AxiosError_default.ERR_BAD_REQUEST, config2));
      let headers = AxiosHeaders_default.from(config2.headers).normalize();
      headers.set("User-Agent", "axios/" + VERSION2, !1);
      let { onUploadProgress, onDownloadProgress } = config2, maxRate = config2.maxRate, maxUploadRate = void 0, maxDownloadRate = void 0;
      if (utils_default.isSpecCompliantForm(data)) {
        let userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
        data = formDataToStream_default(data, (formHeaders) => {
          headers.set(formHeaders);
        }, {
          tag: `axios-${VERSION2}-boundary`,
          boundary: userBoundary && userBoundary[1] || void 0
        });
      } else if (utils_default.isFormData(data) && utils_default.isFunction(data.getHeaders)) {
        if (headers.set(data.getHeaders()), !headers.hasContentLength())
          try {
            let knownLength = await util2.promisify(data.getLength).call(data);
            Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
          } catch (e) {}
      } else if (utils_default.isBlob(data) || utils_default.isFile(data))
        data.size && headers.setContentType(data.type || "application/octet-stream"), headers.setContentLength(data.size || 0), data = stream3.Readable.from(readBlob_default(data));
      else if (data && !utils_default.isStream(data)) {
        if (Buffer.isBuffer(data))
          ;
        else if (utils_default.isArrayBuffer(data))
          data = Buffer.from(new Uint8Array(data));
        else if (utils_default.isString(data))
          data = Buffer.from(data, "utf-8");
        else
          return reject(new AxiosError_default("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", AxiosError_default.ERR_BAD_REQUEST, config2));
        if (headers.setContentLength(data.length, !1), config2.maxBodyLength > -1 && data.length > config2.maxBodyLength)
          return reject(new AxiosError_default("Request body larger than maxBodyLength limit", AxiosError_default.ERR_BAD_REQUEST, config2));
      }
      let contentLength = utils_default.toFiniteNumber(headers.getContentLength());
      if (utils_default.isArray(maxRate))
        maxUploadRate = maxRate[0], maxDownloadRate = maxRate[1];
      else
        maxUploadRate = maxDownloadRate = maxRate;
      if (data && (onUploadProgress || maxUploadRate)) {
        if (!utils_default.isStream(data))
          data = stream3.Readable.from(data, { objectMode: !1 });
        data = stream3.pipeline([
          data,
          new AxiosTransformStream_default({
            maxRate: utils_default.toFiniteNumber(maxUploadRate)
          })
        ], utils_default.noop), onUploadProgress && data.on("progress", flushOnFinish(data, progressEventDecorator(contentLength, progressEventReducer(asyncDecorator(onUploadProgress), !1, 3))));
      }
      let auth = void 0;
      if (config2.auth) {
        let username = config2.auth.username || "", password = config2.auth.password || "";
        auth = username + ":" + password;
      }
      if (!auth && parsed.username) {
        let { username: urlUsername, password: urlPassword } = parsed;
        auth = urlUsername + ":" + urlPassword;
      }
      auth && headers.delete("authorization");
      let path9;
      try {
        path9 = buildURL(parsed.pathname + parsed.search, config2.params, config2.paramsSerializer).replace(/^\?/, "");
      } catch (err) {
        let customErr = Error(err.message);
        return customErr.config = config2, customErr.url = config2.url, customErr.exists = !0, reject(customErr);
      }
      headers.set("Accept-Encoding", "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""), !1);
      let options = {
        path: path9,
        method,
        headers: headers.toJSON(),
        agents: { http: config2.httpAgent, https: config2.httpsAgent },
        auth,
        protocol,
        family,
        beforeRedirect: dispatchBeforeRedirect,
        beforeRedirects: {},
        http2Options
      };
      if (!utils_default.isUndefined(lookup) && (options.lookup = lookup), config2.socketPath)
        options.socketPath = config2.socketPath;
      else
        options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname, options.port = parsed.port, setProxy(options, config2.proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
      let transport, isHttpsRequest = isHttps.test(options.protocol);
      if (options.agent = isHttpsRequest ? config2.httpsAgent : config2.httpAgent, isHttp2)
        transport = http2Transport;
      else if (config2.transport)
        transport = config2.transport;
      else if (config2.maxRedirects === 0)
        transport = isHttpsRequest ? https : http;
      else {
        if (config2.maxRedirects)
          options.maxRedirects = config2.maxRedirects;
        if (config2.beforeRedirect)
          options.beforeRedirects.config = config2.beforeRedirect;
        transport = isHttpsRequest ? httpsFollow : httpFollow;
      }
      if (config2.maxBodyLength > -1)
        options.maxBodyLength = config2.maxBodyLength;
      else
        options.maxBodyLength = 1 / 0;
      if (config2.insecureHTTPParser)
        options.insecureHTTPParser = config2.insecureHTTPParser;
      if (req = transport.request(options, function(res) {
        if (req.destroyed)
          return;
        let streams = [res], responseLength = utils_default.toFiniteNumber(res.headers["content-length"]);
        if (onDownloadProgress || maxDownloadRate) {
          let transformStream = new AxiosTransformStream_default({
            maxRate: utils_default.toFiniteNumber(maxDownloadRate)
          });
          onDownloadProgress && transformStream.on("progress", flushOnFinish(transformStream, progressEventDecorator(responseLength, progressEventReducer(asyncDecorator(onDownloadProgress), !0, 3)))), streams.push(transformStream);
        }
        let responseStream = res, lastRequest = res.req || req;
        if (config2.decompress !== !1 && res.headers["content-encoding"]) {
          if (method === "HEAD" || res.statusCode === 204)
            delete res.headers["content-encoding"];
          switch ((res.headers["content-encoding"] || "").toLowerCase()) {
            case "gzip":
            case "x-gzip":
            case "compress":
            case "x-compress":
              streams.push(zlib.createUnzip(zlibOptions)), delete res.headers["content-encoding"];
              break;
            case "deflate":
              streams.push(new ZlibHeaderTransformStream_default), streams.push(zlib.createUnzip(zlibOptions)), delete res.headers["content-encoding"];
              break;
            case "br":
              if (isBrotliSupported)
                streams.push(zlib.createBrotliDecompress(brotliOptions)), delete res.headers["content-encoding"];
          }
        }
        responseStream = streams.length > 1 ? stream3.pipeline(streams, utils_default.noop) : streams[0];
        let response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: new AxiosHeaders_default(res.headers),
          config: config2,
          request: lastRequest
        };
        if (responseType === "stream")
          response.data = responseStream, settle(resolve7, reject, response);
        else {
          let responseBuffer = [], totalResponseBytes = 0;
          responseStream.on("data", function(chunk) {
            if (responseBuffer.push(chunk), totalResponseBytes += chunk.length, config2.maxContentLength > -1 && totalResponseBytes > config2.maxContentLength)
              rejected = !0, responseStream.destroy(), abort(new AxiosError_default("maxContentLength size of " + config2.maxContentLength + " exceeded", AxiosError_default.ERR_BAD_RESPONSE, config2, lastRequest));
          }), responseStream.on("aborted", function() {
            if (rejected)
              return;
            let err = new AxiosError_default("stream has been aborted", AxiosError_default.ERR_BAD_RESPONSE, config2, lastRequest);
            responseStream.destroy(err), reject(err);
          }), responseStream.on("error", function(err) {
            if (req.destroyed)
              return;
            reject(AxiosError_default.from(err, null, config2, lastRequest));
          }), responseStream.on("end", function() {
            try {
              let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
              if (responseType !== "arraybuffer") {
                if (responseData = responseData.toString(responseEncoding), !responseEncoding || responseEncoding === "utf8")
                  responseData = utils_default.stripBOM(responseData);
              }
              response.data = responseData;
            } catch (err) {
              return reject(AxiosError_default.from(err, null, config2, response.request, response));
            }
            settle(resolve7, reject, response);
          });
        }
        abortEmitter.once("abort", (err) => {
          if (!responseStream.destroyed)
            responseStream.emit("error", err), responseStream.destroy();
        });
      }), abortEmitter.once("abort", (err) => {
        if (req.close)
          req.close();
        else
          req.destroy(err);
      }), req.on("error", function(err) {
        reject(AxiosError_default.from(err, null, config2, req));
      }), req.on("socket", function(socket) {
        socket.setKeepAlive(!0, 60000);
      }), config2.timeout) {
        let timeout = parseInt(config2.timeout, 10);
        if (Number.isNaN(timeout)) {
          abort(new AxiosError_default("error trying to parse `config.timeout` to int", AxiosError_default.ERR_BAD_OPTION_VALUE, config2, req));
          return;
        }
        req.setTimeout(timeout, function() {
          if (isDone)
            return;
          let timeoutErrorMessage = config2.timeout ? "timeout of " + config2.timeout + "ms exceeded" : "timeout exceeded", transitional = config2.transitional || transitional_default;
          if (config2.timeoutErrorMessage)
            timeoutErrorMessage = config2.timeoutErrorMessage;
          abort(new AxiosError_default(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED, config2, req));
        });
      } else
        req.setTimeout(0);
      if (utils_default.isStream(data)) {
        let ended = !1, errored = !1;
        data.on("end", () => {
          ended = !0;
        }), data.once("error", (err) => {
          errored = !0, req.destroy(err);
        }), data.on("close", () => {
          if (!ended && !errored)
            abort(new CanceledError_default("Request stream has been aborted", config2, req));
        }), data.pipe(req);
      } else
        data && req.write(data), req.end();
    });
  };
});
