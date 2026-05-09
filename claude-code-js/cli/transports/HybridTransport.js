// Original: src/cli/transports/HybridTransport.ts
function convertWsUrlToPostUrl(wsUrl) {
  let protocol = wsUrl.protocol === "wss:" ? "https:" : "http:", pathname = wsUrl.pathname;
  if (pathname = pathname.replace("/ws/", "/session/"), !pathname.endsWith("/events"))
    pathname = pathname.endsWith("/") ? pathname + "events" : pathname + "/events";
  return `${protocol}//${wsUrl.host}${pathname}${wsUrl.search}`;
}
var BATCH_FLUSH_INTERVAL_MS = 100, POST_TIMEOUT_MS = 15000, CLOSE_GRACE_MS = 3000, HybridTransport;
var init_HybridTransport = __esm(() => {
  init_axios2();
  init_debug();
  init_diagLogs();
  init_sessionIngressAuth();
  init_SerialBatchEventUploader();
  init_WebSocketTransport();
  HybridTransport = class HybridTransport extends WebSocketTransport2 {
    postUrl;
    uploader;
    streamEventBuffer = [];
    streamEventTimer = null;
    constructor(url3, headers = {}, sessionId, refreshHeaders, options2) {
      super(url3, headers, sessionId, refreshHeaders, options2);
      let { maxConsecutiveFailures, onBatchDropped } = options2 ?? {};
      this.postUrl = convertWsUrlToPostUrl(url3), this.uploader = new SerialBatchEventUploader({
        maxBatchSize: 500,
        maxQueueSize: 1e5,
        baseDelayMs: 500,
        maxDelayMs: 8000,
        jitterMs: 1000,
        maxConsecutiveFailures,
        onBatchDropped: (batchSize, failures) => {
          logForDiagnosticsNoPII("error", "cli_hybrid_batch_dropped_max_failures", {
            batchSize,
            failures
          }), onBatchDropped?.(batchSize, failures);
        },
        send: (batch) => this.postOnce(batch)
      }), logForDebugging(`HybridTransport: POST URL = ${this.postUrl}`), logForDiagnosticsNoPII("info", "cli_hybrid_transport_initialized");
    }
    async write(message) {
      if (message.type === "stream_event") {
        if (this.streamEventBuffer.push(message), !this.streamEventTimer)
          this.streamEventTimer = setTimeout(() => this.flushStreamEvents(), BATCH_FLUSH_INTERVAL_MS);
        return;
      }
      return await this.uploader.enqueue([...this.takeStreamEvents(), message]), this.uploader.flush();
    }
    async writeBatch(messages) {
      return await this.uploader.enqueue([...this.takeStreamEvents(), ...messages]), this.uploader.flush();
    }
    get droppedBatchCount() {
      return this.uploader.droppedBatchCount;
    }
    flush() {
      return this.uploader.enqueue(this.takeStreamEvents()), this.uploader.flush();
    }
    takeStreamEvents() {
      if (this.streamEventTimer)
        clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
      let buffered = this.streamEventBuffer;
      return this.streamEventBuffer = [], buffered;
    }
    flushStreamEvents() {
      this.streamEventTimer = null, this.uploader.enqueue(this.takeStreamEvents());
    }
    close() {
      if (this.streamEventTimer)
        clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
      this.streamEventBuffer = [];
      let uploader = this.uploader, graceTimer;
      Promise.race([
        uploader.flush(),
        new Promise((r4) => {
          graceTimer = setTimeout(r4, CLOSE_GRACE_MS);
        })
      ]).finally(() => {
        clearTimeout(graceTimer), uploader.close();
      }), super.close();
    }
    async postOnce(events2) {
      let sessionToken = getSessionIngressAuthToken();
      if (!sessionToken) {
        logForDebugging("HybridTransport: No session token available for POST"), logForDiagnosticsNoPII("warn", "cli_hybrid_post_no_token");
        return;
      }
      let headers = {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json"
      }, response7;
      try {
        response7 = await axios_default.post(this.postUrl, { events: events2 }, {
          headers,
          validateStatus: () => !0,
          timeout: POST_TIMEOUT_MS
        });
      } catch (error44) {
        throw logForDebugging(`HybridTransport: POST error: ${error44.message}`), logForDiagnosticsNoPII("warn", "cli_hybrid_post_network_error"), error44;
      }
      if (response7.status >= 200 && response7.status < 300) {
        logForDebugging(`HybridTransport: POST success count=${events2.length}`);
        return;
      }
      if (response7.status >= 400 && response7.status < 500 && response7.status !== 429) {
        logForDebugging(`HybridTransport: POST returned ${response7.status} (permanent), dropping`), logForDiagnosticsNoPII("warn", "cli_hybrid_post_client_error", {
          status: response7.status
        });
        return;
      }
      throw logForDebugging(`HybridTransport: POST returned ${response7.status} (retryable)`), logForDiagnosticsNoPII("warn", "cli_hybrid_post_retryable_error", {
        status: response7.status
      }), Error(`POST failed with ${response7.status}`);
    }
  };
});
