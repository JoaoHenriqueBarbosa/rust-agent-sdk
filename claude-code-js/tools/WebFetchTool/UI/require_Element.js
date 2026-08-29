// var: require_Element
var require_Element = __commonJS((exports, module) => {
  module.exports = Element4;
  var xml = require_xmlnames(), utils = require_utils12(), NAMESPACE = utils.NAMESPACE, attributes2 = require_attributes2(), Node5 = require_Node2(), NodeList2 = require_NodeList(), NodeUtils = require_NodeUtils(), FilteredElementList = require_FilteredElementList(), DOMException2 = require_DOMException(), DOMTokenList2 = require_DOMTokenList(), select2 = require_select(), ContainerNode = require_ContainerNode(), ChildNode = require_ChildNode(), NonDocumentTypeChildNode = require_NonDocumentTypeChildNode(), NamedNodeMap2 = require_NamedNodeMap(), uppercaseCache = Object.create(null);
  function Element4(doc2, localName, namespaceURI, prefix) {
    ContainerNode.call(this), this.nodeType = Node5.ELEMENT_NODE, this.ownerDocument = doc2, this.localName = localName, this.namespaceURI = namespaceURI, this.prefix = prefix, this._tagName = void 0, this._attrsByQName = Object.create(null), this._attrsByLName = Object.create(null), this._attrKeys = [];
  }
  function recursiveGetText(node2, a2) {
    if (node2.nodeType === Node5.TEXT_NODE)
      a2.push(node2._data);
    else
      for (var i5 = 0, n5 = node2.childNodes.length;i5 < n5; i5++)
        recursiveGetText(node2.childNodes[i5], a2);
  }
  Element4.prototype = Object.create(ContainerNode.prototype, {
    isHTML: { get: function() {
      return this.namespaceURI === NAMESPACE.HTML && this.ownerDocument.isHTML;
    } },
    tagName: { get: function() {
      if (this._tagName === void 0) {
        var tn;
        if (this.prefix === null)
          tn = this.localName;
        else
          tn = this.prefix + ":" + this.localName;
        if (this.isHTML) {
          var up = uppercaseCache[tn];
          if (!up)
            uppercaseCache[tn] = up = utils.toASCIIUpperCase(tn);
          tn = up;
        }
        this._tagName = tn;
      }
      return this._tagName;
    } },
    nodeName: { get: function() {
      return this.tagName;
    } },
    nodeValue: {
      get: function() {
        return null;
      },
      set: function() {}
    },
    textContent: {
      get: function() {
        var strings = [];
        return recursiveGetText(this, strings), strings.join("");
      },
      set: function(newtext) {
        if (this.removeChildren(), newtext !== null && newtext !== void 0 && newtext !== "")
          this._appendChild(this.ownerDocument.createTextNode(newtext));
      }
    },
    innerText: {
      get: function() {
        var strings = [];
        return recursiveGetText(this, strings), strings.join("").replace(/[ \t\n\f\r]+/g, " ").trim();
      },
      set: function(newtext) {
        if (this.removeChildren(), newtext !== null && newtext !== void 0 && newtext !== "")
          this._appendChild(this.ownerDocument.createTextNode(newtext));
      }
    },
    innerHTML: {
      get: function() {
        return this.serialize();
      },
      set: utils.nyi
    },
    outerHTML: {
      get: function() {
        return NodeUtils.serializeOne(this, { nodeType: 0 });
      },
      set: function(v2) {
        var document2 = this.ownerDocument, parent2 = this.parentNode;
        if (parent2 === null)
          return;
        if (parent2.nodeType === Node5.DOCUMENT_NODE)
          utils.NoModificationAllowedError();
        if (parent2.nodeType === Node5.DOCUMENT_FRAGMENT_NODE)
          parent2 = parent2.ownerDocument.createElement("body");
        var parser2 = document2.implementation.mozHTMLParser(document2._address, parent2);
        parser2.parse(v2 === null ? "" : String(v2), !0), this.replaceWith(parser2._asDocumentFragment());
      }
    },
    _insertAdjacent: { value: function(position, node2) {
      var first = !1;
      switch (position) {
        case "beforebegin":
          first = !0;
        case "afterend":
          var parent2 = this.parentNode;
          if (parent2 === null)
            return null;
          return parent2.insertBefore(node2, first ? this : this.nextSibling);
        case "afterbegin":
          first = !0;
        case "beforeend":
          return this.insertBefore(node2, first ? this.firstChild : null);
        default:
          return utils.SyntaxError();
      }
    } },
    insertAdjacentElement: { value: function(position, element) {
      if (element.nodeType !== Node5.ELEMENT_NODE)
        throw TypeError("not an element");
      return position = utils.toASCIILowerCase(String(position)), this._insertAdjacent(position, element);
    } },
    insertAdjacentText: { value: function(position, data) {
      var textNode = this.ownerDocument.createTextNode(data);
      position = utils.toASCIILowerCase(String(position)), this._insertAdjacent(position, textNode);
    } },
    insertAdjacentHTML: { value: function(position, text2) {
      position = utils.toASCIILowerCase(String(position)), text2 = String(text2);
      var context6;
      switch (position) {
        case "beforebegin":
        case "afterend":
          if (context6 = this.parentNode, context6 === null || context6.nodeType === Node5.DOCUMENT_NODE)
            utils.NoModificationAllowedError();
          break;
        case "afterbegin":
        case "beforeend":
          context6 = this;
          break;
        default:
          utils.SyntaxError();
      }
      if (!(context6 instanceof Element4) || context6.ownerDocument.isHTML && context6.localName === "html" && context6.namespaceURI === NAMESPACE.HTML)
        context6 = context6.ownerDocument.createElementNS(NAMESPACE.HTML, "body");
      var parser2 = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, context6);
      parser2.parse(text2, !0), this._insertAdjacent(position, parser2._asDocumentFragment());
    } },
    children: { get: function() {
      if (!this._children)
        this._children = new ChildrenCollection(this);
      return this._children;
    } },
    attributes: { get: function() {
      if (!this._attributes)
        this._attributes = new AttributesArray(this);
      return this._attributes;
    } },
    firstElementChild: { get: function() {
      for (var kid = this.firstChild;kid !== null; kid = kid.nextSibling)
        if (kid.nodeType === Node5.ELEMENT_NODE)
          return kid;
      return null;
    } },
    lastElementChild: { get: function() {
      for (var kid = this.lastChild;kid !== null; kid = kid.previousSibling)
        if (kid.nodeType === Node5.ELEMENT_NODE)
          return kid;
      return null;
    } },
    childElementCount: { get: function() {
      return this.children.length;
    } },
    nextElement: { value: function(root2) {
      if (!root2)
        root2 = this.ownerDocument.documentElement;
      var next = this.firstElementChild;
      if (!next) {
        if (this === root2)
          return null;
        next = this.nextElementSibling;
      }
      if (next)
        return next;
      for (var parent2 = this.parentElement;parent2 && parent2 !== root2; parent2 = parent2.parentElement)
        if (next = parent2.nextElementSibling, next)
          return next;
      return null;
    } },
    getElementsByTagName: { value: function(lname) {
      var filter3;
      if (!lname)
        return new NodeList2;
      if (lname === "*")
        filter3 = function() {
          return !0;
        };
      else if (this.isHTML)
        filter3 = htmlLocalNameElementFilter(lname);
      else
        filter3 = localNameElementFilter(lname);
      return new FilteredElementList(this, filter3);
    } },
    getElementsByTagNameNS: { value: function(ns, lname) {
      var filter3;
      if (ns === "*" && lname === "*")
        filter3 = function() {
          return !0;
        };
      else if (ns === "*")
        filter3 = localNameElementFilter(lname);
      else if (lname === "*")
        filter3 = namespaceElementFilter(ns);
      else
        filter3 = namespaceLocalNameElementFilter(ns, lname);
      return new FilteredElementList(this, filter3);
    } },
    getElementsByClassName: { value: function(names) {
      if (names = String(names).trim(), names === "") {
        var result = new NodeList2;
        return result;
      }
      return names = names.split(/[ \t\r\n\f]+/), new FilteredElementList(this, classNamesElementFilter(names));
    } },
    getElementsByName: { value: function(name3) {
      return new FilteredElementList(this, elementNameFilter(String(name3)));
    } },
    clone: { value: function() {
      var e;
      if (this.namespaceURI !== NAMESPACE.HTML || this.prefix || !this.ownerDocument.isHTML)
        e = this.ownerDocument.createElementNS(this.namespaceURI, this.prefix !== null ? this.prefix + ":" + this.localName : this.localName);
      else
        e = this.ownerDocument.createElement(this.localName);
      for (var i5 = 0, n5 = this._attrKeys.length;i5 < n5; i5++) {
        var lname = this._attrKeys[i5], a2 = this._attrsByLName[lname], b = a2.cloneNode();
        b._setOwnerElement(e), e._attrsByLName[lname] = b, e._addQName(b);
      }
      return e._attrKeys = this._attrKeys.concat(), e;
    } },
    isEqual: { value: function(that) {
      if (this.localName !== that.localName || this.namespaceURI !== that.namespaceURI || this.prefix !== that.prefix || this._numattrs !== that._numattrs)
        return !1;
      for (var i5 = 0, n5 = this._numattrs;i5 < n5; i5++) {
        var a2 = this._attr(i5);
        if (!that.hasAttributeNS(a2.namespaceURI, a2.localName))
          return !1;
        if (that.getAttributeNS(a2.namespaceURI, a2.localName) !== a2.value)
          return !1;
      }
      return !0;
    } },
    _lookupNamespacePrefix: { value: function(ns, originalElement) {
      if (this.namespaceURI && this.namespaceURI === ns && this.prefix !== null && originalElement.lookupNamespaceURI(this.prefix) === ns)
        return this.prefix;
      for (var i5 = 0, n5 = this._numattrs;i5 < n5; i5++) {
        var a2 = this._attr(i5);
        if (a2.prefix === "xmlns" && a2.value === ns && originalElement.lookupNamespaceURI(a2.localName) === ns)
          return a2.localName;
      }
      var parent2 = this.parentElement;
      return parent2 ? parent2._lookupNamespacePrefix(ns, originalElement) : null;
    } },
    lookupNamespaceURI: { value: function(prefix) {
      if (prefix === "" || prefix === void 0)
        prefix = null;
      if (this.namespaceURI !== null && this.prefix === prefix)
        return this.namespaceURI;
      for (var i5 = 0, n5 = this._numattrs;i5 < n5; i5++) {
        var a2 = this._attr(i5);
        if (a2.namespaceURI === NAMESPACE.XMLNS) {
          if (a2.prefix === "xmlns" && a2.localName === prefix || prefix === null && a2.prefix === null && a2.localName === "xmlns")
            return a2.value || null;
        }
      }
      var parent2 = this.parentElement;
      return parent2 ? parent2.lookupNamespaceURI(prefix) : null;
    } },
    getAttribute: { value: function(qname) {
      var attr = this.getAttributeNode(qname);
      return attr ? attr.value : null;
    } },
    getAttributeNS: { value: function(ns, lname) {
      var attr = this.getAttributeNodeNS(ns, lname);
      return attr ? attr.value : null;
    } },
    getAttributeNode: { value: function(qname) {
      if (qname = String(qname), /[A-Z]/.test(qname) && this.isHTML)
        qname = utils.toASCIILowerCase(qname);
      var attr = this._attrsByQName[qname];
      if (!attr)
        return null;
      if (Array.isArray(attr))
        attr = attr[0];
      return attr;
    } },
    getAttributeNodeNS: { value: function(ns, lname) {
      ns = ns === void 0 || ns === null ? "" : String(ns), lname = String(lname);
      var attr = this._attrsByLName[ns + "|" + lname];
      return attr ? attr : null;
    } },
    hasAttribute: { value: function(qname) {
      if (qname = String(qname), /[A-Z]/.test(qname) && this.isHTML)
        qname = utils.toASCIILowerCase(qname);
      return this._attrsByQName[qname] !== void 0;
    } },
    hasAttributeNS: { value: function(ns, lname) {
      ns = ns === void 0 || ns === null ? "" : String(ns), lname = String(lname);
      var key3 = ns + "|" + lname;
      return this._attrsByLName[key3] !== void 0;
    } },
    hasAttributes: { value: function() {
      return this._numattrs > 0;
    } },
    toggleAttribute: { value: function(qname, force) {
      if (qname = String(qname), !xml.isValidName(qname))
        utils.InvalidCharacterError();
      if (/[A-Z]/.test(qname) && this.isHTML)
        qname = utils.toASCIILowerCase(qname);
      var a2 = this._attrsByQName[qname];
      if (a2 === void 0) {
        if (force === void 0 || force === !0)
          return this._setAttribute(qname, ""), !0;
        return !1;
      } else {
        if (force === void 0 || force === !1)
          return this.removeAttribute(qname), !1;
        return !0;
      }
    } },
    _setAttribute: { value: function(qname, value) {
      var attr = this._attrsByQName[qname], isnew;
      if (!attr)
        attr = this._newattr(qname), isnew = !0;
      else if (Array.isArray(attr))
        attr = attr[0];
      if (attr.value = value, this._attributes)
        this._attributes[qname] = attr;
      if (isnew && this._newattrhook)
        this._newattrhook(qname, value);
    } },
    setAttribute: { value: function(qname, value) {
      if (qname = String(qname), !xml.isValidName(qname))
        utils.InvalidCharacterError();
      if (/[A-Z]/.test(qname) && this.isHTML)
        qname = utils.toASCIILowerCase(qname);
      this._setAttribute(qname, String(value));
    } },
    _setAttributeNS: { value: function(ns, qname, value) {
      var pos = qname.indexOf(":"), prefix, lname;
      if (pos < 0)
        prefix = null, lname = qname;
      else
        prefix = qname.substring(0, pos), lname = qname.substring(pos + 1);
      if (ns === "" || ns === void 0)
        ns = null;
      var key3 = (ns === null ? "" : ns) + "|" + lname, attr = this._attrsByLName[key3], isnew;
      if (!attr) {
        if (attr = new Attr3(this, lname, prefix, ns), isnew = !0, this._attrsByLName[key3] = attr, this._attributes)
          this._attributes[this._attrKeys.length] = attr;
        this._attrKeys.push(key3), this._addQName(attr);
      }
      if (attr.value = value, isnew && this._newattrhook)
        this._newattrhook(qname, value);
    } },
    setAttributeNS: { value: function(ns, qname, value) {
      if (ns = ns === null || ns === void 0 || ns === "" ? null : String(ns), qname = String(qname), !xml.isValidQName(qname))
        utils.InvalidCharacterError();
      var pos = qname.indexOf(":"), prefix = pos < 0 ? null : qname.substring(0, pos);
      if (prefix !== null && ns === null || prefix === "xml" && ns !== NAMESPACE.XML || (qname === "xmlns" || prefix === "xmlns") && ns !== NAMESPACE.XMLNS || ns === NAMESPACE.XMLNS && !(qname === "xmlns" || prefix === "xmlns"))
        utils.NamespaceError();
      this._setAttributeNS(ns, qname, String(value));
    } },
    setAttributeNode: { value: function(attr) {
      if (attr.ownerElement !== null && attr.ownerElement !== this)
        throw new DOMException2(DOMException2.INUSE_ATTRIBUTE_ERR);
      var result = null, oldAttrs = this._attrsByQName[attr.name];
      if (oldAttrs) {
        if (!Array.isArray(oldAttrs))
          oldAttrs = [oldAttrs];
        if (oldAttrs.some(function(a2) {
          return a2 === attr;
        }))
          return attr;
        else if (attr.ownerElement !== null)
          throw new DOMException2(DOMException2.INUSE_ATTRIBUTE_ERR);
        oldAttrs.forEach(function(a2) {
          this.removeAttributeNode(a2);
        }, this), result = oldAttrs[0];
      }
      return this.setAttributeNodeNS(attr), result;
    } },
    setAttributeNodeNS: { value: function(attr) {
      if (attr.ownerElement !== null)
        throw new DOMException2(DOMException2.INUSE_ATTRIBUTE_ERR);
      var ns = attr.namespaceURI, key3 = (ns === null ? "" : ns) + "|" + attr.localName, oldAttr = this._attrsByLName[key3];
      if (oldAttr)
        this.removeAttributeNode(oldAttr);
      if (attr._setOwnerElement(this), this._attrsByLName[key3] = attr, this._attributes)
        this._attributes[this._attrKeys.length] = attr;
      if (this._attrKeys.push(key3), this._addQName(attr), this._newattrhook)
        this._newattrhook(attr.name, attr.value);
      return oldAttr || null;
    } },
    removeAttribute: { value: function(qname) {
      if (qname = String(qname), /[A-Z]/.test(qname) && this.isHTML)
        qname = utils.toASCIILowerCase(qname);
      var attr = this._attrsByQName[qname];
      if (!attr)
        return;
      if (Array.isArray(attr))
        if (attr.length > 2)
          attr = attr.shift();
        else
          this._attrsByQName[qname] = attr[1], attr = attr[0];
      else
        this._attrsByQName[qname] = void 0;
      var ns = attr.namespaceURI, key3 = (ns === null ? "" : ns) + "|" + attr.localName;
      this._attrsByLName[key3] = void 0;
      var i5 = this._attrKeys.indexOf(key3);
      if (this._attributes)
        Array.prototype.splice.call(this._attributes, i5, 1), this._attributes[qname] = void 0;
      this._attrKeys.splice(i5, 1);
      var onchange = attr.onchange;
      if (attr._setOwnerElement(null), onchange)
        onchange.call(attr, this, attr.localName, attr.value, null);
      if (this.rooted)
        this.ownerDocument.mutateRemoveAttr(attr);
    } },
    removeAttributeNS: { value: function(ns, lname) {
      ns = ns === void 0 || ns === null ? "" : String(ns), lname = String(lname);
      var key3 = ns + "|" + lname, attr = this._attrsByLName[key3];
      if (!attr)
        return;
      this._attrsByLName[key3] = void 0;
      var i5 = this._attrKeys.indexOf(key3);
      if (this._attributes)
        Array.prototype.splice.call(this._attributes, i5, 1);
      this._attrKeys.splice(i5, 1), this._removeQName(attr);
      var onchange = attr.onchange;
      if (attr._setOwnerElement(null), onchange)
        onchange.call(attr, this, attr.localName, attr.value, null);
      if (this.rooted)
        this.ownerDocument.mutateRemoveAttr(attr);
    } },
    removeAttributeNode: { value: function(attr) {
      var ns = attr.namespaceURI, key3 = (ns === null ? "" : ns) + "|" + attr.localName;
      if (this._attrsByLName[key3] !== attr)
        utils.NotFoundError();
      return this.removeAttributeNS(ns, attr.localName), attr;
    } },
    getAttributeNames: { value: function() {
      var elt = this;
      return this._attrKeys.map(function(key3) {
        return elt._attrsByLName[key3].name;
      });
    } },
    _getattr: { value: function(qname) {
      var attr = this._attrsByQName[qname];
      return attr ? attr.value : null;
    } },
    _setattr: { value: function(qname, value) {
      var attr = this._attrsByQName[qname], isnew;
      if (!attr)
        attr = this._newattr(qname), isnew = !0;
      if (attr.value = String(value), this._attributes)
        this._attributes[qname] = attr;
      if (isnew && this._newattrhook)
        this._newattrhook(qname, value);
    } },
    _newattr: { value: function(qname) {
      var attr = new Attr3(this, qname, null, null), key3 = "|" + qname;
      if (this._attrsByQName[qname] = attr, this._attrsByLName[key3] = attr, this._attributes)
        this._attributes[this._attrKeys.length] = attr;
      return this._attrKeys.push(key3), attr;
    } },
    _addQName: { value: function(attr) {
      var qname = attr.name, existing = this._attrsByQName[qname];
      if (!existing)
        this._attrsByQName[qname] = attr;
      else if (Array.isArray(existing))
        existing.push(attr);
      else
        this._attrsByQName[qname] = [existing, attr];
      if (this._attributes)
        this._attributes[qname] = attr;
    } },
    _removeQName: { value: function(attr) {
      var qname = attr.name, target = this._attrsByQName[qname];
      if (Array.isArray(target)) {
        var idx = target.indexOf(attr);
        if (utils.assert(idx !== -1), target.length === 2) {
          if (this._attrsByQName[qname] = target[1 - idx], this._attributes)
            this._attributes[qname] = this._attrsByQName[qname];
        } else if (target.splice(idx, 1), this._attributes && this._attributes[qname] === attr)
          this._attributes[qname] = target[0];
      } else if (utils.assert(target === attr), this._attrsByQName[qname] = void 0, this._attributes)
        this._attributes[qname] = void 0;
    } },
    _numattrs: { get: function() {
      return this._attrKeys.length;
    } },
    _attr: { value: function(n5) {
      return this._attrsByLName[this._attrKeys[n5]];
    } },
    id: attributes2.property({ name: "id" }),
    className: attributes2.property({ name: "class" }),
    classList: { get: function() {
      var self2 = this;
      if (this._classList)
        return this._classList;
      var dtlist = new DOMTokenList2(function() {
        return self2.className || "";
      }, function(v2) {
        self2.className = v2;
      });
      return this._classList = dtlist, dtlist;
    }, set: function(v2) {
      this.className = v2;
    } },
    matches: { value: function(selector) {
      return select2.matches(this, selector);
    } },
    closest: { value: function(selector) {
      var el = this;
      do {
        if (el.matches && el.matches(selector))
          return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === Node5.ELEMENT_NODE);
      return null;
    } },
    querySelector: { value: function(selector) {
      return select2(selector, this)[0];
    } },
    querySelectorAll: { value: function(selector) {
      var nodes = select2(selector, this);
      return nodes.item ? nodes : new NodeList2(nodes);
    } }
  });
  Object.defineProperties(Element4.prototype, ChildNode);
  Object.defineProperties(Element4.prototype, NonDocumentTypeChildNode);
  attributes2.registerChangeHandler(Element4, "id", function(element, lname, oldval, newval) {
    if (element.rooted) {
      if (oldval)
        element.ownerDocument.delId(oldval, element);
      if (newval)
        element.ownerDocument.addId(newval, element);
    }
  });
  attributes2.registerChangeHandler(Element4, "class", function(element, lname, oldval, newval) {
    if (element._classList)
      element._classList._update();
  });
  function Attr3(elt, lname, prefix, namespace, value) {
    this.localName = lname, this.prefix = prefix === null || prefix === "" ? null : "" + prefix, this.namespaceURI = namespace === null || namespace === "" ? null : "" + namespace, this.data = value, this._setOwnerElement(elt);
  }
  Attr3.prototype = Object.create(Object.prototype, {
    ownerElement: {
      get: function() {
        return this._ownerElement;
      }
    },
    _setOwnerElement: { value: function(elt) {
      if (this._ownerElement = elt, this.prefix === null && this.namespaceURI === null && elt)
        this.onchange = elt._attributeChangeHandlers[this.localName];
      else
        this.onchange = null;
    } },
    name: { get: function() {
      return this.prefix ? this.prefix + ":" + this.localName : this.localName;
    } },
    specified: { get: function() {
      return !0;
    } },
    value: {
      get: function() {
        return this.data;
      },
      set: function(value) {
        var oldval = this.data;
        if (value = value === void 0 ? "" : value + "", value === oldval)
          return;
        if (this.data = value, this.ownerElement) {
          if (this.onchange)
            this.onchange(this.ownerElement, this.localName, oldval, value);
          if (this.ownerElement.rooted)
            this.ownerElement.ownerDocument.mutateAttr(this, oldval);
        }
      }
    },
    cloneNode: { value: function(deep) {
      return new Attr3(null, this.localName, this.prefix, this.namespaceURI, this.data);
    } },
    nodeType: { get: function() {
      return Node5.ATTRIBUTE_NODE;
    } },
    nodeName: { get: function() {
      return this.name;
    } },
    nodeValue: {
      get: function() {
        return this.value;
      },
      set: function(v2) {
        this.value = v2;
      }
    },
    textContent: {
      get: function() {
        return this.value;
      },
      set: function(v2) {
        if (v2 === null || v2 === void 0)
          v2 = "";
        this.value = v2;
      }
    },
    innerText: {
      get: function() {
        return this.value;
      },
      set: function(v2) {
        if (v2 === null || v2 === void 0)
          v2 = "";
        this.value = v2;
      }
    }
  });
  Element4._Attr = Attr3;
  function AttributesArray(elt) {
    NamedNodeMap2.call(this, elt);
    for (var name3 in elt._attrsByQName)
      this[name3] = elt._attrsByQName[name3];
    for (var i5 = 0;i5 < elt._attrKeys.length; i5++)
      this[i5] = elt._attrsByLName[elt._attrKeys[i5]];
  }
  AttributesArray.prototype = Object.create(NamedNodeMap2.prototype, {
    length: { get: function() {
      return this.element._attrKeys.length;
    }, set: function() {} },
    item: { value: function(n5) {
      if (n5 = n5 >>> 0, n5 >= this.length)
        return null;
      return this.element._attrsByLName[this.element._attrKeys[n5]];
    } }
  });
  if (globalThis.Symbol?.iterator)
    AttributesArray.prototype[globalThis.Symbol.iterator] = function() {
      var i5 = 0, n5 = this.length, self2 = this;
      return {
        next: function() {
          if (i5 < n5)
            return { value: self2.item(i5++) };
          return { done: !0 };
        }
      };
    };
  function ChildrenCollection(e) {
    this.element = e, this.updateCache();
  }
  ChildrenCollection.prototype = Object.create(Object.prototype, {
    length: { get: function() {
      return this.updateCache(), this.childrenByNumber.length;
    } },
    item: { value: function(n5) {
      return this.updateCache(), this.childrenByNumber[n5] || null;
    } },
    namedItem: { value: function(name3) {
      return this.updateCache(), this.childrenByName[name3] || null;
    } },
    namedItems: { get: function() {
      return this.updateCache(), this.childrenByName;
    } },
    updateCache: { value: function() {
      var namedElts = /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
      if (this.lastModTime !== this.element.lastModTime) {
        this.lastModTime = this.element.lastModTime;
        var n5 = this.childrenByNumber && this.childrenByNumber.length || 0;
        for (var i5 = 0;i5 < n5; i5++)
          this[i5] = void 0;
        this.childrenByNumber = [], this.childrenByName = Object.create(null);
        for (var c3 = this.element.firstChild;c3 !== null; c3 = c3.nextSibling)
          if (c3.nodeType === Node5.ELEMENT_NODE) {
            this[this.childrenByNumber.length] = c3, this.childrenByNumber.push(c3);
            var id = c3.getAttribute("id");
            if (id && !this.childrenByName[id])
              this.childrenByName[id] = c3;
            var name3 = c3.getAttribute("name");
            if (name3 && this.element.namespaceURI === NAMESPACE.HTML && namedElts.test(this.element.localName) && !this.childrenByName[name3])
              this.childrenByName[id] = c3;
          }
      }
    } }
  });
  function localNameElementFilter(lname) {
    return function(e) {
      return e.localName === lname;
    };
  }
  function htmlLocalNameElementFilter(lname) {
    var lclname = utils.toASCIILowerCase(lname);
    if (lclname === lname)
      return localNameElementFilter(lname);
    return function(e) {
      return e.isHTML ? e.localName === lclname : e.localName === lname;
    };
  }
  function namespaceElementFilter(ns) {
    return function(e) {
      return e.namespaceURI === ns;
    };
  }
  function namespaceLocalNameElementFilter(ns, lname) {
    return function(e) {
      return e.namespaceURI === ns && e.localName === lname;
    };
  }
  function classNamesElementFilter(names) {
    return function(e) {
      return names.every(function(n5) {
        return e.classList.contains(n5);
      });
    };
  }
  function elementNameFilter(name3) {
    return function(e) {
      if (e.namespaceURI !== NAMESPACE.HTML)
        return !1;
      return e.getAttribute("name") === name3;
    };
  }
});
