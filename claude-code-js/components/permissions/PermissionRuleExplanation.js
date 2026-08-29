// Original: src/components/permissions/PermissionRuleExplanation.tsx
function stringsForDecisionReason(reason, toolType) {
  if (!reason)
    return null;
  if (reason.type === "classifier") {
    if (reason.classifier === "auto-mode")
      return {
        reasonString: `Auto mode classifier requires confirmation for this ${toolType}.
${reason.reason}`,
        configString: void 0,
        themeColor: "error"
      };
    return {
      reasonString: `Classifier ${source_default.bold(reason.classifier)} requires confirmation for this ${toolType}.
${reason.reason}`,
      configString: void 0
    };
  }
  switch (reason.type) {
    case "rule":
      return {
        reasonString: `Permission rule ${source_default.bold(permissionRuleValueToString(reason.rule.ruleValue))} requires confirmation for this ${toolType}.`,
        configString: reason.rule.source === "policySettings" ? void 0 : "/permissions to update rules"
      };
    case "hook": {
      let hookReasonString = reason.reason ? `:
${reason.reason}` : ".", sourceLabel = reason.hookSource ? ` ${source_default.dim(`[${reason.hookSource}]`)}` : "";
      return {
        reasonString: `Hook ${source_default.bold(reason.hookName)} requires confirmation for this ${toolType}${hookReasonString}${sourceLabel}`,
        configString: "/hooks to update"
      };
    }
    case "safetyCheck":
    case "other":
      return {
        reasonString: reason.reason,
        configString: void 0
      };
    case "workingDir":
      return {
        reasonString: reason.reason,
        configString: "/permissions to update rules"
      };
    default:
      return null;
  }
}
function PermissionRuleExplanation(t0) {
  let $3 = import_compiler_runtime291.c(11), {
    permissionResult,
    toolType
  } = t0, permissionMode = useAppState(_temp176), t1 = permissionResult?.decisionReason, t2;
  if ($3[0] !== t1 || $3[1] !== toolType)
    t2 = stringsForDecisionReason(t1, toolType), $3[0] = t1, $3[1] = toolType, $3[2] = t2;
  else
    t2 = $3[2];
  let strings = t2;
  if (!strings)
    return null;
  let themeColor = strings.themeColor ?? (permissionResult?.decisionReason?.type === "hook" && permissionMode === "auto" ? "warning" : void 0), t3;
  if ($3[3] !== strings.reasonString || $3[4] !== themeColor)
    t3 = themeColor ? /* @__PURE__ */ jsx_dev_runtime375.jsxDEV(ThemedText, {
      color: themeColor,
      children: strings.reasonString
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime375.jsxDEV(ThemedText, {
      children: /* @__PURE__ */ jsx_dev_runtime375.jsxDEV(Ansi, {
        children: strings.reasonString
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = strings.reasonString, $3[4] = themeColor, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== strings.configString)
    t4 = strings.configString && /* @__PURE__ */ jsx_dev_runtime375.jsxDEV(ThemedText, {
      dimColor: !0,
      children: strings.configString
    }, void 0, !1, void 0, this), $3[6] = strings.configString, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== t3 || $3[9] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime375.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      flexDirection: "column",
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[8] = t3, $3[9] = t4, $3[10] = t5;
  else
    t5 = $3[10];
  return t5;
}
function _temp176(s2) {
  return s2.toolPermissionContext.mode;
}
var import_compiler_runtime291, jsx_dev_runtime375;
var init_PermissionRuleExplanation = __esm(() => {
  init_source();
  init_ink2();
  init_AppState();
  init_permissionRuleParser();
  init_ThemedText();
  import_compiler_runtime291 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime375 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
