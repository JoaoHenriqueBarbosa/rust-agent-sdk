// Original: src/components/PromptInput/PromptInputHelpMenu.tsx
function formatShortcut(shortcut) {
  return shortcut.replace(/\+/g, " + ");
}
function PromptInputHelpMenu(props) {
  let $3 = import_compiler_runtime163.c(99), {
    dimColor,
    fixedWidth,
    gap,
    paddingX
  } = props, t0 = useShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o"), t1;
  if ($3[0] !== t0)
    t1 = formatShortcut(t0), $3[0] = t0, $3[1] = t1;
  else
    t1 = $3[1];
  let transcriptShortcut = t1, t2 = useShortcutDisplay("app:toggleTodos", "Global", "ctrl+t"), t3;
  if ($3[2] !== t2)
    t3 = formatShortcut(t2), $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  let todosShortcut = t3, t4 = useShortcutDisplay("chat:undo", "Chat", "ctrl+_"), t5;
  if ($3[4] !== t4)
    t5 = formatShortcut(t4), $3[4] = t4, $3[5] = t5;
  else
    t5 = $3[5];
  let undoShortcut = t5, t6 = useShortcutDisplay("chat:stash", "Chat", "ctrl+s"), t7;
  if ($3[6] !== t6)
    t7 = formatShortcut(t6), $3[6] = t6, $3[7] = t7;
  else
    t7 = $3[7];
  let stashShortcut = t7, t8 = useShortcutDisplay("chat:cycleMode", "Chat", "shift+tab"), t9;
  if ($3[8] !== t8)
    t9 = formatShortcut(t8), $3[8] = t8, $3[9] = t9;
  else
    t9 = $3[9];
  let cycleModeShortcut = t9, t10 = useShortcutDisplay("chat:modelPicker", "Chat", "alt+p"), t11;
  if ($3[10] !== t10)
    t11 = formatShortcut(t10), $3[10] = t10, $3[11] = t11;
  else
    t11 = $3[11];
  let modelPickerShortcut = t11, t12 = useShortcutDisplay("chat:fastMode", "Chat", "alt+o"), t13;
  if ($3[12] !== t12)
    t13 = formatShortcut(t12), $3[12] = t12, $3[13] = t13;
  else
    t13 = $3[13];
  let fastModeShortcut = t13, t14 = useShortcutDisplay("chat:externalEditor", "Chat", "ctrl+g"), t15;
  if ($3[14] !== t14)
    t15 = formatShortcut(t14), $3[14] = t14, $3[15] = t15;
  else
    t15 = $3[15];
  let externalEditorShortcut = t15, t16 = useShortcutDisplay("app:toggleTerminal", "Global", "meta+j"), t17;
  if ($3[16] !== t16)
    t17 = formatShortcut(t16), $3[16] = t16, $3[17] = t17;
  else
    t17 = $3[17];
  let terminalShortcut = t17, t18 = useShortcutDisplay("chat:imagePaste", "Chat", "ctrl+v"), t19;
  if ($3[18] !== t18)
    t19 = formatShortcut(t18), $3[18] = t18, $3[19] = t19;
  else
    t19 = $3[19];
  let imagePasteShortcut = t19, t20;
  if ($3[20] !== dimColor || $3[21] !== terminalShortcut)
    t20 = null, $3[20] = dimColor, $3[21] = terminalShortcut, $3[22] = t20;
  else
    t20 = $3[22];
  let terminalShortcutElement = t20, t21 = fixedWidth ? 24 : void 0, t22;
  if ($3[23] !== dimColor)
    t22 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "! for bash mode"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[23] = dimColor, $3[24] = t22;
  else
    t22 = $3[24];
  let t23;
  if ($3[25] !== dimColor)
    t23 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "/ for commands"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[25] = dimColor, $3[26] = t23;
  else
    t23 = $3[26];
  let t24;
  if ($3[27] !== dimColor)
    t24 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "@ for file paths"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[27] = dimColor, $3[28] = t24;
  else
    t24 = $3[28];
  let t25;
  if ($3[29] !== dimColor)
    t25 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "& for background"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[29] = dimColor, $3[30] = t25;
  else
    t25 = $3[30];
  let t26;
  if ($3[31] !== dimColor)
    t26 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "/btw for side question"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[31] = dimColor, $3[32] = t26;
  else
    t26 = $3[32];
  let t27;
  if ($3[33] !== t21 || $3[34] !== t22 || $3[35] !== t23 || $3[36] !== t24 || $3[37] !== t25 || $3[38] !== t26)
    t27 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: t21,
      children: [
        t22,
        t23,
        t24,
        t25,
        t26
      ]
    }, void 0, !0, void 0, this), $3[33] = t21, $3[34] = t22, $3[35] = t23, $3[36] = t24, $3[37] = t25, $3[38] = t26, $3[39] = t27;
  else
    t27 = $3[39];
  let t28 = fixedWidth ? 35 : void 0, t29;
  if ($3[40] !== dimColor)
    t29 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "double tap esc to clear input"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[40] = dimColor, $3[41] = t29;
  else
    t29 = $3[41];
  let t30;
  if ($3[42] !== cycleModeShortcut || $3[43] !== dimColor)
    t30 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          cycleModeShortcut,
          " ",
          "to auto-accept edits"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[42] = cycleModeShortcut, $3[43] = dimColor, $3[44] = t30;
  else
    t30 = $3[44];
  let t31;
  if ($3[45] !== dimColor || $3[46] !== transcriptShortcut)
    t31 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          transcriptShortcut,
          " for verbose output"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[45] = dimColor, $3[46] = transcriptShortcut, $3[47] = t31;
  else
    t31 = $3[47];
  let t32;
  if ($3[48] !== dimColor || $3[49] !== todosShortcut)
    t32 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          todosShortcut,
          " to toggle tasks"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[48] = dimColor, $3[49] = todosShortcut, $3[50] = t32;
  else
    t32 = $3[50];
  let t33;
  if ($3[51] === Symbol.for("react.memo_cache_sentinel"))
    t33 = getNewlineInstructions(), $3[51] = t33;
  else
    t33 = $3[51];
  let t34;
  if ($3[52] !== dimColor)
    t34 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: t33
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[52] = dimColor, $3[53] = t34;
  else
    t34 = $3[53];
  let t35;
  if ($3[54] !== t28 || $3[55] !== t29 || $3[56] !== t30 || $3[57] !== t31 || $3[58] !== t32 || $3[59] !== t34 || $3[60] !== terminalShortcutElement)
    t35 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: t28,
      children: [
        t29,
        t30,
        t31,
        t32,
        terminalShortcutElement,
        t34
      ]
    }, void 0, !0, void 0, this), $3[54] = t28, $3[55] = t29, $3[56] = t30, $3[57] = t31, $3[58] = t32, $3[59] = t34, $3[60] = terminalShortcutElement, $3[61] = t35;
  else
    t35 = $3[61];
  let t36;
  if ($3[62] !== dimColor || $3[63] !== undoShortcut)
    t36 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          undoShortcut,
          " to undo"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[62] = dimColor, $3[63] = undoShortcut, $3[64] = t36;
  else
    t36 = $3[64];
  let t37;
  if ($3[65] !== dimColor)
    t37 = getPlatform() !== "windows" && /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "ctrl + z to suspend"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[65] = dimColor, $3[66] = t37;
  else
    t37 = $3[66];
  let t38;
  if ($3[67] !== dimColor || $3[68] !== imagePasteShortcut)
    t38 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          imagePasteShortcut,
          " to paste images"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[67] = dimColor, $3[68] = imagePasteShortcut, $3[69] = t38;
  else
    t38 = $3[69];
  let t39;
  if ($3[70] !== dimColor || $3[71] !== modelPickerShortcut)
    t39 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          modelPickerShortcut,
          " to switch model"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[70] = dimColor, $3[71] = modelPickerShortcut, $3[72] = t39;
  else
    t39 = $3[72];
  let t40;
  if ($3[73] !== dimColor || $3[74] !== fastModeShortcut)
    t40 = isFastModeEnabled() && isFastModeAvailable() && /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          fastModeShortcut,
          " to toggle fast mode"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[73] = dimColor, $3[74] = fastModeShortcut, $3[75] = t40;
  else
    t40 = $3[75];
  let t41;
  if ($3[76] !== dimColor || $3[77] !== stashShortcut)
    t41 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          stashShortcut,
          " to stash prompt"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[76] = dimColor, $3[77] = stashShortcut, $3[78] = t41;
  else
    t41 = $3[78];
  let t42;
  if ($3[79] !== dimColor || $3[80] !== externalEditorShortcut)
    t42 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: [
          externalEditorShortcut,
          " to edit in $EDITOR"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[79] = dimColor, $3[80] = externalEditorShortcut, $3[81] = t42;
  else
    t42 = $3[81];
  let t43;
  if ($3[82] !== dimColor)
    t43 = isKeybindingCustomizationEnabled() && /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedText, {
        dimColor,
        children: "/keybindings to customize"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[82] = dimColor, $3[83] = t43;
  else
    t43 = $3[83];
  let t44;
  if ($3[84] !== t36 || $3[85] !== t37 || $3[86] !== t38 || $3[87] !== t39 || $3[88] !== t40 || $3[89] !== t41 || $3[90] !== t42 || $3[91] !== t43)
    t44 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t36,
        t37,
        t38,
        t39,
        t40,
        t41,
        t42,
        t43
      ]
    }, void 0, !0, void 0, this), $3[84] = t36, $3[85] = t37, $3[86] = t38, $3[87] = t39, $3[88] = t40, $3[89] = t41, $3[90] = t42, $3[91] = t43, $3[92] = t44;
  else
    t44 = $3[92];
  let t45;
  if ($3[93] !== gap || $3[94] !== paddingX || $3[95] !== t27 || $3[96] !== t35 || $3[97] !== t44)
    t45 = /* @__PURE__ */ jsx_dev_runtime204.jsxDEV(ThemedBox_default, {
      paddingX,
      flexDirection: "row",
      gap,
      children: [
        t27,
        t35,
        t44
      ]
    }, void 0, !0, void 0, this), $3[93] = gap, $3[94] = paddingX, $3[95] = t27, $3[96] = t35, $3[97] = t44, $3[98] = t45;
  else
    t45 = $3[98];
  return t45;
}
var import_compiler_runtime163, jsx_dev_runtime204;
var init_PromptInputHelpMenu = __esm(() => {
  init_ink2();
  init_platform();
  init_loadUserBindings();
  init_useShortcutDisplay();
  init_fastMode();
  init_utils16();
  import_compiler_runtime163 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime204 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
