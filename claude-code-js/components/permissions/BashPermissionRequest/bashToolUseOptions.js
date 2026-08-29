// Original: src/components/permissions/BashPermissionRequest/bashToolUseOptions.tsx
function stripBashRedirections(command19) {
  let {
    commandWithoutRedirections,
    redirections
  } = extractOutputRedirections(command19);
  return redirections.length > 0 ? commandWithoutRedirections : command19;
}
function bashToolUseOptions({
  suggestions = [],
  decisionReason,
  onRejectFeedbackChange,
  onAcceptFeedbackChange,
  onClassifierDescriptionChange,
  classifierDescription,
  initialClassifierDescriptionEmpty = !1,
  existingAllowDescriptions = [],
  yesInputMode = !1,
  noInputMode = !1,
  editablePrefix,
  onEditablePrefixChange
}) {
  let options2 = [];
  if (yesInputMode)
    options2.push({
      type: "input",
      label: "Yes",
      value: "yes",
      placeholder: "and tell Claude what to do next",
      onChange: onAcceptFeedbackChange,
      allowEmptySubmitToCancel: !0
    });
  else
    options2.push({
      label: "Yes",
      value: "yes"
    });
  if (shouldShowAlwaysAllowOptions()) {
    let hasNonBashSuggestions = suggestions.some((s2) => s2.type === "addDirectories" || s2.type === "addRules" && s2.rules?.some((r4) => r4.toolName !== BASH_TOOL_NAME));
    if (editablePrefix !== void 0 && onEditablePrefixChange && !hasNonBashSuggestions && suggestions.length > 0)
      options2.push({
        type: "input",
        label: "Yes, and don\u2019t ask again for",
        value: "yes-prefix-edited",
        placeholder: "command prefix (e.g., npm run:*)",
        initialValue: editablePrefix,
        onChange: onEditablePrefixChange,
        allowEmptySubmitToCancel: !0,
        showLabelWithValue: !0,
        labelValueSeparator: ": ",
        resetCursorOnUpdate: !0
      });
    else if (suggestions.length > 0) {
      let label = generateShellSuggestionsLabel(suggestions, BASH_TOOL_NAME, stripBashRedirections);
      if (label)
        options2.push({
          label,
          value: "yes-apply-suggestions"
        });
    }
    let editablePrefixShown = options2.some((o5) => o5.value === "yes-prefix-edited");
  }
  if (noInputMode)
    options2.push({
      type: "input",
      label: "No",
      value: "no",
      placeholder: "and tell Claude what to do differently",
      onChange: onRejectFeedbackChange,
      allowEmptySubmitToCancel: !0
    });
  else
    options2.push({
      label: "No",
      value: "no"
    });
  return options2;
}
var init_bashToolUseOptions = __esm(() => {
  init_commands4();
  init_permissionsLoader();
  init_shellPermissionHelpers();
});
