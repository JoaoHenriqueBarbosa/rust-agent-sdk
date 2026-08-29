// Original: src/components/hooks/ViewHookMode.tsx
function ViewHookMode(t0) {
  let $3 = import_compiler_runtime245.c(40), {
    selectedHook,
    eventSupportsMatcher,
    onCancel
  } = t0, t1;
  if ($3[0] !== selectedHook.event)
    t1 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      children: [
        "Event: ",
        /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
          bold: !0,
          children: selectedHook.event
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[0] = selectedHook.event, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== eventSupportsMatcher || $3[3] !== selectedHook.matcher)
    t2 = eventSupportsMatcher && /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      children: [
        "Matcher: ",
        /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
          bold: !0,
          children: selectedHook.matcher || "(all)"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[2] = eventSupportsMatcher, $3[3] = selectedHook.matcher, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== selectedHook.config.type)
    t3 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      children: [
        "Type: ",
        /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
          bold: !0,
          children: selectedHook.config.type
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[5] = selectedHook.config.type, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== selectedHook.source)
    t4 = hookSourceDescriptionDisplayString(selectedHook.source), $3[7] = selectedHook.source, $3[8] = t4;
  else
    t4 = $3[8];
  let t5;
  if ($3[9] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      children: [
        "Source:",
        " ",
        /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
          dimColor: !0,
          children: t4
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[9] = t4, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== selectedHook.pluginName)
    t6 = selectedHook.pluginName && /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      children: [
        "Plugin: ",
        /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
          dimColor: !0,
          children: selectedHook.pluginName
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[11] = selectedHook.pluginName, $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] !== t1 || $3[14] !== t2 || $3[15] !== t3 || $3[16] !== t5 || $3[17] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t1,
        t2,
        t3,
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[13] = t1, $3[14] = t2, $3[15] = t3, $3[16] = t5, $3[17] = t6, $3[18] = t7;
  else
    t7 = $3[18];
  let t8;
  if ($3[19] !== selectedHook.config)
    t8 = getContentFieldLabel(selectedHook.config), $3[19] = selectedHook.config, $3[20] = t8;
  else
    t8 = $3[20];
  let t9;
  if ($3[21] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        t8,
        ":"
      ]
    }, void 0, !0, void 0, this), $3[21] = t8, $3[22] = t9;
  else
    t9 = $3[22];
  let t10;
  if ($3[23] !== selectedHook.config)
    t10 = getContentFieldValue(selectedHook.config), $3[23] = selectedHook.config, $3[24] = t10;
  else
    t10 = $3[24];
  let t11;
  if ($3[25] !== t10)
    t11 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedBox_default, {
      borderStyle: "round",
      borderDimColor: !0,
      paddingLeft: 1,
      paddingRight: 1,
      children: /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
        children: t10
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[25] = t10, $3[26] = t11;
  else
    t11 = $3[26];
  let t12;
  if ($3[27] !== t11 || $3[28] !== t9)
    t12 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t9,
        t11
      ]
    }, void 0, !0, void 0, this), $3[27] = t11, $3[28] = t9, $3[29] = t12;
  else
    t12 = $3[29];
  let t13;
  if ($3[30] !== selectedHook.config)
    t13 = "statusMessage" in selectedHook.config && selectedHook.config.statusMessage && /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      children: [
        "Status message:",
        " ",
        /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
          dimColor: !0,
          children: selectedHook.config.statusMessage
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[30] = selectedHook.config, $3[31] = t13;
  else
    t13 = $3[31];
  let t14;
  if ($3[32] === Symbol.for("react.memo_cache_sentinel"))
    t14 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "To modify or remove this hook, edit settings.json directly or ask Claude to help."
    }, void 0, !1, void 0, this), $3[32] = t14;
  else
    t14 = $3[32];
  let t15;
  if ($3[33] !== t12 || $3[34] !== t13 || $3[35] !== t7)
    t15 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t7,
        t12,
        t13,
        t14
      ]
    }, void 0, !0, void 0, this), $3[33] = t12, $3[34] = t13, $3[35] = t7, $3[36] = t15;
  else
    t15 = $3[36];
  let t16;
  if ($3[37] !== onCancel || $3[38] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(Dialog, {
      title: "Hook details",
      onCancel,
      inputGuide: _temp151,
      children: t15
    }, void 0, !1, void 0, this), $3[37] = onCancel, $3[38] = t15, $3[39] = t16;
  else
    t16 = $3[39];
  return t16;
}
function _temp151() {
  return /* @__PURE__ */ jsx_dev_runtime311.jsxDEV(ThemedText, {
    children: "Esc to go back"
  }, void 0, !1, void 0, this);
}
function getContentFieldLabel(config11) {
  switch (config11.type) {
    case "command":
      return "Command";
    case "prompt":
      return "Prompt";
    case "agent":
      return "Prompt";
    case "http":
      return "URL";
  }
}
function getContentFieldValue(config11) {
  switch (config11.type) {
    case "command":
      return config11.command;
    case "prompt":
      return config11.prompt;
    case "agent":
      return config11.prompt;
    case "http":
      return config11.url;
  }
}
var import_compiler_runtime245, jsx_dev_runtime311;
var init_ViewHookMode = __esm(() => {
  init_ink2();
  init_hooksSettings();
  init_Dialog();
  import_compiler_runtime245 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime311 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
