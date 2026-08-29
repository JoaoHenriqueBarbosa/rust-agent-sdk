// Original: src/components/design-system/LoadingState.tsx
function LoadingState(t0) {
  let $3 = import_compiler_runtime131.c(10), {
    message,
    bold: t1,
    dimColor: t2,
    subtitle
  } = t0, bold2 = t1 === void 0 ? !1 : t1, dimColor = t2 === void 0 ? !1 : t2, t3;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime167.jsxDEV(Spinner, {}, void 0, !1, void 0, this), $3[0] = t3;
  else
    t3 = $3[0];
  let t4;
  if ($3[1] !== bold2 || $3[2] !== dimColor || $3[3] !== message)
    t4 = /* @__PURE__ */ jsx_dev_runtime167.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t3,
        /* @__PURE__ */ jsx_dev_runtime167.jsxDEV(ThemedText, {
          bold: bold2,
          dimColor,
          children: [
            " ",
            message
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = bold2, $3[2] = dimColor, $3[3] = message, $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] !== subtitle)
    t5 = subtitle && /* @__PURE__ */ jsx_dev_runtime167.jsxDEV(ThemedText, {
      dimColor: !0,
      children: subtitle
    }, void 0, !1, void 0, this), $3[5] = subtitle, $3[6] = t5;
  else
    t5 = $3[6];
  let t6;
  if ($3[7] !== t4 || $3[8] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime167.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[7] = t4, $3[8] = t5, $3[9] = t6;
  else
    t6 = $3[9];
  return t6;
}
var import_compiler_runtime131, jsx_dev_runtime167;
var init_LoadingState = __esm(() => {
  init_ink2();
  init_Spinner2();
  import_compiler_runtime131 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime167 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
