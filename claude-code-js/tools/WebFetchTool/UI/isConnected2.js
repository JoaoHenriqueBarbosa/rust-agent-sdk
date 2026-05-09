// var: isConnected2
var isConnected2 = ({ ownerDocument, parentNode }) => {
  while (parentNode) {
    if (parentNode === ownerDocument)
      return !0;
    parentNode = parentNode.parentNode || parentNode.host;
  }
  return !1;
}, parentElement = ({ parentNode }) => {
  if (parentNode)
    switch (parentNode.nodeType) {
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        return null;
    }
  return parentNode;
}, previousSibling = ({ [PREV]: prev }) => {
  switch (prev ? prev.nodeType : 0) {
    case NODE_END:
      return prev[START];
    case TEXT_NODE:
    case COMMENT_NODE:
    case CDATA_SECTION_NODE:
      return prev;
  }
  return null;
}, nextSibling = (node2) => {
  let next = getEnd(node2)[NEXT];
  return next && (next.nodeType === NODE_END ? null : next);
};
