// Original: src/components/permissions/AskUserQuestionPermissionRequest/use-multiple-choice-state.ts
function reducer2(state4, action2) {
  switch (action2.type) {
    case "next-question":
      return {
        ...state4,
        currentQuestionIndex: state4.currentQuestionIndex + 1,
        isInTextInput: !1
      };
    case "prev-question":
      return {
        ...state4,
        currentQuestionIndex: Math.max(0, state4.currentQuestionIndex - 1),
        isInTextInput: !1
      };
    case "update-question-state": {
      let existing = state4.questionStates[action2.questionText], newState = {
        selectedValue: action2.updates.selectedValue ?? existing?.selectedValue ?? (action2.isMultiSelect ? [] : void 0),
        textInputValue: action2.updates.textInputValue ?? existing?.textInputValue ?? ""
      };
      return {
        ...state4,
        questionStates: {
          ...state4.questionStates,
          [action2.questionText]: newState
        }
      };
    }
    case "set-answer": {
      let newState = {
        ...state4,
        answers: {
          ...state4.answers,
          [action2.questionText]: action2.answer
        }
      };
      if (action2.shouldAdvance)
        return {
          ...newState,
          currentQuestionIndex: newState.currentQuestionIndex + 1,
          isInTextInput: !1
        };
      return newState;
    }
    case "set-text-input-mode":
      return {
        ...state4,
        isInTextInput: action2.isInInput
      };
  }
}
function useMultipleChoiceState() {
  let [state4, dispatch2] = import_react205.useReducer(reducer2, INITIAL_STATE3), nextQuestion = import_react205.useCallback(() => {
    dispatch2({ type: "next-question" });
  }, []), prevQuestion = import_react205.useCallback(() => {
    dispatch2({ type: "prev-question" });
  }, []), updateQuestionState = import_react205.useCallback((questionText, updates, isMultiSelect) => {
    dispatch2({
      type: "update-question-state",
      questionText,
      updates,
      isMultiSelect
    });
  }, []), setAnswer = import_react205.useCallback((questionText, answer, shouldAdvance = !0) => {
    dispatch2({
      type: "set-answer",
      questionText,
      answer,
      shouldAdvance
    });
  }, []), setTextInputMode = import_react205.useCallback((isInInput) => {
    dispatch2({ type: "set-text-input-mode", isInInput });
  }, []);
  return {
    currentQuestionIndex: state4.currentQuestionIndex,
    answers: state4.answers,
    questionStates: state4.questionStates,
    isInTextInput: state4.isInTextInput,
    nextQuestion,
    prevQuestion,
    updateQuestionState,
    setAnswer,
    setTextInputMode
  };
}
var import_react205, INITIAL_STATE3;
var init_use_multiple_choice_state = __esm(() => {
  import_react205 = __toESM(require_react_development(), 1);
  INITIAL_STATE3 = {
    currentQuestionIndex: 0,
    answers: {},
    questionStates: {},
    isInTextInput: !1
  };
});
