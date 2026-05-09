// Original: src/components/permissions/AskUserQuestionPermissionRequest/QuestionView.tsx
function QuestionView(t0) {
  let $3 = import_compiler_runtime290.c(114), {
    question,
    questions,
    currentQuestionIndex,
    answers,
    questionStates,
    hideSubmitTab: t1,
    planFilePath,
    minContentHeight,
    minContentWidth,
    onUpdateQuestionState,
    onAnswer,
    onTextInputFocus,
    onCancel,
    onSubmit,
    onTabPrev,
    onTabNext,
    onRespondToClaude,
    onFinishPlanInterview,
    onImagePaste,
    pastedContents,
    onRemoveImage
  } = t0, hideSubmitTab = t1 === void 0 ? !1 : t1, isInPlanMode = useAppState(_temp175) === "plan", [isFooterFocused, setIsFooterFocused] = import_react204.useState(!1), [footerIndex, setFooterIndex] = import_react204.useState(0), [isOtherFocused, setIsOtherFocused] = import_react204.useState(!1), t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel")) {
    let editor = getExternalEditor();
    t2 = editor ? toIDEDisplayName(editor) : null, $3[0] = t2;
  } else
    t2 = $3[0];
  let editorName = t2, t3;
  if ($3[1] !== onTextInputFocus)
    t3 = (value) => {
      let isOther = value === "__other__";
      setIsOtherFocused(isOther), onTextInputFocus(isOther);
    }, $3[1] = onTextInputFocus, $3[2] = t3;
  else
    t3 = $3[2];
  let handleFocus = t3, t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t4 = () => {
      setIsFooterFocused(!0);
    }, $3[3] = t4;
  else
    t4 = $3[3];
  let handleDownFromLastItem = t4, t5;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t5 = () => {
      setIsFooterFocused(!1);
    }, $3[4] = t5;
  else
    t5 = $3[4];
  let handleUpFromFooter = t5, t6;
  if ($3[5] !== footerIndex || $3[6] !== isFooterFocused || $3[7] !== isInPlanMode || $3[8] !== onCancel || $3[9] !== onFinishPlanInterview || $3[10] !== onRespondToClaude)
    t6 = (e) => {
      if (!isFooterFocused)
        return;
      if (e.key === "up" || e.ctrl && e.key === "p") {
        if (e.preventDefault(), footerIndex === 0)
          handleUpFromFooter();
        else
          setFooterIndex(0);
        return;
      }
      if (e.key === "down" || e.ctrl && e.key === "n") {
        if (e.preventDefault(), isInPlanMode && footerIndex === 0)
          setFooterIndex(1);
        return;
      }
      if (e.key === "return") {
        if (e.preventDefault(), footerIndex === 0)
          onRespondToClaude();
        else
          onFinishPlanInterview();
        return;
      }
      if (e.key === "escape")
        e.preventDefault(), onCancel();
    }, $3[5] = footerIndex, $3[6] = isFooterFocused, $3[7] = isInPlanMode, $3[8] = onCancel, $3[9] = onFinishPlanInterview, $3[10] = onRespondToClaude, $3[11] = t6;
  else
    t6 = $3[11];
  let handleKeyDown = t6, handleOpenEditor, questionText, t7;
  if ($3[12] !== onUpdateQuestionState || $3[13] !== question || $3[14] !== questionStates) {
    let textOptions = question.options.map(_temp275);
    questionText = question.question;
    let questionState = questionStates[questionText], t82;
    if ($3[18] !== onUpdateQuestionState || $3[19] !== question.multiSelect || $3[20] !== questionText)
      t82 = async (currentValue, setValue2) => {
        let result = await editPromptInEditor(currentValue);
        if (result.content !== null && result.content !== currentValue)
          setValue2(result.content), onUpdateQuestionState(questionText, {
            textInputValue: result.content
          }, question.multiSelect ?? !1);
      }, $3[18] = onUpdateQuestionState, $3[19] = question.multiSelect, $3[20] = questionText, $3[21] = t82;
    else
      t82 = $3[21];
    handleOpenEditor = t82;
    let t92 = question.multiSelect ? "Type something" : "Type something.", t102 = questionState?.textInputValue ?? "", t112;
    if ($3[22] !== onUpdateQuestionState || $3[23] !== question.multiSelect || $3[24] !== questionText)
      t112 = (value_0) => {
        onUpdateQuestionState(questionText, {
          textInputValue: value_0
        }, question.multiSelect ?? !1);
      }, $3[22] = onUpdateQuestionState, $3[23] = question.multiSelect, $3[24] = questionText, $3[25] = t112;
    else
      t112 = $3[25];
    let t122;
    if ($3[26] !== t102 || $3[27] !== t112 || $3[28] !== t92)
      t122 = {
        type: "input",
        value: "__other__",
        label: "Other",
        placeholder: t92,
        initialValue: t102,
        onChange: t112
      }, $3[26] = t102, $3[27] = t112, $3[28] = t92, $3[29] = t122;
    else
      t122 = $3[29];
    let otherOption = t122;
    t7 = [...textOptions, otherOption], $3[12] = onUpdateQuestionState, $3[13] = question, $3[14] = questionStates, $3[15] = handleOpenEditor, $3[16] = questionText, $3[17] = t7;
  } else
    handleOpenEditor = $3[15], questionText = $3[16], t7 = $3[17];
  let options2 = t7;
  if (!question.multiSelect && question.options.some(_temp349)) {
    let t82;
    if ($3[30] !== answers || $3[31] !== currentQuestionIndex || $3[32] !== hideSubmitTab || $3[33] !== minContentHeight || $3[34] !== minContentWidth || $3[35] !== onAnswer || $3[36] !== onCancel || $3[37] !== onFinishPlanInterview || $3[38] !== onRespondToClaude || $3[39] !== onTabNext || $3[40] !== onTabPrev || $3[41] !== onTextInputFocus || $3[42] !== onUpdateQuestionState || $3[43] !== question || $3[44] !== questionStates || $3[45] !== questions)
      t82 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(PreviewQuestionView, {
        question,
        questions,
        currentQuestionIndex,
        answers,
        questionStates,
        hideSubmitTab,
        minContentHeight,
        minContentWidth,
        onUpdateQuestionState,
        onAnswer,
        onTextInputFocus,
        onCancel,
        onTabPrev,
        onTabNext,
        onRespondToClaude,
        onFinishPlanInterview
      }, void 0, !1, void 0, this), $3[30] = answers, $3[31] = currentQuestionIndex, $3[32] = hideSubmitTab, $3[33] = minContentHeight, $3[34] = minContentWidth, $3[35] = onAnswer, $3[36] = onCancel, $3[37] = onFinishPlanInterview, $3[38] = onRespondToClaude, $3[39] = onTabNext, $3[40] = onTabPrev, $3[41] = onTextInputFocus, $3[42] = onUpdateQuestionState, $3[43] = question, $3[44] = questionStates, $3[45] = questions, $3[46] = t82;
    else
      t82 = $3[46];
    return t82;
  }
  let t8;
  if ($3[47] !== isInPlanMode || $3[48] !== planFilePath)
    t8 = isInPlanMode && planFilePath && /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 0,
      children: [
        /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(Divider, {
          color: "inactive"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
          color: "inactive",
          children: [
            "Planning: ",
            /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(FilePathLink, {
              filePath: planFilePath
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[47] = isInPlanMode, $3[48] = planFilePath, $3[49] = t8;
  else
    t8 = $3[49];
  let t9;
  if ($3[50] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      marginTop: -1,
      children: /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(Divider, {
        color: "inactive"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[50] = t9;
  else
    t9 = $3[50];
  let t10;
  if ($3[51] !== answers || $3[52] !== currentQuestionIndex || $3[53] !== hideSubmitTab || $3[54] !== questions)
    t10 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(QuestionNavigationBar, {
      questions,
      currentQuestionIndex,
      answers,
      hideSubmitTab
    }, void 0, !1, void 0, this), $3[51] = answers, $3[52] = currentQuestionIndex, $3[53] = hideSubmitTab, $3[54] = questions, $3[55] = t10;
  else
    t10 = $3[55];
  let t11;
  if ($3[56] !== question.question)
    t11 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(PermissionRequestTitle, {
      title: question.question,
      color: "text"
    }, void 0, !1, void 0, this), $3[56] = question.question, $3[57] = t11;
  else
    t11 = $3[57];
  let t12;
  if ($3[58] !== currentQuestionIndex || $3[59] !== handleFocus || $3[60] !== handleOpenEditor || $3[61] !== isFooterFocused || $3[62] !== onAnswer || $3[63] !== onCancel || $3[64] !== onImagePaste || $3[65] !== onRemoveImage || $3[66] !== onSubmit || $3[67] !== onUpdateQuestionState || $3[68] !== options2 || $3[69] !== pastedContents || $3[70] !== question.multiSelect || $3[71] !== question.question || $3[72] !== questionStates || $3[73] !== questionText || $3[74] !== questions.length)
    t12 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: question.multiSelect ? /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(SelectMulti, {
        options: options2,
        defaultValue: questionStates[question.question]?.selectedValue,
        onChange: (values3) => {
          onUpdateQuestionState(questionText, {
            selectedValue: values3
          }, !0);
          let textInput = values3.includes("__other__") ? questionStates[questionText]?.textInputValue : void 0, finalValues = values3.filter(_temp437).concat(textInput ? [textInput] : []);
          onAnswer(questionText, finalValues, void 0, !1);
        },
        onFocus: handleFocus,
        onCancel,
        submitButtonText: currentQuestionIndex === questions.length - 1 ? "Submit" : "Next",
        onSubmit,
        onDownFromLastItem: handleDownFromLastItem,
        isDisabled: isFooterFocused,
        onOpenEditor: handleOpenEditor,
        onImagePaste,
        pastedContents,
        onRemoveImage
      }, question.question, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(Select, {
        options: options2,
        defaultValue: questionStates[question.question]?.selectedValue,
        onChange: (value_1) => {
          onUpdateQuestionState(questionText, {
            selectedValue: value_1
          }, !1);
          let textInput_0 = value_1 === "__other__" ? questionStates[questionText]?.textInputValue : void 0;
          onAnswer(questionText, value_1, textInput_0);
        },
        onFocus: handleFocus,
        onCancel,
        onDownFromLastItem: handleDownFromLastItem,
        isDisabled: isFooterFocused,
        layout: "compact-vertical",
        onOpenEditor: handleOpenEditor,
        onImagePaste,
        pastedContents,
        onRemoveImage
      }, question.question, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[58] = currentQuestionIndex, $3[59] = handleFocus, $3[60] = handleOpenEditor, $3[61] = isFooterFocused, $3[62] = onAnswer, $3[63] = onCancel, $3[64] = onImagePaste, $3[65] = onRemoveImage, $3[66] = onSubmit, $3[67] = onUpdateQuestionState, $3[68] = options2, $3[69] = pastedContents, $3[70] = question.multiSelect, $3[71] = question.question, $3[72] = questionStates, $3[73] = questionText, $3[74] = questions.length, $3[75] = t12;
  else
    t12 = $3[75];
  let t13;
  if ($3[76] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(Divider, {
      color: "inactive"
    }, void 0, !1, void 0, this), $3[76] = t13;
  else
    t13 = $3[76];
  let t14;
  if ($3[77] !== footerIndex || $3[78] !== isFooterFocused)
    t14 = isFooterFocused && footerIndex === 0 ? /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
      color: "suggestion",
      children: figures_default.pointer
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
      children: " "
    }, void 0, !1, void 0, this), $3[77] = footerIndex, $3[78] = isFooterFocused, $3[79] = t14;
  else
    t14 = $3[79];
  let t15 = isFooterFocused && footerIndex === 0 ? "suggestion" : void 0, t16 = options2.length + 1, t17;
  if ($3[80] !== t15 || $3[81] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
      color: t15,
      children: [
        t16,
        ". Chat about this"
      ]
    }, void 0, !0, void 0, this), $3[80] = t15, $3[81] = t16, $3[82] = t17;
  else
    t17 = $3[82];
  let t18;
  if ($3[83] !== t14 || $3[84] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      children: [
        t14,
        t17
      ]
    }, void 0, !0, void 0, this), $3[83] = t14, $3[84] = t17, $3[85] = t18;
  else
    t18 = $3[85];
  let t19;
  if ($3[86] !== footerIndex || $3[87] !== isFooterFocused || $3[88] !== isInPlanMode || $3[89] !== options2.length)
    t19 = isInPlanMode && /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      children: [
        isFooterFocused && footerIndex === 1 ? /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
          color: "suggestion",
          children: figures_default.pointer
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
          children: " "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
          color: isFooterFocused && footerIndex === 1 ? "suggestion" : void 0,
          children: [
            options2.length + 2,
            ". Skip interview and plan immediately"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[86] = footerIndex, $3[87] = isFooterFocused, $3[88] = isInPlanMode, $3[89] = options2.length, $3[90] = t19;
  else
    t19 = $3[90];
  let t20;
  if ($3[91] !== t18 || $3[92] !== t19)
    t20 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t13,
        t18,
        t19
      ]
    }, void 0, !0, void 0, this), $3[91] = t18, $3[92] = t19, $3[93] = t20;
  else
    t20 = $3[93];
  let t21;
  if ($3[94] !== questions.length)
    t21 = questions.length === 1 ? /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(jsx_dev_runtime374.Fragment, {
      children: [
        figures_default.arrowUp,
        "/",
        figures_default.arrowDown,
        " to navigate"
      ]
    }, void 0, !0, void 0, this) : "Tab/Arrow keys to navigate", $3[94] = questions.length, $3[95] = t21;
  else
    t21 = $3[95];
  let t22;
  if ($3[96] !== isOtherFocused)
    t22 = isOtherFocused && editorName && /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(jsx_dev_runtime374.Fragment, {
      children: [
        " \xB7 ctrl+g to edit in ",
        editorName
      ]
    }, void 0, !0, void 0, this), $3[96] = isOtherFocused, $3[97] = t22;
  else
    t22 = $3[97];
  let t23;
  if ($3[98] !== t21 || $3[99] !== t22)
    t23 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedText, {
        color: "inactive",
        dimColor: !0,
        children: [
          "Enter to select \xB7",
          " ",
          t21,
          t22,
          " ",
          "\xB7 Esc to cancel"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[98] = t21, $3[99] = t22, $3[100] = t23;
  else
    t23 = $3[100];
  let t24;
  if ($3[101] !== minContentHeight || $3[102] !== t12 || $3[103] !== t20 || $3[104] !== t23)
    t24 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      minHeight: minContentHeight,
      children: [
        t12,
        t20,
        t23
      ]
    }, void 0, !0, void 0, this), $3[101] = minContentHeight, $3[102] = t12, $3[103] = t20, $3[104] = t23, $3[105] = t24;
  else
    t24 = $3[105];
  let t25;
  if ($3[106] !== t10 || $3[107] !== t11 || $3[108] !== t24)
    t25 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingTop: 0,
      children: [
        t10,
        t11,
        t24
      ]
    }, void 0, !0, void 0, this), $3[106] = t10, $3[107] = t11, $3[108] = t24, $3[109] = t25;
  else
    t25 = $3[109];
  let t26;
  if ($3[110] !== handleKeyDown || $3[111] !== t25 || $3[112] !== t8)
    t26 = /* @__PURE__ */ jsx_dev_runtime374.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 0,
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: [
        t8,
        t9,
        t25
      ]
    }, void 0, !0, void 0, this), $3[110] = handleKeyDown, $3[111] = t25, $3[112] = t8, $3[113] = t26;
  else
    t26 = $3[113];
  return t26;
}
function _temp437(v2) {
  return v2 !== "__other__";
}
function _temp349(opt_0) {
  return opt_0.preview;
}
function _temp275(opt) {
  return {
    type: "text",
    value: opt.label,
    label: opt.label,
    description: opt.description
  };
}
function _temp175(s2) {
  return s2.toolPermissionContext.mode;
}
var import_compiler_runtime290, import_react204, jsx_dev_runtime374;
var init_QuestionView = __esm(() => {
  init_figures();
  init_ink2();
  init_AppState();
  init_editor();
  init_ide();
  init_promptEditor();
  init_CustomSelect();
  init_Divider();
  init_FilePathLink();
  init_PermissionRequestTitle();
  init_PreviewQuestionView();
  init_QuestionNavigationBar();
  import_compiler_runtime290 = __toESM(require_react_compiler_runtime_development(), 1), import_react204 = __toESM(require_react_development(), 1), jsx_dev_runtime374 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
