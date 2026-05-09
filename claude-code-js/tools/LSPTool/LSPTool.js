// Original: src/tools/LSPTool/LSPTool.ts
import { open as open11 } from "fs/promises";
import * as path19 from "path";
import { pathToFileURL as pathToFileURL6 } from "url";
function getMethodAndParams(input, absolutePath) {
  let uri7 = pathToFileURL6(absolutePath).href, position = {
    line: input.line - 1,
    character: input.character - 1
  };
  switch (input.operation) {
    case "goToDefinition":
      return {
        method: "textDocument/definition",
        params: {
          textDocument: { uri: uri7 },
          position
        }
      };
    case "findReferences":
      return {
        method: "textDocument/references",
        params: {
          textDocument: { uri: uri7 },
          position,
          context: { includeDeclaration: !0 }
        }
      };
    case "hover":
      return {
        method: "textDocument/hover",
        params: {
          textDocument: { uri: uri7 },
          position
        }
      };
    case "documentSymbol":
      return {
        method: "textDocument/documentSymbol",
        params: {
          textDocument: { uri: uri7 }
        }
      };
    case "workspaceSymbol":
      return {
        method: "workspace/symbol",
        params: {
          query: ""
        }
      };
    case "goToImplementation":
      return {
        method: "textDocument/implementation",
        params: {
          textDocument: { uri: uri7 },
          position
        }
      };
    case "prepareCallHierarchy":
      return {
        method: "textDocument/prepareCallHierarchy",
        params: {
          textDocument: { uri: uri7 },
          position
        }
      };
    case "incomingCalls":
      return {
        method: "textDocument/prepareCallHierarchy",
        params: {
          textDocument: { uri: uri7 },
          position
        }
      };
    case "outgoingCalls":
      return {
        method: "textDocument/prepareCallHierarchy",
        params: {
          textDocument: { uri: uri7 },
          position
        }
      };
  }
}
function countSymbols(symbols) {
  let count3 = symbols.length;
  for (let symbol2 of symbols)
    if (symbol2.children && symbol2.children.length > 0)
      count3 += countSymbols(symbol2.children);
  return count3;
}
function countUniqueFiles(locations) {
  return new Set(locations.map((loc) => loc.uri)).size;
}
function uriToFilePath(uri7) {
  let filePath = uri7.replace(/^file:\/\//, "");
  if (/^\/[A-Za-z]:/.test(filePath))
    filePath = filePath.slice(1);
  try {
    filePath = decodeURIComponent(filePath);
  } catch {}
  return filePath;
}
async function filterGitIgnoredLocations(locations, cwd2) {
  if (locations.length === 0)
    return locations;
  let uriToPath = /* @__PURE__ */ new Map;
  for (let loc of locations)
    if (loc.uri && !uriToPath.has(loc.uri))
      uriToPath.set(loc.uri, uriToFilePath(loc.uri));
  let uniquePaths = uniq(uriToPath.values());
  if (uniquePaths.length === 0)
    return locations;
  let ignoredPaths = /* @__PURE__ */ new Set, BATCH_SIZE = 50;
  for (let i5 = 0;i5 < uniquePaths.length; i5 += BATCH_SIZE) {
    let batch = uniquePaths.slice(i5, i5 + BATCH_SIZE), result = await execFileNoThrowWithCwd("git", ["check-ignore", ...batch], {
      cwd: cwd2,
      preserveOutputOnError: !1,
      timeout: 5000
    });
    if (result.code === 0 && result.stdout)
      for (let line of result.stdout.split(`
`)) {
        let trimmed = line.trim();
        if (trimmed)
          ignoredPaths.add(trimmed);
      }
  }
  if (ignoredPaths.size === 0)
    return locations;
  return locations.filter((loc) => {
    let filePath = uriToPath.get(loc.uri);
    return !filePath || !ignoredPaths.has(filePath);
  });
}
function isLocationLink2(item) {
  return "targetUri" in item;
}
function toLocation(item) {
  if (isLocationLink2(item))
    return {
      uri: item.targetUri,
      range: item.targetSelectionRange || item.targetRange
    };
  return item;
}
function formatResult(operation, result, cwd2) {
  switch (operation) {
    case "goToDefinition": {
      let locations = (Array.isArray(result) ? result : result ? [result] : []).map(toLocation), invalidLocations = locations.filter((loc) => !loc || !loc.uri);
      if (invalidLocations.length > 0)
        logError2(Error(`LSP server returned ${invalidLocations.length} location(s) with undefined URI for goToDefinition on ${cwd2}. This indicates malformed data from the LSP server.`));
      let validLocations = locations.filter((loc) => loc && loc.uri);
      return {
        formatted: formatGoToDefinitionResult(result, cwd2),
        resultCount: validLocations.length,
        fileCount: countUniqueFiles(validLocations)
      };
    }
    case "findReferences": {
      let locations = result || [], invalidLocations = locations.filter((loc) => !loc || !loc.uri);
      if (invalidLocations.length > 0)
        logError2(Error(`LSP server returned ${invalidLocations.length} location(s) with undefined URI for findReferences on ${cwd2}. This indicates malformed data from the LSP server.`));
      let validLocations = locations.filter((loc) => loc && loc.uri);
      return {
        formatted: formatFindReferencesResult(result, cwd2),
        resultCount: validLocations.length,
        fileCount: countUniqueFiles(validLocations)
      };
    }
    case "hover":
      return {
        formatted: formatHoverResult(result, cwd2),
        resultCount: result ? 1 : 0,
        fileCount: result ? 1 : 0
      };
    case "documentSymbol": {
      let symbols = result || [], count3 = symbols.length > 0 && symbols[0] && "range" in symbols[0] ? countSymbols(symbols) : symbols.length;
      return {
        formatted: formatDocumentSymbolResult(result, cwd2),
        resultCount: count3,
        fileCount: symbols.length > 0 ? 1 : 0
      };
    }
    case "workspaceSymbol": {
      let symbols = result || [], invalidSymbols = symbols.filter((sym) => !sym || !sym.location || !sym.location.uri);
      if (invalidSymbols.length > 0)
        logError2(Error(`LSP server returned ${invalidSymbols.length} symbol(s) with undefined location URI for workspaceSymbol on ${cwd2}. This indicates malformed data from the LSP server.`));
      let validSymbols = symbols.filter((sym) => sym && sym.location && sym.location.uri), locations = validSymbols.map((s2) => s2.location);
      return {
        formatted: formatWorkspaceSymbolResult(result, cwd2),
        resultCount: validSymbols.length,
        fileCount: countUniqueFiles(locations)
      };
    }
    case "goToImplementation": {
      let locations = (Array.isArray(result) ? result : result ? [result] : []).map(toLocation), invalidLocations = locations.filter((loc) => !loc || !loc.uri);
      if (invalidLocations.length > 0)
        logError2(Error(`LSP server returned ${invalidLocations.length} location(s) with undefined URI for goToImplementation on ${cwd2}. This indicates malformed data from the LSP server.`));
      let validLocations = locations.filter((loc) => loc && loc.uri);
      return {
        formatted: formatGoToDefinitionResult(result, cwd2),
        resultCount: validLocations.length,
        fileCount: countUniqueFiles(validLocations)
      };
    }
    case "prepareCallHierarchy": {
      let items = result || [];
      return {
        formatted: formatPrepareCallHierarchyResult(result, cwd2),
        resultCount: items.length,
        fileCount: items.length > 0 ? countUniqueFilesFromCallItems(items) : 0
      };
    }
    case "incomingCalls": {
      let calls = result || [];
      return {
        formatted: formatIncomingCallsResult(result, cwd2),
        resultCount: calls.length,
        fileCount: calls.length > 0 ? countUniqueFilesFromIncomingCalls(calls) : 0
      };
    }
    case "outgoingCalls": {
      let calls = result || [];
      return {
        formatted: formatOutgoingCallsResult(result, cwd2),
        resultCount: calls.length,
        fileCount: calls.length > 0 ? countUniqueFilesFromOutgoingCalls(calls) : 0
      };
    }
  }
}
function countUniqueFilesFromCallItems(items) {
  let validUris = items.map((item) => item.uri).filter((uri7) => uri7);
  return new Set(validUris).size;
}
function countUniqueFilesFromIncomingCalls(calls) {
  let validUris = calls.map((call5) => call5.from?.uri).filter((uri7) => uri7);
  return new Set(validUris).size;
}
function countUniqueFilesFromOutgoingCalls(calls) {
  let validUris = calls.map((call5) => call5.to?.uri).filter((uri7) => uri7);
  return new Set(validUris).size;
}
var MAX_LSP_FILE_SIZE_BYTES = 1e7, inputSchema26, outputSchema20, LSPTool;
var init_LSPTool = __esm(() => {
  init_v4();
  init_manager7();
  init_Tool();
  init_cwd2();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_fsOperations();
  init_log3();
  init_path2();
  init_filesystem();
  init_formatters();
  init_schemas6();
  init_UI18();
  inputSchema26 = lazySchema(() => exports_external.strictObject({
    operation: exports_external.enum([
      "goToDefinition",
      "findReferences",
      "hover",
      "documentSymbol",
      "workspaceSymbol",
      "goToImplementation",
      "prepareCallHierarchy",
      "incomingCalls",
      "outgoingCalls"
    ]).describe("The LSP operation to perform"),
    filePath: exports_external.string().describe("The absolute or relative path to the file"),
    line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
    character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
  })), outputSchema20 = lazySchema(() => exports_external.object({
    operation: exports_external.enum([
      "goToDefinition",
      "findReferences",
      "hover",
      "documentSymbol",
      "workspaceSymbol",
      "goToImplementation",
      "prepareCallHierarchy",
      "incomingCalls",
      "outgoingCalls"
    ]).describe("The LSP operation that was performed"),
    result: exports_external.string().describe("The formatted result of the LSP operation"),
    filePath: exports_external.string().describe("The file path the operation was performed on"),
    resultCount: exports_external.number().int().nonnegative().optional().describe("Number of results (definitions, references, symbols)"),
    fileCount: exports_external.number().int().nonnegative().optional().describe("Number of files containing results")
  })), LSPTool = buildTool({
    name: LSP_TOOL_NAME,
    searchHint: "code intelligence (definitions, references, symbols, hover)",
    maxResultSizeChars: 1e5,
    isLsp: !0,
    async description() {
      return DESCRIPTION12;
    },
    userFacingName: userFacingName6,
    shouldDefer: !0,
    isEnabled() {
      return isLspConnected();
    },
    get inputSchema() {
      return inputSchema26();
    },
    get outputSchema() {
      return outputSchema20();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    getPath({ filePath }) {
      return expandPath(filePath);
    },
    async validateInput(input) {
      let parseResult = lspToolInputSchema().safeParse(input);
      if (!parseResult.success)
        return {
          result: !1,
          message: `Invalid input: ${parseResult.error.message}`,
          errorCode: 3
        };
      let fs17 = getFsImplementation(), absolutePath = expandPath(input.filePath);
      if (absolutePath.startsWith("\\\\") || absolutePath.startsWith("//"))
        return { result: !0 };
      let stats;
      try {
        stats = await fs17.stat(absolutePath);
      } catch (error44) {
        if (isENOENT(error44))
          return {
            result: !1,
            message: `File does not exist: ${input.filePath}`,
            errorCode: 1
          };
        let err2 = toError(error44);
        return logError2(Error(`Failed to access file stats for LSP operation on ${input.filePath}: ${err2.message}`)), {
          result: !1,
          message: `Cannot access file: ${input.filePath}. ${err2.message}`,
          errorCode: 4
        };
      }
      if (!stats.isFile())
        return {
          result: !1,
          message: `Path is not a file: ${input.filePath}`,
          errorCode: 2
        };
      return { result: !0 };
    },
    async checkPermissions(input, context6) {
      let appState = context6.getAppState();
      return checkReadPermissionForTool(LSPTool, input, appState.toolPermissionContext);
    },
    async prompt() {
      return DESCRIPTION12;
    },
    renderToolUseMessage: renderToolUseMessage19,
    renderToolUseErrorMessage: renderToolUseErrorMessage10,
    renderToolResultMessage: renderToolResultMessage18,
    async call(input, _context) {
      let absolutePath = expandPath(input.filePath), cwd2 = getCwd();
      if (getInitializationStatus().status === "pending")
        await waitForInitialization();
      let manager7 = getLspServerManager();
      if (!manager7)
        return logError2(Error("LSP server manager not initialized when tool was called")), {
          data: {
            operation: input.operation,
            result: "LSP server manager not initialized. This may indicate a startup issue.",
            filePath: input.filePath
          }
        };
      let { method, params } = getMethodAndParams(input, absolutePath);
      try {
        if (!manager7.isFileOpen(absolutePath)) {
          let handle = await open11(absolutePath, "r");
          try {
            let stats = await handle.stat();
            if (stats.size > MAX_LSP_FILE_SIZE_BYTES)
              return { data: {
                operation: input.operation,
                result: `File too large for LSP analysis (${Math.ceil(stats.size / 1e6)}MB exceeds 10MB limit)`,
                filePath: input.filePath
              } };
            let fileContent = await handle.readFile({ encoding: "utf-8" });
            await manager7.openFile(absolutePath, fileContent);
          } finally {
            await handle.close();
          }
        }
        let result = await manager7.sendRequest(absolutePath, method, params);
        if (result === void 0)
          return logForDebugging(`No LSP server available for file type ${path19.extname(absolutePath)} for operation ${input.operation} on file ${input.filePath}`), {
            data: {
              operation: input.operation,
              result: `No LSP server available for file type: ${path19.extname(absolutePath)}`,
              filePath: input.filePath
            }
          };
        if (input.operation === "incomingCalls" || input.operation === "outgoingCalls") {
          let callItems = result;
          if (!callItems || callItems.length === 0)
            return { data: {
              operation: input.operation,
              result: "No call hierarchy item found at this position",
              filePath: input.filePath,
              resultCount: 0,
              fileCount: 0
            } };
          let callMethod = input.operation === "incomingCalls" ? "callHierarchy/incomingCalls" : "callHierarchy/outgoingCalls";
          if (result = await manager7.sendRequest(absolutePath, callMethod, {
            item: callItems[0]
          }), result === void 0)
            logForDebugging(`LSP server returned undefined for ${callMethod} on ${input.filePath}`);
        }
        if (result && Array.isArray(result) && (input.operation === "findReferences" || input.operation === "goToDefinition" || input.operation === "goToImplementation" || input.operation === "workspaceSymbol"))
          if (input.operation === "workspaceSymbol") {
            let symbols = result, locations = symbols.filter((s2) => s2?.location?.uri).map((s2) => s2.location), filteredLocations = await filterGitIgnoredLocations(locations, cwd2), filteredUris = new Set(filteredLocations.map((l3) => l3.uri));
            result = symbols.filter((s2) => !s2?.location?.uri || filteredUris.has(s2.location.uri));
          } else {
            let locations = result.map(toLocation), filteredLocations = await filterGitIgnoredLocations(locations, cwd2), filteredUris = new Set(filteredLocations.map((l3) => l3.uri));
            result = result.filter((item) => {
              let loc = toLocation(item);
              return !loc.uri || filteredUris.has(loc.uri);
            });
          }
        let { formatted, resultCount, fileCount } = formatResult(input.operation, result, cwd2);
        return {
          data: {
            operation: input.operation,
            result: formatted,
            filePath: input.filePath,
            resultCount,
            fileCount
          }
        };
      } catch (error44) {
        let errorMessage2 = toError(error44).message;
        return logError2(Error(`LSP tool request failed for ${input.operation} on ${input.filePath}: ${errorMessage2}`)), {
          data: {
            operation: input.operation,
            result: `Error performing ${input.operation}: ${errorMessage2}`,
            filePath: input.filePath
          }
        };
      }
    },
    mapToolResultToToolResultBlockParam(output, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: output.result
      };
    }
  });
});
