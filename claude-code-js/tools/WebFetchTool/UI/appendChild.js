// function: appendChild
function appendChild(parent2, child) {
  if (removeElement(child), child.next = null, child.parent = parent2, parent2.children.push(child) > 1) {
    let sibling = parent2.children[parent2.children.length - 2];
    sibling.next = child, child.prev = sibling;
  } else
    child.prev = null;
}
