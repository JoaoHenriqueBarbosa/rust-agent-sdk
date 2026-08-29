// Original: src/services/lsp/manager.ts
function getLspServerManager() {
  if (initializationState === "failed")
    return;
  return lspManagerInstance;
}
function getInitializationStatus() {
  if (initializationState === "failed")
    return {
      status: "failed",
      error: initializationError || Error("Initialization failed")
    };
  if (initializationState === "not-started")
    return { status: "not-started" };
  if (initializationState === "pending")
    return { status: "pending" };
  return { status: "success" };
}
function isLspConnected() {
  if (initializationState === "failed")
    return !1;
  let manager7 = getLspServerManager();
  if (!manager7)
    return !1;
  let servers = manager7.getAllServers();
  if (servers.size === 0)
    return !1;
  for (let server of servers.values())
    if (server.state !== "error")
      return !0;
  return !1;
}
async function waitForInitialization() {
  if (initializationState === "success" || initializationState === "failed")
    return;
  if (initializationState === "pending" && initializationPromise3)
    await initializationPromise3;
}
function initializeLspServerManager() {
  if (isBareMode())
    return;
  if (logForDebugging("[LSP MANAGER] initializeLspServerManager() called"), lspManagerInstance !== void 0 && initializationState !== "failed") {
    logForDebugging("[LSP MANAGER] Already initialized or initializing, skipping");
    return;
  }
  if (initializationState === "failed")
    lspManagerInstance = void 0, initializationError = void 0;
  lspManagerInstance = createLSPServerManager(), initializationState = "pending", logForDebugging("[LSP MANAGER] Created manager instance, state=pending");
  let currentGeneration = ++initializationGeneration;
  logForDebugging(`[LSP MANAGER] Starting async initialization (generation ${currentGeneration})`), initializationPromise3 = lspManagerInstance.initialize().then(() => {
    if (currentGeneration === initializationGeneration) {
      if (initializationState = "success", logForDebugging("LSP server manager initialized successfully"), lspManagerInstance)
        registerLSPNotificationHandlers(lspManagerInstance);
    }
  }).catch((error44) => {
    if (currentGeneration === initializationGeneration)
      initializationState = "failed", initializationError = error44, lspManagerInstance = void 0, logError2(error44), logForDebugging(`Failed to initialize LSP server manager: ${errorMessage(error44)}`);
  });
}
function reinitializeLspServerManager() {
  if (initializationState === "not-started")
    return;
  if (logForDebugging("[LSP MANAGER] reinitializeLspServerManager() called"), lspManagerInstance)
    lspManagerInstance.shutdown().catch((err2) => {
      logForDebugging(`[LSP MANAGER] old instance shutdown during reinit failed: ${errorMessage(err2)}`);
    });
  lspManagerInstance = void 0, initializationState = "not-started", initializationError = void 0, initializeLspServerManager();
}
async function shutdownLspServerManager() {
  if (lspManagerInstance === void 0)
    return;
  try {
    await lspManagerInstance.shutdown(), logForDebugging("LSP server manager shut down successfully");
  } catch (error44) {
    logError2(error44), logForDebugging(`Failed to shutdown LSP server manager: ${errorMessage(error44)}`);
  } finally {
    lspManagerInstance = void 0, initializationState = "not-started", initializationError = void 0, initializationPromise3 = void 0, initializationGeneration++;
  }
}
var lspManagerInstance, initializationState = "not-started", initializationError, initializationGeneration = 0, initializationPromise3;
var init_manager7 = __esm(() => {
  init_debug();
  init_envUtils();
  init_errors();
  init_log3();
  init_LSPServerManager();
  init_passiveFeedback();
});
