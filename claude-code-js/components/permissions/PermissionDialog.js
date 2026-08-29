// Original: src/components/permissions/PermissionDialog.tsx
function PermissionDialog(t0) {
  let $3 = import_compiler_runtime51.c(15), {
    title,
    subtitle,
    color: t1,
    titleColor,
    innerPaddingX: t2,
    workerBadge,
    titleRight,
    children
  } = t0, color2 = t1 === void 0 ? "permission" : t1, innerPaddingX = t2 === void 0 ? 1 : t2, t3;
  if ($3[0] !== subtitle || $3[1] !== title || $3[2] !== titleColor || $3[3] !== workerBadge)
    t3 = /* @__PURE__ */ jsx_dev_runtime56.jsxDEV(PermissionRequestTitle, {
      title,
      subtitle,
      color: titleColor,
      workerBadge
    }, void 0, !1, void 0, this), $3[0] = subtitle, $3[1] = title, $3[2] = titleColor, $3[3] = workerBadge, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t3 || $3[6] !== titleRight)
    t4 = /* @__PURE__ */ jsx_dev_runtime56.jsxDEV(ThemedBox_default, {
      paddingX: 1,
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime56.jsxDEV(ThemedBox_default, {
        justifyContent: "space-between",
        children: [
          t3,
          titleRight
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t3, $3[6] = titleRight, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== children || $3[9] !== innerPaddingX)
    t5 = /* @__PURE__ */ jsx_dev_runtime56.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: innerPaddingX,
      children
    }, void 0, !1, void 0, this), $3[8] = children, $3[9] = innerPaddingX, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== color2 || $3[12] !== t4 || $3[13] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime56.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: color2,
      borderLeft: !1,
      borderRight: !1,
      borderBottom: !1,
      marginTop: 1,
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[11] = color2, $3[12] = t4, $3[13] = t5, $3[14] = t6;
  else
    t6 = $3[14];
  return t6;
}
var import_compiler_runtime51, jsx_dev_runtime56;
var init_PermissionDialog = __esm(() => {
  init_ink2();
  init_PermissionRequestTitle();
  import_compiler_runtime51 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime56 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
