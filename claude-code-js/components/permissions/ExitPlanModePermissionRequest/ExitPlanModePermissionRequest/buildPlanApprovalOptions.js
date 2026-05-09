// function: buildPlanApprovalOptions
function buildPlanApprovalOptions({
  showClearContext,
  showUltraplan,
  usedPercent,
  isAutoModeAvailable,
  isBypassPermissionsModeAvailable,
  onFeedbackChange
}) {
  let options2 = [], usedLabel = usedPercent !== null ? ` (${usedPercent}% used)` : "";
  if (showClearContext)
    if (isBypassPermissionsModeAvailable)
      options2.push({
        label: `Yes, clear context${usedLabel} and bypass permissions`,
        value: "yes-bypass-permissions"
      });
    else
      options2.push({
        label: `Yes, clear context${usedLabel} and auto-accept edits`,
        value: "yes-accept-edits"
      });
  if (isBypassPermissionsModeAvailable)
    options2.push({
      label: "Yes, and bypass permissions",
      value: "yes-accept-edits-keep-context"
    });
  else
    options2.push({
      label: "Yes, auto-accept edits",
      value: "yes-accept-edits-keep-context"
    });
  if (options2.push({
    label: "Yes, manually approve edits",
    value: "yes-default-keep-context"
  }), showUltraplan)
    options2.push({
      label: "No, refine with Ultraplan on Claude Code on the web",
      value: "ultraplan"
    });
  return options2.push({
    type: "input",
    label: "No, keep planning",
    value: "no",
    placeholder: "Tell Claude what to change",
    description: "shift+tab to approve with this feedback",
    onChange: onFeedbackChange
  }), options2;
}
