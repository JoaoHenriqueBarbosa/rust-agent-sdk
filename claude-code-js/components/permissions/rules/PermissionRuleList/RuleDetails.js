// function: RuleDetails
function RuleDetails(t0) {
  let $3 = import_compiler_runtime237.c(42), {
    rule,
    onDelete,
    onCancel
  } = t0, exitState = useExitOnCtrlCDWithKeybindings(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Confirmation"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:no", onCancel, t1);
  let t2;
  if ($3[1] !== rule.ruleValue)
    t2 = permissionRuleValueToString(rule.ruleValue), $3[1] = rule.ruleValue, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
      bold: !0,
      children: t2
    }, void 0, !1, void 0, this), $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== rule.ruleValue)
    t4 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(PermissionRuleDescription, {
      ruleValue: rule.ruleValue
    }, void 0, !1, void 0, this), $3[5] = rule.ruleValue, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== rule)
    t5 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(RuleSourceText, {
      rule
    }, void 0, !1, void 0, this), $3[7] = rule, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== t3 || $3[10] !== t4 || $3[11] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginX: 2,
      children: [
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[9] = t3, $3[10] = t4, $3[11] = t5, $3[12] = t6;
  else
    t6 = $3[12];
  let ruleDescription = t6, t7;
  if ($3[13] !== exitState.keyName || $3[14] !== exitState.pending)
    t7 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Esc to cancel"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = exitState.keyName, $3[14] = exitState.pending, $3[15] = t7;
  else
    t7 = $3[15];
  let footer = t7;
  if (rule.source === "policySettings") {
    let t82;
    if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
      t82 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
        bold: !0,
        color: "permission",
        children: "Rule details"
      }, void 0, !1, void 0, this), $3[16] = t82;
    else
      t82 = $3[16];
    let t92;
    if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
      t92 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
        italic: !0,
        children: [
          "This rule is configured by managed settings and cannot be modified.",
          `
`,
          "Contact your system administrator for more information."
        ]
      }, void 0, !0, void 0, this), $3[17] = t92;
    else
      t92 = $3[17];
    let t102;
    if ($3[18] !== ruleDescription)
      t102 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        borderColor: "permission",
        children: [
          t82,
          ruleDescription,
          t92
        ]
      }, void 0, !0, void 0, this), $3[18] = ruleDescription, $3[19] = t102;
    else
      t102 = $3[19];
    let t112;
    if ($3[20] !== footer || $3[21] !== t102)
      t112 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(jsx_dev_runtime299.Fragment, {
        children: [
          t102,
          footer
        ]
      }, void 0, !0, void 0, this), $3[20] = footer, $3[21] = t102, $3[22] = t112;
    else
      t112 = $3[22];
    return t112;
  }
  let t8;
  if ($3[23] !== rule.ruleBehavior)
    t8 = getRuleBehaviorLabel(rule.ruleBehavior), $3[23] = rule.ruleBehavior, $3[24] = t8;
  else
    t8 = $3[24];
  let t9;
  if ($3[25] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
      bold: !0,
      color: "error",
      children: [
        "Delete ",
        t8,
        " tool?"
      ]
    }, void 0, !0, void 0, this), $3[25] = t8, $3[26] = t9;
  else
    t9 = $3[26];
  let t10;
  if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedText, {
      children: "Are you sure you want to delete this permission rule?"
    }, void 0, !1, void 0, this), $3[27] = t10;
  else
    t10 = $3[27];
  let t11;
  if ($3[28] !== onCancel || $3[29] !== onDelete)
    t11 = (_) => _ === "yes" ? onDelete() : onCancel(), $3[28] = onCancel, $3[29] = onDelete, $3[30] = t11;
  else
    t11 = $3[30];
  let t12;
  if ($3[31] === Symbol.for("react.memo_cache_sentinel"))
    t12 = [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }], $3[31] = t12;
  else
    t12 = $3[31];
  let t13;
  if ($3[32] !== onCancel || $3[33] !== t11)
    t13 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(Select, {
      onChange: t11,
      onCancel,
      options: t12
    }, void 0, !1, void 0, this), $3[32] = onCancel, $3[33] = t11, $3[34] = t13;
  else
    t13 = $3[34];
  let t14;
  if ($3[35] !== ruleDescription || $3[36] !== t13 || $3[37] !== t9)
    t14 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      borderStyle: "round",
      paddingLeft: 1,
      paddingRight: 1,
      borderColor: "error",
      children: [
        t9,
        ruleDescription,
        t10,
        t13
      ]
    }, void 0, !0, void 0, this), $3[35] = ruleDescription, $3[36] = t13, $3[37] = t9, $3[38] = t14;
  else
    t14 = $3[38];
  let t15;
  if ($3[39] !== footer || $3[40] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime299.jsxDEV(jsx_dev_runtime299.Fragment, {
      children: [
        t14,
        footer
      ]
    }, void 0, !0, void 0, this), $3[39] = footer, $3[40] = t14, $3[41] = t15;
  else
    t15 = $3[41];
  return t15;
}
