// Original: src/components/permissions/rules/AddPermissionRules.tsx
function optionForPermissionSaveDestination(saveDestination) {
  switch (saveDestination) {
    case "localSettings":
      return {
        label: "Project settings (local)",
        description: `Saved in ${getRelativeSettingsFilePathForSource("localSettings")}`,
        value: saveDestination
      };
    case "projectSettings":
      return {
        label: "Project settings",
        description: `Checked in at ${getRelativeSettingsFilePathForSource("projectSettings")}`,
        value: saveDestination
      };
    case "userSettings":
      return {
        label: "User settings",
        description: "Saved in at ~/.claude/settings.json",
        value: saveDestination
      };
  }
}
function AddPermissionRules(t0) {
  let $3 = import_compiler_runtime232.c(26), {
    onAddRules,
    onCancel,
    ruleValues,
    ruleBehavior,
    initialContext,
    setToolPermissionContext
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = SOURCES.map(optionForPermissionSaveDestination), $3[0] = t1;
  else
    t1 = $3[0];
  let allOptions = t1, t2;
  if ($3[1] !== initialContext || $3[2] !== onAddRules || $3[3] !== onCancel || $3[4] !== ruleBehavior || $3[5] !== ruleValues || $3[6] !== setToolPermissionContext)
    t2 = (selectedValue) => {
      if (selectedValue === "cancel") {
        onCancel();
        return;
      } else if (SOURCES.includes(selectedValue)) {
        let destination = selectedValue, updatedContext = applyPermissionUpdate(initialContext, {
          type: "addRules",
          rules: ruleValues,
          behavior: ruleBehavior,
          destination
        });
        persistPermissionUpdate({
          type: "addRules",
          rules: ruleValues,
          behavior: ruleBehavior,
          destination
        }), setToolPermissionContext(updatedContext);
        let rules2 = ruleValues.map((ruleValue) => ({
          ruleValue,
          ruleBehavior,
          source: destination
        })), sandboxAutoAllowEnabled = SandboxManager2.isSandboxingEnabled() && SandboxManager2.isAutoAllowBashIfSandboxedEnabled(), newUnreachable = detectUnreachableRules(updatedContext, {
          sandboxAutoAllowEnabled
        }).filter((u5) => ruleValues.some((rv) => rv.toolName === u5.rule.ruleValue.toolName && rv.ruleContent === u5.rule.ruleValue.ruleContent));
        onAddRules(rules2, newUnreachable.length > 0 ? newUnreachable : void 0);
      }
    }, $3[1] = initialContext, $3[2] = onAddRules, $3[3] = onCancel, $3[4] = ruleBehavior, $3[5] = ruleValues, $3[6] = setToolPermissionContext, $3[7] = t2;
  else
    t2 = $3[7];
  let onSelect = t2, t3;
  if ($3[8] !== ruleValues.length)
    t3 = plural(ruleValues.length, "rule"), $3[8] = ruleValues.length, $3[9] = t3;
  else
    t3 = $3[9];
  let title = `Add ${ruleBehavior} permission ${t3}`, t4;
  if ($3[10] !== ruleValues)
    t4 = ruleValues.map(_temp141), $3[10] = ruleValues, $3[11] = t4;
  else
    t4 = $3[11];
  let t5;
  if ($3[12] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      children: t4
    }, void 0, !1, void 0, this), $3[12] = t4, $3[13] = t5;
  else
    t5 = $3[13];
  let t6 = ruleValues.length === 1 ? "Where should this rule be saved?" : "Where should these rules be saved?", t7;
  if ($3[14] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(ThemedText, {
      children: t6
    }, void 0, !1, void 0, this), $3[14] = t6, $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] !== onSelect)
    t8 = /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(Select, {
      options: allOptions,
      onChange: onSelect
    }, void 0, !1, void 0, this), $3[16] = onSelect, $3[17] = t8;
  else
    t8 = $3[17];
  let t9;
  if ($3[18] !== t7 || $3[19] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginY: 1,
      children: [
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[18] = t7, $3[19] = t8, $3[20] = t9;
  else
    t9 = $3[20];
  let t10;
  if ($3[21] !== onCancel || $3[22] !== t5 || $3[23] !== t9 || $3[24] !== title)
    t10 = /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(Dialog, {
      title,
      onCancel,
      color: "permission",
      children: [
        t5,
        t9
      ]
    }, void 0, !0, void 0, this), $3[21] = onCancel, $3[22] = t5, $3[23] = t9, $3[24] = title, $3[25] = t10;
  else
    t10 = $3[25];
  return t10;
}
function _temp141(ruleValue_0) {
  return /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(ThemedText, {
        bold: !0,
        children: permissionRuleValueToString(ruleValue_0)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime294.jsxDEV(PermissionRuleDescription, {
        ruleValue: ruleValue_0
      }, void 0, !1, void 0, this)
    ]
  }, permissionRuleValueToString(ruleValue_0), !0, void 0, this);
}
var import_compiler_runtime232, jsx_dev_runtime294;
var init_AddPermissionRules = __esm(() => {
  init_select();
  init_ink2();
  init_PermissionUpdate();
  init_permissionRuleParser();
  init_shadowedRuleDetection();
  init_sandbox_adapter();
  init_constants2();
  init_settings2();
  init_Dialog();
  init_PermissionRuleDescription();
  import_compiler_runtime232 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime294 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
