// var: require_dist_cjs5
var require_dist_cjs5 = __commonJS((exports) => {
  var protocolHttp = require_dist_cjs2(), querystringBuilder = require_dist_cjs4(), node_https = __require("https"), node_stream = __require("stream"), http22 = __require("http2");
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
  var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"], getTransformedHeaders = (headers) => {
    let transformedHeaders = {};
    for (let name of Object.keys(headers)) {
      let headerValues = headers[name];
      transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
    }
    return transformedHeaders;
  }, timing = {
    setTimeout: (cb, ms) => setTimeout(cb, ms),
    clearTimeout: (timeoutId) => clearTimeout(timeoutId)
  }, DEFER_EVENT_LISTENER_TIME$2 = 1000, setConnectionTimeout = (request, reject, timeoutInMs = 0) => {
    if (!timeoutInMs)
      return -1;
    let registerTimeout = (offset) => {
      let timeoutId = timing.setTimeout(() => {
        request.destroy(), reject(Object.assign(Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${timeoutInMs} ms.`), {
          name: "TimeoutError"
        }));
      }, timeoutInMs - offset), doWithSocket = (socket) => {
        if (socket?.connecting)
          socket.on("connect", () => {
            timing.clearTimeout(timeoutId);
          });
        else
          timing.clearTimeout(timeoutId);
      };
      if (request.socket)
        doWithSocket(request.socket);
      else
        request.on("socket", doWithSocket);
    };
    if (timeoutInMs < 2000)
      return registerTimeout(0), 0;
    return timing.setTimeout(registerTimeout.bind(null, DEFER_EVENT_LISTENER_TIME$2), DEFER_EVENT_LISTENER_TIME$2);
  }, setRequestTimeout = (req, reject, timeoutInMs = 0, throwOnRequestTimeout, logger) => {
    if (timeoutInMs)
      return timing.setTimeout(() => {
        let msg = `@smithy/node-http-handler - [${throwOnRequestTimeout ? "ERROR" : "WARN"}] a request has exceeded the configured ${timeoutInMs} ms requestTimeout.`;
        if (throwOnRequestTimeout) {
          let error41 = Object.assign(Error(msg), {
            name: "TimeoutError",
            code: "ETIMEDOUT"
          });
          req.destroy(error41), reject(error41);
        } else
          msg += " Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.", logger?.warn?.(msg);
      }, timeoutInMs);
    return -1;
  }, DEFER_EVENT_LISTENER_TIME$1 = 3000, setSocketKeepAlive = (request, { keepAlive, keepAliveMsecs }, deferTimeMs = DEFER_EVENT_LISTENER_TIME$1) => {
    if (keepAlive !== !0)
      return -1;
    let registerListener = () => {
      if (request.socket)
        request.socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
      else
        request.on("socket", (socket) => {
          socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
        });
    };
    if (deferTimeMs === 0)
      return registerListener(), 0;
    return timing.setTimeout(registerListener, deferTimeMs);
  }, DEFER_EVENT_LISTENER_TIME = 3000, setSocketTimeout = (request, reject, timeoutInMs = 0) => {
    let registerTimeout = (offset) => {
      let timeout = timeoutInMs - offset, onTimeout = () => {
        request.destroy(), reject(Object.assign(Error(`@smithy/node-http-handler - the request socket timed out after ${timeoutInMs} ms of inactivity (configured by client requestHandler).`), { name: "TimeoutError" }));
      };
      if (request.socket)
        request.socket.setTimeout(timeout, onTimeout), request.on("close", () => request.socket?.removeListener("timeout", onTimeout));
      else
        request.setTimeout(timeout, onTimeout);
    };
    if (0 < timeoutInMs && timeoutInMs < 6000)
      return registerTimeout(0), 0;
    return timing.setTimeout(registerTimeout.bind(null, timeoutInMs === 0 ? 0 : DEFER_EVENT_LISTENER_TIME), DEFER_EVENT_LISTENER_TIME);
  }, MIN_WAIT_TIME = 6000;
  async function writeRequestBody(httpRequest, request, maxContinueTimeoutMs = MIN_WAIT_TIME, externalAgent = !1) {
    let headers = request.headers ?? {}, expect = headers.Expect || headers.expect, timeoutId = -1, sendBody = !0;
    if (!externalAgent && expect === "100-continue")
      sendBody = await Promise.race([
        new Promise((resolve8) => {
          timeoutId = Number(timing.setTimeout(() => resolve8(!0), Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
        }),
        new Promise((resolve8) => {
          httpRequest.on("continue", () => {
            timing.clearTimeout(timeoutId), resolve8(!0);
          }), httpRequest.on("response", () => {
            timing.clearTimeout(timeoutId), resolve8(!1);
          }), httpRequest.on("error", () => {
            timing.clearTimeout(timeoutId), resolve8(!1);
          });
        })
      ]);
    if (sendBody)
      writeBody(httpRequest, request.body);
  }
  function writeBody(httpRequest, body) {
    if (body instanceof node_stream.Readable) {
      body.pipe(httpRequest);
      return;
    }
    if (body) {
      let isBuffer3 = Buffer.isBuffer(body);
      if (isBuffer3 || typeof body === "string") {
        if (isBuffer3 && body.byteLength === 0)
          httpRequest.end();
        else
          httpRequest.end(body);
        return;
      }
      let uint8 = body;
      if (typeof uint8 === "object" && uint8.buffer && typeof uint8.byteOffset === "number" && typeof uint8.byteLength === "number") {
        httpRequest.end(Buffer.from(uint8.buffer, uint8.byteOffset, uint8.byteLength));
        return;
      }
      httpRequest.end(Buffer.from(body));
      return;
    }
    httpRequest.end();
  }
  var DEFAULT_REQUEST_TIMEOUT = 0, hAgent = void 0, hRequest = void 0;

  class NodeHttpHandler {
    config;
    configProvider;
    socketWarningTimestamp = 0;
    externalAgent = !1;
    metadata = { handlerProtocol: "http/1.1" };
    static create(instanceOrOptions) {
      if (typeof instanceOrOptions?.handle === "function")
        return instanceOrOptions;
      return new NodeHttpHandler(instanceOrOptions);
    }
    static checkSocketUsage(agent, socketWarningTimestamp, logger = console) {
      let { sockets, requests, maxSockets } = agent;
      if (typeof maxSockets !== "number" || maxSockets === 1 / 0)
        return socketWarningTimestamp;
      let interval = 15000;
      if (Date.now() - interval < socketWarningTimestamp)
        return socketWarningTimestamp;
      if (sockets && requests)
        for (let origin2 in sockets) {
          let socketsInUse = sockets[origin2]?.length ?? 0, requestsEnqueued = requests[origin2]?.length ?? 0;
          if (socketsInUse >= maxSockets && requestsEnqueued >= 2 * maxSockets)
            return logger?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${socketsInUse} and ${requestsEnqueued} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`), Date.now();
        }
      return socketWarningTimestamp;
    }
    constructor(options) {
      this.configProvider = new Promise((resolve8, reject) => {
        if (typeof options === "function")
          options().then((_options) => {
            resolve8(this.resolveDefaultConfig(_options));
          }).catch(reject);
        else
          resolve8(this.resolveDefaultConfig(options));
      });
    }
    destroy() {
      this.config?.httpAgent?.destroy(), this.config?.httpsAgent?.destroy();
    }
    async handle(request, { abortSignal, requestTimeout } = {}) {
      if (!this.config)
        this.config = await this.configProvider;
      let config2 = this.config, isSSL = request.protocol === "https:";
      if (!isSSL && !this.config.httpAgent)
        this.config.httpAgent = await this.config.httpAgentProvider();
      return new Promise((_resolve, _reject) => {
        let writeRequestBodyPromise = void 0, timeouts = [], resolve8 = async (arg) => {
          await writeRequestBodyPromise, timeouts.forEach(timing.clearTimeout), _resolve(arg);
        }, reject = async (arg) => {
          await writeRequestBodyPromise, timeouts.forEach(timing.clearTimeout), _reject(arg);
        };
        if (abortSignal?.aborted) {
          let abortError = buildAbortError(abortSignal);
          reject(abortError);
          return;
        }
        let headers = request.headers ?? {}, expectContinue = (headers.Expect ?? headers.expect) === "100-continue", agent = isSSL ? config2.httpsAgent : config2.httpAgent;
        if (expectContinue && !this.externalAgent)
          agent = new (isSSL ? node_https.Agent : hAgent)({
            keepAlive: !1,
            maxSockets: 1 / 0
          });
        timeouts.push(timing.setTimeout(() => {
          this.socketWarningTimestamp = NodeHttpHandler.checkSocketUsage(agent, this.socketWarningTimestamp, config2.logger);
        }, config2.socketAcquisitionWarningTimeout ?? (config2.requestTimeout ?? 2000) + (config2.connectionTimeout ?? 1000)));
        let queryString = querystringBuilder.buildQueryString(request.query || {}), auth = void 0;
        if (request.username != null || request.password != null) {
          let username = request.username ?? "", password = request.password ?? "";
          auth = `${username}:${password}`;
        }
        let path9 = request.path;
        if (queryString)
          path9 += `?${queryString}`;
        if (request.fragment)
          path9 += `#${request.fragment}`;
        let hostname2 = request.hostname ?? "";
        if (hostname2[0] === "[" && hostname2.endsWith("]"))
          hostname2 = request.hostname.slice(1, -1);
        else
          hostname2 = request.hostname;
        let nodeHttpsOptions = {
          headers: request.headers,
          host: hostname2,
          method: request.method,
          path: path9,
          port: request.port,
          agent,
          auth
        }, req = (isSSL ? node_https.request : hRequest)(nodeHttpsOptions, (res) => {
          let httpResponse = new protocolHttp.HttpResponse({
            statusCode: res.statusCode || -1,
            reason: res.statusMessage,
            headers: getTransformedHeaders(res.headers),
            body: res
          });
          resolve8({ response: httpResponse });
        });
        if (req.on("error", (err) => {
          if (NODEJS_TIMEOUT_ERROR_CODES.includes(err.code))
            reject(Object.assign(err, { name: "TimeoutError" }));
          else
            reject(err);
        }), abortSignal) {
          let onAbort = () => {
            req.destroy();
            let abortError = buildAbortError(abortSignal);
            reject(abortError);
          };
          if (typeof abortSignal.addEventListener === "function") {
            let signal = abortSignal;
            signal.addEventListener("abort", onAbort, { once: !0 }), req.once("close", () => signal.removeEventListener("abort", onAbort));
          } else
            abortSignal.onabort = onAbort;
        }
        let effectiveRequestTimeout = requestTimeout ?? config2.requestTimeout;
        timeouts.push(setConnectionTimeout(req, reject, config2.connectionTimeout)), timeouts.push(setRequestTimeout(req, reject, effectiveRequestTimeout, config2.throwOnRequestTimeout, config2.logger ?? console)), timeouts.push(setSocketTimeout(req, reject, config2.socketTimeout));
        let httpAgent = nodeHttpsOptions.agent;
        if (typeof httpAgent === "object" && "keepAlive" in httpAgent)
          timeouts.push(setSocketKeepAlive(req, {
            keepAlive: httpAgent.keepAlive,
            keepAliveMsecs: httpAgent.keepAliveMsecs
          }));
        writeRequestBodyPromise = writeRequestBody(req, request, effectiveRequestTimeout, this.externalAgent).catch((e) => {
          return timeouts.forEach(timing.clearTimeout), _reject(e);
        });
      });
    }
    updateHttpClientConfig(key, value) {
      this.config = void 0, this.configProvider = this.configProvider.then((config2) => {
        return {
          ...config2,
          [key]: value
        };
      });
    }
    httpHandlerConfigs() {
      return this.config ?? {};
    }
    resolveDefaultConfig(options) {
      let { requestTimeout, connectionTimeout, socketTimeout, socketAcquisitionWarningTimeout, httpAgent, httpsAgent, throwOnRequestTimeout, logger } = options || {}, keepAlive = !0, maxSockets = 50;
      return {
        connectionTimeout,
        requestTimeout,
        socketTimeout,
        socketAcquisitionWarningTimeout,
        throwOnRequestTimeout,
        httpAgentProvider: async () => {
          let { Agent, request } = await import("http");
          if (hRequest = request, hAgent = Agent, httpAgent instanceof hAgent || typeof httpAgent?.destroy === "function")
            return this.externalAgent = !0, httpAgent;
          return new hAgent({ keepAlive: !0, maxSockets: 50, ...httpAgent });
        },
        httpsAgent: (() => {
          if (httpsAgent instanceof node_https.Agent || typeof httpsAgent?.destroy === "function")
            return this.externalAgent = !0, httpsAgent;
          return new node_https.Agent({ keepAlive: !0, maxSockets: 50, ...httpsAgent });
        })(),
        logger
      };
    }
  }

  class NodeHttp2ConnectionPool {
    sessions = [];
    constructor(sessions) {
      this.sessions = sessions ?? [];
    }
    poll() {
      if (this.sessions.length > 0)
        return this.sessions.shift();
    }
    offerLast(session) {
      this.sessions.push(session);
    }
    contains(session) {
      return this.sessions.includes(session);
    }
    remove(session) {
      this.sessions = this.sessions.filter((s) => s !== session);
    }
    [Symbol.iterator]() {
      return this.sessions[Symbol.iterator]();
    }
    destroy(connection) {
      for (let session of this.sessions)
        if (session === connection) {
          if (!session.destroyed)
            session.destroy();
        }
    }
  }

  class NodeHttp2ConnectionManager {
    constructor(config2) {
      if (this.config = config2, this.config.maxConcurrency && this.config.maxConcurrency <= 0)
        throw RangeError("maxConcurrency must be greater than zero.");
    }
    config;
    sessionCache = /* @__PURE__ */ new Map;
    lease(requestContext, connectionConfiguration) {
      let url3 = this.getUrlString(requestContext), existingPool = this.sessionCache.get(url3);
      if (existingPool) {
        let existingSession = existingPool.poll();
        if (existingSession && !this.config.disableConcurrency)
          return existingSession;
      }
      let session = http22.connect(url3);
      if (this.config.maxConcurrency)
        session.settings({ maxConcurrentStreams: this.config.maxConcurrency }, (err) => {
          if (err)
            throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + requestContext.destination.toString());
        });
      session.unref();
      let destroySessionCb = () => {
        session.destroy(), this.deleteSession(url3, session);
      };
      if (session.on("goaway", destroySessionCb), session.on("error", destroySessionCb), session.on("frameError", destroySessionCb), session.on("close", () => this.deleteSession(url3, session)), connectionConfiguration.requestTimeout)
        session.setTimeout(connectionConfiguration.requestTimeout, destroySessionCb);
      let connectionPool = this.sessionCache.get(url3) || new NodeHttp2ConnectionPool;
      return connectionPool.offerLast(session), this.sessionCache.set(url3, connectionPool), session;
    }
    deleteSession(authority, session) {
      let existingConnectionPool = this.sessionCache.get(authority);
      if (!existingConnectionPool)
        return;
      if (!existingConnectionPool.contains(session))
        return;
      existingConnectionPool.remove(session), this.sessionCache.set(authority, existingConnectionPool);
    }
    release(requestContext, session) {
      let cacheKey = this.getUrlString(requestContext);
      this.sessionCache.get(cacheKey)?.offerLast(session);
    }
    destroy() {
      for (let [key, connectionPool] of this.sessionCache) {
        for (let session of connectionPool) {
          if (!session.destroyed)
            session.destroy();
          connectionPool.remove(session);
        }
        this.sessionCache.delete(key);
      }
    }
    setMaxConcurrentStreams(maxConcurrentStreams) {
      if (maxConcurrentStreams && maxConcurrentStreams <= 0)
        throw RangeError("maxConcurrentStreams must be greater than zero.");
      this.config.maxConcurrency = maxConcurrentStreams;
    }
    setDisableConcurrentStreams(disableConcurrentStreams) {
      this.config.disableConcurrency = disableConcurrentStreams;
    }
    getUrlString(request) {
      return request.destination.toString();
    }
  }

  class NodeHttp2Handler {
    config;
    configProvider;
    metadata = { handlerProtocol: "h2" };
    connectionManager = new NodeHttp2ConnectionManager({});
    static create(instanceOrOptions) {
      if (typeof instanceOrOptions?.handle === "function")
        return instanceOrOptions;
      return new NodeHttp2Handler(instanceOrOptions);
    }
    constructor(options) {
      this.configProvider = new Promise((resolve8, reject) => {
        if (typeof options === "function")
          options().then((opts) => {
            resolve8(opts || {});
          }).catch(reject);
        else
          resolve8(options || {});
      });
    }
    destroy() {
      this.connectionManager.destroy();
    }
    async handle(request, { abortSignal, requestTimeout } = {}) {
      if (!this.config) {
        if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams)
          this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams);
      }
      let { requestTimeout: configRequestTimeout, disableConcurrentStreams } = this.config, effectiveRequestTimeout = requestTimeout ?? configRequestTimeout;
      return new Promise((_resolve, _reject) => {
        let fulfilled = !1, writeRequestBodyPromise = void 0, resolve8 = async (arg) => {
          await writeRequestBodyPromise, _resolve(arg);
        }, reject = async (arg) => {
          await writeRequestBodyPromise, _reject(arg);
        };
        if (abortSignal?.aborted) {
          fulfilled = !0;
          let abortError = buildAbortError(abortSignal);
          reject(abortError);
          return;
        }
        let { hostname: hostname2, method, port, protocol, query } = request, auth = "";
        if (request.username != null || request.password != null) {
          let username = request.username ?? "", password = request.password ?? "";
          auth = `${username}:${password}@`;
        }
        let authority = `${protocol}//${auth}${hostname2}${port ? `:${port}` : ""}`, requestContext = { destination: new URL(authority) }, session = this.connectionManager.lease(requestContext, {
          requestTimeout: this.config?.sessionTimeout,
          disableConcurrentStreams: disableConcurrentStreams || !1
        }), rejectWithDestroy = (err) => {
          if (disableConcurrentStreams)
            this.destroySession(session);
          fulfilled = !0, reject(err);
        }, queryString = querystringBuilder.buildQueryString(query || {}), path9 = request.path;
        if (queryString)
          path9 += `?${queryString}`;
        if (request.fragment)
          path9 += `#${request.fragment}`;
        let req = session.request({
          ...request.headers,
          [http22.constants.HTTP2_HEADER_PATH]: path9,
          [http22.constants.HTTP2_HEADER_METHOD]: method
        });
        if (session.ref(), req.on("response", (headers) => {
          let httpResponse = new protocolHttp.HttpResponse({
            statusCode: headers[":status"] || -1,
            headers: getTransformedHeaders(headers),
            body: req
          });
          if (fulfilled = !0, resolve8({ response: httpResponse }), disableConcurrentStreams)
            session.close(), this.connectionManager.deleteSession(authority, session);
        }), effectiveRequestTimeout)
          req.setTimeout(effectiveRequestTimeout, () => {
            req.close();
            let timeoutError = Error(`Stream timed out because of no activity for ${effectiveRequestTimeout} ms`);
            timeoutError.name = "TimeoutError", rejectWithDestroy(timeoutError);
          });
        if (abortSignal) {
          let onAbort = () => {
            req.close();
            let abortError = buildAbortError(abortSignal);
            rejectWithDestroy(abortError);
          };
          if (typeof abortSignal.addEventListener === "function") {
            let signal = abortSignal;
            signal.addEventListener("abort", onAbort, { once: !0 }), req.once("close", () => signal.removeEventListener("abort", onAbort));
          } else
            abortSignal.onabort = onAbort;
        }
        req.on("frameError", (type, code, id) => {
          rejectWithDestroy(Error(`Frame type id ${type} in stream id ${id} has failed with code ${code}.`));
        }), req.on("error", rejectWithDestroy), req.on("aborted", () => {
          rejectWithDestroy(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${req.rstCode}.`));
        }), req.on("close", () => {
          if (session.unref(), disableConcurrentStreams)
            session.destroy();
          if (!fulfilled)
            rejectWithDestroy(Error("Unexpected error: http2 request did not get a response"));
        }), writeRequestBodyPromise = writeRequestBody(req, request, effectiveRequestTimeout);
      });
    }
    updateHttpClientConfig(key, value) {
      this.config = void 0, this.configProvider = this.configProvider.then((config2) => {
        return {
          ...config2,
          [key]: value
        };
      });
    }
    httpHandlerConfigs() {
      return this.config ?? {};
    }
    destroySession(session) {
      if (!session.destroyed)
        session.destroy();
    }
  }

  class Collector extends node_stream.Writable {
    bufferedBytes = [];
    _write(chunk, encoding, callback) {
      this.bufferedBytes.push(chunk), callback();
    }
  }
  var streamCollector = (stream4) => {
    if (isReadableStreamInstance(stream4))
      return collectReadableStream(stream4);
    return new Promise((resolve8, reject) => {
      let collector = new Collector;
      stream4.pipe(collector), stream4.on("error", (err) => {
        collector.end(), reject(err);
      }), collector.on("error", reject), collector.on("finish", function() {
        let bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
        resolve8(bytes);
      });
    });
  }, isReadableStreamInstance = (stream4) => typeof ReadableStream === "function" && stream4 instanceof ReadableStream;
  async function collectReadableStream(stream4) {
    let chunks = [], reader = stream4.getReader(), isDone = !1, length = 0;
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
  exports.DEFAULT_REQUEST_TIMEOUT = DEFAULT_REQUEST_TIMEOUT;
  exports.NodeHttp2Handler = NodeHttp2Handler;
  exports.NodeHttpHandler = NodeHttpHandler;
  exports.streamCollector = streamCollector;
});
