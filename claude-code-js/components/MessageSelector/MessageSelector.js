// function: MessageSelector
function MessageSelector({
  messages,
  onPreRestore,
  onRestoreMessage,
  onRestoreCode,
  onSummarize,
  onClose,
  preselectedMessage
}) {
  let fileHistory = useAppState((s2) => s2.fileHistory), [error44, setError] = import_react199.useState(void 0), isFileHistoryEnabled = fileHistoryEnabled(), currentUUID = import_react199.useMemo(randomUUID31, []), messageOptions = import_react199.useMemo(() => [...messages.filter(selectableUserMessagesFilter), {
    ...createUserMessage({
      content: ""
    }),
    uuid: currentUUID
  }], [messages, currentUUID]), [selectedIndex, setSelectedIndex] = import_react199.useState(messageOptions.length - 1), firstVisibleIndex = Math.max(0, Math.min(selectedIndex - Math.floor(MAX_VISIBLE_MESSAGES / 2), messageOptions.length - MAX_VISIBLE_MESSAGES)), hasMessagesToSelect = messageOptions.length > 1, [messageToRestore, setMessageToRestore] = import_react199.useState(preselectedMessage), [diffStatsForRestore, setDiffStatsForRestore] = import_react199.useState(void 0);
  import_react199.useEffect(() => {
    if (!preselectedMessage || !isFileHistoryEnabled)
      return;
    let cancelled = !1;
    return fileHistoryGetDiffStats(fileHistory, preselectedMessage.uuid).then((stats2) => {
      if (!cancelled)
        setDiffStatsForRestore(stats2);
    }), () => {
      cancelled = !0;
    };
  }, [preselectedMessage, isFileHistoryEnabled, fileHistory]);
  let [isRestoring, setIsRestoring] = import_react199.useState(!1), [restoringOption, setRestoringOption] = import_react199.useState(null), [selectedRestoreOption, setSelectedRestoreOption] = import_react199.useState("both"), [summarizeFromFeedback, setSummarizeFromFeedback] = import_react199.useState(""), [summarizeUpToFeedback, setSummarizeUpToFeedback] = import_react199.useState("");
  function getRestoreOptions(canRestoreCode) {
    let baseOptions = canRestoreCode ? [{
      value: "both",
      label: "Restore code and conversation"
    }, {
      value: "conversation",
      label: "Restore conversation"
    }, {
      value: "code",
      label: "Restore code"
    }] : [{
      value: "conversation",
      label: "Restore conversation"
    }], summarizeInputProps = {
      type: "input",
      placeholder: "add context (optional)",
      initialValue: "",
      allowEmptySubmitToCancel: !0,
      showLabelWithValue: !0,
      labelValueSeparator: ": "
    };
    return baseOptions.push({
      value: "summarize",
      label: "Summarize from here",
      ...summarizeInputProps,
      onChange: setSummarizeFromFeedback
    }), baseOptions.push({
      value: "nevermind",
      label: "Never mind"
    }), baseOptions;
  }
  import_react199.useEffect(() => {
    logEvent("tengu_message_selector_opened", {});
  }, []);
  async function restoreConversationDirectly(message) {
    onPreRestore(), setIsRestoring(!0);
    try {
      await onRestoreMessage(message), setIsRestoring(!1), onClose();
    } catch (error_0) {
      logError2(error_0), setIsRestoring(!1), setError(`Failed to restore the conversation:
${error_0}`);
    }
  }
  async function handleSelect(message_0) {
    let index2 = messages.indexOf(message_0), indexFromEnd = messages.length - 1 - index2;
    if (logEvent("tengu_message_selector_selected", {
      index_from_end: indexFromEnd,
      message_type: message_0.type,
      is_current_prompt: !1
    }), !messages.includes(message_0)) {
      onClose();
      return;
    }
    if (!isFileHistoryEnabled) {
      await restoreConversationDirectly(message_0);
      return;
    }
    let diffStats = await fileHistoryGetDiffStats(fileHistory, message_0.uuid);
    setMessageToRestore(message_0), setDiffStatsForRestore(diffStats);
  }
  async function onSelectRestoreOption(option) {
    if (logEvent("tengu_message_selector_restore_option_selected", {
      option
    }), !messageToRestore) {
      setError("Message not found.");
      return;
    }
    if (option === "nevermind") {
      if (preselectedMessage)
        onClose();
      else
        setMessageToRestore(void 0);
      return;
    }
    if (isSummarizeOption(option)) {
      onPreRestore(), setIsRestoring(!0), setRestoringOption(option), setError(void 0);
      try {
        let direction = option === "summarize_up_to" ? "up_to" : "from", feedback2 = (direction === "up_to" ? summarizeUpToFeedback : summarizeFromFeedback).trim() || void 0;
        await onSummarize(messageToRestore, feedback2, direction), setIsRestoring(!1), setRestoringOption(null), setMessageToRestore(void 0), onClose();
      } catch (error_1) {
        logError2(error_1), setIsRestoring(!1), setRestoringOption(null), setMessageToRestore(void 0), setError(`Failed to summarize:
${error_1}`);
      }
      return;
    }
    onPreRestore(), setIsRestoring(!0), setError(void 0);
    let codeError = null, conversationError = null;
    if (option === "code" || option === "both")
      try {
        await onRestoreCode(messageToRestore);
      } catch (error_2) {
        codeError = error_2, logError2(codeError);
      }
    if (option === "conversation" || option === "both")
      try {
        await onRestoreMessage(messageToRestore);
      } catch (error_3) {
        conversationError = error_3, logError2(conversationError);
      }
    if (setIsRestoring(!1), setMessageToRestore(void 0), conversationError && codeError)
      setError(`Failed to restore the conversation and code:
${conversationError}
${codeError}`);
    else if (conversationError)
      setError(`Failed to restore the conversation:
${conversationError}`);
    else if (codeError)
      setError(`Failed to restore the code:
${codeError}`);
    else
      onClose();
  }
  let exitState = useExitOnCtrlCDWithKeybindings(), handleEscape = import_react199.useCallback(() => {
    if (messageToRestore && !preselectedMessage) {
      setMessageToRestore(void 0);
      return;
    }
    logEvent("tengu_message_selector_cancelled", {}), onClose();
  }, [onClose, messageToRestore, preselectedMessage]), moveUp = import_react199.useCallback(() => setSelectedIndex((prev) => Math.max(0, prev - 1)), []), moveDown = import_react199.useCallback(() => setSelectedIndex((prev_0) => Math.min(messageOptions.length - 1, prev_0 + 1)), [messageOptions.length]), jumpToTop = import_react199.useCallback(() => setSelectedIndex(0), []), jumpToBottom = import_react199.useCallback(() => setSelectedIndex(messageOptions.length - 1), [messageOptions.length]), handleSelectCurrent = import_react199.useCallback(() => {
    let selected = messageOptions[selectedIndex];
    if (selected)
      handleSelect(selected);
  }, [messageOptions, selectedIndex, handleSelect]);
  useKeybinding("confirm:no", handleEscape, {
    context: "Confirmation",
    isActive: !messageToRestore
  }), useKeybindings({
    "messageSelector:up": moveUp,
    "messageSelector:down": moveDown,
    "messageSelector:top": jumpToTop,
    "messageSelector:bottom": jumpToBottom,
    "messageSelector:select": handleSelectCurrent
  }, {
    context: "MessageSelector",
    isActive: !isRestoring && !error44 && !messageToRestore && hasMessagesToSelect
  });
  let [fileHistoryMetadata, setFileHistoryMetadata] = import_react199.useState({});
  import_react199.useEffect(() => {
    async function loadFileHistoryMetadata() {
      if (!isFileHistoryEnabled)
        return;
      Promise.all(messageOptions.map(async (userMessage, itemIndex) => {
        if (userMessage.uuid !== currentUUID) {
          let canRestore = fileHistoryCanRestore(fileHistory, userMessage.uuid), nextUserMessage = messageOptions.at(itemIndex + 1), diffStats_0 = canRestore ? computeDiffStatsBetweenMessages(messages, userMessage.uuid, nextUserMessage?.uuid !== currentUUID ? nextUserMessage?.uuid : void 0) : void 0;
          if (diffStats_0 !== void 0)
            setFileHistoryMetadata((prev_1) => ({
              ...prev_1,
              [itemIndex]: diffStats_0
            }));
          else
            setFileHistoryMetadata((prev_2) => ({
              ...prev_2,
              [itemIndex]: void 0
            }));
        }
      }));
    }
    loadFileHistoryMetadata();
  }, [messageOptions, messages, currentUUID, fileHistory, isFileHistoryEnabled]);
  let canRestoreCode_0 = isFileHistoryEnabled && diffStatsForRestore?.filesChanged && diffStatsForRestore.filesChanged.length > 0, showPickList = !error44 && !messageToRestore && !preselectedMessage && hasMessagesToSelect;
  return /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    width: "100%",
    children: [
      /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(Divider, {
        color: "suggestion"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginX: 1,
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
            bold: !0,
            color: "suggestion",
            children: "Rewind"
          }, void 0, !1, void 0, this),
          error44 && /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
            children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
              color: "error",
              children: [
                "Error: ",
                error44
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          !hasMessagesToSelect && /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
            children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
              children: "Nothing to rewind to yet."
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          !error44 && messageToRestore && hasMessagesToSelect && /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                children: [
                  "Confirm you want to restore",
                  " ",
                  !diffStatsForRestore && "the conversation ",
                  "to the point before you sent this message:"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                paddingLeft: 1,
                borderStyle: "single",
                borderRight: !1,
                borderTop: !1,
                borderBottom: !1,
                borderLeft: !0,
                borderLeftDimColor: !0,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(UserMessageOption, {
                    userMessage: messageToRestore,
                    color: "text",
                    isCurrent: !1
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      "(",
                      formatRelativeTimeAgo(new Date(messageToRestore.timestamp)),
                      ")"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(RestoreOptionDescription, {
                selectedRestoreOption,
                canRestoreCode: !!canRestoreCode_0,
                diffStatsForRestore
              }, void 0, !1, void 0, this),
              isRestoring && isSummarizeOption(restoringOption) ? /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                flexDirection: "row",
                gap: 1,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                    children: "Summarizing\u2026"
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(Select, {
                isDisabled: isRestoring,
                options: getRestoreOptions(!!canRestoreCode_0),
                defaultFocusValue: canRestoreCode_0 ? "both" : "conversation",
                onFocus: (value) => setSelectedRestoreOption(value),
                onChange: (value_0) => onSelectRestoreOption(value_0),
                onCancel: () => preselectedMessage ? onClose() : setMessageToRestore(void 0)
              }, void 0, !1, void 0, this),
              canRestoreCode_0 && /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                marginBottom: 1,
                children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: [
                    figures_default.warning,
                    " Rewinding does not affect files edited manually or via bash."
                  ]
                }, void 0, !0, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          showPickList && /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
            children: [
              isFileHistoryEnabled ? /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                children: "Restore the code and/or conversation to the point before\u2026"
              }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                children: "Restore and fork the conversation to the point before\u2026"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                width: "100%",
                flexDirection: "column",
                children: messageOptions.slice(firstVisibleIndex, firstVisibleIndex + MAX_VISIBLE_MESSAGES).map((msg, visibleOptionIndex) => {
                  let optionIndex = firstVisibleIndex + visibleOptionIndex, isSelected = optionIndex === selectedIndex, isCurrent = msg.uuid === currentUUID, metadataLoaded = optionIndex in fileHistoryMetadata, metadata = fileHistoryMetadata[optionIndex], numFilesChanged = metadata?.filesChanged && metadata.filesChanged.length;
                  return /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                    height: isFileHistoryEnabled ? 3 : 2,
                    overflow: "hidden",
                    width: "100%",
                    flexDirection: "row",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                        width: 2,
                        minWidth: 2,
                        children: isSelected ? /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                          color: "permission",
                          bold: !0,
                          children: [
                            figures_default.pointer,
                            " "
                          ]
                        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                          children: "  "
                        }, void 0, !1, void 0, this)
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                        flexDirection: "column",
                        children: [
                          /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                            flexShrink: 1,
                            height: 1,
                            overflow: "hidden",
                            children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(UserMessageOption, {
                              userMessage: msg,
                              color: isSelected ? "suggestion" : void 0,
                              isCurrent,
                              paddingRight: 10
                            }, void 0, !1, void 0, this)
                          }, void 0, !1, void 0, this),
                          isFileHistoryEnabled && metadataLoaded && /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
                            height: 1,
                            flexDirection: "row",
                            children: metadata ? /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
                              children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                                dimColor: !isSelected,
                                color: "inactive",
                                children: numFilesChanged ? /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
                                  children: [
                                    numFilesChanged === 1 && metadata.filesChanged[0] ? `${path25.basename(metadata.filesChanged[0])} ` : `${numFilesChanged} files changed `,
                                    /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(DiffStatsText, {
                                      diffStats: metadata
                                    }, void 0, !1, void 0, this)
                                  ]
                                }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
                                  children: "No code changes"
                                }, void 0, !1, void 0, this)
                              }, void 0, !1, void 0, this)
                            }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                              dimColor: !0,
                              color: "warning",
                              children: [
                                figures_default.warning,
                                " No code restore"
                              ]
                            }, void 0, !0, void 0, this)
                          }, void 0, !1, void 0, this)
                        ]
                      }, void 0, !0, void 0, this)
                    ]
                  }, msg.uuid, !0, void 0, this);
                })
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          !messageToRestore && /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
              children: [
                "Press ",
                exitState.keyName,
                " again to exit"
              ]
            }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
              children: [
                !error44 && hasMessagesToSelect && "Enter to continue \xB7 ",
                "Esc to exit"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
