// class: SSEClientTransport
class SSEClientTransport {
  constructor(url3, opts) {
    this._url = url3, this._resourceMetadataUrl = void 0, this._scope = void 0, this._eventSourceInit = opts?.eventSourceInit, this._requestInit = opts?.requestInit, this._authProvider = opts?.authProvider, this._fetch = opts?.fetch, this._fetchWithInit = createFetchWithInit(opts?.fetch, opts?.requestInit);
  }
  async _authThenStart() {
    if (!this._authProvider)
      throw new UnauthorizedError("No auth provider");
    let result;
    try {
      result = await auth13(this._authProvider, {
        serverUrl: this._url,
        resourceMetadataUrl: this._resourceMetadataUrl,
        scope: this._scope,
        fetchFn: this._fetchWithInit
      });
    } catch (error44) {
      throw this.onerror?.(error44), error44;
    }
    if (result !== "AUTHORIZED")
      throw new UnauthorizedError;
    return await this._startOrAuth();
  }
  async _commonHeaders() {
    let headers = {};
    if (this._authProvider) {
      let tokens = await this._authProvider.tokens();
      if (tokens)
        headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    if (this._protocolVersion)
      headers["mcp-protocol-version"] = this._protocolVersion;
    let extraHeaders = normalizeHeaders(this._requestInit?.headers);
    return new Headers({
      ...headers,
      ...extraHeaders
    });
  }
  _startOrAuth() {
    let fetchImpl = this?._eventSourceInit?.fetch ?? this._fetch ?? fetch;
    return new Promise((resolve24, reject2) => {
      this._eventSource = new EventSource(this._url.href, {
        ...this._eventSourceInit,
        fetch: async (url3, init2) => {
          let headers = await this._commonHeaders();
          headers.set("Accept", "text/event-stream");
          let response7 = await fetchImpl(url3, {
            ...init2,
            headers
          });
          if (response7.status === 401 && response7.headers.has("www-authenticate")) {
            let { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response7);
            this._resourceMetadataUrl = resourceMetadataUrl, this._scope = scope;
          }
          return response7;
        }
      }), this._abortController = new AbortController, this._eventSource.onerror = (event) => {
        if (event.code === 401 && this._authProvider) {
          this._authThenStart().then(resolve24, reject2);
          return;
        }
        let error44 = new SseError(event.code, event.message, event);
        reject2(error44), this.onerror?.(error44);
      }, this._eventSource.onopen = () => {}, this._eventSource.addEventListener("endpoint", (event) => {
        let messageEvent = event;
        try {
          if (this._endpoint = new URL(messageEvent.data, this._url), this._endpoint.origin !== this._url.origin)
            throw Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`);
        } catch (error44) {
          reject2(error44), this.onerror?.(error44), this.close();
          return;
        }
        resolve24();
      }), this._eventSource.onmessage = (event) => {
        let messageEvent = event, message;
        try {
          message = JSONRPCMessageSchema.parse(JSON.parse(messageEvent.data));
        } catch (error44) {
          this.onerror?.(error44);
          return;
        }
        this.onmessage?.(message);
      };
    });
  }
  async start() {
    if (this._eventSource)
      throw Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return await this._startOrAuth();
  }
  async finishAuth(authorizationCode) {
    if (!this._authProvider)
      throw new UnauthorizedError("No auth provider");
    if (await auth13(this._authProvider, {
      serverUrl: this._url,
      authorizationCode,
      resourceMetadataUrl: this._resourceMetadataUrl,
      scope: this._scope,
      fetchFn: this._fetchWithInit
    }) !== "AUTHORIZED")
      throw new UnauthorizedError("Failed to authorize");
  }
  async close() {
    this._abortController?.abort(), this._eventSource?.close(), this.onclose?.();
  }
  async send(message) {
    if (!this._endpoint)
      throw Error("Not connected");
    try {
      let headers = await this._commonHeaders();
      headers.set("content-type", "application/json");
      let init2 = {
        ...this._requestInit,
        method: "POST",
        headers,
        body: JSON.stringify(message),
        signal: this._abortController?.signal
      }, response7 = await (this._fetch ?? fetch)(this._endpoint, init2);
      if (!response7.ok) {
        let text2 = await response7.text().catch(() => null);
        if (response7.status === 401 && this._authProvider) {
          let { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response7);
          if (this._resourceMetadataUrl = resourceMetadataUrl, this._scope = scope, await auth13(this._authProvider, {
            serverUrl: this._url,
            resourceMetadataUrl: this._resourceMetadataUrl,
            scope: this._scope,
            fetchFn: this._fetchWithInit
          }) !== "AUTHORIZED")
            throw new UnauthorizedError;
          return this.send(message);
        }
        throw Error(`Error POSTing to endpoint (HTTP ${response7.status}): ${text2}`);
      }
      await response7.body?.cancel();
    } catch (error44) {
      throw this.onerror?.(error44), error44;
    }
  }
  setProtocolVersion(version5) {
    this._protocolVersion = version5;
  }
}
