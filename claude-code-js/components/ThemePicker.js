// Original: src/components/ThemePicker.tsx
function ThemePicker(t0) {
  let $3 = import_compiler_runtime135.c(59), {
    onThemeSelect,
    showIntroText: t1,
    helpText: t2,
    showHelpTextBelow: t3,
    hideEscToCancel: t4,
    skipExitHandling: t5,
    onCancel: onCancelProp
  } = t0, showIntroText = t1 === void 0 ? !1 : t1, helpText = t2 === void 0 ? "" : t2, showHelpTextBelow = t3 === void 0 ? !1 : t3, hideEscToCancel = t4 === void 0 ? !1 : t4, skipExitHandling = t5 === void 0 ? !1 : t5, [theme] = useTheme(), themeSetting = useThemeSetting(), {
    columns
  } = useTerminalSize(), t6;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t6 = getColorModuleUnavailableReason(), $3[0] = t6;
  else
    t6 = $3[0];
  let colorModuleUnavailableReason = t6, t7;
  if ($3[1] !== theme)
    t7 = colorModuleUnavailableReason === null ? getSyntaxTheme(theme) : null, $3[1] = theme, $3[2] = t7;
  else
    t7 = $3[2];
  let syntaxTheme = t7, {
    setPreviewTheme,
    savePreview,
    cancelPreview
  } = usePreviewTheme(), syntaxHighlightingDisabled = useAppState(_temp68) ?? !1, setAppState = useSetAppState();
  useRegisterKeybindingContext("ThemePicker");
  let syntaxToggleShortcut = useShortcutDisplay("theme:toggleSyntaxHighlighting", "ThemePicker", "ctrl+t"), t8;
  if ($3[3] !== setAppState || $3[4] !== syntaxHighlightingDisabled)
    t8 = () => {
      if (colorModuleUnavailableReason === null) {
        let newValue = !syntaxHighlightingDisabled;
        updateSettingsForSource("userSettings", {
          syntaxHighlightingDisabled: newValue
        }), setAppState((prev) => ({
          ...prev,
          settings: {
            ...prev.settings,
            syntaxHighlightingDisabled: newValue
          }
        }));
      }
    }, $3[3] = setAppState, $3[4] = syntaxHighlightingDisabled, $3[5] = t8;
  else
    t8 = $3[5];
  let t9;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t9 = {
      context: "ThemePicker"
    }, $3[6] = t9;
  else
    t9 = $3[6];
  useKeybinding("theme:toggleSyntaxHighlighting", t8, t9);
  let exitState = useExitOnCtrlCDWithKeybindings(skipExitHandling ? _temp217 : void 0), t10;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t10 = [...[], {
      label: "Dark mode",
      value: "dark"
    }, {
      label: "Light mode",
      value: "light"
    }, {
      label: "Dark mode (colorblind-friendly)",
      value: "dark-daltonized"
    }, {
      label: "Light mode (colorblind-friendly)",
      value: "light-daltonized"
    }, {
      label: "Dark mode (ANSI colors only)",
      value: "dark-ansi"
    }, {
      label: "Light mode (ANSI colors only)",
      value: "light-ansi"
    }], $3[7] = t10;
  else
    t10 = $3[7];
  let themeOptions = t10, t11;
  if ($3[8] !== showIntroText)
    t11 = showIntroText ? /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedText, {
      children: "Let's get started."
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedText, {
      bold: !0,
      color: "permission",
      children: "Theme"
    }, void 0, !1, void 0, this), $3[8] = showIntroText, $3[9] = t11;
  else
    t11 = $3[9];
  let t12;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedText, {
      bold: !0,
      children: "Choose the text style that looks best with your terminal"
    }, void 0, !1, void 0, this), $3[10] = t12;
  else
    t12 = $3[10];
  let t13;
  if ($3[11] !== helpText || $3[12] !== showHelpTextBelow)
    t13 = helpText && !showHelpTextBelow && /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedText, {
      dimColor: !0,
      children: helpText
    }, void 0, !1, void 0, this), $3[11] = helpText, $3[12] = showHelpTextBelow, $3[13] = t13;
  else
    t13 = $3[13];
  let t14;
  if ($3[14] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t12,
        t13
      ]
    }, void 0, !0, void 0, this), $3[14] = t13, $3[15] = t14;
  else
    t14 = $3[15];
  let t15;
  if ($3[16] !== setPreviewTheme)
    t15 = (setting) => {
      setPreviewTheme(setting);
    }, $3[16] = setPreviewTheme, $3[17] = t15;
  else
    t15 = $3[17];
  let t16;
  if ($3[18] !== onThemeSelect || $3[19] !== savePreview)
    t16 = (setting_0) => {
      savePreview(), onThemeSelect(setting_0);
    }, $3[18] = onThemeSelect, $3[19] = savePreview, $3[20] = t16;
  else
    t16 = $3[20];
  let t17;
  if ($3[21] !== cancelPreview || $3[22] !== onCancelProp || $3[23] !== skipExitHandling)
    t17 = skipExitHandling ? () => {
      cancelPreview(), onCancelProp?.();
    } : async () => {
      cancelPreview(), await gracefulShutdown(0);
    }, $3[21] = cancelPreview, $3[22] = onCancelProp, $3[23] = skipExitHandling, $3[24] = t17;
  else
    t17 = $3[24];
  let t18;
  if ($3[25] !== t15 || $3[26] !== t16 || $3[27] !== t17 || $3[28] !== themeSetting)
    t18 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(Select, {
      options: themeOptions,
      onFocus: t15,
      onChange: t16,
      onCancel: t17,
      visibleOptionCount: themeOptions.length,
      defaultValue: themeSetting,
      defaultFocusValue: themeSetting
    }, void 0, !1, void 0, this), $3[25] = t15, $3[26] = t16, $3[27] = t17, $3[28] = themeSetting, $3[29] = t18;
  else
    t18 = $3[29];
  let t19;
  if ($3[30] !== t11 || $3[31] !== t14 || $3[32] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t11,
        t14,
        t18
      ]
    }, void 0, !0, void 0, this), $3[30] = t11, $3[31] = t14, $3[32] = t18, $3[33] = t19;
  else
    t19 = $3[33];
  let t20;
  if ($3[34] === Symbol.for("react.memo_cache_sentinel"))
    t20 = {
      oldStart: 1,
      newStart: 1,
      oldLines: 3,
      newLines: 3,
      lines: [" function greet() {", '-  console.log("Hello, World!");', '+  console.log("Hello, Claude!");', " }"]
    }, $3[34] = t20;
  else
    t20 = $3[34];
  let t21;
  if ($3[35] !== columns)
    t21 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderTop: !0,
      borderBottom: !0,
      borderLeft: !1,
      borderRight: !1,
      borderStyle: "dashed",
      borderColor: "subtle",
      children: /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(StructuredDiff, {
        patch: t20,
        dim: !1,
        filePath: "demo.js",
        firstLine: null,
        width: columns
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[35] = columns, $3[36] = t21;
  else
    t21 = $3[36];
  let t22 = colorModuleUnavailableReason === "env" ? `Syntax highlighting disabled (via CLAUDE_CODE_SYNTAX_HIGHLIGHT=${process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT})` : syntaxHighlightingDisabled ? `Syntax highlighting disabled (${syntaxToggleShortcut} to enable)` : syntaxTheme ? `Syntax theme: ${syntaxTheme.theme}${syntaxTheme.source ? ` (from ${syntaxTheme.source})` : ""} (${syntaxToggleShortcut} to disable)` : `Syntax highlighting enabled (${syntaxToggleShortcut} to disable)`, t23;
  if ($3[37] !== t22)
    t23 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " ",
        t22
      ]
    }, void 0, !0, void 0, this), $3[37] = t22, $3[38] = t23;
  else
    t23 = $3[38];
  let t24;
  if ($3[39] !== t21 || $3[40] !== t23)
    t24 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: "100%",
      children: [
        t21,
        t23
      ]
    }, void 0, !0, void 0, this), $3[39] = t21, $3[40] = t23, $3[41] = t24;
  else
    t24 = $3[41];
  let t25;
  if ($3[42] !== t19 || $3[43] !== t24)
    t25 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t19,
        t24
      ]
    }, void 0, !0, void 0, this), $3[42] = t19, $3[43] = t24, $3[44] = t25;
  else
    t25 = $3[44];
  let content = t25;
  if (!showIntroText) {
    let t26;
    if ($3[45] !== content)
      t26 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: content
      }, void 0, !1, void 0, this), $3[45] = content, $3[46] = t26;
    else
      t26 = $3[46];
    let t27;
    if ($3[47] !== helpText || $3[48] !== showHelpTextBelow)
      t27 = showHelpTextBelow && helpText && /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
        marginLeft: 3,
        children: /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedText, {
          dimColor: !0,
          children: helpText
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[47] = helpText, $3[48] = showHelpTextBelow, $3[49] = t27;
    else
      t27 = $3[49];
    let t28;
    if ($3[50] !== exitState || $3[51] !== hideEscToCancel)
      t28 = !hideEscToCancel && /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(jsx_dev_runtime172.Fragment, {
            children: [
              "Press ",
              exitState.keyName,
              " again to exit"
            ]
          }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "select"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Esc",
                action: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[50] = exitState, $3[51] = hideEscToCancel, $3[52] = t28;
    else
      t28 = $3[52];
    let t29;
    if ($3[53] !== t27 || $3[54] !== t28)
      t29 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: [
          t27,
          t28
        ]
      }, void 0, !0, void 0, this), $3[53] = t27, $3[54] = t28, $3[55] = t29;
    else
      t29 = $3[55];
    let t30;
    if ($3[56] !== t26 || $3[57] !== t29)
      t30 = /* @__PURE__ */ jsx_dev_runtime172.jsxDEV(jsx_dev_runtime172.Fragment, {
        children: [
          t26,
          t29
        ]
      }, void 0, !0, void 0, this), $3[56] = t26, $3[57] = t29, $3[58] = t30;
    else
      t30 = $3[58];
    return t30;
  }
  return content;
}
function _temp217() {}
function _temp68(s2) {
  return s2.settings.syntaxHighlightingDisabled;
}
var import_compiler_runtime135, jsx_dev_runtime172;
var init_ThemePicker = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  init_useTerminalSize();
  init_ink2();
  init_KeybindingContext();
  init_useKeybinding();
  init_useShortcutDisplay();
  init_AppState();
  init_gracefulShutdown();
  init_settings2();
  init_CustomSelect();
  init_Byline();
  init_KeyboardShortcutHint();
  init_colorDiff();
  init_StructuredDiff();
  import_compiler_runtime135 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime172 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
