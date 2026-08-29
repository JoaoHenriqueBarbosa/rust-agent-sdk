// function: removeElement
function removeElement(elem) {
  if (elem.prev)
    elem.prev.next = elem.next;
  if (elem.next)
    elem.next.prev = elem.prev;
  if (elem.parent) {
    let childs = elem.parent.children, childsIndex = childs.lastIndexOf(elem);
    if (childsIndex >= 0)
      childs.splice(childsIndex, 1);
  }
  elem.next = null, elem.prev = null, elem.parent = null;
}
