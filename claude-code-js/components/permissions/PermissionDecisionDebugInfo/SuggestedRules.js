// function: SuggestedRules
function SuggestedRules(t0) {
  let $3 = import_compiler_runtime294.c(18), {
    suggestions
  } = t0, T0, T1, t1, t2, t3, t4, t5;
  if ($3[0] !== suggestions) {
    t5 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let rules2 = extractRules(suggestions);
      if (rules2.length === 0) {
        t5 = null;
        break bb0;
      }
      if (T1 = ThemedText, $3[8] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "  ",
            "\u23BF",
            "  "
          ]
        }, void 0, !0, void 0, this), $3[8] = t2;
      else
        t2 = $3[8];
      t3 = "Suggested rules:", t4 = " ", T0 = Ansi, t1 = rules2.map(_temp178).join(", ");
    }
    $3[0] = suggestions, $3[1] = T0, $3[2] = T1, $3[3] = t1, $3[4] = t2, $3[5] = t3, $3[6] = t4, $3[7] = t5;
  } else
    T0 = $3[1], T1 = $3[2], t1 = $3[3], t2 = $3[4], t3 = $3[5], t4 = $3[6], t5 = $3[7];
  if (t5 !== Symbol.for("react.early_return_sentinel"))
    return t5;
  let t6;
  if ($3[9] !== T0 || $3[10] !== t1)
    t6 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(T0, {
      children: t1
    }, void 0, !1, void 0, this), $3[9] = T0, $3[10] = t1, $3[11] = t6;
  else
    t6 = $3[11];
  let t7;
  if ($3[12] !== T1 || $3[13] !== t2 || $3[14] !== t3 || $3[15] !== t4 || $3[16] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(T1, {
      children: [
        t2,
        t3,
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[12] = T1, $3[13] = t2, $3[14] = t3, $3[15] = t4, $3[16] = t6, $3[17] = t7;
  else
    t7 = $3[17];
  return t7;
}
