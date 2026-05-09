// Original: src/tools/LSPTool/formatters.ts
import { relative as relative18 } from "path";
function formatUri2(uri7, cwd2) {
  if (!uri7)
    return logForDebugging("formatUri called with undefined URI - indicates malformed LSP server response", { level: "warn" }), "<unknown location>";
  let filePath = uri7.replace(/^file:\/\//, "");
  if (/^\/[A-Za-z]:/.test(filePath))
    filePath = filePath.slice(1);
  try {
    filePath = decodeURIComponent(filePath);
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    logForDebugging(`Failed to decode LSP URI '${uri7}': ${errorMsg}. Using un-decoded path: ${filePath}`, { level: "warn" });
  }
  if (cwd2) {
    let relativePath = relative18(cwd2, filePath).replaceAll("\\", "/");
    if (relativePath.length < filePath.length && !relativePath.startsWith("../../"))
      return relativePath;
  }
  return filePath.replaceAll("\\", "/");
}
function groupByFile(items, cwd2) {
  let byFile = /* @__PURE__ */ new Map;
  for (let item of items) {
    let uri7 = "uri" in item ? item.uri : item.location.uri, filePath = formatUri2(uri7, cwd2), existingItems = byFile.get(filePath);
    if (existingItems)
      existingItems.push(item);
    else
      byFile.set(filePath, [item]);
  }
  return byFile;
}
function formatLocation(location, cwd2) {
  let filePath = formatUri2(location.uri, cwd2), line = location.range.start.line + 1, character = location.range.start.character + 1;
  return `${filePath}:${line}:${character}`;
}
function locationLinkToLocation(link5) {
  return {
    uri: link5.targetUri,
    range: link5.targetSelectionRange || link5.targetRange
  };
}
function isLocationLink(item) {
  return "targetUri" in item;
}
function formatGoToDefinitionResult(result, cwd2) {
  if (!result)
    return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
  if (Array.isArray(result)) {
    let locations = result.map((item) => isLocationLink(item) ? locationLinkToLocation(item) : item), invalidLocations = locations.filter((loc) => !loc || !loc.uri);
    if (invalidLocations.length > 0)
      logForDebugging(`formatGoToDefinitionResult: Filtering out ${invalidLocations.length} invalid location(s) - this should have been caught earlier`, { level: "warn" });
    let validLocations = locations.filter((loc) => loc && loc.uri);
    if (validLocations.length === 0)
      return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
    if (validLocations.length === 1)
      return `Defined in ${formatLocation(validLocations[0], cwd2)}`;
    let locationList = validLocations.map((loc) => `  ${formatLocation(loc, cwd2)}`).join(`
`);
    return `Found ${validLocations.length} definitions:
${locationList}`;
  }
  let location = isLocationLink(result) ? locationLinkToLocation(result) : result;
  return `Defined in ${formatLocation(location, cwd2)}`;
}
function formatFindReferencesResult(result, cwd2) {
  if (!result || result.length === 0)
    return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
  let invalidLocations = result.filter((loc) => !loc || !loc.uri);
  if (invalidLocations.length > 0)
    logForDebugging(`formatFindReferencesResult: Filtering out ${invalidLocations.length} invalid location(s) - this should have been caught earlier`, { level: "warn" });
  let validLocations = result.filter((loc) => loc && loc.uri);
  if (validLocations.length === 0)
    return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
  if (validLocations.length === 1)
    return `Found 1 reference:
  ${formatLocation(validLocations[0], cwd2)}`;
  let byFile = groupByFile(validLocations, cwd2), lines2 = [
    `Found ${validLocations.length} references across ${byFile.size} files:`
  ];
  for (let [filePath, locations] of byFile) {
    lines2.push(`
${filePath}:`);
    for (let loc of locations) {
      let line = loc.range.start.line + 1, character = loc.range.start.character + 1;
      lines2.push(`  Line ${line}:${character}`);
    }
  }
  return lines2.join(`
`);
}
function extractMarkupText(contents) {
  if (Array.isArray(contents))
    return contents.map((item) => {
      if (typeof item === "string")
        return item;
      return item.value;
    }).join(`

`);
  if (typeof contents === "string")
    return contents;
  if ("kind" in contents)
    return contents.value;
  return contents.value;
}
function formatHoverResult(result, _cwd) {
  if (!result)
    return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
  let content = extractMarkupText(result.contents);
  if (result.range) {
    let line = result.range.start.line + 1, character = result.range.start.character + 1;
    return `Hover info at ${line}:${character}:

${content}`;
  }
  return content;
}
function symbolKindToString(kind) {
  return {
    [1]: "File",
    [2]: "Module",
    [3]: "Namespace",
    [4]: "Package",
    [5]: "Class",
    [6]: "Method",
    [7]: "Property",
    [8]: "Field",
    [9]: "Constructor",
    [10]: "Enum",
    [11]: "Interface",
    [12]: "Function",
    [13]: "Variable",
    [14]: "Constant",
    [15]: "String",
    [16]: "Number",
    [17]: "Boolean",
    [18]: "Array",
    [19]: "Object",
    [20]: "Key",
    [21]: "Null",
    [22]: "EnumMember",
    [23]: "Struct",
    [24]: "Event",
    [25]: "Operator",
    [26]: "TypeParameter"
  }[kind] || "Unknown";
}
function formatDocumentSymbolNode(symbol2, indent = 0) {
  let lines2 = [], prefix = "  ".repeat(indent), kind = symbolKindToString(symbol2.kind), line = `${prefix}${symbol2.name} (${kind})`;
  if (symbol2.detail)
    line += ` ${symbol2.detail}`;
  let symbolLine = symbol2.range.start.line + 1;
  if (line += ` - Line ${symbolLine}`, lines2.push(line), symbol2.children && symbol2.children.length > 0)
    for (let child of symbol2.children)
      lines2.push(...formatDocumentSymbolNode(child, indent + 1));
  return lines2;
}
function formatDocumentSymbolResult(result, cwd2) {
  if (!result || result.length === 0)
    return "No symbols found in document. This may occur if the file is empty, not supported by the LSP server, or if the server has not fully indexed the file.";
  let firstSymbol = result[0];
  if (firstSymbol && "location" in firstSymbol)
    return formatWorkspaceSymbolResult(result, cwd2);
  let lines2 = ["Document symbols:"];
  for (let symbol2 of result)
    lines2.push(...formatDocumentSymbolNode(symbol2));
  return lines2.join(`
`);
}
function formatWorkspaceSymbolResult(result, cwd2) {
  if (!result || result.length === 0)
    return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
  let invalidSymbols = result.filter((sym) => !sym || !sym.location || !sym.location.uri);
  if (invalidSymbols.length > 0)
    logForDebugging(`formatWorkspaceSymbolResult: Filtering out ${invalidSymbols.length} invalid symbol(s) - this should have been caught earlier`, { level: "warn" });
  let validSymbols = result.filter((sym) => sym && sym.location && sym.location.uri);
  if (validSymbols.length === 0)
    return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
  let lines2 = [
    `Found ${validSymbols.length} ${plural(validSymbols.length, "symbol")} in workspace:`
  ], byFile = groupByFile(validSymbols, cwd2);
  for (let [filePath, symbols] of byFile) {
    lines2.push(`
${filePath}:`);
    for (let symbol2 of symbols) {
      let kind = symbolKindToString(symbol2.kind), line = symbol2.location.range.start.line + 1, symbolLine = `  ${symbol2.name} (${kind}) - Line ${line}`;
      if (symbol2.containerName)
        symbolLine += ` in ${symbol2.containerName}`;
      lines2.push(symbolLine);
    }
  }
  return lines2.join(`
`);
}
function formatCallHierarchyItem(item, cwd2) {
  if (!item.uri)
    return logForDebugging("formatCallHierarchyItem: CallHierarchyItem has undefined URI", { level: "warn" }), `${item.name} (${symbolKindToString(item.kind)}) - <unknown location>`;
  let filePath = formatUri2(item.uri, cwd2), line = item.range.start.line + 1, kind = symbolKindToString(item.kind), result = `${item.name} (${kind}) - ${filePath}:${line}`;
  if (item.detail)
    result += ` [${item.detail}]`;
  return result;
}
function formatPrepareCallHierarchyResult(result, cwd2) {
  if (!result || result.length === 0)
    return "No call hierarchy item found at this position";
  if (result.length === 1)
    return `Call hierarchy item: ${formatCallHierarchyItem(result[0], cwd2)}`;
  let lines2 = [`Found ${result.length} call hierarchy items:`];
  for (let item of result)
    lines2.push(`  ${formatCallHierarchyItem(item, cwd2)}`);
  return lines2.join(`
`);
}
function formatIncomingCallsResult(result, cwd2) {
  if (!result || result.length === 0)
    return "No incoming calls found (nothing calls this function)";
  let lines2 = [
    `Found ${result.length} incoming ${plural(result.length, "call")}:`
  ], byFile = /* @__PURE__ */ new Map;
  for (let call5 of result) {
    if (!call5.from) {
      logForDebugging("formatIncomingCallsResult: CallHierarchyIncomingCall has undefined from field", { level: "warn" });
      continue;
    }
    let filePath = formatUri2(call5.from.uri, cwd2), existing = byFile.get(filePath);
    if (existing)
      existing.push(call5);
    else
      byFile.set(filePath, [call5]);
  }
  for (let [filePath, calls] of byFile) {
    lines2.push(`
${filePath}:`);
    for (let call5 of calls) {
      if (!call5.from)
        continue;
      let kind = symbolKindToString(call5.from.kind), line = call5.from.range.start.line + 1, callLine = `  ${call5.from.name} (${kind}) - Line ${line}`;
      if (call5.fromRanges && call5.fromRanges.length > 0) {
        let callSites = call5.fromRanges.map((r4) => `${r4.start.line + 1}:${r4.start.character + 1}`).join(", ");
        callLine += ` [calls at: ${callSites}]`;
      }
      lines2.push(callLine);
    }
  }
  return lines2.join(`
`);
}
function formatOutgoingCallsResult(result, cwd2) {
  if (!result || result.length === 0)
    return "No outgoing calls found (this function calls nothing)";
  let lines2 = [
    `Found ${result.length} outgoing ${plural(result.length, "call")}:`
  ], byFile = /* @__PURE__ */ new Map;
  for (let call5 of result) {
    if (!call5.to) {
      logForDebugging("formatOutgoingCallsResult: CallHierarchyOutgoingCall has undefined to field", { level: "warn" });
      continue;
    }
    let filePath = formatUri2(call5.to.uri, cwd2), existing = byFile.get(filePath);
    if (existing)
      existing.push(call5);
    else
      byFile.set(filePath, [call5]);
  }
  for (let [filePath, calls] of byFile) {
    lines2.push(`
${filePath}:`);
    for (let call5 of calls) {
      if (!call5.to)
        continue;
      let kind = symbolKindToString(call5.to.kind), line = call5.to.range.start.line + 1, callLine = `  ${call5.to.name} (${kind}) - Line ${line}`;
      if (call5.fromRanges && call5.fromRanges.length > 0) {
        let callSites = call5.fromRanges.map((r4) => `${r4.start.line + 1}:${r4.start.character + 1}`).join(", ");
        callLine += ` [called from: ${callSites}]`;
      }
      lines2.push(callLine);
    }
  }
  return lines2.join(`
`);
}
var init_formatters = __esm(() => {
  init_debug();
  init_errors();
});
