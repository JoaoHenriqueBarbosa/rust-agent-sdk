// Original: src/components/TextInput.tsx
function TextInput(props) {
  let [theme] = useTheme(), isTerminalFocused = useTerminalFocus(), accessibilityEnabled = import_react88.useMemo(() => isEnvTruthy(process.env.CLAUDE_CODE_ACCESSIBILITY), []), reducedMotion = useSettings().prefersReducedMotion ?? !1, isVoiceRecording = useVoiceState((s2) => s2.voiceState) === "recording", audioLevels = useVoiceState((s_0) => s_0.voiceAudioLevels), smoothedRef = import_react88.useRef(Array(CURSOR_WAVEFORM_WIDTH).fill(0)), needsAnimation = isVoiceRecording && !reducedMotion, [animRef, animTime] = [() => {}, 0];
  useClipboardImageHint(isTerminalFocused, !!props.onImagePaste);
  let canShowCursor = isTerminalFocused && !accessibilityEnabled, invert;
  if (!canShowCursor)
    invert = (text2) => text2;
  else if (isVoiceRecording && !reducedMotion) {
    let smoothed = smoothedRef.current, raw = audioLevels.length > 0 ? audioLevels[audioLevels.length - 1] ?? 0 : 0, target = Math.min(raw * LEVEL_BOOST, 1);
    smoothed[0] = (smoothed[0] ?? 0) * SMOOTH + target * (1 - SMOOTH);
    let displayLevel = smoothed[0] ?? 0, barIndex = Math.max(1, Math.min(Math.round(displayLevel * (BARS.length - 1)), BARS.length - 1)), isSilent = raw < SILENCE_THRESHOLD, hue = animTime / 1000 * 90 % 360, {
      r: r4,
      g,
      b
    } = isSilent ? {
      r: 128,
      g: 128,
      b: 128
    } : hueToRgb(hue);
    invert = () => source_default.rgb(r4, g, b)(BARS[barIndex]);
  } else
    invert = source_default.inverse;
  let textInputState = useTextInput({
    value: props.value,
    onChange: props.onChange,
    onSubmit: props.onSubmit,
    onExit: props.onExit,
    onExitMessage: props.onExitMessage,
    onHistoryReset: props.onHistoryReset,
    onHistoryUp: props.onHistoryUp,
    onHistoryDown: props.onHistoryDown,
    onClearInput: props.onClearInput,
    focus: props.focus,
    mask: props.mask,
    multiline: props.multiline,
    cursorChar: props.showCursor ? " " : "",
    highlightPastedText: props.highlightPastedText,
    invert,
    themeText: color("text", theme),
    columns: props.columns,
    maxVisibleLines: props.maxVisibleLines,
    onImagePaste: props.onImagePaste,
    disableCursorMovementForUpDownKeys: props.disableCursorMovementForUpDownKeys,
    disableEscapeDoublePress: props.disableEscapeDoublePress,
    externalOffset: props.cursorOffset,
    onOffsetChange: props.onChangeCursorOffset,
    inputFilter: props.inputFilter,
    inlineGhostText: props.inlineGhostText,
    dim: source_default.dim
  });
  return /* @__PURE__ */ jsx_dev_runtime158.jsxDEV(ThemedBox_default, {
    ref: animRef,
    children: /* @__PURE__ */ jsx_dev_runtime158.jsxDEV(BaseTextInput, {
      inputState: textInputState,
      terminalFocus: isTerminalFocused,
      highlights: props.highlights,
      invert,
      hidePlaceholderText: isVoiceRecording,
      ...props
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react88, jsx_dev_runtime158, BARS = " \u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588", CURSOR_WAVEFORM_WIDTH = 1, SMOOTH = 0.7, LEVEL_BOOST = 1.8, SILENCE_THRESHOLD = 0.15;
var init_TextInput = __esm(() => {
  init_source();
  init_voice();
  init_useClipboardImageHint();
  init_useSettings();
  init_useTextInput();
  init_ink2();
  init_envUtils();
  init_BaseTextInput();
  init_utils10();
  import_react88 = __toESM(require_react_development(), 1), jsx_dev_runtime158 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
