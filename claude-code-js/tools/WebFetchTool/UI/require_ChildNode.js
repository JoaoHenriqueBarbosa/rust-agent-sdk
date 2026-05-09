// var: require_ChildNode
var require_ChildNode = __commonJS((exports, module) => {
  var Node5 = require_Node2(), LinkedList = require_LinkedList(), createDocumentFragmentFromArguments = function(document2, args) {
    var docFrag = document2.createDocumentFragment();
    for (var i5 = 0;i5 < args.length; i5++) {
      var argItem = args[i5], isNode3 = argItem instanceof Node5;
      docFrag.appendChild(isNode3 ? argItem : document2.createTextNode(String(argItem)));
    }
    return docFrag;
  }, ChildNode = {
    after: { value: function() {
      var argArr = Array.prototype.slice.call(arguments), parentNode = this.parentNode, nextSibling2 = this.nextSibling;
      if (parentNode === null)
        return;
      while (nextSibling2 && argArr.some(function(v2) {
        return v2 === nextSibling2;
      }))
        nextSibling2 = nextSibling2.nextSibling;
      var docFrag = createDocumentFragmentFromArguments(this.doc, argArr);
      parentNode.insertBefore(docFrag, nextSibling2);
    } },
    before: { value: function() {
      var argArr = Array.prototype.slice.call(arguments), parentNode = this.parentNode, prevSibling = this.previousSibling;
      if (parentNode === null)
        return;
      while (prevSibling && argArr.some(function(v2) {
        return v2 === prevSibling;
      }))
        prevSibling = prevSibling.previousSibling;
      var docFrag = createDocumentFragmentFromArguments(this.doc, argArr), nextSibling2 = prevSibling ? prevSibling.nextSibling : parentNode.firstChild;
      parentNode.insertBefore(docFrag, nextSibling2);
    } },
    remove: { value: function() {
      if (this.parentNode === null)
        return;
      if (this.doc) {
        if (this.doc._preremoveNodeIterators(this), this.rooted)
          this.doc.mutateRemove(this);
      }
      this._remove(), this.parentNode = null;
    } },
    _remove: { value: function() {
      var parent2 = this.parentNode;
      if (parent2 === null)
        return;
      if (parent2._childNodes)
        parent2._childNodes.splice(this.index, 1);
      else if (parent2._firstChild === this)
        if (this._nextSibling === this)
          parent2._firstChild = null;
        else
          parent2._firstChild = this._nextSibling;
      LinkedList.remove(this), parent2.modify();
    } },
    replaceWith: { value: function() {
      var argArr = Array.prototype.slice.call(arguments), parentNode = this.parentNode, nextSibling2 = this.nextSibling;
      if (parentNode === null)
        return;
      while (nextSibling2 && argArr.some(function(v2) {
        return v2 === nextSibling2;
      }))
        nextSibling2 = nextSibling2.nextSibling;
      var docFrag = createDocumentFragmentFromArguments(this.doc, argArr);
      if (this.parentNode === parentNode)
        parentNode.replaceChild(docFrag, this);
      else
        parentNode.insertBefore(docFrag, nextSibling2);
    } }
  };
  module.exports = ChildNode;
});
