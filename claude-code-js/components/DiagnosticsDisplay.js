// Original: src/components/DiagnosticsDisplay.tsx
import { relative as relative9 } from "path";
function DiagnosticsDisplay(t0) {
  let $3 = import_compiler_runtime87.c(14), {
    attachment,
    verbose
  } = t0;
  if (attachment.files.length === 0)
    return null;
  let t1;
  if ($3[0] !== attachment.files)
    t1 = attachment.files.reduce(_temp19, 0), $3[0] = attachment.files, $3[1] = t1;
  else
    t1 = $3[1];
  let totalIssues = t1, fileCount = attachment.files.length;
  if (verbose) {
    let t2;
    if ($3[2] !== attachment.files)
      t2 = attachment.files.map(_temp36), $3[2] = attachment.files, $3[3] = t2;
    else
      t2 = $3[3];
    let t3;
    if ($3[4] !== t2)
      t3 = /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: t2
      }, void 0, !1, void 0, this), $3[4] = t2, $3[5] = t3;
    else
      t3 = $3[5];
    return t3;
  } else {
    let t2;
    if ($3[6] !== totalIssues)
      t2 = /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(ThemedText, {
        bold: !0,
        children: totalIssues
      }, void 0, !1, void 0, this), $3[6] = totalIssues, $3[7] = t2;
    else
      t2 = $3[7];
    let t3 = totalIssues === 1 ? "issue" : "issues", t4 = fileCount === 1 ? "file" : "files", t5;
    if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
      t5 = /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this), $3[8] = t5;
    else
      t5 = $3[8];
    let t6;
    if ($3[9] !== fileCount || $3[10] !== t2 || $3[11] !== t3 || $3[12] !== t4)
      t6 = /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(ThemedText, {
          dimColor: !0,
          wrap: "wrap",
          children: [
            "Found ",
            t2,
            " new diagnostic",
            " ",
            t3,
            " in ",
            fileCount,
            " ",
            t4,
            " ",
            t5
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[9] = fileCount, $3[10] = t2, $3[11] = t3, $3[12] = t4, $3[13] = t6;
    else
      t6 = $3[13];
    return t6;
  }
}
function _temp36(file_0, fileIndex) {
  return /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(import_react67.default.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(ThemedText, {
          dimColor: !0,
          wrap: "wrap",
          children: [
            /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(ThemedText, {
              bold: !0,
              children: relative9(getCwd(), file_0.uri.replace("file://", "").replace("_claude_fs_right:", ""))
            }, void 0, !1, void 0, this),
            " ",
            /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(ThemedText, {
              dimColor: !0,
              children: file_0.uri.startsWith("file://") ? "(file://)" : file_0.uri.startsWith("_claude_fs_right:") ? "(claude_fs_right)" : `(${file_0.uri.split(":")[0]})`
            }, void 0, !1, void 0, this),
            ":"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      file_0.diagnostics.map(_temp28)
    ]
  }, fileIndex, !0, void 0, this);
}
function _temp28(diagnostic, diagIndex) {
  return /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime98.jsxDEV(ThemedText, {
      dimColor: !0,
      wrap: "wrap",
      children: [
        "  ",
        DiagnosticTrackingService.getSeveritySymbol(diagnostic.severity),
        " [Line ",
        diagnostic.range.start.line + 1,
        ":",
        diagnostic.range.start.character + 1,
        "] ",
        diagnostic.message,
        diagnostic.code ? ` [${diagnostic.code}]` : "",
        diagnostic.source ? ` (${diagnostic.source})` : ""
      ]
    }, void 0, !0, void 0, this)
  }, diagIndex, !1, void 0, this);
}
function _temp19(sum, file2) {
  return sum + file2.diagnostics.length;
}
var import_compiler_runtime87, import_react67, jsx_dev_runtime98;
var init_DiagnosticsDisplay = __esm(() => {
  init_ink2();
  init_diagnosticTracking();
  init_cwd2();
  init_CtrlOToExpand();
  init_MessageResponse();
  import_compiler_runtime87 = __toESM(require_react_compiler_runtime_development(), 1), import_react67 = __toESM(require_react_development(), 1), jsx_dev_runtime98 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
