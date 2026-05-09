// Original: src/components/permissions/useShellPermissionFeedback.ts
function useShellPermissionFeedback({
  toolUseConfirm,
  onDone,
  onReject,
  explainerVisible
}) {
  let setAppState = useSetAppState(), [rejectFeedback, setRejectFeedback] = import_react214.useState(""), [acceptFeedback, setAcceptFeedback] = import_react214.useState(""), [yesInputMode, setYesInputMode] = import_react214.useState(!1), [noInputMode, setNoInputMode] = import_react214.useState(!1), [focusedOption, setFocusedOption] = import_react214.useState("yes"), [yesFeedbackModeEntered, setYesFeedbackModeEntered] = import_react214.useState(!1), [noFeedbackModeEntered, setNoFeedbackModeEntered] = import_react214.useState(!1);
  function handleInputModeToggle(option) {
    toolUseConfirm.onUserInteraction();
    let analyticsProps = {
      toolName: sanitizeToolNameForAnalytics(toolUseConfirm.tool.name),
      isMcp: toolUseConfirm.tool.isMcp ?? !1
    };
    if (option === "yes")
      if (yesInputMode)
        setYesInputMode(!1), logEvent("tengu_accept_feedback_mode_collapsed", analyticsProps);
      else
        setYesInputMode(!0), setYesFeedbackModeEntered(!0), logEvent("tengu_accept_feedback_mode_entered", analyticsProps);
    else if (option === "no")
      if (noInputMode)
        setNoInputMode(!1), logEvent("tengu_reject_feedback_mode_collapsed", analyticsProps);
      else
        setNoInputMode(!0), setNoFeedbackModeEntered(!0), logEvent("tengu_reject_feedback_mode_entered", analyticsProps);
  }
  function handleReject2(feedback2) {
    let trimmedFeedback = feedback2?.trim(), hasFeedback = !!trimmedFeedback;
    if (!hasFeedback)
      logEvent("tengu_permission_request_escape", {
        explainer_visible: explainerVisible
      }), setAppState((prev) => ({
        ...prev,
        attribution: {
          ...prev.attribution,
          escapeCount: prev.attribution.escapeCount + 1
        }
      }));
    if (logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "reject", hasFeedback), trimmedFeedback)
      toolUseConfirm.onReject(trimmedFeedback);
    else
      toolUseConfirm.onReject();
    onReject(), onDone();
  }
  function handleFocus(value) {
    if (value !== focusedOption)
      toolUseConfirm.onUserInteraction();
    if (value !== "yes" && yesInputMode && !acceptFeedback.trim())
      setYesInputMode(!1);
    if (value !== "no" && noInputMode && !rejectFeedback.trim())
      setNoInputMode(!1);
    setFocusedOption(value);
  }
  return {
    yesInputMode,
    noInputMode,
    yesFeedbackModeEntered,
    noFeedbackModeEntered,
    acceptFeedback,
    rejectFeedback,
    setAcceptFeedback,
    setRejectFeedback,
    focusedOption,
    handleInputModeToggle,
    handleReject: handleReject2,
    handleFocus
  };
}
var import_react214;
var init_useShellPermissionFeedback = __esm(() => {
  init_metadata();
  init_AppState();
  init_utils18();
  import_react214 = __toESM(require_react_development(), 1);
});
