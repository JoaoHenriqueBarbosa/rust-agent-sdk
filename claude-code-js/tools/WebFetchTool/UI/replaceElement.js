// function: replaceElement
function replaceElement(elem, replacement) {
  let prev = replacement.prev = elem.prev;
  if (prev)
    prev.next = replacement;
  let next = replacement.next = elem.next;
  if (next)
    next.prev = replacement;
  let parent2 = replacement.parent = elem.parent;
  if (parent2) {
    let childs = parent2.children;
    childs[childs.lastIndexOf(elem)] = replacement, elem.parent = null;
  }
}
