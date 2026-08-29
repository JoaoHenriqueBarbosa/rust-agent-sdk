// Original: src/components/sandbox/SandboxDoctorSection.tsx
function SandboxDoctorSection() {
  let $3 = import_compiler_runtime156.c(2);
  if (!SandboxManager2.isSupportedPlatform())
    return null;
  if (!SandboxManager2.isSandboxEnabledInSettings())
    return null;
  let t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let depCheck = SandboxManager2.checkDependencies(), hasErrors = depCheck.errors.length > 0, hasWarnings = depCheck.warnings.length > 0;
      if (!hasErrors && !hasWarnings) {
        t1 = null;
        break bb0;
      }
      t0 = /* @__PURE__ */ jsx_dev_runtime196.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime196.jsxDEV(ThemedText, {
            bold: !0,
            children: "Sandbox"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime196.jsxDEV(ThemedText, {
            children: [
              "\u2514 Status: ",
              /* @__PURE__ */ jsx_dev_runtime196.jsxDEV(ThemedText, {
                color: hasErrors ? "error" : "warning",
                children: hasErrors ? "Missing dependencies" : "Available (with warnings)"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          depCheck.errors.map(_temp81),
          depCheck.warnings.map(_temp227),
          hasErrors && /* @__PURE__ */ jsx_dev_runtime196.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "\u2514 Run /sandbox for install instructions"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
    $3[0] = t0, $3[1] = t1;
  } else
    t0 = $3[0], t1 = $3[1];
  if (t1 !== Symbol.for("react.early_return_sentinel"))
    return t1;
  return t0;
}
function _temp227(w2, i_0) {
  return /* @__PURE__ */ jsx_dev_runtime196.jsxDEV(ThemedText, {
    color: "warning",
    children: [
      "\u2514 ",
      w2
    ]
  }, i_0, !0, void 0, this);
}
function _temp81(e, i5) {
  return /* @__PURE__ */ jsx_dev_runtime196.jsxDEV(ThemedText, {
    color: "error",
    children: [
      "\u2514 ",
      e
    ]
  }, i5, !0, void 0, this);
}
var import_compiler_runtime156, jsx_dev_runtime196;
var init_SandboxDoctorSection = __esm(() => {
  init_ink2();
  init_sandbox_adapter();
  import_compiler_runtime156 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime196 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
