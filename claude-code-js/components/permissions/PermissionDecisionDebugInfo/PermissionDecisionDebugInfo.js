// function: PermissionDecisionDebugInfo
function PermissionDecisionDebugInfo(t0) {
  let $3 = import_compiler_runtime294.c(25), {
    permissionResult,
    toolName
  } = t0, toolPermissionContext = useAppState(_temp439), decisionReason = permissionResult.decisionReason, suggestions = "suggestions" in permissionResult ? permissionResult.suggestions : void 0, t1;
  if ($3[0] !== suggestions || $3[1] !== toolName || $3[2] !== toolPermissionContext) {
    bb0: {
      let sandboxAutoAllowEnabled = SandboxManager2.isSandboxingEnabled() && SandboxManager2.isAutoAllowBashIfSandboxedEnabled(), all4 = detectUnreachableRules(toolPermissionContext, {
        sandboxAutoAllowEnabled
      }), suggestedRules = extractRules(suggestions);
      if (suggestedRules.length > 0) {
        t1 = all4.filter((u5) => suggestedRules.some((suggested) => suggested.toolName === u5.rule.ruleValue.toolName && suggested.ruleContent === u5.rule.ruleValue.ruleContent));
        break bb0;
      }
      if (toolName) {
        let t22;
        if ($3[4] !== toolName)
          t22 = (u_0) => u_0.rule.ruleValue.toolName === toolName, $3[4] = toolName, $3[5] = t22;
        else
          t22 = $3[5];
        t1 = all4.filter(t22);
        break bb0;
      }
      t1 = all4;
    }
    $3[0] = suggestions, $3[1] = toolName, $3[2] = toolPermissionContext, $3[3] = t1;
  } else
    t1 = $3[3];
  let unreachableRules = t1, t2;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      justifyContent: "flex-end",
      minWidth: 10,
      children: /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Behavior "
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = t2;
  else
    t2 = $3[6];
  let t3;
  if ($3[7] !== permissionResult.behavior)
    t3 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t2,
        /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
          children: permissionResult.behavior
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[7] = permissionResult.behavior, $3[8] = t3;
  else
    t3 = $3[8];
  let t4;
  if ($3[9] !== permissionResult.behavior || $3[10] !== permissionResult.message)
    t4 = permissionResult.behavior !== "allow" && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
          justifyContent: "flex-end",
          minWidth: 10,
          children: /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Message "
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
          children: permissionResult.message
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[9] = permissionResult.behavior, $3[10] = permissionResult.message, $3[11] = t4;
  else
    t4 = $3[11];
  let t5;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      justifyContent: "flex-end",
      minWidth: 10,
      children: /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Reason "
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = t5;
  else
    t5 = $3[12];
  let t6;
  if ($3[13] !== decisionReason)
    t6 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t5,
        decisionReason === void 0 ? /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
          children: "undefined"
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(PermissionDecisionInfoItem, {
          decisionReason
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[13] = decisionReason, $3[14] = t6;
  else
    t6 = $3[14];
  let t7;
  if ($3[15] !== suggestions)
    t7 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(SuggestionDisplay, {
      suggestions,
      width: 10
    }, void 0, !1, void 0, this), $3[15] = suggestions, $3[16] = t7;
  else
    t7 = $3[16];
  let t8;
  if ($3[17] !== unreachableRules)
    t8 = unreachableRules.length > 0 && /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
          color: "warning",
          children: [
            figures_default.warning,
            " Unreachable Rules (",
            unreachableRules.length,
            ")"
          ]
        }, void 0, !0, void 0, this),
        unreachableRules.map(_temp527)
      ]
    }, void 0, !0, void 0, this), $3[17] = unreachableRules, $3[18] = t8;
  else
    t8 = $3[18];
  let t9;
  if ($3[19] !== t3 || $3[20] !== t4 || $3[21] !== t6 || $3[22] !== t7 || $3[23] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t3,
        t4,
        t6,
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[19] = t3, $3[20] = t4, $3[21] = t6, $3[22] = t7, $3[23] = t8, $3[24] = t9;
  else
    t9 = $3[24];
  return t9;
}
