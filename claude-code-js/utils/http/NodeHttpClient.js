// class: NodeHttpClient
class NodeHttpClient {
  cachedHttpAgent;
  cachedHttpsAgents = /* @__PURE__ */ new WeakMap;
  async sendRequest(request2) {
    let abortController = new AbortController, abortListener;
    if (request2.abortSignal) {
      if (request2.abortSignal.aborted)
        throw new AbortError3("The operation was aborted. Request has already been canceled.");
      abortListener = (event) => {
        if (event.type === "abort")
          abortController.abort();
      }, request2.abortSignal.addEventListener("abort", abortListener);
    }
    let timeoutId;
    if (request2.timeout > 0)
      timeoutId = setTimeout(() => {
        let sanitizer = new Sanitizer;
        logger11.info(`request to '${sanitizer.sanitizeUrl(request2.url)}' timed out. canceling...`), abortController.abort();
      }, request2.timeout);
    let acceptEncoding = request2.headers.get("Accept-Encoding"), shouldDecompress = acceptEncoding?.includes("gzip") || acceptEncoding?.includes("deflate"), body = typeof request2.body === "function" ? request2.body() : request2.body;
    if (body && !request2.headers.has("Content-Length")) {
      let bodyLength = getBodyLength(body);
      if (bodyLength !== null)
        request2.headers.set("Content-Length", bodyLength);
    }
    let responseStream;
    try {
      if (body && request2.onUploadProgress) {
        let onUploadProgress = request2.onUploadProgress, uploadReportStream = new ReportTransform(onUploadProgress);
        if (uploadReportStream.on("error", (e) => {
          logger11.error("Error in upload progress", e);
        }), isReadableStream4(body))
          body.pipe(uploadReportStream);
        else
          uploadReportStream.end(body);
        body = uploadReportStream;
      }
      let res = await this.makeRequest(request2, abortController, body);
      if (timeoutId !== void 0)
        clearTimeout(timeoutId);
      let headers = getResponseHeaders(res), response7 = {
        status: res.statusCode ?? 0,
        headers,
        request: request2
      };
      if (request2.method === "HEAD")
        return res.resume(), response7;
      responseStream = shouldDecompress ? getDecodedResponseStream(res, headers) : res;
      let onDownloadProgress = request2.onDownloadProgress;
      if (onDownloadProgress) {
        let downloadReportStream = new ReportTransform(onDownloadProgress);
        downloadReportStream.on("error", (e) => {
          logger11.error("Error in download progress", e);
        }), responseStream.pipe(downloadReportStream), responseStream = downloadReportStream;
      }
      if (request2.streamResponseStatusCodes?.has(Number.POSITIVE_INFINITY) || request2.streamResponseStatusCodes?.has(response7.status))
        response7.readableStreamBody = responseStream;
      else
        response7.bodyAsText = await streamToText(responseStream);
      return response7;
    } finally {
      if (request2.abortSignal && abortListener) {
        let uploadStreamDone = Promise.resolve();
        if (isReadableStream4(body))
          uploadStreamDone = isStreamComplete(body);
        let downloadStreamDone = Promise.resolve();
        if (isReadableStream4(responseStream))
          downloadStreamDone = isStreamComplete(responseStream);
        Promise.all([uploadStreamDone, downloadStreamDone]).then(() => {
          if (abortListener)
            request2.abortSignal?.removeEventListener("abort", abortListener);
        }).catch((e) => {
          logger11.warning("Error when cleaning up abortListener on httpRequest", e);
        });
      }
    }
  }
  makeRequest(request2, abortController, body) {
    let url3 = new URL(request2.url), isInsecure = url3.protocol !== "https:";
    if (isInsecure && !request2.allowInsecureConnection)
      throw Error(`Cannot connect to ${request2.url} while allowInsecureConnection is false.`);
    let options = {
      agent: request2.agent ?? this.getOrCreateAgent(request2, isInsecure),
      hostname: url3.hostname,
      path: `${url3.pathname}${url3.search}`,
      port: url3.port,
      method: request2.method,
      headers: request2.headers.toJSON({ preserveCase: !0 }),
      ...request2.requestOverrides
    };
    return new Promise((resolve9, reject) => {
      let req = isInsecure ? http11.request(options, resolve9) : https2.request(options, resolve9);
      if (req.once("error", (err) => {
        reject(new RestError(err.message, { code: err.code ?? RestError.REQUEST_SEND_ERROR, request: request2 }));
      }), abortController.signal.addEventListener("abort", () => {
        let abortError = new AbortError3("The operation was aborted. Rejecting from abort signal callback while making request.");
        req.destroy(abortError), reject(abortError);
      }), body && isReadableStream4(body))
        body.pipe(req);
      else if (body)
        if (typeof body === "string" || Buffer.isBuffer(body))
          req.end(body);
        else if (isArrayBuffer8(body))
          req.end(ArrayBuffer.isView(body) ? Buffer.from(body.buffer) : Buffer.from(body));
        else
          logger11.error("Unrecognized body type", body), reject(new RestError("Unrecognized body type"));
      else
        req.end();
    });
  }
  getOrCreateAgent(request2, isInsecure) {
    let disableKeepAlive = request2.disableKeepAlive;
    if (isInsecure) {
      if (disableKeepAlive)
        return http11.globalAgent;
      if (!this.cachedHttpAgent)
        this.cachedHttpAgent = new http11.Agent({ keepAlive: !0 });
      return this.cachedHttpAgent;
    } else {
      if (disableKeepAlive && !request2.tlsSettings)
        return https2.globalAgent;
      let tlsSettings = request2.tlsSettings ?? DEFAULT_TLS_SETTINGS, agent = this.cachedHttpsAgents.get(tlsSettings);
      if (agent && agent.options.keepAlive === !disableKeepAlive)
        return agent;
      return logger11.info("No cached TLS Agent exist, creating a new Agent"), agent = new https2.Agent({
        keepAlive: !disableKeepAlive,
        ...tlsSettings
      }), this.cachedHttpsAgents.set(tlsSettings, agent), agent;
    }
  }
}
