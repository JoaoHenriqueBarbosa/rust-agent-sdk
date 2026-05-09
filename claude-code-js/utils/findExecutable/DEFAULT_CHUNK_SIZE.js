// var: DEFAULT_CHUNK_SIZE
var DEFAULT_CHUNK_SIZE = 65536, isFunction3, globalFetchAPI, ReadableStream2, TextEncoder2, test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return !1;
  }
}, factory = (env3) => {
  env3 = utils_default.merge.call({
    skipUndefined: !0
  }, globalFetchAPI, env3);
  let { fetch: envFetch, Request: Request2, Response: Response2 } = env3, isFetchSupported = envFetch ? isFunction3(envFetch) : typeof fetch === "function", isRequestSupported = isFunction3(Request2), isResponseSupported = isFunction3(Response2);
  if (!isFetchSupported)
    return !1;
  let isReadableStreamSupported = isFetchSupported && isFunction3(ReadableStream2), encodeText = isFetchSupported && (typeof TextEncoder2 === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder2) : async (str) => new Uint8Array(await new Request2(str).arrayBuffer())), supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
    let duplexAccessed = !1, body = new ReadableStream2, hasContentType = new Request2(platform_default.origin, {
      body,
      method: "POST",
      get duplex() {
        return duplexAccessed = !0, "half";
      }
    }).headers.has("Content-Type");
    return body.cancel(), duplexAccessed && !hasContentType;
  }), supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response2("").body)), resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && (() => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = (res, config2) => {
        let method = res && res[type];
        if (method)
          return method.call(res);
        throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config2);
      });
    });
  })();
  let getBodyLength = async (body) => {
    if (body == null)
      return 0;
    if (utils_default.isBlob(body))
      return body.size;
    if (utils_default.isSpecCompliantForm(body))
      return (await new Request2(platform_default.origin, {
        method: "POST",
        body
      }).arrayBuffer()).byteLength;
    if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body))
      return body.byteLength;
    if (utils_default.isURLSearchParams(body))
      body = body + "";
    if (utils_default.isString(body))
      return (await encodeText(body)).byteLength;
  }, resolveBodyLength = async (headers, body) => {
    let length = utils_default.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  return async (config2) => {
    let {
      url: url3,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig_default(config2), _fetch = envFetch || fetch;
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout), request = null, unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    }), requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request2(url3, {
          method: "POST",
          body: data,
          duplex: "half"
        }), contentTypeHeader;
        if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type")))
          headers.setContentType(contentTypeHeader);
        if (_request.body) {
          let [onProgress, flush] = progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress)));
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils_default.isString(withCredentials))
        withCredentials = withCredentials ? "include" : "omit";
      let isCredentialsSupported = isRequestSupported && "credentials" in Request2.prototype, resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      };
      request = isRequestSupported && new Request2(url3, resolvedOptions);
      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url3, resolvedOptions)), isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        let options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        let responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length")), [onProgress, flush] = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), !0)) || [];
        response = new Response2(trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush(), unsubscribe && unsubscribe();
        }), options);
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config2);
      return !isStreamResponse && unsubscribe && unsubscribe(), await new Promise((resolve7, reject) => {
        settle(resolve7, reject, {
          data: responseData,
          headers: AxiosHeaders_default.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config: config2,
          request
        });
      });
    } catch (err) {
      if (unsubscribe && unsubscribe(), err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message))
        throw Object.assign(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config2, request, err && err.response), {
          cause: err.cause || err
        });
      throw AxiosError_default.from(err, err && err.code, config2, request, err && err.response);
    }
  };
}, seedCache, getFetch = (config2) => {
  let env3 = config2 && config2.env || {}, { fetch: fetch2, Request: Request2, Response: Response2 } = env3, seeds = [Request2, Response2, fetch2], len = seeds.length, i2 = len, seed, target, map2 = seedCache;
  while (i2--)
    seed = seeds[i2], target = map2.get(seed), target === void 0 && map2.set(seed, target = i2 ? /* @__PURE__ */ new Map : factory(env3)), map2 = target;
  return target;
}, adapter;
