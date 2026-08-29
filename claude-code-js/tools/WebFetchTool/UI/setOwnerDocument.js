// function: setOwnerDocument
function setOwnerDocument(node2) {
  switch (node2.ownerDocument = this, node2.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      node2.childNodes.forEach(setOwnerDocument, this);
      break;
  }
  return node2;
}
