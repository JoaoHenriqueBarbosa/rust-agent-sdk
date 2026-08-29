// var: init_node11
var init_node11 = __esm(() => {
  init_constants10();
  init_symbols();
  init_event_target();
  init_node_list();
  Node3 = class Node3 extends DOMEventTarget {
    static get ELEMENT_NODE() {
      return ELEMENT_NODE;
    }
    static get ATTRIBUTE_NODE() {
      return ATTRIBUTE_NODE;
    }
    static get TEXT_NODE() {
      return TEXT_NODE;
    }
    static get CDATA_SECTION_NODE() {
      return CDATA_SECTION_NODE;
    }
    static get COMMENT_NODE() {
      return COMMENT_NODE;
    }
    static get DOCUMENT_NODE() {
      return DOCUMENT_NODE;
    }
    static get DOCUMENT_FRAGMENT_NODE() {
      return DOCUMENT_FRAGMENT_NODE;
    }
    static get DOCUMENT_TYPE_NODE() {
      return DOCUMENT_TYPE_NODE;
    }
    constructor(ownerDocument, localName, nodeType) {
      super();
      this.ownerDocument = ownerDocument, this.localName = localName, this.nodeType = nodeType, this.parentNode = null, this[NEXT] = null, this[PREV] = null;
    }
    get ELEMENT_NODE() {
      return ELEMENT_NODE;
    }
    get ATTRIBUTE_NODE() {
      return ATTRIBUTE_NODE;
    }
    get TEXT_NODE() {
      return TEXT_NODE;
    }
    get CDATA_SECTION_NODE() {
      return CDATA_SECTION_NODE;
    }
    get COMMENT_NODE() {
      return COMMENT_NODE;
    }
    get DOCUMENT_NODE() {
      return DOCUMENT_NODE;
    }
    get DOCUMENT_FRAGMENT_NODE() {
      return DOCUMENT_FRAGMENT_NODE;
    }
    get DOCUMENT_TYPE_NODE() {
      return DOCUMENT_TYPE_NODE;
    }
    get baseURI() {
      let ownerDocument = this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument;
      if (ownerDocument) {
        let base2 = ownerDocument.querySelector("base");
        if (base2)
          return base2.getAttribute("href");
        let { location } = ownerDocument.defaultView;
        if (location)
          return location.href;
      }
      return null;
    }
    get isConnected() {
      return !1;
    }
    get nodeName() {
      return this.localName;
    }
    get parentElement() {
      return null;
    }
    get previousSibling() {
      return null;
    }
    get previousElementSibling() {
      return null;
    }
    get nextSibling() {
      return null;
    }
    get nextElementSibling() {
      return null;
    }
    get childNodes() {
      return new NodeList;
    }
    get firstChild() {
      return null;
    }
    get lastChild() {
      return null;
    }
    get nodeValue() {
      return null;
    }
    set nodeValue(value) {}
    get textContent() {
      return null;
    }
    set textContent(value) {}
    normalize() {}
    cloneNode() {
      return null;
    }
    contains() {
      return !1;
    }
    insertBefore(newNode, referenceNode) {
      return newNode;
    }
    appendChild(child) {
      return child;
    }
    replaceChild(newChild, oldChild) {
      return oldChild;
    }
    removeChild(child) {
      return child;
    }
    toString() {
      return "";
    }
    hasChildNodes() {
      return !!this.lastChild;
    }
    isSameNode(node2) {
      return this === node2;
    }
    compareDocumentPosition(target) {
      let result = 0;
      if (this !== target) {
        let self2 = getParentNodeCount(this), other2 = getParentNodeCount(target);
        if (self2 < other2) {
          if (result += DOCUMENT_POSITION_FOLLOWING, this.contains(target))
            result += DOCUMENT_POSITION_CONTAINED_BY;
        } else if (other2 < self2) {
          if (result += DOCUMENT_POSITION_PRECEDING, target.contains(this))
            result += DOCUMENT_POSITION_CONTAINS;
        } else if (self2 && other2) {
          let { childNodes } = this.parentNode;
          if (childNodes.indexOf(this) < childNodes.indexOf(target))
            result += DOCUMENT_POSITION_FOLLOWING;
          else
            result += DOCUMENT_POSITION_PRECEDING;
        }
        if (!self2 || !other2)
          result += DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, result += DOCUMENT_POSITION_DISCONNECTED;
      }
      return result;
    }
    isEqualNode(node2) {
      if (this === node2)
        return !0;
      if (this.nodeType === node2.nodeType) {
        switch (this.nodeType) {
          case DOCUMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE: {
            let aNodes = this.childNodes, bNodes = node2.childNodes;
            return aNodes.length === bNodes.length && aNodes.every((node3, i5) => node3.isEqualNode(bNodes[i5]));
          }
        }
        return this.toString() === node2.toString();
      }
      return !1;
    }
    _getParent() {
      return this.parentNode;
    }
    getRootNode() {
      let root2 = this;
      while (root2.parentNode)
        root2 = root2.parentNode;
      return root2;
    }
  };
});
