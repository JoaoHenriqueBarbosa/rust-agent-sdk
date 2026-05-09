// Original: src/cli/remoteIO.ts
import { PassThrough as PassThrough5 } from "stream";
import { URL as URL5 } from "url";
var RemoteIO;
var init_remoteIO = __esm(() => {
  init_state();
  init_cleanupRegistry();
  init_debug();
  init_diagLogs();
  init_envUtils();
  init_errors();
  init_gracefulShutdown();
  init_log3();
  init_sessionIngressAuth();
  init_sessionState();
  init_sessionStorage();
  init_ndjsonSafeStringify();
  init_structuredIO();
  init_ccrClient();
  init_SSETransport();
  init_transportUtils();
  RemoteIO = class RemoteIO extends StructuredIO {
    url;
    transport;
    inputStream;
    isBridge = !1;
    isDebug = !1;
    ccrClient = null;
    keepAliveTimer = null;
    constructor(streamUrl, initialPrompt, replayUserMessages) {
      let inputStream = new PassThrough5({ encoding: "utf8" });
      super(inputStream, replayUserMessages);
      this.inputStream = inputStream, this.url = new URL5(streamUrl);
      let headers = {}, sessionToken = getSessionIngressAuthToken();
      if (sessionToken)
        headers.Authorization = `Bearer ${sessionToken}`;
      else
        logForDebugging("[remote-io] No session ingress token available", {
          level: "error"
        });
      let erVersion = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
      if (erVersion)
        headers["x-environment-runner-version"] = erVersion;
      let refreshHeaders = () => {
        let h4 = {}, freshToken = getSessionIngressAuthToken();
        if (freshToken)
          h4.Authorization = `Bearer ${freshToken}`;
        let freshErVersion = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
        if (freshErVersion)
          h4["x-environment-runner-version"] = freshErVersion;
        return h4;
      };
      if (this.transport = getTransportForUrl(this.url, headers, getSessionId(), refreshHeaders), this.isBridge = process.env.CLAUDE_CODE_ENVIRONMENT_KIND === "bridge", this.isDebug = isDebugMode(), this.transport.setOnData((data) => {
        if (this.inputStream.write(data), this.isBridge && this.isDebug)
          writeToStdout(data.endsWith(`
`) ? data : data + `
`);
      }), this.transport.setOnClose(() => {
        this.inputStream.end();
      }), isEnvTruthy(process.env.CLAUDE_CODE_USE_CCR_V2)) {
        if (!(this.transport instanceof SSETransport))
          throw Error("CCR v2 requires SSETransport; check getTransportForUrl");
        this.ccrClient = new CCRClient(this.transport, this.url);
        let init3 = this.ccrClient.initialize();
        this.restoredWorkerState = init3.catch(() => null), init3.catch((error44) => {
          logForDiagnosticsNoPII("error", "cli_worker_lifecycle_init_failed", {
            reason: error44 instanceof CCRInitError ? error44.reason : "unknown"
          }), logError2(Error(`CCRClient initialization failed: ${errorMessage(error44)}`)), gracefulShutdown(1, "other");
        }), registerCleanup(async () => this.ccrClient?.close()), setInternalEventWriter((eventType, payload, options2) => this.ccrClient.writeInternalEvent(eventType, payload, options2)), setInternalEventReader(() => this.ccrClient.readInternalEvents(), () => this.ccrClient.readSubagentInternalEvents());
        let LIFECYCLE_TO_DELIVERY = {
          started: "processing",
          completed: "processed"
        };
        setCommandLifecycleListener((uuid8, state4) => {
          this.ccrClient?.reportDelivery(uuid8, LIFECYCLE_TO_DELIVERY[state4]);
        }), setSessionStateChangedListener((state4, details) => {
          this.ccrClient?.reportState(state4, details);
        }), setSessionMetadataChangedListener((metadata) => {
          this.ccrClient?.reportMetadata(metadata);
        });
      }
      this.transport.connect();
      let keepAliveIntervalMs = 30000;
      if (this.isBridge && keepAliveIntervalMs > 0)
        this.keepAliveTimer = setInterval(() => {
          logForDebugging("[remote-io] keep_alive sent"), this.write({ type: "keep_alive" }).catch((err2) => {
            logForDebugging(`[remote-io] keep_alive write failed: ${errorMessage(err2)}`);
          });
        }, keepAliveIntervalMs), this.keepAliveTimer.unref?.();
      if (registerCleanup(async () => this.close()), initialPrompt) {
        let stream10 = this.inputStream;
        (async () => {
          for await (let chunk2 of initialPrompt)
            stream10.write(String(chunk2).replace(/\n$/, "") + `
`);
        })();
      }
    }
    flushInternalEvents() {
      return this.ccrClient?.flushInternalEvents() ?? Promise.resolve();
    }
    get internalEventsPending() {
      return this.ccrClient?.internalEventsPending ?? 0;
    }
    async write(message) {
      if (this.ccrClient)
        await this.ccrClient.writeEvent(message);
      else
        await this.transport.write(message);
      if (this.isBridge) {
        if (message.type === "control_request" || this.isDebug)
          writeToStdout(ndjsonSafeStringify(message) + `
`);
      }
    }
    close() {
      if (this.keepAliveTimer)
        clearInterval(this.keepAliveTimer), this.keepAliveTimer = null;
      this.transport.close(), this.inputStream.end();
    }
  };
});
