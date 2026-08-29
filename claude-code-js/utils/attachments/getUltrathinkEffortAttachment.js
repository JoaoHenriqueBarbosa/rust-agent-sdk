// function: getUltrathinkEffortAttachment
function getUltrathinkEffortAttachment(input) {
  if (!isUltrathinkEnabled() || !input || !hasUltrathinkKeyword(input))
    return [];
  return logEvent("tengu_ultrathink", {}), [{ type: "ultrathink_effort", level: "high" }];
}
