// Original: src/components/ThinkingToggle.tsx
function ThinkingToggle(t0) {
  let $3 = import_compiler_runtime325.c(27), {
    currentValue,
    onSelect,
    onCancel,
    isMidConversation
  } = t0, exitState = useExitOnCtrlCDWithKeybindings(), [confirmationPending, setConfirmationPending] = import_react244.useState(null), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [{
      value: "true",
      label: "Enabled",
      description: "Claude will think before responding"
    }, {
      value: "false",
      label: "Disabled",
      description: "Claude will respond without extended thinking"
    }], $3[0] = t1;
  else
    t1 = $3[0];
  let options2 = t1, t2;
  if ($3[1] !== confirmationPending || $3[2] !== onCancel)
    t2 = () => {
      if (confirmationPending !== null)
        setConfirmationPending(null);
      else
        onCancel?.();
    }, $3[1] = confirmationPending, $3[2] = onCancel, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {
      context: "Confirmation"
    }, $3[4] = t3;
  else
    t3 = $3[4];
  useKeybinding("confirm:no", t2, t3);
  let t4;
  if ($3[5] !== confirmationPending || $3[6] !== onSelect)
    t4 = () => {
      if (confirmationPending !== null)
        onSelect(confirmationPending);
    }, $3[5] = confirmationPending, $3[6] = onSelect, $3[7] = t4;
  else
    t4 = $3[7];
  let t5 = confirmationPending !== null, t6;
  if ($3[8] !== t5)
    t6 = {
      context: "Confirmation",
      isActive: t5
    }, $3[8] = t5, $3[9] = t6;
  else
    t6 = $3[9];
  useKeybinding("confirm:yes", t4, t6);
  let t7;
  if ($3[10] !== currentValue || $3[11] !== isMidConversation || $3[12] !== onSelect)
    t7 = function(value) {
      let selected = value === "true";
      if (isMidConversation && selected !== currentValue)
        setConfirmationPending(selected);
      else
        onSelect(selected);
    }, $3[10] = currentValue, $3[11] = isMidConversation, $3[12] = onSelect, $3[13] = t7;
  else
    t7 = $3[13];
  let handleSelectChange = t7, t8;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedText, {
          color: "remember",
          bold: !0,
          children: "Toggle thinking mode"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Enable or disable thinking for this session."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[14] = t8;
  else
    t8 = $3[14];
  let t9;
  if ($3[15] !== confirmationPending || $3[16] !== currentValue || $3[17] !== handleSelectChange || $3[18] !== onCancel)
    t9 = /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t8,
        confirmationPending !== null ? /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: 1,
          gap: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedText, {
              color: "warning",
              children: "Changing thinking mode mid-conversation will increase latency and may reduce quality. For best results, set this at the start of a session."
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedText, {
              color: "warning",
              children: "Do you want to proceed?"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(Select, {
            defaultValue: currentValue ? "true" : "false",
            defaultFocusValue: currentValue ? "true" : "false",
            options: options2,
            onChange: handleSelectChange,
            onCancel: onCancel ?? _temp195,
            visibleOptionCount: 2
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[15] = confirmationPending, $3[16] = currentValue, $3[17] = handleSelectChange, $3[18] = onCancel, $3[19] = t9;
  else
    t9 = $3[19];
  let t10;
  if ($3[20] !== confirmationPending || $3[21] !== exitState.keyName || $3[22] !== exitState.pending)
    t10 = /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(jsx_dev_runtime421.Fragment, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : confirmationPending !== null ? /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Enter",
            action: "confirm"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Enter",
            action: "confirm"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "exit"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[20] = confirmationPending, $3[21] = exitState.keyName, $3[22] = exitState.pending, $3[23] = t10;
  else
    t10 = $3[23];
  let t11;
  if ($3[24] !== t10 || $3[25] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime421.jsxDEV(Pane, {
      color: "permission",
      children: [
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[24] = t10, $3[25] = t9, $3[26] = t11;
  else
    t11 = $3[26];
  return t11;
}
function _temp195() {}
var import_compiler_runtime325, import_react244, jsx_dev_runtime421;
var init_ThinkingToggle = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_useKeybinding();
  init_ConfigurableShortcutHint();
  init_CustomSelect();
  init_Byline();
  init_KeyboardShortcutHint();
  init_Pane();
  import_compiler_runtime325 = __toESM(require_react_compiler_runtime_development(), 1), import_react244 = __toESM(require_react_development(), 1), jsx_dev_runtime421 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
