// class: StreamableHTTPClientTransport
class StreamableHTTPClientTransport {
  constructor(url3, opts) {
    this._hasCompletedAuthFlow = !1, this._url = url3, this._resourceMetadataUrl = void 0, this._scope = void 0, this._requestInit = opts?.requestInit, this._authProvider = opts?.authProvider, this._fetch = opts?.fetch, this._fetchWithInit = createFetchWithInit(opts?.fetch, opts?.requestInit), this._sessionId = opts?.sessionId, this._reconnectionOptions = opts?.reconnectionOptions ?? DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS;
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
    return await this._startOrAuthSse({ resumptionToken: void 0 });
  }
  async _commonHeaders() {
    let headers = {};
    if (this._authProvider) {
      let tokens = await this._authProvider.tokens();
      if (tokens)
        headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    if (this._sessionId)
      headers["mcp-session-id"] = this._sessionId;
    if (this._protocolVersion)
      headers["mcp-protocol-version"] = this._protocolVersion;
    let extraHeaders = normalizeHeaders(this._requestInit?.headers);
    return new Headers({
      ...headers,
      ...extraHeaders
    });
  }
  async _startOrAuthSse(options2) {
    let { resumptionToken } = options2;
    try {
      let headers = await this._commonHeaders();
      if (headers.set("Accept", "text/event-stream"), resumptionToken)
        headers.set("last-event-id", resumptionToken);
      let response7 = await (this._fetch ?? fetch)(this._url, {
        method: "GET",
        headers,
        signal: this._abortController?.signal
      });
      if (!response7.ok) {
        if (await response7.body?.cancel(), response7.status === 401 && this._authProvider)
          return await this._authThenStart();
        if (response7.status === 405)
          return;
        throw new StreamableHTTPError(response7.status, `Failed to open SSE stream: ${response7.statusText}`);
      }
      this._handleSseStream(response7.body, options2, !0);
    } catch (error44) {
      throw this.onerror?.(error44), error44;
    }
  }
  _getNextReconnectionDelay(attempt) {
    if (this._serverRetryMs !== void 0)
      return this._serverRetryMs;
    let initialDelay = this._reconnectionOptions.initialReconnectionDelay, growFactor = this._reconnectionOptions.reconnectionDelayGrowFactor, maxDelay = this._reconnectionOptions.maxReconnectionDelay;
    return Math.min(initialDelay * Math.pow(growFactor, attempt), maxDelay);
  }
  _scheduleReconnection(options2, attemptCount = 0) {
    let maxRetries = this._reconnectionOptions.maxRetries;
    if (attemptCount >= maxRetries) {
      this.onerror?.(Error(`Maximum reconnection attempts (${maxRetries}) exceeded.`));
      return;
    }
    let delay4 = this._getNextReconnectionDelay(attemptCount);
    this._reconnectionTimeout = setTimeout(() => {
      this._startOrAuthSse(options2).catch((error44) => {
        this.onerror?.(Error(`Failed to reconnect SSE stream: ${error44 instanceof Error ? error44.message : String(error44)}`)), this._scheduleReconnection(options2, attemptCount + 1);
      });
    }, delay4);
  }
  _handleSseStream(stream10, options2, isReconnectable) {
    if (!stream10)
      return;
    let { onresumptiontoken, replayMessageId } = options2, lastEventId, hasPrimingEvent = !1, receivedResponse = !1;
    (async () => {
      try {
        let reader = stream10.pipeThrough(new TextDecoderStream).pipeThrough(new EventSourceParserStream({
          onRetry: (retryMs) => {
            this._serverRetryMs = retryMs;
          }
        })).getReader();
        while (!0) {
          let { value: event, done } = await reader.read();
          if (done)
            break;
          if (event.id)
            lastEventId = event.id, hasPrimingEvent = !0, onresumptiontoken?.(event.id);
          if (!event.data)
            continue;
          if (!event.event || event.event === "message")
            try {
              let message = JSONRPCMessageSchema.parse(JSON.parse(event.data));
              if (isJSONRPCResultResponse(message)) {
                if (receivedResponse = !0, replayMessageId !== void 0)
                  message.id = replayMessageId;
              }
              this.onmessage?.(message);
            } catch (error44) {
              this.onerror?.(error44);
            }
        }
        if ((isReconnectable || hasPrimingEvent) && !receivedResponse && this._abortController && !this._abortController.signal.aborted)
          this._scheduleReconnection({
            resumptionToken: lastEventId,
            onresumptiontoken,
            replayMessageId
          }, 0);
      } catch (error44) {
        if (this.onerror?.(Error(`SSE stream disconnected: ${error44}`)), (isReconnectable || hasPrimingEvent) && !receivedResponse && this._abortController && !this._abortController.signal.aborted)
          try {
            this._scheduleReconnection({
              resumptionToken: lastEventId,
              onresumptiontoken,
              replayMessageId
            }, 0);
          } catch (error45) {
            this.onerror?.(Error(`Failed to reconnect: ${error45 instanceof Error ? error45.message : String(error45)}`));
          }
      }
    })();
  }
  async start() {
    if (this._abortController)
      throw Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    this._abortController = new AbortController;
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
    if (this._reconnectionTimeout)
      clearTimeout(this._reconnectionTimeout), this._reconnectionTimeout = void 0;
    this._abortController?.abort(), this.onclose?.();
  }
  async send(message, options2) {
    try {
      let { resumptionToken, onresumptiontoken } = options2 || {};
      if (resumptionToken) {
        this._startOrAuthSse({ resumptionToken, replayMessageId: isJSONRPCRequest(message) ? message.id : void 0 }).catch((err2) => this.onerror?.(err2));
        return;
      }
      let headers = await this._commonHeaders();
      headers.set("content-type", "application/json"), headers.set("accept", "application/json, text/event-stream");
      let init2 = {
        ...this._requestInit,
        method: "POST",
        headers,
        body: JSON.stringify(message),
        signal: this._abortController?.signal
      }, response7 = await (this._fetch ?? fetch)(this._url, init2), sessionId = response7.headers.get("mcp-session-id");
      if (sessionId)
        this._sessionId = sessionId;
      if (!response7.ok) {
        let text2 = await response7.text().catch(() => null);
        if (response7.status === 401 && this._authProvider) {
          if (this._hasCompletedAuthFlow)
            throw new StreamableHTTPError(401, "Server returned 401 after successful authentication");
          let { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response7);
          if (this._resourceMetadataUrl = resourceMetadataUrl, this._scope = scope, await auth13(this._authProvider, {
            serverUrl: this._url,
            resourceMetadataUrl: this._resourceMetadataUrl,
            scope: this._scope,
            fetchFn: this._fetchWithInit
          }) !== "AUTHORIZED")
            throw new UnauthorizedError;
          return this._hasCompletedAuthFlow = !0, this.send(message);
        }
        if (response7.status === 403 && this._authProvider) {
          let { resourceMetadataUrl, scope, error: error44 } = extractWWWAuthenticateParams(response7);
          if (error44 === "insufficient_scope") {
            let wwwAuthHeader = response7.headers.get("WWW-Authenticate");
            if (this._lastUpscopingHeader === wwwAuthHeader)
              throw new StreamableHTTPError(403, "Server returned 403 after trying upscoping");
            if (scope)
              this._scope = scope;
            if (resourceMetadataUrl)
              this._resourceMetadataUrl = resourceMetadataUrl;
            if (this._lastUpscopingHeader = wwwAuthHeader ?? void 0, await auth13(this._authProvider, {
              serverUrl: this._url,
              resourceMetadataUrl: this._resourceMetadataUrl,
              scope: this._scope,
              fetchFn: this._fetch
            }) !== "AUTHORIZED")
              throw new UnauthorizedError;
            return this.send(message);
          }
        }
        throw new StreamableHTTPError(response7.status, `Error POSTing to endpoint: ${text2}`);
      }
      if (this._hasCompletedAuthFlow = !1, this._lastUpscopingHeader = void 0, response7.status === 202) {
        if (await response7.body?.cancel(), isInitializedNotification(message))
          this._startOrAuthSse({ resumptionToken: void 0 }).catch((err2) => this.onerror?.(err2));
        return;
      }
      let hasRequests = (Array.isArray(message) ? message : [message]).filter((msg) => ("method" in msg) && ("id" in msg) && msg.id !== void 0).length > 0, contentType = response7.headers.get("content-type");
      if (hasRequests)
        if (contentType?.includes("text/event-stream"))
          this._handleSseStream(response7.body, { onresumptiontoken }, !1);
        else if (contentType?.includes("application/json")) {
          let data = await response7.json(), responseMessages = Array.isArray(data) ? data.map((msg) => JSONRPCMessageSchema.parse(msg)) : [JSONRPCMessageSchema.parse(data)];
          for (let msg of responseMessages)
            this.onmessage?.(msg);
        } else
          throw await response7.body?.cancel(), new StreamableHTTPError(-1, `Unexpected content type: ${contentType}`);
      else
        await response7.body?.cancel();
    } catch (error44) {
      throw this.onerror?.(error44), error44;
    }
  }
  get sessionId() {
    return this._sessionId;
  }
  async terminateSession() {
    if (!this._sessionId)
      return;
    try {
      let headers = await this._commonHeaders(), init2 = {
        ...this._requestInit,
        method: "DELETE",
        headers,
        signal: this._abortController?.signal
      }, response7 = await (this._fetch ?? fetch)(this._url, init2);
      if (await response7.body?.cancel(), !response7.ok && response7.status !== 405)
        throw new StreamableHTTPError(response7.status, `Failed to terminate session: ${response7.statusText}`);
      this._sessionId = void 0;
    } catch (error44) {
      throw this.onerror?.(error44), error44;
    }
  }
  setProtocolVersion(version5) {
    this._protocolVersion = version5;
  }
  get protocolVersion() {
    return this._protocolVersion;
  }
  async resumeStream(lastEventId, options2) {
    await this._startOrAuthSse({
      resumptionToken: lastEventId,
      onresumptiontoken: options2?.onresumptiontoken
    });
  }
}
