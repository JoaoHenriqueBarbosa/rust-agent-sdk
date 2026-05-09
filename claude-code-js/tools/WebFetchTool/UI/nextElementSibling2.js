// var: nextElementSibling2
var nextElementSibling2 = (node2) => {
  let next = nextSibling(node2);
  while (next && next.nodeType !== ELEMENT_NODE)
    next = nextSibling(next);
  return next;
}, previousElementSibling = (node2) => {
  let prev = previousSibling(node2);
  while (prev && prev.nodeType !== ELEMENT_NODE)
    prev = previousSibling(prev);
  return prev;
};
