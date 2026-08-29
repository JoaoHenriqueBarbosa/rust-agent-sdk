// Original: src/services/lsp/LSPServerInstance.ts
import * as path17 from "path";
import { pathToFileURL as pathToFileURL4 } from "url";
function createLSPServerInstance(name3, config10) {
  if (config10.restartOnCrash !== void 0)
    throw Error(`LSP server '${name3}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
  if (config10.shutdownTimeout !== void 0)
    throw Error(`LSP server '${name3}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
  let { createLSPClient: createLSPClient2 } = (init_LSPClient(), __toCommonJS(exports_LSPClient)), state3 = "stopped", startTime, lastError, restartCount = 0, crashRecoveryCount = 0, client15 = createLSPClient2(name3, (error44) => {
    state3 = "error", lastError = error44, crashRecoveryCount++;
  });
  async function start() {
    if (state3 === "running" || state3 === "starting")
      return;
    let maxRestarts = config10.maxRestarts ?? 3;
    if (state3 === "error" && crashRecoveryCount > maxRestarts) {
      let error44 = Error(`LSP server '${name3}' exceeded max crash recovery attempts (${maxRestarts})`);
      throw lastError = error44, logError2(error44), error44;
    }
    let initPromise;
    try {
      state3 = "starting", logForDebugging(`Starting LSP server instance: ${name3}`), await client15.start(config10.command, config10.args || [], {
        env: config10.env,
        cwd: config10.workspaceFolder
      });
      let workspaceFolder = config10.workspaceFolder || getCwd(), workspaceUri = pathToFileURL4(workspaceFolder).href, initParams = {
        processId: process.pid,
        initializationOptions: config10.initializationOptions ?? {},
        workspaceFolders: [
          {
            uri: workspaceUri,
            name: path17.basename(workspaceFolder)
          }
        ],
        rootPath: workspaceFolder,
        rootUri: workspaceUri,
        capabilities: {
          workspace: {
            configuration: !1,
            workspaceFolders: !1
          },
          textDocument: {
            synchronization: {
              dynamicRegistration: !1,
              willSave: !1,
              willSaveWaitUntil: !1,
              didSave: !0
            },
            publishDiagnostics: {
              relatedInformation: !0,
              tagSupport: {
                valueSet: [1, 2]
              },
              versionSupport: !1,
              codeDescriptionSupport: !0,
              dataSupport: !1
            },
            hover: {
              dynamicRegistration: !1,
              contentFormat: ["markdown", "plaintext"]
            },
            definition: {
              dynamicRegistration: !1,
              linkSupport: !0
            },
            references: {
              dynamicRegistration: !1
            },
            documentSymbol: {
              dynamicRegistration: !1,
              hierarchicalDocumentSymbolSupport: !0
            },
            callHierarchy: {
              dynamicRegistration: !1
            }
          },
          general: {
            positionEncodings: ["utf-16"]
          }
        }
      };
      if (initPromise = client15.initialize(initParams), config10.startupTimeout !== void 0)
        await withTimeout(initPromise, config10.startupTimeout, `LSP server '${name3}' timed out after ${config10.startupTimeout}ms during initialization`);
      else
        await initPromise;
      state3 = "running", startTime = /* @__PURE__ */ new Date, crashRecoveryCount = 0, logForDebugging(`LSP server instance started: ${name3}`);
    } catch (error44) {
      throw client15.stop().catch(() => {}), initPromise?.catch(() => {}), state3 = "error", lastError = error44, logError2(error44), error44;
    }
  }
  async function stop() {
    if (state3 === "stopped" || state3 === "stopping")
      return;
    try {
      state3 = "stopping", await client15.stop(), state3 = "stopped", logForDebugging(`LSP server instance stopped: ${name3}`);
    } catch (error44) {
      throw state3 = "error", lastError = error44, logError2(error44), error44;
    }
  }
  async function restart() {
    try {
      await stop();
    } catch (error44) {
      let stopError = Error(`Failed to stop LSP server '${name3}' during restart: ${errorMessage(error44)}`);
      throw logError2(stopError), stopError;
    }
    restartCount++;
    let maxRestarts = config10.maxRestarts ?? 3;
    if (restartCount > maxRestarts) {
      let error44 = Error(`Max restart attempts (${maxRestarts}) exceeded for server '${name3}'`);
      throw logError2(error44), error44;
    }
    try {
      await start();
    } catch (error44) {
      let startError = Error(`Failed to start LSP server '${name3}' during restart (attempt ${restartCount}/${maxRestarts}): ${errorMessage(error44)}`);
      throw logError2(startError), startError;
    }
  }
  function isHealthy() {
    return state3 === "running" && client15.isInitialized;
  }
  async function sendRequest(method, params) {
    if (!isHealthy()) {
      let error44 = Error(`Cannot send request to LSP server '${name3}': server is ${state3}${lastError ? `, last error: ${lastError.message}` : ""}`);
      throw logError2(error44), error44;
    }
    let lastAttemptError;
    for (let attempt = 0;attempt <= MAX_RETRIES_FOR_TRANSIENT_ERRORS; attempt++)
      try {
        return await client15.sendRequest(method, params);
      } catch (error44) {
        lastAttemptError = error44;
        let errorCode = error44.code;
        if (typeof errorCode === "number" && errorCode === LSP_ERROR_CONTENT_MODIFIED && attempt < MAX_RETRIES_FOR_TRANSIENT_ERRORS) {
          let delay4 = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
          logForDebugging(`LSP request '${method}' to '${name3}' got ContentModified error, retrying in ${delay4}ms (attempt ${attempt + 1}/${MAX_RETRIES_FOR_TRANSIENT_ERRORS})\u2026`), await sleep3(delay4);
          continue;
        }
        break;
      }
    let requestError = Error(`LSP request '${method}' failed for server '${name3}': ${lastAttemptError?.message ?? "unknown error"}`);
    throw logError2(requestError), requestError;
  }
  async function sendNotification2(method, params) {
    if (!isHealthy()) {
      let error44 = Error(`Cannot send notification to LSP server '${name3}': server is ${state3}`);
      throw logError2(error44), error44;
    }
    try {
      await client15.sendNotification(method, params);
    } catch (error44) {
      let notificationError = Error(`LSP notification '${method}' failed for server '${name3}': ${errorMessage(error44)}`);
      throw logError2(notificationError), notificationError;
    }
  }
  function onNotification(method, handler) {
    client15.onNotification(method, handler);
  }
  function onRequest(method, handler) {
    client15.onRequest(method, handler);
  }
  return {
    name: name3,
    config: config10,
    get state() {
      return state3;
    },
    get startTime() {
      return startTime;
    },
    get lastError() {
      return lastError;
    },
    get restartCount() {
      return restartCount;
    },
    start,
    stop,
    restart,
    isHealthy,
    sendRequest,
    sendNotification: sendNotification2,
    onNotification,
    onRequest
  };
}
function withTimeout(promise3, ms, message) {
  let timer, timeoutPromise = new Promise((_, reject2) => {
    timer = setTimeout((rej, msg) => rej(Error(msg)), ms, reject2, message);
  });
  return Promise.race([promise3, timeoutPromise]).finally(() => clearTimeout(timer));
}
var LSP_ERROR_CONTENT_MODIFIED = -32801, MAX_RETRIES_FOR_TRANSIENT_ERRORS = 3, RETRY_BASE_DELAY_MS = 500;
var init_LSPServerInstance = __esm(() => {
  init_cwd2();
  init_debug();
  init_errors();
  init_log3();
});
