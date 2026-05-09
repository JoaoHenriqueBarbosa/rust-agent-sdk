// var: init_document
var init_document = __esm(() => {
  init_constants10();
  init_symbols();
  init_facades();
  init_html_classes();
  init_mime();
  init_utils14();
  init_object2();
  init_non_element_parent_node();
  init_element2();
  init_attr();
  init_cdata_section();
  init_comment();
  init_custom_element_registry();
  init_custom_event();
  init_document_fragment();
  init_document_type();
  init_element();
  init_event();
  init_event_target();
  init_input_event2();
  init_image();
  init_mutation_observer();
  init_named_node_map();
  init_node_list();
  init_range();
  init_text();
  init_tree_walker();
  globalExports = assign({}, Facades, HTMLClasses, {
    CustomEvent,
    Event: GlobalEvent,
    EventTarget: DOMEventTarget,
    InputEvent: InputEvent2,
    NamedNodeMap,
    NodeList
  }), window2 = /* @__PURE__ */ new WeakMap;
  Document2 = class Document2 extends NonElementParentNode {
    constructor(type) {
      super(null, "#document", DOCUMENT_NODE);
      this[CUSTOM_ELEMENTS] = { active: !1, registry: null }, this[MUTATION_OBSERVER] = { active: !1, class: null }, this[MIME] = Mime[type], this[DOCTYPE] = null, this[DOM_PARSER] = null, this[GLOBALS] = null, this[IMAGE] = null, this[UPGRADE] = null;
    }
    get defaultView() {
      if (!window2.has(this))
        window2.set(this, new Proxy(globalThis, {
          set: (target, name3, value) => {
            switch (name3) {
              case "addEventListener":
              case "removeEventListener":
              case "dispatchEvent":
                this[EVENT_TARGET][name3] = value;
                break;
              default:
                target[name3] = value;
                break;
            }
            return !0;
          },
          get: (globalThis2, name3) => {
            switch (name3) {
              case "addEventListener":
              case "removeEventListener":
              case "dispatchEvent":
                if (!this[EVENT_TARGET]) {
                  let et2 = this[EVENT_TARGET] = new DOMEventTarget;
                  et2.dispatchEvent = et2.dispatchEvent.bind(et2), et2.addEventListener = et2.addEventListener.bind(et2), et2.removeEventListener = et2.removeEventListener.bind(et2);
                }
                return this[EVENT_TARGET][name3];
              case "document":
                return this;
              case "navigator":
                return {
                  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
                };
              case "window":
                return window2.get(this);
              case "customElements":
                if (!this[CUSTOM_ELEMENTS].registry)
                  this[CUSTOM_ELEMENTS] = new CustomElementRegistry(this);
                return this[CUSTOM_ELEMENTS];
              case "performance":
                return globalThis2.performance;
              case "DOMParser":
                return this[DOM_PARSER];
              case "Image":
                if (!this[IMAGE])
                  this[IMAGE] = ImageClass(this);
                return this[IMAGE];
              case "MutationObserver":
                if (!this[MUTATION_OBSERVER].class)
                  this[MUTATION_OBSERVER] = new MutationObserverClass(this);
                return this[MUTATION_OBSERVER].class;
            }
            return this[GLOBALS] && this[GLOBALS][name3] || globalExports[name3] || globalThis2[name3];
          }
        }));
      return window2.get(this);
    }
    get doctype() {
      let docType = this[DOCTYPE];
      if (docType)
        return docType;
      let { firstChild } = this;
      if (firstChild && firstChild.nodeType === DOCUMENT_TYPE_NODE)
        return this[DOCTYPE] = firstChild;
      return null;
    }
    set doctype(value) {
      if (/^([a-z:]+)(\s+system|\s+public(\s+"([^"]+)")?)?(\s+"([^"]+)")?/i.test(value)) {
        let { $1: name3, $4: publicId, $6: systemId } = RegExp;
        this[DOCTYPE] = new DocumentType(this, name3, publicId, systemId), knownSiblings(this, this[DOCTYPE], this[NEXT]);
      }
    }
    get documentElement() {
      return this.firstElementChild;
    }
    get isConnected() {
      return !0;
    }
    _getParent() {
      return this[EVENT_TARGET];
    }
    createAttribute(name3) {
      return new Attr(this, name3);
    }
    createCDATASection(data) {
      return new CDATASection(this, data);
    }
    createComment(textContent2) {
      return new Comment3(this, textContent2);
    }
    createDocumentFragment() {
      return new DocumentFragment(this);
    }
    createDocumentType(name3, publicId, systemId) {
      return new DocumentType(this, name3, publicId, systemId);
    }
    createElement(localName) {
      return new Element2(this, localName);
    }
    createRange() {
      let range = new Range;
      return range.commonAncestorContainer = this, range;
    }
    createTextNode(textContent2) {
      return new Text5(this, textContent2);
    }
    createTreeWalker(root2, whatToShow = -1) {
      return new TreeWalker(root2, whatToShow);
    }
    createNodeIterator(root2, whatToShow = -1) {
      return this.createTreeWalker(root2, whatToShow);
    }
    createEvent(name3) {
      let event = create(name3 === "Event" ? new GlobalEvent("") : new CustomEvent(""));
      return event.initEvent = event.initCustomEvent = (type, canBubble = !1, cancelable = !1, detail) => {
        event.bubbles = !!canBubble, defineProperties(event, {
          type: { value: type },
          canBubble: { value: canBubble },
          cancelable: { value: cancelable },
          detail: { value: detail }
        });
      }, event;
    }
    cloneNode(deep = !1) {
      let {
        constructor,
        [CUSTOM_ELEMENTS]: customElements2,
        [DOCTYPE]: doctype
      } = this, document2 = new constructor;
      if (document2[CUSTOM_ELEMENTS] = customElements2, deep) {
        let end = document2[END], { childNodes } = this;
        for (let { length } = childNodes, i5 = 0;i5 < length; i5++)
          document2.insertBefore(childNodes[i5].cloneNode(!0), end);
        if (doctype)
          document2[DOCTYPE] = childNodes[0];
      }
      return document2;
    }
    importNode(externalNode) {
      let deep = 1 < arguments.length && !!arguments[1], node2 = externalNode.cloneNode(deep), { [CUSTOM_ELEMENTS]: customElements2 } = this, { active } = customElements2, upgrade = (element) => {
        let { ownerDocument, nodeType } = element;
        if (element.ownerDocument = this, active && ownerDocument !== this && nodeType === ELEMENT_NODE)
          customElements2.upgrade(element);
      };
      if (upgrade(node2), deep)
        switch (node2.nodeType) {
          case ELEMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE: {
            let { [NEXT]: next, [END]: end } = node2;
            while (next !== end) {
              if (next.nodeType === ELEMENT_NODE)
                upgrade(next);
              next = next[NEXT];
            }
            break;
          }
        }
      return node2;
    }
    toString() {
      return this.childNodes.join("");
    }
    querySelector(selectors) {
      return query2(super.querySelector, this, selectors);
    }
    querySelectorAll(selectors) {
      return query2(super.querySelectorAll, this, selectors);
    }
    getElementsByTagNameNS(_, name3) {
      return this.getElementsByTagName(name3);
    }
    createAttributeNS(_, name3) {
      return this.createAttribute(name3);
    }
    createElementNS(nsp, localName, options2) {
      return nsp === SVG_NAMESPACE ? new SVGElement(this, localName, null) : this.createElement(localName, options2);
    }
  };
  setPrototypeOf(globalExports.Document = function() {
    illegalConstructor();
  }, Document2).prototype = Document2.prototype;
});
