// Original: src/commands/install-github-app/ApiKeyStep.tsx
function ApiKeyStep(t0) {
  let $3 = import_compiler_runtime169.c(55), {
    existingApiKey,
    apiKeyOrOAuthToken,
    onApiKeyChange,
    onSubmit,
    onToggleUseExistingKey,
    onCreateOAuthToken,
    selectedOption: t1,
    onSelectOption
  } = t0, selectedOption = t1 === void 0 ? existingApiKey ? "existing" : onCreateOAuthToken ? "oauth" : "new" : t1, [cursorOffset, setCursorOffset] = import_react117.useState(0), terminalSize = useTerminalSize(), [theme] = useTheme(), t2;
  if ($3[0] !== existingApiKey || $3[1] !== onCreateOAuthToken || $3[2] !== onSelectOption || $3[3] !== onToggleUseExistingKey || $3[4] !== selectedOption)
    t2 = () => {
      if (selectedOption === "new" && onCreateOAuthToken)
        onSelectOption?.("oauth");
      else if (selectedOption === "oauth" && existingApiKey)
        onSelectOption?.("existing"), onToggleUseExistingKey(!0);
    }, $3[0] = existingApiKey, $3[1] = onCreateOAuthToken, $3[2] = onSelectOption, $3[3] = onToggleUseExistingKey, $3[4] = selectedOption, $3[5] = t2;
  else
    t2 = $3[5];
  let handlePrevious = t2, t3;
  if ($3[6] !== onCreateOAuthToken || $3[7] !== onSelectOption || $3[8] !== onToggleUseExistingKey || $3[9] !== selectedOption)
    t3 = () => {
      if (selectedOption === "existing")
        onSelectOption?.(onCreateOAuthToken ? "oauth" : "new"), onToggleUseExistingKey(!1);
      else if (selectedOption === "oauth")
        onSelectOption?.("new");
    }, $3[6] = onCreateOAuthToken, $3[7] = onSelectOption, $3[8] = onToggleUseExistingKey, $3[9] = selectedOption, $3[10] = t3;
  else
    t3 = $3[10];
  let handleNext = t3, t4;
  if ($3[11] !== onCreateOAuthToken || $3[12] !== onSubmit || $3[13] !== selectedOption)
    t4 = () => {
      if (selectedOption === "oauth" && onCreateOAuthToken)
        onCreateOAuthToken();
      else
        onSubmit();
    }, $3[11] = onCreateOAuthToken, $3[12] = onSubmit, $3[13] = selectedOption, $3[14] = t4;
  else
    t4 = $3[14];
  let handleConfirm = t4, isTextInputVisible = selectedOption === "new", t5;
  if ($3[15] !== handleConfirm || $3[16] !== handleNext || $3[17] !== handlePrevious)
    t5 = {
      "confirm:previous": handlePrevious,
      "confirm:next": handleNext,
      "confirm:yes": handleConfirm
    }, $3[15] = handleConfirm, $3[16] = handleNext, $3[17] = handlePrevious, $3[18] = t5;
  else
    t5 = $3[18];
  let t6 = !isTextInputVisible, t7;
  if ($3[19] !== t6)
    t7 = {
      context: "Confirmation",
      isActive: t6
    }, $3[19] = t6, $3[20] = t7;
  else
    t7 = $3[20];
  useKeybindings(t5, t7);
  let t8;
  if ($3[21] !== handleNext || $3[22] !== handlePrevious)
    t8 = {
      "confirm:previous": handlePrevious,
      "confirm:next": handleNext
    }, $3[21] = handleNext, $3[22] = handlePrevious, $3[23] = t8;
  else
    t8 = $3[23];
  let t9;
  if ($3[24] !== isTextInputVisible)
    t9 = {
      context: "Confirmation",
      isActive: isTextInputVisible
    }, $3[24] = isTextInputVisible, $3[25] = t9;
  else
    t9 = $3[25];
  useKeybindings(t8, t9);
  let t10;
  if ($3[26] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedText, {
          bold: !0,
          children: "Install GitHub App"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Choose API key"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[26] = t10;
  else
    t10 = $3[26];
  let t11;
  if ($3[27] !== existingApiKey || $3[28] !== selectedOption || $3[29] !== theme)
    t11 = existingApiKey && /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedText, {
        children: [
          selectedOption === "existing" ? color("success", theme)("> ") : "  ",
          "Use your existing Claude Code API key"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[27] = existingApiKey, $3[28] = selectedOption, $3[29] = theme, $3[30] = t11;
  else
    t11 = $3[30];
  let t12;
  if ($3[31] !== onCreateOAuthToken || $3[32] !== selectedOption || $3[33] !== theme)
    t12 = onCreateOAuthToken && /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedText, {
        children: [
          selectedOption === "oauth" ? color("success", theme)("> ") : "  ",
          "Create a long-lived token with your Claude subscription"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[31] = onCreateOAuthToken, $3[32] = selectedOption, $3[33] = theme, $3[34] = t12;
  else
    t12 = $3[34];
  let t13;
  if ($3[35] !== selectedOption || $3[36] !== theme)
    t13 = selectedOption === "new" ? color("success", theme)("> ") : "  ", $3[35] = selectedOption, $3[36] = theme, $3[37] = t13;
  else
    t13 = $3[37];
  let t14;
  if ($3[38] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedText, {
        children: [
          t13,
          "Enter a new API key"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[38] = t13, $3[39] = t14;
  else
    t14 = $3[39];
  let t15;
  if ($3[40] !== apiKeyOrOAuthToken || $3[41] !== cursorOffset || $3[42] !== onApiKeyChange || $3[43] !== onSubmit || $3[44] !== selectedOption || $3[45] !== terminalSize)
    t15 = selectedOption === "new" && /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(TextInput, {
      value: apiKeyOrOAuthToken,
      onChange: onApiKeyChange,
      onSubmit,
      onPaste: onApiKeyChange,
      focus: !0,
      placeholder: "sk-ant\u2026 (Create a new key at https://platform.claude.com/settings/keys)",
      mask: "*",
      columns: terminalSize.columns,
      cursorOffset,
      onChangeCursorOffset: setCursorOffset,
      showCursor: !0
    }, void 0, !1, void 0, this), $3[40] = apiKeyOrOAuthToken, $3[41] = cursorOffset, $3[42] = onApiKeyChange, $3[43] = onSubmit, $3[44] = selectedOption, $3[45] = terminalSize, $3[46] = t15;
  else
    t15 = $3[46];
  let t16;
  if ($3[47] !== t11 || $3[48] !== t12 || $3[49] !== t14 || $3[50] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      paddingX: 1,
      children: [
        t10,
        t11,
        t12,
        t14,
        t15
      ]
    }, void 0, !0, void 0, this), $3[47] = t11, $3[48] = t12, $3[49] = t14, $3[50] = t15, $3[51] = t16;
  else
    t16 = $3[51];
  let t17;
  if ($3[52] === Symbol.for("react.memo_cache_sentinel"))
    t17 = /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      children: /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\u2191/\u2193 to select \xB7 Enter to continue"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[52] = t17;
  else
    t17 = $3[52];
  let t18;
  if ($3[53] !== t16)
    t18 = /* @__PURE__ */ jsx_dev_runtime211.jsxDEV(jsx_dev_runtime211.Fragment, {
      children: [
        t16,
        t17
      ]
    }, void 0, !0, void 0, this), $3[53] = t16, $3[54] = t18;
  else
    t18 = $3[54];
  return t18;
}
var import_compiler_runtime169, import_react117, jsx_dev_runtime211;
var init_ApiKeyStep = __esm(() => {
  init_TextInput();
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime169 = __toESM(require_react_compiler_runtime_development(), 1), import_react117 = __toESM(require_react_development(), 1), jsx_dev_runtime211 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
