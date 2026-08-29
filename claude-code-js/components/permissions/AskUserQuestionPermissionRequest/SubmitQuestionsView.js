// Original: src/components/permissions/AskUserQuestionPermissionRequest/SubmitQuestionsView.tsx
function SubmitQuestionsView(t0) {
  let $3 = import_compiler_runtime292.c(27), {
    questions,
    currentQuestionIndex,
    answers,
    allQuestionsAnswered,
    permissionResult,
    minContentHeight,
    onFinalResponse
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(Divider, {
      color: "inactive"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== answers || $3[2] !== currentQuestionIndex || $3[3] !== questions)
    t2 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(QuestionNavigationBar, {
      questions,
      currentQuestionIndex,
      answers
    }, void 0, !1, void 0, this), $3[1] = answers, $3[2] = currentQuestionIndex, $3[3] = questions, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(PermissionRequestTitle, {
      title: "Review your answers",
      color: "text"
    }, void 0, !1, void 0, this), $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== allQuestionsAnswered)
    t4 = !allQuestionsAnswered && /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedText, {
        color: "warning",
        children: [
          figures_default.warning,
          " You have not answered all questions"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = allQuestionsAnswered, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== answers || $3[9] !== questions)
    t5 = Object.keys(answers).length > 0 && /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: questions.filter((q4) => q4?.question && answers[q4.question]).map((q_0) => {
        let answer = answers[q_0?.question];
        return /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginLeft: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedText, {
              children: [
                figures_default.bullet,
                " ",
                q_0?.question || "Question"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
              marginLeft: 2,
              children: /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedText, {
                color: "success",
                children: [
                  figures_default.arrowRight,
                  " ",
                  answer
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, q_0?.question || "answer", !0, void 0, this);
      })
    }, void 0, !1, void 0, this), $3[8] = answers, $3[9] = questions, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== permissionResult)
    t6 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(PermissionRuleExplanation, {
      permissionResult,
      toolType: "tool"
    }, void 0, !1, void 0, this), $3[11] = permissionResult, $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedText, {
      color: "inactive",
      children: "Ready to submit your answers?"
    }, void 0, !1, void 0, this), $3[13] = t7;
  else
    t7 = $3[13];
  let t8;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t8 = {
      type: "text",
      label: "Submit answers",
      value: "submit"
    }, $3[14] = t8;
  else
    t8 = $3[14];
  let t9;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t9 = [t8, {
      type: "text",
      label: "Cancel",
      value: "cancel"
    }], $3[15] = t9;
  else
    t9 = $3[15];
  let t10;
  if ($3[16] !== onFinalResponse)
    t10 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(Select, {
        options: t9,
        onChange: (value) => onFinalResponse(value),
        onCancel: () => onFinalResponse("cancel")
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[16] = onFinalResponse, $3[17] = t10;
  else
    t10 = $3[17];
  let t11;
  if ($3[18] !== minContentHeight || $3[19] !== t10 || $3[20] !== t4 || $3[21] !== t5 || $3[22] !== t6)
    t11 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      minHeight: minContentHeight,
      children: [
        t4,
        t5,
        t6,
        t7,
        t10
      ]
    }, void 0, !0, void 0, this), $3[18] = minContentHeight, $3[19] = t10, $3[20] = t4, $3[21] = t5, $3[22] = t6, $3[23] = t11;
  else
    t11 = $3[23];
  let t12;
  if ($3[24] !== t11 || $3[25] !== t2)
    t12 = /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t1,
        /* @__PURE__ */ jsx_dev_runtime376.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          borderTop: !0,
          borderColor: "inactive",
          paddingTop: 0,
          children: [
            t2,
            t3,
            t11
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[24] = t11, $3[25] = t2, $3[26] = t12;
  else
    t12 = $3[26];
  return t12;
}
var import_compiler_runtime292, jsx_dev_runtime376;
var init_SubmitQuestionsView = __esm(() => {
  init_figures();
  init_ink2();
  init_CustomSelect();
  init_Divider();
  init_PermissionRequestTitle();
  init_PermissionRuleExplanation();
  init_QuestionNavigationBar();
  import_compiler_runtime292 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime376 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
