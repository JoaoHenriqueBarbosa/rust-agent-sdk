// Original: src/tools/GrepTool/UI.tsx
function SearchResultSummary(t0) {
  let $3 = import_compiler_runtime116.c(26), {
    count: count3,
    countLabel,
    secondaryCount,
    secondaryLabel,
    content,
    verbose
  } = t0, t1;
  if ($3[0] !== count3)
    t1 = /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
      bold: !0,
      children: [
        count3,
        " "
      ]
    }, void 0, !0, void 0, this), $3[0] = count3, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== count3 || $3[3] !== countLabel)
    t2 = count3 === 0 || count3 > 1 ? countLabel : countLabel.slice(0, -1), $3[2] = count3, $3[3] = countLabel, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== t1 || $3[6] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
      children: [
        "Found ",
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[5] = t1, $3[6] = t2, $3[7] = t3;
  else
    t3 = $3[7];
  let primaryText = t3, t4;
  if ($3[8] !== secondaryCount || $3[9] !== secondaryLabel)
    t4 = secondaryCount !== void 0 && secondaryLabel ? /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
      children: [
        " ",
        "across ",
        /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
          bold: !0,
          children: [
            secondaryCount,
            " "
          ]
        }, void 0, !0, void 0, this),
        secondaryCount === 0 || secondaryCount > 1 ? secondaryLabel : secondaryLabel.slice(0, -1)
      ]
    }, void 0, !0, void 0, this) : null, $3[8] = secondaryCount, $3[9] = secondaryLabel, $3[10] = t4;
  else
    t4 = $3[10];
  let secondaryText = t4;
  if (verbose) {
    let t52;
    if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\xA0\xA0\u23BF \xA0"
      }, void 0, !1, void 0, this), $3[11] = t52;
    else
      t52 = $3[11];
    let t62;
    if ($3[12] !== primaryText || $3[13] !== secondaryText)
      t62 = /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
          children: [
            t52,
            primaryText,
            secondaryText
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[12] = primaryText, $3[13] = secondaryText, $3[14] = t62;
    else
      t62 = $3[14];
    let t7;
    if ($3[15] !== content)
      t7 = /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedBox_default, {
        marginLeft: 5,
        children: /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
          children: content
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[15] = content, $3[16] = t7;
    else
      t7 = $3[16];
    let t8;
    if ($3[17] !== t62 || $3[18] !== t7)
      t8 = /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t62,
          t7
        ]
      }, void 0, !0, void 0, this), $3[17] = t62, $3[18] = t7, $3[19] = t8;
    else
      t8 = $3[19];
    return t8;
  }
  let t5;
  if ($3[20] !== count3)
    t5 = count3 > 0 && /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this), $3[20] = count3, $3[21] = t5;
  else
    t5 = $3[21];
  let t6;
  if ($3[22] !== primaryText || $3[23] !== secondaryText || $3[24] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
        children: [
          primaryText,
          secondaryText,
          " ",
          t5
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[22] = primaryText, $3[23] = secondaryText, $3[24] = t5, $3[25] = t6;
  else
    t6 = $3[25];
  return t6;
}
function renderToolUseMessage11({
  pattern,
  path: path19
}, {
  verbose
}) {
  if (!pattern)
    return null;
  let parts = [`pattern: "${pattern}"`];
  if (path19)
    parts.push(`path: "${verbose ? path19 : getDisplayPath(path19)}"`);
  return parts.join(", ");
}
function renderToolUseErrorMessage7(result, {
  verbose
}) {
  if (!verbose && typeof result === "string" && extractTag(result, "tool_use_error")) {
    if (extractTag(result, "tool_use_error")?.includes(FILE_NOT_FOUND_CWD_NOTE))
      return /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
          color: "error",
          children: "File not found"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(ThemedText, {
        color: "error",
        children: "Error searching files"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage10({
  mode = "files_with_matches",
  filenames,
  numFiles,
  content,
  numLines,
  numMatches
}, _progressMessagesForMessage, {
  verbose
}) {
  if (mode === "content")
    return /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(SearchResultSummary, {
      count: numLines ?? 0,
      countLabel: "lines",
      content,
      verbose
    }, void 0, !1, void 0, this);
  if (mode === "count")
    return /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(SearchResultSummary, {
      count: numMatches ?? 0,
      countLabel: "matches",
      secondaryCount: numFiles,
      secondaryLabel: "files",
      content,
      verbose
    }, void 0, !1, void 0, this);
  let fileListContent = filenames.map((filename) => filename).join(`
`);
  return /* @__PURE__ */ jsx_dev_runtime134.jsxDEV(SearchResultSummary, {
    count: numFiles,
    countLabel: "files",
    content: fileListContent,
    verbose
  }, void 0, !1, void 0, this);
}
function getToolUseSummary3(input) {
  if (!input?.pattern)
    return null;
  return truncate(input.pattern, TOOL_SUMMARY_MAX_LENGTH);
}
var import_compiler_runtime116, jsx_dev_runtime134;
var init_UI10 = __esm(() => {
  init_CtrlOToExpand();
  init_FallbackToolUseErrorMessage();
  init_MessageResponse();
  init_ink2();
  init_file();
  init_format();
  init_messages3();
  import_compiler_runtime116 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime134 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
