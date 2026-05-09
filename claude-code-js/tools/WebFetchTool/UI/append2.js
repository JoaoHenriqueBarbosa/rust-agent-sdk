// function: append2
function append2(elem, next) {
  removeElement(next);
  let { parent: parent2 } = elem, currNext = elem.next;
  if (next.next = currNext, next.prev = elem, elem.next = next, next.parent = parent2, currNext) {
    if (currNext.prev = next, parent2) {
      let childs = parent2.children;
      childs.splice(childs.lastIndexOf(currNext), 0, next);
    }
  } else if (parent2)
    parent2.children.push(next);
}
