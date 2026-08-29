// Original: src/components/ClaudeMdExternalIncludesDialog.tsx
var exports_ClaudeMdExternalIncludesDialog = {};
__export(exports_ClaudeMdExternalIncludesDialog, {
  ClaudeMdExternalIncludesDialog: () => ClaudeMdExternalIncludesDialog
});
function ClaudeMdExternalIncludesDialog(t0) {
  let $3 = import_compiler_runtime137.c(18), {
    onDone,
    isStandaloneDialog,
    externalIncludes
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  import_react100.default.useEffect(_temp70, t1);
  let t2;
  if ($3[1] !== onDone)
    t2 = (value) => {
      if (value === "no")
        logEvent("tengu_claude_md_external_includes_dialog_declined", {}), saveCurrentProjectConfig(_temp219);
      else
        logEvent("tengu_claude_md_external_includes_dialog_accepted", {}), saveCurrentProjectConfig(_temp315);
      onDone();
    }, $3[1] = onDone, $3[2] = t2;
  else
    t2 = $3[2];
  let handleSelection = t2, t3;
  if ($3[3] !== handleSelection)
    t3 = () => {
      handleSelection("no");
    }, $3[3] = handleSelection, $3[4] = t3;
  else
    t3 = $3[4];
  let handleEscape = t3, t4 = !isStandaloneDialog, t5 = !isStandaloneDialog, t6;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(ThemedText, {
      children: "This project's CLAUDE.md imports files outside the current working directory. Never allow this for third-party repositories."
    }, void 0, !1, void 0, this), $3[5] = t6;
  else
    t6 = $3[5];
  let t7;
  if ($3[6] !== externalIncludes)
    t7 = externalIncludes && externalIncludes.length > 0 && /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "External imports:"
        }, void 0, !1, void 0, this),
        externalIncludes.map(_temp414)
      ]
    }, void 0, !0, void 0, this), $3[6] = externalIncludes, $3[7] = t7;
  else
    t7 = $3[7];
  let t8;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Important: Only use Claude Code with files you trust. Accessing untrusted files may pose security risks",
        " ",
        /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(Link, {
          url: "https://code.claude.com/docs/en/security"
        }, void 0, !1, void 0, this),
        " "
      ]
    }, void 0, !0, void 0, this), $3[8] = t8;
  else
    t8 = $3[8];
  let t9;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t9 = [{
      label: "Yes, allow external imports",
      value: "yes"
    }, {
      label: "No, disable external imports",
      value: "no"
    }], $3[9] = t9;
  else
    t9 = $3[9];
  let t10;
  if ($3[10] !== handleSelection)
    t10 = /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(Select, {
      options: t9,
      onChange: (value_0) => handleSelection(value_0)
    }, void 0, !1, void 0, this), $3[10] = handleSelection, $3[11] = t10;
  else
    t10 = $3[11];
  let t11;
  if ($3[12] !== handleEscape || $3[13] !== t10 || $3[14] !== t4 || $3[15] !== t5 || $3[16] !== t7)
    t11 = /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(Dialog, {
      title: "Allow external CLAUDE.md file imports?",
      color: "warning",
      onCancel: handleEscape,
      hideBorder: t4,
      hideInputGuide: t5,
      children: [
        t6,
        t7,
        t8,
        t10
      ]
    }, void 0, !0, void 0, this), $3[12] = handleEscape, $3[13] = t10, $3[14] = t4, $3[15] = t5, $3[16] = t7, $3[17] = t11;
  else
    t11 = $3[17];
  return t11;
}
function _temp414(include, i5) {
  return /* @__PURE__ */ jsx_dev_runtime174.jsxDEV(ThemedText, {
    dimColor: !0,
    children: [
      "  ",
      include.path
    ]
  }, i5, !0, void 0, this);
}
function _temp315(current_0) {
  return {
    ...current_0,
    hasClaudeMdExternalIncludesApproved: !0,
    hasClaudeMdExternalIncludesWarningShown: !0
  };
}
function _temp219(current) {
  return {
    ...current,
    hasClaudeMdExternalIncludesApproved: !1,
    hasClaudeMdExternalIncludesWarningShown: !0
  };
}
function _temp70() {
  logEvent("tengu_claude_md_includes_dialog_shown", {});
}
var import_compiler_runtime137, import_react100, jsx_dev_runtime174;
var init_ClaudeMdExternalIncludesDialog = __esm(() => {
  init_ink2();
  init_config4();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime137 = __toESM(require_react_compiler_runtime_development(), 1), import_react100 = __toESM(require_react_development(), 1), jsx_dev_runtime174 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
