// Original: src/commands/install-github-app/CheckExistingSecretStep.tsx
function CheckExistingSecretStep(t0) {
  let $3 = import_compiler_runtime170.c(42), {
    useExistingSecret,
    secretName,
    onToggleUseExistingSecret,
    onSecretNameChange,
    onSubmit
  } = t0, [cursorOffset, setCursorOffset] = import_react118.useState(0), terminalSize = useTerminalSize(), [theme] = useTheme(), t1;
  if ($3[0] !== onToggleUseExistingSecret)
    t1 = () => onToggleUseExistingSecret(!0), $3[0] = onToggleUseExistingSecret, $3[1] = t1;
  else
    t1 = $3[1];
  let handlePrevious = t1, t2;
  if ($3[2] !== onToggleUseExistingSecret)
    t2 = () => onToggleUseExistingSecret(!1), $3[2] = onToggleUseExistingSecret, $3[3] = t2;
  else
    t2 = $3[3];
  let handleNext = t2, t3;
  if ($3[4] !== handleNext || $3[5] !== handlePrevious || $3[6] !== onSubmit)
    t3 = {
      "confirm:previous": handlePrevious,
      "confirm:next": handleNext,
      "confirm:yes": onSubmit
    }, $3[4] = handleNext, $3[5] = handlePrevious, $3[6] = onSubmit, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== useExistingSecret)
    t4 = {
      context: "Confirmation",
      isActive: useExistingSecret
    }, $3[8] = useExistingSecret, $3[9] = t4;
  else
    t4 = $3[9];
  useKeybindings(t3, t4);
  let t5;
  if ($3[10] !== handleNext || $3[11] !== handlePrevious)
    t5 = {
      "confirm:previous": handlePrevious,
      "confirm:next": handleNext
    }, $3[10] = handleNext, $3[11] = handlePrevious, $3[12] = t5;
  else
    t5 = $3[12];
  let t6 = !useExistingSecret, t7;
  if ($3[13] !== t6)
    t7 = {
      context: "Confirmation",
      isActive: t6
    }, $3[13] = t6, $3[14] = t7;
  else
    t7 = $3[14];
  useKeybindings(t5, t7);
  let t8;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
          bold: !0,
          children: "Install GitHub App"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Setup API key secret"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[15] = t8;
  else
    t8 = $3[15];
  let t9;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
        color: "warning",
        children: "ANTHROPIC_API_KEY already exists in repository secrets!"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[16] = t9;
  else
    t9 = $3[16];
  let t10;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
        children: "Would you like to:"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[17] = t10;
  else
    t10 = $3[17];
  let t11;
  if ($3[18] !== theme || $3[19] !== useExistingSecret)
    t11 = useExistingSecret ? color("success", theme)("> ") : "  ", $3[18] = theme, $3[19] = useExistingSecret, $3[20] = t11;
  else
    t11 = $3[20];
  let t12;
  if ($3[21] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
        children: [
          t11,
          "Use the existing API key"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[21] = t11, $3[22] = t12;
  else
    t12 = $3[22];
  let t13;
  if ($3[23] !== theme || $3[24] !== useExistingSecret)
    t13 = !useExistingSecret ? color("success", theme)("> ") : "  ", $3[23] = theme, $3[24] = useExistingSecret, $3[25] = t13;
  else
    t13 = $3[25];
  let t14;
  if ($3[26] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
        children: [
          t13,
          "Create a new secret with a different name"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[26] = t13, $3[27] = t14;
  else
    t14 = $3[27];
  let t15;
  if ($3[28] !== cursorOffset || $3[29] !== onSecretNameChange || $3[30] !== onSubmit || $3[31] !== secretName || $3[32] !== terminalSize || $3[33] !== useExistingSecret)
    t15 = !useExistingSecret && /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(jsx_dev_runtime212.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
            children: "Enter new secret name (alphanumeric with underscores):"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(TextInput, {
          value: secretName,
          onChange: onSecretNameChange,
          onSubmit,
          focus: !0,
          placeholder: "e.g., CLAUDE_API_KEY",
          columns: terminalSize.columns,
          cursorOffset,
          onChangeCursorOffset: setCursorOffset,
          showCursor: !0
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[28] = cursorOffset, $3[29] = onSecretNameChange, $3[30] = onSubmit, $3[31] = secretName, $3[32] = terminalSize, $3[33] = useExistingSecret, $3[34] = t15;
  else
    t15 = $3[34];
  let t16;
  if ($3[35] !== t12 || $3[36] !== t14 || $3[37] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      paddingX: 1,
      children: [
        t8,
        t9,
        t10,
        t12,
        t14,
        t15
      ]
    }, void 0, !0, void 0, this), $3[35] = t12, $3[36] = t14, $3[37] = t15, $3[38] = t16;
  else
    t16 = $3[38];
  let t17;
  if ($3[39] === Symbol.for("react.memo_cache_sentinel"))
    t17 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      children: /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\u2191/\u2193 to select \xB7 Enter to continue"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[39] = t17;
  else
    t17 = $3[39];
  let t18;
  if ($3[40] !== t16)
    t18 = /* @__PURE__ */ jsx_dev_runtime212.jsxDEV(jsx_dev_runtime212.Fragment, {
      children: [
        t16,
        t17
      ]
    }, void 0, !0, void 0, this), $3[40] = t16, $3[41] = t18;
  else
    t18 = $3[41];
  return t18;
}
var import_compiler_runtime170, import_react118, jsx_dev_runtime212;
var init_CheckExistingSecretStep = __esm(() => {
  init_TextInput();
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime170 = __toESM(require_react_compiler_runtime_development(), 1), import_react118 = __toESM(require_react_development(), 1), jsx_dev_runtime212 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
