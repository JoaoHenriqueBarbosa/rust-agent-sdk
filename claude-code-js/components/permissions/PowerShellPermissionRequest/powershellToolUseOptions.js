// Original: src/components/permissions/PowerShellPermissionRequest/powershellToolUseOptions.tsx
function powershellToolUseOptions({
  suggestions = [],
  onRejectFeedbackChange,
  onAcceptFeedbackChange,
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
  if (shouldShowAlwaysAllowOptions() && suggestions.length > 0) {
    let hasNonPowerShellSuggestions = suggestions.some((s2) => s2.type === "addDirectories" || s2.type === "addRules" && s2.rules?.some((r4) => r4.toolName !== POWERSHELL_TOOL_NAME));
    if (editablePrefix !== void 0 && onEditablePrefixChange && !hasNonPowerShellSuggestions)
      options2.push({
        type: "input",
        label: "Yes, and don\u2019t ask again for",
        value: "yes-prefix-edited",
        placeholder: "command prefix (e.g., Get-Process:*)",
        initialValue: editablePrefix,
        onChange: onEditablePrefixChange,
        allowEmptySubmitToCancel: !0,
        showLabelWithValue: !0,
        labelValueSeparator: ": ",
        resetCursorOnUpdate: !0
      });
    else {
      let label = generateShellSuggestionsLabel(suggestions, POWERSHELL_TOOL_NAME);
      if (label)
        options2.push({
          label,
          value: "yes-apply-suggestions"
        });
    }
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
var init_powershellToolUseOptions = __esm(() => {
  init_permissionsLoader();
  init_shellPermissionHelpers();
});
