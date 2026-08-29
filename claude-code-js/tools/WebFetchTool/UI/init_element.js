// var: init_element
var init_element = __esm(() => {
  init_constants10();
  init_attributes();
  init_symbols();
  init_utils14();
  init_jsdon();
  init_matches();
  init_shadow_roots();
  init_node12();
  init_non_document_type_child_node();
  init_child_node();
  init_inner_html();
  init_parent_node();
  init_string_map();
  init_token_list();
  init_css_style_declaration();
  init_event();
  init_named_node_map();
  init_shadow_root();
  init_node_list();
  init_attr();
  init_text();
  init_text_escaper();
  attributesHandler = {
    get(target, key3) {
      return key3 in target ? target[key3] : target.find(({ name: name3 }) => name3 === key3);
    }
  };
  Element2 = class Element2 extends ParentNode {
    constructor(ownerDocument, localName) {
      super(ownerDocument, localName, ELEMENT_NODE);
      this[CLASS_LIST] = null, this[DATASET] = null, this[STYLE] = null;
    }
    get isConnected() {
      return isConnected2(this);
    }
    get parentElement() {
      return parentElement(this);
    }
    get previousSibling() {
      return previousSibling(this);
    }
    get nextSibling() {
      return nextSibling(this);
    }
    get namespaceURI() {
      return "http://www.w3.org/1999/xhtml";
    }
    get previousElementSibling() {
      return previousElementSibling(this);
    }
    get nextElementSibling() {
      return nextElementSibling2(this);
    }
    before(...nodes) {
      before(this, nodes);
    }
    after(...nodes) {
      after(this, nodes);
    }
    replaceWith(...nodes) {
      replaceWith(this, nodes);
    }
    remove() {
      remove2(this[PREV], this, this[END][NEXT]);
    }
    get id() {
      return stringAttribute.get(this, "id");
    }
    set id(value) {
      stringAttribute.set(this, "id", value);
    }
    get className() {
      return this.classList.value;
    }
    set className(value) {
      let { classList } = this;
      classList.clear(), classList.add(...$String(value).split(/\s+/));
    }
    get nodeName() {
      return localCase(this);
    }
    get tagName() {
      return localCase(this);
    }
    get classList() {
      return this[CLASS_LIST] || (this[CLASS_LIST] = new DOMTokenList(this));
    }
    get dataset() {
      return this[DATASET] || (this[DATASET] = new DOMStringMap(this));
    }
    getBoundingClientRect() {
      return {
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0
      };
    }
    get nonce() {
      return stringAttribute.get(this, "nonce");
    }
    set nonce(value) {
      stringAttribute.set(this, "nonce", value);
    }
    get style() {
      return this[STYLE] || (this[STYLE] = new CSSStyleDeclaration(this));
    }
    get tabIndex() {
      return numericAttribute.get(this, "tabindex") || -1;
    }
    set tabIndex(value) {
      numericAttribute.set(this, "tabindex", value);
    }
    get slot() {
      return stringAttribute.get(this, "slot");
    }
    set slot(value) {
      stringAttribute.set(this, "slot", value);
    }
    get innerText() {
      let text2 = [], { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        if (next.nodeType === TEXT_NODE)
          text2.push(next.textContent.replace(/\s+/g, " "));
        else if (text2.length && next[NEXT] != end && BLOCK_ELEMENTS.has(next.tagName))
          text2.push(`
`);
        next = next[NEXT];
      }
      return text2.join("");
    }
    get textContent() {
      let text2 = [], { [NEXT]: next, [END]: end } = this;
      while (next !== end) {
        let nodeType = next.nodeType;
        if (nodeType === TEXT_NODE || nodeType === CDATA_SECTION_NODE)
          text2.push(next.textContent);
        next = next[NEXT];
      }
      return text2.join("");
    }
    set textContent(text2) {
      if (this.replaceChildren(), text2 != null && text2 !== "")
        this.appendChild(new Text5(this.ownerDocument, text2));
    }
    get innerHTML() {
      return getInnerHtml(this);
    }
    set innerHTML(html2) {
      setInnerHtml(this, html2);
    }
    get outerHTML() {
      return this.toString();
    }
    set outerHTML(html2) {
      let template = this.ownerDocument.createElement("");
      template.innerHTML = html2, this.replaceWith(...template.childNodes);
    }
    get attributes() {
      let attributes2 = new NamedNodeMap(this), next = this[NEXT];
      while (next.nodeType === ATTRIBUTE_NODE)
        attributes2.push(next), next = next[NEXT];
      return new Proxy(attributes2, attributesHandler);
    }
    focus() {
      this.dispatchEvent(new GlobalEvent("focus"));
    }
    getAttribute(name3) {
      if (name3 === "class")
        return this.className;
      let attribute2 = this.getAttributeNode(name3);
      return attribute2 && (ignoreCase(this) ? attribute2.value : escape4(attribute2.value));
    }
    getAttributeNode(name3) {
      let next = this[NEXT];
      while (next.nodeType === ATTRIBUTE_NODE) {
        if (next.name === name3)
          return next;
        next = next[NEXT];
      }
      return null;
    }
    getAttributeNames() {
      let attributes2 = new NodeList, next = this[NEXT];
      while (next.nodeType === ATTRIBUTE_NODE)
        attributes2.push(next.name), next = next[NEXT];
      return attributes2;
    }
    hasAttribute(name3) {
      return !!this.getAttributeNode(name3);
    }
    hasAttributes() {
      return this[NEXT].nodeType === ATTRIBUTE_NODE;
    }
    removeAttribute(name3) {
      if (name3 === "class" && this[CLASS_LIST])
        this[CLASS_LIST].clear();
      let next = this[NEXT];
      while (next.nodeType === ATTRIBUTE_NODE) {
        if (next.name === name3) {
          removeAttribute(this, next);
          return;
        }
        next = next[NEXT];
      }
    }
    removeAttributeNode(attribute2) {
      let next = this[NEXT];
      while (next.nodeType === ATTRIBUTE_NODE) {
        if (next === attribute2) {
          removeAttribute(this, next);
          return;
        }
        next = next[NEXT];
      }
    }
    setAttribute(name3, value) {
      if (name3 === "class")
        this.className = value;
      else {
        let attribute2 = this.getAttributeNode(name3);
        if (attribute2)
          attribute2.value = value;
        else
          setAttribute2(this, new Attr(this.ownerDocument, name3, value));
      }
    }
    setAttributeNode(attribute2) {
      let { name: name3 } = attribute2, previously = this.getAttributeNode(name3);
      if (previously !== attribute2) {
        if (previously)
          this.removeAttributeNode(previously);
        let { ownerElement } = attribute2;
        if (ownerElement)
          ownerElement.removeAttributeNode(attribute2);
        setAttribute2(this, attribute2);
      }
      return previously;
    }
    toggleAttribute(name3, force) {
      if (this.hasAttribute(name3)) {
        if (!force)
          return this.removeAttribute(name3), !1;
        return !0;
      } else if (force || arguments.length === 1)
        return this.setAttribute(name3, ""), !0;
      return !1;
    }
    get shadowRoot() {
      if (shadowRoots.has(this)) {
        let { mode, shadowRoot } = shadowRoots.get(this);
        if (mode === "open")
          return shadowRoot;
      }
      return null;
    }
    attachShadow(init2) {
      if (shadowRoots.has(this))
        throw Error("operation not supported");
      let shadowRoot = new ShadowRoot(this);
      return shadowRoots.set(this, {
        mode: init2.mode,
        shadowRoot
      }), shadowRoot;
    }
    matches(selectors) {
      return matches(this, selectors);
    }
    closest(selectors) {
      let parentElement2 = this, matches2 = prepareMatch(parentElement2, selectors);
      while (parentElement2 && !matches2(parentElement2))
        parentElement2 = parentElement2.parentElement;
      return parentElement2;
    }
    insertAdjacentElement(position, element) {
      let { parentElement: parentElement2 } = this;
      switch (position) {
        case "beforebegin":
          if (parentElement2) {
            parentElement2.insertBefore(element, this);
            break;
          }
          return null;
        case "afterbegin":
          this.insertBefore(element, this.firstChild);
          break;
        case "beforeend":
          this.insertBefore(element, null);
          break;
        case "afterend":
          if (parentElement2) {
            parentElement2.insertBefore(element, this.nextSibling);
            break;
          }
          return null;
      }
      return element;
    }
    insertAdjacentHTML(position, html2) {
      this.insertAdjacentElement(position, htmlToFragment(this.ownerDocument, html2));
    }
    insertAdjacentText(position, text2) {
      let node2 = this.ownerDocument.createTextNode(text2);
      this.insertAdjacentElement(position, node2);
    }
    cloneNode(deep = !1) {
      let { ownerDocument, localName } = this, addNext = (next2) => {
        next2.parentNode = parentNode, knownAdjacent($next, next2), $next = next2;
      }, clone3 = create2(ownerDocument, this, localName), parentNode = clone3, $next = clone3, { [NEXT]: next, [END]: prev } = this;
      while (next !== prev && (deep || next.nodeType === ATTRIBUTE_NODE)) {
        switch (next.nodeType) {
          case NODE_END:
            knownAdjacent($next, parentNode[END]), $next = parentNode[END], parentNode = parentNode.parentNode;
            break;
          case ELEMENT_NODE: {
            let node2 = create2(ownerDocument, next, next.localName);
            addNext(node2), parentNode = node2;
            break;
          }
          case ATTRIBUTE_NODE: {
            let attr = next.cloneNode(deep);
            attr.ownerElement = parentNode, addNext(attr);
            break;
          }
          case TEXT_NODE:
          case COMMENT_NODE:
          case CDATA_SECTION_NODE:
            addNext(next.cloneNode(deep));
            break;
        }
        next = next[NEXT];
      }
      return knownAdjacent($next, clone3[END]), clone3;
    }
    toString() {
      let out = [], { [END]: end } = this, next = { [NEXT]: this }, isOpened = !1;
      do
        switch (next = next[NEXT], next.nodeType) {
          case ATTRIBUTE_NODE: {
            let attr = " " + next;
            switch (attr) {
              case " id":
              case " class":
              case " style":
                break;
              default:
                out.push(attr);
            }
            break;
          }
          case NODE_END: {
            let start = next[START];
            if (isOpened) {
              if ("ownerSVGElement" in start)
                out.push(" />");
              else if (isVoid(start))
                out.push(ignoreCase(start) ? ">" : " />");
              else
                out.push(`></${start.localName}>`);
              isOpened = !1;
            } else
              out.push(`</${start.localName}>`);
            break;
          }
          case ELEMENT_NODE:
            if (isOpened)
              out.push(">");
            if (next.toString !== this.toString)
              out.push(next.toString()), next = next[END], isOpened = !1;
            else
              out.push(`<${next.localName}`), isOpened = !0;
            break;
          case TEXT_NODE:
          case COMMENT_NODE:
          case CDATA_SECTION_NODE:
            out.push((isOpened ? ">" : "") + next), isOpened = !1;
            break;
        }
      while (next !== end);
      return out.join("");
    }
    toJSON() {
      let json2 = [];
      return elementAsJSON(this, json2), json2;
    }
    getAttributeNS(_, name3) {
      return this.getAttribute(name3);
    }
    getElementsByTagNameNS(_, name3) {
      return this.getElementsByTagName(name3);
    }
    hasAttributeNS(_, name3) {
      return this.hasAttribute(name3);
    }
    removeAttributeNS(_, name3) {
      this.removeAttribute(name3);
    }
    setAttributeNS(_, name3, value) {
      this.setAttribute(name3, value);
    }
    setAttributeNodeNS(attr) {
      return this.setAttributeNode(attr);
    }
  };
});
