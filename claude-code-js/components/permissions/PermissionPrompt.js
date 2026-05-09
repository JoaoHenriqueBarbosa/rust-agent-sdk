// Original: src/components/permissions/PermissionPrompt.tsx
function PermissionPrompt(t0) {
  let $3 = import_compiler_runtime301.c(54), {
    options: options2,
    onSelect,
    onCancel,
    question: t1,
    toolAnalyticsContext
  } = t0, question = t1 === void 0 ? "Do you want to proceed?" : t1, setAppState = useSetAppState(), [acceptFeedback, setAcceptFeedback] = import_react217.useState(""), [rejectFeedback, setRejectFeedback] = import_react217.useState(""), [acceptInputMode, setAcceptInputMode] = import_react217.useState(!1), [rejectInputMode, setRejectInputMode] = import_react217.useState(!1), [focusedValue, setFocusedValue] = import_react217.useState(null), [acceptFeedbackModeEntered, setAcceptFeedbackModeEntered] = import_react217.useState(!1), [rejectFeedbackModeEntered, setRejectFeedbackModeEntered] = import_react217.useState(!1), t2;
  if ($3[0] !== focusedValue || $3[1] !== options2) {
    let t32;
    if ($3[3] !== focusedValue)
      t32 = (opt) => opt.value === focusedValue, $3[3] = focusedValue, $3[4] = t32;
    else
      t32 = $3[4];
    t2 = options2.find(t32), $3[0] = focusedValue, $3[1] = options2, $3[2] = t2;
  } else
    t2 = $3[2];
  let focusedFeedbackType = t2?.feedbackConfig?.type, showTabHint = focusedFeedbackType === "accept" && !acceptInputMode || focusedFeedbackType === "reject" && !rejectInputMode, t3;
  if ($3[5] !== acceptInputMode || $3[6] !== options2 || $3[7] !== rejectInputMode) {
    let t42;
    if ($3[9] !== acceptInputMode || $3[10] !== rejectInputMode)
      t42 = (opt_0) => {
        let {
          value,
          label,
          feedbackConfig
        } = opt_0;
        if (!feedbackConfig)
          return {
            label,
            value
          };
        let {
          type,
          placeholder
        } = feedbackConfig, isInputMode = type === "accept" ? acceptInputMode : rejectInputMode, onChange = type === "accept" ? setAcceptFeedback : setRejectFeedback, defaultPlaceholder = DEFAULT_PLACEHOLDERS[type];
        if (isInputMode)
          return {
            type: "input",
            label,
            value,
            placeholder: placeholder ?? defaultPlaceholder,
            onChange,
            allowEmptySubmitToCancel: !0
          };
        return {
          label,
          value
        };
      }, $3[9] = acceptInputMode, $3[10] = rejectInputMode, $3[11] = t42;
    else
      t42 = $3[11];
    t3 = options2.map(t42), $3[5] = acceptInputMode, $3[6] = options2, $3[7] = rejectInputMode, $3[8] = t3;
  } else
    t3 = $3[8];
  let selectOptions = t3, t4;
  if ($3[12] !== acceptInputMode || $3[13] !== options2 || $3[14] !== rejectInputMode || $3[15] !== toolAnalyticsContext?.isMcp || $3[16] !== toolAnalyticsContext?.toolName)
    t4 = (value_0) => {
      let option = options2.find((opt_1) => opt_1.value === value_0);
      if (!option?.feedbackConfig)
        return;
      let {
        type: type_0
      } = option.feedbackConfig, analyticsProps = {
        toolName: toolAnalyticsContext?.toolName,
        isMcp: toolAnalyticsContext?.isMcp ?? !1
      };
      if (type_0 === "accept")
        if (acceptInputMode)
          setAcceptInputMode(!1), logEvent("tengu_accept_feedback_mode_collapsed", analyticsProps);
        else
          setAcceptInputMode(!0), setAcceptFeedbackModeEntered(!0), logEvent("tengu_accept_feedback_mode_entered", analyticsProps);
      else if (type_0 === "reject")
        if (rejectInputMode)
          setRejectInputMode(!1), logEvent("tengu_reject_feedback_mode_collapsed", analyticsProps);
        else
          setRejectInputMode(!0), setRejectFeedbackModeEntered(!0), logEvent("tengu_reject_feedback_mode_entered", analyticsProps);
    }, $3[12] = acceptInputMode, $3[13] = options2, $3[14] = rejectInputMode, $3[15] = toolAnalyticsContext?.isMcp, $3[16] = toolAnalyticsContext?.toolName, $3[17] = t4;
  else
    t4 = $3[17];
  let handleInputModeToggle = t4, t5;
  if ($3[18] !== acceptFeedback || $3[19] !== acceptFeedbackModeEntered || $3[20] !== onSelect || $3[21] !== options2 || $3[22] !== rejectFeedback || $3[23] !== rejectFeedbackModeEntered || $3[24] !== toolAnalyticsContext?.isMcp || $3[25] !== toolAnalyticsContext?.toolName)
    t5 = (value_1) => {
      let option_0 = options2.find((opt_2) => opt_2.value === value_1);
      if (!option_0)
        return;
      let feedback2;
      if (option_0.feedbackConfig) {
        let trimmedFeedback = (option_0.feedbackConfig.type === "accept" ? acceptFeedback : rejectFeedback).trim();
        if (trimmedFeedback)
          feedback2 = trimmedFeedback;
        let analyticsProps_0 = {
          toolName: toolAnalyticsContext?.toolName,
          isMcp: toolAnalyticsContext?.isMcp ?? !1,
          has_instructions: !!trimmedFeedback,
          instructions_length: trimmedFeedback?.length ?? 0,
          entered_feedback_mode: option_0.feedbackConfig.type === "accept" ? acceptFeedbackModeEntered : rejectFeedbackModeEntered
        };
        if (option_0.feedbackConfig.type === "accept")
          logEvent("tengu_accept_submitted", analyticsProps_0);
        else if (option_0.feedbackConfig.type === "reject")
          logEvent("tengu_reject_submitted", analyticsProps_0);
      }
      onSelect(value_1, feedback2);
    }, $3[18] = acceptFeedback, $3[19] = acceptFeedbackModeEntered, $3[20] = onSelect, $3[21] = options2, $3[22] = rejectFeedback, $3[23] = rejectFeedbackModeEntered, $3[24] = toolAnalyticsContext?.isMcp, $3[25] = toolAnalyticsContext?.toolName, $3[26] = t5;
  else
    t5 = $3[26];
  let handleSelect = t5, handlers;
  if ($3[27] !== handleSelect || $3[28] !== options2) {
    handlers = {};
    for (let opt_3 of options2)
      if (opt_3.keybinding)
        handlers[opt_3.keybinding] = () => handleSelect(opt_3.value);
    $3[27] = handleSelect, $3[28] = options2, $3[29] = handlers;
  } else
    handlers = $3[29];
  let keybindingHandlers = handlers, t6;
  if ($3[30] === Symbol.for("react.memo_cache_sentinel"))
    t6 = {
      context: "Confirmation"
    }, $3[30] = t6;
  else
    t6 = $3[30];
  useKeybindings(keybindingHandlers, t6);
  let t7;
  if ($3[31] !== onCancel || $3[32] !== setAppState)
    t7 = () => {
      logEvent("tengu_permission_request_escape", {}), setAppState(_temp183), onCancel?.();
    }, $3[31] = onCancel, $3[32] = setAppState, $3[33] = t7;
  else
    t7 = $3[33];
  let handleCancel = t7, t8;
  if ($3[34] !== question)
    t8 = typeof question === "string" ? /* @__PURE__ */ jsx_dev_runtime389.jsxDEV(ThemedText, {
      children: question
    }, void 0, !1, void 0, this) : question, $3[34] = question, $3[35] = t8;
  else
    t8 = $3[35];
  let t9;
  if ($3[36] !== acceptFeedback || $3[37] !== acceptInputMode || $3[38] !== options2 || $3[39] !== rejectFeedback || $3[40] !== rejectInputMode)
    t9 = (value_2) => {
      let newOption = options2.find((opt_4) => opt_4.value === value_2);
      if (newOption?.feedbackConfig?.type !== "accept" && acceptInputMode && !acceptFeedback.trim())
        setAcceptInputMode(!1);
      if (newOption?.feedbackConfig?.type !== "reject" && rejectInputMode && !rejectFeedback.trim())
        setRejectInputMode(!1);
      setFocusedValue(value_2);
    }, $3[36] = acceptFeedback, $3[37] = acceptInputMode, $3[38] = options2, $3[39] = rejectFeedback, $3[40] = rejectInputMode, $3[41] = t9;
  else
    t9 = $3[41];
  let t10;
  if ($3[42] !== handleCancel || $3[43] !== handleInputModeToggle || $3[44] !== handleSelect || $3[45] !== selectOptions || $3[46] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime389.jsxDEV(Select, {
      options: selectOptions,
      inlineDescriptions: !0,
      onChange: handleSelect,
      onCancel: handleCancel,
      onFocus: t9,
      onInputModeToggle: handleInputModeToggle
    }, void 0, !1, void 0, this), $3[42] = handleCancel, $3[43] = handleInputModeToggle, $3[44] = handleSelect, $3[45] = selectOptions, $3[46] = t9, $3[47] = t10;
  else
    t10 = $3[47];
  let t11 = showTabHint && " \xB7 Tab to amend", t12;
  if ($3[48] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime389.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime389.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Esc to cancel",
          t11
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[48] = t11, $3[49] = t12;
  else
    t12 = $3[49];
  let t13;
  if ($3[50] !== t10 || $3[51] !== t12 || $3[52] !== t8)
    t13 = /* @__PURE__ */ jsx_dev_runtime389.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t8,
        t10,
        t12
      ]
    }, void 0, !0, void 0, this), $3[50] = t10, $3[51] = t12, $3[52] = t8, $3[53] = t13;
  else
    t13 = $3[53];
  return t13;
}
function _temp183(prev) {
  return {
    ...prev,
    attribution: {
      ...prev.attribution,
      escapeCount: prev.attribution.escapeCount + 1
    }
  };
}
var import_compiler_runtime301, import_react217, jsx_dev_runtime389, DEFAULT_PLACEHOLDERS;
var init_PermissionPrompt = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_AppState();
  init_select();
  import_compiler_runtime301 = __toESM(require_react_compiler_runtime_development(), 1), import_react217 = __toESM(require_react_development(), 1), jsx_dev_runtime389 = __toESM(require_react_jsx_dev_runtime_development(), 1), DEFAULT_PLACEHOLDERS = {
    accept: "tell Claude what to do next",
    reject: "tell Claude what to do differently"
  };
});
