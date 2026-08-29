// function: prepareContext
function prepareContext(elems, adapter2, shouldTestNextSiblings = !1) {
  if (shouldTestNextSiblings)
    elems = appendNextSiblings(elems, adapter2);
  return Array.isArray(elems) ? adapter2.removeSubsets(elems) : adapter2.getChildren(elems);
}
