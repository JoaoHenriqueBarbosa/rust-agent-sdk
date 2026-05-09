// function: getNextSiblings
function getNextSiblings(elem, adapter2) {
  let siblings = adapter2.getSiblings(elem);
  if (siblings.length <= 1)
    return [];
  let elemIndex = siblings.indexOf(elem);
  if (elemIndex < 0 || elemIndex === siblings.length - 1)
    return [];
  return siblings.slice(elemIndex + 1).filter(adapter2.isTag);
}
