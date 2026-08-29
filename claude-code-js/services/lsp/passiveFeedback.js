// Original: src/services/lsp/passiveFeedback.ts
import { fileURLToPath as fileURLToPath6 } from "url";
function mapLSPSeverity(lspSeverity) {
  switch (lspSeverity) {
    case 1:
      return "Error";
    case 2:
      return "Warning";
    case 3:
      return "Info";
    case 4:
      return "Hint";
    default:
      return "Error";
  }
}
function formatDiagnosticsForAttachment(params) {
  let uri7;
  try {
    uri7 = params.uri.startsWith("file://") ? fileURLToPath6(params.uri) : params.uri;
  } catch (error44) {
    let err2 = toError(error44);
    logError2(err2), logForDebugging(`Failed to convert URI to file path: ${params.uri}. Error: ${err2.message}. Using original URI as fallback.`), uri7 = params.uri;
  }
  let diagnostics = params.diagnostics.map((diag10) => ({
    message: diag10.message,
    severity: mapLSPSeverity(diag10.severity),
    range: {
      start: {
        line: diag10.range.start.line,
        character: diag10.range.start.character
      },
      end: {
        line: diag10.range.end.line,
        character: diag10.range.end.character
      }
    },
    source: diag10.source,
    code: diag10.code !== void 0 && diag10.code !== null ? String(diag10.code) : void 0
  }));
  return [
    {
      uri: uri7,
      diagnostics
    }
  ];
}
function registerLSPNotificationHandlers(manager7) {
  let servers = manager7.getAllServers(), registrationErrors = [], successCount = 0, diagnosticFailures = /* @__PURE__ */ new Map;
  for (let [serverName, serverInstance] of servers.entries())
    try {
      if (!serverInstance || typeof serverInstance.onNotification !== "function") {
        let errorMsg = !serverInstance ? "Server instance is null/undefined" : "Server instance has no onNotification method";
        registrationErrors.push({ serverName, error: errorMsg });
        let err2 = Error(`${errorMsg} for ${serverName}`);
        logError2(err2), logForDebugging(`Skipping handler registration for ${serverName}: ${errorMsg}`);
        continue;
      }
      serverInstance.onNotification("textDocument/publishDiagnostics", (params) => {
        logForDebugging(`[PASSIVE DIAGNOSTICS] Handler invoked for ${serverName}! Params type: ${typeof params}`);
        try {
          if (!params || typeof params !== "object" || !("uri" in params) || !("diagnostics" in params)) {
            let err2 = Error(`LSP server ${serverName} sent invalid diagnostic params (missing uri or diagnostics)`);
            logError2(err2), logForDebugging(`Invalid diagnostic params from ${serverName}: ${jsonStringify(params)}`);
            return;
          }
          let diagnosticParams = params;
          logForDebugging(`Received diagnostics from ${serverName}: ${diagnosticParams.diagnostics.length} diagnostic(s) for ${diagnosticParams.uri}`);
          let diagnosticFiles = formatDiagnosticsForAttachment(diagnosticParams), firstFile = diagnosticFiles[0];
          if (!firstFile || diagnosticFiles.length === 0 || firstFile.diagnostics.length === 0) {
            logForDebugging(`Skipping empty diagnostics from ${serverName} for ${diagnosticParams.uri}`);
            return;
          }
          try {
            registerPendingLSPDiagnostic({
              serverName,
              files: diagnosticFiles
            }), logForDebugging(`LSP Diagnostics: Registered ${diagnosticFiles.length} diagnostic file(s) from ${serverName} for async delivery`), diagnosticFailures.delete(serverName);
          } catch (error44) {
            let err2 = toError(error44);
            logError2(err2), logForDebugging(`Error registering LSP diagnostics from ${serverName}: URI: ${diagnosticParams.uri}, Diagnostic count: ${firstFile.diagnostics.length}, Error: ${err2.message}`);
            let failures = diagnosticFailures.get(serverName) || {
              count: 0,
              lastError: ""
            };
            if (failures.count++, failures.lastError = err2.message, diagnosticFailures.set(serverName, failures), failures.count >= 3)
              logForDebugging(`WARNING: LSP diagnostic handler for ${serverName} has failed ${failures.count} times consecutively. Last error: ${failures.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`);
          }
        } catch (error44) {
          let err2 = toError(error44);
          logError2(err2), logForDebugging(`Unexpected error processing diagnostics from ${serverName}: ${err2.message}`);
          let failures = diagnosticFailures.get(serverName) || {
            count: 0,
            lastError: ""
          };
          if (failures.count++, failures.lastError = err2.message, diagnosticFailures.set(serverName, failures), failures.count >= 3)
            logForDebugging(`WARNING: LSP diagnostic handler for ${serverName} has failed ${failures.count} times consecutively. Last error: ${failures.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`);
        }
      }), logForDebugging(`Registered diagnostics handler for ${serverName}`), successCount++;
    } catch (error44) {
      let err2 = toError(error44);
      registrationErrors.push({
        serverName,
        error: err2.message
      }), logError2(err2), logForDebugging(`Failed to register diagnostics handler for ${serverName}: Error: ${err2.message}`);
    }
  let totalServers = servers.size;
  if (registrationErrors.length > 0) {
    let failedServers = registrationErrors.map((e) => `${e.serverName} (${e.error})`).join(", ");
    logError2(Error(`Failed to register diagnostics for ${registrationErrors.length} LSP server(s): ${failedServers}`)), logForDebugging(`LSP notification handler registration: ${successCount}/${totalServers} succeeded. Failed servers: ${failedServers}. Diagnostics from failed servers will not be delivered.`);
  } else
    logForDebugging(`LSP notification handlers registered successfully for all ${totalServers} server(s)`);
  return {
    totalServers,
    successCount,
    registrationErrors,
    diagnosticFailures
  };
}
var init_passiveFeedback = __esm(() => {
  init_debug();
  init_errors();
  init_log3();
  init_slowOperations();
  init_LSPDiagnosticRegistry();
});
