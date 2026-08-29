// Original: src/components/permissions/AskUserQuestionPermissionRequest/PreviewQuestionView.tsx
function PreviewQuestionView({
  question,
  questions,
  currentQuestionIndex,
  answers,
  questionStates,
  hideSubmitTab = !1,
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
}) {
  let isInPlanMode = useAppState((s2) => s2.toolPermissionContext.mode) === "plan", [isFooterFocused, setIsFooterFocused] = import_react203.useState(!1), [footerIndex, setFooterIndex] = import_react203.useState(0), [isInNotesInput, setIsInNotesInput] = import_react203.useState(!1), [cursorOffset, setCursorOffset] = import_react203.useState(0), editor = getExternalEditor(), editorName = editor ? toIDEDisplayName(editor) : null, questionText = question.question, questionState = questionStates[questionText], allOptions = question.options, [focusedIndex, setFocusedIndex] = import_react203.useState(0), prevQuestionText = import_react203.useRef(questionText);
  if (prevQuestionText.current !== questionText) {
    prevQuestionText.current = questionText;
    let selected = questionState?.selectedValue, idx = selected ? allOptions.findIndex((opt) => opt.label === selected) : -1;
    setFocusedIndex(idx >= 0 ? idx : 0);
  }
  let focusedOption = allOptions[focusedIndex], selectedValue = questionState?.selectedValue, notesValue = questionState?.textInputValue || "", handleSelectOption = import_react203.useCallback((index2) => {
    let option = allOptions[index2];
    if (!option)
      return;
    setFocusedIndex(index2), onUpdateQuestionState(questionText, {
      selectedValue: option.label
    }, !1), onAnswer(questionText, option.label);
  }, [allOptions, questionText, onUpdateQuestionState, onAnswer]), handleNavigate = import_react203.useCallback((direction) => {
    if (isInNotesInput)
      return;
    let newIndex;
    if (typeof direction === "number")
      newIndex = direction;
    else if (direction === "up")
      newIndex = focusedIndex > 0 ? focusedIndex - 1 : focusedIndex;
    else
      newIndex = focusedIndex < allOptions.length - 1 ? focusedIndex + 1 : focusedIndex;
    if (newIndex >= 0 && newIndex < allOptions.length)
      setFocusedIndex(newIndex);
  }, [focusedIndex, allOptions.length, isInNotesInput]);
  useKeybinding("chat:externalEditor", async () => {
    let currentValue = questionState?.textInputValue || "", result = await editPromptInEditor(currentValue);
    if (result.content !== null && result.content !== currentValue)
      onUpdateQuestionState(questionText, {
        textInputValue: result.content
      }, !1);
  }, {
    context: "Chat",
    isActive: isInNotesInput && !!editor
  }), useKeybindings({
    "tabs:previous": () => onTabPrev?.(),
    "tabs:next": () => onTabNext?.()
  }, {
    context: "Tabs",
    isActive: !isInNotesInput && !isFooterFocused
  });
  let handleNotesExit = import_react203.useCallback(() => {
    if (setIsInNotesInput(!1), onTextInputFocus(!1), selectedValue)
      onAnswer(questionText, selectedValue);
  }, [selectedValue, questionText, onAnswer, onTextInputFocus]), handleDownFromPreview = import_react203.useCallback(() => {
    setIsFooterFocused(!0);
  }, []), handleUpFromFooter = import_react203.useCallback(() => {
    setIsFooterFocused(!1);
  }, []), handleKeyDown = import_react203.useCallback((e) => {
    if (isFooterFocused) {
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
      return;
    }
    if (isInNotesInput) {
      if (e.key === "escape")
        e.preventDefault(), handleNotesExit();
      return;
    }
    if (e.key === "up" || e.ctrl && e.key === "p") {
      if (e.preventDefault(), focusedIndex > 0)
        handleNavigate("up");
    } else if (e.key === "down" || e.ctrl && e.key === "n")
      if (e.preventDefault(), focusedIndex === allOptions.length - 1)
        handleDownFromPreview();
      else
        handleNavigate("down");
    else if (e.key === "return")
      e.preventDefault(), handleSelectOption(focusedIndex);
    else if (e.key === "n" && !e.ctrl && !e.meta)
      e.preventDefault(), setIsInNotesInput(!0), onTextInputFocus(!0);
    else if (e.key === "escape")
      e.preventDefault(), onCancel();
    else if (e.key.length === 1 && e.key >= "1" && e.key <= "9") {
      e.preventDefault();
      let idx_0 = parseInt(e.key, 10) - 1;
      if (idx_0 < allOptions.length)
        handleNavigate(idx_0);
    }
  }, [isFooterFocused, footerIndex, isInPlanMode, isInNotesInput, focusedIndex, allOptions.length, handleUpFromFooter, handleDownFromPreview, handleNavigate, handleSelectOption, handleNotesExit, onRespondToClaude, onFinishPlanInterview, onCancel, onTextInputFocus]), previewContent = focusedOption?.preview || null, LEFT_PANEL_WIDTH = 30, GAP = 4, {
    columns
  } = useTerminalSize(), previewMaxWidth = columns - LEFT_PANEL_WIDTH - GAP, PREVIEW_OVERHEAD = 11, previewMaxLines = import_react203.useMemo(() => {
    return minContentHeight ? Math.max(1, minContentHeight - PREVIEW_OVERHEAD) : void 0;
  }, [minContentHeight]);
  return /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    tabIndex: 0,
    autoFocus: !0,
    onKeyDown: handleKeyDown,
    children: [
      /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(Divider, {
        color: "inactive"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingTop: 0,
        children: [
          /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(QuestionNavigationBar, {
            questions,
            currentQuestionIndex,
            answers,
            hideSubmitTab
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(PermissionRequestTitle, {
            title: question.question,
            color: "text"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            minHeight: minContentHeight,
            children: [
              /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                marginTop: 1,
                flexDirection: "row",
                gap: 4,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                    flexDirection: "column",
                    width: 30,
                    children: allOptions.map((option_0, index_0) => {
                      let isFocused = focusedIndex === index_0, isSelected = selectedValue === option_0.label;
                      return /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                        flexDirection: "row",
                        children: [
                          isFocused ? /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                            color: "suggestion",
                            children: figures_default.pointer
                          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                            children: " "
                          }, void 0, !1, void 0, this),
                          /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                            dimColor: !0,
                            children: [
                              " ",
                              index_0 + 1,
                              "."
                            ]
                          }, void 0, !0, void 0, this),
                          /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                            color: isSelected ? "success" : isFocused ? "suggestion" : void 0,
                            bold: isFocused,
                            children: [
                              " ",
                              option_0.label
                            ]
                          }, void 0, !0, void 0, this),
                          isSelected && /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                            color: "success",
                            children: [
                              " ",
                              figures_default.tick
                            ]
                          }, void 0, !0, void 0, this)
                        ]
                      }, option_0.label, !0, void 0, this);
                    })
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                    flexDirection: "column",
                    flexGrow: 1,
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(PreviewBox, {
                        content: previewContent || "No preview available",
                        maxLines: previewMaxLines,
                        minWidth: minContentWidth,
                        maxWidth: previewMaxWidth
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                        marginTop: 1,
                        flexDirection: "row",
                        gap: 1,
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                            color: "suggestion",
                            children: "Notes:"
                          }, void 0, !1, void 0, this),
                          isInNotesInput ? /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(TextInput, {
                            value: notesValue,
                            placeholder: "Add notes on this design\u2026",
                            onChange: (value) => {
                              onUpdateQuestionState(questionText, {
                                textInputValue: value
                              }, !1);
                            },
                            onSubmit: handleNotesExit,
                            onExit: handleNotesExit,
                            focus: !0,
                            showCursor: !0,
                            columns: 60,
                            cursorOffset,
                            onChangeCursorOffset: setCursorOffset
                          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                            dimColor: !0,
                            italic: !0,
                            children: notesValue || "press n to add notes"
                          }, void 0, !1, void 0, this)
                        ]
                      }, void 0, !0, void 0, this)
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                marginTop: 1,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(Divider, {
                    color: "inactive"
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                    flexDirection: "row",
                    gap: 1,
                    children: [
                      isFooterFocused && footerIndex === 0 ? /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                        color: "suggestion",
                        children: figures_default.pointer
                      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                        children: " "
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                        color: isFooterFocused && footerIndex === 0 ? "suggestion" : void 0,
                        children: "Chat about this"
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this),
                  isInPlanMode && /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                    flexDirection: "row",
                    gap: 1,
                    children: [
                      isFooterFocused && footerIndex === 1 ? /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                        color: "suggestion",
                        children: figures_default.pointer
                      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                        children: " "
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                        color: isFooterFocused && footerIndex === 1 ? "suggestion" : void 0,
                        children: "Skip interview and plan immediately"
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedBox_default, {
                marginTop: 1,
                children: /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(ThemedText, {
                  color: "inactive",
                  dimColor: !0,
                  children: [
                    "Enter to select \xB7 ",
                    figures_default.arrowUp,
                    "/",
                    figures_default.arrowDown,
                    " to navigate \xB7 n to add notes",
                    questions.length > 1 && /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(jsx_dev_runtime373.Fragment, {
                      children: " \xB7 Tab to switch questions"
                    }, void 0, !1, void 0, this),
                    isInNotesInput && editorName && /* @__PURE__ */ jsx_dev_runtime373.jsxDEV(jsx_dev_runtime373.Fragment, {
                      children: [
                        " \xB7 ctrl+g to edit in ",
                        editorName
                      ]
                    }, void 0, !0, void 0, this),
                    " ",
                    "\xB7 Esc to cancel"
                  ]
                }, void 0, !0, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_react203, jsx_dev_runtime373;
var init_PreviewQuestionView = __esm(() => {
  init_figures();
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  init_AppState();
  init_editor();
  init_ide();
  init_promptEditor();
  init_Divider();
  init_TextInput();
  init_PermissionRequestTitle();
  init_PreviewBox();
  init_QuestionNavigationBar();
  import_react203 = __toESM(require_react_development(), 1), jsx_dev_runtime373 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
