// function: getPreservedSelection
function getPreservedSelection(prevSuggestions, prevSelection, newSuggestions) {
  if (newSuggestions.length === 0)
    return -1;
  if (prevSelection < 0)
    return 0;
  let prevSelectedItem = prevSuggestions[prevSelection];
  if (!prevSelectedItem)
    return 0;
  let newIndex = newSuggestions.findIndex((item) => item.id === prevSelectedItem.id);
  return newIndex >= 0 ? newIndex : 0;
}
