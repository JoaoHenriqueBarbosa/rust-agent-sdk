// Original: src/components/permissions/PermissionRequestTitle.tsx
function PermissionRequestTitle(t0) {
  let $3 = import_compiler_runtime50.c(13), {
    title,
    subtitle,
    color: t1,
    workerBadge
  } = t0, color2 = t1 === void 0 ? "permission" : t1, t2;
  if ($3[0] !== color2 || $3[1] !== title)
    t2 = /* @__PURE__ */ jsx_dev_runtime55.jsxDEV(ThemedText, {
      bold: !0,
      color: color2,
      children: title
    }, void 0, !1, void 0, this), $3[0] = color2, $3[1] = title, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== workerBadge)
    t3 = workerBadge && /* @__PURE__ */ jsx_dev_runtime55.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "\xB7 ",
        "@",
        workerBadge.name
      ]
    }, void 0, !0, void 0, this), $3[3] = workerBadge, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t2 || $3[6] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime55.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[5] = t2, $3[6] = t3, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== subtitle)
    t5 = subtitle != null && (typeof subtitle === "string" ? /* @__PURE__ */ jsx_dev_runtime55.jsxDEV(ThemedText, {
      dimColor: !0,
      wrap: "truncate-start",
      children: subtitle
    }, void 0, !1, void 0, this) : subtitle), $3[8] = subtitle, $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] !== t4 || $3[11] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime55.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[10] = t4, $3[11] = t5, $3[12] = t6;
  else
    t6 = $3[12];
  return t6;
}
var import_compiler_runtime50, jsx_dev_runtime55;
var init_PermissionRequestTitle = __esm(() => {
  init_ink2();
  import_compiler_runtime50 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime55 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
