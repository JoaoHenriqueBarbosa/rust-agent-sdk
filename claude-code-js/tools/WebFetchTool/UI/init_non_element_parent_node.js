// var: init_non_element_parent_node
var init_non_element_parent_node = __esm(() => {
  init_constants10();
  init_symbols();
  init_jsdon();
  init_parent_node();
  NonElementParentNode = class NonElementParentNode extends ParentNode {
    getElementById(id) {
      let { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        if (next.nodeType === ELEMENT_NODE && next.id === id)
          return next;
        next = next[NEXT];
      }
      return null;
    }
    cloneNode(deep) {
      let { ownerDocument, constructor } = this, nonEPN = new constructor(ownerDocument);
      if (deep) {
        let { [END]: end } = nonEPN;
        for (let node2 of this.childNodes)
          nonEPN.insertBefore(node2.cloneNode(deep), end);
      }
      return nonEPN;
    }
    toString() {
      let { childNodes, localName } = this;
      return `<${localName}>${childNodes.join("")}</${localName}>`;
    }
    toJSON() {
      let json2 = [];
      return nonElementAsJSON(this, json2), json2;
    }
  };
});
