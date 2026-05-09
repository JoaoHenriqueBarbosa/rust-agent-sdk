// var: init_parent_node
var init_parent_node = __esm(() => {
  init_constants10();
  init_symbols();
  init_matches();
  init_node12();
  init_utils14();
  init_node11();
  init_text();
  init_node_list();
  init_mutation_observer();
  init_custom_element_registry();
  init_non_document_type_child_node();
  ParentNode = class ParentNode extends Node3 {
    constructor(ownerDocument, localName, nodeType) {
      super(ownerDocument, localName, nodeType);
      this[PRIVATE] = null, this[NEXT] = this[END] = {
        [NEXT]: null,
        [PREV]: this,
        [START]: this,
        nodeType: NODE_END,
        ownerDocument: this.ownerDocument,
        parentNode: null
      };
    }
    get childNodes() {
      let childNodes = new NodeList, { firstChild } = this;
      while (firstChild)
        childNodes.push(firstChild), firstChild = nextSibling(firstChild);
      return childNodes;
    }
    get children() {
      let children = new NodeList, { firstElementChild } = this;
      while (firstElementChild)
        children.push(firstElementChild), firstElementChild = nextElementSibling2(firstElementChild);
      return children;
    }
    get firstChild() {
      let { [NEXT]: next, [END]: end } = this;
      while (next.nodeType === ATTRIBUTE_NODE)
        next = next[NEXT];
      return next === end ? null : next;
    }
    get firstElementChild() {
      let { firstChild } = this;
      while (firstChild) {
        if (firstChild.nodeType === ELEMENT_NODE)
          return firstChild;
        firstChild = nextSibling(firstChild);
      }
      return null;
    }
    get lastChild() {
      let prev = this[END][PREV];
      switch (prev.nodeType) {
        case NODE_END:
          return prev[START];
        case ATTRIBUTE_NODE:
          return null;
      }
      return prev === this ? null : prev;
    }
    get lastElementChild() {
      let { lastChild } = this;
      while (lastChild) {
        if (lastChild.nodeType === ELEMENT_NODE)
          return lastChild;
        lastChild = previousSibling(lastChild);
      }
      return null;
    }
    get childElementCount() {
      return this.children.length;
    }
    prepend(...nodes) {
      insert(this, this.firstChild, nodes);
    }
    append(...nodes) {
      insert(this, this[END], nodes);
    }
    replaceChildren(...nodes) {
      let { [NEXT]: next, [END]: end } = this;
      while (next !== end && next.nodeType === ATTRIBUTE_NODE)
        next = next[NEXT];
      while (next !== end) {
        let after2 = getEnd(next)[NEXT];
        next.remove(), next = after2;
      }
      if (nodes.length)
        insert(this, end, nodes);
    }
    getElementsByClassName(className) {
      let elements = new NodeList, { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        if (next.nodeType === ELEMENT_NODE && next.hasAttribute("class") && next.classList.has(className))
          elements.push(next);
        next = next[NEXT];
      }
      return elements;
    }
    getElementsByTagName(tagName) {
      let elements = new NodeList, { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        if (next.nodeType === ELEMENT_NODE && (next.localName === tagName || localCase(next) === tagName))
          elements.push(next);
        next = next[NEXT];
      }
      return elements;
    }
    querySelector(selectors) {
      let matches2 = prepareMatch(this, selectors), { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        if (next.nodeType === ELEMENT_NODE && matches2(next))
          return next;
        next = next.nodeType === ELEMENT_NODE && next.localName === "template" ? next[END] : next[NEXT];
      }
      return null;
    }
    querySelectorAll(selectors) {
      let matches2 = prepareMatch(this, selectors), elements = new NodeList, { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        if (next.nodeType === ELEMENT_NODE && matches2(next))
          elements.push(next);
        next = next.nodeType === ELEMENT_NODE && next.localName === "template" ? next[END] : next[NEXT];
      }
      return elements;
    }
    appendChild(node2) {
      return this.insertBefore(node2, this[END]);
    }
    contains(node2) {
      let parentNode = node2;
      while (parentNode && parentNode !== this)
        parentNode = parentNode.parentNode;
      return parentNode === this;
    }
    insertBefore(node2, before2 = null) {
      if (node2 === before2)
        return node2;
      if (node2 === this)
        throw Error("unable to append a node to itself");
      let next = before2 || this[END];
      switch (node2.nodeType) {
        case ELEMENT_NODE:
          node2.remove(), node2.parentNode = this, knownBoundaries(next[PREV], node2, next), moCallback(node2, null), connectedCallback(node2);
          break;
        case DOCUMENT_FRAGMENT_NODE: {
          let { [PRIVATE]: parentNode, firstChild, lastChild } = node2;
          if (firstChild) {
            if (knownSegment(next[PREV], firstChild, lastChild, next), knownAdjacent(node2, node2[END]), parentNode)
              parentNode.replaceChildren();
            do
              if (firstChild.parentNode = this, moCallback(firstChild, null), firstChild.nodeType === ELEMENT_NODE)
                connectedCallback(firstChild);
            while (firstChild !== lastChild && (firstChild = nextSibling(firstChild)));
          }
          break;
        }
        case TEXT_NODE:
        case COMMENT_NODE:
        case CDATA_SECTION_NODE:
          node2.remove();
        default:
          node2.parentNode = this, knownSiblings(next[PREV], node2, next), moCallback(node2, null);
          break;
      }
      return node2;
    }
    normalize() {
      let { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        let { [NEXT]: $next, [PREV]: $prev, nodeType } = next;
        if (nodeType === TEXT_NODE) {
          if (!next[VALUE])
            next.remove();
          else if ($prev && $prev.nodeType === TEXT_NODE)
            $prev.textContent += next.textContent, next.remove();
        }
        next = $next;
      }
    }
    removeChild(node2) {
      if (node2.parentNode !== this)
        throw Error("node is not a child");
      return node2.remove(), node2;
    }
    replaceChild(node2, replaced) {
      let next = getEnd(replaced)[NEXT];
      return replaced.remove(), this.insertBefore(node2, next), replaced;
    }
  };
});
