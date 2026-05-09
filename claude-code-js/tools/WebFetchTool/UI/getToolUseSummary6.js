// function: getToolUseSummary6
function getToolUseSummary6(input) {
  if (!input?.url)
    return null;
  return truncate(input.url, TOOL_SUMMARY_MAX_LENGTH);
}
