// function: applyTriggerSuggestion
function applyTriggerSuggestion(suggestion, input, cursorOffset, triggerRe, onInputChange, setCursorOffset) {
  let m4 = input.slice(0, cursorOffset).match(triggerRe);
  if (!m4 || m4.index === void 0)
    return;
  let prefixStart = m4.index + (m4[1]?.length ?? 0), before2 = input.slice(0, prefixStart), newInput = before2 + suggestion.displayText + " " + input.slice(cursorOffset);
  onInputChange(newInput), setCursorOffset(before2.length + suggestion.displayText.length + 1);
}
