// function: prependChild
function prependChild(parent2, child) {
  if (removeElement(child), child.parent = parent2, child.prev = null, parent2.children.unshift(child) !== 1) {
    let sibling = parent2.children[1];
    sibling.prev = child, child.next = sibling;
  } else
    child.next = null;
}
