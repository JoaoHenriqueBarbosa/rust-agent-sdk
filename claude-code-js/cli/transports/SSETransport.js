// Original: src/cli/transports/SSETransport.ts
function alwaysValidStatus2() {
  return !0;
}
function parseSSEFrames(buffer) {
  let frames = [], pos = 0, idx;
  while ((idx = buffer.indexOf(`

`, pos)) !== -1) {
    let rawFrame = buffer.slice(pos, idx);
    if (pos = idx + 2, !rawFrame.trim())
      continue;
    let frame = {}, isComment2 = !1;
    for (let line of rawFrame.split(`
`)) {
      if (line.startsWith(":")) {
        isComment2 = !0;
        continue;
      }
      let colonIdx = line.indexOf(":");
      if (colonIdx === -1)
        continue;
      let field = line.slice(0, colonIdx), value = line[colonIdx + 1] === " " ? line.slice(colonIdx + 2) : line.slice(colonIdx + 1);
      switch (field) {
        case "event":
          frame.event = value;
          break;
        case "id":
          frame.id = value;
          break;
        case "data":
          frame.data = frame.data ? frame.data + `
` + value : value;
          break;
      }
    }
    if (frame.data || isComment2)
      frames.push(frame);
  }
  return { frames, remaining: buffer.slice(pos) };
}

class SSETransport {
  url;
  state = "idle";
  onData;
  onCloseCallback;
  onEventCallback;
  headers;
  sessionId;
  refreshHeaders;
  getAuthHeaders;
  abortController = null;
  lastSequenceNum = 0;
  seenSequenceNums = /* @__PURE__ */ new Set;
  reconnectAttempts = 0;
  reconnectStartTime = null;
  reconnectTimer = null;
  livenessTimer = null;
  postUrl;
  constructor(url3, headers = {}, sessionId, refreshHeaders, initialSequenceNum, getAuthHeaders4) {
    this.url = url3;
    if (this.headers = headers, this.sessionId = sessionId, this.refreshHeaders = refreshHeaders, this.getAuthHeaders = getAuthHeaders4 ?? getSessionIngressAuthHeaders, this.postUrl = convertSSEUrlToPostUrl(url3), initialSequenceNum !== void 0 && initialSequenceNum > 0)
      this.lastSequenceNum = initialSequenceNum;
    logForDebugging(`SSETransport: SSE URL = ${url3.href}`), logForDebugging(`SSETransport: POST URL = ${this.postUrl}`), logForDiagnosticsNoPII("info", "cli_sse_transport_initialized");
  }
  getLastSequenceNum() {
    return this.lastSequenceNum;
  }
  async connect() {
    if (this.state !== "idle" && this.state !== "reconnecting") {
      logForDebugging(`SSETransport: Cannot connect, current state is ${this.state}`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_sse_connect_failed");
      return;
    }
    this.state = "reconnecting";
    let connectStartTime = Date.now(), sseUrl = new URL(this.url.href);
    if (this.lastSequenceNum > 0)
      sseUrl.searchParams.set("from_sequence_num", String(this.lastSequenceNum));
    let authHeaders = this.getAuthHeaders(), headers = {
      ...this.headers,
      ...authHeaders,
      Accept: "text/event-stream",
      "anthropic-version": "2023-06-01",
      "User-Agent": getClaudeCodeUserAgent()
    };
    if (authHeaders.Cookie)
      delete headers.Authorization;
    if (this.lastSequenceNum > 0)
      headers["Last-Event-ID"] = String(this.lastSequenceNum);
    logForDebugging(`SSETransport: Opening ${sseUrl.href}`), logForDiagnosticsNoPII("info", "cli_sse_connect_opening"), this.abortController = new AbortController;
    try {
      let response7 = await fetch(sseUrl.href, {
        headers,
        signal: this.abortController.signal
      });
      if (!response7.ok) {
        let isPermanent = PERMANENT_HTTP_CODES.has(response7.status);
        if (logForDebugging(`SSETransport: HTTP ${response7.status}${isPermanent ? " (permanent)" : ""}`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_sse_connect_http_error", {
          status: response7.status
        }), isPermanent) {
          this.state = "closed", this.onCloseCallback?.(response7.status);
          return;
        }
        this.handleConnectionError();
        return;
      }
      if (!response7.body) {
        logForDebugging("SSETransport: No response body"), this.handleConnectionError();
        return;
      }
      let connectDuration = Date.now() - connectStartTime;
      logForDebugging("SSETransport: Connected"), logForDiagnosticsNoPII("info", "cli_sse_connect_connected", {
        duration_ms: connectDuration
      }), this.state = "connected", this.reconnectAttempts = 0, this.reconnectStartTime = null, this.resetLivenessTimer(), await this.readStream(response7.body);
    } catch (error44) {
      if (this.abortController?.signal.aborted)
        return;
      logForDebugging(`SSETransport: Connection error: ${errorMessage(error44)}`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_sse_connect_error"), this.handleConnectionError();
    }
  }
  async readStream(body) {
    let reader = body.getReader(), decoder = /* @__PURE__ */ new TextDecoder, buffer = "";
    try {
      while (!0) {
        let { done, value } = await reader.read();
        if (done)
          break;
        buffer += decoder.decode(value, STREAM_DECODE_OPTS);
        let { frames, remaining } = parseSSEFrames(buffer);
        buffer = remaining;
        for (let frame of frames) {
          if (this.resetLivenessTimer(), frame.id) {
            let seqNum = parseInt(frame.id, 10);
            if (!isNaN(seqNum)) {
              if (this.seenSequenceNums.has(seqNum))
                logForDebugging(`SSETransport: DUPLICATE frame seq=${seqNum} (lastSequenceNum=${this.lastSequenceNum}, seenCount=${this.seenSequenceNums.size})`, { level: "warn" }), logForDiagnosticsNoPII("warn", "cli_sse_duplicate_sequence");
              else if (this.seenSequenceNums.add(seqNum), this.seenSequenceNums.size > 1000) {
                let threshold = this.lastSequenceNum - 200;
                for (let s2 of this.seenSequenceNums)
                  if (s2 < threshold)
                    this.seenSequenceNums.delete(s2);
              }
              if (seqNum > this.lastSequenceNum)
                this.lastSequenceNum = seqNum;
            }
          }
          if (frame.event && frame.data)
            this.handleSSEFrame(frame.event, frame.data);
          else if (frame.data)
            logForDebugging("SSETransport: Frame has data: but no event: field \u2014 dropped", { level: "warn" }), logForDiagnosticsNoPII("warn", "cli_sse_frame_missing_event_field");
        }
      }
    } catch (error44) {
      if (this.abortController?.signal.aborted)
        return;
      logForDebugging(`SSETransport: Stream read error: ${errorMessage(error44)}`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_sse_stream_read_error");
    } finally {
      reader.releaseLock();
    }
    if (this.state !== "closing" && this.state !== "closed")
      logForDebugging("SSETransport: Stream ended, reconnecting"), this.handleConnectionError();
  }
  handleSSEFrame(eventType, data) {
    if (eventType !== "client_event") {
      logForDebugging(`SSETransport: Unexpected SSE event type '${eventType}' on worker stream`, { level: "warn" }), logForDiagnosticsNoPII("warn", "cli_sse_unexpected_event_type", {
        event_type: eventType
      });
      return;
    }
    let ev;
    try {
      ev = jsonParse(data);
    } catch (error44) {
      logForDebugging(`SSETransport: Failed to parse client_event data: ${errorMessage(error44)}`, { level: "error" });
      return;
    }
    let payload = ev.payload;
    if (payload && typeof payload === "object" && "type" in payload) {
      let sessionLabel = this.sessionId ? ` session=${this.sessionId}` : "";
      logForDebugging(`SSETransport: Event seq=${ev.sequence_num} event_id=${ev.event_id} event_type=${ev.event_type} payload_type=${String(payload.type)}${sessionLabel}`), logForDiagnosticsNoPII("info", "cli_sse_message_received"), this.onData?.(jsonStringify(payload) + `
`);
    } else
      logForDebugging(`SSETransport: Ignoring client_event with no type in payload: event_id=${ev.event_id}`);
    this.onEventCallback?.(ev);
  }
  handleConnectionError() {
    if (this.clearLivenessTimer(), this.state === "closing" || this.state === "closed")
      return;
    this.abortController?.abort(), this.abortController = null;
    let now2 = Date.now();
    if (!this.reconnectStartTime)
      this.reconnectStartTime = now2;
    let elapsed = now2 - this.reconnectStartTime;
    if (elapsed < RECONNECT_GIVE_UP_MS) {
      if (this.reconnectTimer)
        clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
      if (this.refreshHeaders) {
        let freshHeaders = this.refreshHeaders();
        Object.assign(this.headers, freshHeaders), logForDebugging("SSETransport: Refreshed headers for reconnect");
      }
      this.state = "reconnecting", this.reconnectAttempts++;
      let baseDelay = Math.min(RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1), RECONNECT_MAX_DELAY_MS), delay4 = Math.max(0, baseDelay + baseDelay * 0.25 * (2 * Math.random() - 1));
      logForDebugging(`SSETransport: Reconnecting in ${Math.round(delay4)}ms (attempt ${this.reconnectAttempts}, ${Math.round(elapsed / 1000)}s elapsed)`), logForDiagnosticsNoPII("error", "cli_sse_reconnect_attempt", {
        reconnectAttempts: this.reconnectAttempts
      }), this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null, this.connect();
      }, delay4);
    } else
      logForDebugging(`SSETransport: Reconnection time budget exhausted after ${Math.round(elapsed / 1000)}s`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_sse_reconnect_exhausted", {
        reconnectAttempts: this.reconnectAttempts,
        elapsedMs: elapsed
      }), this.state = "closed", this.onCloseCallback?.();
  }
  onLivenessTimeout = () => {
    this.livenessTimer = null, logForDebugging("SSETransport: Liveness timeout, reconnecting", {
      level: "error"
    }), logForDiagnosticsNoPII("error", "cli_sse_liveness_timeout"), this.abortController?.abort(), this.handleConnectionError();
  };
  resetLivenessTimer() {
    this.clearLivenessTimer(), this.livenessTimer = setTimeout(this.onLivenessTimeout, LIVENESS_TIMEOUT_MS);
  }
  clearLivenessTimer() {
    if (this.livenessTimer)
      clearTimeout(this.livenessTimer), this.livenessTimer = null;
  }
  async write(message) {
    let authHeaders = this.getAuthHeaders();
    if (Object.keys(authHeaders).length === 0) {
      logForDebugging("SSETransport: No session token available for POST"), logForDiagnosticsNoPII("warn", "cli_sse_post_no_token");
      return;
    }
    let headers = {
      ...authHeaders,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "User-Agent": getClaudeCodeUserAgent()
    };
    logForDebugging(`SSETransport: POST body keys=${Object.keys(message).join(",")}`);
    for (let attempt = 1;attempt <= POST_MAX_RETRIES; attempt++) {
      try {
        let response7 = await axios_default.post(this.postUrl, message, {
          headers,
          validateStatus: alwaysValidStatus2
        });
        if (response7.status === 200 || response7.status === 201) {
          logForDebugging(`SSETransport: POST success type=${message.type}`);
          return;
        }
        if (logForDebugging(`SSETransport: POST ${response7.status} body=${jsonStringify(response7.data).slice(0, 200)}`), response7.status >= 400 && response7.status < 500 && response7.status !== 429) {
          logForDebugging(`SSETransport: POST returned ${response7.status} (client error), not retrying`), logForDiagnosticsNoPII("warn", "cli_sse_post_client_error", {
            status: response7.status
          });
          return;
        }
        logForDebugging(`SSETransport: POST returned ${response7.status}, attempt ${attempt}/${POST_MAX_RETRIES}`), logForDiagnosticsNoPII("warn", "cli_sse_post_retryable_error", {
          status: response7.status,
          attempt
        });
      } catch (error44) {
        logForDebugging(`SSETransport: POST error: ${error44.message}, attempt ${attempt}/${POST_MAX_RETRIES}`), logForDiagnosticsNoPII("warn", "cli_sse_post_network_error", {
          attempt
        });
      }
      if (attempt === POST_MAX_RETRIES) {
        logForDebugging(`SSETransport: POST failed after ${POST_MAX_RETRIES} attempts, continuing`), logForDiagnosticsNoPII("warn", "cli_sse_post_retries_exhausted");
        return;
      }
      let delayMs = Math.min(POST_BASE_DELAY_MS * Math.pow(2, attempt - 1), POST_MAX_DELAY_MS);
      await sleep3(delayMs);
    }
  }
  isConnectedStatus() {
    return this.state === "connected";
  }
  isClosedStatus() {
    return this.state === "closed";
  }
  setOnData(callback) {
    this.onData = callback;
  }
  setOnClose(callback) {
    this.onCloseCallback = callback;
  }
  setOnEvent(callback) {
    this.onEventCallback = callback;
  }
  close() {
    if (this.reconnectTimer)
      clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
    this.clearLivenessTimer(), this.state = "closing", this.abortController?.abort(), this.abortController = null;
  }
}
function convertSSEUrlToPostUrl(sseUrl) {
  let pathname = sseUrl.pathname;
  if (pathname.endsWith("/stream"))
    pathname = pathname.slice(0, -7);
  return `${sseUrl.protocol}//${sseUrl.host}${pathname}`;
}
var RECONNECT_BASE_DELAY_MS = 1000, RECONNECT_MAX_DELAY_MS = 30000, RECONNECT_GIVE_UP_MS = 600000, LIVENESS_TIMEOUT_MS = 45000, PERMANENT_HTTP_CODES, POST_MAX_RETRIES = 10, POST_BASE_DELAY_MS = 500, POST_MAX_DELAY_MS = 8000, STREAM_DECODE_OPTS;
var init_SSETransport = __esm(() => {
  init_axios2();
  init_debug();
  init_diagLogs();
  init_errors();
  init_sessionIngressAuth();
  init_slowOperations();
  PERMANENT_HTTP_CODES = /* @__PURE__ */ new Set([401, 403, 404]), STREAM_DECODE_OPTS = { stream: !0 };
});
