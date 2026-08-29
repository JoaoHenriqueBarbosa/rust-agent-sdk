// var: require_Document2
var require_Document2 = __commonJS((exports, module) => {
  module.exports = Document5;
  var Node5 = require_Node2(), NodeList2 = require_NodeList(), ContainerNode = require_ContainerNode(), Element4 = require_Element(), Text7 = require_Text(), Comment5 = require_Comment(), Event3 = require_Event(), DocumentFragment3 = require_DocumentFragment(), ProcessingInstruction2 = require_ProcessingInstruction(), DOMImplementation = require_DOMImplementation(), TreeWalker2 = require_TreeWalker(), NodeIterator = require_NodeIterator(), NodeFilter2 = require_NodeFilter(), URL4 = require_URL(), select2 = require_select(), events2 = require_events2(), xml = require_xmlnames(), html2 = require_htmlelts(), svg = require_svg(), utils = require_utils12(), MUTATE = require_MutationConstants(), NAMESPACE = utils.NAMESPACE, isApiWritable = require_config().isApiWritable;
  function Document5(isHTML, address) {
    ContainerNode.call(this), this.nodeType = Node5.DOCUMENT_NODE, this.isHTML = isHTML, this._address = address || "about:blank", this.readyState = "loading", this.implementation = new DOMImplementation(this), this.ownerDocument = null, this._contentType = isHTML ? "text/html" : "application/xml", this.doctype = null, this.documentElement = null, this._templateDocCache = null, this._nodeIterators = null, this._nid = 1, this._nextnid = 2, this._nodes = [null, this], this.byId = Object.create(null), this.modclock = 0;
  }
  var supportedEvents = {
    event: "Event",
    customevent: "CustomEvent",
    uievent: "UIEvent",
    mouseevent: "MouseEvent"
  }, replacementEvent = {
    events: "event",
    htmlevents: "event",
    mouseevents: "mouseevent",
    mutationevents: "mutationevent",
    uievents: "uievent"
  }, mirrorAttr = function(f, name3, defaultValue) {
    return {
      get: function() {
        var o5 = f.call(this);
        if (o5)
          return o5[name3];
        return defaultValue;
      },
      set: function(value) {
        var o5 = f.call(this);
        if (o5)
          o5[name3] = value;
      }
    };
  };
  function validateAndExtract(namespace, qualifiedName) {
    var prefix, localName, pos;
    if (namespace === "")
      namespace = null;
    if (!xml.isValidQName(qualifiedName))
      utils.InvalidCharacterError();
    if (prefix = null, localName = qualifiedName, pos = qualifiedName.indexOf(":"), pos >= 0)
      prefix = qualifiedName.substring(0, pos), localName = qualifiedName.substring(pos + 1);
    if (prefix !== null && namespace === null)
      utils.NamespaceError();
    if (prefix === "xml" && namespace !== NAMESPACE.XML)
      utils.NamespaceError();
    if ((prefix === "xmlns" || qualifiedName === "xmlns") && namespace !== NAMESPACE.XMLNS)
      utils.NamespaceError();
    if (namespace === NAMESPACE.XMLNS && !(prefix === "xmlns" || qualifiedName === "xmlns"))
      utils.NamespaceError();
    return { namespace, prefix, localName };
  }
  Document5.prototype = Object.create(ContainerNode.prototype, {
    _setMutationHandler: { value: function(handler4) {
      this.mutationHandler = handler4;
    } },
    _dispatchRendererEvent: { value: function(targetNid, type, details) {
      var target = this._nodes[targetNid];
      if (!target)
        return;
      target._dispatchEvent(new Event3(type, details), !0);
    } },
    nodeName: { value: "#document" },
    nodeValue: {
      get: function() {
        return null;
      },
      set: function() {}
    },
    documentURI: { get: function() {
      return this._address;
    }, set: utils.nyi },
    compatMode: { get: function() {
      return this._quirks ? "BackCompat" : "CSS1Compat";
    } },
    createTextNode: { value: function(data) {
      return new Text7(this, String(data));
    } },
    createComment: { value: function(data) {
      return new Comment5(this, data);
    } },
    createDocumentFragment: { value: function() {
      return new DocumentFragment3(this);
    } },
    createProcessingInstruction: { value: function(target, data) {
      if (!xml.isValidName(target) || data.indexOf("?>") !== -1)
        utils.InvalidCharacterError();
      return new ProcessingInstruction2(this, target, data);
    } },
    createAttribute: { value: function(localName) {
      if (localName = String(localName), !xml.isValidName(localName))
        utils.InvalidCharacterError();
      if (this.isHTML)
        localName = utils.toASCIILowerCase(localName);
      return new Element4._Attr(null, localName, null, null, "");
    } },
    createAttributeNS: { value: function(namespace, qualifiedName) {
      namespace = namespace === null || namespace === void 0 || namespace === "" ? null : String(namespace), qualifiedName = String(qualifiedName);
      var ve = validateAndExtract(namespace, qualifiedName);
      return new Element4._Attr(null, ve.localName, ve.prefix, ve.namespace, "");
    } },
    createElement: { value: function(localName) {
      if (localName = String(localName), !xml.isValidName(localName))
        utils.InvalidCharacterError();
      if (this.isHTML) {
        if (/[A-Z]/.test(localName))
          localName = utils.toASCIILowerCase(localName);
        return html2.createElement(this, localName, null);
      } else if (this.contentType === "application/xhtml+xml")
        return html2.createElement(this, localName, null);
      else
        return new Element4(this, localName, null, null);
    }, writable: isApiWritable },
    createElementNS: { value: function(namespace, qualifiedName) {
      namespace = namespace === null || namespace === void 0 || namespace === "" ? null : String(namespace), qualifiedName = String(qualifiedName);
      var ve = validateAndExtract(namespace, qualifiedName);
      return this._createElementNS(ve.localName, ve.namespace, ve.prefix);
    }, writable: isApiWritable },
    _createElementNS: { value: function(localName, namespace, prefix) {
      if (namespace === NAMESPACE.HTML)
        return html2.createElement(this, localName, prefix);
      else if (namespace === NAMESPACE.SVG)
        return svg.createElement(this, localName, prefix);
      return new Element4(this, localName, namespace, prefix);
    } },
    createEvent: { value: function(interfaceName) {
      interfaceName = interfaceName.toLowerCase();
      var name3 = replacementEvent[interfaceName] || interfaceName, constructor = events2[supportedEvents[name3]];
      if (constructor) {
        var e = new constructor;
        return e._initialized = !1, e;
      } else
        utils.NotSupportedError();
    } },
    createTreeWalker: { value: function(root3, whatToShow, filter3) {
      if (!root3)
        throw TypeError("root argument is required");
      if (!(root3 instanceof Node5))
        throw TypeError("root not a node");
      return whatToShow = whatToShow === void 0 ? NodeFilter2.SHOW_ALL : +whatToShow, filter3 = filter3 === void 0 ? null : filter3, new TreeWalker2(root3, whatToShow, filter3);
    } },
    createNodeIterator: { value: function(root3, whatToShow, filter3) {
      if (!root3)
        throw TypeError("root argument is required");
      if (!(root3 instanceof Node5))
        throw TypeError("root not a node");
      return whatToShow = whatToShow === void 0 ? NodeFilter2.SHOW_ALL : +whatToShow, filter3 = filter3 === void 0 ? null : filter3, new NodeIterator(root3, whatToShow, filter3);
    } },
    _attachNodeIterator: { value: function(ni) {
      if (!this._nodeIterators)
        this._nodeIterators = [];
      this._nodeIterators.push(ni);
    } },
    _detachNodeIterator: { value: function(ni) {
      var idx = this._nodeIterators.indexOf(ni);
      this._nodeIterators.splice(idx, 1);
    } },
    _preremoveNodeIterators: { value: function(toBeRemoved) {
      if (this._nodeIterators)
        this._nodeIterators.forEach(function(ni) {
          ni._preremove(toBeRemoved);
        });
    } },
    _updateDocTypeElement: { value: function() {
      this.doctype = this.documentElement = null;
      for (var kid = this.firstChild;kid !== null; kid = kid.nextSibling)
        if (kid.nodeType === Node5.DOCUMENT_TYPE_NODE)
          this.doctype = kid;
        else if (kid.nodeType === Node5.ELEMENT_NODE)
          this.documentElement = kid;
    } },
    insertBefore: { value: function(child, refChild) {
      return Node5.prototype.insertBefore.call(this, child, refChild), this._updateDocTypeElement(), child;
    } },
    replaceChild: { value: function(node2, child) {
      return Node5.prototype.replaceChild.call(this, node2, child), this._updateDocTypeElement(), child;
    } },
    removeChild: { value: function(child) {
      return Node5.prototype.removeChild.call(this, child), this._updateDocTypeElement(), child;
    } },
    getElementById: { value: function(id) {
      var n5 = this.byId[id];
      if (!n5)
        return null;
      if (n5 instanceof MultiId)
        return n5.getFirst();
      return n5;
    } },
    _hasMultipleElementsWithId: { value: function(id) {
      return this.byId[id] instanceof MultiId;
    } },
    getElementsByName: { value: Element4.prototype.getElementsByName },
    getElementsByTagName: { value: Element4.prototype.getElementsByTagName },
    getElementsByTagNameNS: { value: Element4.prototype.getElementsByTagNameNS },
    getElementsByClassName: { value: Element4.prototype.getElementsByClassName },
    adoptNode: { value: function(node2) {
      if (node2.nodeType === Node5.DOCUMENT_NODE)
        utils.NotSupportedError();
      if (node2.nodeType === Node5.ATTRIBUTE_NODE)
        return node2;
      if (node2.parentNode)
        node2.parentNode.removeChild(node2);
      if (node2.ownerDocument !== this)
        recursivelySetOwner(node2, this);
      return node2;
    } },
    importNode: { value: function(node2, deep) {
      return this.adoptNode(node2.cloneNode(deep));
    }, writable: isApiWritable },
    origin: { get: function() {
      return null;
    } },
    characterSet: { get: function() {
      return "UTF-8";
    } },
    contentType: { get: function() {
      return this._contentType;
    } },
    URL: { get: function() {
      return this._address;
    } },
    domain: { get: utils.nyi, set: utils.nyi },
    referrer: { get: utils.nyi },
    cookie: { get: utils.nyi, set: utils.nyi },
    lastModified: { get: utils.nyi },
    location: {
      get: function() {
        return this.defaultView ? this.defaultView.location : null;
      },
      set: utils.nyi
    },
    _titleElement: {
      get: function() {
        return this.getElementsByTagName("title").item(0) || null;
      }
    },
    title: {
      get: function() {
        var elt = this._titleElement, value = elt ? elt.textContent : "";
        return value.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
      },
      set: function(value) {
        var elt = this._titleElement, head = this.head;
        if (!elt && !head)
          return;
        if (!elt)
          elt = this.createElement("title"), head.appendChild(elt);
        elt.textContent = value;
      }
    },
    dir: mirrorAttr(function() {
      var htmlElement = this.documentElement;
      if (htmlElement && htmlElement.tagName === "HTML")
        return htmlElement;
    }, "dir", ""),
    fgColor: mirrorAttr(function() {
      return this.body;
    }, "text", ""),
    linkColor: mirrorAttr(function() {
      return this.body;
    }, "link", ""),
    vlinkColor: mirrorAttr(function() {
      return this.body;
    }, "vLink", ""),
    alinkColor: mirrorAttr(function() {
      return this.body;
    }, "aLink", ""),
    bgColor: mirrorAttr(function() {
      return this.body;
    }, "bgColor", ""),
    charset: { get: function() {
      return this.characterSet;
    } },
    inputEncoding: { get: function() {
      return this.characterSet;
    } },
    scrollingElement: {
      get: function() {
        return this._quirks ? this.body : this.documentElement;
      }
    },
    body: {
      get: function() {
        return namedHTMLChild(this.documentElement, "body");
      },
      set: utils.nyi
    },
    head: { get: function() {
      return namedHTMLChild(this.documentElement, "head");
    } },
    images: { get: utils.nyi },
    embeds: { get: utils.nyi },
    plugins: { get: utils.nyi },
    links: { get: utils.nyi },
    forms: { get: utils.nyi },
    scripts: { get: utils.nyi },
    applets: { get: function() {
      return [];
    } },
    activeElement: { get: function() {
      return null;
    } },
    innerHTML: {
      get: function() {
        return this.serialize();
      },
      set: utils.nyi
    },
    outerHTML: {
      get: function() {
        return this.serialize();
      },
      set: utils.nyi
    },
    write: { value: function(args) {
      if (!this.isHTML)
        utils.InvalidStateError();
      if (!this._parser)
        return;
      if (!this._parser)
        ;
      var s2 = arguments.join("");
      this._parser.parse(s2);
    } },
    writeln: { value: function(args) {
      this.write(Array.prototype.join.call(arguments, "") + `
`);
    } },
    open: { value: function() {
      this.documentElement = null;
    } },
    close: { value: function() {
      if (this.readyState = "interactive", this._dispatchEvent(new Event3("readystatechange"), !0), this._dispatchEvent(new Event3("DOMContentLoaded"), !0), this.readyState = "complete", this._dispatchEvent(new Event3("readystatechange"), !0), this.defaultView)
        this.defaultView._dispatchEvent(new Event3("load"), !0);
    } },
    clone: { value: function() {
      var d = new Document5(this.isHTML, this._address);
      return d._quirks = this._quirks, d._contentType = this._contentType, d;
    } },
    cloneNode: { value: function(deep) {
      var clone3 = Node5.prototype.cloneNode.call(this, !1);
      if (deep)
        for (var kid = this.firstChild;kid !== null; kid = kid.nextSibling)
          clone3._appendChild(clone3.importNode(kid, !0));
      return clone3._updateDocTypeElement(), clone3;
    } },
    isEqual: { value: function(n5) {
      return !0;
    } },
    mutateValue: { value: function(node2) {
      if (this.mutationHandler)
        this.mutationHandler({
          type: MUTATE.VALUE,
          target: node2,
          data: node2.data
        });
    } },
    mutateAttr: { value: function(attr, oldval) {
      if (this.mutationHandler)
        this.mutationHandler({
          type: MUTATE.ATTR,
          target: attr.ownerElement,
          attr
        });
    } },
    mutateRemoveAttr: { value: function(attr) {
      if (this.mutationHandler)
        this.mutationHandler({
          type: MUTATE.REMOVE_ATTR,
          target: attr.ownerElement,
          attr
        });
    } },
    mutateRemove: { value: function(node2) {
      if (this.mutationHandler)
        this.mutationHandler({
          type: MUTATE.REMOVE,
          target: node2.parentNode,
          node: node2
        });
      recursivelyUproot(node2);
    } },
    mutateInsert: { value: function(node2) {
      if (recursivelyRoot(node2), this.mutationHandler)
        this.mutationHandler({
          type: MUTATE.INSERT,
          target: node2.parentNode,
          node: node2
        });
    } },
    mutateMove: { value: function(node2) {
      if (this.mutationHandler)
        this.mutationHandler({
          type: MUTATE.MOVE,
          target: node2
        });
    } },
    addId: { value: function(id, n5) {
      var val = this.byId[id];
      if (!val)
        this.byId[id] = n5;
      else {
        if (!(val instanceof MultiId))
          val = new MultiId(val), this.byId[id] = val;
        val.add(n5);
      }
    } },
    delId: { value: function(id, n5) {
      var val = this.byId[id];
      if (utils.assert(val), val instanceof MultiId) {
        if (val.del(n5), val.length === 1)
          this.byId[id] = val.downgrade();
      } else
        this.byId[id] = void 0;
    } },
    _resolve: { value: function(href) {
      return new URL4(this._documentBaseURL).resolve(href);
    } },
    _documentBaseURL: { get: function() {
      var url3 = this._address;
      if (url3 === "about:blank")
        url3 = "/";
      var base2 = this.querySelector("base[href]");
      if (base2)
        return new URL4(url3).resolve(base2.getAttribute("href"));
      return url3;
    } },
    _templateDoc: { get: function() {
      if (!this._templateDocCache) {
        var newDoc = new Document5(this.isHTML, this._address);
        this._templateDocCache = newDoc._templateDocCache = newDoc;
      }
      return this._templateDocCache;
    } },
    querySelector: { value: function(selector) {
      return select2(selector, this)[0];
    } },
    querySelectorAll: { value: function(selector) {
      var nodes = select2(selector, this);
      return nodes.item ? nodes : new NodeList2(nodes);
    } }
  });
  var eventHandlerTypes = [
    "abort",
    "canplay",
    "canplaythrough",
    "change",
    "click",
    "contextmenu",
    "cuechange",
    "dblclick",
    "drag",
    "dragend",
    "dragenter",
    "dragleave",
    "dragover",
    "dragstart",
    "drop",
    "durationchange",
    "emptied",
    "ended",
    "input",
    "invalid",
    "keydown",
    "keypress",
    "keyup",
    "loadeddata",
    "loadedmetadata",
    "loadstart",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "mousewheel",
    "pause",
    "play",
    "playing",
    "progress",
    "ratechange",
    "readystatechange",
    "reset",
    "seeked",
    "seeking",
    "select",
    "show",
    "stalled",
    "submit",
    "suspend",
    "timeupdate",
    "volumechange",
    "waiting",
    "blur",
    "error",
    "focus",
    "load",
    "scroll"
  ];
  eventHandlerTypes.forEach(function(type) {
    Object.defineProperty(Document5.prototype, "on" + type, {
      get: function() {
        return this._getEventHandler(type);
      },
      set: function(v2) {
        this._setEventHandler(type, v2);
      }
    });
  });
  function namedHTMLChild(parent2, name3) {
    if (parent2 && parent2.isHTML) {
      for (var kid = parent2.firstChild;kid !== null; kid = kid.nextSibling)
        if (kid.nodeType === Node5.ELEMENT_NODE && kid.localName === name3 && kid.namespaceURI === NAMESPACE.HTML)
          return kid;
    }
    return null;
  }
  function root2(n5) {
    if (n5._nid = n5.ownerDocument._nextnid++, n5.ownerDocument._nodes[n5._nid] = n5, n5.nodeType === Node5.ELEMENT_NODE) {
      var id = n5.getAttribute("id");
      if (id)
        n5.ownerDocument.addId(id, n5);
      if (n5._roothook)
        n5._roothook();
    }
  }
  function uproot(n5) {
    if (n5.nodeType === Node5.ELEMENT_NODE) {
      var id = n5.getAttribute("id");
      if (id)
        n5.ownerDocument.delId(id, n5);
    }
    n5.ownerDocument._nodes[n5._nid] = void 0, n5._nid = void 0;
  }
  function recursivelyRoot(node2) {
    if (root2(node2), node2.nodeType === Node5.ELEMENT_NODE)
      for (var kid = node2.firstChild;kid !== null; kid = kid.nextSibling)
        recursivelyRoot(kid);
  }
  function recursivelyUproot(node2) {
    uproot(node2);
    for (var kid = node2.firstChild;kid !== null; kid = kid.nextSibling)
      recursivelyUproot(kid);
  }
  function recursivelySetOwner(node2, owner) {
    if (node2.ownerDocument = owner, node2._lastModTime = void 0, Object.prototype.hasOwnProperty.call(node2, "_tagName"))
      node2._tagName = void 0;
    for (var kid = node2.firstChild;kid !== null; kid = kid.nextSibling)
      recursivelySetOwner(kid, owner);
  }
  function MultiId(node2) {
    this.nodes = Object.create(null), this.nodes[node2._nid] = node2, this.length = 1, this.firstNode = void 0;
  }
  MultiId.prototype.add = function(node2) {
    if (!this.nodes[node2._nid])
      this.nodes[node2._nid] = node2, this.length++, this.firstNode = void 0;
  };
  MultiId.prototype.del = function(node2) {
    if (this.nodes[node2._nid])
      delete this.nodes[node2._nid], this.length--, this.firstNode = void 0;
  };
  MultiId.prototype.getFirst = function() {
    if (!this.firstNode) {
      var nid;
      for (nid in this.nodes)
        if (this.firstNode === void 0 || this.firstNode.compareDocumentPosition(this.nodes[nid]) & Node5.DOCUMENT_POSITION_PRECEDING)
          this.firstNode = this.nodes[nid];
    }
    return this.firstNode;
  };
  MultiId.prototype.downgrade = function() {
    if (this.length === 1) {
      var nid;
      for (nid in this.nodes)
        return this.nodes[nid];
    }
    return this;
  };
});
