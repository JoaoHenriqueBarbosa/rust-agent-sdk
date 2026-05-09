// function: prepend
function prepend(elem, prev) {
  removeElement(prev);
  let { parent: parent2 } = elem;
  if (parent2) {
    let childs = parent2.children;
    childs.splice(childs.indexOf(elem), 0, prev);
  }
  if (elem.prev)
    elem.prev.next = prev;
  prev.parent = parent2, prev.prev = elem.prev, prev.next = elem, elem.prev = prev;
}
