// class: BaseAnthropic
class BaseAnthropic {
  constructor({ baseURL = readEnv("ANTHROPIC_BASE_URL"), apiKey = readEnv("ANTHROPIC_API_KEY") ?? null, authToken = readEnv("ANTHROPIC_AUTH_TOKEN") ?? null, ...opts } = {}) {
    _BaseAnthropic_encoder.set(this, void 0);
    let options = {
      apiKey,
      authToken,
      ...opts,
      baseURL: baseURL || "https://api.anthropic.com"
    };
    if (!options.dangerouslyAllowBrowser && isRunningInBrowser())
      throw new AnthropicError(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
    this.baseURL = options.baseURL, this.timeout = options.timeout ?? Anthropic.DEFAULT_TIMEOUT, this.logger = options.logger ?? console;
    let defaultLogLevel = "warn";
    this.logLevel = defaultLogLevel, this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? defaultLogLevel, this.fetchOptions = options.fetchOptions, this.maxRetries = options.maxRetries ?? 2, this.fetch = options.fetch ?? getDefaultFetch(), __classPrivateFieldSet(this, _BaseAnthropic_encoder, FallbackEncoder, "f"), this._options = options, this.apiKey = apiKey, this.authToken = authToken;
  }
  withOptions(options) {
    return new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      authToken: this.authToken,
      ...options
    });
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values, nulls }) {
    if (this.apiKey && values.get("x-api-key"))
      return;
    if (nulls.has("x-api-key"))
      return;
    if (this.authToken && values.get("authorization"))
      return;
    if (nulls.has("authorization"))
      return;
    throw Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
  }
  authHeaders(opts) {
    return buildHeaders([this.apiKeyAuth(opts), this.bearerAuth(opts)]);
  }
  apiKeyAuth(opts) {
    if (this.apiKey == null)
      return;
    return buildHeaders([{ "X-Api-Key": this.apiKey }]);
  }
  bearerAuth(opts) {
    if (this.authToken == null)
      return;
    return buildHeaders([{ Authorization: `Bearer ${this.authToken}` }]);
  }
  stringifyQuery(query) {
    return Object.entries(query).filter(([_, value]) => typeof value < "u").map(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      if (value === null)
        return `${encodeURIComponent(key)}=`;
      throw new AnthropicError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${VERSION}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${uuid4()}`;
  }
  makeStatusError(status, error2, message, headers) {
    return APIError.generate(status, error2, message, headers);
  }
  buildURL(path2, query) {
    let url = isAbsoluteURL(path2) ? new URL(path2) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path2.startsWith("/") ? path2.slice(1) : path2)), defaultQuery = this.defaultQuery();
    if (!isEmptyObj(defaultQuery))
      query = { ...defaultQuery, ...query };
    if (typeof query === "object" && query && !Array.isArray(query))
      url.search = this.stringifyQuery(query);
    return url.toString();
  }
  _calculateNonstreamingTimeout(maxTokens) {
    if (3600 * maxTokens / 128000 > 600)
      throw new AnthropicError("Streaming is strongly recommended for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-python#streaming-responses for more details");
    return 600000;
  }
  async prepareOptions(options) {}
  async prepareRequest(request, { url, options }) {}
  get(path2, opts) {
    return this.methodRequest("get", path2, opts);
  }
  post(path2, opts) {
    return this.methodRequest("post", path2, opts);
  }
  patch(path2, opts) {
    return this.methodRequest("patch", path2, opts);
  }
  put(path2, opts) {
    return this.methodRequest("put", path2, opts);
  }
  delete(path2, opts) {
    return this.methodRequest("delete", path2, opts);
  }
  methodRequest(method, path2, opts) {
    return this.request(Promise.resolve(opts).then((opts2) => {
      return { method, path: path2, ...opts2 };
    }));
  }
  request(options, remainingRetries = null) {
    return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
  }
  async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
    let options = await optionsInput, maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null)
      retriesRemaining = maxRetries;
    await this.prepareOptions(options);
    let { req, url, timeout } = this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
    await this.prepareRequest(req, { url, options });
    let requestLogID = "log_" + (Math.random() * 16777216 | 0).toString(16).padStart(6, "0"), retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`, startTime = Date.now();
    if (loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
      retryOfRequestLogID,
      method: options.method,
      url,
      options,
      headers: req.headers
    })), options.signal?.aborted)
      throw new APIUserAbortError;
    let controller = new AbortController, response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError), headersTime = Date.now();
    if (response instanceof Error) {
      let retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
      if (options.signal?.aborted)
        throw new APIUserAbortError;
      let isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
      if (retriesRemaining)
        return loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`), loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message
        })), this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
      if (loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`), loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
        retryOfRequestLogID,
        url,
        durationMs: headersTime - startTime,
        message: response.message
      })), isTimeout)
        throw new APIConnectionTimeoutError;
      throw new APIConnectionError({ cause: response });
    }
    let specialHeaders = [...response.headers.entries()].filter(([name]) => name === "request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join(""), responseInfo = `[${requestLogID}${retryLogStr}${specialHeaders}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
    if (!response.ok) {
      let shouldRetry = this.shouldRetry(response);
      if (retriesRemaining && shouldRetry) {
        let retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
        return await CancelReadableStream(response.body), loggerFor(this).info(`${responseInfo} - ${retryMessage2}`), loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage2})`, formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          durationMs: headersTime - startTime
        })), this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
      }
      let retryMessage = shouldRetry ? "error; no more retries left" : "error; not retryable";
      loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
      let errText = await response.text().catch((err2) => castToError(err2).message), errJSON = safeJSON(errText), errMessage = errJSON ? void 0 : errText;
      throw loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        headers: response.headers,
        message: errMessage,
        durationMs: Date.now() - startTime
      })), this.makeStatusError(response.status, errJSON, errMessage, response.headers);
    }
    return loggerFor(this).info(responseInfo), loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
      retryOfRequestLogID,
      url: response.url,
      status: response.status,
      headers: response.headers,
      durationMs: headersTime - startTime
    })), { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
  }
  getAPIList(path2, Page2, opts) {
    return this.requestAPIList(Page2, { method: "get", path: path2, ...opts });
  }
  requestAPIList(Page2, options) {
    let request = this.makeRequest(options, null, void 0);
    return new PagePromise(this, request, Page2);
  }
  async fetchWithTimeout(url, init, ms, controller) {
    let { signal, method, ...options } = init || {};
    if (signal)
      signal.addEventListener("abort", () => controller.abort());
    let timeout = setTimeout(() => controller.abort(), ms), isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body, fetchOptions = {
      signal: controller.signal,
      ...isReadableBody ? { duplex: "half" } : {},
      method: "GET",
      ...options
    };
    if (method)
      fetchOptions.method = method.toUpperCase();
    try {
      return await this.fetch.call(void 0, url, fetchOptions);
    } finally {
      clearTimeout(timeout);
    }
  }
  shouldRetry(response) {
    let shouldRetryHeader = response.headers.get("x-should-retry");
    if (shouldRetryHeader === "true")
      return !0;
    if (shouldRetryHeader === "false")
      return !1;
    if (response.status === 408)
      return !0;
    if (response.status === 409)
      return !0;
    if (response.status === 429)
      return !0;
    if (response.status >= 500)
      return !0;
    return !1;
  }
  async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
    let timeoutMillis, retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
    if (retryAfterMillisHeader) {
      let timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs))
        timeoutMillis = timeoutMs;
    }
    let retryAfterHeader = responseHeaders?.get("retry-after");
    if (retryAfterHeader && !timeoutMillis) {
      let timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds))
        timeoutMillis = timeoutSeconds * 1000;
      else
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
    }
    if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60000)) {
      let maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    return await sleep(timeoutMillis), this.makeRequest(options, retriesRemaining - 1, requestLogID);
  }
  calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
    let numRetries = maxRetries - retriesRemaining, sleepSeconds = Math.min(0.5 * Math.pow(2, numRetries), 8), jitter = 1 - Math.random() * 0.25;
    return sleepSeconds * jitter * 1000;
  }
  calculateNonstreamingTimeout(maxTokens, maxNonstreamingTokens) {
    if (3600000 * maxTokens / 128000 > 600000 || maxNonstreamingTokens != null && maxTokens > maxNonstreamingTokens)
      throw new AnthropicError("Streaming is strongly recommended for operations that may token longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    return 600000;
  }
  buildRequest(inputOptions, { retryCount = 0 } = {}) {
    let options = { ...inputOptions }, { method, path: path2, query } = options, url = this.buildURL(path2, query);
    if ("timeout" in options)
      validatePositiveInteger("timeout", options.timeout);
    options.timeout = options.timeout ?? this.timeout;
    let { bodyHeaders, body } = this.buildBody({ options }), reqHeaders = this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
    return { req: {
      method,
      headers: reqHeaders,
      ...options.signal && { signal: options.signal },
      ...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
      ...body && { body },
      ...this.fetchOptions ?? {},
      ...options.fetchOptions ?? {}
    }, url, timeout: options.timeout };
  }
  buildHeaders({ options, method, bodyHeaders, retryCount }) {
    let idempotencyHeaders = {};
    if (this.idempotencyHeader && method !== "get") {
      if (!options.idempotencyKey)
        options.idempotencyKey = this.defaultIdempotencyKey();
      idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
    }
    let headers = buildHeaders([
      idempotencyHeaders,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(retryCount),
        ...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1000)) } : {},
        ...getPlatformHeaders(),
        ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
        "anthropic-version": "2023-06-01"
      },
      this.authHeaders(options),
      this._options.defaultHeaders,
      bodyHeaders,
      options.headers
    ]);
    return this.validateHeaders(headers), headers.values;
  }
  buildBody({ options: { body, headers: rawHeaders } }) {
    if (!body)
      return { bodyHeaders: void 0, body: void 0 };
    let headers = buildHeaders([rawHeaders]);
    if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && headers.values.has("content-type") || body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams || globalThis.ReadableStream && body instanceof globalThis.ReadableStream)
      return { bodyHeaders: void 0, body };
    else if (typeof body === "object" && ((Symbol.asyncIterator in body) || (Symbol.iterator in body) && ("next" in body) && typeof body.next === "function"))
      return { bodyHeaders: void 0, body: ReadableStreamFrom(body) };
    else
      return __classPrivateFieldGet(this, _BaseAnthropic_encoder, "f").call(this, { body, headers });
  }
}
