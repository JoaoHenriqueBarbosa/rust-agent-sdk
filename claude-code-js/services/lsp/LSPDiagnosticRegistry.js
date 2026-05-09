// Original: src/services/lsp/LSPDiagnosticRegistry.ts
import { randomUUID as randomUUID14 } from "crypto";
function registerPendingLSPDiagnostic({
  serverName,
  files: files2
}) {
  let diagnosticId = randomUUID14();
  logForDebugging(`LSP Diagnostics: Registering ${files2.length} diagnostic file(s) from ${serverName} (ID: ${diagnosticId})`), pendingDiagnostics.set(diagnosticId, {
    serverName,
    files: files2,
    timestamp: Date.now(),
    attachmentSent: !1
  });
}
function severityToNumber(severity) {
  switch (severity) {
    case "Error":
      return 1;
    case "Warning":
      return 2;
    case "Info":
      return 3;
    case "Hint":
      return 4;
    default:
      return 4;
  }
}
function createDiagnosticKey(diag10) {
  return jsonStringify({
    message: diag10.message,
    severity: diag10.severity,
    range: diag10.range,
    source: diag10.source || null,
    code: diag10.code || null
  });
}
function deduplicateDiagnosticFiles(allFiles) {
  let fileMap = /* @__PURE__ */ new Map, dedupedFiles = [];
  for (let file2 of allFiles) {
    if (!fileMap.has(file2.uri))
      fileMap.set(file2.uri, /* @__PURE__ */ new Set), dedupedFiles.push({ uri: file2.uri, diagnostics: [] });
    let seenDiagnostics = fileMap.get(file2.uri), dedupedFile = dedupedFiles.find((f) => f.uri === file2.uri), previouslyDelivered = deliveredDiagnostics.get(file2.uri) || /* @__PURE__ */ new Set;
    for (let diag10 of file2.diagnostics)
      try {
        let key2 = createDiagnosticKey(diag10);
        if (seenDiagnostics.has(key2) || previouslyDelivered.has(key2))
          continue;
        seenDiagnostics.add(key2), dedupedFile.diagnostics.push(diag10);
      } catch (error44) {
        let err2 = toError(error44), truncatedMessage = diag10.message?.substring(0, 100) || "<no message>";
        logError2(Error(`Failed to deduplicate diagnostic in ${file2.uri}: ${err2.message}. Diagnostic message: ${truncatedMessage}`)), dedupedFile.diagnostics.push(diag10);
      }
  }
  return dedupedFiles.filter((f) => f.diagnostics.length > 0);
}
function checkForLSPDiagnostics() {
  logForDebugging(`LSP Diagnostics: Checking registry - ${pendingDiagnostics.size} pending`);
  let allFiles = [], serverNames = /* @__PURE__ */ new Set, diagnosticsToMark = [];
  for (let diagnostic of pendingDiagnostics.values())
    if (!diagnostic.attachmentSent)
      allFiles.push(...diagnostic.files), serverNames.add(diagnostic.serverName), diagnosticsToMark.push(diagnostic);
  if (allFiles.length === 0)
    return [];
  let dedupedFiles;
  try {
    dedupedFiles = deduplicateDiagnosticFiles(allFiles);
  } catch (error44) {
    let err2 = toError(error44);
    logError2(Error(`Failed to deduplicate LSP diagnostics: ${err2.message}`)), dedupedFiles = allFiles;
  }
  for (let diagnostic of diagnosticsToMark)
    diagnostic.attachmentSent = !0;
  for (let [id, diagnostic] of pendingDiagnostics)
    if (diagnostic.attachmentSent)
      pendingDiagnostics.delete(id);
  let originalCount = allFiles.reduce((sum, f) => sum + f.diagnostics.length, 0), dedupedCount = dedupedFiles.reduce((sum, f) => sum + f.diagnostics.length, 0);
  if (originalCount > dedupedCount)
    logForDebugging(`LSP Diagnostics: Deduplication removed ${originalCount - dedupedCount} duplicate diagnostic(s)`);
  let totalDiagnostics = 0, truncatedCount = 0;
  for (let file2 of dedupedFiles) {
    if (file2.diagnostics.sort((a2, b) => severityToNumber(a2.severity) - severityToNumber(b.severity)), file2.diagnostics.length > MAX_DIAGNOSTICS_PER_FILE)
      truncatedCount += file2.diagnostics.length - MAX_DIAGNOSTICS_PER_FILE, file2.diagnostics = file2.diagnostics.slice(0, MAX_DIAGNOSTICS_PER_FILE);
    let remainingCapacity = MAX_TOTAL_DIAGNOSTICS - totalDiagnostics;
    if (file2.diagnostics.length > remainingCapacity)
      truncatedCount += file2.diagnostics.length - remainingCapacity, file2.diagnostics = file2.diagnostics.slice(0, remainingCapacity);
    totalDiagnostics += file2.diagnostics.length;
  }
  if (dedupedFiles = dedupedFiles.filter((f) => f.diagnostics.length > 0), truncatedCount > 0)
    logForDebugging(`LSP Diagnostics: Volume limiting removed ${truncatedCount} diagnostic(s) (max ${MAX_DIAGNOSTICS_PER_FILE}/file, ${MAX_TOTAL_DIAGNOSTICS} total)`);
  for (let file2 of dedupedFiles) {
    if (!deliveredDiagnostics.has(file2.uri))
      deliveredDiagnostics.set(file2.uri, /* @__PURE__ */ new Set);
    let delivered = deliveredDiagnostics.get(file2.uri);
    for (let diag10 of file2.diagnostics)
      try {
        delivered.add(createDiagnosticKey(diag10));
      } catch (error44) {
        let err2 = toError(error44), truncatedMessage = diag10.message?.substring(0, 100) || "<no message>";
        logError2(Error(`Failed to track delivered diagnostic in ${file2.uri}: ${err2.message}. Diagnostic message: ${truncatedMessage}`));
      }
  }
  let finalCount = dedupedFiles.reduce((sum, f) => sum + f.diagnostics.length, 0);
  if (finalCount === 0)
    return logForDebugging("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)"), [];
  return logForDebugging(`LSP Diagnostics: Delivering ${dedupedFiles.length} file(s) with ${finalCount} diagnostic(s) from ${serverNames.size} server(s)`), [
    {
      serverName: Array.from(serverNames).join(", "),
      files: dedupedFiles
    }
  ];
}
function clearAllLSPDiagnostics() {
  logForDebugging(`LSP Diagnostics: Clearing ${pendingDiagnostics.size} pending diagnostic(s)`), pendingDiagnostics.clear();
}
function resetAllLSPDiagnosticState() {
  logForDebugging(`LSP Diagnostics: Resetting all state (${pendingDiagnostics.size} pending, ${deliveredDiagnostics.size} files tracked)`), pendingDiagnostics.clear(), deliveredDiagnostics.clear();
}
function clearDeliveredDiagnosticsForFile(fileUri) {
  if (deliveredDiagnostics.has(fileUri))
    logForDebugging(`LSP Diagnostics: Clearing delivered diagnostics for ${fileUri}`), deliveredDiagnostics.delete(fileUri);
}
var MAX_DIAGNOSTICS_PER_FILE = 10, MAX_TOTAL_DIAGNOSTICS = 30, MAX_DELIVERED_FILES = 500, pendingDiagnostics, deliveredDiagnostics;
var init_LSPDiagnosticRegistry = __esm(() => {
  init_index_min();
  init_debug();
  init_errors();
  init_log3();
  init_slowOperations();
  pendingDiagnostics = /* @__PURE__ */ new Map, deliveredDiagnostics = new L({
    max: MAX_DELIVERED_FILES
  });
});
