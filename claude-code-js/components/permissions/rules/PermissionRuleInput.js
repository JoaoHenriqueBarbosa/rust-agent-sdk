// Original: src/components/permissions/rules/PermissionRuleInput.tsx
function PermissionRuleInput(t0) {
  let $3 = import_compiler_runtime233.c(24), {
    onCancel,
    onSubmit,
    ruleBehavior
  } = t0, [inputValue, setInputValue] = import_react166.useState(""), [cursorOffset, setCursorOffset] = import_react166.useState(0), exitState = useExitOnCtrlCDWithKeybindings(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Settings"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:no", onCancel, t1);
  let {
    columns
  } = useTerminalSize(), textInputColumns = columns - 6, t2;
  if ($3[1] !== onSubmit || $3[2] !== ruleBehavior)
    t2 = (value) => {
      let trimmedValue = value.trim();
      if (trimmedValue.length === 0)
        return;
      let ruleValue = permissionRuleValueFromString(trimmedValue);
      onSubmit(ruleValue, ruleBehavior);
    }, $3[1] = onSubmit, $3[2] = ruleBehavior, $3[3] = t2;
  else
    t2 = $3[3];
  let handleSubmit = t2, t3;
  if ($3[4] !== ruleBehavior)
    t3 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedText, {
      bold: !0,
      color: "permission",
      children: [
        "Add ",
        ruleBehavior,
        " permission rule"
      ]
    }, void 0, !0, void 0, this), $3[4] = ruleBehavior, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(Newline, {}, void 0, !1, void 0, this), $3[6] = t4;
  else
    t4 = $3[6];
  let t5, t6;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedText, {
      bold: !0,
      children: permissionRuleValueToString({
        toolName: WebFetchTool.name
      })
    }, void 0, !1, void 0, this), t6 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedText, {
      bold: !1,
      children: " or "
    }, void 0, !1, void 0, this), $3[7] = t5, $3[8] = t6;
  else
    t5 = $3[7], t6 = $3[8];
  let t7;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedText, {
      children: [
        "Permission rules are a tool name, optionally followed by a specifier in parentheses.",
        t4,
        "e.g.,",
        " ",
        t5,
        t6,
        /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedText, {
          bold: !0,
          children: permissionRuleValueToString({
            toolName: BashTool.name,
            ruleContent: "ls:*"
          })
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[9] = t7;
  else
    t7 = $3[9];
  let t8;
  if ($3[10] !== cursorOffset || $3[11] !== handleSubmit || $3[12] !== inputValue || $3[13] !== textInputColumns)
    t8 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t7,
        /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedBox_default, {
          borderDimColor: !0,
          borderStyle: "round",
          marginY: 1,
          paddingLeft: 1,
          children: /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(TextInput, {
            showCursor: !0,
            value: inputValue,
            onChange: setInputValue,
            onSubmit: handleSubmit,
            placeholder: `Enter permission rule${figures_default.ellipsis}`,
            columns: textInputColumns,
            cursorOffset,
            onChangeCursorOffset: setCursorOffset
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[10] = cursorOffset, $3[11] = handleSubmit, $3[12] = inputValue, $3[13] = textInputColumns, $3[14] = t8;
  else
    t8 = $3[14];
  let t9;
  if ($3[15] !== t3 || $3[16] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      borderStyle: "round",
      paddingLeft: 1,
      paddingRight: 1,
      borderColor: "permission",
      children: [
        t3,
        t8
      ]
    }, void 0, !0, void 0, this), $3[15] = t3, $3[16] = t8, $3[17] = t9;
  else
    t9 = $3[17];
  let t10;
  if ($3[18] !== exitState.keyName || $3[19] !== exitState.pending)
    t10 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Enter to submit \xB7 Esc to cancel"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[18] = exitState.keyName, $3[19] = exitState.pending, $3[20] = t10;
  else
    t10 = $3[20];
  let t11;
  if ($3[21] !== t10 || $3[22] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime295.jsxDEV(jsx_dev_runtime295.Fragment, {
      children: [
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[21] = t10, $3[22] = t9, $3[23] = t11;
  else
    t11 = $3[23];
  return t11;
}
var import_compiler_runtime233, import_react166, jsx_dev_runtime295;
var init_PermissionRuleInput = __esm(() => {
  init_figures();
  init_TextInput();
  init_useExitOnCtrlCDWithKeybindings();
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  init_BashTool();
  init_WebFetchTool();
  init_permissionRuleParser();
  import_compiler_runtime233 = __toESM(require_react_compiler_runtime_development(), 1), import_react166 = __toESM(require_react_development(), 1), jsx_dev_runtime295 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
