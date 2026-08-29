// function: getElementParent
function getElementParent(node2, adapter2) {
  let parent2 = adapter2.getParent(node2);
  if (parent2 && adapter2.isTag(parent2))
    return parent2;
  return null;
}
