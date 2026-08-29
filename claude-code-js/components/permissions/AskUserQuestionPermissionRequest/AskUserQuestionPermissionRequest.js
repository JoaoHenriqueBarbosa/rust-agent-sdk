// Original: src/components/permissions/AskUserQuestionPermissionRequest/AskUserQuestionPermissionRequest.tsx
function AskUserQuestionPermissionRequest(props) {
  let $3 = import_compiler_runtime293.c(4);
  if (useSettings().syntaxHighlightingDisabled) {
    let t02;
    if ($3[0] !== props)
      t02 = /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(AskUserQuestionPermissionRequestBody, {
        ...props,
        highlight: null
      }, void 0, !1, void 0, this), $3[0] = props, $3[1] = t02;
    else
      t02 = $3[1];
    return t02;
  }
  let t0;
  if ($3[2] !== props)
    t0 = /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(import_react206.Suspense, {
      fallback: /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(AskUserQuestionPermissionRequestBody, {
        ...props,
        highlight: null
      }, void 0, !1, void 0, this),
      children: /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(AskUserQuestionWithHighlight, {
        ...props
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = props, $3[3] = t0;
  else
    t0 = $3[3];
  return t0;
}
function AskUserQuestionWithHighlight(props) {
  let $3 = import_compiler_runtime293.c(4), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = getCliHighlightPromise(), $3[0] = t0;
  else
    t0 = $3[0];
  let highlight = import_react206.use(t0), t1;
  if ($3[1] !== highlight || $3[2] !== props)
    t1 = /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(AskUserQuestionPermissionRequestBody, {
      ...props,
      highlight
    }, void 0, !1, void 0, this), $3[1] = highlight, $3[2] = props, $3[3] = t1;
  else
    t1 = $3[3];
  return t1;
}
function AskUserQuestionPermissionRequestBody(t0) {
  let $3 = import_compiler_runtime293.c(115), {
    toolUseConfirm,
    onDone,
    onReject,
    highlight
  } = t0, t1;
  if ($3[0] !== toolUseConfirm.input)
    t1 = AskUserQuestionTool.inputSchema.safeParse(toolUseConfirm.input), $3[0] = toolUseConfirm.input, $3[1] = t1;
  else
    t1 = $3[1];
  let result = t1, t2;
  if ($3[2] !== result.data || $3[3] !== result.success)
    t2 = result.success ? result.data.questions || [] : [], $3[2] = result.data, $3[3] = result.success, $3[4] = t2;
  else
    t2 = $3[4];
  let questions = t2, {
    rows: terminalRows
  } = useTerminalSize(), [theme2] = useTheme(), maxHeight = 0, maxWidth = 0, maxAllowedHeight = Math.max(MIN_CONTENT_HEIGHT, terminalRows - CONTENT_CHROME_OVERHEAD);
  if ($3[5] !== highlight || $3[6] !== maxAllowedHeight || $3[7] !== maxHeight || $3[8] !== maxWidth || $3[9] !== questions || $3[10] !== theme2) {
    for (let q4 of questions)
      if (q4.options.some(_temp177)) {
        let maxPreviewContentLines = Math.max(1, maxAllowedHeight - 11), maxPreviewBoxHeight = 0;
        for (let opt_0 of q4.options)
          if (opt_0.preview) {
            let previewLines = applyMarkdown(opt_0.preview, theme2, highlight).split(`
`), isTruncated = previewLines.length > maxPreviewContentLines, displayedLines = isTruncated ? maxPreviewContentLines : previewLines.length;
            maxPreviewBoxHeight = Math.max(maxPreviewBoxHeight, displayedLines + (isTruncated ? 1 : 0) + 2);
            for (let line of previewLines)
              maxWidth = Math.max(maxWidth, stringWidth(line));
          }
        let rightPanelHeight = maxPreviewBoxHeight + 2, leftPanelHeight = q4.options.length + 2, sideByHeight = Math.max(leftPanelHeight, rightPanelHeight);
        maxHeight = Math.max(maxHeight, sideByHeight + 7);
      } else
        maxHeight = Math.max(maxHeight, q4.options.length + 3 + 7);
    $3[5] = highlight, $3[6] = maxAllowedHeight, $3[7] = maxHeight, $3[8] = maxWidth, $3[9] = questions, $3[10] = theme2, $3[11] = maxHeight;
  } else
    maxHeight = $3[11];
  let t3 = Math.min(Math.max(maxHeight, MIN_CONTENT_HEIGHT), maxAllowedHeight), t4 = Math.max(maxWidth, MIN_CONTENT_WIDTH), t5;
  if ($3[12] !== t3 || $3[13] !== t4)
    t5 = {
      globalContentHeight: t3,
      globalContentWidth: t4
    }, $3[12] = t3, $3[13] = t4, $3[14] = t5;
  else
    t5 = $3[14];
  let {
    globalContentHeight,
    globalContentWidth
  } = t5, metadataSource = result.success ? result.data.metadata?.source : void 0, t6;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t6 = {}, $3[15] = t6;
  else
    t6 = $3[15];
  let [pastedContentsByQuestion, setPastedContentsByQuestion] = import_react206.useState(t6), nextPasteIdRef = import_react206.useRef(0), t7;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t7 = function(questionText, base64Image, mediaType, filename, dimensions, _sourcePath) {
      nextPasteIdRef.current = nextPasteIdRef.current + 1;
      let pasteId = nextPasteIdRef.current, newContent = {
        id: pasteId,
        type: "image",
        content: base64Image,
        mediaType: mediaType || "image/png",
        filename: filename || "Pasted image",
        dimensions
      };
      cacheImagePath(newContent), storeImage(newContent), setPastedContentsByQuestion((prev) => ({
        ...prev,
        [questionText]: {
          ...prev[questionText] ?? {},
          [pasteId]: newContent
        }
      }));
    }, $3[16] = t7;
  else
    t7 = $3[16];
  let onImagePaste = t7, t8;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t8 = (questionText_0, id) => {
      setPastedContentsByQuestion((prev_0) => {
        let questionContents = {
          ...prev_0[questionText_0] ?? {}
        };
        return delete questionContents[id], {
          ...prev_0,
          [questionText_0]: questionContents
        };
      });
    }, $3[17] = t8;
  else
    t8 = $3[17];
  let onRemoveImage = t8, t9;
  if ($3[18] !== pastedContentsByQuestion)
    t9 = Object.values(pastedContentsByQuestion).flatMap(_temp276).filter(_temp350), $3[18] = pastedContentsByQuestion, $3[19] = t9;
  else
    t9 = $3[19];
  let allImageAttachments = t9, isInPlanMode = useAppState(_temp438) === "plan", t10;
  if ($3[20] !== isInPlanMode)
    t10 = isInPlanMode ? getPlanFilePath() : void 0, $3[20] = isInPlanMode, $3[21] = t10;
  else
    t10 = $3[21];
  let planFilePath = t10, state4 = useMultipleChoiceState(), {
    currentQuestionIndex,
    answers,
    questionStates,
    isInTextInput,
    nextQuestion,
    prevQuestion,
    updateQuestionState,
    setAnswer,
    setTextInputMode
  } = state4, currentQuestion = currentQuestionIndex < (questions?.length || 0) ? questions?.[currentQuestionIndex] : null, isInSubmitView = currentQuestionIndex === (questions?.length || 0), t11;
  if ($3[22] !== answers || $3[23] !== questions)
    t11 = questions?.every((q_0) => q_0?.question && !!answers[q_0.question]) ?? !1, $3[22] = answers, $3[23] = questions, $3[24] = t11;
  else
    t11 = $3[24];
  let allQuestionsAnswered = t11, hideSubmitTab = questions.length === 1 && !questions[0]?.multiSelect, t12;
  if ($3[25] !== isInPlanMode || $3[26] !== metadataSource || $3[27] !== onDone || $3[28] !== onReject || $3[29] !== questions.length || $3[30] !== toolUseConfirm)
    t12 = () => {
      if (metadataSource)
        logEvent("tengu_ask_user_question_rejected", {
          source: metadataSource,
          questionCount: questions.length,
          isInPlanMode,
          interviewPhaseEnabled: isInPlanMode && isPlanModeInterviewPhaseEnabled()
        });
      onDone(), onReject(), toolUseConfirm.onReject();
    }, $3[25] = isInPlanMode, $3[26] = metadataSource, $3[27] = onDone, $3[28] = onReject, $3[29] = questions.length, $3[30] = toolUseConfirm, $3[31] = t12;
  else
    t12 = $3[31];
  let handleCancel = t12, t13;
  if ($3[32] !== allImageAttachments || $3[33] !== answers || $3[34] !== isInPlanMode || $3[35] !== metadataSource || $3[36] !== onDone || $3[37] !== questions || $3[38] !== toolUseConfirm)
    t13 = async () => {
      let feedback2 = `The user wants to clarify these questions.
    This means they may have additional information, context or questions for you.
    Take their response into account and then reformulate the questions if appropriate.
    Start by asking them what they would like to clarify.

    Questions asked:
${questions.map((q_1) => {
        let answer = answers[q_1.question];
        if (answer)
          return `- "${q_1.question}"
  Answer: ${answer}`;
        return `- "${q_1.question}"
  (No answer provided)`;
      }).join(`
`)}`;
      if (metadataSource)
        logEvent("tengu_ask_user_question_respond_to_claude", {
          source: metadataSource,
          questionCount: questions.length,
          isInPlanMode,
          interviewPhaseEnabled: isInPlanMode && isPlanModeInterviewPhaseEnabled()
        });
      let imageBlocks = await convertImagesToBlocks(allImageAttachments);
      onDone(), toolUseConfirm.onReject(feedback2, imageBlocks && imageBlocks.length > 0 ? imageBlocks : void 0);
    }, $3[32] = allImageAttachments, $3[33] = answers, $3[34] = isInPlanMode, $3[35] = metadataSource, $3[36] = onDone, $3[37] = questions, $3[38] = toolUseConfirm, $3[39] = t13;
  else
    t13 = $3[39];
  let handleRespondToClaude = t13, t14;
  if ($3[40] !== allImageAttachments || $3[41] !== answers || $3[42] !== isInPlanMode || $3[43] !== metadataSource || $3[44] !== onDone || $3[45] !== questions || $3[46] !== toolUseConfirm)
    t14 = async () => {
      let feedback_0 = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${questions.map((q_2) => {
        let answer_0 = answers[q_2.question];
        if (answer_0)
          return `- "${q_2.question}"
  Answer: ${answer_0}`;
        return `- "${q_2.question}"
  (No answer provided)`;
      }).join(`
`)}`;
      if (metadataSource)
        logEvent("tengu_ask_user_question_finish_plan_interview", {
          source: metadataSource,
          questionCount: questions.length,
          isInPlanMode,
          interviewPhaseEnabled: isInPlanMode && isPlanModeInterviewPhaseEnabled()
        });
      let imageBlocks_0 = await convertImagesToBlocks(allImageAttachments);
      onDone(), toolUseConfirm.onReject(feedback_0, imageBlocks_0 && imageBlocks_0.length > 0 ? imageBlocks_0 : void 0);
    }, $3[40] = allImageAttachments, $3[41] = answers, $3[42] = isInPlanMode, $3[43] = metadataSource, $3[44] = onDone, $3[45] = questions, $3[46] = toolUseConfirm, $3[47] = t14;
  else
    t14 = $3[47];
  let handleFinishPlanInterview = t14, t15;
  if ($3[48] !== allImageAttachments || $3[49] !== isInPlanMode || $3[50] !== metadataSource || $3[51] !== onDone || $3[52] !== questionStates || $3[53] !== questions || $3[54] !== toolUseConfirm)
    t15 = async (answersToSubmit) => {
      if (metadataSource)
        logEvent("tengu_ask_user_question_accepted", {
          source: metadataSource,
          questionCount: questions.length,
          answerCount: Object.keys(answersToSubmit).length,
          isInPlanMode,
          interviewPhaseEnabled: isInPlanMode && isPlanModeInterviewPhaseEnabled()
        });
      let annotations = {};
      for (let q_3 of questions) {
        let answer_1 = answersToSubmit[q_3.question], notes = questionStates[q_3.question]?.textInputValue, preview = (answer_1 ? q_3.options.find((opt_1) => opt_1.label === answer_1) : void 0)?.preview;
        if (preview || notes?.trim())
          annotations[q_3.question] = {
            ...preview && {
              preview
            },
            ...notes?.trim() && {
              notes: notes.trim()
            }
          };
      }
      let updatedInput = {
        ...toolUseConfirm.input,
        answers: answersToSubmit,
        ...Object.keys(annotations).length > 0 && {
          annotations
        }
      }, contentBlocks = await convertImagesToBlocks(allImageAttachments);
      onDone(), toolUseConfirm.onAllow(updatedInput, [], void 0, contentBlocks && contentBlocks.length > 0 ? contentBlocks : void 0);
    }, $3[48] = allImageAttachments, $3[49] = isInPlanMode, $3[50] = metadataSource, $3[51] = onDone, $3[52] = questionStates, $3[53] = questions, $3[54] = toolUseConfirm, $3[55] = t15;
  else
    t15 = $3[55];
  let submitAnswers = t15, t16;
  if ($3[56] !== answers || $3[57] !== pastedContentsByQuestion || $3[58] !== questions.length || $3[59] !== setAnswer || $3[60] !== submitAnswers)
    t16 = (questionText_1, label, textInput, t172) => {
      let shouldAdvance = t172 === void 0 ? !0 : t172, answer_2, isMultiSelect = Array.isArray(label);
      if (isMultiSelect)
        answer_2 = label.join(", ");
      else if (textInput)
        answer_2 = Object.values(pastedContentsByQuestion[questionText_1] ?? {}).filter(_temp526).length > 0 ? `${textInput} (Image attached)` : textInput;
      else if (label === "__other__")
        answer_2 = Object.values(pastedContentsByQuestion[questionText_1] ?? {}).filter(_temp621).length > 0 ? "(Image attached)" : label;
      else
        answer_2 = label;
      let isSingleQuestion = questions.length === 1;
      if (!isMultiSelect && isSingleQuestion && shouldAdvance) {
        let updatedAnswers = {
          ...answers,
          [questionText_1]: answer_2
        };
        submitAnswers(updatedAnswers).catch(logError2);
        return;
      }
      setAnswer(questionText_1, answer_2, shouldAdvance);
    }, $3[56] = answers, $3[57] = pastedContentsByQuestion, $3[58] = questions.length, $3[59] = setAnswer, $3[60] = submitAnswers, $3[61] = t16;
  else
    t16 = $3[61];
  let handleQuestionAnswer = t16, t17;
  if ($3[62] !== answers || $3[63] !== handleCancel || $3[64] !== submitAnswers)
    t17 = function(value) {
      if (value === "cancel") {
        handleCancel();
        return;
      }
      if (value === "submit")
        submitAnswers(answers).catch(logError2);
    }, $3[62] = answers, $3[63] = handleCancel, $3[64] = submitAnswers, $3[65] = t17;
  else
    t17 = $3[65];
  let handleFinalResponse = t17, maxIndex = hideSubmitTab ? (questions?.length || 1) - 1 : questions?.length || 0, t18;
  if ($3[66] !== currentQuestionIndex || $3[67] !== prevQuestion)
    t18 = () => {
      if (currentQuestionIndex > 0)
        prevQuestion();
    }, $3[66] = currentQuestionIndex, $3[67] = prevQuestion, $3[68] = t18;
  else
    t18 = $3[68];
  let handleTabPrev = t18, t19;
  if ($3[69] !== currentQuestionIndex || $3[70] !== maxIndex || $3[71] !== nextQuestion)
    t19 = () => {
      if (currentQuestionIndex < maxIndex)
        nextQuestion();
    }, $3[69] = currentQuestionIndex, $3[70] = maxIndex, $3[71] = nextQuestion, $3[72] = t19;
  else
    t19 = $3[72];
  let handleTabNext = t19, t20;
  if ($3[73] !== handleTabNext || $3[74] !== handleTabPrev)
    t20 = {
      "tabs:previous": handleTabPrev,
      "tabs:next": handleTabNext
    }, $3[73] = handleTabNext, $3[74] = handleTabPrev, $3[75] = t20;
  else
    t20 = $3[75];
  let t21 = !(isInTextInput && !isInSubmitView), t22;
  if ($3[76] !== t21)
    t22 = {
      context: "Tabs",
      isActive: t21
    }, $3[76] = t21, $3[77] = t22;
  else
    t22 = $3[77];
  if (useKeybindings(t20, t22), currentQuestion) {
    let t23;
    if ($3[78] !== currentQuestion.question)
      t23 = (base644, mediaType_0, filename_0, dims, path26) => onImagePaste(currentQuestion.question, base644, mediaType_0, filename_0, dims, path26), $3[78] = currentQuestion.question, $3[79] = t23;
    else
      t23 = $3[79];
    let t24;
    if ($3[80] !== currentQuestion.question || $3[81] !== pastedContentsByQuestion)
      t24 = pastedContentsByQuestion[currentQuestion.question] ?? {}, $3[80] = currentQuestion.question, $3[81] = pastedContentsByQuestion, $3[82] = t24;
    else
      t24 = $3[82];
    let t25;
    if ($3[83] !== currentQuestion.question)
      t25 = (id_0) => onRemoveImage(currentQuestion.question, id_0), $3[83] = currentQuestion.question, $3[84] = t25;
    else
      t25 = $3[84];
    let t26;
    if ($3[85] !== answers || $3[86] !== currentQuestion || $3[87] !== currentQuestionIndex || $3[88] !== globalContentHeight || $3[89] !== globalContentWidth || $3[90] !== handleCancel || $3[91] !== handleFinishPlanInterview || $3[92] !== handleQuestionAnswer || $3[93] !== handleRespondToClaude || $3[94] !== handleTabNext || $3[95] !== handleTabPrev || $3[96] !== hideSubmitTab || $3[97] !== nextQuestion || $3[98] !== planFilePath || $3[99] !== questionStates || $3[100] !== questions || $3[101] !== setTextInputMode || $3[102] !== t23 || $3[103] !== t24 || $3[104] !== t25 || $3[105] !== updateQuestionState)
      t26 = /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(jsx_dev_runtime377.Fragment, {
        children: /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(QuestionView, {
          question: currentQuestion,
          questions,
          currentQuestionIndex,
          answers,
          questionStates,
          hideSubmitTab,
          minContentHeight: globalContentHeight,
          minContentWidth: globalContentWidth,
          planFilePath,
          onUpdateQuestionState: updateQuestionState,
          onAnswer: handleQuestionAnswer,
          onTextInputFocus: setTextInputMode,
          onCancel: handleCancel,
          onSubmit: nextQuestion,
          onTabPrev: handleTabPrev,
          onTabNext: handleTabNext,
          onRespondToClaude: handleRespondToClaude,
          onFinishPlanInterview: handleFinishPlanInterview,
          onImagePaste: t23,
          pastedContents: t24,
          onRemoveImage: t25
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[85] = answers, $3[86] = currentQuestion, $3[87] = currentQuestionIndex, $3[88] = globalContentHeight, $3[89] = globalContentWidth, $3[90] = handleCancel, $3[91] = handleFinishPlanInterview, $3[92] = handleQuestionAnswer, $3[93] = handleRespondToClaude, $3[94] = handleTabNext, $3[95] = handleTabPrev, $3[96] = hideSubmitTab, $3[97] = nextQuestion, $3[98] = planFilePath, $3[99] = questionStates, $3[100] = questions, $3[101] = setTextInputMode, $3[102] = t23, $3[103] = t24, $3[104] = t25, $3[105] = updateQuestionState, $3[106] = t26;
    else
      t26 = $3[106];
    return t26;
  }
  if (isInSubmitView) {
    let t23;
    if ($3[107] !== allQuestionsAnswered || $3[108] !== answers || $3[109] !== currentQuestionIndex || $3[110] !== globalContentHeight || $3[111] !== handleFinalResponse || $3[112] !== questions || $3[113] !== toolUseConfirm.permissionResult)
      t23 = /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(jsx_dev_runtime377.Fragment, {
        children: /* @__PURE__ */ jsx_dev_runtime377.jsxDEV(SubmitQuestionsView, {
          questions,
          currentQuestionIndex,
          answers,
          allQuestionsAnswered,
          permissionResult: toolUseConfirm.permissionResult,
          minContentHeight: globalContentHeight,
          onFinalResponse: handleFinalResponse
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[107] = allQuestionsAnswered, $3[108] = answers, $3[109] = currentQuestionIndex, $3[110] = globalContentHeight, $3[111] = handleFinalResponse, $3[112] = questions, $3[113] = toolUseConfirm.permissionResult, $3[114] = t23;
    else
      t23 = $3[114];
    return t23;
  }
  return null;
}
function _temp621(c_1) {
  return c_1.type === "image";
}
function _temp526(c_0) {
  return c_0.type === "image";
}
function _temp438(s2) {
  return s2.toolPermissionContext.mode;
}
function _temp350(c3) {
  return c3.type === "image";
}
function _temp276(contents) {
  return Object.values(contents);
}
function _temp177(opt) {
  return opt.preview;
}
async function convertImagesToBlocks(images) {
  if (images.length === 0)
    return;
  return Promise.all(images.map(async (img) => {
    let block2 = {
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType || "image/png",
        data: img.content
      }
    };
    return (await maybeResizeAndDownsampleImageBlock(block2)).block;
  }));
}
var import_compiler_runtime293, import_react206, jsx_dev_runtime377, MIN_CONTENT_HEIGHT = 12, MIN_CONTENT_WIDTH = 40, CONTENT_CHROME_OVERHEAD = 15;
var init_AskUserQuestionPermissionRequest = __esm(() => {
  init_useSettings();
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_useKeybinding();
  init_AppState();
  init_AskUserQuestionTool();
  init_cliHighlight();
  init_imageResizer();
  init_imageStore();
  init_log3();
  init_markdown();
  init_planModeV2();
  init_plans();
  init_QuestionView();
  init_SubmitQuestionsView();
  init_use_multiple_choice_state();
  import_compiler_runtime293 = __toESM(require_react_compiler_runtime_development(), 1), import_react206 = __toESM(require_react_development(), 1), jsx_dev_runtime377 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
