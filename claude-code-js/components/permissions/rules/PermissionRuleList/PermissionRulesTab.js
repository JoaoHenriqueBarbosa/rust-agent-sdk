// function: PermissionRulesTab
function PermissionRulesTab(t0) {
  let $3 = import_compiler_runtime237.c(27), T0, T1, handleToolSelect, rulesProps, t1, t2, t3, t4, tab;
  if ($3[0] !== t0) {
    let {
      tab: t52,
      getRulesOptions,
      handleToolSelect: t62,
      ...t72
    } = t0;
    tab = t52, handleToolSelect = t62, rulesProps = t72, T1 = ThemedBox_default, t2 = "column", t3 = tab === "allow" ? 0 : void 0;
    let t8;
    if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
      t8 = {
        allow: "Claude Code won't ask before using allowed tools.",
        ask: "Claude Code will always ask for confirmation before using these tools.",
        deny: "Claude Code will always reject requests to use denied tools."
      }, $3[10] = t8;
    else
      t8 = $3[10];
    let t9 = t8[tab];
    if ($3[11] !== t9)
      t4 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
        children: t9
      }, void 0, !1, void 0, this), $3[11] = t9, $3[12] = t4;
    else
      t4 = $3[12];
    T0 = RulesTabContent, t1 = getRulesOptions(tab, rulesProps.searchQuery), $3[0] = t0, $3[1] = T0, $3[2] = T1, $3[3] = handleToolSelect, $3[4] = rulesProps, $3[5] = t1, $3[6] = t2, $3[7] = t3, $3[8] = t4, $3[9] = tab;
  } else
    T0 = $3[1], T1 = $3[2], handleToolSelect = $3[3], rulesProps = $3[4], t1 = $3[5], t2 = $3[6], t3 = $3[7], t4 = $3[8], tab = $3[9];
  let t5;
  if ($3[13] !== handleToolSelect || $3[14] !== tab)
    t5 = (v2) => handleToolSelect(v2, tab), $3[13] = handleToolSelect, $3[14] = tab, $3[15] = t5;
  else
    t5 = $3[15];
  let t6;
  if ($3[16] !== T0 || $3[17] !== rulesProps || $3[18] !== t1.options || $3[19] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(T0, {
      options: t1.options,
      onSelect: t5,
      ...rulesProps
    }, void 0, !1, void 0, this), $3[16] = T0, $3[17] = rulesProps, $3[18] = t1.options, $3[19] = t5, $3[20] = t6;
  else
    t6 = $3[20];
  let t7;
  if ($3[21] !== T1 || $3[22] !== t2 || $3[23] !== t3 || $3[24] !== t4 || $3[25] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(T1, {
      flexDirection: t2,
      flexShrink: t3,
      children: [
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[21] = T1, $3[22] = t2, $3[23] = t3, $3[24] = t4, $3[25] = t6, $3[26] = t7;
  else
    t7 = $3[26];
  return t7;
}
