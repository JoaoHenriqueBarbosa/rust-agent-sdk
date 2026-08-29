// function: DateRangeSelector
function DateRangeSelector(t0) {
  let $3 = import_compiler_runtime278.c(9), {
    dateRange,
    isLoading
  } = t0, t1;
  if ($3[0] !== dateRange)
    t1 = DATE_RANGE_ORDER.map((range, i5) => /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
      children: [
        i5 > 0 && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \xB7 "
        }, void 0, !1, void 0, this),
        range === dateRange ? /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          bold: !0,
          color: "claude",
          children: DATE_RANGE_LABELS[range]
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          dimColor: !0,
          children: DATE_RANGE_LABELS[range]
        }, void 0, !1, void 0, this)
      ]
    }, range, !0, void 0, this)), $3[0] = dateRange, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
      children: t1
    }, void 0, !1, void 0, this), $3[2] = t1, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== isLoading)
    t3 = isLoading && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Spinner, {}, void 0, !1, void 0, this), $3[4] = isLoading, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== t2 || $3[7] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      gap: 1,
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[6] = t2, $3[7] = t3, $3[8] = t4;
  else
    t4 = $3[8];
  return t4;
}
