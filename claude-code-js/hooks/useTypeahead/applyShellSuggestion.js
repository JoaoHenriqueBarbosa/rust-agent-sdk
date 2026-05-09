// function: applyShellSuggestion
function applyShellSuggestion(suggestion, input, cursorOffset, onInputChange, setCursorOffset, completionType) {
  let wordStart = input.slice(0, cursorOffset).lastIndexOf(" ") + 1, replacementText;
  if (completionType === "variable")
    replacementText = "$" + suggestion.displayText + " ";
  else if (completionType === "command")
    replacementText = suggestion.displayText + " ";
  else
    replacementText = suggestion.displayText;
  let newInput = input.slice(0, wordStart) + replacementText + input.slice(cursorOffset);
  onInputChange(newInput), setCursorOffset(wordStart + replacementText.length);
}
