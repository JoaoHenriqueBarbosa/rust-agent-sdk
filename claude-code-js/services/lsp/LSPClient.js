// Original: src/services/lsp/LSPClient.ts
var exports_LSPClient = {};
__export(exports_LSPClient, {
  createLSPClient: () => createLSPClient
});
import { spawn as spawn7 } from "child_process";
function createLSPClient(serverName, onCrash) {
  let process23, connection7, capabilities, isInitialized = !1, startFailed = !1, startError, isStopping = !1, pendingHandlers = [], pendingRequestHandlers = [];
  function checkStartFailed() {
    if (startFailed)
      throw startError || Error(`LSP server ${serverName} failed to start`);
  }
  return {
    get capabilities() {
      return capabilities;
    },
    get isInitialized() {
      return isInitialized;
    },
    async start(command12, args, options2) {
      try {
        if (process23 = spawn7(command12, args, {
          stdio: ["pipe", "pipe", "pipe"],
          env: { ...subprocessEnv(), ...options2?.env },
          cwd: options2?.cwd,
          windowsHide: !0
        }), !process23.stdout || !process23.stdin)
          throw Error("LSP server process stdio not available");
        let spawnedProcess = process23;
        if (await new Promise((resolve28, reject2) => {
          let onSpawn = () => {
            cleanup(), resolve28();
          }, onError = (error44) => {
            cleanup(), reject2(error44);
          }, cleanup = () => {
            spawnedProcess.removeListener("spawn", onSpawn), spawnedProcess.removeListener("error", onError);
          };
          spawnedProcess.once("spawn", onSpawn), spawnedProcess.once("error", onError);
        }), process23.stderr)
          process23.stderr.on("data", (data) => {
            let output = data.toString().trim();
            if (output)
              logForDebugging(`[LSP SERVER ${serverName}] ${output}`);
          });
        process23.on("error", (error44) => {
          if (!isStopping)
            startFailed = !0, startError = error44, logError2(Error(`LSP server ${serverName} failed to start: ${error44.message}`));
        }), process23.on("exit", (code, _signal) => {
          if (code !== 0 && code !== null && !isStopping) {
            isInitialized = !1, startFailed = !1, startError = void 0;
            let crashError = Error(`LSP server ${serverName} crashed with exit code ${code}`);
            logError2(crashError), onCrash?.(crashError);
          }
        }), process23.stdin.on("error", (error44) => {
          if (!isStopping)
            logForDebugging(`LSP server ${serverName} stdin error: ${error44.message}`);
        });
        let reader = new import_node47.StreamMessageReader(process23.stdout), writer = new import_node47.StreamMessageWriter(process23.stdin);
        connection7 = import_node47.createMessageConnection(reader, writer), connection7.onError(([error44, _message, _code]) => {
          if (!isStopping)
            startFailed = !0, startError = error44, logError2(Error(`LSP server ${serverName} connection error: ${error44.message}`));
        }), connection7.onClose(() => {
          if (!isStopping)
            isInitialized = !1, logForDebugging(`LSP server ${serverName} connection closed`);
        }), connection7.listen(), connection7.trace(import_node47.Trace.Verbose, {
          log: (message) => {
            logForDebugging(`[LSP PROTOCOL ${serverName}] ${message}`);
          }
        }).catch((error44) => {
          logForDebugging(`Failed to enable tracing for ${serverName}: ${error44.message}`);
        });
        for (let { method, handler } of pendingHandlers)
          connection7.onNotification(method, handler), logForDebugging(`Applied queued notification handler for ${serverName}.${method}`);
        pendingHandlers.length = 0;
        for (let { method, handler } of pendingRequestHandlers)
          connection7.onRequest(method, handler), logForDebugging(`Applied queued request handler for ${serverName}.${method}`);
        pendingRequestHandlers.length = 0, logForDebugging(`LSP client started for ${serverName}`);
      } catch (error44) {
        throw logError2(Error(`LSP server ${serverName} failed to start: ${error44.message}`)), error44;
      }
    },
    async initialize(params) {
      if (!connection7)
        throw Error("LSP client not started");
      checkStartFailed();
      try {
        let result = await connection7.sendRequest("initialize", params);
        return capabilities = result.capabilities, await connection7.sendNotification("initialized", {}), isInitialized = !0, logForDebugging(`LSP server ${serverName} initialized`), result;
      } catch (error44) {
        throw logError2(Error(`LSP server ${serverName} initialize failed: ${error44.message}`)), error44;
      }
    },
    async sendRequest(method, params) {
      if (!connection7)
        throw Error("LSP client not started");
      if (checkStartFailed(), !isInitialized)
        throw Error("LSP server not initialized");
      try {
        return await connection7.sendRequest(method, params);
      } catch (error44) {
        throw logError2(Error(`LSP server ${serverName} request ${method} failed: ${error44.message}`)), error44;
      }
    },
    async sendNotification(method, params) {
      if (!connection7)
        throw Error("LSP client not started");
      checkStartFailed();
      try {
        await connection7.sendNotification(method, params);
      } catch (error44) {
        logError2(Error(`LSP server ${serverName} notification ${method} failed: ${error44.message}`)), logForDebugging(`Notification ${method} failed but continuing`);
      }
    },
    onNotification(method, handler) {
      if (!connection7) {
        pendingHandlers.push({ method, handler }), logForDebugging(`Queued notification handler for ${serverName}.${method} (connection not ready)`);
        return;
      }
      checkStartFailed(), connection7.onNotification(method, handler);
    },
    onRequest(method, handler) {
      if (!connection7) {
        pendingRequestHandlers.push({
          method,
          handler
        }), logForDebugging(`Queued request handler for ${serverName}.${method} (connection not ready)`);
        return;
      }
      checkStartFailed(), connection7.onRequest(method, handler);
    },
    async stop() {
      let shutdownError;
      isStopping = !0;
      try {
        if (connection7)
          await connection7.sendRequest("shutdown", {}), await connection7.sendNotification("exit", {});
      } catch (error44) {
        let err2 = error44;
        logError2(Error(`LSP server ${serverName} stop failed: ${err2.message}`)), shutdownError = err2;
      } finally {
        if (connection7) {
          try {
            connection7.dispose();
          } catch (error44) {
            logForDebugging(`Connection disposal failed for ${serverName}: ${errorMessage(error44)}`);
          }
          connection7 = void 0;
        }
        if (process23) {
          if (process23.removeAllListeners("error"), process23.removeAllListeners("exit"), process23.stdin)
            process23.stdin.removeAllListeners("error");
          if (process23.stderr)
            process23.stderr.removeAllListeners("data");
          try {
            process23.kill();
          } catch (error44) {
            logForDebugging(`Process kill failed for ${serverName} (may already be dead): ${errorMessage(error44)}`);
          }
          process23 = void 0;
        }
        if (isInitialized = !1, capabilities = void 0, isStopping = !1, shutdownError)
          startFailed = !0, startError = shutdownError;
        logForDebugging(`LSP client stopped for ${serverName}`);
      }
      if (shutdownError)
        throw shutdownError;
    }
  };
}
var import_node47;
var init_LSPClient = __esm(() => {
  init_debug();
  init_errors();
  init_log3();
  init_subprocessEnv();
  import_node47 = __toESM(require_main(), 1);
});
