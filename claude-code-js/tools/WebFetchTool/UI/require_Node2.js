// var: require_Node2
var require_Node2 = __commonJS((exports, module) => {
  module.exports = Node5;
  var EventTarget2 = require_EventTarget(), LinkedList = require_LinkedList(), NodeUtils = require_NodeUtils(), utils = require_utils12();
  function Node5() {
    EventTarget2.call(this), this.parentNode = null, this._nextSibling = this._previousSibling = this, this._index = void 0;
  }
  var ELEMENT_NODE2 = Node5.ELEMENT_NODE = 1, ATTRIBUTE_NODE2 = Node5.ATTRIBUTE_NODE = 2, TEXT_NODE2 = Node5.TEXT_NODE = 3, CDATA_SECTION_NODE2 = Node5.CDATA_SECTION_NODE = 4, ENTITY_REFERENCE_NODE = Node5.ENTITY_REFERENCE_NODE = 5, ENTITY_NODE = Node5.ENTITY_NODE = 6, PROCESSING_INSTRUCTION_NODE = Node5.PROCESSING_INSTRUCTION_NODE = 7, COMMENT_NODE2 = Node5.COMMENT_NODE = 8, DOCUMENT_NODE2 = Node5.DOCUMENT_NODE = 9, DOCUMENT_TYPE_NODE2 = Node5.DOCUMENT_TYPE_NODE = 10, DOCUMENT_FRAGMENT_NODE2 = Node5.DOCUMENT_FRAGMENT_NODE = 11, NOTATION_NODE = Node5.NOTATION_NODE = 12, DOCUMENT_POSITION_DISCONNECTED2 = Node5.DOCUMENT_POSITION_DISCONNECTED = 1, DOCUMENT_POSITION_PRECEDING2 = Node5.DOCUMENT_POSITION_PRECEDING = 2, DOCUMENT_POSITION_FOLLOWING2 = Node5.DOCUMENT_POSITION_FOLLOWING = 4, DOCUMENT_POSITION_CONTAINS2 = Node5.DOCUMENT_POSITION_CONTAINS = 8, DOCUMENT_POSITION_CONTAINED_BY2 = Node5.DOCUMENT_POSITION_CONTAINED_BY = 16, DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC2 = Node5.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
  Node5.prototype = Object.create(EventTarget2.prototype, {
    baseURI: { get: utils.nyi },
    parentElement: { get: function() {
      return this.parentNode && this.parentNode.nodeType === ELEMENT_NODE2 ? this.parentNode : null;
    } },
    hasChildNodes: { value: utils.shouldOverride },
    firstChild: { get: utils.shouldOverride },
    lastChild: { get: utils.shouldOverride },
    isConnected: {
      get: function() {
        let node2 = this;
        while (node2 != null) {
          if (node2.nodeType === Node5.DOCUMENT_NODE)
            return !0;
          if (node2 = node2.parentNode, node2 != null && node2.nodeType === Node5.DOCUMENT_FRAGMENT_NODE)
            node2 = node2.host;
        }
        return !1;
      }
    },
    previousSibling: { get: function() {
      var parent2 = this.parentNode;
      if (!parent2)
        return null;
      if (this === parent2.firstChild)
        return null;
      return this._previousSibling;
    } },
    nextSibling: { get: function() {
      var parent2 = this.parentNode, next = this._nextSibling;
      if (!parent2)
        return null;
      if (next === parent2.firstChild)
        return null;
      return next;
    } },
    textContent: {
      get: function() {
        return null;
      },
      set: function(v2) {}
    },
    innerText: {
      get: function() {
        return null;
      },
      set: function(v2) {}
    },
    _countChildrenOfType: { value: function(type) {
      var sum = 0;
      for (var kid = this.firstChild;kid !== null; kid = kid.nextSibling)
        if (kid.nodeType === type)
          sum++;
      return sum;
    } },
    _ensureInsertValid: { value: function(node2, child, isPreinsert) {
      var parent2 = this, i5, kid;
      if (!node2.nodeType)
        throw TypeError("not a node");
      switch (parent2.nodeType) {
        case DOCUMENT_NODE2:
        case DOCUMENT_FRAGMENT_NODE2:
        case ELEMENT_NODE2:
          break;
        default:
          utils.HierarchyRequestError();
      }
      if (node2.isAncestor(parent2))
        utils.HierarchyRequestError();
      if (child !== null || !isPreinsert) {
        if (child.parentNode !== parent2)
          utils.NotFoundError();
      }
      switch (node2.nodeType) {
        case DOCUMENT_FRAGMENT_NODE2:
        case DOCUMENT_TYPE_NODE2:
        case ELEMENT_NODE2:
        case TEXT_NODE2:
        case PROCESSING_INSTRUCTION_NODE:
        case COMMENT_NODE2:
          break;
        default:
          utils.HierarchyRequestError();
      }
      if (parent2.nodeType === DOCUMENT_NODE2)
        switch (node2.nodeType) {
          case TEXT_NODE2:
            utils.HierarchyRequestError();
            break;
          case DOCUMENT_FRAGMENT_NODE2:
            if (node2._countChildrenOfType(TEXT_NODE2) > 0)
              utils.HierarchyRequestError();
            switch (node2._countChildrenOfType(ELEMENT_NODE2)) {
              case 0:
                break;
              case 1:
                if (child !== null) {
                  if (isPreinsert && child.nodeType === DOCUMENT_TYPE_NODE2)
                    utils.HierarchyRequestError();
                  for (kid = child.nextSibling;kid !== null; kid = kid.nextSibling)
                    if (kid.nodeType === DOCUMENT_TYPE_NODE2)
                      utils.HierarchyRequestError();
                }
                if (i5 = parent2._countChildrenOfType(ELEMENT_NODE2), isPreinsert) {
                  if (i5 > 0)
                    utils.HierarchyRequestError();
                } else if (i5 > 1 || i5 === 1 && child.nodeType !== ELEMENT_NODE2)
                  utils.HierarchyRequestError();
                break;
              default:
                utils.HierarchyRequestError();
            }
            break;
          case ELEMENT_NODE2:
            if (child !== null) {
              if (isPreinsert && child.nodeType === DOCUMENT_TYPE_NODE2)
                utils.HierarchyRequestError();
              for (kid = child.nextSibling;kid !== null; kid = kid.nextSibling)
                if (kid.nodeType === DOCUMENT_TYPE_NODE2)
                  utils.HierarchyRequestError();
            }
            if (i5 = parent2._countChildrenOfType(ELEMENT_NODE2), isPreinsert) {
              if (i5 > 0)
                utils.HierarchyRequestError();
            } else if (i5 > 1 || i5 === 1 && child.nodeType !== ELEMENT_NODE2)
              utils.HierarchyRequestError();
            break;
          case DOCUMENT_TYPE_NODE2:
            if (child === null) {
              if (parent2._countChildrenOfType(ELEMENT_NODE2))
                utils.HierarchyRequestError();
            } else
              for (kid = parent2.firstChild;kid !== null; kid = kid.nextSibling) {
                if (kid === child)
                  break;
                if (kid.nodeType === ELEMENT_NODE2)
                  utils.HierarchyRequestError();
              }
            if (i5 = parent2._countChildrenOfType(DOCUMENT_TYPE_NODE2), isPreinsert) {
              if (i5 > 0)
                utils.HierarchyRequestError();
            } else if (i5 > 1 || i5 === 1 && child.nodeType !== DOCUMENT_TYPE_NODE2)
              utils.HierarchyRequestError();
            break;
        }
      else if (node2.nodeType === DOCUMENT_TYPE_NODE2)
        utils.HierarchyRequestError();
    } },
    insertBefore: { value: function(node2, child) {
      var parent2 = this;
      parent2._ensureInsertValid(node2, child, !0);
      var refChild = child;
      if (refChild === node2)
        refChild = node2.nextSibling;
      return parent2.doc.adoptNode(node2), node2._insertOrReplace(parent2, refChild, !1), node2;
    } },
    appendChild: { value: function(child) {
      return this.insertBefore(child, null);
    } },
    _appendChild: { value: function(child) {
      child._insertOrReplace(this, null, !1);
    } },
    removeChild: { value: function(child) {
      var parent2 = this;
      if (!child.nodeType)
        throw TypeError("not a node");
      if (child.parentNode !== parent2)
        utils.NotFoundError();
      return child.remove(), child;
    } },
    replaceChild: { value: function(node2, child) {
      var parent2 = this;
      if (parent2._ensureInsertValid(node2, child, !1), node2.doc !== parent2.doc)
        parent2.doc.adoptNode(node2);
      return node2._insertOrReplace(parent2, child, !0), child;
    } },
    contains: { value: function(node2) {
      if (node2 === null)
        return !1;
      if (this === node2)
        return !0;
      return (this.compareDocumentPosition(node2) & DOCUMENT_POSITION_CONTAINED_BY2) !== 0;
    } },
    compareDocumentPosition: { value: function(that) {
      if (this === that)
        return 0;
      if (this.doc !== that.doc || this.rooted !== that.rooted)
        return DOCUMENT_POSITION_DISCONNECTED2 + DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC2;
      var these = [], those = [];
      for (var n5 = this;n5 !== null; n5 = n5.parentNode)
        these.push(n5);
      for (n5 = that;n5 !== null; n5 = n5.parentNode)
        those.push(n5);
      if (these.reverse(), those.reverse(), these[0] !== those[0])
        return DOCUMENT_POSITION_DISCONNECTED2 + DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC2;
      n5 = Math.min(these.length, those.length);
      for (var i5 = 1;i5 < n5; i5++)
        if (these[i5] !== those[i5])
          if (these[i5].index < those[i5].index)
            return DOCUMENT_POSITION_FOLLOWING2;
          else
            return DOCUMENT_POSITION_PRECEDING2;
      if (these.length < those.length)
        return DOCUMENT_POSITION_FOLLOWING2 + DOCUMENT_POSITION_CONTAINED_BY2;
      else
        return DOCUMENT_POSITION_PRECEDING2 + DOCUMENT_POSITION_CONTAINS2;
    } },
    isSameNode: { value: function(node2) {
      return this === node2;
    } },
    isEqualNode: { value: function(node2) {
      if (!node2)
        return !1;
      if (node2.nodeType !== this.nodeType)
        return !1;
      if (!this.isEqual(node2))
        return !1;
      for (var c1 = this.firstChild, c22 = node2.firstChild;c1 && c22; c1 = c1.nextSibling, c22 = c22.nextSibling)
        if (!c1.isEqualNode(c22))
          return !1;
      return c1 === null && c22 === null;
    } },
    cloneNode: { value: function(deep) {
      var clone3 = this.clone();
      if (deep)
        for (var kid = this.firstChild;kid !== null; kid = kid.nextSibling)
          clone3._appendChild(kid.cloneNode(!0));
      return clone3;
    } },
    lookupPrefix: { value: function(ns) {
      var e;
      if (ns === "" || ns === null || ns === void 0)
        return null;
      switch (this.nodeType) {
        case ELEMENT_NODE2:
          return this._lookupNamespacePrefix(ns, this);
        case DOCUMENT_NODE2:
          return e = this.documentElement, e ? e.lookupPrefix(ns) : null;
        case ENTITY_NODE:
        case NOTATION_NODE:
        case DOCUMENT_FRAGMENT_NODE2:
        case DOCUMENT_TYPE_NODE2:
          return null;
        case ATTRIBUTE_NODE2:
          return e = this.ownerElement, e ? e.lookupPrefix(ns) : null;
        default:
          return e = this.parentElement, e ? e.lookupPrefix(ns) : null;
      }
    } },
    lookupNamespaceURI: { value: function(prefix) {
      if (prefix === "" || prefix === void 0)
        prefix = null;
      var e;
      switch (this.nodeType) {
        case ELEMENT_NODE2:
          return utils.shouldOverride();
        case DOCUMENT_NODE2:
          return e = this.documentElement, e ? e.lookupNamespaceURI(prefix) : null;
        case ENTITY_NODE:
        case NOTATION_NODE:
        case DOCUMENT_TYPE_NODE2:
        case DOCUMENT_FRAGMENT_NODE2:
          return null;
        case ATTRIBUTE_NODE2:
          return e = this.ownerElement, e ? e.lookupNamespaceURI(prefix) : null;
        default:
          return e = this.parentElement, e ? e.lookupNamespaceURI(prefix) : null;
      }
    } },
    isDefaultNamespace: { value: function(ns) {
      if (ns === "" || ns === void 0)
        ns = null;
      var defaultNamespace = this.lookupNamespaceURI(null);
      return defaultNamespace === ns;
    } },
    index: { get: function() {
      var parent2 = this.parentNode;
      if (this === parent2.firstChild)
        return 0;
      var kids = parent2.childNodes;
      if (this._index === void 0 || kids[this._index] !== this) {
        for (var i5 = 0;i5 < kids.length; i5++)
          kids[i5]._index = i5;
        utils.assert(kids[this._index] === this);
      }
      return this._index;
    } },
    isAncestor: { value: function(that) {
      if (this.doc !== that.doc)
        return !1;
      if (this.rooted !== that.rooted)
        return !1;
      for (var e = that;e; e = e.parentNode)
        if (e === this)
          return !0;
      return !1;
    } },
    ensureSameDoc: { value: function(that) {
      if (that.ownerDocument === null)
        that.ownerDocument = this.doc;
      else if (that.ownerDocument !== this.doc)
        utils.WrongDocumentError();
    } },
    removeChildren: { value: utils.shouldOverride },
    _insertOrReplace: { value: function(parent2, before2, isReplace) {
      var child = this, before_index, i5;
      if (child.nodeType === DOCUMENT_FRAGMENT_NODE2 && child.rooted)
        utils.HierarchyRequestError();
      if (parent2._childNodes) {
        if (before_index = before2 === null ? parent2._childNodes.length : before2.index, child.parentNode === parent2) {
          var child_index = child.index;
          if (child_index < before_index)
            before_index--;
        }
      }
      if (isReplace) {
        if (before2.rooted)
          before2.doc.mutateRemove(before2);
        before2.parentNode = null;
      }
      var n5 = before2;
      if (n5 === null)
        n5 = parent2.firstChild;
      var bothRooted = child.rooted && parent2.rooted;
      if (child.nodeType === DOCUMENT_FRAGMENT_NODE2) {
        var spliceArgs = [0, isReplace ? 1 : 0], next;
        for (var kid = child.firstChild;kid !== null; kid = next)
          next = kid.nextSibling, spliceArgs.push(kid), kid.parentNode = parent2;
        var len = spliceArgs.length;
        if (isReplace)
          LinkedList.replace(n5, len > 2 ? spliceArgs[2] : null);
        else if (len > 2 && n5 !== null)
          LinkedList.insertBefore(spliceArgs[2], n5);
        if (parent2._childNodes) {
          spliceArgs[0] = before2 === null ? parent2._childNodes.length : before2._index, parent2._childNodes.splice.apply(parent2._childNodes, spliceArgs);
          for (i5 = 2;i5 < len; i5++)
            spliceArgs[i5]._index = spliceArgs[0] + (i5 - 2);
        } else if (parent2._firstChild === before2) {
          if (len > 2)
            parent2._firstChild = spliceArgs[2];
          else if (isReplace)
            parent2._firstChild = null;
        }
        if (child._childNodes)
          child._childNodes.length = 0;
        else
          child._firstChild = null;
        if (parent2.rooted) {
          parent2.modify();
          for (i5 = 2;i5 < len; i5++)
            parent2.doc.mutateInsert(spliceArgs[i5]);
        }
      } else {
        if (before2 === child)
          return;
        if (bothRooted)
          child._remove();
        else if (child.parentNode)
          child.remove();
        if (child.parentNode = parent2, isReplace) {
          if (LinkedList.replace(n5, child), parent2._childNodes)
            child._index = before_index, parent2._childNodes[before_index] = child;
          else if (parent2._firstChild === before2)
            parent2._firstChild = child;
        } else {
          if (n5 !== null)
            LinkedList.insertBefore(child, n5);
          if (parent2._childNodes)
            child._index = before_index, parent2._childNodes.splice(before_index, 0, child);
          else if (parent2._firstChild === before2)
            parent2._firstChild = child;
        }
        if (bothRooted)
          parent2.modify(), parent2.doc.mutateMove(child);
        else if (parent2.rooted)
          parent2.modify(), parent2.doc.mutateInsert(child);
      }
    } },
    lastModTime: { get: function() {
      if (!this._lastModTime)
        this._lastModTime = this.doc.modclock;
      return this._lastModTime;
    } },
    modify: { value: function() {
      if (this.doc.modclock) {
        var time3 = ++this.doc.modclock;
        for (var n5 = this;n5; n5 = n5.parentElement)
          if (n5._lastModTime)
            n5._lastModTime = time3;
      }
    } },
    doc: { get: function() {
      return this.ownerDocument || this;
    } },
    rooted: { get: function() {
      return !!this._nid;
    } },
    normalize: { value: function() {
      var next;
      for (var child = this.firstChild;child !== null; child = next) {
        if (next = child.nextSibling, child.normalize)
          child.normalize();
        if (child.nodeType !== Node5.TEXT_NODE)
          continue;
        if (child.nodeValue === "") {
          this.removeChild(child);
          continue;
        }
        var prevChild = child.previousSibling;
        if (prevChild === null)
          continue;
        else if (prevChild.nodeType === Node5.TEXT_NODE)
          prevChild.appendData(child.nodeValue), this.removeChild(child);
      }
    } },
    serialize: { value: function() {
      if (this._innerHTML)
        return this._innerHTML;
      var s2 = "";
      for (var kid = this.firstChild;kid !== null; kid = kid.nextSibling)
        s2 += NodeUtils.serializeOne(kid, this);
      return s2;
    } },
    outerHTML: {
      get: function() {
        return NodeUtils.serializeOne(this, { nodeType: 0 });
      },
      set: utils.nyi
    },
    ELEMENT_NODE: { value: ELEMENT_NODE2 },
    ATTRIBUTE_NODE: { value: ATTRIBUTE_NODE2 },
    TEXT_NODE: { value: TEXT_NODE2 },
    CDATA_SECTION_NODE: { value: CDATA_SECTION_NODE2 },
    ENTITY_REFERENCE_NODE: { value: ENTITY_REFERENCE_NODE },
    ENTITY_NODE: { value: ENTITY_NODE },
    PROCESSING_INSTRUCTION_NODE: { value: PROCESSING_INSTRUCTION_NODE },
    COMMENT_NODE: { value: COMMENT_NODE2 },
    DOCUMENT_NODE: { value: DOCUMENT_NODE2 },
    DOCUMENT_TYPE_NODE: { value: DOCUMENT_TYPE_NODE2 },
    DOCUMENT_FRAGMENT_NODE: { value: DOCUMENT_FRAGMENT_NODE2 },
    NOTATION_NODE: { value: NOTATION_NODE },
    DOCUMENT_POSITION_DISCONNECTED: { value: DOCUMENT_POSITION_DISCONNECTED2 },
    DOCUMENT_POSITION_PRECEDING: { value: DOCUMENT_POSITION_PRECEDING2 },
    DOCUMENT_POSITION_FOLLOWING: { value: DOCUMENT_POSITION_FOLLOWING2 },
    DOCUMENT_POSITION_CONTAINS: { value: DOCUMENT_POSITION_CONTAINS2 },
    DOCUMENT_POSITION_CONTAINED_BY: { value: DOCUMENT_POSITION_CONTAINED_BY2 },
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC2 }
  });
});
