// Original: src/components/permissions/FilePermissionDialog/useFilePermissionDialog.ts
function useFilePermissionDialog({
  filePath,
  completionType,
  languageName,
  toolUseConfirm,
  onDone,
  onReject,
  parseInput,
  operationType = "write"
}) {
  let toolPermissionContext = useAppState((s2) => s2.toolPermissionContext), [acceptFeedback, setAcceptFeedback] = import_react211.useState(""), [rejectFeedback, setRejectFeedback] = import_react211.useState(""), [focusedOption, setFocusedOption] = import_react211.useState("yes"), [yesInputMode, setYesInputMode] = import_react211.useState(!1), [noInputMode, setNoInputMode] = import_react211.useState(!1), [yesFeedbackModeEntered, setYesFeedbackModeEntered] = import_react211.useState(!1), [noFeedbackModeEntered, setNoFeedbackModeEntered] = import_react211.useState(!1), options2 = import_react211.useMemo(() => getFilePermissionOptions({
    filePath,
    toolPermissionContext,
    operationType,
    onRejectFeedbackChange: setRejectFeedback,
    onAcceptFeedbackChange: setAcceptFeedback,
    yesInputMode,
    noInputMode
  }), [filePath, toolPermissionContext, operationType, yesInputMode, noInputMode]), onChange = import_react211.useCallback((option, input, feedback2) => {
    let params = {
      messageId: toolUseConfirm.assistantMessage.message.id,
      path: filePath,
      toolUseConfirm,
      toolPermissionContext,
      onDone,
      onReject,
      completionType,
      languageName,
      operationType
    }, originalOnAllow = toolUseConfirm.onAllow;
    toolUseConfirm.onAllow = (_input, permissionUpdates, feedback3) => {
      originalOnAllow(input, permissionUpdates, feedback3);
    };
    let handler4 = PERMISSION_HANDLERS[option.type];
    handler4(params, {
      feedback: feedback2,
      hasFeedback: !!feedback2,
      enteredFeedbackMode: option.type === "accept-once" ? yesFeedbackModeEntered : noFeedbackModeEntered,
      scope: option.type === "accept-session" ? option.scope : void 0
    });
  }, [
    filePath,
    completionType,
    languageName,
    toolUseConfirm,
    toolPermissionContext,
    onDone,
    onReject,
    operationType,
    yesFeedbackModeEntered,
    noFeedbackModeEntered
  ]), handleCycleMode = import_react211.useCallback(() => {
    let sessionOption = options2.find((o5) => o5.option.type === "accept-session");
    if (sessionOption) {
      let parsedInput = parseInput(toolUseConfirm.input);
      onChange(sessionOption.option, parsedInput);
    }
  }, [options2, parseInput, toolUseConfirm.input, onChange]);
  useKeybindings({ "confirm:cycleMode": handleCycleMode }, { context: "Confirmation" });
  let handleFocusedOptionChange = import_react211.useCallback((value) => {
    if (value !== "yes" && yesInputMode && !acceptFeedback.trim())
      setYesInputMode(!1);
    if (value !== "no" && noInputMode && !rejectFeedback.trim())
      setNoInputMode(!1);
    setFocusedOption(value);
  }, [yesInputMode, noInputMode, acceptFeedback, rejectFeedback]), handleInputModeToggle = import_react211.useCallback((value) => {
    let analyticsProps = {
      toolName: sanitizeToolNameForAnalytics(toolUseConfirm.tool.name),
      isMcp: toolUseConfirm.tool.isMcp ?? !1
    };
    if (value === "yes")
      if (yesInputMode)
        setYesInputMode(!1), logEvent("tengu_accept_feedback_mode_collapsed", analyticsProps);
      else
        setYesInputMode(!0), setYesFeedbackModeEntered(!0), logEvent("tengu_accept_feedback_mode_entered", analyticsProps);
    else if (value === "no")
      if (noInputMode)
        setNoInputMode(!1), logEvent("tengu_reject_feedback_mode_collapsed", analyticsProps);
      else
        setNoInputMode(!0), setNoFeedbackModeEntered(!0), logEvent("tengu_reject_feedback_mode_entered", analyticsProps);
  }, [yesInputMode, noInputMode, toolUseConfirm]);
  return {
    options: options2,
    onChange,
    acceptFeedback,
    rejectFeedback,
    focusedOption,
    setFocusedOption: handleFocusedOptionChange,
    handleInputModeToggle,
    yesInputMode,
    noInputMode
  };
}
var import_react211;
var init_useFilePermissionDialog = __esm(() => {
  init_AppState();
  init_useKeybinding();
  init_metadata();
  init_permissionOptions();
  init_usePermissionHandler();
  import_react211 = __toESM(require_react_development(), 1);
});
