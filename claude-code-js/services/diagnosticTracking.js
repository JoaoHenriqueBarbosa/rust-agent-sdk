// Original: src/services/diagnosticTracking.ts
class DiagnosticTrackingService {
  static instance;
  baseline = /* @__PURE__ */ new Map;
  initialized = !1;
  mcpClient;
  lastProcessedTimestamps = /* @__PURE__ */ new Map;
  rightFileDiagnosticsState = /* @__PURE__ */ new Map;
  static getInstance() {
    if (!DiagnosticTrackingService.instance)
      DiagnosticTrackingService.instance = new DiagnosticTrackingService;
    return DiagnosticTrackingService.instance;
  }
  initialize(mcpClient) {
    if (this.initialized)
      return;
    this.mcpClient = mcpClient, this.initialized = !0;
  }
  async shutdown() {
    this.initialized = !1, this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear();
  }
  reset() {
    this.baseline.clear(), this.rightFileDiagnosticsState.clear(), this.lastProcessedTimestamps.clear();
  }
  normalizeFileUri(fileUri) {
    let protocolPrefixes = [
      "file://",
      "_claude_fs_right:",
      "_claude_fs_left:"
    ], normalized = fileUri;
    for (let prefix of protocolPrefixes)
      if (fileUri.startsWith(prefix)) {
        normalized = fileUri.slice(prefix.length);
        break;
      }
    return normalizePathForComparison(normalized);
  }
  async ensureFileOpened(fileUri) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected")
      return;
    try {
      await callIdeRpc("openFile", {
        filePath: fileUri,
        preview: !1,
        startText: "",
        endText: "",
        selectToEndOfLine: !1,
        makeFrontmost: !1
      }, this.mcpClient);
    } catch (error44) {
      logError2(error44);
    }
  }
  async beforeFileEdited(filePath) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected")
      return;
    let timestamp = Date.now();
    try {
      let result = await callIdeRpc("getDiagnostics", { uri: `file://${filePath}` }, this.mcpClient), diagnosticFile = this.parseDiagnosticResult(result)[0];
      if (diagnosticFile) {
        if (!pathsEqual(this.normalizeFileUri(filePath), this.normalizeFileUri(diagnosticFile.uri))) {
          logError2(new DiagnosticsTrackingError(`Diagnostics file path mismatch: expected ${filePath}, got ${diagnosticFile.uri})`));
          return;
        }
        let normalizedPath = this.normalizeFileUri(filePath);
        this.baseline.set(normalizedPath, diagnosticFile.diagnostics), this.lastProcessedTimestamps.set(normalizedPath, timestamp);
      } else {
        let normalizedPath = this.normalizeFileUri(filePath);
        this.baseline.set(normalizedPath, []), this.lastProcessedTimestamps.set(normalizedPath, timestamp);
      }
    } catch (_error) {}
  }
  async getNewDiagnostics() {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected")
      return [];
    let allDiagnosticFiles = [];
    try {
      let result = await callIdeRpc("getDiagnostics", {}, this.mcpClient);
      allDiagnosticFiles = this.parseDiagnosticResult(result);
    } catch (_error) {
      return [];
    }
    let diagnosticsForFileUrisWithBaselines = allDiagnosticFiles.filter((file2) => this.baseline.has(this.normalizeFileUri(file2.uri))).filter((file2) => file2.uri.startsWith("file://")), diagnosticsForClaudeFsRightUrisWithBaselinesMap = /* @__PURE__ */ new Map;
    allDiagnosticFiles.filter((file2) => this.baseline.has(this.normalizeFileUri(file2.uri))).filter((file2) => file2.uri.startsWith("_claude_fs_right:")).forEach((file2) => {
      diagnosticsForClaudeFsRightUrisWithBaselinesMap.set(this.normalizeFileUri(file2.uri), file2);
    });
    let newDiagnosticFiles = [];
    for (let file2 of diagnosticsForFileUrisWithBaselines) {
      let normalizedPath = this.normalizeFileUri(file2.uri), baselineDiagnostics = this.baseline.get(normalizedPath) || [], claudeFsRightFile = diagnosticsForClaudeFsRightUrisWithBaselinesMap.get(normalizedPath), fileToUse = file2;
      if (claudeFsRightFile) {
        let previousRightDiagnostics = this.rightFileDiagnosticsState.get(normalizedPath);
        if (!previousRightDiagnostics || !this.areDiagnosticArraysEqual(previousRightDiagnostics, claudeFsRightFile.diagnostics))
          fileToUse = claudeFsRightFile;
        this.rightFileDiagnosticsState.set(normalizedPath, claudeFsRightFile.diagnostics);
      }
      let newDiagnostics = fileToUse.diagnostics.filter((d) => !baselineDiagnostics.some((b) => this.areDiagnosticsEqual(d, b)));
      if (newDiagnostics.length > 0)
        newDiagnosticFiles.push({
          uri: file2.uri,
          diagnostics: newDiagnostics
        });
      this.baseline.set(normalizedPath, fileToUse.diagnostics);
    }
    return newDiagnosticFiles;
  }
  parseDiagnosticResult(result) {
    if (Array.isArray(result)) {
      let textBlock = result.find((block2) => block2.type === "text");
      if (textBlock && "text" in textBlock)
        return jsonParse(textBlock.text);
    }
    return [];
  }
  areDiagnosticsEqual(a2, b) {
    return a2.message === b.message && a2.severity === b.severity && a2.source === b.source && a2.code === b.code && a2.range.start.line === b.range.start.line && a2.range.start.character === b.range.start.character && a2.range.end.line === b.range.end.line && a2.range.end.character === b.range.end.character;
  }
  areDiagnosticArraysEqual(a2, b) {
    if (a2.length !== b.length)
      return !1;
    return a2.every((diagA) => b.some((diagB) => this.areDiagnosticsEqual(diagA, diagB))) && b.every((diagB) => a2.some((diagA) => this.areDiagnosticsEqual(diagA, diagB)));
  }
  async handleQueryStart(clients) {
    if (!this.initialized) {
      let connectedIdeClient = getConnectedIdeClient(clients);
      if (connectedIdeClient)
        this.initialize(connectedIdeClient);
    } else
      this.reset();
  }
  static formatDiagnosticsSummary(files2) {
    let result = files2.map((file2) => {
      let filename = file2.uri.split("/").pop() || file2.uri, diagnostics = file2.diagnostics.map((d) => {
        return `  ${DiagnosticTrackingService.getSeveritySymbol(d.severity)} [Line ${d.range.start.line + 1}:${d.range.start.character + 1}] ${d.message}${d.code ? ` [${d.code}]` : ""}${d.source ? ` (${d.source})` : ""}`;
      }).join(`
`);
      return `${filename}:
${diagnostics}`;
    }).join(`

`);
    if (result.length > MAX_DIAGNOSTICS_SUMMARY_CHARS)
      return result.slice(0, MAX_DIAGNOSTICS_SUMMARY_CHARS - 12) + "\u2026[truncated]";
    return result;
  }
  static getSeveritySymbol(severity) {
    return {
      Error: figures_default.cross,
      Warning: figures_default.warning,
      Info: figures_default.info,
      Hint: figures_default.star
    }[severity] || figures_default.bullet;
  }
}
var DiagnosticsTrackingError, MAX_DIAGNOSTICS_SUMMARY_CHARS = 4000, diagnosticTracker;
var init_diagnosticTracking = __esm(() => {
  init_figures();
  init_log3();
  init_client20();
  init_errors();
  init_file();
  init_ide();
  init_slowOperations();
  DiagnosticsTrackingError = class DiagnosticsTrackingError extends ClaudeError {
  };
  diagnosticTracker = DiagnosticTrackingService.getInstance();
});
