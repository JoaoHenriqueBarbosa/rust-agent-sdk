// Original: src/components/PrBadge.tsx
function PrBadge(t0) {
  let $3 = import_compiler_runtime91.c(21), {
    number: number5,
    url: url3,
    reviewState,
    bold: bold2
  } = t0, t1;
  if ($3[0] !== reviewState)
    t1 = getPrStatusColor(reviewState), $3[0] = reviewState, $3[1] = t1;
  else
    t1 = $3[1];
  let statusColor = t1, t2 = !statusColor && !bold2, t3;
  if ($3[2] !== bold2 || $3[3] !== number5 || $3[4] !== statusColor || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime102.jsxDEV(ThemedText, {
      color: statusColor,
      dimColor: t2,
      bold: bold2,
      children: [
        "#",
        number5
      ]
    }, void 0, !0, void 0, this), $3[2] = bold2, $3[3] = number5, $3[4] = statusColor, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  let label = t3, t4 = !bold2, t5;
  if ($3[7] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime102.jsxDEV(ThemedText, {
      dimColor: t4,
      children: "PR"
    }, void 0, !1, void 0, this), $3[7] = t4, $3[8] = t5;
  else
    t5 = $3[8];
  let t6 = !statusColor && !bold2, t7;
  if ($3[9] !== bold2 || $3[10] !== number5 || $3[11] !== statusColor || $3[12] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime102.jsxDEV(ThemedText, {
      color: statusColor,
      dimColor: t6,
      underline: !0,
      bold: bold2,
      children: [
        "#",
        number5
      ]
    }, void 0, !0, void 0, this), $3[9] = bold2, $3[10] = number5, $3[11] = statusColor, $3[12] = t6, $3[13] = t7;
  else
    t7 = $3[13];
  let t8;
  if ($3[14] !== label || $3[15] !== t7 || $3[16] !== url3)
    t8 = /* @__PURE__ */ jsx_dev_runtime102.jsxDEV(Link, {
      url: url3,
      fallback: label,
      children: t7
    }, void 0, !1, void 0, this), $3[14] = label, $3[15] = t7, $3[16] = url3, $3[17] = t8;
  else
    t8 = $3[17];
  let t9;
  if ($3[18] !== t5 || $3[19] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime102.jsxDEV(ThemedText, {
      children: [
        t5,
        " ",
        t8
      ]
    }, void 0, !0, void 0, this), $3[18] = t5, $3[19] = t8, $3[20] = t9;
  else
    t9 = $3[20];
  return t9;
}
function getPrStatusColor(state3) {
  switch (state3) {
    case "approved":
      return "success";
    case "changes_requested":
      return "error";
    case "pending":
      return "warning";
    case "merged":
      return "merged";
    default:
      return;
  }
}
var import_compiler_runtime91, jsx_dev_runtime102;
var init_PrBadge = __esm(() => {
  init_ink2();
  import_compiler_runtime91 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime102 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
