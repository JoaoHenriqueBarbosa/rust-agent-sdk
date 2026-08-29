// function: ModelEntry
function ModelEntry(t0) {
  let $3 = import_compiler_runtime278.c(21), {
    model,
    usage,
    totalTokens
  } = t0, t1 = (usage.inputTokens + usage.outputTokens) / totalTokens * 100, t2;
  if ($3[0] !== t1)
    t2 = t1.toFixed(1), $3[0] = t1, $3[1] = t2;
  else
    t2 = $3[1];
  let percentage = t2, t3;
  if ($3[2] !== model)
    t3 = renderModelName(model), $3[2] = model, $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
      bold: !0,
      children: t3
    }, void 0, !1, void 0, this), $3[4] = t3, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== percentage)
    t5 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
      color: "subtle",
      children: [
        "(",
        percentage,
        "%)"
      ]
    }, void 0, !0, void 0, this), $3[6] = percentage, $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== t4 || $3[9] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
      children: [
        figures_default.bullet,
        " ",
        t4,
        " ",
        t5
      ]
    }, void 0, !0, void 0, this), $3[8] = t4, $3[9] = t5, $3[10] = t6;
  else
    t6 = $3[10];
  let t7;
  if ($3[11] !== usage.inputTokens)
    t7 = formatNumber(usage.inputTokens), $3[11] = usage.inputTokens, $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] !== usage.outputTokens)
    t8 = formatNumber(usage.outputTokens), $3[13] = usage.outputTokens, $3[14] = t8;
  else
    t8 = $3[14];
  let t9;
  if ($3[15] !== t7 || $3[16] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
      color: "subtle",
      children: [
        "  ",
        "In: ",
        t7,
        " \xB7 Out:",
        " ",
        t8
      ]
    }, void 0, !0, void 0, this), $3[15] = t7, $3[16] = t8, $3[17] = t9;
  else
    t9 = $3[17];
  let t10;
  if ($3[18] !== t6 || $3[19] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t6,
        t9
      ]
    }, void 0, !0, void 0, this), $3[18] = t6, $3[19] = t9, $3[20] = t10;
  else
    t10 = $3[20];
  return t10;
}
