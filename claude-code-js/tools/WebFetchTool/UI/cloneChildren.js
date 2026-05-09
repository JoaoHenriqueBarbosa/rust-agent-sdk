// function: cloneChildren
function cloneChildren(childs) {
  let children = childs.map((child) => cloneNode(child, !0));
  for (let i5 = 1;i5 < children.length; i5++)
    children[i5].prev = children[i5 - 1], children[i5 - 1].next = children[i5];
  return children;
}
