// Original: src/components/ManagedSettingsSecurityDialog/ManagedSettingsSecurityDialog.tsx
function ManagedSettingsSecurityDialog(t0) {
  let $3 = import_compiler_runtime52.c(26), {
    settings,
    onAccept,
    onReject
  } = t0, dangerous = extractDangerousSettings(settings), settingsList = formatDangerousSettingsList(dangerous), exitState = useExitOnCtrlCDWithKeybindings(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Confirmation"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:no", onReject, t1);
  let t2;
  if ($3[1] !== onAccept || $3[2] !== onReject)
    t2 = function(value) {
      if (value === "exit") {
        onReject();
        return;
      }
      onAccept();
    }, $3[1] = onAccept, $3[2] = onReject, $3[3] = t2;
  else
    t2 = $3[3];
  let onChange = t2, T0 = PermissionDialog, t3 = "warning", t4 = "warning", t5 = "Managed settings require approval", T1 = ThemedBox_default, t6 = "column", t7 = 1, t8 = 1, t9;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedText, {
      children: "Your organization has configured managed settings that could allow execution of arbitrary code or interception of your prompts and responses."
    }, void 0, !1, void 0, this), $3[4] = t9;
  else
    t9 = $3[4];
  let T2 = ThemedBox_default, t10 = "column", t11;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Settings requiring approval:"
    }, void 0, !1, void 0, this), $3[5] = t11;
  else
    t11 = $3[5];
  let t12 = settingsList.map(_temp12), t13;
  if ($3[6] !== T2 || $3[7] !== t11 || $3[8] !== t12)
    t13 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(T2, {
      flexDirection: t10,
      children: [
        t11,
        t12
      ]
    }, void 0, !0, void 0, this), $3[6] = T2, $3[7] = t11, $3[8] = t12, $3[9] = t13;
  else
    t13 = $3[9];
  let t14;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t14 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedText, {
      children: "Only accept if you trust your organization's IT administration and expect these settings to be configured."
    }, void 0, !1, void 0, this), $3[10] = t14;
  else
    t14 = $3[10];
  let t15;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t15 = [{
      label: "Yes, I trust these settings",
      value: "accept"
    }, {
      label: "No, exit Claude Code",
      value: "exit"
    }], $3[11] = t15;
  else
    t15 = $3[11];
  let t16;
  if ($3[12] !== onChange)
    t16 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(Select, {
      options: t15,
      onChange: (value_0) => onChange(value_0),
      onCancel: () => onChange("exit")
    }, void 0, !1, void 0, this), $3[12] = onChange, $3[13] = t16;
  else
    t16 = $3[13];
  let t17;
  if ($3[14] !== exitState.keyName || $3[15] !== exitState.pending)
    t17 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedText, {
      dimColor: !0,
      children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(jsx_dev_runtime57.Fragment, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(jsx_dev_runtime57.Fragment, {
        children: "Enter to confirm \xB7 Esc to exit"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[14] = exitState.keyName, $3[15] = exitState.pending, $3[16] = t17;
  else
    t17 = $3[16];
  let t18;
  if ($3[17] !== T1 || $3[18] !== t13 || $3[19] !== t16 || $3[20] !== t17 || $3[21] !== t9)
    t18 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(T1, {
      flexDirection: t6,
      gap: t7,
      paddingTop: t8,
      children: [
        t9,
        t13,
        t14,
        t16,
        t17
      ]
    }, void 0, !0, void 0, this), $3[17] = T1, $3[18] = t13, $3[19] = t16, $3[20] = t17, $3[21] = t9, $3[22] = t18;
  else
    t18 = $3[22];
  let t19;
  if ($3[23] !== T0 || $3[24] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(T0, {
      color: t3,
      titleColor: t4,
      title: t5,
      children: t18
    }, void 0, !1, void 0, this), $3[23] = T0, $3[24] = t18, $3[25] = t19;
  else
    t19 = $3[25];
  return t19;
}
function _temp12(item, index) {
  return /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedBox_default, {
    paddingLeft: 2,
    children: /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\xB7 "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime57.jsxDEV(ThemedText, {
          children: item
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, index, !1, void 0, this);
}
var import_compiler_runtime52, jsx_dev_runtime57;
var init_ManagedSettingsSecurityDialog = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_useKeybinding();
  init_CustomSelect();
  init_PermissionDialog();
  init_utils8();
  import_compiler_runtime52 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime57 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
