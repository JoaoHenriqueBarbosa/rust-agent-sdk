// Original: src/components/permissions/AskUserQuestionPermissionRequest/QuestionNavigationBar.tsx
function QuestionNavigationBar(t0) {
  let $3 = import_compiler_runtime289.c(39), {
    questions,
    currentQuestionIndex,
    answers,
    hideSubmitTab: t1
  } = t0, hideSubmitTab = t1 === void 0 ? !1 : t1, {
    columns
  } = useTerminalSize(), t2;
  if ($3[0] !== columns || $3[1] !== currentQuestionIndex || $3[2] !== hideSubmitTab || $3[3] !== questions) {
    bb0: {
      let submitText = hideSubmitTab ? "" : ` ${figures_default.tick} Submit `, fixedWidth = stringWidth("\u2190 ") + stringWidth(" \u2192") + stringWidth(submitText), availableForTabs = columns - fixedWidth;
      if (availableForTabs <= 0) {
        let t33;
        if ($3[5] !== currentQuestionIndex || $3[6] !== questions) {
          let t42;
          if ($3[8] !== currentQuestionIndex)
            t42 = (q4, index2) => {
              let header = q4?.header || `Q${index2 + 1}`;
              return index2 === currentQuestionIndex ? header.slice(0, 3) : "";
            }, $3[8] = currentQuestionIndex, $3[9] = t42;
          else
            t42 = $3[9];
          t33 = questions.map(t42), $3[5] = currentQuestionIndex, $3[6] = questions, $3[7] = t33;
        } else
          t33 = $3[7];
        t2 = t33;
        break bb0;
      }
      let tabHeaders = questions.map(_temp173);
      if (tabHeaders.map(_temp274).reduce(_temp348, 0) <= availableForTabs) {
        t2 = tabHeaders;
        break bb0;
      }
      let currentHeader = tabHeaders[currentQuestionIndex] || "", currentIdealWidth = 4 + stringWidth(currentHeader), currentTabWidth = Math.min(currentIdealWidth, availableForTabs / 2), remainingWidth = availableForTabs - currentTabWidth, otherTabCount = questions.length - 1, widthPerOtherTab = Math.max(6, Math.floor(remainingWidth / Math.max(otherTabCount, 1))), t32;
      if ($3[10] !== currentQuestionIndex || $3[11] !== currentTabWidth || $3[12] !== widthPerOtherTab)
        t32 = (header_1, index_1) => {
          if (index_1 === currentQuestionIndex) {
            let maxTextWidth = currentTabWidth - 2 - 2;
            return truncateToWidth(header_1, maxTextWidth);
          } else {
            let maxTextWidth_0 = widthPerOtherTab - 2 - 2;
            return truncateToWidth(header_1, maxTextWidth_0);
          }
        }, $3[10] = currentQuestionIndex, $3[11] = currentTabWidth, $3[12] = widthPerOtherTab, $3[13] = t32;
      else
        t32 = $3[13];
      t2 = tabHeaders.map(t32);
    }
    $3[0] = columns, $3[1] = currentQuestionIndex, $3[2] = hideSubmitTab, $3[3] = questions, $3[4] = t2;
  } else
    t2 = $3[4];
  let tabDisplayTexts = t2, hideArrows = questions.length === 1 && hideSubmitTab, t3;
  if ($3[14] !== currentQuestionIndex || $3[15] !== hideArrows)
    t3 = !hideArrows && /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedText, {
      color: currentQuestionIndex === 0 ? "inactive" : void 0,
      children: [
        "\u2190",
        " "
      ]
    }, void 0, !0, void 0, this), $3[14] = currentQuestionIndex, $3[15] = hideArrows, $3[16] = t3;
  else
    t3 = $3[16];
  let t4;
  if ($3[17] !== answers || $3[18] !== currentQuestionIndex || $3[19] !== questions || $3[20] !== tabDisplayTexts) {
    let t52;
    if ($3[22] !== answers || $3[23] !== currentQuestionIndex || $3[24] !== tabDisplayTexts)
      t52 = (q_1, index_2) => {
        let isSelected = index_2 === currentQuestionIndex, checkbox = q_1?.question && !!answers[q_1.question] ? figures_default.checkboxOn : figures_default.checkboxOff, displayText = tabDisplayTexts[index_2] || q_1?.header || `Q${index_2 + 1}`;
        return /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedBox_default, {
          children: isSelected ? /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedText, {
            backgroundColor: "permission",
            color: "inverseText",
            children: [
              " ",
              checkbox,
              " ",
              displayText,
              " "
            ]
          }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedText, {
            children: [
              " ",
              checkbox,
              " ",
              displayText,
              " "
            ]
          }, void 0, !0, void 0, this)
        }, q_1?.question || `question-${index_2}`, !1, void 0, this);
      }, $3[22] = answers, $3[23] = currentQuestionIndex, $3[24] = tabDisplayTexts, $3[25] = t52;
    else
      t52 = $3[25];
    t4 = questions.map(t52), $3[17] = answers, $3[18] = currentQuestionIndex, $3[19] = questions, $3[20] = tabDisplayTexts, $3[21] = t4;
  } else
    t4 = $3[21];
  let t5;
  if ($3[26] !== currentQuestionIndex || $3[27] !== hideSubmitTab || $3[28] !== questions.length)
    t5 = !hideSubmitTab && /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedBox_default, {
      children: currentQuestionIndex === questions.length ? /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedText, {
        backgroundColor: "permission",
        color: "inverseText",
        children: [
          " ",
          figures_default.tick,
          " Submit",
          " "
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedText, {
        children: [
          " ",
          figures_default.tick,
          " Submit "
        ]
      }, void 0, !0, void 0, this)
    }, "submit", !1, void 0, this), $3[26] = currentQuestionIndex, $3[27] = hideSubmitTab, $3[28] = questions.length, $3[29] = t5;
  else
    t5 = $3[29];
  let t6;
  if ($3[30] !== currentQuestionIndex || $3[31] !== hideArrows || $3[32] !== questions.length)
    t6 = !hideArrows && /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedText, {
      color: currentQuestionIndex === questions.length ? "inactive" : void 0,
      children: [
        " ",
        "\u2192"
      ]
    }, void 0, !0, void 0, this), $3[30] = currentQuestionIndex, $3[31] = hideArrows, $3[32] = questions.length, $3[33] = t6;
  else
    t6 = $3[33];
  let t7;
  if ($3[34] !== t3 || $3[35] !== t4 || $3[36] !== t5 || $3[37] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime372.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginBottom: 1,
      children: [
        t3,
        t4,
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[34] = t3, $3[35] = t4, $3[36] = t5, $3[37] = t6, $3[38] = t7;
  else
    t7 = $3[38];
  return t7;
}
function _temp348(sum, w2) {
  return sum + w2;
}
function _temp274(header_0) {
  return 4 + stringWidth(header_0);
}
function _temp173(q_0, index_0) {
  return q_0?.header || `Q${index_0 + 1}`;
}
var import_compiler_runtime289, jsx_dev_runtime372;
var init_QuestionNavigationBar = __esm(() => {
  init_figures();
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_format();
  import_compiler_runtime289 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime372 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
