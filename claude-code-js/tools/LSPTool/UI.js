// Original: src/tools/LSPTool/UI.tsx
function LSPResultSummary(t0) {
  let $3 = import_compiler_runtime121.c(24), {
    operation,
    resultCount,
    fileCount,
    content,
    verbose
  } = t0, t1;
  if ($3[0] !== operation)
    t1 = OPERATION_LABELS[operation] || {
      singular: "result",
      plural: "results"
    }, $3[0] = operation, $3[1] = t1;
  else
    t1 = $3[1];
  let labelConfig = t1, countLabel = resultCount === 1 ? labelConfig.singular : labelConfig.plural, t2;
  if ($3[2] !== countLabel || $3[3] !== labelConfig.special || $3[4] !== operation || $3[5] !== resultCount)
    t2 = operation === "hover" && resultCount > 0 && labelConfig.special ? /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
      children: [
        "Hover info ",
        labelConfig.special
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
      children: [
        "Found ",
        /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
          bold: !0,
          children: [
            resultCount,
            " "
          ]
        }, void 0, !0, void 0, this),
        countLabel
      ]
    }, void 0, !0, void 0, this), $3[2] = countLabel, $3[3] = labelConfig.special, $3[4] = operation, $3[5] = resultCount, $3[6] = t2;
  else
    t2 = $3[6];
  let primaryText = t2, t3;
  if ($3[7] !== fileCount)
    t3 = fileCount > 1 ? /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
      children: [
        " ",
        "across ",
        /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
          bold: !0,
          children: [
            fileCount,
            " "
          ]
        }, void 0, !0, void 0, this),
        "files"
      ]
    }, void 0, !0, void 0, this) : null, $3[7] = fileCount, $3[8] = t3;
  else
    t3 = $3[8];
  let secondaryText = t3;
  if (verbose) {
    let t42;
    if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\xA0\xA0\u23BF \xA0"
      }, void 0, !1, void 0, this), $3[9] = t42;
    else
      t42 = $3[9];
    let t52;
    if ($3[10] !== primaryText || $3[11] !== secondaryText)
      t52 = /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
          children: [
            t42,
            primaryText,
            secondaryText
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[10] = primaryText, $3[11] = secondaryText, $3[12] = t52;
    else
      t52 = $3[12];
    let t6;
    if ($3[13] !== content)
      t6 = /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedBox_default, {
        marginLeft: 5,
        children: /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
          children: content
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[13] = content, $3[14] = t6;
    else
      t6 = $3[14];
    let t7;
    if ($3[15] !== t52 || $3[16] !== t6)
      t7 = /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t52,
          t6
        ]
      }, void 0, !0, void 0, this), $3[15] = t52, $3[16] = t6, $3[17] = t7;
    else
      t7 = $3[17];
    return t7;
  }
  let t4;
  if ($3[18] !== resultCount)
    t4 = resultCount > 0 && /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this), $3[18] = resultCount, $3[19] = t4;
  else
    t4 = $3[19];
  let t5;
  if ($3[20] !== primaryText || $3[21] !== secondaryText || $3[22] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
        children: [
          primaryText,
          secondaryText,
          " ",
          t4
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[20] = primaryText, $3[21] = secondaryText, $3[22] = t4, $3[23] = t5;
  else
    t5 = $3[23];
  return t5;
}
function userFacingName6() {
  return "LSP";
}
function renderToolUseMessage19(input, {
  verbose
}) {
  if (!input.operation)
    return null;
  let parts = [];
  if ((input.operation === "goToDefinition" || input.operation === "findReferences" || input.operation === "hover" || input.operation === "goToImplementation") && input.filePath && input.line !== void 0 && input.character !== void 0) {
    let symbol2 = getSymbolAtPosition(input.filePath, input.line - 1, input.character - 1), displayPath = verbose ? input.filePath : getDisplayPath(input.filePath);
    if (symbol2)
      parts.push(`operation: "${input.operation}"`), parts.push(`symbol: "${symbol2}"`), parts.push(`in: "${displayPath}"`);
    else
      parts.push(`operation: "${input.operation}"`), parts.push(`file: "${displayPath}"`), parts.push(`position: ${input.line}:${input.character}`);
    return parts.join(", ");
  }
  if (parts.push(`operation: "${input.operation}"`), input.filePath) {
    let displayPath = verbose ? input.filePath : getDisplayPath(input.filePath);
    parts.push(`file: "${displayPath}"`);
  }
  return parts.join(", ");
}
function renderToolUseErrorMessage10(result, {
  verbose
}) {
  if (!verbose && typeof result === "string" && extractTag(result, "tool_use_error"))
    return /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
        color: "error",
        children: "LSP operation failed"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage18(output, _progressMessages, {
  verbose
}) {
  if (output.resultCount !== void 0 && output.fileCount !== void 0)
    return /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(LSPResultSummary, {
      operation: output.operation,
      resultCount: output.resultCount,
      fileCount: output.fileCount,
      content: output.result,
      verbose
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime145.jsxDEV(ThemedText, {
      children: output.result
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime121, jsx_dev_runtime145, OPERATION_LABELS;
var init_UI18 = __esm(() => {
  init_CtrlOToExpand();
  init_FallbackToolUseErrorMessage();
  init_MessageResponse();
  init_ink2();
  init_file();
  init_messages3();
  init_symbolContext();
  import_compiler_runtime121 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime145 = __toESM(require_react_jsx_dev_runtime_development(), 1), OPERATION_LABELS = {
    goToDefinition: {
      singular: "definition",
      plural: "definitions"
    },
    findReferences: {
      singular: "reference",
      plural: "references"
    },
    documentSymbol: {
      singular: "symbol",
      plural: "symbols"
    },
    workspaceSymbol: {
      singular: "symbol",
      plural: "symbols"
    },
    hover: {
      singular: "hover info",
      plural: "hover info",
      special: "available"
    },
    goToImplementation: {
      singular: "implementation",
      plural: "implementations"
    },
    prepareCallHierarchy: {
      singular: "call item",
      plural: "call items"
    },
    incomingCalls: {
      singular: "caller",
      plural: "callers"
    },
    outgoingCalls: {
      singular: "callee",
      plural: "callees"
    }
  };
});
