// Original: src/cli/transports/ccrClient.ts
import { randomUUID as randomUUID44 } from "crypto";
function decodeJwtExpiry(token) {
  try {
    let payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}
function alwaysValidStatus() {
  return !0;
}
function createStreamAccumulator() {
  return { byMessage: /* @__PURE__ */ new Map, scopeToMessage: /* @__PURE__ */ new Map };
}
function scopeKey(m4) {
  return `${m4.session_id}:${m4.parent_tool_use_id ?? ""}`;
}
function accumulateStreamEvents(buffer, state4) {
  let out = [], touched = /* @__PURE__ */ new Map;
  for (let msg of buffer)
    switch (msg.event.type) {
      case "message_start": {
        let id = msg.event.message.id, prevId = state4.scopeToMessage.get(scopeKey(msg));
        if (prevId)
          state4.byMessage.delete(prevId);
        state4.scopeToMessage.set(scopeKey(msg), id), state4.byMessage.set(id, []), out.push(msg);
        break;
      }
      case "content_block_delta": {
        if (msg.event.delta.type !== "text_delta") {
          out.push(msg);
          break;
        }
        let messageId = state4.scopeToMessage.get(scopeKey(msg)), blocks = messageId ? state4.byMessage.get(messageId) : void 0;
        if (!blocks) {
          out.push(msg);
          break;
        }
        let chunks = blocks[msg.event.index] ??= [];
        chunks.push(msg.event.delta.text);
        let existing = touched.get(chunks);
        if (existing) {
          existing.event.delta.text = chunks.join("");
          break;
        }
        let snapshot2 = {
          type: "stream_event",
          uuid: msg.uuid,
          session_id: msg.session_id,
          parent_tool_use_id: msg.parent_tool_use_id,
          event: {
            type: "content_block_delta",
            index: msg.event.index,
            delta: { type: "text_delta", text: chunks.join("") }
          }
        };
        touched.set(chunks, snapshot2), out.push(snapshot2);
        break;
      }
      default:
        out.push(msg);
    }
  return out;
}
function clearStreamAccumulatorForMessage(state4, assistant) {
  state4.byMessage.delete(assistant.message.id);
  let scope = scopeKey(assistant);
  if (state4.scopeToMessage.get(scope) === assistant.message.id)
    state4.scopeToMessage.delete(scope);
}

class CCRClient {
  workerEpoch = 0;
  heartbeatIntervalMs;
  heartbeatJitterFraction;
  heartbeatTimer = null;
  heartbeatInFlight = !1;
  closed = !1;
  consecutiveAuthFailures = 0;
  currentState = null;
  sessionBaseUrl;
  sessionId;
  http = createAxiosInstance({ keepAlive: !0 });
  streamEventBuffer = [];
  streamEventTimer = null;
  streamTextAccumulator = createStreamAccumulator();
  workerState;
  eventUploader;
  internalEventUploader;
  deliveryUploader;
  onEpochMismatch;
  getAuthHeaders;
  constructor(transport, sessionUrl, opts) {
    if (this.onEpochMismatch = opts?.onEpochMismatch ?? (() => {
      process.exit(1);
    }), this.heartbeatIntervalMs = opts?.heartbeatIntervalMs ?? DEFAULT_HEARTBEAT_INTERVAL_MS, this.heartbeatJitterFraction = opts?.heartbeatJitterFraction ?? 0, this.getAuthHeaders = opts?.getAuthHeaders ?? getSessionIngressAuthHeaders, sessionUrl.protocol !== "http:" && sessionUrl.protocol !== "https:")
      throw Error(`CCRClient: Expected http(s) URL, got ${sessionUrl.protocol}`);
    let pathname = sessionUrl.pathname.replace(/\/$/, "");
    this.sessionBaseUrl = `${sessionUrl.protocol}//${sessionUrl.host}${pathname}`, this.sessionId = pathname.split("/").pop() || "", this.workerState = new WorkerStateUploader({
      send: (body) => this.request("put", "/worker", { worker_epoch: this.workerEpoch, ...body }, "PUT worker").then((r4) => r4.ok),
      baseDelayMs: 500,
      maxDelayMs: 30000,
      jitterMs: 500
    }), this.eventUploader = new SerialBatchEventUploader({
      maxBatchSize: 100,
      maxBatchBytes: 10485760,
      maxQueueSize: 1e5,
      send: async (batch) => {
        let result = await this.request("post", "/worker/events", { worker_epoch: this.workerEpoch, events: batch }, "client events");
        if (!result.ok)
          throw new RetryableError("client event POST failed", result.retryAfterMs);
      },
      baseDelayMs: 500,
      maxDelayMs: 30000,
      jitterMs: 500
    }), this.internalEventUploader = new SerialBatchEventUploader({
      maxBatchSize: 100,
      maxBatchBytes: 10485760,
      maxQueueSize: 200,
      send: async (batch) => {
        let result = await this.request("post", "/worker/internal-events", { worker_epoch: this.workerEpoch, events: batch }, "internal events");
        if (!result.ok)
          throw new RetryableError("internal event POST failed", result.retryAfterMs);
      },
      baseDelayMs: 500,
      maxDelayMs: 30000,
      jitterMs: 500
    }), this.deliveryUploader = new SerialBatchEventUploader({
      maxBatchSize: 64,
      maxQueueSize: 64,
      send: async (batch) => {
        let result = await this.request("post", "/worker/events/delivery", {
          worker_epoch: this.workerEpoch,
          updates: batch.map((d) => ({
            event_id: d.eventId,
            status: d.status
          }))
        }, "delivery batch");
        if (!result.ok)
          throw new RetryableError("delivery POST failed", result.retryAfterMs);
      },
      baseDelayMs: 500,
      maxDelayMs: 30000,
      jitterMs: 500
    }), transport.setOnEvent((event) => {
      this.reportDelivery(event.event_id, "received");
    });
  }
  async initialize(epoch) {
    let startMs = Date.now();
    if (Object.keys(this.getAuthHeaders()).length === 0)
      throw new CCRInitError("no_auth_headers");
    if (epoch === void 0) {
      let rawEpoch = process.env.CLAUDE_CODE_WORKER_EPOCH;
      epoch = rawEpoch ? parseInt(rawEpoch, 10) : NaN;
    }
    if (isNaN(epoch))
      throw new CCRInitError("missing_epoch");
    this.workerEpoch = epoch;
    let restoredPromise = this.getWorkerState();
    if (!(await this.request("put", "/worker", {
      worker_status: "idle",
      worker_epoch: this.workerEpoch,
      external_metadata: {
        pending_action: null,
        task_summary: null
      }
    }, "PUT worker (init)")).ok)
      throw new CCRInitError("worker_register_failed");
    this.currentState = "idle", this.startHeartbeat(), registerSessionActivityCallback(() => {
      this.writeEvent({ type: "keep_alive" });
    }), logForDebugging(`CCRClient: initialized, epoch=${this.workerEpoch}`), logForDiagnosticsNoPII("info", "cli_worker_lifecycle_initialized", {
      epoch: this.workerEpoch,
      duration_ms: Date.now() - startMs
    });
    let { metadata, durationMs } = await restoredPromise;
    if (!this.closed)
      logForDiagnosticsNoPII("info", "cli_worker_state_restored", {
        duration_ms: durationMs,
        had_state: metadata !== null
      });
    return metadata;
  }
  async getWorkerState() {
    let startMs = Date.now(), authHeaders = this.getAuthHeaders();
    if (Object.keys(authHeaders).length === 0)
      return { metadata: null, durationMs: 0 };
    return {
      metadata: (await this.getWithRetry(`${this.sessionBaseUrl}/worker`, authHeaders, "worker_state"))?.worker?.external_metadata ?? null,
      durationMs: Date.now() - startMs
    };
  }
  async request(method, path27, body, label, { timeout: timeout2 = 1e4 } = {}) {
    let authHeaders = this.getAuthHeaders();
    if (Object.keys(authHeaders).length === 0)
      return { ok: !1 };
    try {
      let response7 = await this.http[method](`${this.sessionBaseUrl}${path27}`, body, {
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "User-Agent": getClaudeCodeUserAgent()
        },
        validateStatus: alwaysValidStatus,
        timeout: timeout2
      });
      if (response7.status >= 200 && response7.status < 300)
        return this.consecutiveAuthFailures = 0, { ok: !0 };
      if (response7.status === 409)
        this.handleEpochMismatch();
      if (response7.status === 401 || response7.status === 403) {
        let tok = getSessionIngressAuthToken(), exp = tok ? decodeJwtExpiry(tok) : null;
        if (exp !== null && exp * 1000 < Date.now())
          logForDebugging(`CCRClient: session_token expired (exp=${new Date(exp * 1000).toISOString()}) \u2014 no refresh was delivered, exiting`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_worker_token_expired_no_refresh"), this.onEpochMismatch();
        if (this.consecutiveAuthFailures++, this.consecutiveAuthFailures >= MAX_CONSECUTIVE_AUTH_FAILURES)
          logForDebugging(`CCRClient: ${this.consecutiveAuthFailures} consecutive auth failures with a valid-looking token \u2014 server-side auth unrecoverable, exiting`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_worker_auth_failures_exhausted"), this.onEpochMismatch();
      }
      if (logForDebugging(`CCRClient: ${label} returned ${response7.status}`, {
        level: "warn"
      }), logForDiagnosticsNoPII("warn", "cli_worker_request_failed", {
        method,
        path: path27,
        status: response7.status
      }), response7.status === 429) {
        let raw = response7.headers?.["retry-after"], seconds = typeof raw === "string" ? parseInt(raw, 10) : NaN;
        if (!isNaN(seconds) && seconds >= 0)
          return { ok: !1, retryAfterMs: seconds * 1000 };
      }
      return { ok: !1 };
    } catch (error44) {
      return logForDebugging(`CCRClient: ${label} failed: ${errorMessage(error44)}`, {
        level: "warn"
      }), logForDiagnosticsNoPII("warn", "cli_worker_request_error", {
        method,
        path: path27,
        error_code: getErrnoCode(error44)
      }), { ok: !1 };
    }
  }
  reportState(state4, details) {
    if (state4 === this.currentState && !details)
      return;
    this.currentState = state4, this.workerState.enqueue({
      worker_status: state4,
      requires_action_details: details ? {
        tool_name: details.tool_name,
        action_description: details.action_description,
        request_id: details.request_id
      } : null
    });
  }
  reportMetadata(metadata) {
    this.workerState.enqueue({ external_metadata: metadata });
  }
  handleEpochMismatch() {
    logForDebugging("CCRClient: Epoch mismatch (409), shutting down", {
      level: "error"
    }), logForDiagnosticsNoPII("error", "cli_worker_epoch_mismatch"), this.onEpochMismatch();
  }
  startHeartbeat() {
    this.stopHeartbeat();
    let schedule = () => {
      let jitter = this.heartbeatIntervalMs * this.heartbeatJitterFraction * (2 * Math.random() - 1);
      this.heartbeatTimer = setTimeout(tick, this.heartbeatIntervalMs + jitter);
    }, tick = () => {
      if (this.sendHeartbeat(), this.heartbeatTimer === null)
        return;
      schedule();
    };
    schedule();
  }
  stopHeartbeat() {
    if (this.heartbeatTimer)
      clearTimeout(this.heartbeatTimer), this.heartbeatTimer = null;
  }
  async sendHeartbeat() {
    if (this.heartbeatInFlight)
      return;
    this.heartbeatInFlight = !0;
    try {
      if ((await this.request("post", "/worker/heartbeat", { session_id: this.sessionId, worker_epoch: this.workerEpoch }, "Heartbeat", { timeout: 5000 })).ok)
        logForDebugging("CCRClient: Heartbeat sent");
    } finally {
      this.heartbeatInFlight = !1;
    }
  }
  async writeEvent(message) {
    if (message.type === "stream_event") {
      if (this.streamEventBuffer.push(message), !this.streamEventTimer)
        this.streamEventTimer = setTimeout(() => void this.flushStreamEventBuffer(), STREAM_EVENT_FLUSH_INTERVAL_MS);
      return;
    }
    if (await this.flushStreamEventBuffer(), message.type === "assistant")
      clearStreamAccumulatorForMessage(this.streamTextAccumulator, message);
    await this.eventUploader.enqueue(this.toClientEvent(message));
  }
  toClientEvent(message) {
    let msg = message;
    return {
      payload: {
        ...msg,
        uuid: typeof msg.uuid === "string" ? msg.uuid : randomUUID44()
      }
    };
  }
  async flushStreamEventBuffer() {
    if (this.streamEventTimer)
      clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
    if (this.streamEventBuffer.length === 0)
      return;
    let buffered = this.streamEventBuffer;
    this.streamEventBuffer = [];
    let payloads = accumulateStreamEvents(buffered, this.streamTextAccumulator);
    await this.eventUploader.enqueue(payloads.map((payload) => ({ payload, ephemeral: !0 })));
  }
  async writeInternalEvent(eventType, payload, {
    isCompaction = !1,
    agentId
  } = {}) {
    let event = {
      payload: {
        type: eventType,
        ...payload,
        uuid: typeof payload.uuid === "string" ? payload.uuid : randomUUID44()
      },
      ...isCompaction && { is_compaction: !0 },
      ...agentId && { agent_id: agentId }
    };
    await this.internalEventUploader.enqueue(event);
  }
  flushInternalEvents() {
    return this.internalEventUploader.flush();
  }
  async flush() {
    return await this.flushStreamEventBuffer(), this.eventUploader.flush();
  }
  async readInternalEvents() {
    return this.paginatedGet("/worker/internal-events", {}, "internal_events");
  }
  async readSubagentInternalEvents() {
    return this.paginatedGet("/worker/internal-events", { subagents: "true" }, "subagent_events");
  }
  async paginatedGet(path27, params, context7) {
    let authHeaders = this.getAuthHeaders();
    if (Object.keys(authHeaders).length === 0)
      return null;
    let allEvents = [], cursor;
    do {
      let url3 = new URL(`${this.sessionBaseUrl}${path27}`);
      for (let [k3, v2] of Object.entries(params))
        url3.searchParams.set(k3, v2);
      if (cursor)
        url3.searchParams.set("cursor", cursor);
      let page = await this.getWithRetry(url3.toString(), authHeaders, context7);
      if (!page)
        return null;
      allEvents.push(...page.data ?? []), cursor = page.next_cursor;
    } while (cursor);
    return logForDebugging(`CCRClient: Read ${allEvents.length} internal events from ${path27}${params.subagents ? " (subagents)" : ""}`), allEvents;
  }
  async getWithRetry(url3, authHeaders, context7) {
    for (let attempt = 1;attempt <= 10; attempt++) {
      let response7;
      try {
        response7 = await this.http.get(url3, {
          headers: {
            ...authHeaders,
            "anthropic-version": "2023-06-01",
            "User-Agent": getClaudeCodeUserAgent()
          },
          validateStatus: alwaysValidStatus,
          timeout: 30000
        });
      } catch (error44) {
        if (logForDebugging(`CCRClient: GET ${url3} failed (attempt ${attempt}/10): ${errorMessage(error44)}`, { level: "warn" }), attempt < 10) {
          let delay4 = Math.min(500 * 2 ** (attempt - 1), 30000) + Math.random() * 500;
          await sleep3(delay4);
        }
        continue;
      }
      if (response7.status >= 200 && response7.status < 300)
        return response7.data;
      if (response7.status === 409)
        this.handleEpochMismatch();
      if (logForDebugging(`CCRClient: GET ${url3} returned ${response7.status} (attempt ${attempt}/10)`, { level: "warn" }), attempt < 10) {
        let delay4 = Math.min(500 * 2 ** (attempt - 1), 30000) + Math.random() * 500;
        await sleep3(delay4);
      }
    }
    return logForDebugging("CCRClient: GET retries exhausted", { level: "error" }), logForDiagnosticsNoPII("error", "cli_worker_get_retries_exhausted", {
      context: context7
    }), null;
  }
  reportDelivery(eventId, status2) {
    this.deliveryUploader.enqueue({ eventId, status: status2 });
  }
  getWorkerEpoch() {
    return this.workerEpoch;
  }
  get internalEventsPending() {
    return this.internalEventUploader.pendingCount;
  }
  close() {
    if (this.closed = !0, this.stopHeartbeat(), unregisterSessionActivityCallback(), this.streamEventTimer)
      clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
    this.streamEventBuffer = [], this.streamTextAccumulator.byMessage.clear(), this.streamTextAccumulator.scopeToMessage.clear(), this.workerState.close(), this.eventUploader.close(), this.internalEventUploader.close(), this.deliveryUploader.close();
  }
}
var DEFAULT_HEARTBEAT_INTERVAL_MS = 20000, STREAM_EVENT_FLUSH_INTERVAL_MS = 100, CCRInitError, MAX_CONSECUTIVE_AUTH_FAILURES = 10;
var init_ccrClient = __esm(() => {
  init_debug();
  init_diagLogs();
  init_errors();
  init_proxy();
  init_sessionActivity();
  init_sessionIngressAuth();
  init_SerialBatchEventUploader();
  init_WorkerStateUploader();
  CCRInitError = class CCRInitError extends Error {
    reason;
    constructor(reason) {
      super(`CCRClient init failed: ${reason}`);
      this.reason = reason;
    }
  };
});
