// var: asFragment
var asFragment = (ownerDocument, nodes) => {
  let fragment = ownerDocument.createDocumentFragment();
  return fragment.append(...nodes), fragment;
}, before = (node2, nodes) => {
  let { ownerDocument, parentNode } = node2;
  if (parentNode)
    parentNode.insertBefore(asFragment(ownerDocument, nodes), node2);
}, after = (node2, nodes) => {
  let { ownerDocument, parentNode } = node2;
  if (parentNode)
    parentNode.insertBefore(asFragment(ownerDocument, nodes), getEnd(node2)[NEXT]);
}, replaceWith = (node2, nodes) => {
  let { ownerDocument, parentNode } = node2;
  if (parentNode) {
    if (nodes.includes(node2))
      replaceWith(node2, [node2 = node2.cloneNode()]);
    parentNode.insertBefore(asFragment(ownerDocument, nodes), node2), node2.remove();
  }
}, remove2 = (prev, current, next) => {
  let { parentNode, nodeType } = current;
  if (prev || next)
    setAdjacent(prev, next), current[PREV] = null, getEnd(current)[NEXT] = null;
  if (parentNode) {
    if (current.parentNode = null, moCallback(current, parentNode), nodeType === ELEMENT_NODE)
      disconnectedCallback(current);
  }
};
