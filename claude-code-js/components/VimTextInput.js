// Original: src/components/VimTextInput.tsx
function VimTextInput(props) {
  let $3 = import_compiler_runtime327.c(38), [theme2] = useTheme(), isTerminalFocused = useTerminalFocus();
  useClipboardImageHint(isTerminalFocused, !!props.onImagePaste);
  let { value: t0, onChange: t1, onSubmit: t2, onExit: t3, onExitMessage: t4, onHistoryReset: t5, onHistoryUp: t6, onHistoryDown: t7, onClearInput: t8, focus: t9, mask: t10, multiline: t11 } = props, t12 = props.showCursor ? " " : "", t13 = props.highlightPastedText, t14 = isTerminalFocused ? source_default.inverse : _temp197, t15;
  if ($3[0] !== theme2)
    t15 = color("text", theme2), $3[0] = theme2, $3[1] = t15;
  else
    t15 = $3[1];
  let t16;
  if ($3[2] !== props.columns || $3[3] !== props.cursorOffset || $3[4] !== props.disableCursorMovementForUpDownKeys || $3[5] !== props.disableEscapeDoublePress || $3[6] !== props.focus || $3[7] !== props.highlightPastedText || $3[8] !== props.inputFilter || $3[9] !== props.mask || $3[10] !== props.maxVisibleLines || $3[11] !== props.multiline || $3[12] !== props.onChange || $3[13] !== props.onChangeCursorOffset || $3[14] !== props.onClearInput || $3[15] !== props.onExit || $3[16] !== props.onExitMessage || $3[17] !== props.onHistoryDown || $3[18] !== props.onHistoryReset || $3[19] !== props.onHistoryUp || $3[20] !== props.onImagePaste || $3[21] !== props.onModeChange || $3[22] !== props.onSubmit || $3[23] !== props.onUndo || $3[24] !== props.value || $3[25] !== t12 || $3[26] !== t14 || $3[27] !== t15)
    t16 = {
      value: t0,
      onChange: t1,
      onSubmit: t2,
      onExit: t3,
      onExitMessage: t4,
      onHistoryReset: t5,
      onHistoryUp: t6,
      onHistoryDown: t7,
      onClearInput: t8,
      focus: t9,
      mask: t10,
      multiline: t11,
      cursorChar: t12,
      highlightPastedText: t13,
      invert: t14,
      themeText: t15,
      columns: props.columns,
      maxVisibleLines: props.maxVisibleLines,
      onImagePaste: props.onImagePaste,
      disableCursorMovementForUpDownKeys: props.disableCursorMovementForUpDownKeys,
      disableEscapeDoublePress: props.disableEscapeDoublePress,
      externalOffset: props.cursorOffset,
      onOffsetChange: props.onChangeCursorOffset,
      inputFilter: props.inputFilter,
      onModeChange: props.onModeChange,
      onUndo: props.onUndo
    }, $3[2] = props.columns, $3[3] = props.cursorOffset, $3[4] = props.disableCursorMovementForUpDownKeys, $3[5] = props.disableEscapeDoublePress, $3[6] = props.focus, $3[7] = props.highlightPastedText, $3[8] = props.inputFilter, $3[9] = props.mask, $3[10] = props.maxVisibleLines, $3[11] = props.multiline, $3[12] = props.onChange, $3[13] = props.onChangeCursorOffset, $3[14] = props.onClearInput, $3[15] = props.onExit, $3[16] = props.onExitMessage, $3[17] = props.onHistoryDown, $3[18] = props.onHistoryReset, $3[19] = props.onHistoryUp, $3[20] = props.onImagePaste, $3[21] = props.onModeChange, $3[22] = props.onSubmit, $3[23] = props.onUndo, $3[24] = props.value, $3[25] = t12, $3[26] = t14, $3[27] = t15, $3[28] = t16;
  else
    t16 = $3[28];
  let vimInputState = useVimInput(t16), {
    mode,
    setMode
  } = vimInputState, t17, t18;
  if ($3[29] !== mode || $3[30] !== props.initialMode || $3[31] !== setMode)
    t17 = () => {
      if (props.initialMode && props.initialMode !== mode)
        setMode(props.initialMode);
    }, t18 = [props.initialMode, mode, setMode], $3[29] = mode, $3[30] = props.initialMode, $3[31] = setMode, $3[32] = t17, $3[33] = t18;
  else
    t17 = $3[32], t18 = $3[33];
  import_react247.default.useEffect(t17, t18);
  let t19;
  if ($3[34] !== isTerminalFocused || $3[35] !== props || $3[36] !== vimInputState)
    t19 = /* @__PURE__ */ jsx_dev_runtime423.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime423.jsxDEV(BaseTextInput, {
        inputState: vimInputState,
        terminalFocus: isTerminalFocused,
        highlights: props.highlights,
        ...props
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[34] = isTerminalFocused, $3[35] = props, $3[36] = vimInputState, $3[37] = t19;
  else
    t19 = $3[37];
  return t19;
}
function _temp197(text2) {
  return text2;
}
var import_compiler_runtime327, import_react247, jsx_dev_runtime423;
var init_VimTextInput = __esm(() => {
  init_source();
  init_useClipboardImageHint();
  init_useVimInput();
  init_ink2();
  init_BaseTextInput();
  import_compiler_runtime327 = __toESM(require_react_compiler_runtime_development(), 1), import_react247 = __toESM(require_react_development(), 1), jsx_dev_runtime423 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
