// Original: src/components/KeybindingWarnings.tsx
function KeybindingWarnings() {
  let $3 = import_compiler_runtime153.c(2);
  if (!isKeybindingCustomizationEnabled())
    return null;
  let t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let warnings = getCachedKeybindingWarnings();
      if (warnings.length === 0) {
        t1 = null;
        break bb0;
      }
      let errors8 = warnings.filter(_temp79), warns = warnings.filter(_temp225);
      t0 = /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: 1,
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
            bold: !0,
            color: errors8.length > 0 ? "error" : "warning",
            children: "Keybinding Configuration Issues"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Location: "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
                dimColor: !0,
                children: getKeybindingsPath()
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
            marginLeft: 1,
            flexDirection: "column",
            marginTop: 1,
            children: [
              errors8.map(_temp318),
              warns.map(_temp416)
            ]
          }, void 0, !0, void 0, this)
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
function _temp416(warning, i_0) {
  return /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "\u2514 "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
            color: "warning",
            children: "[Warning]"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              warning.message
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      warning.suggestion && /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
        marginLeft: 3,
        children: /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "\u2192 ",
            warning.suggestion
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, `warning-${i_0}`, !0, void 0, this);
}
function _temp318(error44, i5) {
  return /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "\u2514 "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
            color: "error",
            children: "[Error]"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              error44.message
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      error44.suggestion && /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedBox_default, {
        marginLeft: 3,
        children: /* @__PURE__ */ jsx_dev_runtime193.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "\u2192 ",
            error44.suggestion
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, `error-${i5}`, !0, void 0, this);
}
function _temp225(w_0) {
  return w_0.severity === "warning";
}
function _temp79(w2) {
  return w2.severity === "error";
}
var import_compiler_runtime153, jsx_dev_runtime193;
var init_KeybindingWarnings = __esm(() => {
  init_ink2();
  init_loadUserBindings();
  import_compiler_runtime153 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime193 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
