// var: require_dist_cjs24
var require_dist_cjs24 = __commonJS((exports) => {
  var protocolHttp = require_dist_cjs20(), querystringBuilder = require_dist_cjs4(), utilBase64 = require_dist_cjs23();
  function createRequest(url3, requestOptions) {
    return new Request(url3, requestOptions);
  }
  function requestTimeout(timeoutInMs = 0) {
    return new Promise((resolve8, reject) => {
      if (timeoutInMs)
        setTimeout(() => {
          let timeoutError = Error(`Request did not complete within ${timeoutInMs} ms`);
          timeoutError.name = "TimeoutError", reject(timeoutError);
        }, timeoutInMs);
    });
  }
  var keepAliveSupport = {
    supported: void 0
  };

  class FetchHttpHandler {
    config;
    configProvider;
    static create(instanceOrOptions) {
      if (typeof instanceOrOptions?.handle === "function")
        return instanceOrOptions;
      return new FetchHttpHandler(instanceOrOptions);
    }
    constructor(options) {
      if (typeof options === "function")
        this.configProvider = options().then((opts) => opts || {});
      else
        this.config = options ?? {}, this.configProvider = Promise.resolve(this.config);
      if (keepAliveSupport.supported === void 0)
        keepAliveSupport.supported = Boolean(typeof Request < "u" && "keepalive" in createRequest("https://[::1]"));
    }
    destroy() {}
    async handle(request2, { abortSignal, requestTimeout: requestTimeout$1 } = {}) {
      if (!this.config)
        this.config = await this.configProvider;
      let requestTimeoutInMs = requestTimeout$1 ?? this.config.requestTimeout, keepAlive = this.config.keepAlive === !0, credentials = this.config.credentials;
      if (abortSignal?.aborted) {
        let abortError = buildAbortError(abortSignal);
        return Promise.reject(abortError);
      }
      let path9 = request2.path, queryString = querystringBuilder.buildQueryString(request2.query || {});
      if (queryString)
        path9 += `?${queryString}`;
      if (request2.fragment)
        path9 += `#${request2.fragment}`;
      let auth3 = "";
      if (request2.username != null || request2.password != null) {
        let username = request2.username ?? "", password = request2.password ?? "";
        auth3 = `${username}:${password}@`;
      }
      let { port, method } = request2, url3 = `${request2.protocol}//${auth3}${request2.hostname}${port ? `:${port}` : ""}${path9}`, body = method === "GET" || method === "HEAD" ? void 0 : request2.body, requestOptions = {
        body,
        headers: new Headers(request2.headers),
        method,
        credentials
      };
      if (this.config?.cache)
        requestOptions.cache = this.config.cache;
      if (body)
        requestOptions.duplex = "half";
      if (typeof AbortController < "u")
        requestOptions.signal = abortSignal;
      if (keepAliveSupport.supported)
        requestOptions.keepalive = keepAlive;
      if (typeof this.config.requestInit === "function")
        Object.assign(requestOptions, this.config.requestInit(request2));
      let removeSignalEventListener = () => {}, fetchRequest = createRequest(url3, requestOptions), raceOfPromises = [
        fetch(fetchRequest).then((response2) => {
          let fetchHeaders = response2.headers, transformedHeaders = {};
          for (let pair of fetchHeaders.entries())
            transformedHeaders[pair[0]] = pair[1];
          if (response2.body == null)
            return response2.blob().then((body2) => ({
              response: new protocolHttp.HttpResponse({
                headers: transformedHeaders,
                reason: response2.statusText,
                statusCode: response2.status,
                body: body2
              })
            }));
          return {
            response: new protocolHttp.HttpResponse({
              headers: transformedHeaders,
              reason: response2.statusText,
              statusCode: response2.status,
              body: response2.body
            })
          };
        }),
        requestTimeout(requestTimeoutInMs)
      ];
      if (abortSignal)
        raceOfPromises.push(new Promise((resolve8, reject) => {
          let onAbort = () => {
            let abortError = buildAbortError(abortSignal);
            reject(abortError);
          };
          if (typeof abortSignal.addEventListener === "function") {
            let signal = abortSignal;
            signal.addEventListener("abort", onAbort, { once: !0 }), removeSignalEventListener = () => signal.removeEventListener("abort", onAbort);
          } else
            abortSignal.onabort = onAbort;
        }));
      return Promise.race(raceOfPromises).finally(removeSignalEventListener);
    }
    updateHttpClientConfig(key, value) {
      this.config = void 0, this.configProvider = this.configProvider.then((config3) => {
        return config3[key] = value, config3;
      });
    }
    httpHandlerConfigs() {
      return this.config ?? {};
    }
  }
  function buildAbortError(abortSignal) {
    let reason = abortSignal && typeof abortSignal === "object" && "reason" in abortSignal ? abortSignal.reason : void 0;
    if (reason) {
      if (reason instanceof Error) {
        let abortError3 = Error("Request aborted");
        return abortError3.name = "AbortError", abortError3.cause = reason, abortError3;
      }
      let abortError2 = Error(String(reason));
      return abortError2.name = "AbortError", abortError2;
    }
    let abortError = Error("Request aborted");
    return abortError.name = "AbortError", abortError;
  }
  var streamCollector = async (stream5) => {
    if (typeof Blob === "function" && stream5 instanceof Blob || stream5.constructor?.name === "Blob") {
      if (Blob.prototype.arrayBuffer !== void 0)
        return new Uint8Array(await stream5.arrayBuffer());
      return collectBlob(stream5);
    }
    return collectStream(stream5);
  };
  async function collectBlob(blob) {
    let base643 = await readToBase64(blob), arrayBuffer = utilBase64.fromBase64(base643);
    return new Uint8Array(arrayBuffer);
  }
  async function collectStream(stream5) {
    let chunks = [], reader = stream5.getReader(), isDone = !1, length = 0;
    while (!isDone) {
      let { done, value } = await reader.read();
      if (value)
        chunks.push(value), length += value.length;
      isDone = done;
    }
    let collected = new Uint8Array(length), offset = 0;
    for (let chunk of chunks)
      collected.set(chunk, offset), offset += chunk.length;
    return collected;
  }
  function readToBase64(blob) {
    return new Promise((resolve8, reject) => {
      let reader = new FileReader;
      reader.onloadend = () => {
        if (reader.readyState !== 2)
          return reject(Error("Reader aborted too early"));
        let result = reader.result ?? "", commaIndex = result.indexOf(","), dataOffset = commaIndex > -1 ? commaIndex + 1 : result.length;
        resolve8(result.substring(dataOffset));
      }, reader.onabort = () => reject(Error("Read aborted")), reader.onerror = () => reject(reader.error), reader.readAsDataURL(blob);
    });
  }
  exports.FetchHttpHandler = FetchHttpHandler;
  exports.keepAliveSupport = keepAliveSupport;
  exports.streamCollector = streamCollector;
});
