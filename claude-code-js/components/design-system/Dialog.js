// Original: src/components/design-system/Dialog.tsx
function Dialog(t0) {
  let $3 = import_compiler_runtime32.c(27), {
    title,
    subtitle,
    children,
    onCancel,
    color: t1,
    hideInputGuide,
    hideBorder,
    inputGuide,
    isCancelActive: t2
  } = t0, color2 = t1 === void 0 ? "permission" : t1, isCancelActive = t2 === void 0 ? !0 : t2, exitState = useExitOnCtrlCDWithKeybindings(void 0, void 0, isCancelActive), t3;
  if ($3[0] !== isCancelActive)
    t3 = {
      context: "Confirmation",
      isActive: isCancelActive
    }, $3[0] = isCancelActive, $3[1] = t3;
  else
    t3 = $3[1];
  useKeybinding("confirm:no", onCancel, t3);
  let t4;
  if ($3[2] !== exitState.keyName || $3[3] !== exitState.pending)
    t4 = exitState.pending ? /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "confirm"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "cancel"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[2] = exitState.keyName, $3[3] = exitState.pending, $3[4] = t4;
  else
    t4 = $3[4];
  let defaultInputGuide = t4, t5;
  if ($3[5] !== color2 || $3[6] !== title)
    t5 = /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ThemedText, {
      bold: !0,
      color: color2,
      children: title
    }, void 0, !1, void 0, this), $3[5] = color2, $3[6] = title, $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== subtitle)
    t6 = subtitle && /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ThemedText, {
      dimColor: !0,
      children: subtitle
    }, void 0, !1, void 0, this), $3[8] = subtitle, $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] !== t5 || $3[11] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[10] = t5, $3[11] = t6, $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] !== children || $3[14] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t7,
        children
      ]
    }, void 0, !0, void 0, this), $3[13] = children, $3[14] = t7, $3[15] = t8;
  else
    t8 = $3[15];
  let t9;
  if ($3[16] !== defaultInputGuide || $3[17] !== exitState || $3[18] !== hideInputGuide || $3[19] !== inputGuide)
    t9 = !hideInputGuide && /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: inputGuide ? inputGuide(exitState) : defaultInputGuide
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[16] = defaultInputGuide, $3[17] = exitState, $3[18] = hideInputGuide, $3[19] = inputGuide, $3[20] = t9;
  else
    t9 = $3[20];
  let t10;
  if ($3[21] !== t8 || $3[22] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(jsx_dev_runtime36.Fragment, {
      children: [
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[21] = t8, $3[22] = t9, $3[23] = t10;
  else
    t10 = $3[23];
  let content = t10;
  if (hideBorder)
    return content;
  let t11;
  if ($3[24] !== color2 || $3[25] !== content)
    t11 = /* @__PURE__ */ jsx_dev_runtime36.jsxDEV(Pane, {
      color: color2,
      children: content
    }, void 0, !1, void 0, this), $3[24] = color2, $3[25] = content, $3[26] = t11;
  else
    t11 = $3[26];
  return t11;
}
var import_compiler_runtime32, jsx_dev_runtime36;
var init_Dialog = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_useKeybinding();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_Pane();
  import_compiler_runtime32 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime36 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
